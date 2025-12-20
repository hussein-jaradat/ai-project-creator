import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { OBrainLogo } from '@/components/OBrainLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { 
  LogIn, 
  UserPlus, 
  User, 
  LogOut, 
  Sparkles, 
  LayoutDashboard, 
  Image, 
  Settings,
  ChevronDown,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { t } = useLanguage();
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const userCode = (profile as any)?.user_code || 'OB-XXXXXX';

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const copyUserCode = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      setCopied(true);
      toast.success('تم نسخ رقم المستخدم');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل نسخ الرقم');
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isLandingPage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 font-heading font-bold text-xl group">
          <motion.div whileHover={{ rotate: 10 }} transition={{ duration: 0.2 }}>
            <OBrainLogo size="sm" />
          </motion.div>
          <span className="neon-text group-hover:opacity-80 transition-opacity">OBrain</span>
          <span className="text-foreground text-sm">أوبراين</span>
        </Link>

        {/* Navigation Links - Only show on landing page */}
        {isLandingPage && !user && (
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
        )}

        {/* User Navigation Links - Show when logged in */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة التحكم
            </Link>
            <Link 
              to="/studio" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/studio' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              الاستوديو
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                location.pathname === '/gallery' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Image className="w-4 h-4" />
              المعرض
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3">
          <LanguageToggle />
          
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            // User is logged in - show enhanced avatar dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-auto py-1.5 px-2 rounded-full hover:bg-muted/50 transition-all flex items-center gap-2 group"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/30 group-hover:border-primary/50 transition-colors">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium truncate max-w-[100px]">
                      {profile?.full_name?.split(' ')[0] || 'مستخدم'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {userCode}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end" forceMount>
                {/* User Header */}
                <div className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {profile?.full_name || 'مستخدم جديد'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {/* User ID */}
                  <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-[10px] text-muted-foreground">معرّف المستخدم</p>
                      <p className="text-sm font-mono font-bold text-primary">{userCode}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyUserCode}
                      className="h-8 w-8 rounded-lg hover:bg-background/50"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-2">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/studio" className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg">
                      <div className="p-1.5 rounded-lg bg-accent/10">
                        <Sparkles className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium">استوديو الإبداع</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/gallery" className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10">
                        <Image className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="font-medium">معرض أعمالي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg">
                      <div className="p-1.5 rounded-lg bg-amber-500/10">
                        <Settings className="w-4 h-4 text-amber-500" />
                      </div>
                      <span className="font-medium">الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />
                
                <div className="p-2">
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg text-destructive focus:text-destructive hover:bg-destructive/10"
                  >
                    <div className="p-1.5 rounded-lg bg-destructive/10">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // User is not logged in - show login/signup buttons
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
