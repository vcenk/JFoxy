-- Migration: Add analysis_results table for better tracking of resume analyses
-- This provides dedicated storage for analysis history with better querying capabilities

CREATE TABLE IF NOT EXISTS public.analysis_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resume_id uuid NOT NULL,
  job_description_id uuid,

  -- Analysis scores
  ats_score integer NOT NULL,
  jd_match_score integer,
  skills_fit_score integer NOT NULL,

  -- Complete analysis data (JSONB for flexibility)
  analysis_data jsonb NOT NULL,

  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),

  -- Primary key
  CONSTRAINT analysis_results_pkey PRIMARY KEY (id),

  -- Foreign keys
  CONSTRAINT analysis_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT analysis_results_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE,
  CONSTRAINT analysis_results_job_description_id_fkey FOREIGN KEY (job_description_id) REFERENCES public.job_descriptions(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_resume_id ON public.analysis_results(resume_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_job_description_id ON public.analysis_results(job_description_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON public.analysis_results(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analysis results
CREATE POLICY "Users can view own analysis results"
  ON public.analysis_results
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analysis results
CREATE POLICY "Users can insert own analysis results"
  ON public.analysis_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own analysis results
CREATE POLICY "Users can update own analysis results"
  ON public.analysis_results
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own analysis results
CREATE POLICY "Users can delete own analysis results"
  ON public.analysis_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE public.analysis_results IS 'Stores historical resume analysis results for tracking and comparison';
COMMENT ON COLUMN public.analysis_results.analysis_data IS 'Complete JSON analysis including coaching, keywords, warnings, etc.';
