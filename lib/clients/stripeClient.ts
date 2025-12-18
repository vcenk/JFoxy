// lib/clients/stripeClient.ts - Stripe client wrapper
import Stripe from 'stripe'
import { env } from '../config/env'

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: '2024-06-20',
  typescript: true,
})

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata,
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata,
    },
  })
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
