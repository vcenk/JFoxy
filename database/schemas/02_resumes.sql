-- database/schemas/02_resumes.sql
-- Resume documents with base/tailored architecture support

CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Resume content
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  content JSONB NOT NULL DEFAULT '{}',  -- Structured resume data
  raw_text TEXT,  -- Plain text version for AI analysis

  -- Base vs Tailored Resume Architecture
  is_base_version BOOLEAN DEFAULT false,  -- True if this is a master/base resume
  source_resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,  -- Parent base resume (if tailored)
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,  -- JD this is tailored for

  -- Metadata
  is_active BOOLEAN DEFAULT true,  -- Current resume being used
  file_url TEXT,  -- Original uploaded file (if any)

  -- AI Analysis results (cached)
  ats_score INTEGER,  -- 0-100 ATS compatibility score
  jd_match_score INTEGER,  -- 0-100 job description match score (for tailored resumes)
  last_analyzed_at TIMESTAMPTZ,
  analysis_results JSONB,  -- Full AI analysis

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);

-- Base/Tailored architecture indexes
CREATE INDEX IF NOT EXISTS idx_resumes_is_base_version
  ON resumes(is_base_version)
  WHERE is_base_version = true;

CREATE INDEX IF NOT EXISTS idx_resumes_source_resume_id
  ON resumes(source_resume_id)
  WHERE source_resume_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_resumes_job_description_id
  ON resumes(job_description_id)
  WHERE job_description_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_resumes_user_base
  ON resumes(user_id, is_base_version);

CREATE INDEX IF NOT EXISTS idx_resumes_jd_match_score
  ON resumes(jd_match_score)
  WHERE jd_match_score IS NOT NULL;

-- Helper function: Get resume relationships (base → tailored)
-- This is a SECURITY DEFINER function to ensure RLS is respected
CREATE OR REPLACE FUNCTION get_resume_relationships()
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
    resumes base
  LEFT JOIN resumes tailored ON tailored.source_resume_id = base.id
  LEFT JOIN job_descriptions jd ON tailored.job_description_id = jd.id
  WHERE
    base.is_base_version = true
    AND base.user_id = auth.uid()
  ORDER BY
    base.updated_at DESC,
    tailored.updated_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_resume_relationships() TO authenticated;

COMMENT ON FUNCTION get_resume_relationships() IS
  'Returns base resumes and their tailored versions for the current authenticated user';

-- Helper function: Count tailored versions of a base resume
CREATE OR REPLACE FUNCTION count_tailored_resumes(base_resume_uuid UUID)
RETURNS INTEGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  tailored_count INTEGER;
BEGIN
  -- Security: only allow if user owns the base resume
  IF NOT EXISTS (
    SELECT 1 FROM resumes
    WHERE id = base_resume_uuid
    AND user_id = auth.uid()
  ) THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*)::INTEGER INTO tailored_count
  FROM resumes
  WHERE source_resume_id = base_resume_uuid
    AND user_id = auth.uid();

  RETURN COALESCE(tailored_count, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION count_tailored_resumes(UUID) TO authenticated;

COMMENT ON FUNCTION count_tailored_resumes(UUID) IS
  'Returns the count of tailored resumes derived from a base resume';
