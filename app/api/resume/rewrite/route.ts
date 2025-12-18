// app/api/resume/rewrite/route.ts
// Get resume rewrite suggestions

import { NextRequest } from 'next/server'
import { generateResumeRewrite } from '@/lib/engines/resumeAnalysisEngine'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  trackUsage,
} from '@/lib/utils/apiHelpers'

// Allow this function to run for up to 60 seconds
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const { resumeId, section, content, context, jobDescriptionId, focusArea } = body

    let resumeText: string = ''
    let targetFocusArea: 'bullets' | 'summary' | 'skills' | 'full' = focusArea || 'bullets'

    // MODE 1: Database Resume (Full Rewrite)
    if (resumeId) {
      const { data: resume, error } = await supabaseAdmin
        .from('resumes')
        .select('raw_text')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single()

      if (error || !resume) return badRequestResponse('Resume not found')
      resumeText = resume.raw_text
      targetFocusArea = 'full'
    }
    
    // MODE 2: Builder Mode (Specific Section)
    else if (section && content) {
      const safeContent = typeof content === 'string' ? content : JSON.stringify(content)

      // --- CASE A: SINGLE BULLET POINT ---
      if (section === 'bullet') {
        targetFocusArea = 'bullets'
        // Provide context so AI knows what "job" this bullet belongs to
        resumeText = `Context: ${context?.position || 'Role'} at ${context?.company || 'Company'}
Bullet to Rewrite: "${safeContent}"`
      }
      
      // --- CASE B: SUMMARY ---
      else if (section === 'summary') {
        targetFocusArea = 'summary'
        // Send ONLY the summary text
        resumeText = safeContent
      }
      
      // --- CASE C: SKILLS ---
      else if (section === 'skills') {
        targetFocusArea = 'skills'
        resumeText = safeContent
      }
      
      // --- FALLBACK ---
      else {
        targetFocusArea = 'full'
        resumeText = safeContent
      }
    } else {
      return badRequestResponse('Missing required fields')
    }

    // Validation
    if (!resumeText || resumeText.trim().length < 3) {
      return badRequestResponse('Content is too short to rewrite.')
    }

    // Get job description (Optional)
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

    // Generate Rewrite
    const rewrite = await generateResumeRewrite({
      resumeText,
      jobText,
      focusArea: targetFocusArea,
    })

    if (!rewrite) {
      console.error('[Resume Rewrite] Engine returned null')
      return serverErrorResponse('Failed to generate rewrite suggestions')
    }

    await trackUsage({
      userId: user.id,
      resourceType: 'resume_rewrite',
      metadata: { resumeId: resumeId || 'builder', section, focusArea: targetFocusArea },
    })

    return successResponse(rewrite)
  } catch (error) {
    console.error('[Resume Rewrite API Critical Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}