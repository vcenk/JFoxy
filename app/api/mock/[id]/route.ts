// app/api/mock/[id]/route.ts
// Get Single Mock Interview Session

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse
} from '@/lib/utils/apiHelpers'

/**
 * GET /api/mock/[id]
 *
 * Fetches a single mock interview session by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const sessionId = params.id

  try {
    const { data: session, error } = await supabaseAdmin
      .from('mock_interviews')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error || !session) {
      return badRequestResponse('Interview session not found or access denied')
    }

    // Extract UI-friendly data from planned_questions
    const plannedQuestions = session.planned_questions || {}
    const response = {
      id: session.id,
      status: session.status,
      current_phase: plannedQuestions.current_phase || 'welcome',
      current_question_index: plannedQuestions.current_question_index || 0,
      total_questions: plannedQuestions.questions?.length || 0,
      interviewer_name: plannedQuestions.interviewer_name,
      interviewer_title: plannedQuestions.interviewer_title,
      interviewer_voice: session.persona_id,
      interviewer_gender: plannedQuestions.interviewer_gender,
      company_name: plannedQuestions.company_name,
      job_title: plannedQuestions.job_title || session.focus,
      duration_minutes: session.duration_minutes,
      created_at: session.created_at,
      started_at: session.started_at,
      completed_at: session.completed_at
    }

    return successResponse(response)
  } catch (error) {
    console.error('[Mock Get] Unexpected error:', error)
    return serverErrorResponse('An unexpected error occurred')
  }
}

/**
 * DELETE /api/mock/[id]
 *
 * Deletes a mock interview session and its related exchanges
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const sessionId = params.id

  try {
    // First verify the session belongs to this user
    const { data: session, error: fetchError } = await supabaseAdmin
      .from('mock_interviews')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !session) {
      return badRequestResponse('Interview session not found or access denied')
    }

    // Delete related exchanges first (foreign key constraint)
    await supabaseAdmin
      .from('mock_interview_exchanges')
      .delete()
      .eq('mock_interview_id', sessionId)

    // Delete the session
    const { error: deleteError } = await supabaseAdmin
      .from('mock_interviews')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('[Mock Delete] Error:', deleteError)
      return serverErrorResponse('Failed to delete interview session')
    }

    return successResponse({ deleted: true })
  } catch (error) {
    console.error('[Mock Delete] Unexpected error:', error)
    return serverErrorResponse('An unexpected error occurred')
  }
}
