// app/api/billing/create-portal-session/route.ts
// Create Stripe customer portal session for managing subscription

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
    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return badRequestResponse('User profile not found')
    }

    if (!profile.stripe_customer_id) {
      return badRequestResponse('No billing account found. Please subscribe first.')
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${env.app.url}/account`,
    })

    return successResponse({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('[Create Portal Session Error]:', error)
    return serverErrorResponse('Failed to create portal session')
  }
}
