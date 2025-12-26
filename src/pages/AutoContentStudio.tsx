import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Sparkles, 
  Video, 
  Send, 
  Settings, 
  Play, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  Lightbulb,
  ExternalLink,
  Copy,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useAutomation, ContentIdea, TrendResult, AutomationJob } from "@/hooks/useAutomation";
import { toast } from "@/hooks/use-toast";

const AutoContentStudio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isResearching,
    isAnalyzing,
    isGenerating,
    trendResults,
    analysisResult,
    jobs,
    settings,
    fetchSettings,
    saveSettings,
    researchTrends,
    analyzeContent,
    generateFromIdea,
    fetchJobs,
    publishContent,
    testWebhook,
    runFullPipeline
  } = useAutomation();

  const [webhookUrl, setWebhookUrl] = useState("");
  const [autoPublish, setAutoPublish] = useState(false);
  const [searchKeywords, setSearchKeywords] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["tiktok", "instagram", "youtube"]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchSettings();
    fetchJobs();
  }, [user]);

  useEffect(() => {
    if (settings) {
      setWebhookUrl(settings.webhook_url || "");
      setAutoPublish(settings.auto_publish);
      setSearchKeywords(settings.search_keywords?.join(", ") || "");
      setSelectedPlatforms(settings.default_platforms);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    await saveSettings({
      webhook_url: webhookUrl || undefined,
      auto_publish: autoPublish,
      search_keywords: searchKeywords.split(",").map(k => k.trim()).filter(Boolean),
      default_platforms: selectedPlatforms
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'generating': case 'analyzing': case 'researching': 
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'publishing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'generating': case 'analyzing': case 'researching': 
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'publishing': return <Send className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">استوديو الأتمتة</h1>
              <p className="text-sm text-muted-foreground">توليد محتوى فايرال تلقائياً</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              العودة للوحة التحكم
            </Button>
            <Button 
              onClick={runFullPipeline}
              disabled={isResearching || isAnalyzing || isGenerating}
              className="gap-2"
            >
              {(isResearching || isAnalyzing || isGenerating) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              تشغيل الأتمتة الكاملة
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="pipeline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              خط الإنتاج
            </TabsTrigger>
            <TabsTrigger value="ideas" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              الأفكار
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Video className="h-4 w-4" />
              العمليات
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1: Research */}
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">1. البحث</CardTitle>
                      <CardDescription>البحث عن المحتوى الفايرال</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => researchTrends()}
                    disabled={isResearching}
                    className="w-full gap-2"
                  >
                    {isResearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    ابحث عن Trends
                  </Button>
                  
                  {trendResults.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      تم العثور على {trendResults.length} نتيجة
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Analyze */}
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">2. التحليل</CardTitle>
                      <CardDescription>تحليل وتوليد الأفكار</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => analyzeContent()}
                    disabled={isAnalyzing || trendResults.length === 0}
                    className="w-full gap-2"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lightbulb className="h-4 w-4" />
                    )}
                    حلل وولد أفكار
                  </Button>
                  
                  {analysisResult?.ideas && (
                    <div className="text-sm text-muted-foreground">
                      تم توليد {analysisResult.ideas.length} أفكار
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 3: Generate */}
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">3. التوليد</CardTitle>
                      <CardDescription>إنشاء الفيديو والنشر</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    اختر فكرة من تبويب "الأفكار" للتوليد
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Trend Results Preview */}
            {trendResults.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">نتائج البحث</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {trendResults.slice(0, 10).map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{result.title || 'بدون عنوان'}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {result.description || 'بدون وصف'}
                              </p>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              {result.platform}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            {analysisResult?.ideas && analysisResult.ideas.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {analysisResult.ideas.map((idea, idx) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg">{idea.title}</CardTitle>
                            <CardDescription className="mt-2">{idea.description}</CardDescription>
                          </div>
                          <Badge 
                            variant="outline"
                            className={
                              idea.estimatedEngagement === 'high' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : idea.estimatedEngagement === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-muted'
                            }
                          >
                            {idea.estimatedEngagement === 'high' ? 'تفاعل عالي' 
                              : idea.estimatedEngagement === 'medium' ? 'تفاعل متوسط' 
                              : 'تفاعل منخفض'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">عوامل النجاح:</h5>
                          <div className="flex flex-wrap gap-2">
                            {idea.viralFactors?.map((factor, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">الكابشن:</h5>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {idea.suggestedCaption}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">الهاشتاقات:</h5>
                          <div className="flex flex-wrap gap-1">
                            {idea.hashtags?.map((tag, i) => (
                              <span key={i} className="text-xs text-primary">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={() => generateFromIdea(idea)}
                          disabled={isGenerating}
                          className="w-full gap-2"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Video className="h-4 w-4" />
                          )}
                          ولد فيديو من هذه الفكرة
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">لا توجد أفكار بعد</h3>
                  <p className="text-muted-foreground mt-2">
                    قم بالبحث والتحليل أولاً لتوليد أفكار جديدة
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">سجل العمليات</h2>
              <Button variant="outline" size="sm" onClick={fetchJobs} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                تحديث
              </Button>
            </div>

            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border-border/50">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant="outline" 
                              className={`gap-1 ${getStatusColor(job.status)}`}
                            >
                              {getStatusIcon(job.status)}
                              {job.status}
                            </Badge>
                            <div>
                              <p className="font-medium">
                                {(job.selected_idea as ContentIdea)?.title || 'عملية أتمتة'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(job.created_at).toLocaleString('ar-SA')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {job.generated_video_url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(job.generated_video_url!, '_blank')}
                                className="gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                عرض
                              </Button>
                            )}
                            {job.status === 'completed' && job.generated_video_url && (
                              <Button 
                                size="sm"
                                onClick={() => publishContent(job.id)}
                                className="gap-1"
                              >
                                <Send className="h-3 w-3" />
                                نشر
                              </Button>
                            )}
                          </div>
                        </div>

                        {job.error_message && (
                          <p className="text-sm text-red-400 mt-2 p-2 bg-red-500/10 rounded">
                            {job.error_message}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium">لا توجد عمليات</h3>
                  <p className="text-muted-foreground mt-2">
                    ابدأ بتشغيل الأتمتة لإنشاء محتوى جديد
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>إعدادات n8n</CardTitle>
                <CardDescription>
                  قم بربط n8n لنشر المحتوى تلقائياً على منصات التواصل
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhook">Webhook URL</Label>
                  <Input
                    id="webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-n8n-instance.com/webhook/..."
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    أدخل رابط الـ Webhook من n8n لاستقبال المحتوى
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>النشر التلقائي</Label>
                    <p className="text-xs text-muted-foreground">
                      نشر المحتوى تلقائياً بعد التوليد
                    </p>
                  </div>
                  <Switch
                    checked={autoPublish}
                    onCheckedChange={setAutoPublish}
                  />
                </div>

                <div className="space-y-2">
                  <Label>المنصات المستهدفة</Label>
                  <div className="flex flex-wrap gap-2">
                    {['tiktok', 'instagram', 'youtube', 'facebook'].map((platform) => (
                      <Badge
                        key={platform}
                        variant={selectedPlatforms.includes(platform) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handlePlatformToggle(platform)}
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">كلمات البحث</Label>
                  <Input
                    id="keywords"
                    value={searchKeywords}
                    onChange={(e) => setSearchKeywords(e.target.value)}
                    placeholder="AI video viral, trending content"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    افصل بين الكلمات بفاصلة
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveSettings} className="flex-1">
                    حفظ الإعدادات
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={testWebhook}
                    disabled={!webhookUrl}
                  >
                    اختبار الاتصال
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* n8n Setup Guide */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>كيفية إعداد n8n</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <p className="text-sm">أنشئ Workflow جديد في n8n</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <p className="text-sm">أضف Webhook Trigger كنقطة بداية</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <p className="text-sm">أضف nodes للنشر على المنصات (TikTok, Instagram, etc)</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary">4</span>
                    </div>
                    <p className="text-sm">انسخ رابط الـ Webhook والصقه هنا</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AutoContentStudio;
