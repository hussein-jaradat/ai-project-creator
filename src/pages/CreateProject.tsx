import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useToast } from '@/hooks/use-toast';
import { OBrainLogo } from '@/components/OBrainLogo';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  X,
  Check,
  FileText,
  Image,
  Palette,
  Rocket,
  Instagram,
  Youtube,
  Film,
  Zap,
  Heart,
  Star,
  Layers,
  Sparkles,
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

interface ProjectData {
  description: string;
  images: File[];
  platform: string;
  videoType: string;
  mood: string;
  contentLanguage: string;
}

const initialData: ProjectData = {
  description: '',
  images: [],
  platform: '',
  videoType: '',
  mood: '',
  contentLanguage: '',
};

export default function CreateProject() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<ProjectData>(initialData);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const steps = [
    { num: 1, label: t('wizard.step1'), icon: FileText },
    { num: 2, label: t('wizard.step2'), icon: Image },
    { num: 3, label: t('wizard.step3'), icon: Palette },
    { num: 4, label: t('wizard.step4'), icon: Rocket },
  ];

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: Film },
    { id: 'facebook', label: 'Facebook', icon: Layers },
    { id: 'youtube', label: 'YouTube Shorts', icon: Youtube },
  ];

  const videoTypes = [
    { id: 'ad', label: language === 'ar' ? 'إعلان' : 'Ad' },
    { id: 'promo', label: language === 'ar' ? 'ترويجي' : 'Promo' },
    { id: 'cinematic', label: language === 'ar' ? 'سينمائي' : 'Cinematic' },
    { id: 'reel', label: language === 'ar' ? 'ريل' : 'Reel' },
  ];

  const moods = [
    { id: 'premium', label: language === 'ar' ? 'فاخر' : 'Premium', icon: Star },
    { id: 'minimal', label: language === 'ar' ? 'بسيط' : 'Minimal', icon: Layers },
    { id: 'energetic', label: language === 'ar' ? 'حيوي' : 'Energetic', icon: Zap },
    { id: 'warm', label: language === 'ar' ? 'دافئ' : 'Warm', icon: Heart },
  ];

  const languages = [
    { id: 'arabic', label: language === 'ar' ? 'عربي' : 'Arabic' },
    { id: 'english', label: language === 'ar' ? 'إنجليزي' : 'English' },
    { id: 'mixed', label: language === 'ar' ? 'مختلط' : 'Mixed' },
  ];

  const wordCount = data.description.trim().split(/\s+/).filter(Boolean).length;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length + data.images.length > 6) {
      toast({
        title: language === 'ar' ? 'تحذير' : 'Warning',
        description: language === 'ar' ? 'الحد الأقصى 6 صور' : 'Maximum 6 images allowed',
        variant: 'destructive',
      });
      return;
    }
    setData(prev => ({ ...prev, images: [...prev.images, ...files].slice(0, 6) }));
  }, [data.images, language, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + data.images.length > 6) {
      toast({
        title: language === 'ar' ? 'تحذير' : 'Warning',
        description: language === 'ar' ? 'الحد الأقصى 6 صور' : 'Maximum 6 images allowed',
        variant: 'destructive',
      });
      return;
    }
    setData(prev => ({ ...prev, images: [...prev.images, ...files].slice(0, 6) }));
  };

  const removeImage = (index: number) => {
    setData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return wordCount >= 50;
      case 2: return data.images.length >= 1;
      case 3: return data.platform && data.videoType && data.mood && data.contentLanguage;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      toast({
        title: language === 'ar' ? 'تم التوليد بنجاح!' : 'Generated Successfully!',
        description: language === 'ar' ? 'جارٍ التحويل للوحة التحكم...' : 'Redirecting to dashboard...',
      });
      // Store mock data
      localStorage.setItem('projectData', JSON.stringify(data));
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl">
            <OBrainLogo size="sm" />
            <span className="neon-text">OBrain</span>
            <span className="text-foreground text-sm">أوبراين</span>
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      step >= s.num
                        ? 'bg-gradient-to-br from-primary to-[hsl(262_83%_58%)] text-primary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.num ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-16 md:w-24 mx-2 mt-[-1.5rem] ${step > s.num ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(step / 4) * 100} className="h-1" />
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-8">
            {/* Step 1: Description */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">{t('wizard.description.title')}</h2>
                  <p className="text-muted-foreground">{t('wizard.description.helper')}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                    <Badge variant={wordCount >= 50 ? 'default' : 'secondary'}>
                      {wordCount}/50 {language === 'ar' ? 'كلمة' : 'words'}
                    </Badge>
                  </div>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('wizard.description.placeholder')}
                    className="min-h-[200px] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Upload Images */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">{t('wizard.images.title')}</h2>
                  <p className="text-muted-foreground">{t('wizard.images.subtitle')}</p>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">
                    {language === 'ar' ? 'اسحب الصور هنا أو' : 'Drag images here or'}
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-primary hover:underline">
                      {language === 'ar' ? 'اختر من جهازك' : 'browse from device'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'ar' ? 'PNG, JPG حتى 10MB لكل صورة' : 'PNG, JPG up to 10MB each'}
                  </p>
                </div>

                {data.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {data.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-xl border border-border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <Badge variant="secondary">
                  {data.images.length}/6 {language === 'ar' ? 'صور' : 'images'}
                </Badge>
              </div>
            )}

            {/* Step 3: Style & Goals */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">{t('wizard.style.title')}</h2>
                </div>

                {/* Platform */}
                <div className="space-y-3">
                  <Label>{t('wizard.platform')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setData(prev => ({ ...prev, platform: p.id }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          data.platform === p.id
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p.icon className="w-5 h-5" />
                        <span className="font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Type */}
                <div className="space-y-3">
                  <Label>{t('wizard.videoType')}</Label>
                  <div className="flex flex-wrap gap-3">
                    {videoTypes.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setData(prev => ({ ...prev, videoType: v.id }))}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          data.videoType === v.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div className="space-y-3">
                  <Label>{t('wizard.mood')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {moods.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setData(prev => ({ ...prev, mood: m.id }))}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          data.mood === m.id
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <m.icon className="w-5 h-5" />
                        <span className="font-medium">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="space-y-3">
                  <Label>{t('wizard.language')}</Label>
                  <div className="flex flex-wrap gap-3">
                    {languages.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setData(prev => ({ ...prev, contentLanguage: l.id }))}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          data.contentLanguage === l.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {language === 'ar' ? 'مراجعة وتوليد' : 'Review & Generate'}
                  </h2>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'راجع معلوماتك قبل التوليد' : 'Review your information before generating'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h3 className="font-semibold mb-2">{language === 'ar' ? 'الوصف' : 'Description'}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50">
                    <h3 className="font-semibold mb-2">{language === 'ar' ? 'الصور' : 'Images'}</h3>
                    <div className="flex gap-2">
                      {data.images.slice(0, 4).map((file, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ))}
                      {data.images.length > 4 && (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium">
                          +{data.images.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-1">{t('wizard.platform')}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{data.platform}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-1">{t('wizard.videoType')}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{data.videoType}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-1">{t('wizard.mood')}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{data.mood}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h3 className="font-semibold mb-1">{t('wizard.language')}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{data.contentLanguage}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Badge className="bg-primary/20 text-primary border-0">{t('dashboard.mockMode')}</Badge>
                    <span className="text-sm font-medium">ON</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' 
                      ? 'سيتم توليد محتوى تجريبي. توليد الوسائط الحقيقية قريباً!'
                      : 'Mock content will be generated. Real media generation coming soon!'}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                {t('wizard.back')}
              </Button>

              {step < 4 ? (
                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  {t('wizard.next')}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-pulse">{language === 'ar' ? 'جارٍ التوليد...' : 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t('wizard.generate')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
