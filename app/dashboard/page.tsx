// app/dashboard/page.tsx
// Main dashboard with Bento Grid layout (VisionOS aesthetic)

'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import Link from 'next/link'
import {
  FileText,
  MessageSquare,
  Mic,
  Video,
  TrendingUp,
  Mail,
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Zap,
  Star, // Added missing import
  Shield // Added missing import
} from 'lucide-react'

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const [greeting, setGreeting] = useState('')
  const [stats, setStats] = useState<any>({
    readinessScore: 0,
    recentActivity: [],
    counts: {}
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        const data = await res.json()
        if (data.success) {
          setStats(data.data)
        }
      } catch (e) {
        console.error('Failed to fetch stats', e)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  // Helper to format time ago
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Map activity types to icons
  const getIcon = (type: string) => {
    switch (type) {
      case 'resume': return FileText
      case 'swot': return Target
      case 'star': return Star
      case 'gap': return Shield
      case 'pitch': return Mic
      default: return MessageSquare
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          {greeting}, <span className="gradient-text">{profile?.full_name?.split(' ')[0] || 'there'}</span>!
        </h1>
        <p className="text-white/60 text-sm sm:text-base lg:text-lg">
          Your AI-powered career coach is ready to help you succeed
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-auto">

        {/* HERO SECTION - Large Card (Span 2 columns on large screens) */}
        <Link
          href="/dashboard/resume"
          className="glass-panel p-4 sm:p-6 lg:p-8 lg:col-span-2 lg:row-span-2 group cursor-pointer relative overflow-hidden"
        >
          {/* Background Gradient Orb */}
          <div className="absolute -top-20 -right-20 w-40 sm:w-64 h-40 sm:h-64 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-all duration-700" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 rounded-full mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
                <span className="text-purple-200 text-xs sm:text-sm font-semibold">AI-Powered</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                {isPro ? 'Analyze Your Next Resume' : 'Create Your First Resume'}
              </h2>
              <p className="text-white/70 text-sm sm:text-base lg:text-lg mb-4 sm:mb-8 max-w-xl">
                Upload your resume and get instant AI analysis with ATS optimization,
                job matching scores, and personalized improvement suggestions.
              </p>

              <button className="glow-button px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base font-semibold inline-flex items-center space-x-2 group">
                <span>{isPro ? 'Upload Resume' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Decorative Stats - Now Real User Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {loading ? '-' : (stats.avgAtsScore || 0)}
                </div>
                <div className="text-white/50 text-xs sm:text-sm">Avg ATS Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {loading ? '-' : (stats.counts?.resumes || 0)}
                </div>
                <div className="text-white/50 text-xs sm:text-sm">Resumes</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {loading ? '-' : (stats.counts?.mocks || 0)}
                </div>
                <div className="text-white/50 text-xs sm:text-sm">Mock Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {loading ? '-' : (stats.counts?.coverLetters || 0)}
                </div>
                <div className="text-white/50 text-xs sm:text-sm">Cover Letters</div>
              </div>
            </div>
          </div>
        </Link>

        {/* READINESS SCORE - Vertical Card */}
        <div className="glass-panel p-8 lg:row-span-2 relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Readiness Score</h3>
              <Target className="w-6 h-6 text-purple-300" />
            </div>

            {/* Ring Chart */}
            <div className="flex-1 flex items-center justify-center my-8">
              <div className="relative w-48 h-48">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - (loading ? 0 : stats.readinessScore) / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6C47FF" />
                      <stop offset="100%" stopColor="#FF47A3" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-5xl font-bold text-white">
                    {loading ? '-' : stats.readinessScore}
                  </div>
                  <div className="text-white/50 text-sm mt-1">out of 100</div>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Resume</span>
                <span className="text-white font-semibold">{(stats.counts?.resumes || 0) > 0 ? 'Ready' : 'Pending'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">STAR Stories</span>
                <span className="text-white font-semibold">{stats.counts?.stars || 0}/3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Gap Defense</span>
                <span className="text-white font-semibold">{(stats.counts?.gaps || 0) > 0 ? 'Done' : '-'}</span>
              </div>
            </div>

            <Link
              href="/dashboard/coaching"
              className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-center font-semibold transition-all"
            >
              Improve Score
            </Link>
          </div>
        </div>

        {/* QUICK ACCESS CARDS - 3 Medium Cards */}
        <Link
          href="/dashboard/practice"
          className="glass-panel p-6 group cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-green-300" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Practice Sessions</h3>
          <p className="text-white/60 text-sm">
            Answer AI-generated questions and get instant feedback
          </p>
        </Link>

        <Link
          href="/dashboard/mock"
          className="glass-panel p-6 group cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-purple-300" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Mock Interview</h3>
          <p className="text-white/60 text-sm">
            Full interview simulation with detailed performance report
          </p>
        </Link>

        <Link
          href="/dashboard/market-insights"
          className="glass-panel p-6 group cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-blue-300" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Market Insights</h3>
          <p className="text-white/60 text-sm">
            Industry trends, salary data, and in-demand skills
          </p>
        </Link>

        {/* CONTINUITY SECTION - Wide Bottom Strip (Span 3 columns) */}
        <div className="glass-panel p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-300" />
              <h3 className="text-xl font-bold text-white">Pick up where you left off</h3>
            </div>
            {!isPro && (
              <Link
                href="/dashboard/account?tab=billing"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-all group"
              >
                <Zap className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm font-semibold">Upgrade to Pro</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity: any, idx: number) => {
                const Icon = getIcon(activity.type)
                return (
                  <Link
                    key={idx}
                    href={activity.href}
                    className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{activity.title}</div>
                      <div className="text-white/50 text-sm">{timeAgo(activity.date)}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-white/40">
                No recent activity. <Link href="/dashboard/coaching" className="text-purple-400 hover:text-purple-300">Start your first session!</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade CTA for Free Users */}
      {!isPro && (
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to unlock your full potential?</h2>
              <p className="text-white/70 mb-4">
                Get unlimited access to all features, AI coaching, and personalized career insights.
              </p>
              <div className="flex items-center space-x-6 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Unlimited Practice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Full Mock Interviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span>Premium Support</span>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/account?tab=billing"
              className="glow-button px-8 py-4 rounded-2xl text-white font-semibold inline-flex items-center space-x-2 group"
            >
              <Sparkles className="w-5 h-5" />
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
