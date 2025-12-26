import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentAnalyzerRequest {
  researchResults: any[];
  targetPlatform?: string;
  contentStyle?: string;
}

const ANALYSIS_SYSTEM_PROMPT = `أنت محلل محتوى متخصص في الفيديوهات الفايرال على منصات التواصل الاجتماعي.

مهمتك:
1. تحليل أوصاف الفيديوهات الناجحة المقدمة لك
2. استخراج العناصر المشتركة التي تجعلها فايرال
3. توليد 3-5 أفكار جديدة ومبتكرة بناءً على التحليل
4. إنشاء برومبتات احترافية جاهزة لتوليد فيديو بالذكاء الاصطناعي

لكل فكرة، قدم:
- العنوان
- الوصف المختصر
- لماذا ستنجح (العناصر الفايرال)
- برومبت التوليد الكامل
- الكابشن المقترح
- الهاشتاقات

أجب بصيغة JSON فقط.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { researchResults, targetPlatform, contentStyle } = await req.json() as ContentAnalyzerRequest;

    if (!researchResults || researchResults.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No research results provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare content for analysis
    const contentSummary = researchResults.slice(0, 10).map((item, idx) => {
      return `
${idx + 1}. المنصة: ${item.platform || 'غير محدد'}
   العنوان: ${item.title || 'بدون عنوان'}
   الوصف: ${item.description || 'بدون وصف'}
   الرابط: ${item.url || ''}
   المحتوى: ${(item.markdown || '').substring(0, 500)}...
`;
    }).join('\n');

    const userPrompt = `حلل المحتوى الفايرال التالي واستخرج أفكار جديدة:

${contentSummary}

المنصة المستهدفة: ${targetPlatform || 'جميع المنصات'}
أسلوب المحتوى: ${contentStyle || 'إبداعي وجذاب'}

أجب بصيغة JSON كالتالي:
{
  "analysis": {
    "commonElements": ["عنصر 1", "عنصر 2"],
    "successFactors": ["عامل 1", "عامل 2"],
    "trends": ["ترند 1", "ترند 2"]
  },
  "ideas": [
    {
      "id": "1",
      "title": "عنوان الفكرة",
      "description": "وصف مختصر",
      "viralFactors": ["عامل 1", "عامل 2"],
      "generationPrompt": "برومبت كامل لتوليد الفيديو بالانجليزي",
      "suggestedCaption": "كابشن مقترح بالعربي",
      "hashtags": ["#هاشتاق1", "#هاشتاق2"],
      "estimatedEngagement": "high/medium/low"
    }
  ]
}`;

    console.log('Calling AI for content analysis...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';

    console.log('AI response received, parsing...');

    // Extract JSON from response
    let analysisResult;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a structured fallback
      analysisResult = {
        analysis: {
          commonElements: ['AI generated content', 'Creative visuals'],
          successFactors: ['Trending topics', 'High quality'],
          trends: ['AI art', 'Viral challenges']
        },
        ideas: [{
          id: '1',
          title: 'Creative AI Video',
          description: 'A trending AI-generated video concept',
          viralFactors: ['Novel concept', 'High engagement potential'],
          generationPrompt: 'Create a stunning cinematic AI video with vibrant colors and dynamic motion',
          suggestedCaption: 'شاهد هذا الفيديو المذهل! 🔥',
          hashtags: ['#AI', '#Viral', '#Trending'],
          estimatedEngagement: 'high'
        }]
      };
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...analysisResult,
        meta: {
          analyzedCount: researchResults.length,
          targetPlatform,
          analyzedAt: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Content analyzer error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
