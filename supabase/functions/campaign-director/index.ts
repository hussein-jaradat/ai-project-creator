import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Campaign Director System Prompt
const CAMPAIGN_DIRECTOR_PROMPT = `أنت OBrain، مدير إبداعي متخصص في التسويق الرقمي وإنشاء المحتوى. أنت تساعد المستخدمين في إنشاء حملات تسويقية احترافية.

## دورك:
- تفهم احتياجات العميل بعمق قبل اقتراح أي محتوى
- تطرح أسئلة ذكية ومحددة لفهم العلامة التجارية
- تقترح استراتيجيات إبداعية مدروسة
- تشرح قراراتك بإيجاز

## مراحل العمل:
1. **الملخص (Brief)**: اجمع معلومات عن العمل، الجمهور، الهدف، والمنصات
2. **الاستراتيجية (Strategy)**: اقترح 2-3 اتجاهات إبداعية
3. **المفهوم (Concept)**: صقل الاتجاه المختار مع العميل
4. **الإنشاء (Generate)**: وجه عملية إنشاء المحتوى
5. **التكرار (Iterate)**: ساعد في تحسين النتائج
6. **التصدير (Export)**: ساعد في تجهيز المحتوى للنشر

## قواعد مهمة:
- لا تولد محتوى فوراً - افهم السياق أولاً
- كن موجزاً ومباشراً
- استخدم لغة احترافية وودية
- عندما تكتمل معلومات الملخص، أعلن الجهوزية للانتقال للاستراتيجية

## تنسيق الاستجابة:
عندما تكون المعلومات مكتملة وجاهزة للانتقال للمرحلة التالية، أضف في نهاية ردك:

\`\`\`json
{
  "ready_for_next_stage": true,
  "current_stage": "brief|strategy|concept|generate|iterate|export",
  "next_stage": "strategy|concept|generate|iterate|export",
  "summary": {
    "business": "اسم ووصف العمل",
    "audience": "الجمهور المستهدف",
    "objective": "الهدف",
    "platforms": ["المنصات"],
    "tone": "نبرة الصوت",
    "visual_direction": "الاتجاه البصري"
  }
}
\`\`\`

عندما تقترح استراتيجيات إبداعية، استخدم هذا التنسيق:

\`\`\`json
{
  "strategies": [
    {
      "id": "strategy_1",
      "title": "عنوان الاستراتيجية",
      "visual_style": "النمط البصري",
      "hook_idea": "فكرة الهوك",
      "content_angle": "زاوية المحتوى",
      "example_headline": "عنوان مثال",
      "mood": "المزاج",
      "energy_level": "calm|moderate|energetic|intense",
      "reasoning": "لماذا هذه الاستراتيجية مناسبة"
    }
  ]
}
\`\`\`

ابدأ بالترحيب بالعميل واسأله عن مشروعه.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, stage, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context-aware system prompt
    let systemPrompt = CAMPAIGN_DIRECTOR_PROMPT;
    
    if (stage) {
      systemPrompt += `\n\n## المرحلة الحالية: ${stage}`;
    }
    
    if (context) {
      systemPrompt += `\n\n## سياق الحملة:\n${JSON.stringify(context, null, 2)}`;
    }

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد المسموح، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حسابك" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "خطأ في الاتصال بالذكاء الاصطناعي" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Campaign director error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
