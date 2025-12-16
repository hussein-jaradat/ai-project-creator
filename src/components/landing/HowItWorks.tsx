import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Upload, Sparkles, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const { t, language } = useLanguage();

  const steps = [
    {
      icon: FileText,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
      color: 'from-primary to-[hsl(262_83%_58%)]',
    },
    {
      icon: Upload,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
      color: 'from-[hsl(262_83%_58%)] to-accent',
    },
    {
      icon: Sparkles,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
      color: 'from-accent to-[hsl(28_95%_60%)]',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'ثلاث خطوات بسيطة للحصول على محتوى احترافي'
              : 'Three simple steps to get professional content'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-border to-transparent">
                  <ArrowRight className={`absolute ${language === 'ar' ? 'left-0 rotate-180' : 'right-0'} -top-2 w-5 h-5 text-muted-foreground`} />
                </div>
              )}

              <div className="glass-card rounded-2xl p-8 text-center hover-lift h-full">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-shadow duration-300`}>
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-heading font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
