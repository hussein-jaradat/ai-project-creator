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

    // Mood styles for enhanced prompts
    const moodStyles: Record<string, string> = {
      luxury: "luxurious, premium, high-end, sophisticated, opulent",
      minimal: "clean, simple, minimalist, modern, sleek",
      energetic: "vibrant, dynamic, bold, exciting, lively",
      warm: "cozy, inviting, comfortable, friendly, homey",
      elegant: "refined, graceful, timeless, classic beauty, subtle sophistication",
      professional: "refined, graceful, timeless, classic beauty, subtle sophistication",
      cinematic: "cinematic lighting, dramatic shadows, film-like quality, storytelling visuals"
    };

    // Build enhanced prompt
    let enhancedPrompt = `Professional marketing image for ${business}. ${prompt}`;
    
    if (mood && moodStyles[mood.toLowerCase()]) {
      enhancedPrompt += `. Style: ${moodStyles[mood.toLowerCase()]}. `;
    }
    
    enhancedPrompt += " Ultra high resolution, professional photography, commercial quality.";

    console.log("Enhanced prompt:", enhancedPrompt);

    // Try gemini-2.0-flash-preview-image-generation model
    const modelsToTry = [
      "gemini-2.0-flash-preview-image-generation",
      "gemini-2.0-flash-exp"
    ];

    let imageUrl = null;
    let lastError = null;

    for (const model of modelsToTry) {
      console.log(`Trying model: ${model}`);
      
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ 
                parts: [{ text: `Generate a high-quality professional marketing image: ${enhancedPrompt}` }] 
              }],
              generationConfig: {
                responseModalities: ["IMAGE", "TEXT"]
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
          
          lastError = errorText;
          continue;
        }

        const data = await response.json();
        console.log(`Model ${model} response received`);

        // Extract image from response
        const parts = data.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);
        
        if (imagePart?.inlineData) {
          imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          console.log("Image generated successfully with model:", model);
          break;
        }
      } catch (err) {
        console.error(`Error with model ${model}:`, err);
        lastError = err;
      }
    }

    if (!imageUrl) {
      console.error("All models failed. Last error:", lastError);
      return new Response(JSON.stringify({ 
        error: "توليد الصور غير متاح حالياً. تأكد من تفعيل Gemini API مع خطة مدفوعة أو استخدم Google AI Studio." 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      imageUrl,
      prompt: enhancedPrompt 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(JSON.stringify({ error: "فشل في توليد الصورة" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
