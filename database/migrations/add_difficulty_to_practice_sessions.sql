-- Add difficulty level to practice sessions
-- Migration: add_difficulty_to_practice_sessions.sql

-- Add difficulty column to practice_sessions table
ALTER TABLE practice_sessions
ADD COLUMN IF NOT EXISTS difficulty TEXT
CHECK (difficulty IN ('easy', 'medium', 'hard'))
DEFAULT 'medium';

-- Add comment for documentation
COMMENT ON COLUMN practice_sessions.difficulty IS 'Difficulty level selected by user for the practice session';
