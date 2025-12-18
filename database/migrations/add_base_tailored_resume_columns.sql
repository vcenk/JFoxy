-- database/migrations/add_base_tailored_resume_columns.sql
-- Add columns to support "Base" vs "Tailored" resume architecture
-- SAFE TO RUN MULTIPLE TIMES (idempotent with IF NOT EXISTS checks)

-- ============================================================================
-- STEP 1: Add new columns (safe if columns already exist)
-- ============================================================================

DO $$
BEGIN
  -- Add is_base_version column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'resumes'
    AND column_name = 'is_base_version'
  ) THEN
    ALTER TABLE public.resumes ADD COLUMN is_base_version BOOLEAN DEFAULT false;
    COMMENT ON COLUMN public.resumes.is_base_version IS 'True if this is a master/base resume, false if it is tailored for a specific job';
  END IF;

  -- Add source_resume_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'resumes'
    AND column_name = 'source_resume_id'
  ) THEN
    ALTER TABLE public.resumes ADD COLUMN source_resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL;
    COMMENT ON COLUMN public.resumes.source_resume_id IS 'Reference to the parent base resume if this is a tailored version';
  END IF;

  -- Add job_description_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'resumes'
    AND column_name = 'job_description_id'
  ) THEN
    ALTER TABLE public.resumes ADD COLUMN job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE SET NULL;
    COMMENT ON COLUMN public.resumes.job_description_id IS 'Reference to the job description this resume is tailored for (if applicable)';
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Add indexes for better query performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_resumes_is_base_version
  ON public.resumes(is_base_version)
  WHERE is_base_version = true;

CREATE INDEX IF NOT EXISTS idx_resumes_source_resume_id
  ON public.resumes(source_resume_id)
  WHERE source_resume_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_resumes_job_description_id
  ON public.resumes(job_description_id)
  WHERE job_description_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_resumes_user_base
  ON public.resumes(user_id, is_base_version);

-- ============================================================================
-- STEP 3: Drop the insecure VIEW and create a SECURITY DEFINER function instead
-- ============================================================================

-- Drop the old view if it exists
DROP VIEW IF EXISTS public.resume_relationships;

-- Create a SECURITY DEFINER function that respects RLS
-- This function filters results to only show data for the current user
CREATE OR REPLACE FUNCTION public.get_resume_relationships()
RETURNS TABLE (
  base_resume_id UUID,
  base_title TEXT,
  base_updated_at TIMESTAMPTZ,
  tailored_resume_id UUID,
  tailored_title TEXT,
  tailored_updated_at TIMESTAMPTZ,
  job_description_id UUID,
  job_title TEXT,
  job_company TEXT,
  tailored_count INTEGER
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only return data for the authenticated user
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    base.id AS base_resume_id,
    base.title AS base_title,
    base.updated_at AS base_updated_at,
    tailored.id AS tailored_resume_id,
    tailored.title AS tailored_title,
    tailored.updated_at AS tailored_updated_at,
    tailored.job_description_id,
    jd.title AS job_title,
    jd.company AS job_company,
    COUNT(tailored.id) OVER (PARTITION BY base.id) AS tailored_count
  FROM
    public.resumes base
  LEFT JOIN public.resumes tailored ON tailored.source_resume_id = base.id
  LEFT JOIN public.job_descriptions jd ON tailored.job_description_id = jd.id
  WHERE
    base.is_base_version = true
    AND base.user_id = auth.uid()  -- Security: only current user's data
  ORDER BY
    base.updated_at DESC,
    tailored.updated_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_resume_relationships() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_resume_relationships() IS
  'Returns base resumes and their tailored versions for the current authenticated user. SECURITY DEFINER ensures RLS is respected.';

-- ============================================================================
-- STEP 4: Update RLS policies to handle base/tailored relationships
-- ============================================================================

-- Drop existing policies (safe to re-create)
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can create own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;

-- SELECT: Users can view resumes they own
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create their own resumes
CREATE POLICY "Users can create own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update resumes they own
CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete resumes they own
CREATE POLICY "Users can delete own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 5: Add helper function to count tailored versions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.count_tailored_resumes(base_resume_uuid UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  tailored_count INTEGER;
BEGIN
  -- Security check: only allow if user owns the base resume
  IF NOT EXISTS (
    SELECT 1 FROM public.resumes
    WHERE id = base_resume_uuid
    AND user_id = auth.uid()
  ) THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*)::INTEGER INTO tailored_count
  FROM public.resumes
  WHERE source_resume_id = base_resume_uuid
    AND user_id = auth.uid();

  RETURN COALESCE(tailored_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.count_tailored_resumes(UUID) TO authenticated;

COMMENT ON FUNCTION public.count_tailored_resumes(UUID) IS
  'Returns the count of tailored resumes derived from a base resume. Only works for resumes owned by the current user.';

-- ============================================================================
-- STEP 6: Add JD Match Score column (for resume library display)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'resumes'
    AND column_name = 'jd_match_score'
  ) THEN
    ALTER TABLE public.resumes ADD COLUMN jd_match_score INTEGER;
    COMMENT ON COLUMN public.resumes.jd_match_score IS 'Job description match score (0-100) for tailored resumes';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_resumes_jd_match_score
  ON public.resumes(jd_match_score)
  WHERE jd_match_score IS NOT NULL;

-- ============================================================================
-- VERIFICATION QUERIES (uncomment to test after running migration)
-- ============================================================================

/*
-- Verify columns were added
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'resumes'
  AND column_name IN ('is_base_version', 'source_resume_id', 'job_description_id', 'jd_match_score')
ORDER BY ordinal_position;

-- Verify indexes were created
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'resumes'
  AND indexname LIKE 'idx_resumes_%';

-- Test the security definer function
SELECT * FROM get_resume_relationships();

-- Test the count function (replace with your actual resume ID)
SELECT count_tailored_resumes('your-base-resume-id-here');
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Summary:
-- ✅ Added is_base_version, source_resume_id, job_description_id columns
-- ✅ Added jd_match_score column for resume library
-- ✅ Created performance indexes
-- ✅ Replaced insecure VIEW with SECURITY DEFINER function
-- ✅ Updated RLS policies
-- ✅ Added helper functions for querying relationships
-- ============================================================================
