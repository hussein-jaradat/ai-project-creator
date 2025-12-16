import { useState, useCallback } from "react";
import { useCreativeWorkflow, GeneratedImage, CaptionTone } from "@/hooks/useCreativeWorkflow";
import { CreativeEntry } from "@/components/studio/CreativeEntry";
import { IntentSetup } from "@/components/studio/IntentSetup";
import { ImageUploadStep } from "@/components/studio/ImageUploadStep";
import { ThemeDirection } from "@/components/studio/ThemeDirection";
import { CreationMoment } from "@/components/studio/CreationMoment";
import { ImageReveal } from "@/components/studio/ImageReveal";
import { ImageFocusView } from "@/components/studio/ImageFocusView";
import { VideoReveal } from "@/components/studio/VideoReveal";
import { toast } from "sonner";

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;
const CAPTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-caption`;

export default function Studio() {
  const workflow = useCreativeWorkflow();
  const { state } = workflow;
  
  const [focusedImageIndex, setFocusedImageIndex] = useState<number | null>(null);
  const [isRegeneratingCaption, setIsRegeneratingCaption] = useState(false);

  const buildPrompt = useCallback(() => {
    const { idea, contentType, mood, platform, brandStyle, theme, uploadedImages } = state;
    
    const ideaMap = {
      "product-ad": "professional product advertisement",
      "cinematic": "cinematic photography",
      "social-media": "social media content",
      "visual-identity": "premium visual identity",
    };
    
    const moodMap = {
      luxury: "luxurious, high-end, elegant",
      minimal: "minimal, clean, simple",
      energetic: "energetic, vibrant, dynamic",
      warm: "warm, inviting, cozy",
    };
    
    const themeMap = {
      "minimal-studio": "clean studio background, soft shadows, product focus",
      "cinematic-dark": "dramatic lighting, deep shadows, moody atmosphere",
      "lifestyle-daylight": "natural light, warm tones, lifestyle setting",
      "luxury-editorial": "editorial style, elegant composition, luxury aesthetic",
    };

    let prompt = `Create a ${ideaMap[idea!]} image.`;
    prompt += ` Style: ${contentType}, ${moodMap[mood!]}.`;
    prompt += ` Visual direction: ${themeMap[theme!]}.`;
    prompt += ` For ${platform}.`;
    if (brandStyle) prompt += ` Brand style: ${brandStyle}.`;
    prompt += ` Ultra high quality, professional marketing image.`;
    
    return prompt;
  }, [state]);

  const generateCaption = useCallback(async (imageUrl: string, tone: CaptionTone): Promise<string> => {
    try {
      const response = await fetch(CAPTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          tone,
          mood: state.mood,
          platform: state.platform,
          brandStyle: state.brandStyle,
        }),
      });
      
      if (!response.ok) throw new Error("Caption generation failed");
      
      const data = await response.json();
      return data.caption || "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح.";
    } catch (error) {
      console.error("Caption error:", error);
      return "تفاصيل بسيطة، حضور قوي — لأن الأناقة تبدأ من الاختيار الصحيح.";
    }
  }, [state.mood, state.platform, state.brandStyle]);

  const handleGenerate = useCallback(async () => {
    workflow.goToStep(5);
    workflow.setGenerating(true, "analyzing");

    try {
      const prompt = buildPrompt();
      const images: GeneratedImage[] = [];

      // Generate 4 images
      for (let i = 0; i < 4; i++) {
        workflow.setGenerating(true, `Generating image ${i + 1}/4...`);
        
        const response = await fetch(GENERATE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `${prompt} Variation ${i + 1}.`,
            mood: state.mood,
            platform: state.platform,
            business: state.brandStyle || "premium brand",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Generation failed");
        }

        const data = await response.json();
        if (data.image) {
          // Generate caption for each image
          const caption = await generateCaption(data.image, "marketing");
          images.push({
            url: data.image,
            caption,
            captionTone: "marketing",
          });
        }
      }

      if (images.length === 0) {
        throw new Error("No images generated");
      }

      workflow.setGeneratedImages(images);
      workflow.setGenerating(false);
      workflow.goToStep(6);
      toast.success("تم توليد الصور بنجاح!");
    } catch (error) {
      console.error("Generation error:", error);
      workflow.setGenerating(false);
      workflow.goToStep(4);
      toast.error(error instanceof Error ? error.message : "فشل في توليد الصور");
    }
  }, [workflow, buildPrompt, state.mood, state.platform, state.brandStyle, generateCaption]);

  const handleRegenerateCaption = useCallback(async (tone: CaptionTone) => {
    if (focusedImageIndex === null) return;
    
    setIsRegeneratingCaption(true);
    const image = state.generatedImages[focusedImageIndex];
    const newCaption = await generateCaption(image.url, tone);
    workflow.updateImageCaption(focusedImageIndex, newCaption, tone);
    setIsRegeneratingCaption(false);
  }, [focusedImageIndex, state.generatedImages, generateCaption, workflow]);

  const handleRegenerate = useCallback(() => {
    workflow.setGeneratedImages([]);
    handleGenerate();
  }, [workflow, handleGenerate]);

  // Render based on current step
  return (
    <div className="min-h-screen bg-background">
      {state.step === 1 && (
        <CreativeEntry
          selectedIdea={state.idea}
          onSelectIdea={workflow.setIdea}
          onContinue={() => workflow.nextStep()}
        />
      )}

      {state.step === 2 && (
        <IntentSetup
          contentType={state.contentType}
          mood={state.mood}
          platform={state.platform}
          onSetContentType={workflow.setContentType}
          onSetMood={workflow.setMood}
          onSetPlatform={workflow.setPlatform}
          onContinue={() => workflow.nextStep()}
          onBack={() => workflow.prevStep()}
        />
      )}

      {state.step === 3 && (
        <ImageUploadStep
          uploadedImages={state.uploadedImages}
          brandStyle={state.brandStyle}
          suggestedLighting={state.suggestedLighting}
          onImagesChange={workflow.setUploadedImages}
          onBrandAnalysis={workflow.setBrandAnalysis}
          onContinue={() => workflow.nextStep()}
          onBack={() => workflow.prevStep()}
        />
      )}

      {state.step === 4 && (
        <ThemeDirection
          selectedTheme={state.theme}
          onSelectTheme={workflow.setTheme}
          onContinue={handleGenerate}
          onBack={() => workflow.prevStep()}
        />
      )}

      {state.step === 5 && state.isGenerating && (
        <CreationMoment phase={state.generationPhase} />
      )}

      {state.step === 6 && (
        <ImageReveal
          images={state.generatedImages}
          onImageClick={setFocusedImageIndex}
          onRegenerate={handleRegenerate}
          onContinue={() => workflow.nextStep()}
        />
      )}

      {state.step === 7 && (
        <VideoReveal
          videoUrl={state.generatedVideo}
          onRegenerate={() => {}}
          onBack={() => workflow.prevStep()}
        />
      )}

      {/* Image Focus View Modal */}
      {focusedImageIndex !== null && state.generatedImages[focusedImageIndex] && (
        <ImageFocusView
          image={state.generatedImages[focusedImageIndex]}
          index={focusedImageIndex}
          onClose={() => setFocusedImageIndex(null)}
          onRegenerateCaption={handleRegenerateCaption}
          isRegenerating={isRegeneratingCaption}
        />
      )}
    </div>
  );
}
