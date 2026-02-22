-- Create downloads table for user export history
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  niche_id UUID NOT NULL REFERENCES public.niches(id) ON DELETE CASCADE,
  lead_count INTEGER NOT NULL,
  credits_used INTEGER NOT NULL,
  file_url TEXT,
  file_name TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Users can view their own downloads
CREATE POLICY "Users can view their own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own downloads
CREATE POLICY "Users can insert their own downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
  ON public.downloads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_niche_id ON public.downloads(niche_id);
