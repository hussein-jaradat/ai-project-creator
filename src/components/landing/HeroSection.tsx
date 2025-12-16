import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Zap, Video, FileText } from 'lucide-react';

export function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered Content Creation'}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-slide-up text-balance">
            {language === 'ar' ? (
              <span className="font-arabic">
                حوّل مشروعك من{' '}
                <span className="gradient-text">فكرة</span>{' '}
                إلى{' '}
                <span className="gradient-accent-text">واقع</span>
              </span>
            ) : (
              <>
                Transform Your Project from{' '}
                <span className="gradient-text">Idea</span>{' '}
                to{' '}
                <span className="gradient-accent-text">Reality</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/studio">
              <Button variant="hero" size="xl" className="group">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="heroSecondary" size="xl" className="group">
                <Play className="w-5 h-5" />
                {t('hero.cta.secondary')}
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { icon: FileText, label: language === 'ar' ? 'سيناريوهات احترافية' : 'Pro Scripts' },
              { icon: Zap, label: language === 'ar' ? 'برومبتات ذكية' : 'Smart Prompts' },
              { icon: Video, label: language === 'ar' ? 'محتوى فيديو' : 'Video Content' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="mt-20 relative max-w-5xl mx-auto animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative">
            {/* Main Preview Card */}
            <div className="glass-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-accent/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[hsl(262_83%_58%)] flex items-center justify-center mx-auto mb-4 shadow-glow">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    {language === 'ar' ? 'اصنع إعلانك خلال دقائق' : 'Create your ad in minutes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Side Cards */}
            <div className="absolute -left-4 top-1/4 glass-card rounded-xl p-4 shadow-card animate-float hidden lg:block">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{language === 'ar' ? 'سيناريو جاهز' : 'Script Ready'}</span>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 glass-card rounded-xl p-4 shadow-card animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-medium">{language === 'ar' ? '15 هاشتاق' : '15 Hashtags'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
