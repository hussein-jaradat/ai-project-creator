import { Image, Video, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type ActionType = "image" | "video" | null;

interface ActionPanelProps {
  selectedAction: ActionType;
  onSelectAction: (action: ActionType) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  viewingMode?: boolean;
}

export function ActionPanel({ 
  selectedAction, 
  onSelectAction, 
  isGenerating, 
  onGenerate,
  canGenerate,
  viewingMode = false
}: ActionPanelProps) {
  const isDisabled = viewingMode || isGenerating;
  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">الإجراءات</h3>
        <p className="text-sm text-muted-foreground">اختر نوع المحتوى</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Create Image */}
        <motion.button
          whileHover={{ scale: isDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
          onClick={() => !viewingMode && onSelectAction("image")}
          disabled={isDisabled}
          className={`
            w-full p-4 rounded-xl border-2 transition-all text-right
            ${selectedAction === "image"
              ? "border-primary bg-primary/10 neon-glow-purple"
              : "border-border bg-secondary/30 hover:border-primary/50"
            }
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${selectedAction === "image" 
                ? "bg-gradient-purple-blue" 
                : "bg-secondary"
              }
            `}>
              <Image className={`w-6 h-6 ${selectedAction === "image" ? "text-primary-foreground" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">إنشاء صورة</h4>
              <p className="text-xs text-muted-foreground">صور احترافية لمنتجك</p>
            </div>
          </div>
        </motion.button>

        {/* Create Video */}
        <motion.button
          whileHover={{ scale: isDisabled ? 1 : 1.02 }}
          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
          onClick={() => !viewingMode && onSelectAction("video")}
          disabled={isDisabled}
          className={`
            w-full p-4 rounded-xl border-2 transition-all text-right
            ${selectedAction === "video"
              ? "border-accent bg-accent/10 neon-glow-cyan"
              : "border-border bg-secondary/30 hover:border-accent/50"
            }
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${selectedAction === "video" 
                ? "bg-accent" 
                : "bg-secondary"
              }
            `}>
              <Video className={`w-6 h-6 ${selectedAction === "video" ? "text-accent-foreground" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">إنشاء فيديو</h4>
              <p className="text-xs text-muted-foreground">فيديو إعلاني قصير</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Generate Button */}
      {selectedAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: canGenerate ? 1.02 : 1 }}
            whileTap={{ scale: canGenerate ? 0.98 : 1 }}
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className={`
              w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
              ${canGenerate && !isGenerating
                ? "neon-button text-primary-foreground"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جارٍ الإنشاء...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                ابدأ الإنشاء
              </>
            )}
          </motion.button>

          {!canGenerate && !isGenerating && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              تحدث مع المساعد أولاً للحصول على الموافقة
            </p>
          )}
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedAction === "image" 
                ? "سيتم إنشاء 4 صور احترافية بناءً على محادثتك مع المساعد"
                : selectedAction === "video"
                ? "سيتم إنشاء فيديو إعلاني قصير (تجريبي)"
                : "اختر نوع المحتوى ثم تحدث مع المساعد لبدء الإنشاء"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
