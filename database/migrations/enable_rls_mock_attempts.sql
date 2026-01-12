-- database/migrations/enable_rls_mock_attempts.sql
-- Enable RLS on mock_interview_attempts and add security policies

-- 1. Enable RLS
ALTER TABLE public.mock_interview_attempts ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for SELECT (Users can view their own attempts)
CREATE POLICY "Users can view own interview attempts"
ON public.mock_interview_attempts
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.mock_interview_exchanges exchange
    JOIN public.mock_interviews interview ON exchange.mock_interview_id = interview.id
    WHERE exchange.id = mock_interview_attempts.exchange_id
    AND interview.user_id = auth.uid()
  )
);

-- 3. Create Policy for INSERT (Users can insert attempts for their own interviews)
CREATE POLICY "Users can insert own interview attempts"
ON public.mock_interview_attempts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.mock_interview_exchanges exchange
    JOIN public.mock_interviews interview ON exchange.mock_interview_id = interview.id
    WHERE exchange.id = mock_interview_attempts.exchange_id
    AND interview.user_id = auth.uid()
  )
);

-- 4. Create Policy for UPDATE (Users can update their own attempts)
CREATE POLICY "Users can update own interview attempts"
ON public.mock_interview_attempts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.mock_interview_exchanges exchange
    JOIN public.mock_interviews interview ON exchange.mock_interview_id = interview.id
    WHERE exchange.id = mock_interview_attempts.exchange_id
    AND interview.user_id = auth.uid()
  )
);

-- 5. Create Policy for DELETE (Users can delete their own attempts)
CREATE POLICY "Users can delete own interview attempts"
ON public.mock_interview_attempts
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.mock_interview_exchanges exchange
    JOIN public.mock_interviews interview ON exchange.mock_interview_id = interview.id
    WHERE exchange.id = mock_interview_attempts.exchange_id
    AND interview.user_id = auth.uid()
  )
);
