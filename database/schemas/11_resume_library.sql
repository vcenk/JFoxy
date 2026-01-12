-- database/schemas/11_resume_library.sql
-- Resume Library: 2000+ resume examples, templates, and power words tracking

-- =============================================
-- RESUME EXAMPLES (for SEO and inspiration)
-- =============================================
CREATE TABLE public.resume_examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, -- URL-friendly: "software-engineer-technology-senior"

  -- Classification (for filtering and search)
  job_title text NOT NULL, -- "Software Engineer"
  industry text NOT NULL, -- "Technology", "Finance", "Healthcare"
  experience_level text NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),

  -- Alternative classifications
  job_category text, -- "Engineering", "Marketing", "Sales"
  specialization text, -- "Frontend", "Backend", "Full Stack"

  -- Resume Content (stored as JSONB for flexibility)
  content jsonb NOT NULL, -- Full ParsedResume structure

  -- Processed versions for different use cases
  raw_text text, -- Plain text version for search
  html_content text, -- Rendered HTML version
  pdf_url text, -- Link to generated PDF (if applicable)

  -- ATS & Quality Metrics
  ats_score integer CHECK (ats_score >= 0 AND ats_score <= 100),
  keywords text[] NOT NULL DEFAULT '{}', -- Array of keywords for search
  power_words_count integer DEFAULT 0,
  quantified_achievements_count integer DEFAULT 0,

  -- SEO Optimization
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  h1_heading text NOT NULL,
  h2_headings text[] DEFAULT '{}',
  target_keywords text[] DEFAULT '{}', -- SEO keywords to rank for
  canonical_url text,

  -- Analytics & Performance
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  conversion_rate numeric, -- % of viewers who sign up

  -- Admin fields
  is_published boolean DEFAULT true,
  is_featured boolean DEFAULT false, -- Show on homepage
  quality_score integer CHECK (quality_score >= 0 AND quality_score <= 100), -- Manual quality rating
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,

  -- Template association (optional)
  template_id text, -- Which visual template to use

  -- Generation tracking (for AI-generated examples)
  generation_cost numeric DEFAULT 0, -- Cost in USD to generate using OpenAI API
  generation_time_ms integer DEFAULT 0, -- Generation time in milliseconds
  created_by uuid REFERENCES public.profiles(id), -- Admin who generated this

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

-- Indexes for fast queries
CREATE INDEX idx_resume_examples_slug ON public.resume_examples(slug);
CREATE INDEX idx_resume_examples_job_title ON public.resume_examples(job_title);
CREATE INDEX idx_resume_examples_industry ON public.resume_examples(industry);
CREATE INDEX idx_resume_examples_experience_level ON public.resume_examples(experience_level);
CREATE INDEX idx_resume_examples_published ON public.resume_examples(is_published, published_at);
CREATE INDEX idx_resume_examples_featured ON public.resume_examples(is_featured) WHERE is_featured = true;
CREATE INDEX idx_resume_examples_keywords ON public.resume_examples USING gin(keywords);
CREATE INDEX idx_resume_examples_target_keywords ON public.resume_examples USING gin(target_keywords);
CREATE INDEX idx_resume_examples_created_by ON public.resume_examples(created_by);
CREATE INDEX idx_resume_examples_generation_cost ON public.resume_examples(generation_cost DESC);

-- Full-text search on title and content
CREATE INDEX idx_resume_examples_search ON public.resume_examples
  USING gin(to_tsvector('english', job_title || ' ' || industry || ' ' || COALESCE(raw_text, '')));

-- Enable Row Level Security (optional - if you want to hide drafts)
ALTER TABLE public.resume_examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resume examples are viewable by everyone"
  ON public.resume_examples FOR SELECT
  USING (is_published = true);

CREATE POLICY "Only admins can insert/update resume examples"
  ON public.resume_examples FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- =============================================
