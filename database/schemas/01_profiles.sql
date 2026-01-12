-- database/schemas/01_profiles.sql
-- User profiles table with subscription information

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,

  -- Subscription & Billing
  subscription_status TEXT DEFAULT 'free'::text CHECK (subscription_status = ANY (ARRAY['free'::text, 'active'::text, 'past_due'::text, 'canceled'::text, 'trialing'::text])),
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'premium')), -- New pricing tier
  subscription_price_id TEXT,
  subscription_current_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,

  -- Usage tracking
  ai_tokens_used_this_month INTEGER DEFAULT 0,
  practice_sessions_this_month INTEGER DEFAULT 0,
  mock_interviews_this_month INTEGER DEFAULT 0,
  resume_builds_this_month INTEGER DEFAULT 0, -- New
  job_analyses_this_month INTEGER DEFAULT 0, -- New
  audio_practice_sessions_this_month INTEGER DEFAULT 0, -- New
  monthly_video_credits INTEGER DEFAULT 0, -- New (resets monthly)
  purchased_video_credits INTEGER DEFAULT 0, -- New (never expires)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_tier, -- Initialize new column
    resume_builds_this_month,
    job_analyses_this_month,
    audio_practice_sessions_this_month,
    monthly_video_credits,
    purchased_video_credits
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'basic', -- Default to basic tier
    0, 0, 0, 0, 0 -- Initialize new counters to 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
-- New Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
