-- database/migrations/fix_performance_warnings.sql
-- Fixes performance warnings identified by database linter

-- 1. Optimize RLS Policies (auth_rls_initplan)
-- Replace auth.uid() with (select auth.uid()) to prevent re-evaluation per row

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((select auth.uid()) = id);

-- Job Descriptions
DROP POLICY IF EXISTS "Users can view own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can view own job descriptions" ON public.job_descriptions FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can create own job descriptions" ON public.job_descriptions FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can update own job descriptions" ON public.job_descriptions FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own job descriptions" ON public.job_descriptions;
CREATE POLICY "Users can delete own job descriptions" ON public.job_descriptions FOR DELETE USING ((select auth.uid()) = user_id);

-- Practice Sessions
DROP POLICY IF EXISTS "Users can view own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can view own practice sessions" ON public.practice_sessions FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can create own practice sessions" ON public.practice_sessions FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can update own practice sessions" ON public.practice_sessions FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own practice sessions" ON public.practice_sessions;
CREATE POLICY "Users can delete own practice sessions" ON public.practice_sessions FOR DELETE USING ((select auth.uid()) = user_id);

-- Gap Defenses
DROP POLICY IF EXISTS "Users can create own gap defenses" ON public.gap_defenses;
CREATE POLICY "Users can create own gap defenses" ON public.gap_defenses FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own gap defenses" ON public.gap_defenses;
CREATE POLICY "Users can view own gap defenses" ON public.gap_defenses FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own gap defenses" ON public.gap_defenses;
CREATE POLICY "Users can update own gap defenses" ON public.gap_defenses FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own gap defenses" ON public.gap_defenses;
CREATE POLICY "Users can delete own gap defenses" ON public.gap_defenses FOR DELETE USING ((select auth.uid()) = user_id);

-- Practice Questions
DROP POLICY IF EXISTS "Users can view questions from own sessions" ON public.practice_questions;
CREATE POLICY "Users can view questions from own sessions" ON public.practice_questions FOR SELECT USING (EXISTS (SELECT 1 FROM public.practice_sessions s WHERE s.id = session_id AND s.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create questions in own sessions" ON public.practice_questions;
CREATE POLICY "Users can create questions in own sessions" ON public.practice_questions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.practice_sessions s WHERE s.id = session_id AND s.user_id = (select auth.uid())));

-- Practice Answers
DROP POLICY IF EXISTS "Users can view own answers" ON public.practice_answers;
CREATE POLICY "Users can view own answers" ON public.practice_answers FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own answers" ON public.practice_answers;
CREATE POLICY "Users can create own answers" ON public.practice_answers FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own answers" ON public.practice_answers;
CREATE POLICY "Users can update own answers" ON public.practice_answers FOR UPDATE USING ((select auth.uid()) = user_id);

-- Mock Interviews
DROP POLICY IF EXISTS "Users can view own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can view own mock interviews" ON public.mock_interviews FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can create own mock interviews" ON public.mock_interviews FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can update own mock interviews" ON public.mock_interviews FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own mock interviews" ON public.mock_interviews;
CREATE POLICY "Users can delete own mock interviews" ON public.mock_interviews FOR DELETE USING ((select auth.uid()) = user_id);

-- Mock Interview Exchanges
DROP POLICY IF EXISTS "Users can view exchanges from own interviews" ON public.mock_interview_exchanges;
CREATE POLICY "Users can view exchanges from own interviews" ON public.mock_interview_exchanges FOR SELECT USING (EXISTS (SELECT 1 FROM public.mock_interviews i WHERE i.id = mock_interview_id AND i.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can create exchanges in own interviews" ON public.mock_interview_exchanges;
CREATE POLICY "Users can create exchanges in own interviews" ON public.mock_interview_exchanges FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.mock_interviews i WHERE i.id = mock_interview_id AND i.user_id = (select auth.uid())));

-- Star Stories
DROP POLICY IF EXISTS "Users can view own STAR stories" ON public.star_stories;
CREATE POLICY "Users can view own STAR stories" ON public.star_stories FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own STAR stories" ON public.star_stories;
CREATE POLICY "Users can create own STAR stories" ON public.star_stories FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own STAR stories" ON public.star_stories;
CREATE POLICY "Users can update own STAR stories" ON public.star_stories FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own STAR stories" ON public.star_stories;
CREATE POLICY "Users can delete own STAR stories" ON public.star_stories FOR DELETE USING ((select auth.uid()) = user_id);

