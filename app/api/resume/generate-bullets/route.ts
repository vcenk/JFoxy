// app/api/resume/generate-bullets/route.ts
// Generate bullet points from job description using AI

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import { generateBulletsFromJD } from '@/lib/engines/resumeContentEngine'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { jobDescription, company, position, existingBullets, count, industry } = body

    if (!jobDescription) {
      return badRequestResponse('Job description is required')
    }

    if (!company || !position) {
      return badRequestResponse('Company and position are required')
    }

    const bullets = await generateBulletsFromJD({
      jobDescription,
      company,
      position,
      existingBullets,
      count: count || 3,
      industry,
    })

    if (!bullets || bullets.length === 0) {
      return serverErrorResponse('Failed to generate bullets')
    }

    return successResponse({ bullets })
  } catch (error: any) {
    console.error('[Generate Bullets Error]:', error)
    return serverErrorResponse(error.message || 'Failed to generate bullets')
  }
}
