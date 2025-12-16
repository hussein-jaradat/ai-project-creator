import { useState, useCallback } from "react";

export type IdeaType = "product-ad" | "cinematic" | "social-media" | "visual-identity";
export type ContentType = "ad" | "promo" | "cinematic" | "reel";
export type MoodType = "luxury" | "minimal" | "energetic" | "warm";
export type PlatformType = "instagram" | "tiktok" | "shorts";
export type ThemeType = "minimal-studio" | "cinematic-dark" | "lifestyle-daylight" | "luxury-editorial";
export type CaptionTone = "marketing" | "creative" | "emotional" | "concise";

export interface CreativeState {
  step: number;
  idea: IdeaType | null;
  contentType: ContentType | null;
  mood: MoodType | null;
  platform: PlatformType | null;
  uploadedImages: string[];
  projectDescription: string;
  brandStyle: string | null;
  suggestedLighting: string | null;
  theme: ThemeType | null;
  generatedImages: GeneratedImage[];
  generatedVideo: string | null;
  isGenerating: boolean;
  generationPhase: string;
}

export interface GeneratedImage {
  url: string;
  caption: string;
  captionTone: CaptionTone;
}

const initialState: CreativeState = {
  step: 1,
  idea: null,
  contentType: null,
  mood: null,
  platform: null,
  uploadedImages: [],
  projectDescription: "",
  brandStyle: null,
  suggestedLighting: null,
  theme: null,
  generatedImages: [],
  generatedVideo: null,
  isGenerating: false,
  generationPhase: "",
};

export function useCreativeWorkflow() {
  const [state, setState] = useState<CreativeState>(initialState);

  const setIdea = useCallback((idea: IdeaType) => {
    setState(prev => ({ ...prev, idea }));
  }, []);

  const setContentType = useCallback((contentType: ContentType) => {
    setState(prev => ({ ...prev, contentType }));
  }, []);

  const setMood = useCallback((mood: MoodType) => {
    setState(prev => ({ ...prev, mood }));
  }, []);

  const setPlatform = useCallback((platform: PlatformType) => {
    setState(prev => ({ ...prev, platform }));
  }, []);

  const setUploadedImages = useCallback((images: string[]) => {
    setState(prev => ({ ...prev, uploadedImages: images }));
  }, []);

  const setProjectDescription = useCallback((projectDescription: string) => {
    setState(prev => ({ ...prev, projectDescription }));
  }, []);

  const setBrandAnalysis = useCallback((brandStyle: string, suggestedLighting: string) => {
    setState(prev => ({ ...prev, brandStyle, suggestedLighting }));
  }, []);

  const setTheme = useCallback((theme: ThemeType) => {
    setState(prev => ({ ...prev, theme }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.min(prev.step + 1, 7) }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
  }, []);

  const setGenerating = useCallback((isGenerating: boolean, phase: string = "") => {
    setState(prev => ({ ...prev, isGenerating, generationPhase: phase }));
  }, []);

  const setGeneratedImages = useCallback((images: GeneratedImage[]) => {
    setState(prev => ({ ...prev, generatedImages: images }));
  }, []);

  const setGeneratedVideo = useCallback((video: string | null) => {
    setState(prev => ({ ...prev, generatedVideo: video }));
  }, []);

  const updateImageCaption = useCallback((index: number, caption: string, tone: CaptionTone) => {
    setState(prev => ({
      ...prev,
      generatedImages: prev.generatedImages.map((img, i) => 
        i === index ? { ...img, caption, captionTone: tone } : img
      )
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setIdea,
    setContentType,
    setMood,
    setPlatform,
    setUploadedImages,
    setProjectDescription,
    setBrandAnalysis,
    setTheme,
    nextStep,
    prevStep,
    goToStep,
    setGenerating,
    setGeneratedImages,
    setGeneratedVideo,
    updateImageCaption,
    reset,
  };
}
