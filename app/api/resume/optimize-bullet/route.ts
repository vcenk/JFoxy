// app/api/resume/optimize-bullet/route.ts
// Optimize a single bullet point using AI

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import { optimizeBullet } from '@/lib/engines/resumeContentEngine'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { bullet, company, position, optimization, industry } = body

    if (!bullet) {
      return badRequestResponse('Bullet text is required')
    }

    if (!optimization || !['quantify', 'action-verb', 'concise', 'expand', 'ats'].includes(optimization)) {
      return badRequestResponse('Valid optimization type is required: quantify, action-verb, concise, expand, or ats')
    }

    const optimized = await optimizeBullet({
      bullet,
      company: company || 'Company',
      position: position || 'Role',
      optimization,
      industry,
    })

    if (!optimized) {
      return serverErrorResponse('Failed to optimize bullet')
    }

    return successResponse({
      original: bullet,
      optimized,
      optimization,
    })
  } catch (error: any) {
    console.error('[Optimize Bullet Error]:', error)
    return serverErrorResponse(error.message || 'Failed to optimize bullet')
  }
}
