import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VideoGenerationRequest {
  prompt: string;
  referenceImages?: string[];
  duration?: number;
  platform?: string;
  mood?: string;
  business?: string;
  brandKit?: any;
}

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
        contentType: "video",
        platform,
        mood,
        business,
        brandKit,
      }),
    });

    if (!response.ok) {
      console.error("Prompt Engineer failed, using fallback");
      return buildBasicVideoPrompt(userPrompt, mood, business);
    }

    const data = await response.json();
    console.log("Prompt Engineer response:", { source: data.source, length: data.enhancedPrompt?.length });
    
    return data.enhancedPrompt || buildBasicVideoPrompt(userPrompt, mood, business);
  } catch (error) {
    console.error("Error calling Prompt Engineer:", error);
    return buildBasicVideoPrompt(userPrompt, mood, business);
  }
}

// برومبت فيديو أساسي احتياطي
function buildBasicVideoPrompt(
  userPrompt: string,
  mood?: string,
  business?: string
): string {
  const moodStyles: Record<string, string> = {
    luxury: "luxurious, premium, high-end cinematography",
    minimal: "clean, simple, minimalist motion",
    energetic: "vibrant, dynamic, fast-paced",
    warm: "cozy, inviting, warm color grading",
    elegant: "refined, graceful, smooth transitions",
    professional: "corporate, polished, steady shots",
    cinematic: "cinematic lighting, dramatic, film-like"
  };

  let prompt = `Professional marketing video for ${business || "brand"}. ${userPrompt}`;
  
  if (mood && moodStyles[mood.toLowerCase()]) {
    prompt += `. Style: ${moodStyles[mood.toLowerCase()]}`;
  }
  
  prompt += ". Smooth camera movement, professional color grading, high production value.";
  
  return prompt;
}

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const serviceAccount = JSON.parse(serviceAccountJson);
  
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encoder = new TextEncoder();
  const base64UrlEncode = (data: Uint8Array) => {
    return btoa(String.fromCharCode(...data))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const headerB64 = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signatureInput = `${headerB64}.${payloadB64}`;

  const privateKeyPem = serviceAccount.private_key;
  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    encoder.encode(signatureInput)
  );

  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  const jwt = `${signatureInput}.${signatureB64}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Token exchange error:", errorText);
    throw new Error(`Failed to get access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const projectId = Deno.env.get('VERTEX_AI_PROJECT_ID');
    const serviceAccountJson = Deno.env.get('VERTEX_AI_SERVICE_ACCOUNT');

    if (!projectId || !serviceAccountJson) {
      console.error("Missing Vertex AI credentials");
      return new Response(
        JSON.stringify({ error: "Vertex AI credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      prompt, 
      referenceImages, 
      duration = 6,
      platform,
      mood,
      business,
      brandKit
    }: VideoGenerationRequest = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Video generation request:", { 
      prompt, 
      duration, 
      platform, 
      mood, 
      business,
      hasReferenceImages: (referenceImages?.length ?? 0) > 0 
    });

    // استخدام محرك هندسة البرومبت للحصول على برومبت احترافي
    const enhancedPrompt = await getEnhancedPrompt(prompt, platform, mood, business, brandKit);
    console.log("Enhanced video prompt length:", enhancedPrompt.length);

    // Get access token
    const accessToken = await getAccessToken(serviceAccountJson);
    console.log("Access token obtained successfully");

    // Vertex AI Veo endpoint
    const location = "us-central1";
    const model = "veo-3.0-fast-generate-001";
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predictLongRunning`;

    const requestPayload: any = {
      instances: [
        {
          prompt: enhancedPrompt,
        }
      ],
      parameters: {
        sampleCount: 1,
        durationSeconds: duration,
        aspectRatio: "16:9",
        generateAudio: true,
        resolution: "720p"
      }
    };

    // Add reference image if provided
    if (referenceImages && referenceImages.length > 0) {
      const firstImage = referenceImages[0];
      const base64Data = firstImage.includes('base64,') 
        ? firstImage.split('base64,')[1] 
        : firstImage;
      
      requestPayload.instances[0].image = {
        bytesBase64Encoded: base64Data
      };
      console.log("Reference image added for image-to-video generation");
    }

    console.log("Calling Vertex AI Veo API...");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Veo API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: "لا تملك صلاحية الوصول إلى Vertex AI Veo. تأكد من تفعيل الخدمة." }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: `Veo API error: ${errorText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log("Veo API response received:", JSON.stringify(result).substring(0, 500));

    // Handle long-running operation
    if (result.name && result.name.includes('operations')) {
      const operationName = result.name;
      console.log("Video generation started, operation:", operationName);

      const modelMatch = operationName.match(/models\/([^\/]+)/);
      const modelFromOp = modelMatch ? modelMatch[1] : model;

      const pollEndpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelFromOp}:fetchPredictOperation`;
      
      const maxAttempts = 36;
      let attempt = 0;
      
      while (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const statusResponse = await fetch(pollEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operationName: operationName
          }),
        });

        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          console.error(`Status check failed (attempt ${attempt + 1}):`, statusResponse.status, errorText);
          attempt++;
          continue;
        }

        const statusResult = await statusResponse.json();
        console.log(`Poll attempt ${attempt + 1}:`, statusResult.done ? "Complete" : "In progress");

        if (statusResult.done) {
          if (statusResult.error) {
            console.error("Operation error:", statusResult.error);
            return new Response(
              JSON.stringify({ error: statusResult.error.message || "Video generation failed" }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const videoData = statusResult.response;
          console.log("Video response data:", JSON.stringify(videoData).substring(0, 500));
          
          if (videoData?.videos?.[0]?.gcsUri) {
            const videoUri = videoData.videos[0].gcsUri;
            console.log("Video generated successfully (GCS):", videoUri);
            
            return new Response(
              JSON.stringify({ 
                success: true,
                videoUrl: videoUri,
                message: "تم إنشاء الفيديو بنجاح"
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          if (videoData?.videos?.[0]?.bytesBase64Encoded) {
            const videoBase64 = videoData.videos[0].bytesBase64Encoded;
            const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;
            console.log("Video generated as base64");
            
            return new Response(
              JSON.stringify({ 
                success: true,
                videoUrl: videoDataUrl,
                message: "تم إنشاء الفيديو بنجاح"
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          if (videoData?.generatedSamples?.[0]?.video?.uri) {
            const videoUri = videoData.generatedSamples[0].video.uri;
            console.log("Video generated successfully (samples):", videoUri);
            
            return new Response(
              JSON.stringify({ 
                success: true,
                videoUrl: videoUri,
                message: "تم إنشاء الفيديو بنجاح"
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          console.error("Unexpected response structure:", JSON.stringify(videoData));
          return new Response(
            JSON.stringify({ error: "Unexpected response format from Veo" }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        attempt++;
      }

      return new Response(
        JSON.stringify({ error: "انتهت مهلة توليد الفيديو. يرجى المحاولة مرة أخرى." }),
        { status: 504, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Direct response
    if (result.generatedSamples?.[0]?.video?.uri) {
      return new Response(
        JSON.stringify({ 
          success: true,
          videoUrl: result.generatedSamples[0].video.uri,
          message: "تم إنشاء الفيديو بنجاح"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error("Unexpected response:", JSON.stringify(result));
    return new Response(
      JSON.stringify({ error: "Unexpected response from Veo API" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-video function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
