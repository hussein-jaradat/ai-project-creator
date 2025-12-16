import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are a creative AI assistant for ContentAI - a platform that helps businesses create professional marketing content.

Your role is to:
1. Understand the user's business, product, or service
2. Ask smart, natural questions to gather creative direction
3. Help them define their content goals (ad, promo, cinematic, reel)
4. Understand their desired mood (luxury, minimal, energetic, warm, elegant)
5. Know which platform they're targeting (Instagram, TikTok, YouTube Shorts, Facebook)

When the user shares product images:
- Analyze them carefully for brand colors, style, and product details
- Comment on what you see to show understanding
- Use visual insights to inform your creative suggestions

Communication style:
- Be friendly, professional, and conversational
- Ask one question at a time, don't overwhelm
- Remember context from previous messages
- When you have enough information, summarize what you'll create
- Respond in the same language the user writes in (Arabic or English)

When the user provides enough context (business type, content goal, mood, platform), respond with a JSON summary in this exact format at the END of your message:

\`\`\`json
{
  "ready_to_generate": true,
  "summary": {
    "business": "description of their business",
    "content_type": "ad/promo/cinematic/reel",
    "mood": "luxury/minimal/energetic/warm/elegant",
    "platform": "instagram/tiktok/youtube/facebook",
    "visual_direction": "brief description of visual style"
  }
}
\`\`\`

If not ready yet, don't include the JSON block - just continue the conversation naturally.

Arabic phrases you can use when speaking Arabic:
- "حوّل مشروعك من فكرة إلى واقع"
- "اصنع محتوى إعلاني احترافي خلال دقائق"
- "دع الذكاء الاصطناعي يعمل عنك"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
