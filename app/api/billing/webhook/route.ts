// app/api/billing/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { env } from '@/lib/config/env'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { ADDON_PACKS, SUBSCRIPTION_TIERS } from '@/lib/config/constants'

const stripe = new Stripe(env.stripe.secretKey)
const webhookSecret = env.stripe.webhookSecret

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[Webhook Error]:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const type = session.metadata?.type
  const itemId = session.metadata?.itemId

  if (!userId) return

  if (type === 'payment' && itemId) {
    // Add-on Pack Purchase
    const pack = ADDON_PACKS.find(p => p.id === itemId)
    if (pack) {
      // Determine what to add based on pack type
      if (pack.type === 'mock_minutes' && 'minutes' in pack) {
        // Mock interview minutes add-on
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('purchased_mock_minutes')
          .eq('id', userId)
          .single()

        const current = data?.purchased_mock_minutes || 0
        await supabaseAdmin.from('profiles').update({
          purchased_mock_minutes: current + pack.minutes
        }).eq('id', userId)

        // Log purchase
        await supabaseAdmin.from('usage_tracking').insert({
          user_id: userId,
          resource_type: 'addon_purchase',
          resource_count: pack.minutes,
          estimated_cost_cents: pack.price * 100,
          metadata: { pack_id: pack.id, pack_type: 'mock_minutes', session_id: session.id }
        })
      } else if (pack.type === 'star_sessions' && 'sessions' in pack) {
        // STAR voice sessions add-on
        const { data } = await supabaseAdmin
          .from('profiles')
          .select('purchased_star_sessions')
          .eq('id', userId)
          .single()

        const current = data?.purchased_star_sessions || 0
        await supabaseAdmin.from('profiles').update({
          purchased_star_sessions: current + pack.sessions
        }).eq('id', userId)

        // Log purchase
        await supabaseAdmin.from('usage_tracking').insert({
          user_id: userId,
          resource_type: 'addon_purchase',
          resource_count: pack.sessions,
          estimated_cost_cents: pack.price * 100,
          metadata: { pack_id: pack.id, pack_type: 'star_sessions', session_id: session.id }
        })
      }
    }
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) {
    // Try to find user by customer ID if metadata is missing
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    if (!profile) return
  }

  const priceId = subscription.items.data[0].price.id
  let tier: typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS] = SUBSCRIPTION_TIERS.FREE

  // Map Price ID to Tier (check both monthly and annual prices)
  const basicPrices = [process.env.STRIPE_PRICE_BASIC_MONTHLY, process.env.STRIPE_PRICE_BASIC_ANNUAL]
  const proPrices = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_ANNUAL]
  const interviewReadyPrices = [process.env.STRIPE_PRICE_INTERVIEW_READY_MONTHLY, process.env.STRIPE_PRICE_INTERVIEW_READY_ANNUAL]

  if (interviewReadyPrices.includes(priceId)) tier = SUBSCRIPTION_TIERS.INTERVIEW_READY
  else if (proPrices.includes(priceId)) tier = SUBSCRIPTION_TIERS.PRO
  else if (basicPrices.includes(priceId)) tier = SUBSCRIPTION_TIERS.BASIC

  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

  await supabaseAdmin.from('profiles').update({
    subscription_status: subscription.status,
    subscription_tier: tier,
    subscription_price_id: priceId,
    subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
  }).eq(userId ? 'id' : 'stripe_customer_id', userId || customerId)
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // We need to find the user by stripe_customer_id if metadata isn't present
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id

  await supabaseAdmin.from('profiles').update({
    subscription_status: 'canceled',
    subscription_tier: SUBSCRIPTION_TIERS.FREE, // Revert to free tier
    subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
  }).eq('stripe_customer_id', customerId)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Reset monthly allowances on successful billing cycle payment
  if (invoice.billing_reason === 'subscription_cycle') {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const priceId = subscription.items.data[0].price.id
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

    // Determine tier from price ID
    const interviewReadyPrices = [process.env.STRIPE_PRICE_INTERVIEW_READY_MONTHLY, process.env.STRIPE_PRICE_INTERVIEW_READY_ANNUAL]
    const proPrices = [process.env.STRIPE_PRICE_PRO_MONTHLY, process.env.STRIPE_PRICE_PRO_ANNUAL]

    // Base reset for all paid tiers (Basic and above)
    const baseReset = {
      resume_builds_this_month: 0,
      job_analyses_this_month: 0,
      cover_letters_this_month: 0,
    }

    if (interviewReadyPrices.includes(priceId)) {
      // Interview Ready: Reset all including mock interview minutes and STAR voice sessions
      await supabaseAdmin.from('profiles').update({
        ...baseReset,
        mock_interview_minutes_used: 0,
        star_voice_sessions_used: 0,
      }).eq('stripe_customer_id', customerId)
    } else if (proPrices.includes(priceId)) {
      // Pro: Reset including STAR voice sessions (no mock interview minutes)
      await supabaseAdmin.from('profiles').update({
        ...baseReset,
        star_voice_sessions_used: 0,
      }).eq('stripe_customer_id', customerId)
    } else {
      // Basic: Reset base counters only
      await supabaseAdmin.from('profiles').update(baseReset).eq('stripe_customer_id', customerId)
    }
  }
}