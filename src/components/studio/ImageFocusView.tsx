import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, RefreshCw, Check } from "lucide-react";
import { GeneratedImage, CaptionTone } from "@/hooks/useCreativeWorkflow";
import { toast } from "sonner";

interface ImageFocusViewProps {
  image: GeneratedImage;
  index: number;
  onClose: () => void;
  onRegenerateCaption: (tone: CaptionTone) => void;
  isRegenerating?: boolean;
}

const captionTones: { id: CaptionTone; label: string; labelAr: string }[] = [
  { id: "marketing", label: "Marketing", labelAr: "تسويقي" },
  { id: "creative", label: "Creative", labelAr: "إبداعي" },
  { id: "emotional", label: "Emotional", labelAr: "عاطفي" },
  { id: "concise", label: "Concise", labelAr: "مختصر" },
];

export function ImageFocusView({
  image,
  index,
  onClose,
  onRegenerateCaption,
  isRegenerating,
}: ImageFocusViewProps) {
  const [copied, setCopied] = useState(false);

  const copyCaption = async () => {
    await navigator.clipboard.writeText(image.caption);
    setCopied(true);
    toast.success("تم نسخ النص");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadWithCaption = async () => {
    try {
      // Download image
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `creative-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Download caption as txt
      const captionBlob = new Blob([image.caption], { type: "text/plain;charset=utf-8" });
      const captionUrl = URL.createObjectURL(captionBlob);
      const captionLink = document.createElement("a");
      captionLink.href = captionUrl;
      captionLink.download = `creative-${index + 1}-caption.txt`;
      document.body.appendChild(captionLink);
      captionLink.click();
      document.body.removeChild(captionLink);
      URL.revokeObjectURL(captionUrl);

      toast.success("تم تحميل الصورة والنص");
    } catch (error) {
      toast.error("فشل التحميل");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-6"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <motion.img
              src={image.url}
              alt=""
              className="w-full h-full object-cover"
              layoutId={`image-${index}`}
            />
          </div>

          {/* Caption & Actions */}
          <div className="flex flex-col">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                النص الإبداعي
              </h3>
              
              <div className="bg-card rounded-xl p-6 border border-border/50 mb-6">
                {isRegenerating ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-xl leading-relaxed" dir="rtl">
                    {image.caption || "جاري توليد النص..."}
                  </p>
                )}
              </div>

              {/* Tone selector */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  أسلوب النص
                </h4>
                <div className="flex flex-wrap gap-2">
                  {captionTones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => onRegenerateCaption(tone.id)}
                      disabled={isRegenerating}
                      className={`
                        px-4 py-2 rounded-full text-sm transition-all
                        ${image.captionTone === tone.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                        }
                        ${isRegenerating ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {tone.labelAr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={copyCaption}
                disabled={!image.caption || isRegenerating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                نسخ النص
              </button>
              
              <button
                onClick={downloadWithCaption}
                disabled={!image.caption || isRegenerating}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                حفظ الكل
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
