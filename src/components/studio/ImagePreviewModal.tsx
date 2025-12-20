import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ReferenceImage, CATEGORY_CONFIG } from "@/types/reference";
import { Badge } from "@/components/ui/badge";

interface ImagePreviewModalProps {
  image: ReferenceImage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImagePreviewModal({ image, isOpen, onClose }: ImagePreviewModalProps) {
  if (!image) return null;

  const categoryConfig = CATEGORY_CONFIG[image.category];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 left-0 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-secondary shadow-2xl">
              <img
                src={image.url}
                alt="Preview"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              {/* Info bar */}
              <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border flex items-center justify-between" dir="rtl">
                <div className="flex items-center gap-3">
                  <Badge className={categoryConfig.color}>
                    <span className="ml-1">{categoryConfig.icon}</span>
                    {categoryConfig.label}
                  </Badge>
                  
                  <span className="text-sm text-muted-foreground">
                    الأولوية: {image.priority + 1}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${image.enabled ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                  <span className="text-sm text-muted-foreground">
                    {image.enabled ? 'مفعل للتوليد' : 'معطل'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
