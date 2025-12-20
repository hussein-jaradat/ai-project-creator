import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/landing/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sparkles, 
  Image, 
  Video, 
  FileText, 
  Copy, 
  Check,
  ArrowLeft,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Layout,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const userCode = (profile as any)?.user_code || 'OB-XXXXXX';

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'اليوم';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      title: 'استوديو الإبداع',
      description: 'أنشئ محتوى جديد بالذكاء الاصطناعي',
      icon: Sparkles,
      href: '/studio',
      color: 'from-primary to-primary/60',
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary'
    },
    {
      title: 'معرض أعمالي',
      description: 'استعرض كل إبداعاتك السابقة',
      icon: Image,
      href: '/gallery',
      color: 'from-accent to-accent/60',
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent'
    },
    {
      title: 'الملف الشخصي',
      description: 'أدر حسابك وإعداداتك',
      icon: Settings,
      href: '/profile',
      color: 'from-emerald-500 to-emerald-500/60',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500'
    }
  ];

  const stats = [
    { label: 'المشاريع', value: '0', icon: Layout, color: 'text-primary' },
    { label: 'الصور', value: '0', icon: Image, color: 'text-accent' },
    { label: 'الفيديوهات', value: '0', icon: Video, color: 'text-emerald-500' },
    { label: 'النصوص', value: '0', icon: FileText, color: 'text-amber-500' }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-card/90 via-card/80 to-primary/5 border-border/50 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* User Info */}
                <div className="flex items-center gap-4 md:gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-primary/30 shadow-xl ring-4 ring-primary/10">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </motion.div>

                  <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold font-heading">
                      أهلاً، {profile?.full_name?.split(' ')[0] || 'مستخدم'}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                      مرحباً بك في لوحة التحكم الخاصة بك
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      عضو منذ {formatDate(user?.created_at)}
                    </p>
                  </div>
                </div>

                {/* User ID Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full md:w-auto"
                >
                  <div className="relative p-4 md:p-6 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50 backdrop-blur-sm">
                    <div className="absolute top-2 right-2">
                      <span className="text-xs text-muted-foreground">معرّف المستخدم</span>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex-1">
                        <p className="text-2xl md:text-3xl font-mono font-bold tracking-wider text-primary">
                          {userCode}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyUserCode}
                        className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
            >
              <Card className="backdrop-blur-sm bg-card/60 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-muted/50 group-hover:scale-110 transition-transform ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            الوصول السريع
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.1 }}
              >
                <Link to={action.href}>
                  <Card className="group backdrop-blur-sm bg-card/60 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${action.color} transition-opacity duration-300`} style={{ opacity: 0.03 }} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                        </div>
                        <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/5 via-card/80 to-accent/5 border-border/50 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">ابدأ رحلتك الإبداعية</h3>
                    <p className="text-muted-foreground">
                      أنشئ أول محتوى لك باستخدام الذكاء الاصطناعي في دقائق معدودة
                    </p>
                  </div>
                </div>
                <Link to="/studio">
                  <Button 
                    size="lg" 
                    className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    ابدأ الآن
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}