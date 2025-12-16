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
    const { prompt, mood, platform, business } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("gemini");
    
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("Image generation request:", { prompt, mood, platform, business });

    // Enhance the prompt with mood and style
    const moodStyles: Record<string, string> = {
      luxury: "luxurious, high-end, elegant lighting, gold accents, premium quality, sophisticated",
      minimal: "minimalist, clean, simple, white space, modern, sleek",
      energetic: "vibrant, dynamic, bold colors, action, movement, exciting",
      warm: "warm lighting, cozy, inviting, soft tones, friendly, approachable",
      elegant: "refined, graceful, timeless, classic beauty, subtle sophistication",
    };

    const platformStyles: Record<string, string> = {
      instagram: "square composition, Instagram-ready, social media optimized",
      tiktok: "vertical composition, TikTok style, eye-catching",
      youtube: "cinematic, 16:9 aspect ratio, YouTube thumbnail quality",
      facebook: "professional, shareable, Facebook-optimized",
    };

    const enhancedPrompt = `Professional marketing image for ${business}. ${prompt}. Style: ${moodStyles[mood] || moodStyles.elegant}. ${platformStyles[platform] || ""}. Ultra high resolution, professional photography, commercial quality.`;

    console.log("Enhanced prompt:", enhancedPrompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini image generation error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "فشل في توليد الصورة" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Image generation response received");

    // Extract image from Gemini response
    const parts = data.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);
    
    if (!imagePart?.inlineData) {
      console.error("No image in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "لم يتم توليد صورة" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert to data URL
    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    return new Response(JSON.stringify({ 
      image: imageUrl,
      prompt: enhancedPrompt 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate image error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير متوقع" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
