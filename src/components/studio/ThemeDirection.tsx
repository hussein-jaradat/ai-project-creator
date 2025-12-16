import { motion } from "framer-motion";
import { ThemeType } from "@/hooks/useCreativeWorkflow";

interface ThemeDirectionProps {
  selectedTheme: ThemeType | null;
  onSelectTheme: (theme: ThemeType) => void;
  onContinue: () => void;
  onBack: () => void;
}

const themes = [
  {
    id: "minimal-studio" as ThemeType,
    title: "Minimal Studio",
    titleAr: "استوديو بسيط",
    description: "Clean backgrounds, soft shadows, product focus",
    gradient: "from-slate-100 to-slate-200",
    darkGradient: "from-slate-800 to-slate-900",
    accent: "bg-slate-500",
  },
  {
    id: "cinematic-dark" as ThemeType,
    title: "Cinematic Dark",
    titleAr: "سينمائي داكن",
    description: "Dramatic lighting, deep shadows, moody atmosphere",
    gradient: "from-zinc-800 to-black",
    darkGradient: "from-zinc-900 to-black",
    accent: "bg-amber-500",
  },
  {
    id: "lifestyle-daylight" as ThemeType,
    title: "Lifestyle Daylight",
    titleAr: "نهاري طبيعي",
    description: "Natural light, warm tones, everyday scenes",
    gradient: "from-amber-50 to-orange-100",
    darkGradient: "from-amber-900/30 to-orange-900/30",
    accent: "bg-orange-500",
  },
  {
    id: "luxury-editorial" as ThemeType,
    title: "Luxury Editorial",
    titleAr: "فاخر تحريري",
    description: "High-end aesthetic, elegant composition, rich details",
    gradient: "from-stone-200 to-stone-300",
    darkGradient: "from-stone-800 to-stone-900",
    accent: "bg-amber-600",
  },
];

export function ThemeDirection({
  selectedTheme,
  onSelectTheme,
  onContinue,
  onBack,
}: ThemeDirectionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">اختر الاتجاه البصري</h2>
          <p className="text-muted-foreground">Select your visual direction</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {themes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectTheme(theme.id)}
              className="group relative text-left"
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl border-2 transition-all duration-500
                  ${selectedTheme === theme.id 
                    ? "border-primary scale-[1.02]" 
                    : "border-transparent hover:border-border"
                  }
                `}
              >
                {/* Preview Area */}
                <div className={`
                  h-48 bg-gradient-to-br ${theme.darkGradient}
                  transition-all duration-500 relative overflow-hidden
                `}>
                  {/* Animated glow on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.2) 0%, transparent 70%)`,
                    }}
                  />
                  
                  {/* Sample shapes for visual interest */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className={`w-20 h-20 rounded-lg ${theme.accent} opacity-80`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  </div>

                  {/* Subtle grid pattern */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-5 bg-card/80 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-1">{theme.titleAr}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>

                {/* Selected indicator */}
                {selectedTheme === theme.id && (
                  <motion.div
                    layoutId="theme-selected"
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    initial={false}
                  >
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center mt-12"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          
          <button
            onClick={onContinue}
            disabled={!selectedTheme}
            className={`
              px-8 py-3 rounded-full font-medium
              bg-gradient-to-r from-primary to-primary/80
              text-primary-foreground
              transition-all duration-300
              ${selectedTheme ? "hover:scale-105 hover:shadow-lg hover:shadow-primary/25" : "opacity-50 cursor-not-allowed"}
            `}
          >
            ابدأ التوليد →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
