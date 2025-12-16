import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";
  
  // Remove JSON blocks from display
  const displayContent = content.replace(/```json[\s\S]*?```/g, "").trim();

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-2xl animate-fade-in",
        isUser 
          ? "bg-primary/10 ml-8" 
          : "bg-muted/50 mr-8"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1 text-muted-foreground">
          {isUser ? "You" : "ContentAI"}
        </p>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {displayContent}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
