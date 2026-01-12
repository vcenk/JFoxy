// app/api/resume/generate-summary/route.ts
// Generate professional summary using AI

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import { generateProfessionalSummary, rewriteSummary } from '@/lib/engines/resumeContentEngine'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { experience, targetRole, targetIndustry, yearsExperience, tone, currentSummary, rewriteStyle } = body

    // If rewriting existing summary
    if (currentSummary && rewriteStyle) {
      const rewritten = await rewriteSummary(currentSummary, rewriteStyle)
      if (!rewritten) {
        return serverErrorResponse('Failed to rewrite summary')
      }
      return successResponse({ summary: rewritten })
    }

    // Generate new summary from experience
    if (!experience || !Array.isArray(experience) || experience.length === 0) {
      return badRequestResponse('Experience array is required')
    }

    const summary = await generateProfessionalSummary({
      experience,
      targetRole,
      targetIndustry,
      yearsExperience,
      tone,
    })

    if (!summary) {
      return serverErrorResponse('Failed to generate summary')
    }

    return successResponse({ summary })
  } catch (error: any) {
    console.error('[Generate Summary Error]:', error)
    return serverErrorResponse(error.message || 'Failed to generate summary')
  }
}
