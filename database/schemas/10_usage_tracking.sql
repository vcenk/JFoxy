-- database/schemas/10_usage_tracking.sql
-- Track API usage for billing limits

CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Usage type
  resource_type TEXT NOT NULL,  -- 'tts', 'stt', 'openai', 'resume_analysis', etc.
  resource_count INTEGER DEFAULT 1,

  -- Cost (optional, for tracking)
  estimated_cost_cents INTEGER,

  -- Context
  session_id UUID,  -- Practice or mock interview session
  metadata JSONB,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert usage records
CREATE POLICY "Service can insert usage"
  ON usage_tracking FOR INSERT
  WITH CHECK (true);  -- Backend service inserts

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usage_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_created_at ON usage_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_resource_type ON usage_tracking(user_id, resource_type);
-- Composite index for efficient monthly queries (without partial index predicate)
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage_tracking(user_id, created_at DESC);

-- Function to reset monthly usage counters (run via cron)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    ai_tokens_used_this_month = 0,
    practice_sessions_this_month = 0,
    mock_interviews_this_month = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
