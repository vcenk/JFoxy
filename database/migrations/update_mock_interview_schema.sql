-- Migration: Update Mock Interview Schema
-- Description: Adds mock_interview_attempts, refactors exchanges, and enhances star_stories for Answer Library.

-- 1. Create mock_interview_attempts table
CREATE TABLE IF NOT EXISTS public.mock_interview_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  exchange_id uuid NOT NULL,
  attempt_number integer NOT NULL DEFAULT 1,
  
  -- Audio & Transcript
  user_audio_url text,
  user_transcript text,
  
  -- Scoring
  content_scores jsonb, -- { "star": 6, "relevance": 8, "composite": 7.5 }
  delivery_metrics jsonb, -- { "wpm": 140, "fillers": ["um", "uh"], "clarity": 0.9 }
  overall_score numeric,
  
  -- AI Output
  feedback_text text,
  rewritten_answer text,
  coach_notes jsonb,
  
  -- Retention & Metadata
  audio_expires_at timestamp with time zone,
  audio_deleted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT mock_interview_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT mock_interview_attempts_exchange_fkey FOREIGN KEY (exchange_id) REFERENCES public.mock_interview_exchanges(id)
);

-- 2. Alter mock_interview_exchanges table
-- Add final_attempt_id
ALTER TABLE public.mock_interview_exchanges 
  ADD COLUMN IF NOT EXISTS final_attempt_id uuid;

ALTER TABLE public.mock_interview_exchanges
  ADD CONSTRAINT mock_interview_exchanges_final_attempt_fkey 
  FOREIGN KEY (final_attempt_id) REFERENCES public.mock_interview_attempts(id);

-- 3. Alter star_stories table (Answer Library)
ALTER TABLE public.star_stories
  ADD COLUMN IF NOT EXISTS polished_answer text,
  ADD COLUMN IF NOT EXISTS coach_notes jsonb,
  ADD COLUMN IF NOT EXISTS source_attempt_id uuid,
  ADD COLUMN IF NOT EXISTS job_description_id uuid;

ALTER TABLE public.star_stories
  ADD CONSTRAINT star_stories_source_attempt_id_fkey 
  FOREIGN KEY (source_attempt_id) REFERENCES public.mock_interview_attempts(id);

ALTER TABLE public.star_stories
  ADD CONSTRAINT star_stories_job_description_id_fkey 
  FOREIGN KEY (job_description_id) REFERENCES public.job_descriptions(id);

-- 4. Alter mock_interviews table
ALTER TABLE public.mock_interviews
  ADD COLUMN IF NOT EXISTS adaptive_mode text DEFAULT 'standard';
-- We are not dropping 'difficulty' or 'verdict' to preserve data/backward compatibility, 
-- but we will stop using them in the new flow or use adaptive_mode instead.

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mock_interview_attempts_exchange_id ON public.mock_interview_attempts(exchange_id);
CREATE INDEX IF NOT EXISTS idx_mock_interview_exchanges_mock_id ON public.mock_interview_exchanges(mock_interview_id);

-- 5. RPC Functions for usage tracking
CREATE OR REPLACE FUNCTION increment_mock_interviews(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET mock_interviews_this_month = COALESCE(mock_interviews_this_month, 0) + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;