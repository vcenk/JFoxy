// lib/utils/apiHelpers.ts
// Helper utilities for API routes

import { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Get authenticated user from request (for API routes)
 */
export async function getAuthUser(req: NextRequest): Promise<User | null> {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user
  } catch (error) {
    console.error('[Auth Error]:', error)
    return null
  }
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ error: message }, { status: 401 })
}

/**
 * Create bad request response
 */
export function badRequestResponse(message: string) {
  return Response.json({ error: message }, { status: 400 })
}

/**
 * Create server error response
 */
export function serverErrorResponse(message = 'Internal server error') {
  return Response.json({ error: message }, { status: 500 })
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  fields: string[]
): { valid: boolean; missing?: string[] } {
  const missing = fields.filter((field) => !body[field])

  if (missing.length > 0) {
    return { valid: false, missing }
  }

  return { valid: true }
}

/**
 * Check if user has pro subscription
 */
export async function checkProSubscription(userId: string): Promise<boolean> {
  try {
    const { supabase } = await import('@/lib/clients/supabaseClient')  // lib/clients/supabaseClient.ts

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single()

    return (
      profile?.subscription_status === 'active' ||
      profile?.subscription_status === 'trialing'
    )
  } catch (error) {
    console.error('[Pro Check Error]:', error)
    return false
  }
}

/**
 * Track API usage for billing limits
 */
export async function trackUsage({
  userId,
  resourceType,
  resourceCount = 1,
  sessionId,
  metadata,
}: {
  userId: string
  resourceType: string
  resourceCount?: number
  sessionId?: string
  metadata?: Record<string, any>
}) {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')  // lib/clients/supabaseClient.ts

    await supabaseAdmin.from('usage_tracking').insert({
      user_id: userId,
      resource_type: resourceType,
      resource_count: resourceCount,
      session_id: sessionId,
      metadata,
    })
  } catch (error) {
    console.error('[Usage Tracking Error]:', error)
    // Don't fail the request if usage tracking fails
  }
}

/**
 * Check if user has exceeded usage limits
 */
export async function checkUsageLimits(
  userId: string,
  resourceType: string
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const isPro = await checkProSubscription(userId)

    // Pro users have unlimited access
    if (isPro) {
      return { allowed: true }
    }

    // Check free tier limits
    const { supabase } = await import('@/lib/clients/supabaseClient')  // lib/clients/supabaseClient.ts

    const { data: profile } = await supabase
      .from('profiles')
      .select('practice_sessions_this_month, mock_interviews_this_month')
      .eq('id', userId)
      .single()

    if (!profile) {
      return { allowed: false, reason: 'Profile not found' }
    }

    // Define free tier limits
    const limits = {
      practice_session: 5,
      mock_interview: 1,
    }

    // Check specific limits
    if (resourceType === 'practice_session') {
      if (profile.practice_sessions_this_month >= limits.practice_session) {
        return {
          allowed: false,
          reason: 'Free tier limit reached. Upgrade to Pro for unlimited practice.',
        }
      }
    }

    if (resourceType === 'mock_interview') {
      if (profile.mock_interviews_this_month >= limits.mock_interview) {
        return {
          allowed: false,
          reason: 'Free tier limit reached. Upgrade to Pro for unlimited mock interviews.',
        }
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('[Usage Limit Check Error]:', error)
    // Allow on error to not block users
    return { allowed: true }
  }
}
