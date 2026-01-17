-- Migration: Create linkedin_profiles table for LinkedIn Profile Optimizer
-- Run this in Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS public.linkedin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  target_role TEXT,
  tone TEXT DEFAULT 'professional' CHECK (tone IN ('professional', 'creative', 'executive')),
  profile_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_user_id ON public.linkedin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_resume_id ON public.linkedin_profiles(resume_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_profiles_created_at ON public.linkedin_profiles(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (defense-in-depth - API routes also enforce user_id filtering)
-- Using (select auth.uid()) for better performance (prevents re-evaluation per row)

-- SELECT policy
CREATE POLICY "linkedin_profiles_select_own"
  ON public.linkedin_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- INSERT policy
CREATE POLICY "linkedin_profiles_insert_own"
  ON public.linkedin_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- UPDATE policy
CREATE POLICY "linkedin_profiles_update_own"
  ON public.linkedin_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- DELETE policy
CREATE POLICY "linkedin_profiles_delete_own"
  ON public.linkedin_profiles
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_linkedin_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS linkedin_profiles_updated_at ON public.linkedin_profiles;
CREATE TRIGGER linkedin_profiles_updated_at
  BEFORE UPDATE ON public.linkedin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_linkedin_profiles_updated_at();

-- Grant permissions (service role has full access, anon/authenticated go through RLS)
GRANT ALL ON public.linkedin_profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.linkedin_profiles TO authenticated;
