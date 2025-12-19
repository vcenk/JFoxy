// app/api/billing/webhook/route.ts
// Handle Stripe webhook events for subscription updates

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'  // stripe
import { env } from '@/lib/config/env'  // lib/config/env.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts

const stripe = new Stripe(env.stripe.secretKey)

const webhookSecret = env.stripe.webhookSecret

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('[Webhook] No signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('[Webhook] Signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('[Webhook] Event type:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancelled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Webhook Error]:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Handle checkout session completed
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id

  if (!userId) {
    console.error('[Webhook] No user ID in checkout session metadata')
    return
  }

  console.log('[Webhook] Checkout completed for user:', userId)

  // Update will happen when subscription.created event fires
}

// Handle subscription created or updated
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id

  if (!userId) {
    console.error('[Webhook] No user ID in subscription metadata')
    return
  }

  const status = subscription.status
  const subscriptionStatus = status === 'active' ? 'pro' : 'free'

  console.log('[Webhook] Updating subscription for user:', userId, 'to:', subscriptionStatus)

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: subscriptionStatus,
      stripe_subscription_id: subscription.id,
      subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', userId)
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id

  if (!userId) {
    console.error('[Webhook] No user ID in subscription metadata')
    return
  }

  console.log('[Webhook] Subscription cancelled for user:', userId)

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'free',
      subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', userId)

  // Reset monthly usage counters
  await supabaseAdmin
    .from('profiles')
    .update({
      ai_tokens_used_this_month: 0,
      practice_sessions_this_month: 0,
      mock_interviews_this_month: 0,
    })
    .eq('id', userId)
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.supabase_user_id

  if (!userId) {
    console.error('[Webhook] No user ID in invoice metadata')
    return
  }

  console.log('[Webhook] Payment succeeded for user:', userId)

  // Reset monthly usage counters on successful payment
  await supabaseAdmin
    .from('profiles')
    .update({
      ai_tokens_used_this_month: 0,
      practice_sessions_this_month: 0,
      mock_interviews_this_month: 0,
    })
    .eq('id', userId)
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.supabase_user_id

  if (!userId) {
    console.error('[Webhook] No user ID in invoice metadata')
    return
  }

  console.log('[Webhook] Payment failed for user:', userId)

  // Optionally: Send email notification or update profile with payment issue flag
}
