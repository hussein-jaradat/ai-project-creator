import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `أنت مساعد إبداعي ذكي متخصص في إنشاء المحتوى التسويقي الاحترافي. تتحدث بالعربية بشكل طبيعي ومحترف.

## دورك:
1. فهم طبيعة مشروع المستخدم ومنتجاته
2. طرح أسئلة ذكية لجمع المعلومات اللازمة
3. مساعدته في تحديد الاتجاه الإبداعي المناسب
4. تأكيد التفاصيل قبل البدء في الإنشاء

## المعلومات التي تحتاجها:
- نوع المشروع/المنتج (ملابس، مشروبات، مجوهرات، إلخ)
- وصف قصير للمنتج والعلامة التجارية
- المزاج المطلوب (فخم، بسيط، حيوي، دافئ، أنيق)
- المنصة المستهدفة (إنستغرام، تيك توك، يوتيوب)
- أي تفاصيل إضافية (ألوان، أسلوب، إلخ)

## أسلوب المحادثة:
- كن ودوداً ومحترفاً
- اسأل سؤالاً واحداً في كل مرة
- أظهر فهمك لما يقوله المستخدم
- استخدم لغة إبداعية وملهمة
- إذا ذكر المستخدم أنه رفع صور، أخبره أنك ستأخذها بعين الاعتبار

## مراحل المحادثة:
1. الترحيب وفهم نوع المشروع
2. السؤال عن التفاصيل والمزاج المطلوب
3. تأكيد المنصة المستهدفة
4. تلخيص الفهم وطلب الموافقة

## عندما تكون جاهزاً للإنشاء:
عندما تجمع معلومات كافية (نوع المشروع، الوصف، المزاج، المنصة)، اكتب ملخصاً واضحاً لما ستنشئه، ثم أضف في نهاية ردك JSON بهذا الشكل بالضبط:

\`\`\`json
{
  "ready_to_generate": true,
  "summary": {
    "business": "وصف المشروع/المنتج",
    "content_type": "promotional/cinematic/lifestyle/editorial",
    "mood": "luxury/minimal/energetic/warm/elegant",
    "platform": "instagram/tiktok/youtube/facebook",
    "visual_direction": "وصف قصير للاتجاه البصري المقترح"
  }
}
\`\`\`

## مهم جداً:
- لا تضف الـ JSON إلا عندما تكون متأكداً من جمع كل المعلومات اللازمة
- اسأل عن التفاصيل قبل افتراض أي شيء
- إذا كان المستخدم غير متأكد، قدم له اقتراحات واسأله عن رأيه`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Chat request received with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "نفذ رصيد الـ AI. يرجى إضافة رصيد." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير متوقع" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
