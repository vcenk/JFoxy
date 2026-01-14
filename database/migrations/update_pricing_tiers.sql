-- database/migrations/update_pricing_tiers.sql
-- Migration to update profiles table for new 4-tier pricing system
-- Run this in Supabase SQL Editor

-- Step 1: Update subscription_tier constraint to include new tiers
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'basic', 'pro', 'interview_ready'));

-- Step 2: Migrate existing tier values
-- 'premium' -> 'interview_ready' (highest tier mapping)
UPDATE profiles SET subscription_tier = 'interview_ready' WHERE subscription_tier = 'premium';
-- Set default tier for new users to 'free' instead of 'basic'
ALTER TABLE profiles ALTER COLUMN subscription_tier SET DEFAULT 'free';

-- Step 3: Add new columns for the updated usage tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_letters_this_month INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS star_voice_sessions_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mock_interview_minutes_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purchased_star_sessions INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purchased_mock_minutes INTEGER DEFAULT 0;

-- Step 4: Migrate old video credits to new system
-- purchased_video_credits * 5 = mock_minutes (each credit was 1 session = ~5 min approx)
-- This is a rough conversion - adjust based on your needs
UPDATE profiles
SET purchased_mock_minutes = COALESCE(purchased_video_credits, 0) * 5
WHERE purchased_video_credits > 0 AND purchased_mock_minutes = 0;

-- Step 5: Add admin column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Step 6: Add preferences column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Step 7: Update the handle_new_user function for new tier defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_tier,
    subscription_status,
    resume_builds_this_month,
    job_analyses_this_month,
    cover_letters_this_month,
    star_voice_sessions_used,
    mock_interview_minutes_used,
    purchased_star_sessions,
    purchased_mock_minutes,
    is_admin,
    preferences
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',  -- Default to free tier
    'free',  -- Default subscription status
    0, 0, 0, 0, 0, 0, 0,  -- Initialize counters to 0
    FALSE,   -- Not admin by default
    '{}'::jsonb  -- Empty preferences
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Drop old increment_profile_counter functions and create new one
-- First, drop all existing versions of the function
DROP FUNCTION IF EXISTS increment_profile_counter(UUID, TEXT);
DROP FUNCTION IF EXISTS increment_profile_counter(UUID, TEXT, INTEGER);

-- Create new function with increment_value parameter
CREATE OR REPLACE FUNCTION increment_profile_counter(
  user_id UUID,
  counter_name TEXT,
  increment_value INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE profiles SET %I = COALESCE(%I, 0) + $1 WHERE id = $2',
    counter_name, counter_name
  ) USING increment_value, user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create index for faster tier-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

-- Step 10: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_profile_counter TO authenticated;
GRANT EXECUTE ON FUNCTION increment_profile_counter TO service_role;

-- Done! Verify with:
-- SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position;
