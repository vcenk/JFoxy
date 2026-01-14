// lib/utils/apiHelpers.ts
// Helper utilities for API routes

import { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { SUBSCRIPTION_TIERS, TIER_LIMITS } from '@/lib/config/constants'
import { getLimitsForTier, type SubscriptionTier } from '@/lib/utils/subscriptionLimits'


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
  const missing = fields.filter((field) => {
    const val = body[field]
    return val === undefined || val === null || val === ''
  })

  if (missing.length > 0) {
    return { valid: false, missing }
  }

  return { valid: true }
}

/**
 * Check user's subscription tier
 */
export async function checkSubscriptionTier(userId: string): Promise<SubscriptionTier> {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      console.error('[Tier Check Error]:', error?.message || 'Profile not found')
      return SUBSCRIPTION_TIERS.FREE // Default to free on error
    }

    return (profile.subscription_tier || SUBSCRIPTION_TIERS.FREE) as SubscriptionTier
  } catch (error) {
    console.error('[Tier Check Error]:', error)
    return SUBSCRIPTION_TIERS.FREE // Default to free on error
  }
}

/**
 * Increment a usage counter for a user
 */
export async function incrementUsage(
  userId: string,
  counterName: 'resume_builds_this_month' | 'job_analyses_this_month' | 'cover_letters_this_month' | 'star_voice_sessions_used' | 'mock_interview_minutes_used',
  incrementBy: number = 1
) {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')

    // Use RPC if increment is 1, otherwise do a fetch-update
    if (incrementBy === 1) {
      const { error } = await supabaseAdmin.rpc('increment_profile_counter', {
        user_id: userId,
        counter_name: counterName
      })

      if (error) {
        console.error(`[Increment Usage Error for ${counterName}]:`, error);
      }
    } else {
      // For multi-increment (like minutes), do a fetch-update
      const { data } = await supabaseAdmin
        .from('profiles')
        .select(counterName)
        .eq('id', userId)
        .single()

      const currentValue = (data as any)?.[counterName] || 0

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ [counterName]: currentValue + incrementBy })
        .eq('id', userId)

      if (error) {
        console.error(`[Increment Usage Error for ${counterName}]:`, error);
      }
    }
  } catch (error) {
    console.error(`[Increment Usage Error for ${counterName}]:`, error);
  }
}


/**
 * Track usage of a resource for analytics and billing
 */
export async function trackUsage(params: {
  userId: string;
  resourceType: string;
  resourceCount?: number;
  estimatedCostCents?: number;
  sessionId?: string;
  metadata?: any;
}) {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient');
    const {
      userId,
      resourceType,
      resourceCount = 1,
      estimatedCostCents = 0,
      sessionId,
      metadata
    } = params;

    const { error } = await supabaseAdmin
      .from('usage_tracking')
      .insert({
        user_id: userId,
        resource_type: resourceType,
        resource_count: resourceCount,
        estimated_cost_cents: estimatedCostCents,
        session_id: sessionId,
        metadata: metadata
      });

    if (error) {
      console.error('[Track Usage Error]: Failed to insert usage record', error);
    }
  } catch (error) {
    console.error('[Track Usage Error]:', error);
  }
}

/**
 * Check if user has exceeded usage limits for a specific resource type
 */
