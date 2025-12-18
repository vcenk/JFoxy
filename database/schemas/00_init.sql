-- database/schemas/00_init.sql
-- Initialize database with all schemas
-- Run this file in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run all schema files in order:
-- 1. Profiles (users)
-- 2. Resumes
-- 3. Job Descriptions
-- 4. Practice Sessions (questions, answers)
-- 5. Mock Interviews (exchanges)
-- 6. STAR Stories
-- 7. SWOT & Gap Defenses & Intro Pitches
-- 8. Cover Letters
-- 9. Market Data
-- 10. Usage Tracking

-- Note: Copy and paste each schema file (01-10) into Supabase SQL Editor
-- Or use the Supabase CLI: supabase db push

-- After running all schemas, verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
