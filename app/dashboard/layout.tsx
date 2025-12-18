// app/dashboard/layout.tsx
// Dashboard layout with Floating Glossy Dock (VisionOS aesthetic)

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { FileText, MessageSquare, User, Home, LogOut, Mic } from 'lucide-react'
import JobFoxyLogo from '@/components/assets/JobFoxy_Logo.png'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut, initialize } = useAuthStore()
  const [loading, setLoading] = useState(true)

  // 1. ADDED: Check if we are inside the Resume Builder
  const isResumePage = pathname?.startsWith('/dashboard/resume')

  useEffect(() => {
    initialize().finally(() => setLoading(false))
  }, [initialize])

  useEffect(() => {
    // Apply dashboard theme to body
    document.body.classList.add('dashboard-theme')
    return () => {
      document.body.classList.remove('dashboard-theme')
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  // Floating Dock Navigation
  const dockItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Resume', href: '/dashboard/resume', icon: FileText },
    { name: 'Practice', href: '/dashboard/practice', icon: Mic },
    { name: 'Coaching', href: '/dashboard/coaching', icon: MessageSquare },
    { name: 'Account', href: '/dashboard/account', icon: User },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80 text-sm">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Top Bar - Glass Effect with Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 px-8 py-4">
        {/* 2. UPDATED: Conditional max-width based on isResumePage */}
        <div className={`glass-panel mx-auto px-6 py-3 transition-all duration-300 ${
          isResumePage ? 'max-w-[80%]' : 'max-w-7xl'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12">
                <Image 
                  src={JobFoxyLogo} 
                  alt="Job Foxy" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Job Foxy
              </span>
            </Link>

            {/* Navigation Items */}
            <nav className="flex items-center space-x-1">
              {dockItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                               (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative group flex items-center space-x-2 px-4 py-2 rounded-xl
                      transition-all duration-200
                      ${isActive
                        ? 'bg-white/20 text-white shadow-lg shadow-purple-500/20'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.name}</span>

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side - User Actions */}
            <div className="flex items-center space-x-3">
              {/* Upgrade Button for Free Users */}
              {profile?.subscription_status === 'free' && (
                <Link
                  href="/dashboard/account?tab=billing"
                  className="
                    flex items-center justify-center px-5 py-2 rounded-xl
                    glow-button text-white font-semibold text-sm
                    hover:scale-105 transition-all duration-200
                  "
                >
                  Upgrade
                </Link>
              )}

              {/* Subscription Badge */}
              {profile && (
                <div className="glass-panel px-4 py-2">
                  <span className={`text-sm font-semibold ${
                    profile.subscription_status === 'active' || profile.subscription_status === 'trialing'
                      ? 'text-purple-300'
                      : 'text-white/70'
                  }`}>
                    {profile.subscription_status === 'active' || profile.subscription_status === 'trialing' ? '✨ Pro' : 'Free'}
                  </span>
                </div>
              )}

              {/* User Avatar */}
              <div className="glass-panel p-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="glass-panel p-3 hover:bg-red-500/20 transition-all group"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-white/70 group-hover:text-red-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* 3. UPDATED: Conditional max-width and padding based on isResumePage */}
      <main className={`pt-32 mx-auto transition-all duration-300 ${
        isResumePage ? 'max-w-[90%] px-4' : 'max-w-7xl px-8'
      }`}>
        {children}
      </main>
    </div>
  )
}