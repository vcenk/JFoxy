// lib/config/env.ts - Environment configuration

// Use getters to ensure environment variables are read at runtime, not at module load time
export const env = {
  // Supabase
  supabase: {
    get url() { return process.env.NEXT_PUBLIC_SUPABASE_URL || '' },
    get anonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
    get serviceRoleKey() { return process.env.SUPABASE_SERVICE_ROLE_KEY || '' },
  },

  // OpenAI
  openai: {
    get apiKey() { return process.env.OPENAI_API_KEY || '' },
    get modelMain() { return process.env.OPENAI_MODEL_MAIN || 'gpt-4o-mini' },
    get modelHeavy() { return process.env.OPENAI_MODEL_HEAVY || 'gpt-4o' },
  },

  // Deepgram
  deepgram: {
    get apiKey() { return process.env.DEEPGRAM_API_KEY || '' },
    get ttsModel() { return process.env.DEEPGRAM_TTS_MODEL || 'aura-asteria-en' },
    get sttModel() { return process.env.DEEPGRAM_STT_MODEL || 'nova-2' },
  },

  // Stripe
  stripe: {
    get secretKey() { return process.env.STRIPE_SECRET_KEY || '' },
    get webhookSecret() { return process.env.STRIPE_WEBHOOK_SECRET || '' },
    get priceProMonthly() { return process.env.STRIPE_PRICE_PRO_MONTHLY || '' },
    get priceProAnnual() { return process.env.STRIPE_PRICE_PRO_ANNUAL || '' },
    get billingPortalReturnUrl() { return process.env.STRIPE_BILLING_PORTAL_RETURN_URL || '' },
  },

  // App
  app: {
    get url() { return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
    get name() { return process.env.NEXT_PUBLIC_APP_NAME || 'Job Foxy' },
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
