import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/studio/ChatMessage";
import { ChatInput } from "@/components/studio/ChatInput";
import { GeneratedContent } from "@/components/studio/GeneratedContent";
import { useChat } from "@/hooks/useChat";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Sparkles, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Studio() {
  const { t, dir } = useLanguage();
  const { messages, isLoading, summary, readyToGenerate, sendMessage, resetChat } = useChat();
  const { images, isGenerating, generateImages, clearImages } = useImageGeneration();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGenerate = async () => {
    if (summary) {
      await generateImages(summary);
    }
  };

  const handleRegenerate = async () => {
    if (summary) {
      clearImages();
      await generateImages(summary);
    }
  };

  const handleReset = () => {
    resetChat();
    clearImages();
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="h-6 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ContentAI Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <LanguageToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-border/50 min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">
                    {dir === "rtl" ? "حوّل مشروعك من فكرة إلى واقع" : "Transform Your Ideas Into Content"}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {dir === "rtl" 
                      ? "أخبرني عن مشروعك وسأساعدك في إنشاء محتوى إعلاني احترافي"
                      : "Tell me about your business and I'll help you create professional marketing content."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      dir === "rtl" ? "لدي متجر إلكتروني" : "I have an online store",
                      dir === "rtl" ? "أريد إعلان لمنتج جديد" : "I want an ad for a new product",
                      dir === "rtl" ? "محتوى لإنستغرام" : "Content for Instagram",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => sendMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                isStreaming={isLoading && index === messages.length - 1 && message.role === "assistant"}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/50">
            {readyToGenerate && !isGenerating && images.length === 0 && (
              <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {dir === "rtl" ? "جاهز للتوليد!" : "Ready to Generate!"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dir === "rtl" 
                        ? "اضغط على الزر لإنشاء المحتوى الخاص بك"
                        : "Click the button to create your content"}
                    </p>
                  </div>
                  <Button onClick={handleGenerate} className="rounded-full gap-2">
                    <Sparkles className="w-4 h-4" />
                    {dir === "rtl" ? "ابدأ التوليد" : "Generate"}
                  </Button>
                </div>
              </div>
            )}
            <ChatInput
              onSend={sendMessage}
              disabled={isLoading || isGenerating}
              placeholder={dir === "rtl" ? "أخبرني عن مشروعك..." : "Tell me about your business..."}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 min-h-0 lg:max-w-xl xl:max-w-2xl bg-muted/30">
          <GeneratedContent
            images={images}
            isGenerating={isGenerating}
            onRegenerate={handleRegenerate}
            summary={summary}
          />
        </div>
      </div>
    </div>
  );
}
