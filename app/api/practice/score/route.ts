// app/api/practice/score/route.ts
// Score a practice answer using AI

import { NextRequest } from 'next/server'
import { scoreAnswer, generateIdealAnswer } from '@/lib/engines/answerScoringEngine'  // lib/engines/answerScoringEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'practiceQuestionId',
      'practiceSessionId',
      'transcript',
    ])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { practiceQuestionId, practiceSessionId, transcript, audioDurationSeconds } = body

    // Get practice question
    const { data: question } = await supabaseAdmin
      .from('practice_questions')
      .select('*')
      .eq('id', practiceQuestionId)
      .eq('practice_session_id', practiceSessionId)
      .single()

    if (!question) {
      return badRequestResponse('Practice question not found')
    }

    // Get practice session
    const { data: session } = await supabaseAdmin
      .from('practice_sessions')
      .select('*, resumes(raw_text), job_descriptions(description)')
      .eq('id', practiceSessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return badRequestResponse('Practice session not found')
    }

    // Score the answer using AI engine
    const score = await scoreAnswer({
      question: question.question_text,
      transcript,
      resumeSummary: session.resumes?.raw_text,
      jobSummary: session.job_descriptions?.description,
    })

    if (!score) {
      return serverErrorResponse('Failed to score answer')
    }

    // Generate ideal answer example
    const idealAnswer = await generateIdealAnswer({
      question: question.question_text,
      resumeSummary: session.resumes?.raw_text,
      jobSummary: session.job_descriptions?.description,
    })

    // Add ideal answer to score object
    if (idealAnswer) {
      score.ideal_answer = idealAnswer
    }

    // Save answer and scoring to database
    const { data: savedAnswer, error } = await supabaseAdmin
      .from('practice_answers')
      .insert({
        practice_question_id: practiceQuestionId,
        transcript,
        audio_duration_seconds: audioDurationSeconds,
        score_overall: score.overall_score,
        score_clarity: score.clarity_score,
        score_relevance: score.relevance_score,
        score_impact: score.impact_score,
        has_situation: score.star?.has_situation,
        has_task: score.star?.has_task,
        has_action: score.star?.has_action,
        has_result: score.star?.has_result,
        strengths: score.strengths,
        improvements: score.improvements,
      })
      .select()
      .single()

    if (error) {
      console.error('[Practice Answer Save Error]:', error)
      return serverErrorResponse('Failed to save practice answer')
    }

    // Update session answered count
    await supabaseAdmin
      .from('practice_sessions')
      .update({
        questions_answered: session.questions_answered + 1,
      })
      .eq('id', practiceSessionId)

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'answer_scoring',
      sessionId: practiceSessionId,
      metadata: { questionId: practiceQuestionId, score: score.overall_score },
    })

    return successResponse({
      answer: savedAnswer,
      score,
    })
  } catch (error) {
    console.error('[Practice Score API Error]:', error)
    return serverErrorResponse()
  }
}