export async function checkUsageLimits(
  userId: string,
  resourceType: 'resume' | 'job_analysis' | 'cover_letter' | 'star_voice_session' | 'mock_interview_minutes',
  requestedAmount: number = 1
): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        is_admin,
        subscription_tier,
        resume_builds_this_month,
        job_analyses_this_month,
        cover_letters_this_month,
        star_voice_sessions_used,
        mock_interview_minutes_used,
        purchased_star_sessions,
        purchased_mock_minutes
      `)
      .eq('id', userId)
      .single()

    if (error || !profile) {
      console.error('[Usage Limit Check Error]: Profile not found or error fetching', error);
      return { allowed: false, reason: 'Profile not found. Please log in again.' };
    }

    // Bypass all limits for admin users
    if (profile.is_admin) {
      return { allowed: true };
    }

    const userTier = (profile.subscription_tier || SUBSCRIPTION_TIERS.FREE) as SubscriptionTier
    const limits = getLimitsForTier(userTier)

    switch (resourceType) {
      case 'resume': {
        const used = profile.resume_builds_this_month || 0
        const limit = limits.resumes
        if (limit === Infinity) return { allowed: true, remaining: Infinity }
        if (used >= limit) {
          return {
            allowed: false,
            reason: `Resume limit (${limit}) reached. ${userTier === SUBSCRIPTION_TIERS.FREE ? 'Upgrade to Basic for 5 resumes.' : ''}`,
            remaining: 0
          }
        }
        return { allowed: true, remaining: limit - used }
      }

      case 'job_analysis': {
        const used = profile.job_analyses_this_month || 0
        const limit = limits.jobAnalyses
        if (limit === Infinity) return { allowed: true, remaining: Infinity }
        if (used >= limit) {
          return {
            allowed: false,
            reason: `Job analysis limit (${limit}) reached. Upgrade to Basic for unlimited analyses.`,
            remaining: 0
          }
        }
        return { allowed: true, remaining: limit - used }
      }

      case 'cover_letter': {
        const used = profile.cover_letters_this_month || 0
        const limit = limits.coverLetters
        if (limit === Infinity) return { allowed: true, remaining: Infinity }
        if (used >= limit) {
          return {
            allowed: false,
            reason: `Cover letter limit (${limit}) reached. Upgrade to Basic for unlimited cover letters.`,
            remaining: 0
          }
        }
        return { allowed: true, remaining: limit - used }
      }

      case 'star_voice_session': {
        // STAR voice sessions: monthly allocation + purchased add-ons
        const monthlyUsed = profile.star_voice_sessions_used || 0
        const monthlyLimit = limits.starVoiceSessions
        const purchasedSessions = profile.purchased_star_sessions || 0

        // Total available = monthly remaining + purchased
        const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed)
        const totalAvailable = monthlyRemaining + purchasedSessions

        if (totalAvailable < requestedAmount) {
          if (userTier === SUBSCRIPTION_TIERS.FREE || userTier === SUBSCRIPTION_TIERS.BASIC) {
            return {
              allowed: false,
              reason: 'STAR Voice Practice requires Pro or Interview Ready subscription.',
              remaining: 0
            }
          }
          return {
            allowed: false,
            reason: `Not enough STAR voice sessions. You have ${totalAvailable} remaining. Purchase more sessions or wait for monthly reset.`,
            remaining: totalAvailable
          }
        }
        return { allowed: true, remaining: totalAvailable - requestedAmount }
      }

      case 'mock_interview_minutes': {
        // Mock interview minutes: monthly allocation + purchased add-ons
        const monthlyUsed = profile.mock_interview_minutes_used || 0
        const monthlyLimit = limits.mockInterviewMinutes
        const purchasedMinutes = profile.purchased_mock_minutes || 0

        // Total available = monthly remaining + purchased
        const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed)
        const totalAvailable = monthlyRemaining + purchasedMinutes

        if (totalAvailable < requestedAmount) {
          if (userTier !== SUBSCRIPTION_TIERS.INTERVIEW_READY) {
            return {
              allowed: false,
              reason: 'Mock interviews require Interview Ready subscription.',
              remaining: 0
            }
          }
          return {
            allowed: false,
            reason: `Not enough mock interview minutes. You have ${totalAvailable} remaining. Purchase more minutes or wait for monthly reset.`,
            remaining: totalAvailable
          }
        }
        return { allowed: true, remaining: totalAvailable - requestedAmount }
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('[Usage Limit Check Error]:', error);
    return { allowed: false, reason: 'An unexpected error occurred while checking limits.' };
  }
}

/**
 * Consume STAR voice sessions (prioritize monthly, then purchased)
 */
export async function consumeStarSession(userId: string, count: number = 1): Promise<{ success: boolean; reason?: string }> {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')

    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin, subscription_tier, star_voice_sessions_used, purchased_star_sessions')
      .eq('id', userId)
      .single()

    if (fetchError || !profile) {
      return { success: false, reason: 'Failed to retrieve profile.' }
    }

    if (profile.is_admin) {
      return { success: true }
    }

    const userTier = (profile.subscription_tier || SUBSCRIPTION_TIERS.FREE) as SubscriptionTier
    const limits = getLimitsForTier(userTier)

    const monthlyUsed = profile.star_voice_sessions_used || 0
    const monthlyLimit = limits.starVoiceSessions
    const purchasedSessions = profile.purchased_star_sessions || 0

    const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed)

    let updates: Record<string, number> = {}

    // Consume from monthly first
    if (monthlyRemaining >= count) {
      updates.star_voice_sessions_used = monthlyUsed + count
    } else if (monthlyRemaining > 0) {
      // Partial from monthly, rest from purchased
      updates.star_voice_sessions_used = monthlyLimit
      const fromPurchased = count - monthlyRemaining
      if (purchasedSessions < fromPurchased) {
        return { success: false, reason: 'Insufficient STAR sessions available.' }
      }
      updates.purchased_star_sessions = purchasedSessions - fromPurchased
    } else {
      // All from purchased
      if (purchasedSessions < count) {
        return { success: false, reason: 'Insufficient STAR sessions available.' }
      }
      updates.purchased_star_sessions = purchasedSessions - count
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (updateError) {
      return { success: false, reason: 'Failed to update session count.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[Consume STAR Session Error]:', error)
    return { success: false, reason: 'An unexpected error occurred.' }
  }
}

/**
 * Consume mock interview minutes (prioritize monthly, then purchased)
 */
export async function consumeMockMinutes(userId: string, minutes: number): Promise<{ success: boolean; reason?: string }> {
  try {
    const { supabaseAdmin } = await import('@/lib/clients/supabaseClient')

    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin, subscription_tier, mock_interview_minutes_used, purchased_mock_minutes')
      .eq('id', userId)
      .single()

    if (fetchError || !profile) {
      return { success: false, reason: 'Failed to retrieve profile.' }
    }

    if (profile.is_admin) {
      return { success: true }
    }

    const userTier = (profile.subscription_tier || SUBSCRIPTION_TIERS.FREE) as SubscriptionTier
    const limits = getLimitsForTier(userTier)

    const monthlyUsed = profile.mock_interview_minutes_used || 0
    const monthlyLimit = limits.mockInterviewMinutes
    const purchasedMinutes = profile.purchased_mock_minutes || 0

    const monthlyRemaining = Math.max(0, monthlyLimit - monthlyUsed)

    let updates: Record<string, number> = {}

    // Consume from monthly first
    if (monthlyRemaining >= minutes) {
      updates.mock_interview_minutes_used = monthlyUsed + minutes
    } else if (monthlyRemaining > 0) {
      // Partial from monthly, rest from purchased
      updates.mock_interview_minutes_used = monthlyLimit
      const fromPurchased = minutes - monthlyRemaining
      if (purchasedMinutes < fromPurchased) {
        return { success: false, reason: 'Insufficient mock interview minutes available.' }
      }
      updates.purchased_mock_minutes = purchasedMinutes - fromPurchased
    } else {
      // All from purchased
      if (purchasedMinutes < minutes) {
        return { success: false, reason: 'Insufficient mock interview minutes available.' }
      }
      updates.purchased_mock_minutes = purchasedMinutes - minutes
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (updateError) {
      return { success: false, reason: 'Failed to update minutes.' }
    }

    return { success: true }
  } catch (error) {
    console.error('[Consume Mock Minutes Error]:', error)
    return { success: false, reason: 'An unexpected error occurred.' }
  }
}
