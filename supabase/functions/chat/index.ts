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
    const GEMINI_API_KEY = Deno.env.get("gemini");
    
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    console.log("Chat request received with", messages.length, "messages");

    // Convert messages to Gemini format
    const geminiContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح. يرجى المحاولة لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "خطأ في خدمة الذكاء الاصطناعي" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Gemini SSE to OpenAI-compatible SSE format
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }
        
        const decoder = new TextDecoder();
        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                
                try {
                  const data = JSON.parse(jsonStr);
                  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                  
                  if (text) {
                    // Convert to OpenAI format
                    const openAIFormat = {
                      choices: [{
                        delta: { content: text },
                        index: 0
                      }]
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
                  }
                } catch (e) {
                  console.error("Parse error:", e);
                }
              }
            }
          }
          
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("Stream error:", e);
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
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