-- RESUME TEMPLATES (visual design templates)
-- =============================================
CREATE TABLE public.resume_templates (
  id text PRIMARY KEY, -- "modern-sidebar", "classic-linear"
  name text NOT NULL, -- "Modern Sidebar"
  description text,
  category text NOT NULL CHECK (category IN ('modern', 'classic', 'minimal', 'creative', 'professional', 'bold')),

  -- Template configuration (from templateConfigs.ts)
  config jsonb NOT NULL, -- Full TemplateConfig object

  -- Visuals
  preview_image_url text, -- Screenshot of template
  thumbnail_url text, -- Small preview for gallery

  -- Features
  features text[] DEFAULT '{}', -- ["ATS-Friendly", "Two-Column", "Colorful"]
  tags text[] DEFAULT '{}', -- ["Tech", "Creative", "Entry-Level"]

  -- Availability
  is_premium boolean DEFAULT false,
  is_published boolean DEFAULT true,

  -- Analytics
  usage_count integer DEFAULT 0, -- How many times it's been used
  average_rating numeric, -- User ratings

  -- Display
  display_order integer DEFAULT 0, -- For sorting in gallery
  accent_color text, -- Brand color for template card

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_resume_templates_category ON public.resume_templates(category);
CREATE INDEX idx_resume_templates_published ON public.resume_templates(is_published);
CREATE INDEX idx_resume_templates_tags ON public.resume_templates USING gin(tags);

-- RLS Policies
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resume templates are viewable by everyone"
  ON public.resume_templates FOR SELECT
  USING (is_published = true);

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
-- POWER WORDS TRACKING (analytics on word usage)
-- =============================================
CREATE TABLE public.power_words_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  resume_id uuid REFERENCES public.resumes(id),

  -- Which word was suggested
  weak_word text NOT NULL, -- "responsible for", "helped with"
  suggested_word text NOT NULL, -- "Led", "Facilitated"

  -- User action
  action text NOT NULL CHECK (action IN ('accepted', 'rejected', 'ignored')),

  -- Context
  original_sentence text, -- The full sentence before
  modified_sentence text, -- The full sentence after (if accepted)

  -- Metadata
  section text, -- "experience", "summary", etc.
  category text, -- "leadership", "technical", "analytical"

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_power_words_usage_user ON public.power_words_usage(user_id);
CREATE INDEX idx_power_words_usage_resume ON public.power_words_usage(resume_id);
CREATE INDEX idx_power_words_usage_action ON public.power_words_usage(action);

-- RLS Policies
ALTER TABLE public.power_words_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own power words usage"
  ON public.power_words_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own power words usage"
  ON public.power_words_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own power words usage"
  ON public.power_words_usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own power words usage"
  ON public.power_words_usage FOR DELETE
  USING (auth.uid() = user_id);

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
-- INDUSTRY KEYWORDS (for ATS optimization)
-- =============================================
CREATE TABLE public.industry_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL, -- "Technology", "Finance", "Marketing"
  job_title text, -- Optional: specific to job title

  -- Keyword categorization
  keyword text NOT NULL,
  category text NOT NULL CHECK (category IN ('must_have', 'technical', 'soft', 'certification', 'methodology')),

  -- Importance & frequency
  importance_score integer CHECK (importance_score >= 1 AND importance_score <= 10), -- 1-10 scale
  frequency_in_jds numeric, -- % of job descriptions containing this keyword

  -- Metadata
  synonyms text[] DEFAULT '{}', -- Alternative keywords that mean the same thing
  related_keywords text[] DEFAULT '{}',

  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(industry, keyword, category)
);

CREATE INDEX idx_industry_keywords_industry ON public.industry_keywords(industry);
CREATE INDEX idx_industry_keywords_job_title ON public.industry_keywords(job_title);
CREATE INDEX idx_industry_keywords_category ON public.industry_keywords(category);
CREATE INDEX idx_industry_keywords_importance ON public.industry_keywords(importance_score DESC);

-- RLS Policies
ALTER TABLE public.industry_keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Industry keywords are viewable by everyone"
  ON public.industry_keywords FOR SELECT
  USING (is_active = true);

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
-- JOB TITLE TAXONOMY (standardized job titles)
-- =============================================
CREATE TABLE public.job_title_taxonomy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Standardized job title
  canonical_title text UNIQUE NOT NULL, -- "Software Engineer"

  -- Categorization
  job_category text NOT NULL, -- "Engineering", "Marketing", "Sales"
  job_family text, -- "Technical", "Business", "Creative"
  seniority_level text CHECK (seniority_level IN ('entry', 'mid', 'senior', 'executive')),

  -- Alternative names (for search & matching)
  aliases text[] DEFAULT '{}', -- ["Software Developer", "Programmer", "Developer"]

  -- Related information
  typical_industries text[] DEFAULT '{}', -- Industries where this role is common
  average_salary_usd integer,
  growth_rate numeric, -- Job market growth rate

  -- SEO & Content
  description text, -- Brief description of the role
  slug text UNIQUE, -- URL-friendly version

  -- Analytics
  search_volume integer, -- Monthly search volume for this job title
  competition_score integer CHECK (competition_score >= 0 AND competition_score <= 100),

  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_title_taxonomy_category ON public.job_title_taxonomy(job_category);
