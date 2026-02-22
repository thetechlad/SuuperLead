-- Create leads table for actual lead data
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id UUID NOT NULL REFERENCES public.niches(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  linkedin_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage leads directly
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Create index for faster niche lookups
CREATE INDEX IF NOT EXISTS idx_leads_niche_id ON public.leads(niche_id);
