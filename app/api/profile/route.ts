// app/api/profile/route.ts
// Update user profile through backend (not direct client access)

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

// Allowed fields that can be updated
const ALLOWED_FIELDS = ['full_name', 'avatar_url']

/**
 * PUT /api/profile
 * Update user profile fields (full_name, avatar_url)
 */
export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Filter to only allowed fields
    const updates: Record<string, any> = {}
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return badRequestResponse('No valid fields to update')
    }

    // Update profile using service role (backend-only access)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id, full_name, avatar_url, email')
      .single()

    if (error) {
      console.error('[Profile Update Error]:', error)
      return serverErrorResponse('Failed to update profile')
    }

    return successResponse(data)
  } catch (error) {
    console.error('[Profile API Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, avatar_url, email, subscription_tier, subscription_status, preferences')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('[Profile GET Error]:', error)
      return serverErrorResponse('Failed to fetch profile')
    }

    return successResponse(data)
  } catch (error) {
    console.error('[Profile API Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}
