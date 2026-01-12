-- Migration: Add preferences to profiles
-- Description: Adds a jsonb column for storing user preferences (AI settings, app settings).

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;

-- Example structure for preferences:
-- {
--   "deepgram": { "api_key": "...", "voice_id": "...", "language": "en-US" },
--   "heygen": { "api_key": "...", "avatar_id": "..." },
--   "notifications": { "email": true, "push": true },
--   "data_usage": { "optimize_video": false }
-- }
