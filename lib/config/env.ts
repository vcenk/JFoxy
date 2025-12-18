// lib/config/env.ts - Environment configuration

export const env = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    modelMain: process.env.OPENAI_MODEL_MAIN || 'gpt-4-turbo-preview',
    modelHeavy: process.env.OPENAI_MODEL_HEAVY || 'gpt-4',
  },

  // Deepgram
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY || '',
    ttsModel: process.env.DEEPGRAM_TTS_MODEL || 'aura-asteria-en',
    sttModel: process.env.DEEPGRAM_STT_MODEL || 'nova-2',
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceProMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    priceProAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
    billingPortalReturnUrl: process.env.STRIPE_BILLING_PORTAL_RETURN_URL || '',
  },

  // App
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Job Foxy',
  },
}

// Validation helper
export function validateEnv() {
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': env.supabase.url,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': env.supabase.anonKey,
    'OPENAI_API_KEY': env.openai.apiKey,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`)
  }

  return missing.length === 0
}
