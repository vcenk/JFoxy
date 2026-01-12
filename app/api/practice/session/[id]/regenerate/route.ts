// app/api/practice/session/[id]/regenerate/route.ts
// Regenerate the current question in a practice session

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
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
    const { questionId } = body

    if (!questionId) {
      return badRequestResponse('Question ID is required')
    }

    // Fetch session details to get context
    const { data: sessionData, error: sessionError } = await supabaseAdmin
      .from('practice_sessions')
      .select('resume_id, job_description_id, question_category, difficulty, user_id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !sessionData) {
      console.error('Failed to fetch session:', sessionError)
      return serverErrorResponse('Session not found')
    }

    // Get resume context
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('raw_text')
      .eq('id', sessionData.resume_id)
      .single()

    if (resumeError || !resume) {
      return badRequestResponse('Resume not found')
    }

    // TODO: Implement question regeneration with generateInterviewPlan
    // This feature is not yet implemented
    return serverErrorResponse('Question regeneration is not yet implemented')
  } catch (error) {
    console.error('[API Regenerate Question Error]:', error)
    return serverErrorResponse()
  }
}
