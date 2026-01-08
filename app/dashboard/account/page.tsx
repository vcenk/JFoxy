'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/clients/supabaseBrowserClient'
import {
  User, CreditCard, Settings, Mic, Bell, Database,
  Save, Loader2, CheckCircle
} from 'lucide-react'
import { SimpleSwitch } from '@/components/ui/simple-switch'
import { IntegrationsTab } from '@/components/account/IntegrationsTab'

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

type Tab = 'profile' | 'subscription' | 'integrations' | 'settings' | 'billing'

interface UserPreferences {
  deepgram: {
    language: string
    gender: string
    style: string
  }
  mockInterview: {
    persona_id: string // voice_id from interviewerPersonas
    persona_name: string
  }
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  data_usage: {
    optimize_video: boolean
    auto_play_audio: boolean
  }
}

const DEFAULT_PREFS: UserPreferences = {
  deepgram: { language: 'en', gender: 'female', style: 'professional' },
  mockInterview: { persona_id: 'EXAVITQu4vr4xnSDxMaL', persona_name: 'Sarah Mitchell' }, // Default: Sarah Mitchell
  notifications: { email: true, push: true, marketing: false },
  data_usage: { optimize_video: false, auto_play_audio: true },
}

// ------------------------------------------------------------------
// Components
// ------------------------------------------------------------------

export default function AccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const { user, profile } = useAuthStore()
  
  // State for Preferences
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Initialize
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'subscription', 'integrations', 'settings', 'billing'].includes(tab)) {
      setActiveTab(tab as Tab)
    }

    if (profile?.preferences) {
      // Merge defaults with saved prefs
      setPrefs(prev => ({ ...prev, ...profile.preferences }))
    }
    setLoading(false)
  }, [searchParams, profile])

  // Save Handler
  const handleSave = async (newPrefs: Partial<UserPreferences>) => {
    setSaving(true)
    setSaveSuccess(false)
    try {
      const supabase = createClient()
      const updatedPrefs = { ...prefs, ...newPrefs }
      
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: updatedPrefs })
        .eq('id', user?.id)

      if (error) throw error

      setPrefs(updatedPrefs)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Render Logic
  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab profile={profile} user={user} />
      case 'subscription': return <SubscriptionTab profile={profile} />
      case 'billing': return <BillingTab profile={profile} />
      case 'integrations': return <IntegrationsTab prefs={prefs} onSave={handleSave} saving={saving} success={saveSuccess} profile={profile} />
      case 'settings': return <SettingsTab prefs={prefs} onSave={handleSave} saving={saving} success={saveSuccess} />
      default: return <ProfileTab profile={profile} user={user} />
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
          {[
            { id: 'profile', name: 'Profile', icon: User },
            { id: 'subscription', name: 'Plan & Credits', icon: CreditCard },
            { id: 'integrations', name: 'Integrations & AI', icon: Mic },
            { id: 'settings', name: 'App Settings', icon: Settings },
            { id: 'billing', name: 'Billing History', icon: Database }, // Moved billing history to bottom
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab)
                  router.push(`/dashboard/account?tab=${item.id}`, { scroll: false })
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[500px]">
          {loading ? (
             <div className="flex items-center justify-center h-full">
               <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
             </div>
          ) : (
             renderTab()
          )}
        </div>
      </div>
    </div>
  )
}

import { SUBSCRIPTION_TIERS, TIER_LIMITS, CREDIT_PACKS } from '@/lib/config/constants'
import { Sparkles, Zap, Video, Check } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

