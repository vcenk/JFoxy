// app/api/coaching/star/route.ts
// Generate STAR story

import { NextRequest } from 'next/server'
import { generateStarStory } from '@/lib/engines/starBuilderEngine'  // lib/engines/starBuilderEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, ['question', 'resumeId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { question, resumeId, experienceSnippet, category } = body

    // Get resume
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('raw_text')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return badRequestResponse('Resume not found')
    }

    // Generate STAR story
    const story = await generateStarStory({
      question,
      resumeSummary: resume.raw_text,
      experienceSnippet,
    })

    if (!story) {
      return serverErrorResponse('Failed to generate STAR story')
    }

    // Save to database
    const { data: savedStory, error } = await supabaseAdmin
      .from('star_stories')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        title: question.substring(0, 100), // Use question as title
        category: category || 'general',
        related_question: question,
        situation: story.situation,
        task: story.task,
        action: story.action,
        result: story.result,
        metrics: story.metrics,
        skills_demonstrated: story.skills_demonstrated,
      })
      .select()
      .single()

    if (error) {
      console.error('[STAR Story Save Error]:', error)
      return serverErrorResponse('Failed to save STAR story')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'star_generation',
      metadata: { resumeId, category },
    })

    return successResponse(savedStory)
  } catch (error) {
    console.error('[STAR API Error]:', error)
    return serverErrorResponse()
  }
}
