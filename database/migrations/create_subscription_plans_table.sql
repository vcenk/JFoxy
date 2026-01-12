-- Create subscription plans management table
-- Migration: create_subscription_plans_table.sql

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL UNIQUE CHECK (tier IN ('basic', 'pro', 'premium')),
  name text NOT NULL,
  description text,
  price_monthly numeric(10, 2) NOT NULL DEFAULT 0,
  price_yearly numeric(10, 2),
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  is_active boolean DEFAULT true,

  -- Feature Limits
  resume_builds_limit integer DEFAULT 0, -- 0 means no access, -1 means unlimited
  job_analyses_limit integer DEFAULT 0,
  audio_practice_sessions_limit integer DEFAULT 0, -- Practice sessions (not individual questions)
  video_mock_interviews_limit integer DEFAULT 0,
  monthly_video_credits integer DEFAULT 0,

  -- Coaching Limits
  star_stories_limit integer DEFAULT 0, -- STAR story builder
  swot_analyses_limit integer DEFAULT 0, -- SWOT analysis
  gap_defenses_limit integer DEFAULT 0, -- Gap defense coaching
  intro_pitches_limit integer DEFAULT 0, -- Intro pitch coaching

  -- Feature Flags
  features jsonb DEFAULT '[]'::jsonb, -- Array of feature names
  analytics_level text DEFAULT 'basic' CHECK (analytics_level IN ('basic', 'standard', 'advanced')),

  -- UI Display
  display_order integer DEFAULT 0,
  badge_text text, -- e.g., "Most Popular", "Best Value"
  badge_color text,
  highlight_features text[], -- Array of key features to highlight

  -- Metadata
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default plans based on current constants
INSERT INTO subscription_plans (
  tier, name, description, price_monthly, price_yearly,
  resume_builds_limit, job_analyses_limit, audio_practice_sessions_limit,
  video_mock_interviews_limit, monthly_video_credits,
  star_stories_limit, swot_analyses_limit, gap_defenses_limit, intro_pitches_limit,
  analytics_level, display_order, highlight_features
) VALUES
(
  'basic',
  'Basic',
  'For job seekers exploring their options.',
  0.00,
  0.00,
  1, -- 1 resume build
  3, -- 3 job analyses
  1, -- 1 audio practice session
  0, -- No video mocks
  0, -- No video credits
  1, -- 1 STAR story
  1, -- 1 SWOT analysis
  1, -- 1 gap defense
  1, -- 1 intro pitch
  'basic',
  1,
  ARRAY['1 Resume Build', '3 AI Job Analysis Scans', '1 Audio Practice Session', 'Basic Analytics', 'Community Support']
),
(
  'pro',
  'Pro',
  'For active job seekers needing more tools.',
  19.00,
  190.00,
  -1, -- Unlimited resume builds
  -1, -- Unlimited job analyses
  -1, -- Unlimited audio practice sessions
  0, -- Video mocks require credits (pay-per-use)
  0, -- No included credits
  -1, -- Unlimited STAR stories
  -1, -- Unlimited SWOT analyses
  -1, -- Unlimited gap defenses
  -1, -- Unlimited intro pitches
  'standard',
  2,
  ARRAY['Unlimited Resume Builds', 'Unlimited Job Analysis', 'Unlimited Audio Practice', 'Standard AI Avatars', 'Standard Voice Options', 'Access to Credit Packs']
),
(
  'premium',
  'Premium',
  'For high-stakes interviews & executives.',
  49.00,
  490.00,
  -1, -- Unlimited resume builds
  -1, -- Unlimited job analyses
  -1, -- Unlimited audio practice sessions
  -1, -- Unlimited video mocks
  20, -- 20 monthly video credits (4 sessions)
  -1, -- Unlimited STAR stories
  -1, -- Unlimited SWOT analyses
  -1, -- Unlimited gap defenses
  -1, -- Unlimited intro pitches
  'advanced',
  3,
  ARRAY['Everything in Pro', '4 Video Interview Sessions /mo', 'Advanced Behavioral Analytics', 'Premium 4K Avatars', 'All 35+ Voice Styles', 'Priority Processing']
);

-- Create index for faster queries
CREATE INDEX idx_subscription_plans_tier ON subscription_plans(tier);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);

-- Add RLS policies (admin only can modify)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read active plans
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can modify subscription plans"
  ON subscription_plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plans_updated_at();

-- Add comment
COMMENT ON TABLE subscription_plans IS 'Configurable subscription plans with limits and features managed by admin';