CREATE INDEX idx_job_title_taxonomy_seniority ON public.job_title_taxonomy(seniority_level);
CREATE INDEX idx_job_title_taxonomy_slug ON public.job_title_taxonomy(slug);
CREATE INDEX idx_job_title_taxonomy_aliases ON public.job_title_taxonomy USING gin(aliases);

-- RLS Policies
ALTER TABLE public.job_title_taxonomy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job titles are viewable by everyone"
  ON public.job_title_taxonomy FOR SELECT
  USING (is_active = true);

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
-- RESUME SYNONYMS (like TealHQ's feature)
-- =============================================
CREATE TABLE public.resume_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The weak/common word
  base_word text UNIQUE NOT NULL, -- "improved", "managed", "responsible for"

  -- Category & Context
  category text NOT NULL CHECK (category IN ('achievement', 'leadership', 'technical', 'analytical', 'communication', 'collaboration', 'management', 'innovation', 'problem_solving', 'financial')),
  word_type text CHECK (word_type IN ('action_verb', 'phrase', 'adjective')),

  -- Alternatives (ordered by strength)
  synonyms jsonb NOT NULL, -- [{ "word": "Enhanced", "strength": 9, "context": "..." }, ...]

  -- Usage guidelines
  usage_tips text, -- When to use this word
  examples text[], -- Example sentences
  industry_preference text[], -- Which industries prefer this word

  -- SEO fields
  slug text UNIQUE NOT NULL, -- "improved" for URL
  meta_title text,
  meta_description text,

  -- Analytics
  view_count integer DEFAULT 0,
  usage_count integer DEFAULT 0, -- How many times users applied this synonym

  is_published boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_resume_synonyms_category ON public.resume_synonyms(category);
CREATE INDEX idx_resume_synonyms_slug ON public.resume_synonyms(slug);
CREATE INDEX idx_resume_synonyms_published ON public.resume_synonyms(is_published);

-- RLS Policies
ALTER TABLE public.resume_synonyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resume synonyms are viewable by everyone"
  ON public.resume_synonyms FOR SELECT
  USING (is_published = true);

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
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_resume_examples_updated_at
  BEFORE UPDATE ON public.resume_examples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_templates_updated_at
  BEFORE UPDATE ON public.resume_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_industry_keywords_updated_at
  BEFORE UPDATE ON public.industry_keywords
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_title_taxonomy_updated_at
  BEFORE UPDATE ON public.job_title_taxonomy
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resume_synonyms_updated_at
  BEFORE UPDATE ON public.resume_synonyms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_resume_example_views(example_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.resume_examples
  SET view_count = view_count + 1
  WHERE id = example_id;
END;
$$;

-- Function to get popular resume examples
CREATE OR REPLACE FUNCTION get_popular_resume_examples(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  slug text,
  job_title text,
  industry text,
  view_count integer
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    re.id,
    re.slug,
    re.job_title,
    re.industry,
    re.view_count
  FROM public.resume_examples re
  WHERE re.is_published = true
  ORDER BY re.view_count DESC
  LIMIT limit_count;
END;
$$;

-- =============================================
-- COMMENTS (for documentation)
-- =============================================

COMMENT ON TABLE public.resume_examples IS 'Library of 2000+ resume examples for SEO and user inspiration';
COMMENT ON TABLE public.resume_templates IS 'Visual design templates (JSON configs from templateConfigs.ts)';
COMMENT ON TABLE public.power_words_usage IS 'Tracks which power word suggestions users accept/reject';
COMMENT ON TABLE public.industry_keywords IS 'ATS keywords mapped to industries and job titles';
COMMENT ON TABLE public.job_title_taxonomy IS 'Standardized job titles with aliases and metadata';
COMMENT ON TABLE public.resume_synonyms IS 'Power words database for /resume-synonyms feature';
