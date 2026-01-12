-- database/migrations/add_increment_counter_rpc.sql
-- Function to atomically increment usage counters on the profiles table

CREATE OR REPLACE FUNCTION increment_profile_counter(user_id UUID, counter_name TEXT)
RETURNS void AS $$
BEGIN
  -- Validate that the counter_name is one of the allowed columns to prevent SQL injection
  IF counter_name NOT IN (
    'resume_builds_this_month',
    'job_analyses_this_month', 
    'audio_practice_sessions_this_month',
    'mock_interviews_this_month',
    'practice_sessions_this_month'
  ) THEN
    RAISE EXCEPTION 'Invalid counter name: %', counter_name;
  END IF;

  -- Execute the update safely
  EXECUTE format('UPDATE profiles SET %I = %I + 1 WHERE id = $1', counter_name, counter_name)
  USING user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
