// app/api/mock/[id]/tool-response/route.ts
// Handle function call responses from OpenAI Realtime API

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse
} from '@/lib/utils/apiHelpers'
import { InterviewPhase } from '@/lib/services/realtimeClient'

interface SaveAnswerPayload {
  tool: 'save_candidate_answer'
  question_index: number
  answer_summary: string
  used_star_method?: boolean
  answer_quality?: 'weak' | 'average' | 'strong'
}

interface AdvancePhasePayload {
  tool: 'advance_phase'
  next_phase: InterviewPhase
  reason?: string
}

interface EndInterviewPayload {
  tool: 'end_interview'
  reason: 'completed' | 'candidate_ended' | 'technical_issue'
  overall_impression?: string
}

type ToolPayload = SaveAnswerPayload | AdvancePhasePayload | EndInterviewPayload

/**
 * POST /api/mock/[id]/tool-response
 *
 * Handle function call results from OpenAI Realtime API
 *
 * Request Body:
 * - tool: 'save_candidate_answer' | 'advance_phase' | 'end_interview'
 * - ...tool-specific parameters
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const sessionId = params.id

  try {
    const body = await req.json() as ToolPayload

    // Verify session belongs to user (using mock_interviews table)
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mock_interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return badRequestResponse('Session not found or access denied')
    }

    switch (body.tool) {
      case 'save_candidate_answer':
        return await handleSaveAnswer(sessionId, session, body)

      case 'advance_phase':
        return await handleAdvancePhase(sessionId, session, body)

      case 'end_interview':
        return await handleEndInterview(sessionId, session, body)

      default:
        return badRequestResponse('Unknown tool type')
    }

  } catch (error) {
    console.error('[Tool Response Error]:', error)
    return serverErrorResponse('Failed to process tool response')
  }
}

async function handleSaveAnswer(
  sessionId: string,
  session: any,
  payload: SaveAnswerPayload
) {
  const { question_index, answer_summary, used_star_method, answer_quality } = payload

  console.log('[Tool Response] Saving answer for question:', question_index)

  // Get the question from interview_plan
  const interviewPlan = session.interview_plan || {}
  const questions = interviewPlan.questions || []
  const question = questions[question_index]

  if (!question) {
    console.error('[Tool Response] Question not found at index:', question_index)
    return badRequestResponse('Question not found')
  }

  // Update the exchange record
  const { error: updateError } = await supabaseAdmin
    .from('mock_interview_exchanges')
    .update({
      user_answer_text: answer_summary,
      star_components: used_star_method ? { used_star: true } : { used_star: false },
      answer_score: answer_quality === 'strong' ? 8 : answer_quality === 'average' ? 5 : 3
    })
    .eq('session_id', sessionId)
    .eq('order_index', question_index + 1) // order_index is 1-based

  if (updateError) {
    console.error('[Tool Response] Update error:', updateError)
  }

  // Update current_question_index in session
  await supabaseAdmin
    .from('mock_interview_sessions')
    .update({
      current_question_index: question_index + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  return successResponse({
    success: true,
    questionIndex: question_index,
    nextQuestionIndex: question_index + 1
  })
}

async function handleAdvancePhase(
  sessionId: string,
  session: any,
  payload: AdvancePhasePayload
) {
  const { next_phase, reason } = payload

  console.log('[Tool Response] Advancing to phase:', next_phase, 'Reason:', reason)

  // Update current_phase in session
  const { error: updateError } = await supabaseAdmin
    .from('mock_interview_sessions')
    .update({
      current_phase: next_phase,
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (updateError) {
    console.error('[Tool Response] Phase update error:', updateError)
    return serverErrorResponse('Failed to update phase')
  }

  return successResponse({
    success: true,
    phase: next_phase
  })
}

async function handleEndInterview(
  sessionId: string,
  session: any,
  payload: EndInterviewPayload
) {
  const { reason, overall_impression } = payload

  console.log('[Tool Response] Ending interview:', reason, overall_impression)

  // Update session status
  const { error: updateError } = await supabaseAdmin
    .from('mock_interview_sessions')
    .update({
      status: 'completed',
      current_phase: 'completed',
      feedback_summary: overall_impression,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', sessionId)

  if (updateError) {
    console.error('[Tool Response] End interview error:', updateError)
    return serverErrorResponse('Failed to end interview')
  }

  return successResponse({
    success: true,
    status: 'completed',
    reason
  })
}
