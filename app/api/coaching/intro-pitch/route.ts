// app/api/coaching/intro-pitch/route.ts
// Generate and save an Intro Pitch

import { NextRequest } from 'next/server'
import { generateIntroPitch } from '@/lib/engines/introPitchEngine'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
} from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const validation = validateRequiredFields(body, ['resumeId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, jobDescriptionId, targetDuration, style } = body

    // 1. Get Resume context
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('raw_text')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return badRequestResponse('Resume not found')
    }

    // 2. Get Job Description context (optional)
    let jobText: string | undefined
    if (jobDescriptionId) {
      const { data: jd } = await supabaseAdmin
        .from('job_descriptions')
        .select('description')
        .eq('id', jobDescriptionId)
        .eq('user_id', user.id)
        .single()
      jobText = jd?.description
    }

    // 3. Generate Intro Pitch from engine
    const pitch = await generateIntroPitch({
      resumeSummary: resume.raw_text,
      jobDescription: jobText,
      targetDuration,
      style,
    })

    if (!pitch) {
      return serverErrorResponse('Failed to generate intro pitch.')
    }

    // 4. Save the new pitch to the database
    const { data: savedPitch, error } = await supabaseAdmin
      .from('intro_pitches')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        pitch_text: pitch.full_pitch,
        duration_seconds: pitch.estimated_duration_seconds,
        hook: pitch.hook,
        core_message: pitch.core_message,
        call_to_action: pitch.call_to_action,
      })
      .select()
      .single()

    if (error) {
      console.error('[Intro Pitch Save Error]:', error)
      return serverErrorResponse('Failed to save intro pitch.')
    }

    // 5. Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'intro_pitch_generation',
      metadata: { resumeId, style, targetDuration },
    })

    return successResponse(savedPitch)
  } catch (error) {
    console.error('[Intro Pitch API Critical Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}