-- SWOT Analyses
DROP POLICY IF EXISTS "Users can view own SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Users can view own SWOT analyses" ON public.swot_analyses FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Users can create own SWOT analyses" ON public.swot_analyses FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Users can update own SWOT analyses" ON public.swot_analyses FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own SWOT analyses" ON public.swot_analyses;
CREATE POLICY "Users can delete own SWOT analyses" ON public.swot_analyses FOR DELETE USING ((select auth.uid()) = user_id);

-- Intro Pitches
DROP POLICY IF EXISTS "Users can view own intro pitches" ON public.intro_pitches;
CREATE POLICY "Users can view own intro pitches" ON public.intro_pitches FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own intro pitches" ON public.intro_pitches;
CREATE POLICY "Users can create own intro pitches" ON public.intro_pitches FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own intro pitches" ON public.intro_pitches;
CREATE POLICY "Users can update own intro pitches" ON public.intro_pitches FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own intro pitches" ON public.intro_pitches;
CREATE POLICY "Users can delete own intro pitches" ON public.intro_pitches FOR DELETE USING ((select auth.uid()) = user_id);

-- Cover Letters
DROP POLICY IF EXISTS "Users can view own cover letters" ON public.cover_letters;
CREATE POLICY "Users can view own cover letters" ON public.cover_letters FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own cover letters" ON public.cover_letters;
CREATE POLICY "Users can create own cover letters" ON public.cover_letters FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own cover letters" ON public.cover_letters;
CREATE POLICY "Users can update own cover letters" ON public.cover_letters FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own cover letters" ON public.cover_letters;
CREATE POLICY "Users can delete own cover letters" ON public.cover_letters FOR DELETE USING ((select auth.uid()) = user_id);

-- Usage Tracking
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage_tracking;
CREATE POLICY "Users can view own usage" ON public.usage_tracking FOR SELECT USING ((select auth.uid()) = user_id);

-- Resumes
DROP POLICY IF EXISTS "Users can view own resumes" ON public.resumes;
CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own resumes" ON public.resumes;
CREATE POLICY "Users can create own resumes" ON public.resumes FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own resumes" ON public.resumes;
CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own resumes" ON public.resumes;
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING ((select auth.uid()) = user_id);

-- Analysis Results
DROP POLICY IF EXISTS "Users can view own analysis results" ON public.analysis_results;
CREATE POLICY "Users can view own analysis results" ON public.analysis_results FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own analysis results" ON public.analysis_results;
CREATE POLICY "Users can insert own analysis results" ON public.analysis_results FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own analysis results" ON public.analysis_results;
CREATE POLICY "Users can update own analysis results" ON public.analysis_results FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own analysis results" ON public.analysis_results;
CREATE POLICY "Users can delete own analysis results" ON public.analysis_results FOR DELETE USING ((select auth.uid()) = user_id);

-- Mock Interview Attempts
DROP POLICY IF EXISTS "Users can view own interview attempts" ON public.mock_interview_attempts;
CREATE POLICY "Users can view own interview attempts" ON public.mock_interview_attempts FOR SELECT USING (EXISTS (SELECT 1 FROM public.mock_interview_exchanges e JOIN public.mock_interviews i ON e.mock_interview_id = i.id WHERE e.id = exchange_id AND i.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can insert own interview attempts" ON public.mock_interview_attempts;
CREATE POLICY "Users can insert own interview attempts" ON public.mock_interview_attempts FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.mock_interview_exchanges e JOIN public.mock_interviews i ON e.mock_interview_id = i.id WHERE e.id = exchange_id AND i.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can update own interview attempts" ON public.mock_interview_attempts;
CREATE POLICY "Users can update own interview attempts" ON public.mock_interview_attempts FOR UPDATE USING (EXISTS (SELECT 1 FROM public.mock_interview_exchanges e JOIN public.mock_interviews i ON e.mock_interview_id = i.id WHERE e.id = exchange_id AND i.user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Users can delete own interview attempts" ON public.mock_interview_attempts;
CREATE POLICY "Users can delete own interview attempts" ON public.mock_interview_attempts FOR DELETE USING (EXISTS (SELECT 1 FROM public.mock_interview_exchanges e JOIN public.mock_interviews i ON e.mock_interview_id = i.id WHERE e.id = exchange_id AND i.user_id = (select auth.uid())));


-- 2. Fix Multiple Permissive Policies (multiple_permissive_policies)
-- Remove duplicate INSERT policy on resumes
DROP POLICY IF EXISTS "Users can insert own resumes" ON public.resumes;


-- 3. Fix Duplicate Index (duplicate_index)
-- Remove redundant index
DROP INDEX IF EXISTS idx_mock_exchanges_interview_id;
