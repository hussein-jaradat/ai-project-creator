import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { OBrainLogo } from '@/components/OBrainLogo';
import { LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
          <OBrainLogo size="sm" />
          <span className="neon-text">OBrain</span>
          <span className="text-foreground text-sm">أوبراين</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.features')}
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.howItWorks')}
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('nav.pricing')}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link to="/auth">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.login')}</span>
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button 
              size="sm"
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all duration-300"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('nav.signup')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
