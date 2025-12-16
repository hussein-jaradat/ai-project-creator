import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Landing
    'hero.title': 'Transform Your Project from Idea to Reality',
    'hero.subtitle': 'Your project description + your images → professional scripts, prompts, and ready content',
    'hero.cta': 'Get Started',
    'hero.cta.secondary': 'Try Free (Demo)',
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // How it works
    'howItWorks.title': 'How It Works',
    'howItWorks.step1.title': 'Describe Your Business',
    'howItWorks.step1.desc': 'Tell us about your project, brand, and goals in detail',
    'howItWorks.step2.title': 'Upload Your Images',
    'howItWorks.step2.desc': 'Share 1-6 images of your products, services, or brand',
    'howItWorks.step3.title': 'Get AI-Generated Content',
    'howItWorks.step3.desc': 'Receive scripts, prompts, captions, and a content plan',

    // Features
    'features.title': 'Professional Content with AI',
    'features.scripts': 'Video Scripts',
    'features.scripts.desc': '30-45 second professional scripts with hooks and CTAs',
    'features.prompts': 'Image & Video Prompts',
    'features.prompts.desc': 'Ready-to-use prompts for AI image and video generation',
    'features.captions': 'Social Captions',
    'features.captions.desc': '5 caption variations with hashtags for maximum engagement',
    'features.plan': '7-Day Content Plan',
    'features.plan.desc': 'Complete weekly posting strategy tailored to your brand',

    // Auth
    'auth.login': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to continue creating',
    'auth.signup': 'Create Account',
    'auth.signup.subtitle': 'Start your content creation journey',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',

    // Wizard
    'wizard.step1': 'Business Description',
    'wizard.step2': 'Upload Images',
    'wizard.step3': 'Style & Goals',
    'wizard.step4': 'Review & Generate',
    'wizard.description.title': 'Tell Us About Your Business',
    'wizard.description.placeholder': 'Describe your business, products, target audience, and what makes you unique... (minimum 50 words)',
    'wizard.description.helper': 'The more detail you provide, the better your content will be',
    'wizard.images.title': 'Upload Your Images',
    'wizard.images.subtitle': 'Upload 1-6 images of your products, services, or brand',
    'wizard.style.title': 'Choose Your Style',
    'wizard.platform': 'Platform',
    'wizard.videoType': 'Video Type',
    'wizard.mood': 'Mood',
    'wizard.language': 'Content Language',
    'wizard.next': 'Next',
    'wizard.back': 'Back',
    'wizard.generate': 'Generate Content',

    // Dashboard
    'dashboard.title': 'Your Generated Content',
    'dashboard.overview': 'Overview',
    'dashboard.prompts': 'Prompts',
    'dashboard.script': 'Script',
    'dashboard.captions': 'Captions',
    'dashboard.mockMedia': 'Mock Media',
    'dashboard.export': 'Export',
    'dashboard.regenerate': 'Regenerate',
    'dashboard.copy': 'Copy',
    'dashboard.copied': 'Copied!',
    'dashboard.downloadZip': 'Download ZIP',
    'dashboard.mockMode': 'Mock Mode',
    'dashboard.generateReal': 'Generate Real Media (Coming Soon)',

    // Footer
    'footer.tagline': 'Professional AI-powered content creation',
    'footer.rights': 'All rights reserved',
  },
  ar: {
    // Landing
    'hero.title': 'حوّل مشروعك من فكرة إلى واقع',
    'hero.subtitle': 'وصف مشروعك + صورك → نصوص، برومبتات، وسيناريو جاهز',
    'hero.cta': 'ابدأ الآن',
    'hero.cta.secondary': 'جرّب مجاناً (نسخة تجريبية)',
    'nav.features': 'المميزات',
    'nav.howItWorks': 'كيف يعمل',
    'nav.pricing': 'الأسعار',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',

    // How it works
    'howItWorks.title': 'كيف يعمل',
    'howItWorks.step1.title': 'صِف مشروعك',
    'howItWorks.step1.desc': 'أخبرنا عن مشروعك وعلامتك التجارية وأهدافك بالتفصيل',
    'howItWorks.step2.title': 'ارفع صورك',
    'howItWorks.step2.desc': 'شارك 1-6 صور لمنتجاتك أو خدماتك أو علامتك التجارية',
    'howItWorks.step3.title': 'احصل على محتوى بالذكاء الاصطناعي',
    'howItWorks.step3.desc': 'استلم السيناريوهات والبرومبتات والتعليقات وخطة المحتوى',

    // Features
    'features.title': 'محتوى احترافي بالذكاء الاصطناعي',
    'features.scripts': 'سيناريوهات الفيديو',
    'features.scripts.desc': 'سيناريوهات احترافية 30-45 ثانية مع مقدمات ودعوات للعمل',
    'features.prompts': 'برومبتات الصور والفيديو',
    'features.prompts.desc': 'برومبتات جاهزة للاستخدام لتوليد الصور والفيديو بالذكاء الاصطناعي',
    'features.captions': 'تعليقات السوشيال ميديا',
    'features.captions.desc': '5 تعليقات متنوعة مع هاشتاقات لأقصى تفاعل',
    'features.plan': 'خطة محتوى 7 أيام',
    'features.plan.desc': 'استراتيجية نشر أسبوعية كاملة مخصصة لعلامتك التجارية',

    // Auth
    'auth.login': 'مرحباً بعودتك',
    'auth.login.subtitle': 'سجّل دخولك لمتابعة الإبداع',
    'auth.signup': 'إنشاء حساب',
    'auth.signup.subtitle': 'ابدأ رحلة صناعة المحتوى',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',

    // Wizard
    'wizard.step1': 'وصف المشروع',
    'wizard.step2': 'رفع الصور',
    'wizard.step3': 'الأسلوب والأهداف',
    'wizard.step4': 'المراجعة والتوليد',
    'wizard.description.title': 'أخبرنا عن مشروعك',
    'wizard.description.placeholder': 'صِف مشروعك ومنتجاتك وجمهورك المستهدف وما يميزك... (50 كلمة على الأقل)',
    'wizard.description.helper': 'كلما قدمت تفاصيل أكثر، كان محتواك أفضل',
    'wizard.images.title': 'ارفع صورك',
    'wizard.images.subtitle': 'ارفع 1-6 صور لمنتجاتك أو خدماتك أو علامتك التجارية',
    'wizard.style.title': 'اختر أسلوبك',
    'wizard.platform': 'المنصة',
    'wizard.videoType': 'نوع الفيديو',
    'wizard.mood': 'المزاج',
    'wizard.language': 'لغة المحتوى',
    'wizard.next': 'التالي',
    'wizard.back': 'رجوع',
    'wizard.generate': 'توليد المحتوى',

    // Dashboard
    'dashboard.title': 'محتواك المُولَّد',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.prompts': 'البرومبتات',
    'dashboard.script': 'السيناريو',
    'dashboard.captions': 'التعليقات',
    'dashboard.mockMedia': 'الوسائط التجريبية',
    'dashboard.export': 'تصدير',
    'dashboard.regenerate': 'إعادة التوليد',
    'dashboard.copy': 'نسخ',
    'dashboard.copied': 'تم النسخ!',
    'dashboard.downloadZip': 'تحميل ZIP',
    'dashboard.mockMode': 'الوضع التجريبي',
    'dashboard.generateReal': 'توليد وسائط حقيقية (قريباً)',

    // Footer
    'footer.tagline': 'صناعة محتوى احترافي بالذكاء الاصطناعي',
    'footer.rights': 'جميع الحقوق محفوظة',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'ar')) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
