-- Drop existing policies on chat_conversations
DROP POLICY IF EXISTS "Anyone can delete conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can read conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can update conversations" ON public.chat_conversations;

-- Drop existing policies on chat_messages
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;

-- Drop existing policies on generated_content
DROP POLICY IF EXISTS "Anyone can delete generated content" ON public.generated_content;
DROP POLICY IF EXISTS "Anyone can insert generated content" ON public.generated_content;
DROP POLICY IF EXISTS "Anyone can read generated content" ON public.generated_content;

-- Create read-only policies for chat_conversations
CREATE POLICY "Public read-only access to conversations"
ON public.chat_conversations
FOR SELECT
USING (true);

-- Create read-only policies for chat_messages
CREATE POLICY "Public read-only access to messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Create read-only policies for generated_content
CREATE POLICY "Public read-only access to generated content"
ON public.generated_content
FOR SELECT
USING (true);