import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="py-12 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-heading font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[hsl(262_83%_58%)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="gradient-text">ContentAI</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {t('footer.tagline')}
          </p>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ContentAI. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
