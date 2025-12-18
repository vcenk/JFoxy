-- database/schemas/09_market_data.sql
-- Market insights (salary, skills, trends) - cached data

CREATE TABLE IF NOT EXISTS market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Market segment
  category TEXT NOT NULL,  -- 'salary', 'skills', 'trends'
  job_title TEXT,
  location TEXT,
  industry TEXT,

  -- Data payload
  data JSONB NOT NULL,

  -- Cache control
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS (public read, admin write)
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active, non-expired market data
CREATE POLICY "Anyone can view active market data"
  ON market_data FOR SELECT
  USING (is_active = true AND expires_at > NOW());

-- Auto-update timestamp
CREATE TRIGGER update_market_data_updated_at
  BEFORE UPDATE ON market_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_market_data_category ON market_data(category);
CREATE INDEX IF NOT EXISTS idx_market_data_lookup ON market_data(category, job_title, location) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_market_data_expires ON market_data(expires_at);
