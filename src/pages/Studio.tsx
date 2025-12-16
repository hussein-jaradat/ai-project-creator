import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ReferencePanel } from "@/components/studio/ReferencePanel";
import { ChatPanel } from "@/components/studio/ChatPanel";
import { ActionPanel } from "@/components/studio/ActionPanel";
import { GenerationResult } from "@/components/studio/GenerationResult";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
const CAPTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-caption`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeneratedImage {
  url: string;
  caption: string;
}

interface GenerationSummary {
  business: string;
  content_type: string;
  mood: string;
  platform: string;
  visual_direction: string;
}

type ActionType = "image" | "video" | null;

export default function Studio() {
  // State
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [canGenerate, setCanGenerate] = useState(false);
  const [generationSummary, setGenerationSummary] = useState<GenerationSummary | null>(null);

  // Parse AI response for generation readiness
  const parseAIResponse = useCallback((content: string) => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.ready_to_generate && parsed.summary) {
          setCanGenerate(true);
          setGenerationSummary(parsed.summary);
          return content.replace(/```json[\s\S]*?```/, "").trim();
        }
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    }
    return content;
  }, []);

  // Stream chat with AI
  const streamChat = useCallback(async (userMessage: string) => {
    const allMessages = [...messages, { role: "user" as const, content: userMessage }];
    
    // Include reference images info in the message if available
    let messageWithContext = userMessage;
    if (referenceImages.length > 0 && messages.length === 0) {
      messageWithContext = `[لدي ${referenceImages.length} صور مرفوعة كمراجع]\n\n${userMessage}`;
    }

    const messagesForAPI = allMessages.map(m => ({
      role: m.role,
      content: m === allMessages[allMessages.length - 1] ? messageWithContext : m.content
    }));

    // Add context about selected action
    if (selectedAction && messages.length === 0) {
      messagesForAPI[messagesForAPI.length - 1].content = 
        `[المستخدم اختار: إنشاء ${selectedAction === "image" ? "صورة" : "فيديو"}]\n\n${messagesForAPI[messagesForAPI.length - 1].content}`;
    }

    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messagesForAPI }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get response");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let assistantContent = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              // Update messages with streaming content
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg?.role === "assistant") {
                  lastMsg.content = assistantContent;
                  return [...newMessages];
                }
                return [...newMessages, { role: "assistant", content: assistantContent }];
              });
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

    // Parse final response for generation readiness
    const cleanedContent = parseAIResponse(assistantContent);
    setMessages(prev => {
      const newMessages = prev.filter(m => m.role !== "assistant" || m.content !== assistantContent);
      return [...newMessages, { role: "assistant", content: cleanedContent }];
    });

    return cleanedContent;
  }, [messages, referenceImages, selectedAction, parseAIResponse]);

  // Handle sending message
  const handleSendMessage = useCallback(async (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      await streamChat(message);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("حدث خطأ في المحادثة");
    } finally {
      setIsLoading(false);
    }
  }, [streamChat]);

  // Handle action selection
  const handleSelectAction = useCallback((action: ActionType) => {
    setSelectedAction(action);
    
    // Auto-start conversation when action is selected
    if (action && messages.length === 0) {
      const greeting = action === "image" 
        ? "مرحباً! أريد إنشاء صور احترافية لمشروعي."
        : "مرحباً! أريد إنشاء فيديو إعلاني لمشروعي.";
      handleSendMessage(greeting);
    }
  }, [messages.length, handleSendMessage]);

  // Generate caption for image
  const generateCaption = useCallback(async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(CAPTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          tone: "marketing",
          mood: generationSummary?.mood || "luxury",
          platform: generationSummary?.platform || "instagram",
          projectDescription: generationSummary?.business || "",
        }),
      });

      if (!response.ok) throw new Error("Caption generation failed");
      const data = await response.json();
      return data.caption || "محتوى احترافي يعكس هوية علامتك التجارية";
    } catch (error) {
      console.error("Caption error:", error);
      return "محتوى احترافي يعكس هوية علامتك التجارية";
    }
  }, [generationSummary]);

  // Save content to database
  const saveContent = useCallback(async (images: GeneratedImage[]) => {
    try {
      for (const img of images) {
        // Upload image to storage
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        
        // Convert base64 to blob if needed
        let imageBlob: Blob;
        if (img.url.startsWith("data:")) {
          const response = await fetch(img.url);
          imageBlob = await response.blob();
        } else {
          const response = await fetch(img.url);
          imageBlob = await response.blob();
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("generated-images")
          .upload(fileName, imageBlob, { contentType: "image/png" });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("generated-images")
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase
          .from("generated_content")
          .insert({
            image_url: publicUrl,
            caption: img.caption,
            mood: generationSummary?.mood,
            platform: generationSummary?.platform,
            business_description: generationSummary?.business,
          });

        if (dbError) {
          console.error("Database error:", dbError);
        }
      }
      toast.success("تم حفظ المحتوى في المعرض");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("فشل في حفظ بعض المحتوى");
    }
  }, [generationSummary]);

  // Handle generation
  const handleGenerate = useCallback(async () => {
    if (!canGenerate || !generationSummary) {
      toast.error("يرجى التحدث مع المساعد أولاً للحصول على الموافقة");
      return;
    }

    setIsGenerating(true);
    setShowResults(false);

    try {
      const images: GeneratedImage[] = [];
      const prompt = `Create a professional ${generationSummary.content_type} image for ${generationSummary.business}. 
        Style: ${generationSummary.mood}. 
        Visual direction: ${generationSummary.visual_direction}. 
        For ${generationSummary.platform}. 
        Ultra high quality marketing image.`;

      // Generate 4 images
      for (let i = 0; i < 4; i++) {
        toast.info(`جارٍ إنشاء الصورة ${i + 1} من 4...`);

        const response = await fetch(GENERATE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `${prompt} Variation ${i + 1}.`,
            mood: generationSummary.mood,
            platform: generationSummary.platform,
            business: generationSummary.business,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Generation failed");
        }

        const data = await response.json();
        if (data.image) {
          const caption = await generateCaption(data.image);
          images.push({ url: data.image, caption });
        }
      }

      if (images.length === 0) {
        throw new Error("لم يتم توليد أي صور");
      }

      setGeneratedImages(images);
      setShowResults(true);
      toast.success("تم إنشاء الصور بنجاح!");

      // Save to database in background
      saveContent(images);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "فشل في إنشاء الصور");
    } finally {
      setIsGenerating(false);
    }
  }, [canGenerate, generationSummary, generateCaption, saveContent]);

  // Handle regeneration
  const handleRegenerate = useCallback(() => {
    setShowResults(false);
    setGeneratedImages([]);
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-border flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span>العودة</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-purple-blue flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold neon-text">استوديو الإبداع</h1>
        </div>

        <Link to="/gallery" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <FolderOpen className="w-5 h-5" />
          <span>المعرض</span>
        </Link>
      </header>

      {/* Main Content - 3 Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Actions */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 border-l border-border panel"
        >
          <ActionPanel
            selectedAction={selectedAction}
            onSelectAction={handleSelectAction}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            canGenerate={canGenerate}
          />
        </motion.aside>

        {/* Center Panel - Chat */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 border-l border-border"
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            referenceImages={referenceImages}
          />
        </motion.main>

        {/* Right Panel - References */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-72 panel"
        >
          <ReferencePanel
            images={referenceImages}
            onImagesChange={setReferenceImages}
          />
        </motion.aside>
      </div>

      {/* Generation Results Modal */}
      <GenerationResult
        images={generatedImages}
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        onRegenerate={handleRegenerate}
        isRegenerating={isGenerating}
      />
    </div>
  );
}
