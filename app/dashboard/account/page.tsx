// app/dashboard/account/page.tsx
// Account settings - profile, billing, preferences

'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'  // store/authStore.ts
import { useSearchParams } from 'next/navigation'
import { User, CreditCard, Settings, Loader2, CheckCircle, ExternalLink } from 'lucide-react'

type Tab = 'profile' | 'billing' | 'preferences'

export default function AccountPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const { user, profile } = useAuthStore()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'billing') {
      setActiveTab('billing')
    }
  }, [searchParams])

  const tabs = [
    { id: 'profile' as Tab, name: 'Profile', icon: User },
    { id: 'billing' as Tab, name: 'Billing', icon: CreditCard },
    { id: 'preferences' as Tab, name: 'Preferences', icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'billing':
        return <BillingTab />
      case 'preferences':
        return <PreferencesTab />
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile, billing, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      {renderTabContent()}
    </div>
  )
}

function ProfileTab() {
  const { user, profile } = useAuthStore()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement profile update
      alert('Profile update will be implemented')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function BillingTab() {
  const { profile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const isPro = profile?.subscription_status === 'pro'

  const handleUpgrade = async (billingPeriod: 'monthly' | 'annual') => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billingPeriod }),
      })

      const data = await response.json()

      if (data.success && data.data.url) {
        window.location.href = data.data.url
      } else {
        alert('Error: ' + (data.error || 'Failed to create checkout session'))
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.success && data.data.url) {
        window.location.href = data.data.url
      } else {
        alert('Error: ' + (data.error || 'Failed to access billing portal'))
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error)
      alert('Failed to access billing portal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Current Plan</h2>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Subscription Status</p>
            <p className="text-2xl font-bold text-gray-900 capitalize mt-1">
              {profile?.subscription_status || 'Free'}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              isPro ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isPro ? 'Pro Member' : 'Free Plan'}
          </span>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    You have full access to all features
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-green-800">
                    <li>• Unlimited practice sessions</li>
                    <li>• Unlimited mock interviews</li>
                    <li>• Unlimited AI coaching</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Manage Billing</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            <p className="mb-4">Current limits:</p>
            <ul className="space-y-2">
              <li>• 5 practice sessions per month</li>
              <li>• 1 mock interview per month</li>
              <li>• 100k AI tokens per month</li>
            </ul>
          </div>
        )}
      </div>

      {/* Upgrade options */}
      {!isPro && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly plan */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Monthly</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$29</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Unlimited everything</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('monthly')}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Upgrade to Monthly'
              )}
            </button>
          </div>

          {/* Annual plan */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-purple-300 p-6 relative">
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              SAVE 30%
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Annual</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">$245</span>
              <span className="text-gray-600">/year</span>
              <p className="text-sm text-gray-500 mt-1">$20.42/month</p>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Unlimited everything</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Save $103/year</span>
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('annual')}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Upgrade to Annual'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PreferencesTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Preferences</h2>
      <p className="text-sm text-gray-500">Preference settings coming soon...</p>
    </div>
  )
}
