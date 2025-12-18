-- database/schemas/07_coaching_swot_and_gaps.sql
-- SWOT analyses and Gap defense scripts

-- SWOT Analyses
CREATE TABLE IF NOT EXISTS swot_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,

  -- SWOT Components (each is array of items)
  strengths JSONB DEFAULT '[]',  -- [{ title, insight, source }]
  weaknesses JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',
  threats JSONB DEFAULT '[]',

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  last_generated_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Gap Defense Scripts
CREATE TABLE IF NOT EXISTS gap_defenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  swot_analysis_id UUID REFERENCES swot_analyses(id) ON DELETE SET NULL,

  -- Gap details
  gap_type TEXT NOT NULL,  -- 'missing_skill', 'short_tenure', 'industry_switch', 'employment_gap'
  gap_description TEXT NOT NULL,

  -- Defense strategy (3-part framework)
  pivot TEXT,  -- The Reframe
  proof TEXT,  -- The Parallel Evidence
  promise TEXT,  -- The Roadmap/Growth

  -- Metadata
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Intro Pitch Scripts
CREATE TABLE IF NOT EXISTS intro_pitches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,

  -- Pitch content
  title TEXT NOT NULL DEFAULT 'Intro Pitch',
  pitch_text TEXT NOT NULL,
  duration_seconds INTEGER,  -- Target speaking time

  -- Structure
  hook TEXT,  -- Opening hook
  core_message TEXT,  -- Main value prop
  call_to_action TEXT,  -- Closing

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  practice_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE swot_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_defenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_pitches ENABLE ROW LEVEL SECURITY;

-- Policies for swot_analyses
CREATE POLICY "Users can view own SWOT analyses"
  ON swot_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own SWOT analyses"
  ON swot_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own SWOT analyses"
  ON swot_analyses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own SWOT analyses"
  ON swot_analyses FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for gap_defenses
CREATE POLICY "Users can view own gap defenses"
  ON gap_defenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own gap defenses"
  ON gap_defenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gap defenses"
  ON gap_defenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own gap defenses"
  ON gap_defenses FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for intro_pitches
CREATE POLICY "Users can view own intro pitches"
  ON intro_pitches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own intro pitches"
  ON intro_pitches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intro pitches"
  ON intro_pitches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own intro pitches"
  ON intro_pitches FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamps
CREATE TRIGGER update_swot_analyses_updated_at
  BEFORE UPDATE ON swot_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gap_defenses_updated_at
  BEFORE UPDATE ON gap_defenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intro_pitches_updated_at
  BEFORE UPDATE ON intro_pitches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_swot_user_id ON swot_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_swot_is_active ON swot_analyses(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gap_defenses_user_id ON gap_defenses(user_id);
CREATE INDEX IF NOT EXISTS idx_intro_pitches_user_id ON intro_pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_intro_pitches_is_active ON intro_pitches(user_id, is_active) WHERE is_active = true;
