import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { OBrainLogo } from '@/components/OBrainLogo';

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
            <Button variant="ghost" size="sm">
              {t('nav.login')}
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="hero" size="sm">
              {t('nav.signup')}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
