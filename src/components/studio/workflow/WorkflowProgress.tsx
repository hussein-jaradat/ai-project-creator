import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowStage, STAGE_ORDER, STAGE_LABELS } from '@/types/workflow';

interface WorkflowProgressProps {
  currentStage: WorkflowStage;
  onStageClick?: (stage: WorkflowStage) => void;
  completedStages?: WorkflowStage[];
}

export function WorkflowProgress({ currentStage, onStageClick, completedStages = [] }: WorkflowProgressProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="w-full py-4 px-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-4 right-8 left-8 h-0.5 bg-border" />
        
        {/* Active progress line */}
        <motion.div
          className="absolute top-4 right-8 h-0.5 bg-gradient-to-l from-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (STAGE_ORDER.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ maxWidth: 'calc(100% - 4rem)' }}
        />

        {STAGE_ORDER.map((stage, index) => {
          const isCompleted = completedStages.includes(stage) || index < currentIndex;
          const isCurrent = stage === currentStage;
          const isPast = index < currentIndex;
          const isFuture = index > currentIndex;

          return (
            <motion.button
              key={stage}
              onClick={() => onStageClick?.(stage)}
              disabled={isFuture && !completedStages.includes(stage)}
              className={cn(
                "relative z-10 flex flex-col items-center gap-2 transition-all duration-300",
                isFuture && !completedStages.includes(stage) && "opacity-40 cursor-not-allowed",
                (isPast || isCurrent) && "cursor-pointer"
              )}
              whileHover={!isFuture ? { scale: 1.05 } : {}}
              whileTap={!isFuture ? { scale: 0.95 } : {}}
            >
              {/* Circle indicator */}
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted && "bg-primary border-primary",
                  isCurrent && "bg-primary/20 border-primary neon-glow-purple",
                  isFuture && "bg-card border-border"
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : isCurrent ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground" />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors",
                  isCurrent && "text-primary",
                  isPast && "text-foreground",
                  isFuture && "text-muted-foreground"
                )}
              >
                {STAGE_LABELS[stage].ar}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
