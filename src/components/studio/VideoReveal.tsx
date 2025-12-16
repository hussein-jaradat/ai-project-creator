import { motion } from "framer-motion";
import { Play, RefreshCw, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface VideoRevealProps {
  videoUrl: string | null;
  onRegenerate: () => void;
  onBack: () => void;
}

export function VideoReveal({ videoUrl, onRegenerate, onBack }: VideoRevealProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3">الفيديو الترويجي</h2>
          <p className="text-muted-foreground text-lg">Your Promotional Video</p>
        </motion.div>

        {/* Video Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 mb-8"
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
              poster=""
            />
          ) : (
            // Mock video preview
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
              >
                <Play className="w-10 h-10 text-primary ml-1" />
              </motion.div>
              
              <p className="text-lg font-medium mb-2">معاينة الفيديو</p>
              <p className="text-sm text-muted-foreground">Video Preview (Coming Soon)</p>
              
              {/* Mock timeline */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary/50"
                    initial={{ width: "0%" }}
                    animate={{ width: "30%" }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>0:00</span>
                  <span>0:06</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Smart Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/50 rounded-xl p-6 border border-border/50 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">اقتراحات ذكية</h3>
              <p className="text-sm text-muted-foreground">Smart Suggestions</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="w-full text-right p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm">
              "هل تريد أسلوب سينمائي أكثر دراماتيكية؟"
            </button>
            <button className="w-full text-right p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm">
              "هذا الأسلوب يحقق أداء عالي في Instagram Reels"
            </button>
            <button className="w-full text-right p-3 rounded-lg hover:bg-muted/50 transition-colors text-sm">
              "جرب نص ترويجي جريء"
            </button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصور
          </button>
          
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة توليد الفيديو
          </button>
          
          <Link
            to="/"
            className="px-8 py-3 rounded-full font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            إنهاء ✓
          </Link>
        </motion.div>

        {/* Footer message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          محتوى جاهز للنشر • احفظ النتيجة
        </motion.p>
      </div>
    </div>
  );
}
