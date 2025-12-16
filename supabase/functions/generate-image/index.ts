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
    const { prompt, mood, platform, business, referenceImages } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("gemini");
    
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("Image generation request:", { prompt, mood, platform, business, hasReferenceImages: referenceImages?.length > 0 });

    const moodStyles: Record<string, string> = {
      luxury: "luxurious, premium, high-end, sophisticated",
      minimal: "clean, simple, minimalist, modern",
      energetic: "vibrant, dynamic, bold, exciting",
      warm: "cozy, inviting, comfortable, friendly",
      elegant: "refined, graceful, timeless, classic",
      professional: "refined, graceful, timeless",
      cinematic: "cinematic lighting, dramatic shadows, film-like"
    };

    // Build enhanced prompt with reference image instructions
    let enhancedPrompt = "";
    if (referenceImages && referenceImages.length > 0) {
      enhancedPrompt = `Based on the reference product images provided, create a NEW professional marketing image that:
- Matches the style, colors, and brand identity shown in the reference images
- Features the SAME product/subject shown in the references
- Maintains consistent visual aesthetics (lighting, composition, mood)
- Is suitable for ${platform || 'social media'} marketing

Product/Business: ${business}
Specific request: ${prompt}`;
    } else {
      enhancedPrompt = `Generate a professional marketing image for ${business}. ${prompt}`;
    }
    
    if (mood && moodStyles[mood.toLowerCase()]) {
      enhancedPrompt += `. Style: ${moodStyles[mood.toLowerCase()]}`;
    }
    enhancedPrompt += ". Ultra high resolution, professional photography.";

    console.log("Enhanced prompt:", enhancedPrompt);

    // Build content parts with text and reference images
    const contentParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
      { text: enhancedPrompt }
    ];

    // Add reference images to the request
    if (referenceImages && referenceImages.length > 0) {
      for (const imgDataUrl of referenceImages) {
        // Extract base64 data and mime type from data URL
        const matches = imgDataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          contentParts.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          });
          console.log(`Added reference image with mimeType: ${mimeType}`);
        }
      }
    }

    // Try gemini-2.0-flash-preview-image-generation model
    const modelsToTry = [
      "gemini-2.0-flash-preview-image-generation",
      "gemini-2.5-flash-preview-04-17",
      "gemini-2.0-flash-exp"
    ];

    for (const model of modelsToTry) {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: contentParts }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} error:`, response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        continue; // Try next model
      }

      const data = await response.json();
      console.log(`Model ${model} response received`);

      const parts = data.candidates?.[0]?.content?.parts;
      const imagePart = parts?.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);
      
      if (imagePart?.inlineData) {
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        console.log("Image generated successfully with model:", model);
        
        return new Response(JSON.stringify({ imageUrl, prompt: enhancedPrompt }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    throw new Error("جميع الموديلات فشلت في توليد الصورة");

  } catch (error) {
    console.error("Image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "فشل في توليد الصورة";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
