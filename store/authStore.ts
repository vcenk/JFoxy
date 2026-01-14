// store/authStore.ts - Authentication state management
import { create } from 'zustand'
import { createClient } from '@/lib/clients/supabaseBrowserClient'  // lib/clients/supabaseBrowserClient.ts
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null

  // Subscription (sensitive fields like stripe_customer_id excluded from client)
  subscription_status: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
  subscription_tier?: 'free' | 'basic' | 'pro' | 'interview_ready'
  subscription_current_period_end: string | null

  // Monthly usage tracking (reset each billing cycle)
  resume_builds_this_month?: number
  job_analyses_this_month?: number
  cover_letters_this_month?: number
  star_voice_sessions_used?: number
  mock_interview_minutes_used?: number

  // Purchased add-ons (never expire)
  purchased_star_sessions?: number
  purchased_mock_minutes?: number

  // User preferences
  preferences: Record<string, unknown> | null

  // Admin
  is_admin: boolean

  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),

  setProfile: (profile) => set({ profile }),

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ loading: false, error: error.message })
        return { error: error.message }
      }

      set({ user: data.user, loading: false })
      await get().fetchProfile()
      return { error: null }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during sign in'
      set({ loading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        set({ loading: false, error: error.message })
        return { error: error.message }
      }

      // OAuth redirects, so we don't need to set user here
      return { error: null }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during Google sign in'
      set({ loading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        set({ loading: false, error: error.message })
        return { error: error.message }
      }

      set({ user: data.user, loading: false })

      // Profile is created automatically by database trigger
      // Fetch it after a brief moment to ensure trigger has completed
      if (data.user) {
        // Wait briefly for the database trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Fetch the profile
        await get().fetchProfile()
      }

      return { error: null }
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred during sign up'
      set({ loading: false, error: errorMessage })
      return { error: errorMessage }
    }
  },

  signOut: async () => {
    set({ loading: true, error: null })

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        set({ loading: false, error: error.message })
        return
      }

      set({ user: null, profile: null, loading: false })
    } catch (error: any) {
      set({ loading: false, error: error?.message || 'An error occurred during sign out' })
    }
  },

  fetchProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const supabase = createClient()
      // Select specific columns - exclude sensitive fields (stripe_customer_id, subscription_price_id)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, email, full_name, avatar_url,
          subscription_status, subscription_tier, subscription_current_period_end,
          resume_builds_this_month, job_analyses_this_month, cover_letters_this_month,
          star_voice_sessions_used, mock_interview_minutes_used,
          purchased_star_sessions, purchased_mock_minutes,
          preferences, is_admin, created_at, updated_at
        `)
        .eq('id', user.id)
        .maybeSingle()  // Use maybeSingle() instead of single() to avoid errors when not found

      if (error) {
        // Only log actual errors, not "not found" cases
        if (error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }
        return
      }

      // If profile exists, set it
      if (data) {
        set({ profile: data })
      } else {
        console.log('Profile not found - may still be creating')
      }
    } catch (error: any) {
      console.error('Unexpected error fetching profile:', error)
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get()
    if (!user) return { error: 'No user logged in' }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      set({ profile: data })
      return { error: null }
    } catch (error: any) {
      return { error: error?.message || 'An error occurred updating profile' }
    }
  },

  initialize: async () => {
    set({ loading: true })

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        set({ user })
        await get().fetchProfile()
      }

      set({ loading: false })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },
}))
