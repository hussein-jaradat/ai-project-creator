import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutoGenerateRequest {
  jobId: string;
  idea: {
    id: string;
    title: string;
    generationPrompt: string;
    suggestedCaption: string;
    hashtags: string[];
  };
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { jobId, idea, userId } = await req.json() as AutoGenerateRequest;

    if (!jobId || !idea || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting auto-generation for job ${jobId}`);

    // Update job status to generating
    await supabase
      .from('automation_jobs')
      .update({ 
        status: 'generating',
        selected_idea: idea,
        generated_prompt: idea.generationPrompt
      })
      .eq('id', jobId);

    // Step 1: Call prompt-engineer to enhance the prompt
    console.log('Enhancing prompt...');
    const promptEngineerResponse = await fetch(`${supabaseUrl}/functions/v1/prompt-engineer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        userPrompt: idea.generationPrompt,
        contentType: 'video',
        platform: 'tiktok',
        mood: 'energetic',
      }),
    });

    let enhancedPrompt = idea.generationPrompt;
    if (promptEngineerResponse.ok) {
      const promptData = await promptEngineerResponse.json();
      if (promptData.enhancedPrompt) {
        enhancedPrompt = promptData.enhancedPrompt;
        console.log('Prompt enhanced successfully');
      }
    }

    // Step 2: Generate the video
    console.log('Generating video...');
    const generateVideoResponse = await fetch(`${supabaseUrl}/functions/v1/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        duration: 5,
        aspectRatio: '9:16', // Vertical for social media
      }),
    });

    if (!generateVideoResponse.ok) {
      const error = await generateVideoResponse.text();
      console.error('Video generation failed:', error);
      
      await supabase
        .from('automation_jobs')
        .update({ 
          status: 'failed',
          error_message: 'Video generation failed: ' + error
        })
        .eq('id', jobId);

      return new Response(
        JSON.stringify({ success: false, error: 'Video generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const videoData = await generateVideoResponse.json();
    const videoUrl = videoData.videoUrl || videoData.operationName;

    console.log('Video generation initiated:', videoUrl);

    // Step 3: Generate caption
    const fullCaption = `${idea.suggestedCaption}\n\n${idea.hashtags.join(' ')}`;

    // Update job with results
    await supabase
      .from('automation_jobs')
      .update({ 
        status: 'completed',
        generated_prompt: enhancedPrompt,
        generated_video_url: videoUrl,
        generated_caption: fullCaption,
      })
      .eq('id', jobId);

    // Step 4: If webhook is configured, send notification
    const { data: settings } = await supabase
      .from('automation_settings')
      .select('webhook_url, auto_publish')
      .eq('user_id', userId)
      .single();

    if (settings?.webhook_url && settings?.auto_publish) {
      console.log('Sending to webhook for publishing...');
      
      try {
        await fetch(settings.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'content_ready',
            jobId,
            videoUrl,
            caption: fullCaption,
            idea,
            timestamp: new Date().toISOString()
          }),
        });

        await supabase
          .from('automation_jobs')
          .update({ 
            status: 'publishing',
            publish_status: { sent_to_webhook: true, sent_at: new Date().toISOString() }
          })
          .eq('id', jobId);

      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        videoUrl,
        caption: fullCaption,
        enhancedPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auto-generate error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
