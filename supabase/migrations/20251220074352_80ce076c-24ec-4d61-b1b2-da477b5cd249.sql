-- Add user_code column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- Create function to generate unique user code
CREATE OR REPLACE FUNCTION public.generate_user_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'OB-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Create function to set user_code on insert
CREATE OR REPLACE FUNCTION public.set_user_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  -- Only set if user_code is null
  IF NEW.user_code IS NULL THEN
    LOOP
      new_code := generate_user_code();
      SELECT EXISTS(SELECT 1 FROM profiles WHERE user_code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.user_code := new_code;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-generating user_code
DROP TRIGGER IF EXISTS trigger_set_user_code ON public.profiles;
CREATE TRIGGER trigger_set_user_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_code();

-- Update existing profiles that don't have user_code
UPDATE public.profiles 
SET user_code = generate_user_code() 
WHERE user_code IS NULL;