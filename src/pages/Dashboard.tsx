import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useToast } from '@/hooks/use-toast';
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  FileText,
  MessageSquare,
  Image,
  Download,
  Copy,
  Check,
  RefreshCw,
  Play,
  Clock,
  Zap,
  Calendar,
  Hash,
  Video,
} from 'lucide-react';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock generated content
  const mockContent = {
    brandProfile: {
      business_type: language === 'ar' ? 'مطعم فاخر' : 'Premium Restaurant',
      audience: language === 'ar' ? 'محترفون، 25-45 سنة' : 'Professionals, 25-45',
      tone: language === 'ar' ? 'راقي، دافئ' : 'Sophisticated, Warm',
      visual_style: language === 'ar' ? 'بسيط وأنيق' : 'Minimal & Elegant',
      color_palette: ['#1a1a2e', '#f4a261', '#e9c46a', '#264653'],
      keywords: language === 'ar' 
        ? ['فاخر', 'طعام راقي', 'تجربة مميزة', 'جودة عالية']
        : ['luxury', 'fine dining', 'premium experience', 'quality'],
    },
    imagePrompts: [
      language === 'ar'
        ? 'طبق رئيسي فاخر على طاولة أنيقة، إضاءة دافئة، خلفية داكنة، تصوير احترافي للطعام'
        : 'Elegant main dish on sophisticated table, warm lighting, dark background, professional food photography',
      language === 'ar'
        ? 'مقربة للمكونات الطازجة، ألوان نابضة بالحياة، أسلوب بسيط، ضوء طبيعي ناعم'
        : 'Close-up of fresh ingredients, vibrant colors, minimal style, soft natural light',
      language === 'ar'
        ? 'أجواء المطعم الداخلية، تصميم راقي، إضاءة مزاجية، جو فاخر'
        : 'Restaurant interior ambiance, elegant design, mood lighting, luxury atmosphere',
    ],
    videoPrompts: [
      language === 'ar'
        ? 'فيديو سلو موشن للشيف وهو يضع اللمسات الأخيرة على الطبق، إضاءة سينمائية، لقطة مقربة'
        : 'Slow motion video of chef adding final touches to dish, cinematic lighting, close-up shot',
      language === 'ar'
        ? 'مشهد جوي للمطعم عند الغروب، انتقال سلس للداخل، موسيقى أنيقة'
        : 'Aerial shot of restaurant at sunset, smooth transition to interior, elegant music',
    ],
    script: {
      hook: language === 'ar' 
        ? 'اكتشف طعماً يروي قصة...'
        : 'Discover a taste that tells a story...',
      body: language === 'ar'
        ? 'في كل طبق، نمزج بين الفن والنكهة. مكونات طازجة، وصفات فريدة، وتجربة لا تُنسى.'
        : 'In every dish, we blend art with flavor. Fresh ingredients, unique recipes, and an unforgettable experience.',
      cta: language === 'ar'
        ? 'احجز طاولتك الآن واستمتع بتجربة استثنائية'
        : 'Book your table now and enjoy an exceptional experience',
      full_script: language === 'ar'
        ? `[مشهد 1: مقدمة - 5 ثوانٍ]
اكتشف طعماً يروي قصة...

[مشهد 2: عرض المنتج - 15 ثانية]
في كل طبق، نمزج بين الفن والنكهة.
مكونات طازجة من أفضل المزارع المحلية.
وصفات فريدة تجمع بين الأصالة والابتكار.

[مشهد 3: الأجواء - 10 ثوانٍ]
أجواء راقية تجعل من كل زيارة مناسبة خاصة.
خدمة استثنائية ترتقي بتجربتك.

[مشهد 4: الدعوة للعمل - 5 ثوانٍ]
احجز طاولتك الآن واستمتع بتجربة استثنائية.
الرابط في البايو 👆`
        : `[Scene 1: Hook - 5 seconds]
Discover a taste that tells a story...

[Scene 2: Product Showcase - 15 seconds]
In every dish, we blend art with flavor.
Fresh ingredients from the finest local farms.
Unique recipes that combine tradition with innovation.

[Scene 3: Ambiance - 10 seconds]
An elegant atmosphere that makes every visit a special occasion.
Exceptional service that elevates your experience.

[Scene 4: Call to Action - 5 seconds]
Book your table now and enjoy an exceptional experience.
Link in bio 👆`,
    },
    captions: [
      {
        caption: language === 'ar'
          ? 'عندما يلتقي الفن بالنكهة ✨🍽️ اكتشف قائمتنا الجديدة واستعد لرحلة حسية لا تُنسى. احجز الآن!'
          : 'When art meets flavor ✨🍽️ Discover our new menu and prepare for an unforgettable sensory journey. Book now!',
        style: 'Premium',
      },
      {
        caption: language === 'ar'
          ? 'كل طبق قصة. كل زيارة ذكرى. 🌟 جرّب الفرق مع [اسم المطعم]'
          : 'Every dish is a story. Every visit is a memory. 🌟 Experience the difference with [Restaurant Name]',
        style: 'Elegant',
      },
      {
        caption: language === 'ar'
          ? 'مكونات طازجة + شغف حقيقي = سحر في كل لقمة 🔥'
          : 'Fresh ingredients + real passion = magic in every bite 🔥',
        style: 'Energetic',
      },
      {
        caption: language === 'ar'
          ? 'للحظات التي تستحق الاحتفال 🥂 طاولتك بانتظارك'
          : 'For moments worth celebrating 🥂 Your table awaits',
        style: 'Warm',
      },
      {
        caption: language === 'ar'
          ? 'بساطة في التقديم. عمق في النكهة. تميز في كل التفاصيل.'
          : 'Simplicity in presentation. Depth in flavor. Excellence in every detail.',
        style: 'Minimal',
      },
    ],
    hashtags: [
      '#FoodLovers', '#FineDining', '#Foodie', '#Restaurant', '#ChefLife',
      '#GourmetFood', '#FoodPhotography', '#Delicious', '#InstaFood', '#FoodPorn',
      '#LuxuryDining', '#FreshIngredients', '#FoodArt', '#DiningExperience', '#FoodGram',
      '#TasteTheArt', '#PremiumFood', '#CulinaryArt', '#RestaurantLife', '#FoodieLife',
    ],
    weeklyPlan: [
      { day: language === 'ar' ? 'السبت' : 'Saturday', post_type: 'Reel', concept: language === 'ar' ? 'جولة في المطبخ' : 'Kitchen Tour', caption_hint: 'Behind the scenes' },
      { day: language === 'ar' ? 'الأحد' : 'Sunday', post_type: 'Story', concept: language === 'ar' ? 'طبق اليوم' : 'Dish of the Day', caption_hint: 'Feature special' },
      { day: language === 'ar' ? 'الاثنين' : 'Monday', post_type: 'Post', concept: language === 'ar' ? 'قصة مكون' : 'Ingredient Story', caption_hint: 'Educational' },
      { day: language === 'ar' ? 'الثلاثاء' : 'Tuesday', post_type: 'Reel', concept: language === 'ar' ? 'تحضير الطبق' : 'Dish Preparation', caption_hint: 'Process video' },
      { day: language === 'ar' ? 'الأربعاء' : 'Wednesday', post_type: 'Story', concept: language === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews', caption_hint: 'Social proof' },
      { day: language === 'ar' ? 'الخميس' : 'Thursday', post_type: 'Post', concept: language === 'ar' ? 'أجواء المطعم' : 'Restaurant Ambiance', caption_hint: 'Atmosphere' },
      { day: language === 'ar' ? 'الجمعة' : 'Friday', post_type: 'Reel', concept: language === 'ar' ? 'عرض نهاية الأسبوع' : 'Weekend Special', caption_hint: 'Promotional' },
    ],
  };

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: t('dashboard.copied'),
      description: language === 'ar' ? 'تم نسخ النص' : 'Text copied to clipboard',
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadZip = () => {
    toast({
      title: language === 'ar' ? 'جارٍ التحميل...' : 'Downloading...',
      description: language === 'ar' ? 'سيتم تحميل ملف ZIP قريباً' : 'ZIP file will download shortly',
    });
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleCopy(text, field)}
      className="h-8 gap-1"
    >
      {copiedField === field ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {t('dashboard.copy')}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(262_83%_58%)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="gradient-text">ContentAI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              {t('dashboard.mockMode')} ON
            </Badge>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {language === 'ar' ? 'تم توليد محتواك بنجاح' : 'Your content has been generated successfully'}
            </p>
          </div>
          <Button variant="hero" onClick={handleDownloadZip} className="gap-2">
            <Download className="w-4 h-4" />
            {t('dashboard.downloadZip')}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              {t('dashboard.overview')}
            </TabsTrigger>
            <TabsTrigger value="prompts" className="gap-2">
              <Wand2 className="w-4 h-4" />
              {t('dashboard.prompts')}
            </TabsTrigger>
            <TabsTrigger value="script" className="gap-2">
              <FileText className="w-4 h-4" />
              {t('dashboard.script')}
            </TabsTrigger>
            <TabsTrigger value="captions" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('dashboard.captions')}
            </TabsTrigger>
            <TabsTrigger value="media" className="gap-2">
              <Image className="w-4 h-4" />
              {t('dashboard.mockMedia')}
            </TabsTrigger>
            <TabsTrigger value="plan" className="gap-2">
              <Calendar className="w-4 h-4" />
              {language === 'ar' ? 'الخطة' : 'Plan'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === 'ar' ? 'نوع المشروع' : 'Business Type'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{mockContent.brandProfile.business_type}</p>
                  <p className="text-sm text-muted-foreground mt-1">{mockContent.brandProfile.audience}</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === 'ar' ? 'الأسلوب' : 'Style'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{mockContent.brandProfile.visual_style}</p>
                  <p className="text-sm text-muted-foreground mt-1">{mockContent.brandProfile.tone}</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{language === 'ar' ? 'الألوان' : 'Colors'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {mockContent.brandProfile.color_palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-lg border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الكلمات المفتاحية' : 'Keywords'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockContent.brandProfile.keywords.map((keyword, i) => (
                    <Badge key={i} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card p-4 text-center">
                <Wand2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{mockContent.imagePrompts.length + mockContent.videoPrompts.length}</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'برومبتات' : 'Prompts'}</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'سيناريو' : 'Script'}</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{mockContent.captions.length}</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'تعليقات' : 'Captions'}</p>
              </Card>
              <Card className="glass-card p-4 text-center">
                <Hash className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{mockContent.hashtags.length}</p>
                <p className="text-xs text-muted-foreground">{language === 'ar' ? 'هاشتاقات' : 'Hashtags'}</p>
              </Card>
            </div>
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'برومبتات الصور' : 'Image Prompts'}</CardTitle>
                  <CardDescription>{language === 'ar' ? 'جاهزة للاستخدام في أدوات توليد الصور' : 'Ready to use with image generation tools'}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  {t('dashboard.regenerate')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockContent.imagePrompts.map((prompt, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 relative group">
                    <p className="text-sm pr-20">{prompt}</p>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={prompt} field={`img-${i}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'برومبتات الفيديو' : 'Video Prompts'}</CardTitle>
                  <CardDescription>{language === 'ar' ? 'جاهزة للاستخدام في أدوات توليد الفيديو' : 'Ready to use with video generation tools'}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  {t('dashboard.regenerate')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockContent.videoPrompts.map((prompt, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 relative group">
                    <p className="text-sm pr-20">{prompt}</p>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={prompt} field={`vid-${i}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Script Tab */}
          <TabsContent value="script" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'سيناريو الفيديو' : 'Video Script'}</CardTitle>
                  <CardDescription>{language === 'ar' ? '30-45 ثانية' : '30-45 seconds'}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="w-4 h-4" />
                    {t('dashboard.regenerate')}
                  </Button>
                  <CopyButton text={mockContent.script.full_script} field="script" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <Badge className="mb-2">{language === 'ar' ? 'المقدمة (Hook)' : 'Hook'}</Badge>
                    <p className="font-medium">{mockContent.script.hook}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50">
                    <Badge variant="secondary" className="mb-2">{language === 'ar' ? 'المحتوى' : 'Body'}</Badge>
                    <p>{mockContent.script.body}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                    <Badge className="mb-2 bg-accent text-accent-foreground">{language === 'ar' ? 'دعوة للعمل (CTA)' : 'CTA'}</Badge>
                    <p className="font-medium">{mockContent.script.cta}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{language === 'ar' ? 'السيناريو الكامل' : 'Full Script'}</Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        ~35s
                      </div>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-body">{mockContent.script.full_script}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Captions Tab */}
          <TabsContent value="captions" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'تعليقات السوشيال ميديا' : 'Social Captions'}</CardTitle>
                  <CardDescription>{language === 'ar' ? '5 تعليقات بأساليب مختلفة' : '5 captions with different styles'}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  {t('dashboard.regenerate')}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockContent.captions.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{item.style}</Badge>
                    </div>
                    <p className="text-sm pr-20">{item.caption}</p>
                    <div className="absolute top-3 right-3">
                      <CopyButton text={item.caption} field={`caption-${i}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'الهاشتاقات' : 'Hashtags'}</CardTitle>
                  <CardDescription>{mockContent.hashtags.length} {language === 'ar' ? 'هاشتاق' : 'hashtags'}</CardDescription>
                </div>
                <CopyButton text={mockContent.hashtags.join(' ')} field="hashtags" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockContent.hashtags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary/10">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mock Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{language === 'ar' ? 'الصور المولدة (تجريبي)' : 'Generated Images (Mock)'}</CardTitle>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Preview</Badge>
                </div>
                <CardDescription>{language === 'ar' ? 'معاينة للصور - التوليد الحقيقي قريباً' : 'Image previews - Real generation coming soon'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border">
                        <div className="text-center">
                          <Image className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {language === 'ar' ? `صورة ${i}` : `Image ${i}`}
                          </p>
                          <Badge variant="secondary" className="mt-2 text-xs">Mock</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>{language === 'ar' ? 'الفيديو المولد (تجريبي)' : 'Generated Video (Mock)'}</CardTitle>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Preview</Badge>
                </div>
                <CardDescription>{language === 'ar' ? 'معاينة للفيديو - التوليد الحقيقي قريباً' : 'Video preview - Real generation coming soon'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border border-border relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-card/80 backdrop-blur flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-card transition-colors">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'معاينة الفيديو' : 'Video Preview'}
                    </p>
                    <Badge variant="secondary" className="mt-2">Mock</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center p-8 rounded-2xl border-2 border-dashed border-border">
              <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">{t('dashboard.generateReal')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {language === 'ar'
                  ? 'توليد صور وفيديوهات حقيقية بالذكاء الاصطناعي قادم قريباً'
                  : 'Real AI image and video generation coming soon'}
              </p>
              <Button variant="outline" disabled>
                {language === 'ar' ? 'قريباً' : 'Coming Soon'}
              </Button>
            </div>
          </TabsContent>

          {/* Content Plan Tab */}
          <TabsContent value="plan" className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{language === 'ar' ? 'خطة المحتوى الأسبوعية' : '7-Day Content Plan'}</CardTitle>
                  <CardDescription>{language === 'ar' ? 'استراتيجية نشر مخصصة لعلامتك' : 'Custom posting strategy for your brand'}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="w-4 h-4" />
                  {t('dashboard.regenerate')}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockContent.weeklyPlan.map((day, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="w-20 text-center">
                        <p className="font-semibold">{day.day}</p>
                      </div>
                      <Badge variant="outline">{day.post_type}</Badge>
                      <div className="flex-1">
                        <p className="font-medium">{day.concept}</p>
                        <p className="text-xs text-muted-foreground">{day.caption_hint}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* History Section */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>{language === 'ar' ? 'آخر المشاريع' : 'Recent Projects'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>{language === 'ar' ? 'هذا أول مشروع لك!' : 'This is your first project!'}</p>
              <Link to="/create">
                <Button variant="link" className="mt-2">
                  {language === 'ar' ? 'إنشاء مشروع جديد' : 'Create new project'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
