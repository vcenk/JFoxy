// lib/clients/supabaseBrowserClient.ts - Browser-safe Supabase client
import { createBrowserClient } from '@supabase/ssr'
import { env } from '../config/env'

/**
 * Create a Supabase client for client components
 * Use this in Client Components with 'use client' directive
 */
export function createClient() {
  return createBrowserClient(
    env.supabase.url,
    env.supabase.anonKey
  )
}

// Export a singleton instance for convenience
let client: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!client) {
    client = createClient()
  }
  return client
}
