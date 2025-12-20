import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Navbar } from '@/components/landing/Navbar';
import { User, Mail, Calendar, Shield, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
      navigate('/');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    } finally {
      setIsLoggingOut(false);
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'غير معروف';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-4xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/studio"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">العودة للاستوديو</span>
            </Link>
          </div>

          {/* Profile Card */}
          <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl overflow-hidden">
            {/* Cover Gradient */}
            <div className="h-32 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 relative">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <CardHeader className="relative pb-0">
              {/* Avatar */}
              <div className="absolute -top-16 right-8">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl font-bold bg-primary/20 text-primary">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="pt-16 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    {profile?.full_name || 'مستخدم جديد'}
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        مسؤول
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {user?.email}
                  </CardDescription>
                </div>

                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-8">
              {/* Info Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    معلومات الحساب
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">تاريخ الانضمام</p>
                        <p className="font-medium">{formatDate(user?.created_at)}</p>
                      </div>
                    </div>

                    {profile?.provider && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Shield className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">طريقة التسجيل</p>
                          <p className="font-medium capitalize">{profile.provider}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    البدء السريع
                  </h3>

                  <div className="space-y-3">
                    <Link to="/studio">
                      <Button className="w-full justify-start gap-3 h-auto py-4" variant="outline">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">استوديو الإبداع</p>
                          <p className="text-sm text-muted-foreground">ابدأ في إنشاء محتوى جديد</p>
                        </div>
                      </Button>
                    </Link>

                    <Link to="/gallery">
                      <Button className="w-full justify-start gap-3 h-auto py-4" variant="outline">
                        <div className="p-2 rounded-lg bg-accent/10">
                          <User className="w-5 h-5 text-accent" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium">معرض أعمالي</p>
                          <p className="text-sm text-muted-foreground">استعرض المحتوى الذي أنشأته</p>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
