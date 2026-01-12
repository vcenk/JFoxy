-- Add admin flag to profiles table
-- Migration: add_admin_flag.sql

-- Add is_admin column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Set your email as admin
UPDATE profiles
SET is_admin = TRUE
WHERE email = 'cenkkarakuz@gmail.com';

-- Add comment
COMMENT ON COLUMN profiles.is_admin IS 'Flag to identify admin users who can access admin panel and bypass limits';
