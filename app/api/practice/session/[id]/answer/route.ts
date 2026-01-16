// app/api/practice/session/[id]/answer/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
} from '@/lib/utils/apiHelpers'
import { scoreAnswer } from '@/lib/engines/answerScoringEngine'
// import { generateInterviewPlan } from '@/lib/engines/mockInterviewEngine' // TODO: Implement practice question generation


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { id: sessionId } = params

  try {
    const body = await req.json()
    const { questionId, userAnswer, questionText, questionType, questionCategory, currentQuestionIndex, totalQuestionsInSession, suggestedDifficulty } = body

    const validation = validateRequiredFields(body, ['questionId', 'userAnswer', 'questionText', 'questionType', 'currentQuestionIndex'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    // Fetch session details to get resume/job context for evaluation
    const { data: sessionData, error: sessionFetchError } = await supabaseAdmin
      .from('practice_sessions')
      .select('resume_id, job_description_id')
      .eq('id', sessionId)
      .single();

    if (sessionFetchError || !sessionData) {
      console.error('Failed to fetch session for evaluation:', sessionFetchError);
      return serverErrorResponse('Failed to get context for answer evaluation');
    }

    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('raw_text, title, analysis_results') // analysis_results for skills
      .eq('id', sessionData.resume_id)
      .single();
    if (resumeError || !resume) return badRequestResponse('Resume not found for answer evaluation');

    // Prepare resume summary for evaluation
    const resumeSummary = resume.raw_text?.substring(0, 2000) || resume.title || 'No resume available';

    // Get job description for evaluation
    let jobSummary: string | undefined;
    if (sessionData.job_description_id) {
      const { data: jd, error: jdError } = await supabaseAdmin
        .from('job_descriptions')
        .select('description, title')
        .eq('id', sessionData.job_description_id)
        .single();
      if (jdError) console.error('Failed to fetch JD for evaluation:', jdError);
      if (jd) {
        jobSummary = `${jd.title}\n\n${jd.description}`.substring(0, 2000);
      }
    }

    // 1. Evaluate the user's answer using scoreAnswer
    const evaluationResponse = await scoreAnswer({
      question: questionText,
      transcript: userAnswer.transcript,
      resumeSummary,
      jobSummary,
    });

    if (!evaluationResponse) {
      console.error('[Answer Evaluation Error]: scoreAnswer returned null');
      return serverErrorResponse('Failed to evaluate answer using AI engine');
    }

    // Map evaluation response to practice_answers table schema
    const evaluation = {
      overall_score: evaluationResponse.overall_score,
      star_analysis: {
        situation: evaluationResponse.star.has_situation,
        task: evaluationResponse.star.has_task,
        action: evaluationResponse.star.has_action,
        result: evaluationResponse.star.has_result,
      },
      strengths: evaluationResponse.strengths,
      improvements: evaluationResponse.areas_for_improvement,
      summary: evaluationResponse.one_sentence_summary,
      clarity_score: evaluationResponse.clarity_score,
      relevance_score: evaluationResponse.relevance_score,
      impact_score: evaluationResponse.impact_score,
    };

    // 2. Save the user's answer and evaluation
    const { data: savedAnswer, error: answerError } = await supabaseAdmin
      .from('practice_answers')
      .insert({
        question_id: questionId,
        user_id: user.id,
        transcript: userAnswer.transcript,
        audio_url: userAnswer.audioUrl,
        duration_seconds: Math.round(userAnswer.duration), // Ensure duration is an integer
        overall_score: evaluation.overall_score,
        star_analysis: evaluation.star_analysis,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        summary: evaluation.summary,
        clarity_score: evaluation.clarity_score,
        relevance_score: evaluation.relevance_score,
        impact_score: evaluation.impact_score,
      })
      .select()
      .single()

    if (answerError) {
      console.error('Failed to save practice answer:', answerError)
      return serverErrorResponse('Failed to save answer')
    }

    // 3. Update practice session with completed question count
    const newCompletedCount = currentQuestionIndex + 1;
    await supabaseAdmin
      .from('practice_sessions')
      .update({ completed_questions: newCompletedCount })
      .eq('id', sessionId)
      .eq('user_id', user.id);


    // 4. Get the next pre-generated question (if any remain)
    let nextQuestion = null;
    let isSessionFinished = false;

    // Fetch all questions for this session ordered by order_index
    const { data: allQuestions, error: questionsError } = await supabaseAdmin
      .from('practice_questions')
      .select('*')
      .eq('session_id', sessionId)
      .order('order_index', { ascending: true });

    if (questionsError) {
      console.error('Failed to fetch session questions:', questionsError);
    }

    if (allQuestions && allQuestions.length > 0) {
      // Find the next question (order_index is 1-based, newCompletedCount is the count of completed)
      const nextQuestionData = allQuestions.find(q => q.order_index === newCompletedCount + 1);

      if (nextQuestionData) {
        // There's another question to answer
        nextQuestion = {
          id: nextQuestionData.id,
          question_text: nextQuestionData.question_text,
          question_category: nextQuestionData.question_category,
          difficulty: nextQuestionData.difficulty,
          order_index: nextQuestionData.order_index,
        };
        isSessionFinished = false;
      } else {
        // No more questions - session is complete
        isSessionFinished = true;
      }
    } else {
      // No questions found (shouldn't happen) - end session
      isSessionFinished = true;
    }

    return successResponse({
      evaluation,
      savedAnswer,
      nextQuestion,
      isSessionFinished
    })
  } catch (error) {
    console.error('[API Practice Answer Error]:', error)
    return serverErrorResponse()
  }
}
