-- Migration: Remove HeyGen-related tables and columns
-- Purpose: Clean up old HeyGen LiveAvatar integration tables
-- Date: 2026-01-05

-- Drop old mock interview tables (HeyGen-based)
-- These are being replaced by mock_interview_sessions (voice-only)

-- Drop dependent tables first
DROP TABLE IF EXISTS mock_interview_attempts CASCADE;
DROP TABLE IF EXISTS mock_interview_exchanges CASCADE;
DROP TABLE IF EXISTS mock_interviews CASCADE;

-- Remove HeyGen-related columns from profiles if they exist
ALTER TABLE profiles
  DROP COLUMN IF EXISTS mock_avatar_id,
  DROP COLUMN IF EXISTS heygen_preferences;

-- Drop any HeyGen-related indexes
DROP INDEX IF EXISTS idx_mock_interviews_heygen_session;

-- Note: The new voice-only system uses:
-- - mock_interview_sessions (created by create_mock_interview_tables.sql)
-- - mock_interview_exchanges (new schema for voice-only)
--
-- Migration should be run AFTER the new schema is created.