function SubscriptionTab({ profile }: { profile: any }) {
  const tier = profile?.subscription_tier || SUBSCRIPTION_TIERS.BASIC
  const limits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS[SUBSCRIPTION_TIERS.BASIC]
  
  const monthlyCredits = profile?.monthly_video_credits || 0
  const purchasedCredits = profile?.purchased_video_credits || 0
  
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  // Format tier name for display
  const tierDisplay = tier.charAt(0).toUpperCase() + tier.slice(1)
  const isPremium = tier === SUBSCRIPTION_TIERS.PREMIUM
  const isPro = tier === SUBSCRIPTION_TIERS.PRO

  const handlePurchase = async (itemId: string, isSubscription: boolean) => {
    setLoadingId(itemId)
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSubscription ? { planId: itemId, interval: billingInterval } : { packId: itemId }),
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      // Redirect to Stripe
      window.location.href = data.data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-xl relative overflow-hidden">
        {isPremium && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-500/20 to-transparent w-32 h-full" />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-white">{tierDisplay} Plan</h2>
              {isPremium && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30">PREMIUM</span>}
              {isPro && <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full border border-purple-500/30">PRO</span>}
            </div>
            <p className="text-gray-400 max-w-md">
              {tier === 'basic' ? 'Basic access to resume building and analysis.' : 
               tier === 'pro' ? 'Advanced tools for serious job seekers.' : 
               'Unlimited access with priority AI processing.'}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            {tier !== SUBSCRIPTION_TIERS.PREMIUM && (
              <div className="bg-gray-900/50 p-1 rounded-lg flex items-center border border-gray-600">
                <button 
                  type="button"
                  onClick={() => setBillingInterval('month')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${billingInterval === 'month' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  Monthly
                </button>
                <button 
                  type="button"
                  onClick={() => setBillingInterval('year')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${billingInterval === 'year' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  Yearly (-20%)
                </button>
              </div>
            )}

            {tier !== SUBSCRIPTION_TIERS.PREMIUM && (
              <button
                onClick={() => handlePurchase(tier === SUBSCRIPTION_TIERS.BASIC ? 'pro' : 'premium', true)}
                disabled={loadingId !== null}
                className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50 w-full justify-center"
              >
                {loadingId === 'pro' || loadingId === 'premium' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 fill-yellow-500 text-yellow-600" />
                )}
                Upgrade to {tier === SUBSCRIPTION_TIERS.BASIC ? 'Pro' : 'Premium'}
              </button>
            )}
          </div>
        </div>

        {/* Usage Meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-gray-700 pt-8">
          <UsageMeter 
            label="Resume Builds" 
            used={profile?.resume_builds_this_month || 0} 
            limit={limits.resumeBuilds} 
          />
          <UsageMeter 
            label="Job Analyses" 
            used={profile?.job_analyses_this_month || 0} 
            limit={limits.jobAnalyses} 
          />
          <UsageMeter 
            label="Audio Practice" 
            used={profile?.audio_practice_sessions_this_month || 0} 
            limit={limits.audioPractice} 
          />
        </div>
      </div>

      {/* Mock Interview Credits */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Video className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mock Interview Credits</h2>
            <p className="text-sm text-gray-400">Used for AI-powered voice interview practice sessions</p>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-700/50">
          <div>
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{monthlyCredits + purchasedCredits}</span>
              <span className="text-gray-500 font-medium">credits available</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {monthlyCredits} Monthly (Expires soon) • {purchasedCredits} Purchased (Never expires)
            </p>
          </div>
          
          <div className="text-right">
             <p className="text-sm text-gray-400 mb-1">Cost per session</p>
             <p className="text-white font-bold">5 Credits</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-4">Buy More Credits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors group relative">
              {pack.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}
              <h4 className="text-white font-bold text-lg mb-1">{pack.name}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-white">${pack.price}</span>
                <span className="text-gray-500">/ {pack.credits} credits</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-500" />
                  {pack.credits / 5} Interview Sessions
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-green-500" />
                  Never expires
                </li>
              </ul>
              <button
                onClick={() => handlePurchase(pack.id, false)}
                disabled={loadingId !== null}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg border border-white/10 transition-colors group-hover:bg-purple-600 group-hover:border-purple-600 disabled:opacity-50"
              >
                {loadingId === pack.id ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UsageMeter({ label, used, limit }: { label: string, used: number, limit: number }) {
  const isUnlimited = limit === Infinity
  const percentage = isUnlimited ? 0 : Math.min(100, (used / limit) * 100)
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className={isUnlimited ? 'text-green-400 font-bold' : 'text-gray-400'}>
          {isUnlimited ? 'Unlimited' : `${used} / ${limit}`}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${isUnlimited ? 'bg-green-500 w-full opacity-20' : 'bg-purple-500'}`}
          style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
        />
      </div>
    </div>
  )
}


// ------------------------------------------------------------------
// Sub-Components (Tabs)
// ------------------------------------------------------------------

function ProfileTab({ profile, user }: { profile: any, user: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  const updateProfile = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Details</h2>
        
        <div className="space-y-6 max-w-lg">
          {/* Avatar & Email */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
               {fullName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Email Address</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={updateProfile}
            disabled={saving}
            className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function BillingTab({ profile }: { profile: any }) {
  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Current Plan</h2>
        
        <div className="flex items-center justify-between p-6 bg-gray-900 rounded-xl border border-gray-700 mb-6">
           <div>
             <p className="text-gray-400 text-sm mb-1">Status</p>
             <p className={`text-xl font-bold ${isPro ? 'text-green-400' : 'text-gray-200'}`}>
               {isPro ? 'Pro Subscription' : 'Free Tier'}
             </p>
           </div>
           {isPro ? <CheckCircle className="w-8 h-8 text-green-500" /> : <CreditCard className="w-8 h-8 text-gray-500" />}
        </div>

        {!isPro && (
          <div className="bg-purple-900/20 border border-purple-800/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-2">Upgrade to Pro</h3>
            <p className="text-purple-200 mb-4 text-sm">Unlock unlimited mock interviews, advanced AI coaching, and premium voices.</p>
            <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20">
              View Plans
            </button>
          </div>
        )}

        <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
        <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-700 border-dashed">
          <p className="text-gray-500">No recent transactions found.</p>
        </div>
      </div>
    </div>
  )
}


function SettingsTab({ prefs, onSave, saving, success }: { prefs: UserPreferences, onSave: any, saving: boolean, success: boolean }) {
  const [localPrefs, setLocalPrefs] = useState(prefs)

  const handleToggle = (category: 'notifications' | 'data_usage', key: string) => {
    setLocalPrefs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        // @ts-ignore
        [key]: !prev[category][key]
      }
    }))
  }

  const handleSave = () => {
    onSave(localPrefs)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Notifications */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Bell className="w-6 h-6 text-yellow-500" /> Notifications
        </h2>
        
        <div className="space-y-6 divide-y divide-gray-700">
           <ToggleRow 
             label="Email Notifications" 
             desc="Receive session summaries and weekly progress reports."
             checked={localPrefs.notifications.email}
             onChange={() => handleToggle('notifications', 'email')}
           />
           <ToggleRow 
             label="Push Notifications" 
             desc="Get real-time alerts for practice reminders."
             checked={localPrefs.notifications.push}
             onChange={() => handleToggle('notifications', 'push')}
           />
        </div>
      </div>

      {/* Data Usage */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Database className="w-6 h-6 text-green-500" /> Data & Storage
        </h2>
        
        <div className="space-y-6 divide-y divide-gray-700">
           <ToggleRow 
             label="Optimize Video Quality" 
             desc="Reduce bandwidth usage by streaming lower resolution avatars."
             checked={localPrefs.data_usage.optimize_video}
             onChange={() => handleToggle('data_usage', 'optimize_video')}
           />
           <ToggleRow 
             label="Auto-Play Audio" 
             desc="Automatically play cached audio responses."
             checked={localPrefs.data_usage.auto_play_audio}
             onChange={() => handleToggle('data_usage', 'auto_play_audio')}
           />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg
            ${success ? 'bg-green-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-200'}
            ${saving ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {success ? (
            <>
              <CheckCircle className="w-5 h-5" /> Saved!
            </>
          ) : (
            <>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function ToggleRow({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
      <SimpleSwitch checked={checked} onChange={onChange} />
    </div>
  )
}
