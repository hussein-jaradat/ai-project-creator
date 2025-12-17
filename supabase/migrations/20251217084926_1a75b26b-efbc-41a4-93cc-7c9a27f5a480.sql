-- Add video_url column to generated_content table
ALTER TABLE public.generated_content ADD COLUMN video_url TEXT;

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-videos', 'generated-videos', true);

-- Storage policies for videos bucket
CREATE POLICY "Anyone can read videos" ON storage.objects FOR SELECT USING (bucket_id = 'generated-videos');
CREATE POLICY "Anyone can upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'generated-videos');
CREATE POLICY "Anyone can delete videos" ON storage.objects FOR DELETE USING (bucket_id = 'generated-videos');