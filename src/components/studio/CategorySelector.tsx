import { motion } from "framer-motion";
import { ReferenceCategory, CATEGORY_CONFIG } from "@/types/reference";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategorySelectorProps {
  isOpen: boolean;
  onSelect: (category: ReferenceCategory) => void;
  onClose: () => void;
  previewUrl?: string;
}

export function CategorySelector({ isOpen, onSelect, onClose, previewUrl }: CategorySelectorProps) {
  const categories = Object.entries(CATEGORY_CONFIG) as [ReferenceCategory, typeof CATEGORY_CONFIG[ReferenceCategory]][];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center">
            حدد نوع هذه الصورة
          </DialogTitle>
        </DialogHeader>
        
        {previewUrl && (
          <div className="w-full h-32 rounded-lg overflow-hidden bg-secondary mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-2">
          {categories.map(([key, config], index) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(key)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-all
                hover:scale-[1.02] active:scale-[0.98]
                ${config.color}
              `}
            >
              <span className="text-xl">{config.icon}</span>
              <span className="font-medium">{config.label}</span>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
