import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// استدعاء محرك هندسة البرومبت
async function getEnhancedPrompt(
  userPrompt: string,
  platform?: string,
  mood?: string,
  business?: string,
  brandKit?: any
): Promise<string> {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/prompt-engineer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({
        userPrompt,
        contentType: "image",
        platform,
        mood,
        business,
        brandKit,
      }),
    });

    if (!response.ok) {
      console.error("Prompt Engineer failed, using fallback");
      return buildBasicPrompt(userPrompt, platform, mood, business);
    }

    const data = await response.json();
    console.log("Prompt Engineer response:", { source: data.source, length: data.enhancedPrompt?.length });
    
    return data.enhancedPrompt || buildBasicPrompt(userPrompt, platform, mood, business);
  } catch (error) {
    console.error("Error calling Prompt Engineer:", error);
    return buildBasicPrompt(userPrompt, platform, mood, business);
  }
}

// برومبت أساسي احتياطي
function buildBasicPrompt(
  userPrompt: string,
  platform?: string,
  mood?: string,
  business?: string
): string {
  const moodStyles: Record<string, string> = {
    luxury: "luxurious, premium, high-end, sophisticated",
    minimal: "clean, simple, minimalist, modern",
    energetic: "vibrant, dynamic, bold, exciting",
    warm: "cozy, inviting, comfortable, friendly",
    elegant: "refined, graceful, timeless, classic",
    professional: "refined, graceful, timeless",
    cinematic: "cinematic lighting, dramatic shadows, film-like"
  };

  let prompt = `Professional marketing image for ${business || "brand"}. ${userPrompt}`;
  
  if (mood && moodStyles[mood.toLowerCase()]) {
    prompt += `. Style: ${moodStyles[mood.toLowerCase()]}`;
  }
  
  prompt += ". Ultra high resolution, professional photography, commercial quality.";
  
  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, mood, platform, business, referenceImages, brandKit } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("gemini");
    
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("Image generation request:", { 
      prompt, 
      mood, 
      platform, 
      business, 
      hasReferenceImages: referenceImages?.length > 0,
      hasBrandKit: !!brandKit
    });

    // استخدام محرك هندسة البرومبت للحصول على برومبت احترافي
    let enhancedPrompt: string;
    
    if (referenceImages && referenceImages.length > 0) {
      // للصور المرجعية، نبني برومبت خاص يحافظ على هوية المنتج
      enhancedPrompt = await getEnhancedPrompt(
        `Based on the reference product images, create a NEW professional marketing image that matches the style and brand identity. ${prompt}`,
        platform,
        mood,
        business,
        brandKit
      );
      
      // إضافة تعليمات الصور المرجعية
      enhancedPrompt = `${enhancedPrompt}

IMPORTANT: Match the exact product/subject shown in the reference images. Maintain consistent visual aesthetics, colors, and brand identity from the references.`;
    } else {
      enhancedPrompt = await getEnhancedPrompt(prompt, platform, mood, business, brandKit);
    }

    console.log("Final enhanced prompt length:", enhancedPrompt.length);

    // Build content parts with text and reference images
    const contentParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
      { text: enhancedPrompt }
    ];

    // Add reference images to the request
    if (referenceImages && referenceImages.length > 0) {
      for (const imgDataUrl of referenceImages) {
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

    // Try image generation models
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
        
        continue;
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
