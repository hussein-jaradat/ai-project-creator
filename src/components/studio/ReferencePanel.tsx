import { useState, useCallback } from "react";
import { Upload, X, ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReferencePanelProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  viewingMode?: boolean;
}

export function ReferencePanel({ images, onImagesChange, viewingMode = false }: ReferencePanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          if (newImages.length === files.length) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const removeImage = useCallback((index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  }, [images, onImagesChange]);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">المراجع</h3>
        <p className="text-sm text-muted-foreground">ارفع صور منتجك أو لوجو</p>
      </div>

      {/* Upload Area */}
      {!viewingMode && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative flex-shrink-0 border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-4
            ${isDragging 
              ? "border-primary bg-primary/10" 
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
            }
          `}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground">
            اسحب الصور هنا أو اضغط للرفع
          </p>
        </div>
      )}

      {/* Images Grid */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-secondary"
                >
                  <img
                    src={img}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {!viewingMode && (
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 left-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-xs">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
              
              {/* Add More Button */}
              {!viewingMode && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </label>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                لم يتم رفع صور بعد
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Counter */}
      {images.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {images.length} صور مرفوعة
          </p>
        </div>
      )}
    </div>
  );
}
