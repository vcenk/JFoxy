// app/api/practice/session/[id]/complete/route.ts
// Mark practice session as completed

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

export async function POST(
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

    // Update session status to completed
    const { data: session, error } = await supabaseAdmin
      .from('practice_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !session) {
      console.error('[Practice Session Complete Error]:', error)
      return serverErrorResponse('Failed to complete session')
    }

    return successResponse({ session })
  } catch (error) {
    console.error('[Practice Session Complete API Error]:', error)
    return serverErrorResponse()
  }
}
