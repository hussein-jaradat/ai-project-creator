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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    // Platform-specific styles
    const platformStyles: Record<string, string> = {
      instagram: "square format, Instagram-ready, social media optimized",
      tiktok: "vertical format, TikTok style, trending aesthetic",
      youtube: "wide format, YouTube thumbnail style, attention-grabbing",
      facebook: "versatile format, Facebook-friendly, shareable content"
    };

    // Build enhanced prompt
    let enhancedPrompt = `Professional marketing image for ${business}. ${prompt}`;
    
    if (mood && moodStyles[mood.toLowerCase()]) {
      enhancedPrompt += `. Style: ${moodStyles[mood.toLowerCase()]}. `;
    }
    
    if (platform && platformStyles[platform.toLowerCase()]) {
      enhancedPrompt += platformStyles[platform.toLowerCase()];
    }
    
    enhancedPrompt += " Ultra high resolution, professional photography, commercial quality.";

    console.log("Enhanced prompt:", enhancedPrompt);

    // Use Lovable AI Gateway with Nano Banana model for image generation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يرجى إضافة رصيد لحساب Lovable AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lovable AI response received");

    // Extract image from Lovable AI Gateway response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

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
