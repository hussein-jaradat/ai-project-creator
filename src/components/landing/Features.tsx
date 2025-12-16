import { useLanguage } from '@/contexts/LanguageContext';
import { Video, Image, MessageSquare, Calendar, Zap, Hash } from 'lucide-react';

export function Features() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Video,
      title: t('features.scripts'),
      description: t('features.scripts.desc'),
    },
    {
      icon: Image,
      title: t('features.prompts'),
      description: t('features.prompts.desc'),
    },
    {
      icon: MessageSquare,
      title: t('features.captions'),
      description: t('features.captions.desc'),
    },
    {
      icon: Calendar,
      title: t('features.plan'),
      description: t('features.plan.desc'),
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'تحليل العلامة التجارية' : 'Brand Analysis',
      description: language === 'ar' 
        ? 'تحليل ذكي لصورك ووصفك لفهم هوية علامتك'
        : 'Smart analysis of your images and description to understand your brand identity',
    },
    {
      icon: Hash,
      title: language === 'ar' ? 'هاشتاقات ذكية' : 'Smart Hashtags',
      description: language === 'ar'
        ? '15-25 هاشتاق مخصص لزيادة الوصول والتفاعل'
        : '15-25 custom hashtags to increase reach and engagement',
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'كل ما تحتاجه لإنشاء محتوى احترافي لمشروعك'
              : 'Everything you need to create professional content for your project'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
