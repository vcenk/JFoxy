// app/dashboard/layout.tsx
// Dashboard layout with Collapsible Sidebar (VisionOS aesthetic)

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  FileText, MessageSquare, User, Home, LogOut,
  Mic, Video, ChevronLeft, ChevronRight
} from 'lucide-react'
import JobFoxyLogo from '@/components/assets/JobFoxyDark.svg'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut, initialize } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if we are inside specific pages for conditional styling
  const isResumePage = pathname?.startsWith('/dashboard/resume')
  const isPracticePage = pathname?.startsWith('/dashboard/practice')
  const isCoachingPage = pathname?.startsWith('/dashboard/coaching')

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

  // Navigation Items
  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Resume', href: '/dashboard/resume', icon: FileText },
    { name: 'Coaching', href: '/dashboard/coaching', icon: MessageSquare },
    { name: 'Practice', href: '/dashboard/practice', icon: Mic },
    { name: 'Mock Interview', href: '/dashboard/mock', icon: Video },
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
    <div className="min-h-screen relative flex bg-[#0f172a] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          relative z-50 flex flex-col h-screen transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          border-r border-white/10 bg-black/20 backdrop-blur-xl
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 z-50 p-1 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Logo Area */}
        <div className={`flex items-center justify-center h-32 p-2 transition-all duration-300`}>
          <div className={`relative transition-all duration-300 ${isCollapsed ? 'w-14 h-14' : 'w-56 h-28'}`}>
             <Image
                src={JobFoxyLogo}
                alt="Job Foxy"
                fill
                priority
                className="object-contain"
              />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center p-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-purple-600/20 text-purple-200 shadow-[0_0_20px_rgba(108,71,255,0.3)] border border-purple-500/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white hover:pl-4'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-300' : ''}`} />
                
                {!isCollapsed && (
                  <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
                )}
                
                {/* Active Indicator (Left Bar) */}
                {isActive && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile / Bottom Actions */}
        <div className="p-4 border-t border-white/10 bg-black/20">
            {profile && !isCollapsed && (
                <div className="mb-4 px-2 py-2 rounded-lg bg-white/5 border border-white/5">
                   <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white/80">Plan</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        profile.subscription_status === 'active' || profile.subscription_status === 'trialing' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-500/20 text-gray-400'
                      }`}>
                         {profile.subscription_status === 'active' || profile.subscription_status === 'trialing' ? 'PRO' : 'FREE'}
                      </span>
                   </div>
                   {profile.subscription_status === 'free' && (
                     <Link href="/dashboard/account?tab=billing" className="mt-2 block w-full text-center py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white hover:opacity-90 transition-opacity">
                        Upgrade
                     </Link>
                   )}
                </div>
            )}
            
            <button
                onClick={handleSignOut}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-2 rounded-lg text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-colors`}
            >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
         className={`
            flex-1 relative overflow-y-auto h-screen
            transition-all duration-300
            ${isResumePage || isPracticePage || isCoachingPage ? 'p-0' : 'p-6 md:p-10'}
         `}
      >
        {/* Top Header Area for specific pages if needed, otherwise clean */}
        <div className="max-w-[1600px] mx-auto h-full">
            {children}
        </div>
      </main>
    </div>
  )
}
