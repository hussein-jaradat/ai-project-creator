import { useState } from "react";
import { X, Download, Copy, RefreshCw, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeneratedImage {
  url: string;
  caption: string;
}

interface GenerationResultProps {
  images: GeneratedImage[];
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function GenerationResult({ 
  images, 
  isOpen, 
  onClose, 
  onRegenerate,
  isRegenerating 
}: GenerationResultProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const selectedImage = images[selectedIndex];

  const handleCopyCaption = async () => {
    if (!selectedImage?.caption) return;
    await navigator.clipboard.writeText(selectedImage.caption);
    setCopiedCaption(true);
    toast.success("تم نسخ التعليق");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleDownload = async () => {
    if (!selectedImage?.url) return;
    
    try {
      const response = await fetch(selectedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${selectedIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("تم تحميل الصورة");
    } catch (error) {
      toast.error("فشل في تحميل الصورة");
    }
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-secondary neon-glow-purple"
          >
            <img
              src={selectedImage?.url}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details Panel */}
          <div className="flex flex-col">
            {/* Title */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold neon-text mb-2">النتيجة</h2>
              <p className="text-muted-foreground">صورة {selectedIndex + 1} من {images.length}</p>
            </div>

            {/* Caption */}
            <div className="flex-1 mb-6">
              <div className="p-4 rounded-xl bg-secondary/50 border border-border h-full">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">التعليق</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCaption}
                    className="h-8 px-3"
                  >
                    {copiedCaption ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedImage?.caption || "جارٍ توليد التعليق..."}
                </p>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {images.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    aspect-square rounded-lg overflow-hidden border-2 transition-all
                    ${selectedIndex === index 
                      ? "border-primary neon-glow-purple" 
                      : "border-transparent opacity-60 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 h-12 bg-gradient-purple-blue hover:opacity-90"
              >
                <Download className="w-5 h-5 ml-2" />
                تحميل الصورة
              </Button>
              <Button
                variant="outline"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="h-12 px-4 border-border hover:border-primary"
              >
                {isRegenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
