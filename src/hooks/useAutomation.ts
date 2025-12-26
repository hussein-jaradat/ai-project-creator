import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TrendResult {
  url: string;
  title: string;
  description: string;
  markdown?: string;
  platform: string;
  keyword: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  viralFactors: string[];
  generationPrompt: string;
  suggestedCaption: string;
  hashtags: string[];
  estimatedEngagement: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  analysis: {
    commonElements: string[];
    successFactors: string[];
    trends: string[];
  };
  ideas: ContentIdea[];
}

export interface AutomationJob {
  id: string;
  status: string;
  research_query?: string;
  research_results?: any[];
  analyzed_ideas?: ContentIdea[];
  selected_idea?: ContentIdea;
  generated_prompt?: string;
  generated_video_url?: string;
  generated_caption?: string;
  target_platforms?: string[];
  publish_status?: any;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface AutomationSettings {
  webhook_url?: string;
  default_platforms: string[];
  auto_publish: boolean;
  search_keywords: string[];
}

export function useAutomation() {
  const [isResearching, setIsResearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trendResults, setTrendResults] = useState<TrendResult[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [settings, setSettings] = useState<AutomationSettings | null>(null);

  // Fetch user's automation settings
  const fetchSettings = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('automation_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return null;
    }

    if (data) {
      setSettings({
        webhook_url: data.webhook_url || undefined,
        default_platforms: data.default_platforms || ['tiktok', 'instagram', 'youtube'],
        auto_publish: data.auto_publish || false,
        search_keywords: data.search_keywords || ['AI generated video', 'viral AI content']
      });
    }

    return data;
  }, []);

