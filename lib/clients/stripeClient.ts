// lib/clients/stripeClient.ts - Stripe client wrapper
import Stripe from 'stripe'
import { env } from '../config/env'

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

/**
 * Create a checkout session for subscription or one-time payment
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata,
  mode = 'subscription',
  promotionCodeId,
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  mode?: 'subscription' | 'payment'
  promotionCodeId?: string
}) {
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    mode,
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  }

  // If a promo code is provided, apply it; otherwise allow manual entry
  if (promotionCodeId) {
    sessionConfig.discounts = [{ promotion_code: promotionCodeId }]
  } else {
    sessionConfig.allow_promotion_codes = true
  }

  if (mode === 'subscription') {
    sessionConfig.subscription_data = { metadata }
  }

  return stripe.checkout.sessions.create(sessionConfig)
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateCustomer({
  email,
  userId,
}: {
  email: string
  userId: string
}) {
  // Try to find existing customer
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (customers.data.length > 0) {
    return customers.data[0]
  }

  // Create new customer
  return stripe.customers.create({
    email,
    metadata: {
      user_id: userId,
    },
  })
}
