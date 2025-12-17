import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Trash2, Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Conversation } from "@/hooks/useChatHistory";

interface ChatHistoryProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatHistory({
  conversations,
  currentConversationId,
  isLoading,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ChatHistoryProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await onDeleteConversation(id);
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "اليوم";
    if (days === 1) return "أمس";
    if (days < 7) return `منذ ${days} أيام`;
    return date.toLocaleDateString("ar-SA");
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 200 }}
        animate={{ width: 48 }}
        className="h-full border-l border-border bg-card/50 flex flex-col items-center py-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewConversation}
          className="text-primary"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 48 }}
      animate={{ width: 200 }}
      className="h-full border-l border-border bg-card/50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">المحادثات</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-7 w-7"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewConversation}
          className="w-full gap-2 text-xs"
        >
          <Plus className="w-3 h-3" />
          محادثة جديدة
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 px-2">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">
                لا توجد محادثات سابقة
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {conversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "group relative p-2 rounded-lg cursor-pointer transition-colors",
                    currentConversationId === conv.id
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-secondary text-foreground"
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {conv.title || "محادثة جديدة"}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDate(conv.updated_at)}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, conv.id)}
                    disabled={deletingId === conv.id}
                    className={cn(
                      "absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      "text-destructive hover:text-destructive hover:bg-destructive/20"
                    )}
                  >
                    {deletingId === conv.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
