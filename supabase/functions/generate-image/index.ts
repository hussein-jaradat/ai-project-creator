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

    // Use Imagen 3 model via Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instances: [{ prompt: enhancedPrompt }],
          parameters: { 
            sampleCount: 1,
            aspectRatio: "1:1"
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Imagen API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Try fallback to gemini-2.0-flash with image generation
      console.log("Trying fallback to Gemini Flash image generation...");
      
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Generate an image: ${enhancedPrompt}` }] }],
            generationConfig: {
              responseModalities: ["TEXT", "IMAGE"]
            }
          }),
        }
      );
      
      if (!fallbackResponse.ok) {
        const fallbackError = await fallbackResponse.text();
        console.error("Fallback also failed:", fallbackResponse.status, fallbackError);
        throw new Error(`Image generation failed: ${response.status}`);
      }
      
      const fallbackData = await fallbackResponse.json();
      const imagePart = fallbackData.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData
      );
      
      if (imagePart?.inlineData) {
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        return new Response(JSON.stringify({ imageUrl, prompt: enhancedPrompt }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("No image generated from fallback");
    }

    const data = await response.json();
    console.log("Imagen response received");

    // Extract image from Imagen response
    const predictions = data.predictions;
    if (!predictions || predictions.length === 0) {
      console.error("No predictions in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    // Imagen returns base64 encoded images
    const imageData = predictions[0].bytesBase64Encoded;
    if (!imageData) {
      console.error("No image data in prediction:", JSON.stringify(predictions[0]));
      throw new Error("No image data in response");
    }

    const imageUrl = `data:image/png;base64,${imageData}`;
    console.log("Image generated successfully");

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
