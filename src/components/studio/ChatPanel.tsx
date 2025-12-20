import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, User, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OBrainLogo } from "@/components/OBrainLogo";
import { OBrainIcon } from "@/components/OBrainIcon";
import { ReferenceImage } from "@/types/reference";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  referenceImages: ReferenceImage[];
  hasError?: boolean;
  onRetry?: () => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function ChatPanel({ messages, onSendMessage, isLoading, referenceImages, hasError, onRetry }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput("");
  }, [input, isLoading, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <OBrainLogo size="sm" />
          <div>
            <h3 className="font-semibold text-foreground">OBrain</h3>
            <p className="text-xs text-muted-foreground">مساعدك الإبداعي</p>
          </div>
          {referenceImages.filter(img => img.enabled).length > 0 && (
            <div className="mr-auto flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 text-xs text-primary">
              <Sparkles className="w-3 h-3" />
              {referenceImages.filter(img => img.enabled).length} صور للتحليل
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            <div className="mb-6">
              <OBrainLogo size="lg" className="animate-glow mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">مرحباً! أنا OBrain</h3>
            <p className="text-muted-foreground max-w-md">
              ارفع صور منتجك على اليمين، ثم اختر نوع المحتوى على اليسار وسأساعدك في إنشاء محتوى احترافي
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden
                  ${message.role === "user" ? "bg-primary/20" : ""}
                `}>
                  {message.role === "user" 
                    ? <User className="w-4 h-4 text-primary" />
                    : <OBrainIcon size="sm" />
                  }
                </div>

                {/* Message Bubble */}
                <div className={`
                  max-w-[80%] px-4 py-3 rounded-2xl
                  ${message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                `}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <OBrainIcon size="sm" />
            <div className="chat-bubble-ai px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">يفكر...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error with Retry Button */}
        {hasError && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <p className="text-sm text-destructive">حدث خطأ في المحادثة</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </Button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك..."
            className="flex-1 min-h-[48px] max-h-[120px] resize-none bg-secondary border-border focus:border-primary"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-xl bg-gradient-purple-blue hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
