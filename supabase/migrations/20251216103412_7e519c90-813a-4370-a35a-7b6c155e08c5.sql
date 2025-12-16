-- Create table for storing generated content history
CREATE TABLE public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  mood TEXT,
  platform TEXT,
  business_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (but allow public access for this personal use case)
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read content (personal use, no auth)
CREATE POLICY "Anyone can read generated content"
ON public.generated_content
FOR SELECT
USING (true);

-- Allow anyone to insert content (personal use, no auth)
CREATE POLICY "Anyone can insert generated content"
ON public.generated_content
FOR INSERT
WITH CHECK (true);

-- Allow anyone to delete content (personal use, no auth)
CREATE POLICY "Anyone can delete generated content"
ON public.generated_content
FOR DELETE
USING (true);

-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true);

-- Allow public access to read images
CREATE POLICY "Public read access for generated images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'generated-images');

-- Allow anyone to upload images
CREATE POLICY "Anyone can upload generated images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'generated-images');

-- Allow anyone to delete images
CREATE POLICY "Anyone can delete generated images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'generated-images');