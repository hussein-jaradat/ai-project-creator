import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Play, Check, Loader2, ImageIcon, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface GeneratedContentProps {
  images: string[];
  isGenerating: boolean;
  onRegenerate: () => void;
  summary: {
    business: string;
    content_type: string;
    mood: string;
    platform: string;
  } | null;
}

export function GeneratedContent({ images, isGenerating, onRegenerate, summary }: GeneratedContentProps) {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const toggleSelect = (index: number) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `contentai-image-${index + 1}.png`;
    link.click();
  };

  if (!summary && images.length === 0 && !isGenerating) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Your Content Will Appear Here</h3>
          <p className="text-muted-foreground text-sm">
            Chat with our AI to describe your business and goals. Once ready, click Generate to create real images.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      {summary && (
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Generated Content</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={isGenerating}
              className="rounded-full"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isGenerating && "animate-spin")} />
              Regenerate
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">{summary.content_type}</Badge>
            <Badge variant="outline" className="capitalize">{summary.mood}</Badge>
            <Badge variant="outline" className="capitalize">{summary.platform}</Badge>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <ImageIcon className="absolute inset-0 m-auto w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Creating Your Content</h3>
              <p className="text-muted-foreground text-sm">
                AI is generating professional images...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Images Grid */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Generated Images ({images.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image, index) => (
                    <Card
                      key={index}
                      className={cn(
                        "relative overflow-hidden cursor-pointer group transition-all hover:ring-2 hover:ring-primary/50 rounded-xl",
                        selectedImages.includes(index) && "ring-2 ring-primary"
                      )}
                      onClick={() => toggleSelect(index)}
                    >
                      <div className="aspect-square">
                        <img
                          src={image}
                          alt={`Generated content ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Selection indicator */}
                      <div
                        className={cn(
                          "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                          selectedImages.includes(index)
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/80 text-foreground opacity-0 group-hover:opacity-100"
                        )}
                      >
                        {selectedImages.includes(index) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>

                      {/* Download button */}
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image, index);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Mock Video Section */}
            {images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Video Preview
                </h4>
                <Card className="relative overflow-hidden rounded-xl aspect-video bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                      <p className="text-sm text-muted-foreground">Video Generation Coming Soon</p>
                      <Badge variant="outline" className="mt-2">Preview Only</Badge>
                    </div>
                  </div>
                  {images[0] && (
                    <img
                      src={images[0]}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover opacity-30"
                    />
                  )}
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
