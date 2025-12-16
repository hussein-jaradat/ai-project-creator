import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, tone, mood, platform, brandStyle } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const tonePrompts: Record<string, string> = {
      marketing: "تسويقي، مقنع، يدفع للشراء",
      creative: "إبداعي، فني، ملهم",
      emotional: "عاطفي، مؤثر، يلمس المشاعر",
      concise: "مختصر، قوي، مباشر",
    };

    const moodArabic: Record<string, string> = {
      luxury: "فاخر",
      minimal: "بسيط",
      energetic: "حيوي",
      warm: "دافئ",
    };

    const systemPrompt = `أنت كاتب إعلانات محترف عربي. مهمتك كتابة نص إبداعي قصير (جملة أو جملتين) للصور الإعلانية.

قواعد صارمة:
- اكتب بالعربية فقط
- أسلوب النص: ${tonePrompts[tone] || tonePrompts.marketing}
- المزاج: ${moodArabic[mood] || "احترافي"}
- المنصة: ${platform || "Instagram"}
- ${brandStyle ? `هوية العلامة: ${brandStyle}` : ""}

أمثلة على النصوص الجيدة:
- "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح."
- "لحظات تستحق التخليد، منتجات تستحق الإبداع."
- "عندما يلتقي الفن بالجودة، تولد التجربة الاستثنائية."

اكتب نص واحد فقط بدون أي شرح أو علامات تنسيق.`;

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
          {
            role: "user",
            content: imageUrl 
              ? [
                  { type: "text", text: "اكتب نص إبداعي قصير لهذه الصورة:" },
                  { type: "image_url", image_url: { url: imageUrl } }
                ]
              : "اكتب نص إبداعي قصير لصورة إعلانية احترافية."
          }
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error("Failed to generate caption");
    }

    const data = await response.json();
    const caption = data.choices?.[0]?.message?.content?.trim() || 
      "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح.";

    return new Response(JSON.stringify({ caption }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Caption generation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        caption: "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
