-- Seed initial niches data
INSERT INTO public.niches (name, description, region, industry, roles, lead_count, price_per_lead, status) VALUES
  ('UAE Real Estate Agents', 'Licensed real estate professionals in UAE', 'UAE', 'Real Estate', ARRAY['Agents', 'Brokers'], 12500, 0.02, 'active'),
  ('Saudi Tech Founders', 'Tech startup founders and co-founders in Saudi Arabia', 'Saudi Arabia', 'Technology', ARRAY['CEOs', 'CTOs', 'Founders'], 8200, 0.025, 'active'),
  ('Pakistan Ecommerce Owners', 'Ecommerce business owners in Pakistan', 'Pakistan', 'Ecommerce', ARRAY['Founders', 'Directors'], 15000, 0.015, 'active'),
  ('GCC HR Directors', 'Human resources leaders across GCC countries', 'GCC', 'Human Resources', ARRAY['HR Directors', 'CHROs'], 5400, 0.03, 'active'),
  ('Dubai Marketing Managers', 'Marketing professionals in Dubai', 'UAE', 'Marketing', ARRAY['Marketing Managers', 'CMOs'], 7800, 0.022, 'active'),
  ('Qatar Finance Executives', 'Finance leaders in Qatar', 'Qatar', 'Finance', ARRAY['CFOs', 'Finance Directors'], 3200, 0.035, 'active'),
  ('Kuwait IT Managers', 'IT and technology managers in Kuwait', 'Kuwait', 'Technology', ARRAY['IT Managers', 'CIOs'], 4100, 0.028, 'active'),
  ('Bahrain Hospitality Leaders', 'Hotel and hospitality executives in Bahrain', 'Bahrain', 'Hospitality', ARRAY['GMs', 'Operations Directors'], 2800, 0.03, 'active'),
  ('MENA SaaS Founders', 'SaaS company founders across MENA region', 'MENA', 'Technology', ARRAY['Founders', 'CEOs'], 6500, 0.04, 'active'),
  ('Egypt Digital Marketers', 'Digital marketing professionals in Egypt', 'Egypt', 'Marketing', ARRAY['Digital Marketers', 'Growth Managers'], 9200, 0.018, 'active')
ON CONFLICT DO NOTHING;
