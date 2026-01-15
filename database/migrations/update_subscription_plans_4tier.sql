-- database/migrations/update_subscription_plans_4tier.sql
-- Migration to update subscription_plans table for 4-tier pricing system
-- Run this in Supabase SQL Editor

-- Step 1: Delete old plans FIRST (before changing constraint)
DELETE FROM subscription_plans;

-- Step 2: Now update the tier constraint to allow new tier values
ALTER TABLE subscription_plans DROP CONSTRAINT IF EXISTS subscription_plans_tier_check;
ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_tier_check
  CHECK (tier IN ('free', 'basic', 'pro', 'interview_ready'));

-- Step 3: Insert new 4-tier pricing plans
INSERT INTO subscription_plans (
  tier, name, description, price_monthly, price_yearly,
  stripe_price_id_monthly, stripe_price_id_yearly,
  resume_builds_limit, job_analyses_limit, audio_practice_sessions_limit,
  video_mock_interviews_limit, monthly_video_credits,
  star_stories_limit, swot_analyses_limit, gap_defenses_limit, intro_pitches_limit,
  features, analytics_level, display_order, badge_text, badge_color, highlight_features
) VALUES
-- FREE TIER ($0/mo)
(
  'free',
  'Free',
  'Get started with basic tools to explore your career options.',
  0.00,
  0.00,
  NULL, -- Set Stripe price IDs after creating in Stripe dashboard
  NULL,
  1,        -- 1 resume
  1,        -- 1 job analysis
  0,        -- No audio practice (STAR voice)
  0,        -- No video mocks
  0,        -- No video credits
  0,        -- No STAR stories (preview only)
  0,        -- No SWOT (preview only)
  0,        -- No gap defense (preview only)
  0,        -- No intro pitch (preview only)
  '["resume_builder", "job_analysis_preview", "coaching_preview"]'::jsonb,
  'basic',
  1,
  NULL,
  NULL,
  ARRAY['1 Resume Build', '1 Job Analysis', 'Coaching Preview (Blurred)', 'PDF Export']
),
-- BASIC TIER ($14.90/mo)
(
  'basic',
  'Basic',
  'Unlock unlimited analyses and full coaching access.',
  14.90,
  149.00,
  NULL, -- Set Stripe price IDs after creating in Stripe dashboard
  NULL,
  5,        -- 5 resumes
  -1,       -- Unlimited job analyses
  0,        -- No audio practice (STAR voice)
  0,        -- No video mocks
  0,        -- No video credits
  -1,       -- Unlimited STAR stories (text)
  -1,       -- Unlimited SWOT
  -1,       -- Unlimited gap defense
  -1,       -- Unlimited intro pitch
  '["resume_builder", "job_analysis", "coaching_full", "ai_improvements", "cover_letters"]'::jsonb,
  'standard',
  2,
  NULL,
  NULL,
  ARRAY['5 Resume Builds', 'Unlimited Job Analysis', 'Unlimited Cover Letters', 'Full Coaching Access', 'AI Improvements']
),
-- PRO TIER ($24.90/mo)
(
  'pro',
  'Pro',
  'Practice with AI voice sessions to perfect your interview answers.',
  24.90,
  249.00,
  NULL, -- Set Stripe price IDs after creating in Stripe dashboard
  NULL,
  5,        -- 5 resumes
  -1,       -- Unlimited job analyses
  6,        -- 6 STAR voice sessions/month
  0,        -- No video mocks
  0,        -- No video credits
  -1,       -- Unlimited STAR stories
  -1,       -- Unlimited SWOT
  -1,       -- Unlimited gap defense
  -1,       -- Unlimited intro pitch
  '["resume_builder", "job_analysis", "coaching_full", "ai_improvements", "cover_letters", "star_voice_practice"]'::jsonb,
  'standard',
  3,
  'Most Popular',
  'blue',
  ARRAY['Everything in Basic', '6 STAR Voice Sessions/mo', 'AI Voice Practice', 'Detailed Feedback']
),
-- INTERVIEW READY TIER ($49.90/mo)
(
  'interview_ready',
  'Interview Ready',
  'Full mock interviews with AI avatars for ultimate preparation.',
  49.90,
  499.00,
  NULL, -- Set Stripe price IDs after creating in Stripe dashboard
  NULL,
  5,        -- 5 resumes
  -1,       -- Unlimited job analyses
  10,       -- 10 STAR voice sessions/month
  -1,       -- Unlimited video mocks (limited by minutes)
  150,      -- 150 mock interview minutes/month
  -1,       -- Unlimited STAR stories
  -1,       -- Unlimited SWOT
  -1,       -- Unlimited gap defense
  -1,       -- Unlimited intro pitch
  '["resume_builder", "job_analysis", "coaching_full", "ai_improvements", "cover_letters", "star_voice_practice", "mock_interviews", "advanced_analytics"]'::jsonb,
  'advanced',
  4,
  'Best Value',
  'purple',
  ARRAY['Everything in Pro', '10 STAR Voice Sessions/mo', '150 Mock Interview Minutes/mo', 'AI Video Avatars', 'Advanced Analytics']
);

-- Step 4: Verify the migration
SELECT tier, name, price_monthly, price_yearly, display_order
FROM subscription_plans
ORDER BY display_order;
