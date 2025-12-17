import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ArrowLeft, Mail, Lock, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OBrainLogo } from '@/components/OBrainLogo';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email || !password) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Mock auth - in production, connect to Supabase
    setTimeout(() => {
      toast({
        title: mode === 'login' 
          ? (language === 'ar' ? 'تم تسجيل الدخول' : 'Logged in successfully')
          : (language === 'ar' ? 'تم إنشاء الحساب' : 'Account created successfully'),
        description: language === 'ar' ? 'جارٍ التحويل...' : 'Redirecting...',
      });
      setLoading(false);
      navigate('/create');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span className="text-sm">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </Link>
            <LanguageToggle />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 font-heading font-bold text-2xl mb-8">
            <OBrainLogo size="md" />
            <span className="neon-text">OBrain</span>
            <span className="text-foreground text-lg">أوبراين</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            {mode === 'login' ? t('auth.login') : t('auth.signup')}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">{language === 'ar' ? 'الاسم' : 'Name'}</Label>
                <div className="relative">
                  <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                    className="pl-10 rtl:pl-4 rtl:pr-10 h-12"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'ar' ? 'بريدك@مثال.com' : 'you@example.com'}
                  className="pl-10 rtl:pl-4 rtl:pr-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                {mode === 'login' && (
                  <button type="button" className="text-sm text-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 rtl:pl-4 rtl:pr-10 h-12"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 rtl:pl-4 rtl:pr-10 h-12"
                  />
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
              {loading ? (
                <span className="animate-pulse">{language === 'ar' ? 'جارٍ...' : 'Loading...'}</span>
              ) : (
                mode === 'login' ? t('nav.login') : t('nav.signup')
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'login' ? t('nav.signup') : t('nav.login')}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-background to-accent/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <OBrainLogo size="xl" className="mx-auto animate-float" />
          </div>
          <h2 className="text-2xl font-heading font-bold mb-4">
            {language === 'ar' ? 'اصنع إعلانك خلال دقائق' : 'Create Your Ad in Minutes'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'سيناريوهات احترافية، برومبتات ذكية، وخطة محتوى كاملة بالذكاء الاصطناعي'
              : 'Professional scripts, smart prompts, and a complete content plan powered by AI'}
          </p>
        </div>
      </div>
    </div>
  );
}
