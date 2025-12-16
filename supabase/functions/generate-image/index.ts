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

    const moodStyles: Record<string, string> = {
      luxury: "luxurious, premium, high-end, sophisticated",
      minimal: "clean, simple, minimalist, modern",
      energetic: "vibrant, dynamic, bold, exciting",
      warm: "cozy, inviting, comfortable, friendly",
      elegant: "refined, graceful, timeless, classic",
      professional: "refined, graceful, timeless",
      cinematic: "cinematic lighting, dramatic shadows, film-like"
    };

    let enhancedPrompt = `Professional marketing image for ${business}. ${prompt}`;
    if (mood && moodStyles[mood.toLowerCase()]) {
      enhancedPrompt += `. Style: ${moodStyles[mood.toLowerCase()]}`;
    }
    enhancedPrompt += ". Ultra high resolution, professional photography.";

    console.log("Enhanced prompt:", enhancedPrompt);

    // Try imagen-3.0-generate-001 (newer version)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt: enhancedPrompt }],
          parameters: { 
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_few"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Imagen 3.0 error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`Imagen error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Imagen response received:", JSON.stringify(data).substring(0, 200));

    const predictions = data.predictions;
    if (!predictions || predictions.length === 0) {
      throw new Error("No predictions in response");
    }

    const imageData = predictions[0].bytesBase64Encoded;
    if (!imageData) {
      throw new Error("No image data in response");
    }

    const imageUrl = `data:image/png;base64,${imageData}`;
    console.log("Image generated successfully");

    return new Response(JSON.stringify({ imageUrl, prompt: enhancedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "فشل في توليد الصورة";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
