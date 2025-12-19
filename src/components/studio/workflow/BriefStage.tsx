import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Target, Smartphone, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CampaignBrief, CampaignObjective, Platform } from '@/types/workflow';

interface BriefStageProps {
  brief: Partial<CampaignBrief>;
  onUpdate: (data: Partial<CampaignBrief>) => void;
  onContinue: () => void;
  isComplete: boolean;
}

const OBJECTIVES: { value: CampaignObjective; label: string; icon: string }[] = [
  { value: 'awareness', label: 'زيادة الوعي', icon: '📢' },
  { value: 'engagement', label: 'التفاعل', icon: '💬' },
  { value: 'sales', label: 'المبيعات', icon: '💰' },
  { value: 'launch', label: 'إطلاق منتج', icon: '🚀' },
  { value: 'other', label: 'أخرى', icon: '✨' },
];

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'facebook', label: 'Facebook', icon: '👍' },
  { value: 'youtube', label: 'YouTube', icon: '▶️' },
  { value: 'twitter', label: 'X / Twitter', icon: '🐦' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
];

export function BriefStage({ brief, onUpdate, onContinue, isComplete }: BriefStageProps) {
  const [currentSection, setCurrentSection] = useState(0);

  const togglePlatform = (platform: Platform) => {
    const current = brief.platforms || [];
    const updated = current.includes(platform)
      ? current.filter(p => p !== platform)
      : [...current, platform];
    onUpdate({ platforms: updated });
  };

  const sections = [
    // Section 1: Business Info
    {
      title: 'معلومات العمل',
      subtitle: 'أخبرنا عن مشروعك',
      icon: Building2,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">اسم العمل أو العلامة التجارية</Label>
            <Input
              id="businessName"
              placeholder="مثال: متجر الأناقة"
              value={brief.businessName || ''}
              onChange={(e) => onUpdate({ businessName: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">وصف المشروع</Label>
            <Textarea
              id="businessDescription"
              placeholder="اشرح ما تقدمه بإيجاز..."
              value={brief.businessDescription || ''}
              onChange={(e) => onUpdate({ businessDescription: e.target.value })}
              className="bg-secondary/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productOrService">المنتج أو الخدمة المحددة</Label>
            <Input
              id="productOrService"
              placeholder="مثال: مجموعة الملابس الصيفية الجديدة"
              value={brief.productOrService || ''}
              onChange={(e) => onUpdate({ productOrService: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </div>
      ),
    },
    // Section 2: Target Audience
    {
      title: 'الجمهور المستهدف',
      subtitle: 'من تريد الوصول إليه؟',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">وصف الجمهور المستهدف</Label>
            <Textarea
              id="targetAudience"
              placeholder="مثال: شباب وشابات من 18-35 سنة، مهتمين بالموضة والأناقة، في الخليج العربي..."
              value={brief.targetAudience || ''}
              onChange={(e) => onUpdate({ targetAudience: e.target.value })}
              className="bg-secondary/50 min-h-[120px]"
            />
          </div>

          <div className="glass-card p-4 border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <span className="text-foreground font-medium">نصيحة:</span> كلما كان وصف الجمهور أدق، كانت النتائج أفضل. فكر في العمر، الاهتمامات، والمنطقة الجغرافية.
            </p>
          </div>
        </div>
      ),
    },
    // Section 3: Campaign Goals
    {
      title: 'هدف الحملة',
      subtitle: 'ما الذي تريد تحقيقه؟',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {OBJECTIVES.map((obj) => (
              <motion.button
                key={obj.value}
                onClick={() => onUpdate({ objective: obj.value })}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                  brief.objective === obj.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mb-2 block">{obj.icon}</span>
                <span className="text-sm font-medium">{obj.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="additionalNotes"
              placeholder="أي تفاصيل أخرى تريد مشاركتها..."
              value={brief.additionalNotes || ''}
              onChange={(e) => onUpdate({ additionalNotes: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </div>
      ),
    },
    // Section 4: Platforms
    {
      title: 'المنصات',
      subtitle: 'أين سيتم نشر المحتوى؟',
      icon: Smartphone,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => (
              <motion.button
                key={platform.value}
                onClick={() => togglePlatform(platform.value)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-200",
                  (brief.platforms || []).includes(platform.value)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/30 hover:border-primary/50"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl mb-2 block">{platform.icon}</span>
                <span className="text-sm font-medium">{platform.label}</span>
              </motion.button>
            ))}
          </div>

          {(brief.platforms || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">المختار:</span>
              {brief.platforms?.map((p) => (
                <Badge key={p} variant="secondary" className="bg-primary/20 text-primary">
                  {PLATFORMS.find(pl => pl.value === p)?.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  const currentSectionData = sections[currentSection];
  const Icon = currentSectionData.icon;

  return (
    <div className="h-full flex flex-col">
      {/* Section indicator */}
      <div className="flex gap-2 mb-6 px-1">
        {sections.map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index <= currentSection ? "bg-primary" : "bg-border"
            )}
            initial={false}
            animate={{ scaleX: index <= currentSection ? 1 : 0.8 }}
          />
        ))}
      </div>

      {/* Section header */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/20">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{currentSectionData.title}</h3>
            <p className="text-sm text-muted-foreground">{currentSectionData.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Section content */}
      <motion.div
        key={`content-${currentSection}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex-1 overflow-y-auto"
      >
        {currentSectionData.content}
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-border">
        {currentSection > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentSection(prev => prev - 1)}
            className="flex-1"
          >
            السابق
          </Button>
        )}

        {currentSection < sections.length - 1 ? (
          <Button
            onClick={() => setCurrentSection(prev => prev + 1)}
            className="flex-1 neon-button"
          >
            التالي
            <ChevronLeft className="w-4 h-4 mr-2" />
          </Button>
        ) : (
          <Button
            onClick={onContinue}
            disabled={!isComplete}
            className="flex-1 neon-button"
          >
            <Sparkles className="w-4 h-4 ml-2" />
            إنشاء الاستراتيجية
          </Button>
        )}
      </div>
    </div>
  );
}
