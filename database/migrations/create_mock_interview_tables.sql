-- Migration: Create Mock Interview Tables (Voice-Only System)
-- Description: New tables for realistic mock interviews with Deepgram + ElevenLabs + OpenAI

-- ============================================================================
-- 1. Mock Interview Sessions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS mock_interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,

  -- Interview Configuration
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (15, 20, 30)),
  interviewer_voice TEXT NOT NULL,           -- ElevenLabs voice ID
  interviewer_name TEXT NOT NULL,            -- e.g., "Sarah Mitchell"
  interviewer_gender TEXT NOT NULL CHECK (interviewer_gender IN ('female', 'male', 'neutral')),
  interviewer_title TEXT,                    -- e.g., "Senior Recruiter"
  company_name TEXT,                         -- From job description
  job_title TEXT,                            -- From job description

  -- Conversation Context
  interview_plan JSONB NOT NULL DEFAULT '{}',     -- Questions, small talk, intro script
  conversation_history JSONB[] DEFAULT '{}',      -- Full conversation transcript

  -- Status & Progress
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_phase TEXT NOT NULL DEFAULT 'welcome' CHECK (current_phase IN ('welcome', 'small_talk', 'company_intro', 'questions', 'wrap_up', 'completed')),
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,

  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_seconds INTEGER,

  -- Results
  overall_score DECIMAL(3,1),
  feedback_summary TEXT,
  detailed_feedback JSONB,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_mock_sessions_user_status ON mock_interview_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_created ON mock_interview_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_resume ON mock_interview_sessions(resume_id) WHERE resume_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mock_sessions_job ON mock_interview_sessions(job_description_id) WHERE job_description_id IS NOT NULL;

-- ============================================================================
-- 2. Mock Interview Exchanges Table (Question/Answer Pairs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS mock_interview_exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,

  -- Exchange Data
  exchange_type TEXT NOT NULL CHECK (exchange_type IN ('welcome', 'small_talk', 'company_intro', 'behavioral', 'technical', 'leadership', 'follow_up', 'wrap_up')),
  question_text TEXT NOT NULL,
  question_audio_url TEXT,                   -- S3/Supabase storage URL (optional)

  -- User Response
  user_answer_text TEXT,                     -- Transcribed answer
  user_answer_audio_url TEXT,                -- S3/Supabase storage URL (optional)
  user_answer_duration_seconds INTEGER,
  transcription_confidence DECIMAL(3,2),     -- 0.00-1.00

  -- Analysis
  answer_score DECIMAL(3,1),                 -- 0.0-10.0
  feedback TEXT,
  strengths TEXT[],
  improvements TEXT[],
  star_components JSONB,                     -- {situation, task, action, result}

  -- Metadata
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  analyzed_at TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mock_exchanges_session ON mock_interview_exchanges(session_id, order_index);
CREATE INDEX IF NOT EXISTS idx_mock_exchanges_type ON mock_interview_exchanges(session_id, exchange_type);

-- ============================================================================
-- 3. Add Voice Preferences to Profiles Table
-- ============================================================================

-- Check if columns already exist before adding
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='preferred_interviewer_voice') THEN
    ALTER TABLE profiles ADD COLUMN preferred_interviewer_voice TEXT DEFAULT 'EXAVITQu4vr4xnSDxMaL';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='preferred_interviewer_gender') THEN
    ALTER TABLE profiles ADD COLUMN preferred_interviewer_gender TEXT DEFAULT 'female'
      CHECK (preferred_interviewer_gender IN ('female', 'male', 'neutral', 'any'));
  END IF;
END $$;

-- ============================================================================
-- 4. Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE mock_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interview_exchanges ENABLE ROW LEVEL SECURITY;

-- Sessions: Users can only access their own sessions
CREATE POLICY "Users can view their own mock interview sessions"
  ON mock_interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mock interview sessions"
  ON mock_interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mock interview sessions"
  ON mock_interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mock interview sessions"
  ON mock_interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Exchanges: Users can access exchanges from their sessions
CREATE POLICY "Users can view their own mock interview exchanges"
  ON mock_interview_exchanges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_interview_sessions
      WHERE mock_interview_sessions.id = mock_interview_exchanges.session_id
      AND mock_interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create exchanges for their own sessions"
  ON mock_interview_exchanges FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM mock_interview_sessions
      WHERE mock_interview_sessions.id = mock_interview_exchanges.session_id
      AND mock_interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update exchanges for their own sessions"
  ON mock_interview_exchanges FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM mock_interview_sessions
      WHERE mock_interview_sessions.id = mock_interview_exchanges.session_id
      AND mock_interview_sessions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. Helper Functions
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mock_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_mock_sessions_updated_at ON mock_interview_sessions;
CREATE TRIGGER update_mock_sessions_updated_at
  BEFORE UPDATE ON mock_interview_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_mock_session_updated_at();

-- ============================================================================
-- 6. Usage Tracking Integration
-- ============================================================================

-- Add mock interview counter to usage_tracking if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='usage_tracking' AND column_name='mock_interviews_count') THEN
    ALTER TABLE usage_tracking ADD COLUMN mock_interviews_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Verify tables created
SELECT
  'mock_interview_sessions' as table_name,
  COUNT(*) as row_count
FROM mock_interview_sessions
UNION ALL
SELECT
  'mock_interview_exchanges' as table_name,
  COUNT(*) as row_count
FROM mock_interview_exchanges;
