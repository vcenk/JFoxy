-- database/schemas/04_practice_sessions.sql
-- Interview practice sessions

CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,

  -- Session details
  title TEXT NOT NULL DEFAULT 'Practice Session',
  question_category TEXT,  -- 'behavioral', 'technical', 'leadership', etc.
  total_questions INTEGER DEFAULT 0,
  completed_questions INTEGER DEFAULT 0,

  -- Scoring
  average_score NUMERIC(5,2),  -- 0-100
  overall_feedback JSONB,

  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Practice questions asked in this session
CREATE TABLE IF NOT EXISTS practice_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES practice_sessions(id) ON DELETE CASCADE NOT NULL,

  -- Question details
  question_text TEXT NOT NULL,
  question_category TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- Expected answer components (STAR)
  expected_components JSONB,  -- What AI expects to hear

  -- Order in session
  order_index INTEGER NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User answers to practice questions
CREATE TABLE IF NOT EXISTS practice_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES practice_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Answer content
  transcript TEXT NOT NULL,  -- From STT
  audio_url TEXT,  -- Optional: stored audio file

  -- AI Scoring
  overall_score NUMERIC(5,2),  -- 0-100
  star_analysis JSONB,  -- { has_situation, has_task, has_action, has_result }
  clarity_score NUMERIC(5,2),
  relevance_score NUMERIC(5,2),
  impact_score NUMERIC(5,2),

  -- Feedback
  strengths TEXT[],
  improvements TEXT[],
  summary TEXT,

  -- Metadata
  duration_seconds INTEGER,  -- How long they spoke

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_answers ENABLE ROW LEVEL SECURITY;

-- Policies for practice_sessions
CREATE POLICY "Users can view own practice sessions"
  ON practice_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own practice sessions"
  ON practice_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
  ON practice_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own practice sessions"
  ON practice_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for practice_questions
CREATE POLICY "Users can view questions from own sessions"
  ON practice_questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM practice_sessions
    WHERE practice_sessions.id = practice_questions.session_id
    AND practice_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create questions in own sessions"
  ON practice_questions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM practice_sessions
    WHERE practice_sessions.id = practice_questions.session_id
    AND practice_sessions.user_id = auth.uid()
  ));

-- Policies for practice_answers
CREATE POLICY "Users can view own answers"
  ON practice_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own answers"
  ON practice_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
  ON practice_answers FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update timestamps
CREATE TRIGGER update_practice_sessions_updated_at
  BEFORE UPDATE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_status ON practice_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_practice_questions_session_id ON practice_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_practice_answers_question_id ON practice_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_practice_answers_user_id ON practice_answers(user_id);
