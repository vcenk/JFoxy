// lib/utils/subscriptionLimits.ts
// Subscription limit management for new 4-tier pricing system

import { SUBSCRIPTION_TIERS, TIER_LIMITS } from '@/lib/config/constants'

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS]

export interface TierLimits {
  resumes: number
  jobAnalyses: number
  coverLetters: number
  coachingAccess: 'preview' | 'full'
  starVoiceSessions: number
  mockInterviewMinutes: number
  exports: boolean
  aiImprovements: boolean
  linkedinOptimizer: boolean
}

/**
 * Invalidate limits cache - no-op in new implementation
 * Kept for backward compatibility with admin routes
 */
export function invalidateLimitsCache() {
  console.log('[Subscription Limits] Cache invalidation called (no-op in new implementation)')
}

/**
 * Get limits for a specific subscription tier
 * Uses constants as the source of truth (no database dependency)
 */
export function getLimitsForTier(tier: SubscriptionTier): TierLimits {
  const limits = TIER_LIMITS[tier]

  if (!limits) {
    console.warn(`[Subscription Limits] Unknown tier: ${tier}, defaulting to FREE`)
    return TIER_LIMITS[SUBSCRIPTION_TIERS.FREE] as TierLimits
  }

  return limits as TierLimits
}

/**
 * Check if user has reached their limit for a specific resource
 */
export function hasReachedLimit(
  tier: SubscriptionTier,
  resourceType: keyof TierLimits,
  currentUsage: number
): boolean {
  const limits = getLimitsForTier(tier)
  const limit = limits[resourceType]

  // Handle special cases
  if (limit === Infinity) return false
  if (typeof limit === 'boolean') return false
  if (typeof limit === 'string') return false

  return currentUsage >= limit
}

/**
 * Get remaining allowance for a resource
 */
export function getRemainingAllowance(
  tier: SubscriptionTier,
  resourceType: 'resumes' | 'jobAnalyses' | 'coverLetters' | 'starVoiceSessions' | 'mockInterviewMinutes',
  currentUsage: number
): number {
  const limits = getLimitsForTier(tier)
  const limit = limits[resourceType]

  if (limit === Infinity) return Infinity

  return Math.max(0, limit - currentUsage)
}

/**
 * Check if tier has access to a feature
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: 'aiImprovements' | 'exports' | 'starVoiceSessions' | 'mockInterviewMinutes' | 'linkedinOptimizer'
): boolean {
  const limits = getLimitsForTier(tier)

  switch (feature) {
    case 'aiImprovements':
      return limits.aiImprovements
    case 'exports':
      return limits.exports
    case 'starVoiceSessions':
      return limits.starVoiceSessions > 0
    case 'mockInterviewMinutes':
      return limits.mockInterviewMinutes > 0
    case 'linkedinOptimizer':
      return limits.linkedinOptimizer
    default:
      return false
  }
}

/**
 * Check if tier has full coaching access
 */
export function hasFullCoachingAccess(tier: SubscriptionTier): boolean {
  const limits = getLimitsForTier(tier)
  return limits.coachingAccess === 'full'
}

/**
 * Get tier upgrade suggestion based on what limit was hit
 */
export function getUpgradeSuggestion(
  currentTier: SubscriptionTier,
  limitReached: keyof TierLimits
): SubscriptionTier | null {
  // Already at highest tier
  if (currentTier === SUBSCRIPTION_TIERS.INTERVIEW_READY) {
    return null
  }

  switch (limitReached) {
    case 'resumes':
    case 'jobAnalyses':
    case 'coverLetters':
    case 'aiImprovements':
      // Basic tier solves these
      if (currentTier === SUBSCRIPTION_TIERS.FREE) {
        return SUBSCRIPTION_TIERS.BASIC
      }
      return null

    case 'starVoiceSessions':
      // Pro tier or higher needed
      if (currentTier === SUBSCRIPTION_TIERS.FREE || currentTier === SUBSCRIPTION_TIERS.BASIC) {
        return SUBSCRIPTION_TIERS.PRO
      }
      // Interview Ready has more sessions
      if (currentTier === SUBSCRIPTION_TIERS.PRO) {
        return SUBSCRIPTION_TIERS.INTERVIEW_READY
      }
      return null

    case 'mockInterviewMinutes':
      // Only Interview Ready tier has mock interviews
      // If we get here, currentTier is not INTERVIEW_READY (checked above)
      return SUBSCRIPTION_TIERS.INTERVIEW_READY

    default:
      return null
  }
}
