// app/api/resume/suggest-skills/route.ts
// Suggest skills based on experience using AI

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import { suggestSkillsFromExperience } from '@/lib/engines/resumeContentEngine'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { experience, existingSkills, targetRole, industry } = body

    if (!experience || !Array.isArray(experience) || experience.length === 0) {
      return badRequestResponse('Experience array is required')
    }

    const suggestions = await suggestSkillsFromExperience({
      experience,
      existingSkills: existingSkills || [],
      targetRole,
      industry,
    })

    if (!suggestions) {
      return serverErrorResponse('Failed to suggest skills')
    }

    return successResponse({
      suggestions: {
        technical: suggestions.technical || [],
        soft: suggestions.soft || [],
      },
    })
  } catch (error: any) {
    console.error('[Suggest Skills Error]:', error)
    return serverErrorResponse(error.message || 'Failed to suggest skills')
  }
}
