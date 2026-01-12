-- database/migrations/add_pricing_tiers.sql
-- Adds new columns to the 'profiles' table for subscription tiers and usage tracking.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'premium')),
ADD COLUMN IF NOT EXISTS resume_builds_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS job_analyses_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS audio_practice_sessions_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_video_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS purchased_video_credits INTEGER DEFAULT 0;

-- Optionally, set initial subscription_tier based on existing subscription_status
UPDATE public.profiles
SET subscription_tier = 'pro'
WHERE subscription_status = 'active' OR subscription_status = 'trialing';

-- Update the reset_monthly_usage function to handle new counters and monthly_video_credits
-- This function will need to be executed after this migration to ensure it's up to date.
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    ai_tokens_used_this_month = 0,
    practice_sessions_this_month = 0,
    mock_interviews_this_month = 0,
    resume_builds_this_month = 0,
    job_analyses_this_month = 0,
    audio_practice_sessions_this_month = 0,
    -- Reset monthly_video_credits based on tier
    monthly_video_credits = CASE
      WHEN subscription_tier = 'premium' THEN 20 -- Premium gets 4 sessions * 5 credits
      ELSE 0
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
