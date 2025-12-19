import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Star, RefreshCw, Sparkles, ChevronLeft, ChevronRight,
  MessageSquare, Download, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { GeneratedAsset, Caption } from '@/types/workflow';

interface IterateStageProps {
  assets: GeneratedAsset[];
  captions: Caption[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onFavorite: (id: string, isFavorite: boolean) => void;
  onRegenerate: (id: string) => void;
  onGenerateCaption: (assetId: string) => void;
  onSelectCaption: (assetId: string, captionId: string) => void;
  onContinue: () => void;
  isGeneratingCaption: boolean;
}

export function IterateStage({
  assets,
  captions,
  onApprove,
  onReject,
  onFavorite,
  onRegenerate,
  onGenerateCaption,
  onSelectCaption,
  onContinue,
  isGeneratingCaption,
}: IterateStageProps) {
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);

  const approvedCount = assets.filter(a => a.isApproved).length;
  const currentAsset = assets[selectedAssetIndex];
  const assetCaptions = captions.filter(c => c.id.startsWith(currentAsset?.id || ''));

  const navigateAsset = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedAssetIndex > 0) {
      setSelectedAssetIndex(prev => prev - 1);
    } else if (direction === 'next' && selectedAssetIndex < assets.length - 1) {
      setSelectedAssetIndex(prev => prev + 1);
    }
  };

  if (assets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">لا يوجد محتوى للمراجعة</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Progress Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">مراجعة المحتوى</h3>
          <Badge variant="secondary">
            {approvedCount} / {assets.length} معتمد
          </Badge>
        </div>
        <div className="flex gap-1">
          {assets.map((asset, index) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetIndex(index)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                index === selectedAssetIndex && "bg-primary",
                asset.isApproved && index !== selectedAssetIndex && "bg-green-500",
                !asset.isApproved && index !== selectedAssetIndex && "bg-border"
              )}
            />
          ))}
        </div>
      </div>

      {/* Main Asset View */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAsset.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full flex flex-col"
          >
            {/* Asset Preview */}
            <div className="relative flex-1 rounded-xl overflow-hidden border border-border bg-secondary/30">
              {currentAsset.type === 'image' ? (
                <img
                  src={currentAsset.url}
                  alt="Asset preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={currentAsset.url}
                  className="w-full h-full object-contain"
                  controls
                />
              )}

              {/* Expand Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 left-2"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  {currentAsset.type === 'image' ? (
                    <img
                      src={currentAsset.url}
                      alt="Full preview"
                      className="w-full h-auto"
                    />
                  ) : (
                    <video
                      src={currentAsset.url}
                      className="w-full"
                      controls
                      autoPlay
                    />
                  )}
                </DialogContent>
              </Dialog>

              {/* Navigation Arrows */}
              {selectedAssetIndex > 0 && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => navigateAsset('prev')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              {selectedAssetIndex < assets.length - 1 && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => navigateAsset('next')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}

              {/* Status Badge */}
              {currentAsset.isApproved && (
                <Badge className="absolute top-2 right-2 bg-green-500">
                  <Check className="w-3 h-3 ml-1" />
                  معتمد
                </Badge>
              )}

              {/* Quality Issues */}
              {currentAsset.qualityIssues && currentAsset.qualityIssues.length > 0 && (
                <div className="absolute bottom-2 right-2 left-2">
                  <div className="glass-card p-2 text-xs">
                    <span className="text-yellow-400">⚠️ ملاحظات:</span>
                    <span className="text-muted-foreground mr-1">
                      {currentAsset.qualityIssues.join('، ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Caption Section */}
            {showCaptionEditor && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">النص التسويقي</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onGenerateCaption(currentAsset.id)}
                    disabled={isGeneratingCaption}
                  >
                    <Sparkles className="w-3 h-3 ml-1" />
                    توليد جديد
                  </Button>
                </div>
                
                {assetCaptions.length > 0 ? (
                  <div className="space-y-2">
                    {assetCaptions.map((caption) => (
                      <button
                        key={caption.id}
                        onClick={() => onSelectCaption(currentAsset.id, caption.id)}
                        className={cn(
                          "w-full text-right p-3 rounded-lg border transition-all",
                          caption.isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-secondary/30 hover:border-primary/50"
                        )}
                      >
                        <p className="text-sm">{caption.text}</p>
                        {caption.hashtags.length > 0 && (
                          <p className="text-xs text-primary mt-2">
                            {caption.hashtags.map(h => `#${h}`).join(' ')}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    placeholder="أضف نص تسويقي..."
                    className="bg-secondary/50"
                  />
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-3">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant={currentAsset.isFavorite ? "default" : "outline"}
            size="sm"
            onClick={() => onFavorite(currentAsset.id, !currentAsset.isFavorite)}
            className="flex-1"
          >
            <Star className={cn("w-4 h-4 ml-1", currentAsset.isFavorite && "fill-current")} />
            مفضل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCaptionEditor(!showCaptionEditor)}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 ml-1" />
            نص
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerate(currentAsset.id)}
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 ml-1" />
            إعادة
          </Button>
        </div>

        {/* Approve/Reject */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onReject(currentAsset.id)}
            className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 ml-1" />
            رفض
          </Button>
          <Button
            onClick={() => onApprove(currentAsset.id)}
            className={cn(
              "flex-1",
              currentAsset.isApproved ? "bg-green-500 hover:bg-green-600" : "neon-button"
            )}
          >
            <Check className="w-4 h-4 ml-1" />
            {currentAsset.isApproved ? 'معتمد' : 'اعتماد'}
          </Button>
        </div>
      </div>

      {/* Continue to Export */}
      {approvedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button onClick={onContinue} className="w-full neon-button">
            <Download className="w-4 h-4 ml-2" />
            تصدير {approvedCount} عنصر
          </Button>
        </div>
      )}
    </div>
  );
}
