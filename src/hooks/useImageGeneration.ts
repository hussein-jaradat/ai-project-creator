import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`;

type Summary = {
  business: string;
  content_type: string;
  mood: string;
  platform: string;
  visual_direction: string;
};

export function useImageGeneration() {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImages = useCallback(async (summary: Summary, count: number = 4) => {
    setIsGenerating(true);
    setImages([]);

    const prompts = [
      `Main product showcase for ${summary.business}. ${summary.visual_direction}. Hero shot with perfect lighting.`,
      `Lifestyle shot showing ${summary.business} in use. ${summary.visual_direction}. Real-world context.`,
      `Close-up detail shot of ${summary.business}. ${summary.visual_direction}. Highlight quality and craftsmanship.`,
      `Brand atmosphere image for ${summary.business}. ${summary.visual_direction}. Mood and emotion focused.`,
    ];

    const results: string[] = [];

    for (let i = 0; i < Math.min(count, prompts.length); i++) {
      try {
        const resp = await fetch(GENERATE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            prompt: prompts[i],
            mood: summary.mood,
            platform: summary.platform,
            business: summary.business,
          }),
        });

        if (!resp.ok) {
          const error = await resp.json();
          console.error("Image generation error:", error);
          continue;
        }

        const data = await resp.json();
        if (data.imageUrl) {
          results.push(data.imageUrl);
          setImages([...results]);
        }
      } catch (error) {
        console.error("Image generation failed:", error);
      }
    }

    if (results.length === 0) {
      toast({
        title: "Generation Failed",
        description: "Could not generate images. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Images Generated",
        description: `Successfully created ${results.length} images.`,
      });
    }

    setIsGenerating(false);
    return results;
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  return {
    images,
    isGenerating,
    generateImages,
    clearImages,
  };
}
