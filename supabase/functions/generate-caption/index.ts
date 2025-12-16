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
    const { imageUrl, tone, mood, platform, brandStyle, projectDescription } = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get("gemini");
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
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
${brandStyle ? `- هوية العلامة: ${brandStyle}` : ""}
${projectDescription ? `- وصف المشروع: ${projectDescription}` : ""}

أمثلة على النصوص الجيدة:
- "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح."
- "لحظات تستحق التخليد، منتجات تستحق الإبداع."
- "عندما يلتقي الفن بالجودة، تولد التجربة الاستثنائية."

اكتب نص واحد فقط بدون أي شرح أو علامات تنسيق.`;

    // Build the request parts
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    
    if (imageUrl && imageUrl.startsWith("data:")) {
      // Extract base64 data from data URL
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        parts.push({ text: "اكتب نص إبداعي قصير لهذه الصورة:" });
        parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
      } else {
        parts.push({ text: "اكتب نص إبداعي قصير لصورة إعلانية احترافية." });
      }
    } else if (imageUrl) {
      // For URL-based images, we'll just use text prompt
      parts.push({ text: `اكتب نص إبداعي قصير لصورة إعلانية احترافية. ${projectDescription || ""}` });
    } else {
      parts.push({ text: "اكتب نص إبداعي قصير لصورة إعلانية احترافية." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts }],
          generationConfig: {
            maxOutputTokens: 150,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      // Return fallback caption with 200 status for rate limits or other API errors
      const fallbackCaption = "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح.";
      return new Response(JSON.stringify({ caption: fallbackCaption, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const caption = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
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
