// app/api/practice/session/[id]/route.ts
// Get practice session details and questions

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const resolved = params instanceof Promise ? await params : params
    const { id } = resolved

    if (!id) {
      return badRequestResponse('Session ID is required')
    }

    // Get session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('practice_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      console.error('[Practice Session Get Error]:', sessionError)
      return badRequestResponse('Practice session not found')
    }

    // Get questions for this session
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('practice_questions')
      .select('*')
      .eq('practice_session_id', id)
      .order('sequence_number', { ascending: true })

    if (questionsError) {
      console.error('[Practice Questions Get Error]:', questionsError)
      return serverErrorResponse('Failed to load questions')
    }

    return successResponse({
      session,
      questions: questions || [],
    })
  } catch (error) {
    console.error('[Practice Session API Error]:', error)
    return serverErrorResponse()
  }
}