  // Save automation settings
  const saveSettings = useCallback(async (newSettings: Partial<AutomationSettings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'خطأ', description: 'يجب تسجيل الدخول أولاً', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase
      .from('automation_settings')
      .upsert({
        user_id: user.id,
        ...newSettings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'خطأ', description: 'فشل حفظ الإعدادات', variant: 'destructive' });
      return false;
    }

    await fetchSettings();
    toast({ title: 'تم الحفظ', description: 'تم حفظ إعدادات الأتمتة' });
    return true;
  }, [fetchSettings]);

  // Research trending content
  const researchTrends = useCallback(async (keywords?: string[], platforms?: string[]) => {
    setIsResearching(true);
    setTrendResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('trend-research', {
        body: {
          keywords: keywords || settings?.search_keywords || ['AI video viral', 'trending AI content'],
          platforms: platforms || settings?.default_platforms || ['tiktok', 'instagram', 'youtube'],
          timeRange: 'week',
          limit: 15
        }
      });

      if (error) throw error;

      if (data?.success && data.results) {
        setTrendResults(data.results);
        toast({ 
          title: 'تم البحث', 
          description: `تم العثور على ${data.results.length} نتيجة` 
        });
        return data.results;
      } else {
        throw new Error(data?.error || 'Research failed');
      }
    } catch (error) {
      console.error('Research error:', error);
      toast({ 
        title: 'خطأ في البحث', 
        description: error instanceof Error ? error.message : 'فشل البحث', 
        variant: 'destructive' 
      });
      return [];
    } finally {
      setIsResearching(false);
    }
  }, [settings]);

  // Analyze content and generate ideas
  const analyzeContent = useCallback(async (results?: TrendResult[]) => {
    const dataToAnalyze = results || trendResults;
    
    if (dataToAnalyze.length === 0) {
      toast({ title: 'تنبيه', description: 'لا توجد نتائج للتحليل', variant: 'destructive' });
      return null;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('content-analyzer', {
        body: {
          researchResults: dataToAnalyze,
          targetPlatform: settings?.default_platforms?.[0] || 'tiktok',
          contentStyle: 'creative'
        }
      });

      if (error) throw error;

      if (data?.success) {
        const result: AnalysisResult = {
          analysis: data.analysis,
          ideas: data.ideas
        };
        setAnalysisResult(result);
        toast({ 
          title: 'تم التحليل', 
          description: `تم توليد ${data.ideas?.length || 0} أفكار` 
        });
        return result;
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ 
        title: 'خطأ في التحليل', 
        description: error instanceof Error ? error.message : 'فشل التحليل', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [trendResults, settings]);

  // Generate content from an idea
  const generateFromIdea = useCallback(async (idea: ContentIdea) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'خطأ', description: 'يجب تسجيل الدخول أولاً', variant: 'destructive' });
      return null;
    }

    setIsGenerating(true);

    try {
      // Create a job record
      const { data: job, error: jobError } = await supabase
        .from('automation_jobs')
        .insert({
          user_id: user.id,
          status: 'generating',
          research_results: trendResults as any,
          analyzed_ideas: (analysisResult?.ideas || []) as any,
          selected_idea: idea as any,
          target_platforms: settings?.default_platforms || ['tiktok', 'instagram', 'youtube'],
          webhook_url: settings?.webhook_url
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Call auto-generate function
      const { data, error } = await supabase.functions.invoke('auto-generate-content', {
        body: {
          jobId: job.id,
          idea,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({ 
          title: 'تم التوليد', 
          description: 'تم إنشاء الفيديو بنجاح' 
        });
        await fetchJobs();
        return data;
      } else {
        throw new Error(data?.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({ 
        title: 'خطأ في التوليد', 
        description: error instanceof Error ? error.message : 'فشل التوليد', 
        variant: 'destructive' 
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [trendResults, analysisResult, settings]);

  // Fetch user's automation jobs
  const fetchJobs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('automation_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }

    setJobs((data as unknown as AutomationJob[]) || []);
    return data;
  }, []);

  // Publish content via webhook
  const publishContent = useCallback(async (jobId: string, platforms?: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('automation-webhook', {
        body: {
          jobId,
          action: 'publish',
          platforms: platforms || settings?.default_platforms
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({ 
          title: 'تم الإرسال', 
          description: 'تم إرسال المحتوى للنشر' 
        });
        await fetchJobs();
        return true;
      } else {
        throw new Error(data?.error || 'Publish failed');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast({ 
        title: 'خطأ في النشر', 
        description: error instanceof Error ? error.message : 'فشل النشر', 
        variant: 'destructive' 
      });
      return false;
    }
  }, [settings, fetchJobs]);

  // Test webhook connection
  const testWebhook = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('automation-webhook', {
        body: { action: 'test' }
      });

      if (error) throw error;

      if (data?.success) {
        toast({ 
          title: 'نجح الاتصال', 
          description: 'تم إرسال رسالة اختبار للـ Webhook' 
        });
        return true;
      } else {
        throw new Error(data?.error || 'Test failed');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
      toast({ 
        title: 'فشل الاختبار', 
        description: error instanceof Error ? error.message : 'لم يتم الاتصال', 
        variant: 'destructive' 
      });
      return false;
    }
  }, []);

  // Run full automation pipeline
  const runFullPipeline = useCallback(async () => {
    toast({ title: 'بدء الأتمتة', description: 'جاري البحث عن المحتوى الفايرال...' });

    // Step 1: Research
    const trends = await researchTrends();
    if (!trends || trends.length === 0) return null;

    // Step 2: Analyze
    toast({ title: 'جاري التحليل', description: 'تحليل المحتوى واستخراج الأفكار...' });
    const analysis = await analyzeContent(trends);
    if (!analysis || !analysis.ideas || analysis.ideas.length === 0) return null;

    // Step 3: Generate from best idea
    const bestIdea = analysis.ideas.find(i => i.estimatedEngagement === 'high') || analysis.ideas[0];
    toast({ title: 'جاري التوليد', description: `توليد فيديو: ${bestIdea.title}` });
    
    const result = await generateFromIdea(bestIdea);
    
    return result;
  }, [researchTrends, analyzeContent, generateFromIdea]);

  return {
    // States
    isResearching,
    isAnalyzing,
    isGenerating,
    trendResults,
    analysisResult,
    jobs,
    settings,
    
    // Actions
    fetchSettings,
    saveSettings,
    researchTrends,
    analyzeContent,
    generateFromIdea,
    fetchJobs,
    publishContent,
    testWebhook,
    runFullPipeline,
    
    // Setters
    setTrendResults,
    setAnalysisResult
  };
}
