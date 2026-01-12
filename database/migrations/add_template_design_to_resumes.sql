-- Migration: Add template_id and design_settings to resumes table
-- This separates presentation (template/design) from content for better queryability

-- Add template_id column for tracking which template is used
ALTER TABLE public.resumes
ADD COLUMN IF NOT EXISTS template_id text DEFAULT 'classic';

-- Add design_settings column for storing PDF design configuration
ALTER TABLE public.resumes
ADD COLUMN IF NOT EXISTS design_settings jsonb DEFAULT '{}'::jsonb;

-- Create index on template_id for efficient queries (e.g., template popularity)
CREATE INDEX IF NOT EXISTS idx_resumes_template_id ON public.resumes(template_id);

-- Migrate existing _settings.designer data to design_settings column (optional)
-- This preserves any existing designer settings
UPDATE public.resumes
SET design_settings = COALESCE(content->'_settings'->'designer', '{}'::jsonb)
WHERE content->'_settings'->'designer' IS NOT NULL
  AND design_settings = '{}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.resumes.template_id IS 'PDF template ID (classic, modern, minimal, executive, professional, compact, creative, elegant)';
COMMENT ON COLUMN public.resumes.design_settings IS 'PDF design settings (colors, fonts, margins, spacing, etc.)';
