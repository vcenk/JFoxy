// app/api/billing/create-checkout-session/route.ts
// Create Stripe checkout session for Pro subscription

import { NextRequest } from 'next/server'
import Stripe from 'stripe'  // stripe
import { env } from '@/lib/config/env'  // lib/config/env.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, ['billingPeriod'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { billingPeriod } = body // 'monthly' or 'annual'

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return badRequestResponse('User profile not found')
    }

    // Check if already subscribed
    if (profile.subscription_status === 'pro') {
      return badRequestResponse('User already has an active Pro subscription')
    }

    // Determine price ID based on billing period
    const priceId =
      billingPeriod === 'annual'
        ? env.stripe.priceProAnnual
        : env.stripe.priceProMonthly

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to profile
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${env.app.url}/dashboard?subscription=success`,
      cancel_url: `${env.app.url}/dashboard?subscription=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        billing_period: billingPeriod,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
    })

    return successResponse({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('[Create Checkout Session Error]:', error)
    return serverErrorResponse('Failed to create checkout session')
  }
}
