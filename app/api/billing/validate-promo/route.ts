// app/api/billing/validate-promo/route.ts
// Validate a promo code and return its details

import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { env } from '@/lib/config/env'
import { SUBSCRIPTION_TIERS } from '@/lib/config/constants'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

const stripe = new Stripe(env.stripe.secretKey)

// Map Stripe price IDs to tier names
const priceToTier: Record<string, string> = {
  [env.stripe.priceBasicMonthly]: SUBSCRIPTION_TIERS.BASIC,
  [env.stripe.priceBasicAnnual]: SUBSCRIPTION_TIERS.BASIC,
  [env.stripe.priceProMonthly]: SUBSCRIPTION_TIERS.PRO,
  [env.stripe.priceProAnnual]: SUBSCRIPTION_TIERS.PRO,
  [env.stripe.priceInterviewReadyMonthly]: SUBSCRIPTION_TIERS.INTERVIEW_READY,
  [env.stripe.priceInterviewReadyAnnual]: SUBSCRIPTION_TIERS.INTERVIEW_READY,
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return badRequestResponse('Promo code is required')
    }

    // Look up the promotion code
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
    })

    if (promotionCodes.data.length === 0) {
      return badRequestResponse('Invalid or expired promo code')
    }

    const promoCode = promotionCodes.data[0]
    const coupon = promoCode.coupon

    // Build discount description
    let discountText = ''
    if (coupon.percent_off) {
      discountText = `${coupon.percent_off}% off`
    } else if (coupon.amount_off) {
      discountText = `$${(coupon.amount_off / 100).toFixed(2)} off`
    }

    if (coupon.duration === 'once') {
      discountText += ' (first payment)'
    } else if (coupon.duration === 'repeating' && coupon.duration_in_months) {
      discountText += ` for ${coupon.duration_in_months} months`
    } else if (coupon.duration === 'forever') {
      discountText += ' forever'
    }

    // Check if coupon is restricted to specific products/prices
    let applicableTiers: string[] = []

    if (coupon.applies_to && coupon.applies_to.products && coupon.applies_to.products.length > 0) {
      // Coupon is restricted to specific products - need to get prices for those products
      const productIds = coupon.applies_to.products

      for (const productId of productIds) {
        // Get prices for this product
        const prices = await stripe.prices.list({
          product: productId,
          active: true,
          limit: 10,
        })

        for (const price of prices.data) {
          const tier = priceToTier[price.id]
          if (tier && !applicableTiers.includes(tier)) {
            applicableTiers.push(tier)
          }
        }
      }
    } else {
      // Coupon applies to all products
      applicableTiers = [
        SUBSCRIPTION_TIERS.BASIC,
        SUBSCRIPTION_TIERS.PRO,
        SUBSCRIPTION_TIERS.INTERVIEW_READY,
      ]
    }

    return successResponse({
      valid: true,
      promoCodeId: promoCode.id,
      code: promoCode.code,
      discount: discountText,
      percentOff: coupon.percent_off,
      amountOff: coupon.amount_off,
      applicableTiers, // Which tiers this coupon can be used for
    })

  } catch (error: any) {
    console.error('[Validate Promo Error]:', error)
    return serverErrorResponse('Failed to validate promo code')
  }
}
