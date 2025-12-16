import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadStepProps {
  uploadedImages: string[];
  projectDescription: string;
  brandStyle: string | null;
  suggestedLighting: string | null;
  onImagesChange: (images: string[]) => void;
  onProjectDescriptionChange: (description: string) => void;
  onBrandAnalysis: (brandStyle: string, lighting: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ImageUploadStep({
  uploadedImages,
  projectDescription,
  brandStyle,
  suggestedLighting,
  onImagesChange,
  onProjectDescriptionChange,
  onBrandAnalysis,
  onContinue,
  onBack,
}: ImageUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImages = useCallback(async (images: string[]) => {
    if (images.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this product image briefly. Return ONLY a JSON object with two fields: brandStyle (2-3 words describing the brand aesthetic like 'Premium Modern', 'Luxury Minimal', 'Bold Energetic') and suggestedLighting (2-3 words like 'Soft cinematic', 'Bright natural', 'Dramatic studio'). No other text." },
                ...images.slice(0, 2).map(img => ({
                  type: "image_url" as const,
                  image_url: { url: img }
                }))
              ]
            }
          ]
        }
      });

      if (data && !error) {
        const responseText = typeof data === "string" ? data : data.content || "";
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            onBrandAnalysis(
              analysis.brandStyle || "Premium Modern",
              analysis.suggestedLighting || "Soft cinematic"
            );
          }
        } catch {
          onBrandAnalysis("Premium Modern", "Soft cinematic");
        }
      }
    } catch (err) {
      console.error("Analysis error:", err);
      onBrandAnalysis("Premium Modern", "Soft cinematic");
    } finally {
      setIsAnalyzing(false);
    }
  }, [onBrandAnalysis]);

  const handleFiles = useCallback(async (files: FileList) => {
    const newImages: string[] = [];
    
    for (let i = 0; i < Math.min(files.length, 4 - uploadedImages.length); i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        newImages.push(base64);
      }
    }
    
    const allImages = [...uploadedImages, ...newImages];
    onImagesChange(allImages);
    
    if (newImages.length > 0) {
      analyzeImages(allImages);
    }
  }, [uploadedImages, onImagesChange, analyzeImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removeImage = useCallback((index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [uploadedImages, onImagesChange]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">شاركنا صور منتجك</h2>
          <p className="text-muted-foreground">Upload your product images for AI analysis</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-2xl p-8
                transition-all duration-300 cursor-pointer
                ${isDragging 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-border"
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                <motion.div
                  animate={{ scale: isDragging ? 1.1 : 1 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Upload className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="font-medium mb-1">اسحب الصور هنا</p>
                <p className="text-sm text-muted-foreground">أو اضغط للاختيار (حتى 4 صور)</p>
              </div>
            </div>

            {/* Uploaded Images Grid */}
            <AnimatePresence>
              {uploadedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-3 mt-4"
                >
                  {uploadedImages.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6"
            >
              <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">أخبرنا عن مشروعك</h3>
                    <p className="text-sm text-muted-foreground">Tell us about your project idea</p>
                  </div>
                </div>
                <textarea
                  value={projectDescription}
                  onChange={(e) => onProjectDescriptionChange(e.target.value)}
                  placeholder="اكتب وصفاً لفكرتك أو منتجك... مثال: متجر عطور فاخرة يستهدف الشباب العصري، نريد محتوى راقي يعكس الأناقة والجرأة..."
                  className="w-full h-32 bg-background/50 border border-border/50 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
                  dir="auto"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  كلما كان الوصف أدق، كانت النتائج أفضل ✨
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 backdrop-blur-sm h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                {isAnalyzing ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
              </div>

              <h3 className="text-lg font-medium mb-6">تحليل الذكاء الاصطناعي</h3>

              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
                </div>
              ) : brandStyle ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">أسلوب العلامة التجارية</p>
                    <p className="text-xl font-semibold">{brandStyle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الإضاءة المقترحة</p>
                    <p className="text-xl font-semibold">{suggestedLighting}</p>
                  </div>
                </motion.div>
              ) : (
                <p className="text-muted-foreground">
                  ارفع صورة لبدء التحليل...
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-12"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          
          <button
            onClick={onContinue}
            className="px-8 py-3 rounded-full font-medium bg-gradient-to-r from-primary to-primary/80 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
