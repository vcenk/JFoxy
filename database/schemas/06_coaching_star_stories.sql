-- database/schemas/06_coaching_star_stories.sql
-- STAR method stories for behavioral questions

CREATE TABLE IF NOT EXISTS star_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,

  -- Story details
  title TEXT NOT NULL,
  category TEXT,  -- 'leadership', 'conflict', 'achievement', etc.
  related_question TEXT,  -- Sample question this answers

  -- STAR Components
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,

  -- Metrics & Impact
  metrics TEXT[],  -- Quantifiable results
  skills_demonstrated TEXT[],  -- Skills shown in this story

  -- Metadata
  is_favorite BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,  -- Times used in practice

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE star_stories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own STAR stories"
  ON star_stories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own STAR stories"
  ON star_stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own STAR stories"
  ON star_stories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own STAR stories"
  ON star_stories FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_star_stories_updated_at
  BEFORE UPDATE ON star_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_star_stories_user_id ON star_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_star_stories_category ON star_stories(user_id, category);
CREATE INDEX IF NOT EXISTS idx_star_stories_favorites ON star_stories(user_id, is_favorite) WHERE is_favorite = true;
