-- Create niches table for lead categories
CREATE TABLE IF NOT EXISTS public.niches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  region TEXT NOT NULL,
  industry TEXT NOT NULL,
  roles TEXT[] DEFAULT '{}',
  lead_count INTEGER DEFAULT 0,
  price_per_lead DECIMAL(10, 4) DEFAULT 0.02,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'coming_soon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (public read, admin write)
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;

-- Anyone can view active niches
CREATE POLICY "Anyone can view active niches"
  ON public.niches FOR SELECT
  USING (status = 'active' OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
  ));

-- Only admins can insert/update/delete niches
CREATE POLICY "Admins can insert niches"
  ON public.niches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update niches"
  ON public.niches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can delete niches"
  ON public.niches FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
