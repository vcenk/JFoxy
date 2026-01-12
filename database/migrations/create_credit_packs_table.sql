-- Create credit packs management table
-- Migration: create_credit_packs_table.sql

-- Create credit_packs table
CREATE TABLE IF NOT EXISTS credit_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_key text NOT NULL UNIQUE, -- e.g., 'starter', 'pro', 'founders'
  name text NOT NULL,
  description text,
  credits integer NOT NULL,
  price_usd numeric(10, 2) NOT NULL,
  stripe_price_id text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  badge_text text, -- e.g., "Best Value", "Most Popular"
  savings_text text, -- e.g., "Save 20%"

  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default credit packs
INSERT INTO credit_packs (
  pack_key, name, description, credits, price_usd, display_order, badge_text, savings_text
) VALUES
(
  'starter',
  'Starter Pack',
  'Perfect for trying out video interviews',
  10,
  12.00,
  1,
  NULL,
  NULL
),
(
  'pro',
  'Pro Pack',
  'Best for regular interview practice',
  25,
  25.00,
  2,
  'Most Popular',
  'Save 17%'
),
(
  'founders',
  'Founders Pack',
  'Best value for serious interview prep',
  50,
  45.00,
  3,
  'Best Value',
  'Save 25%'
);

-- Create index for faster queries
CREATE INDEX idx_credit_packs_key ON credit_packs(pack_key);
CREATE INDEX idx_credit_packs_active ON credit_packs(is_active);

-- Add RLS policies
ALTER TABLE credit_packs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read active packs
CREATE POLICY "Anyone can view active credit packs"
  ON credit_packs FOR SELECT
  USING (is_active = true);

-- Only admins can modify
CREATE POLICY "Only admins can modify credit packs"
  ON credit_packs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_credit_packs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_credit_packs_updated_at
  BEFORE UPDATE ON credit_packs
  FOR EACH ROW
  EXECUTE FUNCTION update_credit_packs_updated_at();

-- Add comment
COMMENT ON TABLE credit_packs IS 'Configurable credit packs for video mock interviews managed by admin';
