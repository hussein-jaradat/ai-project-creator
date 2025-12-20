import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PromptEngineerRequest {
  userPrompt: string;
  contentType: "image" | "video";
  platform?: string;
  mood?: string;
  business?: string;
  brandKit?: {
    name?: string;
    colorPalette?: any;
    toneOfVoice?: string;
    keywords?: string[];
  };
}

// نظام الطبقات السبع لهندسة البرومبت الاحترافي
const CREATIVE_DIRECTOR_SYSTEM_PROMPT = `أنت مدير إبداعي محترف متخصص في بناء برومبتات توليد الصور والفيديوهات التسويقية بمستوى عالمي.

🎯 مهمتك: تحويل طلب المستخدم البسيط إلى برومبت احترافي مقسم إلى 7 طبقات وصفية.

📋 هيكل البرومبت الإلزامي (7 طبقات):

1️⃣ وصف المشهد الأساسي:
   - الموضوع الرئيسي والهدف التسويقي
   - السياق والبيئة
   - الإحساس العام المطلوب

2️⃣ الأسلوب البصري:
   - نوع التصوير (إعلاني، تجاري، lifestyle)
   - الطابع الاحترافي والهوية البصرية
   - المراجع الفنية إن وجدت

3️⃣ التحكم بالكاميرا والتكوين:
   - نوع الكاميرا (DSLR, Medium Format, etc.)
   - زاوية التصوير (علوية، مستوية، منخفضة)
   - التسلسل البصري والتكوين
   - فصل العناصر والخلفية

4️⃣ الإضاءة:
   - نوع الإضاءة (طبيعية، استوديو، مختلطة)
   - اتجاه ونعومة الإضاءة
   - الظلال والإبرازات
   - الألوان الضوئية

5️⃣ تحسين المنصة المستهدفة:
   - أبعاد وتكوين مناسب للمنصة
   - وضوح على الشاشات الصغيرة
   - جاذبية بصرية فورية

6️⃣ فرض الجودة والإخراج:
   - الدقة (4K, 8K)
   - الحدة والتفاصيل
   - الخامات والقوام
   - معايير التصوير الاحترافي

7️⃣ القيود السلبية:
   - ما يجب تجنبه (فوضى، تشويه، إضاءة سيئة)
   - منع الأخطاء الشائعة
   - ضمان الاحتراف

📝 قواعد البناء:

1. اكتب البرومبت بالعربية أو الإنجليزية حسب سياق الطلب الأصلي
2. كل طبقة في فقرة منفصلة
3. أضف التفاصيل الناقصة تلقائياً
4. حافظ على التماسك بين الطبقات
5. اجعل البرومبت قابلاً للاستخدام مباشرة

🎨 أساليب المزاج:
- luxury: فاخر، راقي، متطور، حصري
- minimal: نظيف، بسيط، حديث، مركز
- energetic: نابض، ديناميكي، جريء، مثير
- warm: دافئ، ودود، مريح، جذاب
- elegant: أنيق، رشيق، كلاسيكي، خالد
- professional: احترافي، موثوق، جاد
- cinematic: سينمائي، درامي، فني

🎬 للفيديو أضف:
- حركة الكاميرا (pan, zoom, dolly)
- الإيقاع والتوقيت
- الانتقالات
- الصوت والموسيقى المقترحة

⚠️ مهم جداً:
- لا تضف أي تعليقات أو شروحات
- أرجع البرومبت النهائي فقط
- اكتب بشكل متصل بدون ترقيم ظاهر
- كل فقرة تمثل طبقة واحدة`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userPrompt, 
      contentType, 
      platform, 
      mood, 
      business,
      brandKit 
    }: PromptEngineerRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Prompt Engineer request:", { 
      userPrompt, 
      contentType, 
      platform, 
      mood, 
      business,
      hasBrandKit: !!brandKit 
    });

    // بناء طلب المستخدم المحسن للمدير الإبداعي
    let userMessage = `طلب المستخدم: "${userPrompt}"

نوع المحتوى: ${contentType === "video" ? "فيديو تسويقي" : "صورة تسويقية"}
المنصة المستهدفة: ${platform || "إنستغرام"}
المزاج/الطابع: ${mood || "احترافي"}
${business ? `النشاط التجاري: ${business}` : ""}`;

    // إضافة معلومات Brand Kit إن وجدت
    if (brandKit) {
      userMessage += `

معلومات الهوية البصرية:
${brandKit.name ? `- اسم العلامة: ${brandKit.name}` : ""}
${brandKit.toneOfVoice ? `- نبرة الصوت: ${brandKit.toneOfVoice}` : ""}
${brandKit.keywords?.length ? `- الكلمات المفتاحية: ${brandKit.keywords.join(", ")}` : ""}
${brandKit.colorPalette ? `- لوحة الألوان: ${JSON.stringify(brandKit.colorPalette)}` : ""}`;
    }

    userMessage += `

قم ببناء برومبت احترافي كامل بالطبقات السبع.`;

    // استدعاء Lovable AI لبناء البرومبت
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CREATIVE_DIRECTOR_SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded",
          fallbackPrompt: buildFallbackPrompt(userPrompt, contentType, platform, mood, business)
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // في حالة الفشل، استخدم البرومبت الاحتياطي
      return new Response(JSON.stringify({ 
        enhancedPrompt: buildFallbackPrompt(userPrompt, contentType, platform, mood, business),
        source: "fallback"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      throw new Error("No prompt generated");
    }

    console.log("Enhanced prompt generated successfully, length:", enhancedPrompt.length);

    return new Response(JSON.stringify({ 
      enhancedPrompt,
      source: "ai"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Prompt Engineer error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      // إرجاع برومبت احتياطي في حالة الفشل
      enhancedPrompt: "Professional marketing image with high-end photography style, studio lighting, clean composition, ultra high resolution.",
      source: "error-fallback"
    }), {
      status: 200, // نرجع 200 مع البرومبت الاحتياطي
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// بناء برومبت احتياطي في حالة فشل AI
function buildFallbackPrompt(
  userPrompt: string, 
  contentType: string, 
  platform?: string, 
  mood?: string, 
  business?: string
): string {
  const moodStyles: Record<string, string> = {
    luxury: "luxurious, premium, high-end, sophisticated, elegant lighting, rich textures",
    minimal: "clean, simple, minimalist, modern, white space, geometric",
    energetic: "vibrant, dynamic, bold colors, exciting, high contrast",
    warm: "cozy, inviting, warm tones, comfortable, golden hour lighting",
    elegant: "refined, graceful, timeless, classic, soft lighting",
    professional: "corporate, polished, trustworthy, clean lines",
    cinematic: "cinematic lighting, dramatic shadows, film-like, moody"
  };

  const platformSpecs: Record<string, string> = {
    instagram: "optimized for Instagram feed, square or 4:5 ratio, eye-catching, scroll-stopping",
    tiktok: "vertical format 9:16, dynamic, trend-aware, youth-oriented",
    facebook: "optimized for Facebook, 16:9 ratio, shareable, engaging",
    linkedin: "professional, corporate-friendly, 1200x627 optimal",
    twitter: "optimized for Twitter/X, 16:9 ratio, concise visual message"
  };

  const moodStyle = mood && moodStyles[mood.toLowerCase()] ? moodStyles[mood.toLowerCase()] : "professional, high-quality";
  const platformSpec = platform && platformSpecs[platform.toLowerCase()] ? platformSpecs[platform.toLowerCase()] : "social media optimized";

  if (contentType === "video") {
    return `Professional marketing video for ${business || "brand"}. ${userPrompt}.

Cinematic commercial style with smooth camera movements, professional color grading, and ${moodStyle} aesthetic.

Shot with professional cinema camera, fluid tracking shots, deliberate pacing, clear visual hierarchy.

Studio-quality lighting with controlled shadows, highlight separation, and mood-appropriate color temperature.

${platformSpec}, bold composition, attention-grabbing from the first frame.

4K resolution, sharp details, professional post-production, seamless transitions, broadcast quality.

No shaky footage, no amateur transitions, no poor audio sync, no visual clutter.`;
  }

  return `Professional marketing image for ${business || "brand"}. ${userPrompt}.

Commercial advertising photography style with ${moodStyle} aesthetic, reflecting brand quality and trust.

Captured with professional DSLR camera, strategic angle, clear visual hierarchy, clean background separation.

Controlled professional lighting, product-flattering illumination, balanced shadows, vibrant yet natural colors.

${platformSpec}, bold and clear composition, visually striking even on small screens.

Ultra high resolution, excellent sharpness, professional output quality, realistic textures, world-class advertising standards.

No visual clutter, no product distortion, no unreadable elements, no poor lighting, no amateur composition.`;
}
