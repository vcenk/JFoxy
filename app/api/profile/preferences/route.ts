// app/api/profile/preferences/route.ts
// Update user preferences through backend (not direct client access)

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

/**
 * PUT /api/profile/preferences
 * Update user preferences (voice settings, mock interview persona, etc.)
 */
export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { preferences } = body

    if (!preferences || typeof preferences !== 'object') {
      return badRequestResponse('Invalid preferences object')
    }

    // Get current preferences to merge with new ones
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error('[Profile Preferences Fetch Error]:', fetchError)
      return serverErrorResponse('Failed to fetch current preferences')
    }

    // Merge existing preferences with new ones
    const mergedPreferences = {
      ...(profile?.preferences || {}),
      ...preferences,
    }

    // Update preferences using service role (backend-only access)
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ preferences: mergedPreferences })
      .eq('id', user.id)
      .select('preferences')
      .single()

    if (error) {
      console.error('[Profile Preferences Update Error]:', error)
      return serverErrorResponse('Failed to update preferences')
    }

    return successResponse({ preferences: data.preferences })
  } catch (error) {
    console.error('[Profile Preferences API Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}

/**
 * GET /api/profile/preferences
 * Get user preferences
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('[Profile Preferences GET Error]:', error)
      return serverErrorResponse('Failed to fetch preferences')
    }

    return successResponse({ preferences: data?.preferences || {} })
  } catch (error) {
    console.error('[Profile Preferences API Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}
