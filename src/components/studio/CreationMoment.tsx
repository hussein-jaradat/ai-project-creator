import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CreationMomentProps {
  phase: string;
}

const phases = [
  { text: "جاري تحليل الرؤية الإبداعية...", textEn: "Analyzing creative vision..." },
  { text: "تصميم التكوين البصري...", textEn: "Designing visual composition..." },
  { text: "موازنة الإضاءة والظلال...", textEn: "Balancing lighting and shadows..." },
  { text: "صقل أجواء العلامة التجارية...", textEn: "Refining brand atmosphere..." },
  { text: "إنهاء اللمسات الأخيرة...", textEn: "Finalizing details..." },
];

export function CreationMoment({ phase }: CreationMomentProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Main animation */}
        <motion.div
          className="relative w-40 h-40 mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-primary/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner ring */}
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-primary/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Center pulse */}
          <motion.div
            className="absolute inset-12 rounded-full bg-gradient-to-br from-primary to-primary/50"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                top: "50%",
                left: "50%",
              }}
              animate={{
                x: [0, Math.cos(i * 60 * Math.PI / 180) * 80],
                y: [0, Math.sin(i * 60 * Math.PI / 180) * 80],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Phase text */}
        <div className="h-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-2">
                {phases[currentPhase].text}
              </h2>
              <p className="text-muted-foreground">
                {phases[currentPhase].textEn}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <motion.div
          className="h-1 bg-muted rounded-full overflow-hidden mt-8 max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 15, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Subtle message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          className="text-sm text-muted-foreground mt-8"
        >
          دع الذكاء الاصطناعي يعمل عنك
        </motion.p>
      </div>
    </div>
  );
}
