// app/api/mock/list/route.ts
// List All Mock Interviews for User

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  serverErrorResponse,
  successResponse
} from '@/lib/utils/apiHelpers'

/**
 * GET /api/mock/list
 *
 * Fetches all mock interview sessions for the authenticated user
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const { data: interviews, error } = await supabaseAdmin
      .from('mock_interviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Mock List] Error fetching interviews:', error)
      return serverErrorResponse('Failed to fetch interviews')
    }

    // Transform to UI-friendly format
    const transformedInterviews = (interviews || []).map(interview => {
      const plannedQuestions = interview.planned_questions || {}
      return {
        id: interview.id,
        job_title: plannedQuestions.job_title || interview.focus || 'Interview',
        company_name: plannedQuestions.company_name || 'Company',
        duration_minutes: interview.duration_minutes,
        status: interview.status,
        overall_score: interview.overall_score,
        current_phase: plannedQuestions.current_phase || 'welcome',
        total_questions: plannedQuestions.questions?.length || 0,
        created_at: interview.created_at,
        completed_at: interview.completed_at,
        interviewer_name: plannedQuestions.interviewer_name,
        interviewer_voice: interview.persona_id
      }
    })

    return successResponse(transformedInterviews)
  } catch (error) {
    console.error('[Mock List] Unexpected error:', error)
    return serverErrorResponse('An unexpected error occurred')
  }
}
