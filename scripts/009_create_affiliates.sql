-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  affiliate_code VARCHAR(20) UNIQUE NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 20.00, -- 20% default commission
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  pending_earnings DECIMAL(10, 2) DEFAULT 0,
  paid_earnings DECIMAL(10, 2) DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  payment_email VARCHAR(255),
  payment_method VARCHAR(50) DEFAULT 'paypal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'expired')),
  ip_address VARCHAR(45),
  user_agent TEXT,
  landing_page TEXT,
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_commissions table
CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_payouts table
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  transaction_reference VARCHAR(255),
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add referral tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES affiliates(id);

-- Enable RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates
CREATE POLICY "Users can view their own affiliate data"
  ON affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate data"
  ON affiliates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliate application"
  ON affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Affiliates can view their own referrals"
  ON referrals FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- RLS Policies for commissions
CREATE POLICY "Affiliates can view their own commissions"
  ON affiliate_commissions FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- RLS Policies for payouts
CREATE POLICY "Affiliates can view their own payouts"
  ON affiliate_payouts FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

CREATE POLICY "Affiliates can request payouts"
  ON affiliate_payouts FOR INSERT
  WITH CHECK (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_payouts_affiliate_id ON affiliate_payouts(affiliate_id);

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists_count INTEGER;
BEGIN
  LOOP
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    SELECT COUNT(*) INTO exists_count FROM affiliates WHERE affiliate_code = code;
    IF exists_count = 0 THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
