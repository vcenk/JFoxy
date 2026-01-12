-- Migration: Add generation tracking fields to resume_examples table
-- These fields track the cost, time, and creator of AI-generated resume examples

-- Add generation cost tracking (in USD)
ALTER TABLE public.resume_examples
ADD COLUMN IF NOT EXISTS generation_cost numeric DEFAULT 0;

-- Add generation time tracking (in milliseconds)
ALTER TABLE public.resume_examples
ADD COLUMN IF NOT EXISTS generation_time_ms integer DEFAULT 0;

-- Add creator tracking (which admin generated this)
ALTER TABLE public.resume_examples
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id);

-- Add comments for documentation
COMMENT ON COLUMN public.resume_examples.generation_cost IS 'Cost in USD to generate this example using OpenAI API';
COMMENT ON COLUMN public.resume_examples.generation_time_ms IS 'Time taken to generate this example in milliseconds';
COMMENT ON COLUMN public.resume_examples.created_by IS 'Admin user who generated this example';

-- Create index for querying by creator
CREATE INDEX IF NOT EXISTS idx_resume_examples_created_by ON public.resume_examples(created_by);

-- Create index for cost analysis
CREATE INDEX IF NOT EXISTS idx_resume_examples_generation_cost ON public.resume_examples(generation_cost DESC);
