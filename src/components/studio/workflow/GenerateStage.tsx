import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Loader2, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GenerationJob, GeneratedAsset, AssetType } from '@/types/workflow';

interface GenerateStageProps {
  jobs: GenerationJob[];
  assets: GeneratedAsset[];
  onGenerate: (type: AssetType, count?: number) => void;
  onContinue: () => void;
  isGenerating: boolean;
}

export function GenerateStage({
  jobs,
  assets,
  onGenerate,
  onContinue,
  isGenerating,
}: GenerateStageProps) {
  const [selectedType, setSelectedType] = useState<AssetType>('image');
  const [count, setCount] = useState(4);

  const activeJobs = jobs.filter(j => j.status === 'processing' || j.status === 'queued');
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const failedJobs = jobs.filter(j => j.status === 'failed');

  const overallProgress = jobs.length > 0
    ? Math.round((completedJobs.length / jobs.length) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1">إنشاء المحتوى</h3>
        <p className="text-sm text-muted-foreground">
          اختر نوع المحتوى وعدد النسخ المطلوبة
        </p>
      </div>

      {/* Content Type Selection */}
      {!isGenerating && assets.length === 0 && (
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => setSelectedType('image')}
              className={cn(
                "p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3",
                selectedType === 'image'
                  ? "border-primary bg-primary/10 neon-glow-purple"
                  : "border-border bg-card/50 hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">صور</h4>
                <p className="text-xs text-muted-foreground">صور احترافية للحملة</p>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setSelectedType('video')}
              className={cn(
                "p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3",
                selectedType === 'video'
                  ? "border-primary bg-primary/10 neon-glow-purple"
                  : "border-border bg-card/50 hover:border-primary/50"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Video className="w-6 h-6 text-accent" />
              </div>
              <div className="text-center">
                <h4 className="font-semibold">فيديو</h4>
                <p className="text-xs text-muted-foreground">فيديو ترويجي قصير</p>
              </div>
            </motion.button>
          </div>

          {/* Count Selection for Images */}
          {selectedType === 'image' && (
            <div className="space-y-3">
              <label className="text-sm font-medium">عدد الصور</label>
              <div className="flex gap-2">
                {[2, 4, 6, 8].map((num) => (
                  <Button
                    key={num}
                    variant={count === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCount(num)}
                    className={cn(
                      "flex-1",
                      count === num && "neon-glow-purple"
                    )}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => onGenerate(selectedType, selectedType === 'image' ? count : 1)}
            className="w-full neon-button"
            size="lg"
          >
            <Sparkles className="w-4 h-4 ml-2" />
            بدء الإنشاء
          </Button>
        </div>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <div className="space-y-6 mb-6">
          <div className="glass-card p-6 text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </motion.div>
            <h4 className="font-semibold mb-2">جارٍ الإنشاء...</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {completedJobs.length} من {jobs.length} مكتمل
            </p>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Job Status List */}
          <div className="space-y-2">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  job.status === 'completed' && "bg-green-500/10",
                  job.status === 'processing' && "bg-primary/10",
                  job.status === 'failed' && "bg-destructive/10",
                  job.status === 'queued' && "bg-secondary/50"
                )}
              >
                {job.status === 'completed' && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
                {job.status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {job.status === 'failed' && (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
                {job.status === 'queued' && (
                  <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                )}
                <span className="text-sm flex-1">
                  {job.jobType === 'image' ? 'صورة' : 'فيديو'} #{index + 1}
                </span>
                <Badge variant="outline" className="text-xs">
                  {job.status === 'completed' && 'مكتمل'}
                  {job.status === 'processing' && 'جارٍ'}
                  {job.status === 'queued' && 'في الانتظار'}
                  {job.status === 'failed' && 'فشل'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Assets Preview */}
      {assets.length > 0 && !isGenerating && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">المحتوى المُنشأ ({assets.length})</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGenerate(selectedType, selectedType === 'image' ? count : 1)}
            >
              <RefreshCw className="w-4 h-4 ml-1" />
              إنشاء المزيد
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-border group"
              >
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={asset.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 right-2 left-2 flex gap-1">
                    {asset.qualityScore && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(asset.qualityScore)}% جودة
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {assets.length > 0 && !isGenerating && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button onClick={onContinue} className="w-full neon-button">
            متابعة للمراجعة
          </Button>
        </div>
      )}
    </div>
  );
}
