-- Migration: Enable RLS and create policies for resume library tables
-- Fixes security warnings for tables exposed to PostgREST

-- =============================================
-- JOB TITLE TAXONOMY (public read, admin write)
-- =============================================
ALTER TABLE public.job_title_taxonomy ENABLE ROW LEVEL SECURITY;

-- Anyone can read active job titles
CREATE POLICY "Job titles are viewable by everyone"
  ON public.job_title_taxonomy FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can modify job titles"
  ON public.job_title_taxonomy FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- RESUME SYNONYMS (public read, admin write)
-- =============================================
ALTER TABLE public.resume_synonyms ENABLE ROW LEVEL SECURITY;

-- Anyone can read published synonyms
CREATE POLICY "Resume synonyms are viewable by everyone"
  ON public.resume_synonyms FOR SELECT
  USING (is_published = true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can modify resume synonyms"
  ON public.resume_synonyms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- POWER WORDS USAGE (user-specific data)
-- =============================================
ALTER TABLE public.power_words_usage ENABLE ROW LEVEL SECURITY;

-- Users can only view their own power words usage
CREATE POLICY "Users can view their own power words usage"
  ON public.power_words_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own power words usage
CREATE POLICY "Users can insert their own power words usage"
  ON public.power_words_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own power words usage
CREATE POLICY "Users can update their own power words usage"
  ON public.power_words_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own power words usage
CREATE POLICY "Users can delete their own power words usage"
  ON public.power_words_usage FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all power words usage
CREATE POLICY "Admins can view all power words usage"
  ON public.power_words_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- RESUME TEMPLATES (public read, admin write)
-- =============================================
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can read published templates
CREATE POLICY "Resume templates are viewable by everyone"
  ON public.resume_templates FOR SELECT
  USING (is_published = true);

-- Only admins can insert/update/delete templates
CREATE POLICY "Only admins can modify resume templates"
  ON public.resume_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- INDUSTRY KEYWORDS (public read, admin write)
-- =============================================
ALTER TABLE public.industry_keywords ENABLE ROW LEVEL SECURITY;

-- Anyone can read active industry keywords
CREATE POLICY "Industry keywords are viewable by everyone"
  ON public.industry_keywords FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can modify industry keywords"
  ON public.industry_keywords FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON POLICY "Job titles are viewable by everyone" ON public.job_title_taxonomy
  IS 'Public read access to active job titles for search and autocomplete';

COMMENT ON POLICY "Resume synonyms are viewable by everyone" ON public.resume_synonyms
  IS 'Public read access to published power words for resume optimization';

COMMENT ON POLICY "Resume templates are viewable by everyone" ON public.resume_templates
  IS 'Public read access to published resume templates';

COMMENT ON POLICY "Industry keywords are viewable by everyone" ON public.industry_keywords
  IS 'Public read access to active ATS keywords';
