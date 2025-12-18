// lib/clients/supabaseClient.ts - Supabase client wrapper
import { createClient } from '@supabase/supabase-js'
import { env } from '../config/env'

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey
)

// Server-side Supabase client (uses service role key - use carefully!)
export const supabaseAdmin = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Database types will be auto-generated from Supabase
export type Database = any // TODO: Generate types from Supabase
