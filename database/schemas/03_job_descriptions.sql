-- database/schemas/03_job_descriptions.sql
-- Job descriptions for matching/analysis

CREATE TABLE IF NOT EXISTS job_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Job details
  title TEXT NOT NULL,
  company TEXT,
  description TEXT NOT NULL,
  requirements JSONB,  -- Parsed requirements

  -- AI Analysis
  parsed_skills TEXT[],  -- Extracted skills
  competencies TEXT[],  -- Key competencies

  -- Metadata
  is_active BOOLEAN DEFAULT true,  -- Currently selected JD
  source_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own job descriptions"
  ON job_descriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own job descriptions"
  ON job_descriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions"
  ON job_descriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions"
  ON job_descriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_job_descriptions_updated_at
  BEFORE UPDATE ON job_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jd_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_jd_is_active ON job_descriptions(user_id, is_active) WHERE is_active = true;
