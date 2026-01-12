// app/api/practice/start/route.ts
import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  checkUsageLimits,
  incrementUsage,
} from '@/lib/utils/apiHelpers'
// import { generateInterviewPlan } from '@/lib/engines/mockInterviewEngine' // TODO: Implement practice question generation

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  // Check usage limits
  const limitCheck = await checkUsageLimits(user.id, 'audio_practice')
  if (!limitCheck.allowed) {
    return Response.json(
      { success: false, error: limitCheck.reason, code: 'LIMIT_REACHED' },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const { resumeId, jobDescriptionId, questionCategory, totalQuestions = 5 } = body

    const validation = validateRequiredFields(body, ['resumeId', 'questionCategory'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('raw_text')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()
    if (!resume) return badRequestResponse('Resume not found')

    // TODO: Implement practice session start with generateInterviewPlan
    // This feature is not yet implemented - the generateInterviewPlan function needs to be created
    return serverErrorResponse('Practice sessions are not yet implemented')
  } catch (error) {
    console.error('[API Start Practice Session Error]:', error)
    return serverErrorResponse()
  }
}
