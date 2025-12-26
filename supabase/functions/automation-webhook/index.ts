import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookRequest {
  jobId: string;
  action: 'publish' | 'test' | 'status';
  platforms?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { jobId, action, platforms } = await req.json() as WebhookRequest;

    if (action === 'test') {
      // Test webhook connectivity
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ success: false, error: 'Not authenticated' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid token' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user's webhook URL
      const { data: settings } = await supabase
        .from('automation_settings')
        .select('webhook_url')
        .eq('user_id', user.id)
        .single();

      if (!settings?.webhook_url) {
        return new Response(
          JSON.stringify({ success: false, error: 'No webhook URL configured' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Test the webhook
      try {
        const testResponse = await fetch(settings.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'test',
            message: 'OBrain webhook test',
            timestamp: new Date().toISOString()
          }),
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Webhook test sent',
            webhookStatus: testResponse.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (webhookError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Webhook unreachable',
            details: webhookError instanceof Error ? webhookError.message : 'Unknown error'
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'publish') {
      if (!jobId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Job ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get job details
      const { data: job, error: jobError } = await supabase
        .from('automation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError || !job) {
        return new Response(
          JSON.stringify({ success: false, error: 'Job not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get user's webhook URL
      const { data: settings } = await supabase
        .from('automation_settings')
        .select('webhook_url')
        .eq('user_id', job.user_id)
        .single();

      const webhookUrl = job.webhook_url || settings?.webhook_url;

      if (!webhookUrl) {
        return new Response(
          JSON.stringify({ success: false, error: 'No webhook URL configured' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send to webhook for publishing
      console.log(`Publishing job ${jobId} to webhook...`);

      const targetPlatforms = platforms || job.target_platforms || ['tiktok', 'instagram', 'youtube'];

      const webhookPayload = {
        event: 'publish_content',
        jobId: job.id,
        content: {
          videoUrl: job.generated_video_url,
          caption: job.generated_caption,
          prompt: job.generated_prompt,
          idea: job.selected_idea
        },
        platforms: targetPlatforms,
        timestamp: new Date().toISOString()
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        });

        // Update job status
        await supabase
          .from('automation_jobs')
          .update({ 
            status: 'publishing',
            publish_status: { 
              sent: true, 
              sent_at: new Date().toISOString(),
              platforms: targetPlatforms,
              webhook_response: response.status
            }
          })
          .eq('id', jobId);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Content sent for publishing',
            platforms: targetPlatforms
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (webhookError) {
        console.error('Webhook publish failed:', webhookError);
        
        await supabase
          .from('automation_jobs')
          .update({ 
            status: 'failed',
            error_message: 'Webhook publish failed: ' + (webhookError instanceof Error ? webhookError.message : 'Unknown error')
          })
          .eq('id', jobId);

        return new Response(
          JSON.stringify({ success: false, error: 'Webhook publish failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (action === 'status') {
      if (!jobId) {
        return new Response(
          JSON.stringify({ success: false, error: 'Job ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: job } = await supabase
        .from('automation_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      return new Response(
        JSON.stringify({ success: true, job }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Automation webhook error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
