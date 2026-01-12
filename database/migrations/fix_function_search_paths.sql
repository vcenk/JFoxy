-- database/migrations/fix_function_search_paths.sql
-- Fixes "Function Search Path Mutable" warnings by explicitly setting search_path

-- 1. Fix increment_mock_interviews (if it exists, assuming it does based on warnings)
-- Note: You might need to adjust the parameter types if they differ from UUID
CREATE OR REPLACE FUNCTION public.increment_mock_interviews(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET mock_interviews_this_month = mock_interviews_this_month + 1
  WHERE id = user_id;
END;
$$;

-- 2. Fix increment_profile_counter
CREATE OR REPLACE FUNCTION public.increment_profile_counter(user_id UUID, counter_name TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate that the counter_name is one of the allowed columns to prevent SQL injection
  IF counter_name NOT IN (
    'resume_builds_this_month',
    'job_analyses_this_month', 
    'audio_practice_sessions_this_month',
    'mock_interviews_this_month',
    'practice_sessions_this_month'
  ) THEN
    RAISE EXCEPTION 'Invalid counter name: %', counter_name;
  END IF;

  -- Execute the update safely
  EXECUTE format('UPDATE profiles SET %I = %I + 1 WHERE id = $1', counter_name, counter_name)
  USING user_id;
END;
$$;

-- 3. Fix reset_monthly_usage
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      WHEN subscription_tier = 'premium' THEN 20
      ELSE 0
    END;
END;
$$;

-- 4. Fix handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_tier,
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
    'basic',
    0, 0, 0, 0, 0
  );
  RETURN NEW;
END;
$$;

-- 5. Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================
-- RESUME LIBRARY FUNCTIONS
-- =============================================

-- 6. Fix increment_resume_example_views
CREATE OR REPLACE FUNCTION public.increment_resume_example_views(example_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.resume_examples
  SET view_count = view_count + 1
  WHERE id = example_id;
END;
$$;

-- 7. Fix get_popular_resume_examples
CREATE OR REPLACE FUNCTION public.get_popular_resume_examples(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  slug text,
  job_title text,
  industry text,
  view_count integer
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    re.id,
    re.slug,
    re.job_title,
    re.industry,
    re.view_count
  FROM public.resume_examples re
  WHERE re.is_published = true
  ORDER BY re.view_count DESC
  LIMIT limit_count;
END;
$$;

-- 8. Fix update_subscription_plans_updated_at
CREATE OR REPLACE FUNCTION public.update_subscription_plans_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
