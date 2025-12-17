import { useLanguage } from '@/contexts/LanguageContext';
import { OBrainLogo } from '@/components/OBrainLogo';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="py-12 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-heading font-bold text-xl">
            <OBrainLogo size="sm" />
            <span className="neon-text">OBrain</span>
            <span className="text-foreground text-sm">أوبراين</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            مشروع طلابي يهدف للتطوير
          </p>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OBrain. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
