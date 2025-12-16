import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

export function ExampleGallery() {
  const { language } = useLanguage();

  const examples = [
    {
      type: language === 'ar' ? 'مطعم' : 'Restaurant',
      mood: 'Premium',
      gradient: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
    },
    {
      type: language === 'ar' ? 'أزياء' : 'Fashion',
      mood: 'Elegant',
      gradient: 'from-pink-500/20 to-purple-500/20',
      borderColor: 'border-pink-500/30',
    },
    {
      type: language === 'ar' ? 'تقنية' : 'Tech',
      mood: 'Minimal',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      type: language === 'ar' ? 'رياضة' : 'Fitness',
      mood: 'Energetic',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {language === 'ar' ? 'أمثلة على المخرجات' : 'Example Outputs'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'نماذج من المحتوى الذي يمكن توليده لمختلف الصناعات'
              : 'Sample content that can be generated for various industries'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {examples.map((example, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl overflow-hidden hover-lift border ${example.borderColor}`}
            >
              <div className={`aspect-square bg-gradient-to-br ${example.gradient} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-60">🎬</div>
                  <Badge variant="secondary" className="text-xs">
                    {example.mood}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{example.type}</h3>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'سيناريو + برومبتات + هاشتاقات' : 'Script + Prompts + Hashtags'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
