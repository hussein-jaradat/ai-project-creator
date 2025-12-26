-- Create automation_jobs table for tracking content automation
CREATE TABLE public.automation_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'researching', 'analyzing', 'generating', 'publishing', 'completed', 'failed')),
  
  -- Research results
  research_query TEXT,
  research_results JSONB DEFAULT '[]'::jsonb,
  
  -- Analyzed content
  analyzed_ideas JSONB DEFAULT '[]'::jsonb,
  selected_idea JSONB,
  
  -- Generated content
  generated_prompt TEXT,
  generated_video_url TEXT,
  generated_caption TEXT,
  
  -- Publishing config
  webhook_url TEXT,
  target_platforms TEXT[] DEFAULT ARRAY['tiktok', 'instagram', 'youtube'],
  publish_status JSONB DEFAULT '{}'::jsonb,
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  
  -- Tracking
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user automation settings table
CREATE TABLE public.automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  webhook_url TEXT,
  default_platforms TEXT[] DEFAULT ARRAY['tiktok', 'instagram', 'youtube'],
  auto_publish BOOLEAN DEFAULT false,
  search_keywords TEXT[] DEFAULT ARRAY['AI generated video', 'viral AI content'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for automation_jobs
CREATE POLICY "Users can view their own automation jobs"
ON public.automation_jobs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automation jobs"
ON public.automation_jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation jobs"
ON public.automation_jobs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automation jobs"
ON public.automation_jobs FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for automation_settings
CREATE POLICY "Users can view their own automation settings"
ON public.automation_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own automation settings"
ON public.automation_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automation settings"
ON public.automation_settings FOR UPDATE
USING (auth.uid() = user_id);

-- Create updated_at trigger for both tables
CREATE TRIGGER update_automation_jobs_updated_at
BEFORE UPDATE ON public.automation_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_settings_updated_at
BEFORE UPDATE ON public.automation_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();