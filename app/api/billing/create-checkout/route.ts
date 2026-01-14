import { NextRequest } from 'next/server'
import { getAuthUser, unauthorizedResponse, badRequestResponse, serverErrorResponse, successResponse } from '@/lib/utils/apiHelpers'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/clients/stripeClient'
import { SUBSCRIPTION_TIERS, ADDON_PACKS } from '@/lib/config/constants'
import { env } from '@/lib/config/env'

// Map internal tier IDs to Stripe Price IDs
const getSubscriptionPriceId = (tier: string, interval: 'month' | 'year'): string | undefined => {
  const prices: Record<string, Record<string, string>> = {
    month: {
      [SUBSCRIPTION_TIERS.BASIC]: env.stripe.priceBasicMonthly,
      [SUBSCRIPTION_TIERS.PRO]: env.stripe.priceProMonthly,
      [SUBSCRIPTION_TIERS.INTERVIEW_READY]: env.stripe.priceInterviewReadyMonthly,
    },
    year: {
      [SUBSCRIPTION_TIERS.BASIC]: env.stripe.priceBasicAnnual,
      [SUBSCRIPTION_TIERS.PRO]: env.stripe.priceProAnnual,
      [SUBSCRIPTION_TIERS.INTERVIEW_READY]: env.stripe.priceInterviewReadyAnnual,
    },
  }

  return prices[interval]?.[tier]
}

// Map add-on pack IDs to Stripe Price IDs
const getAddonPriceId = (packId: string): string | undefined => {
  const addonPrices: Record<string, string> = {
    'mock_15': env.stripe.priceAddonMock15,
    'mock_30': env.stripe.priceAddonMock30,
    'star_5': env.stripe.priceAddonStar5,
  }

  return addonPrices[packId]
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return unauthorizedResponse()

    const body = await req.json()
    const { planId, packId, interval = 'month' } = body // interval: 'month' | 'year'

    if (!planId && !packId) {
      return badRequestResponse('Missing planId or packId')
    }

    let priceId: string | undefined
    let mode: 'subscription' | 'payment' = 'subscription'

    if (planId) {
      // Subscription checkout
      priceId = getSubscriptionPriceId(planId, interval)
      mode = 'subscription'
    } else if (packId) {
      // Add-on pack purchase (one-time payment)
      // Validate that the pack exists
      const pack = ADDON_PACKS.find(p => p.id === packId)
      if (!pack) {
        return badRequestResponse('Invalid add-on pack ID')
      }
      priceId = getAddonPriceId(packId)
      mode = 'payment'
    }

    if (!priceId) {
      return badRequestResponse('Invalid plan/pack ID or Stripe price not configured')
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer({
      email: user.email!,
      userId: user.id,
    })

    // Create metadata for webhook processing
    const metadata = {
      userId: user.id,
      type: mode,
      itemId: planId || packId,
      interval: planId ? interval : undefined
    }

    // Create Checkout Session
    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl: `${env.app.url}/dashboard/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${env.app.url}/dashboard/account?canceled=true`,
      metadata,
      mode,
    })

    return successResponse({ url: session.url })

  } catch (error: any) {
    console.error('[Create Checkout Error]:', error)
    return serverErrorResponse(error.message)
  }
}
