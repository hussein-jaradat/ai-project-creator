import { useState, useCallback } from "react";
import { Upload, ImageIcon, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ReferenceImage, ReferenceCategory } from "@/types/reference";
import { ReferenceImageCard } from "./ReferenceImageCard";
import { CategorySelector } from "./CategorySelector";
import { ImagePreviewModal } from "./ImagePreviewModal";

interface ReferencePanelProps {
  images: ReferenceImage[];
  onImagesChange: (images: ReferenceImage[]) => void;
}

export function ReferencePanel({ images, onImagesChange }: ReferencePanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [previewImage, setPreviewImage] = useState<ReferenceImage | null>(null);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPendingImage(result);
      setShowCategorySelector(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCategorySelect = useCallback((category: ReferenceCategory) => {
    if (!pendingImage) return;

    const newImage: ReferenceImage = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: pendingImage,
      category,
      enabled: true,
      priority: images.length,
    };

    onImagesChange([...images, newImage]);
    setPendingImage(null);
    setShowCategorySelector(false);
  }, [pendingImage, images, onImagesChange]);

  const handleToggleEnabled = useCallback((id: string) => {
    onImagesChange(
      images.map(img => 
        img.id === id ? { ...img, enabled: !img.enabled } : img
      )
    );
  }, [images, onImagesChange]);

  const handleRemove = useCallback((id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // Re-calculate priorities
    const reordered = filtered.map((img, index) => ({ ...img, priority: index }));
    onImagesChange(reordered);
  }, [images, onImagesChange]);

  const handleReorder = useCallback((newOrder: ReferenceImage[]) => {
    const reordered = newOrder.map((img, index) => ({ ...img, priority: index }));
    onImagesChange(reordered);
  }, [onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const enabledCount = images.filter(img => img.enabled).length;

  return (
    <div className="h-full flex flex-col p-4" dir="rtl">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">المراجع</h3>
        <p className="text-sm text-muted-foreground">ارفع صور منتجك أو لوجو</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative flex-shrink-0 border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer mb-4
          ${isDragging 
            ? "border-primary bg-primary/10" 
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Upload className={`w-6 h-6 mx-auto mb-1 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-xs text-muted-foreground">
          اسحب صورة هنا أو اضغط للرفع
        </p>
      </div>

      {/* Smart Alert when no images */}
      <AnimatePresence>
        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4"
          >
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-400 font-medium">لم يتم رفع مراجع بعد</p>
              <p className="text-xs text-amber-400/70 mt-0.5">قد يؤثر ذلك على جودة النتائج</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Images List */}
      <div className="flex-1 overflow-y-auto">
        {images.length > 0 ? (
          <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-2">
            {images.map((image) => (
              <Reorder.Item key={image.id} value={image}>
                <ReferenceImageCard
                  image={image}
                  onToggleEnabled={handleToggleEnabled}
                  onRemove={handleRemove}
                  onPreview={setPreviewImage}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">
              لم يتم رفع صور بعد
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      {images.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            {enabledCount} صور مفعلة من {images.length}
          </p>
        </div>
      )}

      {/* Category Selector Modal */}
      <CategorySelector
        isOpen={showCategorySelector}
        onSelect={handleCategorySelect}
        onClose={() => {
          setShowCategorySelector(false);
          setPendingImage(null);
        }}
        previewUrl={pendingImage || undefined}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
