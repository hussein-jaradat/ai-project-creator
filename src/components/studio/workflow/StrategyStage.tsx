import { motion } from 'framer-motion';
import { Sparkles, Check, Loader2, Lightbulb, Palette, Target, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreativeStrategy } from '@/types/workflow';

interface StrategyStageProps {
  strategies: CreativeStrategy[];
  selectedStrategy: CreativeStrategy | null;
  onSelectStrategy: (id: string) => void;
  onContinue: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

const ENERGY_COLORS: Record<string, string> = {
  calm: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  moderate: 'bg-green-500/20 text-green-400 border-green-500/30',
  energetic: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  intense: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const ENERGY_LABELS: Record<string, string> = {
  calm: 'هادئ',
  moderate: 'متوازن',
  energetic: 'نشيط',
  intense: 'مكثف',
};

export function StrategyStage({
  strategies,
  selectedStrategy,
  onSelectStrategy,
  onContinue,
  onRegenerate,
  isLoading,
}: StrategyStageProps) {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">جارٍ إنشاء الاستراتيجيات...</h3>
          <p className="text-sm text-muted-foreground">
            OBrain يحلل بياناتك ويبتكر أفكاراً إبداعية مخصصة
          </p>
        </div>
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Lightbulb className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-2">لم يتم إنشاء استراتيجيات بعد</h3>
          <p className="text-sm text-muted-foreground mb-4">
            تحدث مع المدير الإبداعي لإنشاء استراتيجيات مخصصة لحملتك
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1">الاستراتيجيات المقترحة</h3>
        <p className="text-sm text-muted-foreground">
          اختر الاتجاه الإبداعي الأنسب لحملتك
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => onSelectStrategy(strategy.id)}
              className={cn(
                "w-full text-right p-5 rounded-xl border-2 transition-all duration-300",
                selectedStrategy?.id === strategy.id
                  ? "border-primary bg-primary/5 neon-glow-purple"
                  : "border-border bg-card/50 hover:border-primary/50 hover:bg-card"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">✨</span>
                    <h4 className="font-bold text-lg">{strategy.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {strategy.aiReasoning}
                  </p>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedStrategy?.id === strategy.id
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}>
                  {selectedStrategy?.id === strategy.id && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                  <Palette className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">النمط البصري</span>
                    <span className="text-sm font-medium">{strategy.visualStyle}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30">
                  <Target className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">زاوية المحتوى</span>
                    <span className="text-sm font-medium">{strategy.contentAngle}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 col-span-2">
                  <MessageSquare className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground block">فكرة الهوك</span>
                    <span className="text-sm font-medium">{strategy.hookIdea}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={ENERGY_COLORS[strategy.energyLevel]}>
                    {ENERGY_LABELS[strategy.energyLevel]}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/50">
                    {strategy.mood}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  "{strategy.exampleHeadline}"
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={onRegenerate} className="flex-1">
          <Sparkles className="w-4 h-4 ml-2" />
          أفكار جديدة
        </Button>
        <Button
          onClick={onContinue}
          disabled={!selectedStrategy}
          className="flex-1 neon-button"
        >
          متابعة
        </Button>
      </div>
    </div>
  );
}
