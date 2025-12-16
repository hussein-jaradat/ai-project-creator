import { motion } from "framer-motion";
import { Download, ZoomIn, RefreshCw } from "lucide-react";
import { GeneratedImage } from "@/hooks/useCreativeWorkflow";

interface ImageRevealProps {
  images: GeneratedImage[];
  onImageClick: (index: number) => void;
  onRegenerate: () => void;
  onContinue: () => void;
}

export function ImageReveal({ images, onImageClick, onRegenerate, onContinue }: ImageRevealProps) {
  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `creative-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3">هذه هي رؤيتك البصرية</h2>
          <p className="text-muted-foreground text-lg">Your Visual Vision</p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer"
              onClick={() => onImageClick(index)}
            >
              <img
                src={image.url}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(image.url, index);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick(index);
                  }}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Caption preview */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm line-clamp-2 text-right" dir="rtl">
                    {image.caption}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة التوليد
          </button>
          
          <button
            onClick={onContinue}
            className="px-8 py-3 rounded-full font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            متابعة للفيديو →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
