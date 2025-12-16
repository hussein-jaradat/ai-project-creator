import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

type MessageContent = 
  | string
  | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;

type Message = {
  role: "user" | "assistant";
  content: MessageContent;
};

type Summary = {
  business: string;
  content_type: string;
  mood: string;
  platform: string;
  visual_direction: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [readyToGenerate, setReadyToGenerate] = useState(false);

  const parseJsonFromContent = (content: string) => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.ready_to_generate && parsed.summary) {
          setSummary(parsed.summary);
          setReadyToGenerate(true);
        }
      } catch (e) {
        console.error("Failed to parse JSON from response:", e);
      }
    }
  };

  const getDisplayContent = (content: MessageContent): string => {
    if (typeof content === "string") return content;
    const textPart = content.find((p) => p.type === "text");
    return textPart && "text" in textPart ? textPart.text : "";
  };

  const sendMessage = useCallback(async (input: string, images?: string[]) => {
    // Build message content
    let userContent: MessageContent;
    if (images && images.length > 0) {
      userContent = [
        { type: "text", text: input || "Here are my product images:" },
        ...images.map((img) => ({
          type: "image_url" as const,
          image_url: { url: img },
        })),
      ];
    } else {
      userContent = input;
    }

    const userMsg: Message = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    
    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      // Prepare messages for API - convert to the format expected by the backend
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "Chat request failed");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse for JSON summary
      parseJsonFromContent(assistantContent);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setSummary(null);
    setReadyToGenerate(false);
  }, []);

  return {
    messages,
    isLoading,
    summary,
    readyToGenerate,
    sendMessage,
    resetChat,
    getDisplayContent,
  };
}
