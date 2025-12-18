// app/api/coaching/gap-defense/route.ts
// Generate and save a Gap Defense script

import { NextRequest } from 'next/server'
import { generateGapDefense } from '@/lib/engines/gapDefenseEngine'
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
    const validation = validateRequiredFields(body, ['resumeId', 'gapType', 'gapDescription'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, jobDescriptionId, gapType, gapDescription } = body

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

    // 3. Generate Gap Defense from engine
    const defense = await generateGapDefense({
      resumeContext: resume.raw_text,
      jobContext: jobText,
      gapType,
      gapDescription,
    })

    if (!defense) {
      return serverErrorResponse('Failed to generate gap defense.')
    }

    // 4. Save the new defense to the database
    const { data: savedDefense, error } = await supabaseAdmin
      .from('gap_defenses')
      .insert({
        user_id: user.id,
        gap_type: gapType,
        gap_description: gapDescription,
        pivot: defense.pivot,
        proof: defense.proof,
        promise: defense.promise,
      })
      .select()
      .single()

    if (error) {
      console.error('[Gap Defense Save Error]:', error)
      return serverErrorResponse('Failed to save gap defense script.')
    }

    // 5. Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'gap_defense_generation',
      metadata: { resumeId, gapType },
    })

    return successResponse(savedDefense)
  } catch (error) {
    console.error('[Gap Defense API Critical Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}