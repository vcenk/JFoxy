// app/api/mock/check-limits/route.ts
// Pre-flight check for mock interview usage limits

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  successResponse,
  checkUsageLimits,
} from '@/lib/utils/apiHelpers'

/**
 * GET /api/mock/check-limits
 *
 * Checks if the user can start a mock interview based on subscription/usage limits.
 * Returns early warning for UI display.
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    // Check if user can use mock interview minutes (minimum 15 minutes)
    const limitCheck = await checkUsageLimits(user.id, 'mock_interview_minutes', 15)

    return successResponse({
      allowed: limitCheck.allowed,
      reason: limitCheck.reason || null,
      remaining: limitCheck.remaining || 0
    })
  } catch (error) {
    console.error('[Mock Check Limits Error]:', error)
    // Return allowed: true on error to not block users incorrectly
    return successResponse({
      allowed: true,
      reason: null,
      remaining: null
    })
  }
}
