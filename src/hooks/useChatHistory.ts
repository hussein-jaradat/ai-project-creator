import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Load messages for a specific conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error loading messages:", error);
      return [];
    }
  }, []);

  // Create new conversation
  const createConversation = useCallback(async (title?: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({ title: title || null })
        .select()
        .single();

      if (error) throw error;
      
      setConversations((prev) => [data, ...prev]);
      setCurrentConversationId(data.id);
      return data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  }, []);

  // Save message to conversation
  const saveMessage = useCallback(async (
    conversationId: string,
    role: "user" | "assistant",
    content: string
  ) => {
    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          role,
          content,
        });

      if (error) throw error;

      // Update conversation timestamp and title (from first user message)
      const updateData: { updated_at: string; title?: string } = {
        updated_at: new Date().toISOString(),
      };

      // Set title from first user message if not set
      if (role === "user") {
        const conversation = conversations.find((c) => c.id === conversationId);
        if (conversation && !conversation.title) {
          updateData.title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
        }
      }

      await supabase
        .from("chat_conversations")
        .update(updateData)
        .eq("id", conversationId);

      // Refresh conversations list
      loadConversations();
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }, [conversations, loadConversations]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }, [currentConversationId]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    isLoadingHistory,
    loadConversations,
    loadMessages,
    createConversation,
    saveMessage,
    deleteConversation,
  };
}
