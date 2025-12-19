import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Package, Check, Smartphone, Monitor, Square,
  FileArchive, Loader2, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { GeneratedAsset, ExportPackage, Platform, PLATFORM_PRESETS } from '@/types/workflow';

interface ExportStageProps {
  assets: GeneratedAsset[];
  exports: ExportPackage[];
  onExport: (platform: string, assetIds: string[]) => void;
  onDownloadAll: () => void;
  isExporting: boolean;
}

const EXPORT_PLATFORMS = [
  { 
    id: 'instagram-post', 
    name: 'Instagram Post', 
    icon: '📸', 
    size: '1080×1080',
    platform: 'instagram' as Platform
  },
  { 
    id: 'instagram-story', 
    name: 'Instagram Story', 
    icon: '📱', 
    size: '1080×1920',
    platform: 'instagram' as Platform
  },
  { 
    id: 'instagram-reel', 
    name: 'Instagram Reel', 
    icon: '🎬', 
    size: '1080×1920',
    platform: 'instagram' as Platform
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: '🎵', 
    size: '1080×1920',
    platform: 'tiktok' as Platform
  },
  { 
    id: 'facebook-post', 
    name: 'Facebook Post', 
    icon: '👍', 
    size: '1200×630',
    platform: 'facebook' as Platform
  },
  { 
    id: 'youtube-short', 
    name: 'YouTube Shorts', 
    icon: '▶️', 
    size: '1080×1920',
    platform: 'youtube' as Platform
  },
  { 
    id: 'youtube-thumbnail', 
    name: 'YouTube Thumbnail', 
    icon: '🖼️', 
    size: '1280×720',
    platform: 'youtube' as Platform
  },
  { 
    id: 'twitter-post', 
    name: 'X / Twitter', 
    icon: '🐦', 
    size: '1200×675',
    platform: 'twitter' as Platform
  },
  { 
    id: 'linkedin-post', 
    name: 'LinkedIn', 
    icon: '💼', 
    size: '1200×627',
    platform: 'linkedin' as Platform
  },
];

export function ExportStage({
  assets,
  exports,
  onExport,
  onDownloadAll,
  isExporting,
}: ExportStageProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    assets.filter(a => a.isApproved).map(a => a.id)
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  const approvedAssets = assets.filter(a => a.isApproved);

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev =>
      prev.includes(formatId) ? prev.filter(f => f !== formatId) : [...prev, formatId]
    );
  };

  const handleExport = () => {
    selectedFormats.forEach(format => {
      onExport(format, selectedAssets);
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1">تصدير المحتوى</h3>
        <p className="text-sm text-muted-foreground">
          اختر الأصول والمنصات للتصدير
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Asset Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">المحتوى المعتمد</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedAssets.length === approvedAssets.length) {
                  setSelectedAssets([]);
                } else {
                  setSelectedAssets(approvedAssets.map(a => a.id));
                }
              }}
            >
              {selectedAssets.length === approvedAssets.length ? 'إلغاء الكل' : 'تحديد الكل'}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {approvedAssets.map((asset, index) => (
              <motion.button
                key={asset.id}
                onClick={() => toggleAsset(asset.id)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  selectedAssets.includes(asset.id)
                    ? "border-primary"
                    : "border-border opacity-50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={`Asset ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={asset.url}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {selectedAssets.includes(asset.id) && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-3">
          <span className="text-sm font-medium">صيغ التصدير</span>
          
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_PLATFORMS.map((platform) => (
              <motion.button
                key={platform.id}
                onClick={() => toggleFormat(platform.id)}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all flex items-center gap-3",
                  selectedFormats.includes(platform.id)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/50"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="text-xl">{platform.icon}</span>
                <div className="flex-1 text-right">
                  <span className="text-sm font-medium block">{platform.name}</span>
                  <span className="text-xs text-muted-foreground">{platform.size}</span>
                </div>
                {selectedFormats.includes(platform.id) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Export History */}
        {exports.length > 0 && (
          <div className="space-y-3">
            <span className="text-sm font-medium">التصديرات السابقة</span>
            
            <div className="space-y-2">
              {exports.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <FileArchive className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{exp.name}</span>
                    <span className="text-xs text-muted-foreground block">
                      {exp.assets.length} عنصر
                    </span>
                  </div>
                  {exp.downloadUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={exp.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="mt-6 pt-4 border-t border-border space-y-3">
        <Button
          onClick={handleExport}
          disabled={selectedAssets.length === 0 || selectedFormats.length === 0 || isExporting}
          className="w-full neon-button"
          size="lg"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جارٍ التصدير...
            </>
          ) : (
            <>
              <Package className="w-4 h-4 ml-2" />
              تصدير {selectedAssets.length} عنصر إلى {selectedFormats.length} منصة
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onDownloadAll}
          disabled={approvedAssets.length === 0}
          className="w-full"
        >
          <Download className="w-4 h-4 ml-2" />
          تحميل الكل (ZIP)
        </Button>
      </div>
    </div>
  );
}
