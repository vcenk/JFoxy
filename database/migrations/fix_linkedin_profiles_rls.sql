-- Fix linkedin_profiles RLS policies
-- Run this in Supabase SQL Editor to fix the linter warnings

-- Step 1: Drop ALL existing policies on linkedin_profiles
DROP POLICY IF EXISTS "Users can view own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can create own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can update own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can delete own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can view their own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can insert their own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can update their own linkedin profiles" ON public.linkedin_profiles;
DROP POLICY IF EXISTS "Users can delete their own linkedin profiles" ON public.linkedin_profiles;

-- Step 2: Recreate policies with optimized (select auth.uid()) syntax
-- This prevents re-evaluation for each row, improving performance

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
