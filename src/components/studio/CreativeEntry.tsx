import { motion } from "framer-motion";
import { Sparkles, Camera, Film, Palette } from "lucide-react";
import { IdeaType } from "@/hooks/useCreativeWorkflow";

interface CreativeEntryProps {
  selectedIdea: IdeaType | null;
  onSelectIdea: (idea: IdeaType) => void;
  onContinue: () => void;
}

const ideas = [
  {
    id: "product-ad" as IdeaType,
    title: "إعلان منتج احترافي",
    subtitle: "Professional Product Ad",
    icon: Sparkles,
    gradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
  },
  {
    id: "cinematic" as IdeaType,
    title: "تصوير سينمائي",
    subtitle: "Cinematic Photography",
    icon: Film,
    gradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    id: "social-media" as IdeaType,
    title: "محتوى سوشال ميديا",
    subtitle: "Social Media Content",
    icon: Camera,
    gradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    id: "visual-identity" as IdeaType,
    title: "هوية بصرية فاخرة",
    subtitle: "Premium Visual Identity",
    icon: Palette,
    gradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/30",
  },
];

export function CreativeEntry({ selectedIdea, onSelectIdea, onContinue }: CreativeEntryProps) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            خلّينا نخلق محتوى يليق بمشروعك
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            اختر الفكرة… والباقي علينا
          </p>
        </motion.div>

        {/* Idea Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {ideas.map((idea, index) => (
            <motion.button
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              onClick={() => onSelectIdea(idea.id)}
              className={`
                relative p-6 rounded-2xl border backdrop-blur-sm
                transition-all duration-300 text-right
                ${selectedIdea === idea.id 
                  ? `bg-gradient-to-br ${idea.gradient} ${idea.borderColor} border-2 scale-[1.02]` 
                  : "bg-card/50 border-border/50 hover:border-border hover:bg-card/80"
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${selectedIdea === idea.id ? `bg-gradient-to-br ${idea.gradient}` : "bg-muted"}
                `}>
                  <idea.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground">{idea.subtitle}</p>
                </div>
              </div>
              
              {selectedIdea === idea.id && (
                <motion.div
                  layoutId="selected-idea"
                  className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedIdea ? 1 : 0.5 }}
          onClick={onContinue}
          disabled={!selectedIdea}
          className={`
            px-8 py-4 rounded-full font-medium text-lg
            bg-gradient-to-r from-primary to-primary/80
            text-primary-foreground
            transition-all duration-300
            ${selectedIdea ? "hover:scale-105 hover:shadow-lg hover:shadow-primary/25" : "cursor-not-allowed"}
          `}
        >
          Continue →
        </motion.button>
      </div>
    </div>
  );
}
