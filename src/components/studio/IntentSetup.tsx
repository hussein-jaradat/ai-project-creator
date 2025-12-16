import { motion } from "framer-motion";
import { ContentType, MoodType, PlatformType } from "@/hooks/useCreativeWorkflow";
import { Film, Megaphone, Clapperboard, Play, Gem, Minus, Zap, Sun, Instagram, Music2, Youtube } from "lucide-react";

interface IntentSetupProps {
  contentType: ContentType | null;
  mood: MoodType | null;
  platform: PlatformType | null;
  onSetContentType: (type: ContentType) => void;
  onSetMood: (mood: MoodType) => void;
  onSetPlatform: (platform: PlatformType) => void;
  onContinue: () => void;
  onBack: () => void;
}

const contentTypes = [
  { id: "ad" as ContentType, label: "Ad", labelAr: "إعلان", icon: Megaphone },
  { id: "promo" as ContentType, label: "Promo", labelAr: "ترويج", icon: Film },
  { id: "cinematic" as ContentType, label: "Cinematic", labelAr: "سينمائي", icon: Clapperboard },
  { id: "reel" as ContentType, label: "Reel", labelAr: "ريل", icon: Play },
];

const moods = [
  { id: "luxury" as MoodType, label: "Luxury", labelAr: "فاخر", icon: Gem },
  { id: "minimal" as MoodType, label: "Minimal", labelAr: "بسيط", icon: Minus },
  { id: "energetic" as MoodType, label: "Energetic", labelAr: "حيوي", icon: Zap },
  { id: "warm" as MoodType, label: "Warm", labelAr: "دافئ", icon: Sun },
];

const platforms = [
  { id: "instagram" as PlatformType, label: "Instagram", icon: Instagram },
  { id: "tiktok" as PlatformType, label: "TikTok", icon: Music2 },
  { id: "shorts" as PlatformType, label: "Shorts", icon: Youtube },
];

function SelectionGroup<T extends string>({ 
  title,
  items,
  selected,
  onSelect,
  delay = 0 
}: { 
  title: string;
  items: { id: T; label: string; labelAr?: string; icon: any }[];
  selected: T | null;
  onSelect: (id: T) => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-8"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl
              transition-all duration-300 border
              ${selected === item.id 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card/50 border-border/50 hover:border-border hover:bg-card"
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.labelAr || item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function IntentSetup({
  contentType,
  mood,
  platform,
  onSetContentType,
  onSetMood,
  onSetPlatform,
  onContinue,
  onBack,
}: IntentSetupProps) {
  const isComplete = contentType && mood && platform;

  const getAIFeedback = () => {
    if (!contentType || !mood || !platform) return null;
    
    const moodLabels: Record<MoodType, string> = {
      luxury: "فاخر",
      minimal: "بسيط",
      energetic: "حيوي",
      warm: "دافئ",
    };
    
    const contentLabels: Record<ContentType, string> = {
      ad: "إعلاني",
      promo: "ترويجي",
      cinematic: "سينمائي",
      reel: "ريل",
    };

    return `محتوى ${contentLabels[contentType]} بأسلوب ${moodLabels[mood]} لـ ${platform}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Selectors */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-2">حدد رؤيتك الإبداعية</h2>
              <p className="text-muted-foreground">Define Your Creative Vision</p>
            </motion.div>

            <SelectionGroup
              title="نوع المحتوى / Content Type"
              items={contentTypes}
              selected={contentType}
              onSelect={onSetContentType}
              delay={0.1}
            />

            <SelectionGroup
              title="المزاج / Mood"
              items={moods}
              selected={mood}
              onSelect={onSetMood}
              delay={0.2}
            />

            <SelectionGroup
              title="المنصة / Platform"
              items={platforms}
              selected={platform}
              onSelect={onSetPlatform}
              delay={0.3}
            />
          </div>

          {/* Right - AI Interpretation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:sticky lg:top-8"
          >
            <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Clapperboard className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                فهم الذكاء الاصطناعي
              </h3>
              
              <motion.p
                key={getAIFeedback()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-semibold leading-relaxed"
              >
                {getAIFeedback() || (
                  <span className="text-muted-foreground/50">
                    اختر الخيارات لرؤية التفسير...
                  </span>
                )}
              </motion.p>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 pt-6 border-t border-border/50"
                >
                  <p className="text-sm text-muted-foreground">
                    "Understood. A {contentType} direction with a {mood} mood for {platform}."
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
            disabled={!isComplete}
            className={`
              px-8 py-3 rounded-full font-medium
              bg-gradient-to-r from-primary to-primary/80
              text-primary-foreground
              transition-all duration-300
              ${isComplete ? "hover:scale-105 hover:shadow-lg hover:shadow-primary/25" : "opacity-50 cursor-not-allowed"}
            `}
          >
            Continue →
          </button>
        </motion.div>
      </div>
    </div>
  );
}
