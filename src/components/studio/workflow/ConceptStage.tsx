import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Palette, Zap, MessageSquare, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CreativeStrategy, EnergyLevel } from '@/types/workflow';

interface ConceptStageProps {
  strategy: CreativeStrategy;
  onRefine: (updates: Partial<CreativeStrategy>) => void;
  onContinue: () => void;
  onBack: () => void;
}

const MOOD_OPTIONS = [
  { value: 'luxury', label: 'فاخر', icon: '💎' },
  { value: 'minimal', label: 'بسيط', icon: '⬜' },
  { value: 'bold', label: 'جريء', icon: '🔥' },
  { value: 'warm', label: 'دافئ', icon: '☀️' },
  { value: 'cool', label: 'بارد', icon: '❄️' },
  { value: 'playful', label: 'مرح', icon: '🎨' },
  { value: 'professional', label: 'احترافي', icon: '💼' },
  { value: 'artistic', label: 'فني', icon: '🎭' },
];

const ENERGY_LEVELS: { value: EnergyLevel; label: string; position: number }[] = [
  { value: 'calm', label: 'هادئ', position: 0 },
  { value: 'moderate', label: 'متوازن', position: 33 },
  { value: 'energetic', label: 'نشيط', position: 66 },
  { value: 'intense', label: 'مكثف', position: 100 },
];

export function ConceptStage({ strategy, onRefine, onContinue, onBack }: ConceptStageProps) {
  const [customNotes, setCustomNotes] = useState('');
  
  const currentEnergyIndex = ENERGY_LEVELS.findIndex(e => e.value === strategy.energyLevel);
  const energyValue = currentEnergyIndex >= 0 ? ENERGY_LEVELS[currentEnergyIndex].position : 33;

  const handleEnergyChange = (values: number[]) => {
    const value = values[0];
    let newEnergy: EnergyLevel = 'moderate';
    
    if (value <= 16) newEnergy = 'calm';
    else if (value <= 50) newEnergy = 'moderate';
    else if (value <= 83) newEnergy = 'energetic';
    else newEnergy = 'intense';
    
    onRefine({ energyLevel: newEnergy });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Selected Strategy Summary */}
      <div className="glass-card p-4 mb-6 border-primary/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">✨</span>
          <h3 className="font-bold">{strategy.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{strategy.hookIdea}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <Label className="text-base font-semibold">المزاج والشعور</Label>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <motion.button
                key={mood.value}
                onClick={() => onRefine({ mood: mood.value })}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1",
                  strategy.mood === mood.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{mood.icon}</span>
                <span className="text-xs">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <Label className="text-base font-semibold">مستوى الطاقة</Label>
          </div>
          
          <div className="px-2">
            <Slider
              value={[energyValue]}
              onValueChange={handleEnergyChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              {ENERGY_LEVELS.map((level) => (
                <span
                  key={level.value}
                  className={cn(
                    "text-xs transition-colors",
                    strategy.energyLevel === level.value
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {level.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Style Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-green-400" />
            <Label className="text-base font-semibold">النمط البصري</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/30">
              <span className="text-xs text-muted-foreground block mb-1">الأسلوب</span>
              <span className="text-sm font-medium">{strategy.visualStyle}</span>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <span className="text-xs text-muted-foreground block mb-1">الزاوية</span>
              <span className="text-sm font-medium">{strategy.contentAngle}</span>
            </div>
          </div>
        </div>

        {/* Custom Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-400" />
            <Label className="text-base font-semibold">ملاحظات إضافية</Label>
          </div>
          
          <Textarea
            placeholder="أضف أي تعليقات أو تعديلات تريدها على المفهوم..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            className="bg-secondary/50 min-h-[80px]"
          />
        </div>

        {/* Current Configuration Summary */}
        <div className="glass-card p-4 border-accent/30">
          <h4 className="text-sm font-semibold mb-3">ملخص الإعدادات</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {strategy.mood || 'luxury'}
            </Badge>
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              {ENERGY_LEVELS.find(e => e.value === strategy.energyLevel)?.label || 'متوازن'}
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {strategy.visualStyle}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={onBack} className="flex-1">
          العودة
        </Button>
        <Button onClick={onContinue} className="flex-1 neon-button">
          <ChevronLeft className="w-4 h-4 mr-2" />
          بدء الإنشاء
        </Button>
      </div>
    </div>
  );
}
