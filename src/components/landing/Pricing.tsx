import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Pricing() {
  const { language } = useLanguage();

  const plans = [
    {
      name: language === 'ar' ? 'مجاني' : 'Free',
      price: '0',
      description: language === 'ar' ? 'للتجربة والاستكشاف' : 'For trying and exploring',
      features: [
        language === 'ar' ? '3 مشاريع شهرياً' : '3 projects/month',
        language === 'ar' ? 'سيناريو واحد لكل مشروع' : '1 script per project',
        language === 'ar' ? 'برومبتات أساسية' : 'Basic prompts',
        language === 'ar' ? 'وضع تجريبي فقط' : 'Mock mode only',
      ],
      cta: language === 'ar' ? 'ابدأ مجاناً' : 'Start Free',
      popular: false,
    },
    {
      name: language === 'ar' ? 'احترافي' : 'Pro',
      price: language === 'ar' ? 'قريباً' : 'Coming Soon',
      description: language === 'ar' ? 'للمحترفين والعلامات التجارية' : 'For professionals and brands',
      features: [
        language === 'ar' ? 'مشاريع غير محدودة' : 'Unlimited projects',
        language === 'ar' ? 'جميع أنواع السيناريوهات' : 'All script types',
        language === 'ar' ? 'برومبتات متقدمة' : 'Advanced prompts',
        language === 'ar' ? 'توليد وسائط حقيقية' : 'Real media generation',
        language === 'ar' ? 'خطة محتوى 30 يوم' : '30-day content plan',
        language === 'ar' ? 'دعم أولوية' : 'Priority support',
      ],
      cta: language === 'ar' ? 'قريباً' : 'Coming Soon',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {language === 'ar' ? 'الأسعار' : 'Pricing'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'اختر الخطة المناسبة لاحتياجاتك'
              : 'Choose the plan that fits your needs'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-8 relative ${
                plan.popular ? 'border-2 border-primary shadow-glow' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-[hsl(262_83%_58%)]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {language === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price === '0' ? (
                    <>
                      $0<span className="text-lg text-muted-foreground">/{language === 'ar' ? 'شهر' : 'mo'}</span>
                    </>
                  ) : (
                    <span className="text-2xl text-muted-foreground">{plan.price}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.popular ? '#' : '/create'}>
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                  disabled={plan.popular}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
