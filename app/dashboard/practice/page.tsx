// app/dashboard/practice/page.tsx
// Practice Dashboard - Command Center for Interview Preparation

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame,
  Target,
  TrendingUp,
  Clock,
  Grid3x3,
  List,
  Filter,
  Loader2,
  Mic,
  Sparkles,
  Trophy,
  Award,
  Zap,
  Star,
  Bell,
  X,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import { PracticeStatsCard } from '@/components/practice/PracticeStatsCard'
import { SessionCard } from '@/components/practice/SessionCard'
import { StartSessionHero } from '@/components/practice/StartSessionHero'
import { Leaderboard } from '@/components/practice/Leaderboard'

interface PracticeSession {
  id: string
  title: string
  question_category: string
  status: string
  average_score: number | null
  total_questions: number
  completed_questions: number
  created_at: string
  started_at?: string
  completed_at?: string
}

type ViewMode = 'grid' | 'list'
type FilterType = 'all' | 'behavioral' | 'technical' | 'leadership'

export default function PracticePage() {
  const { user, profile } = useAuthStore()
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterType>('all')
  const [reminderDismissed, setReminderDismissed] = useState(false)

  // Fetch sessions on mount
  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/practice')
      const data = await response.json()

      if (data.success && data.data?.sessions) {
        setSessions(data.data.sessions)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        streak: 0,
        averageScore: 0,
        totalCompleted: 0,
        sessionsThisMonth: profile?.star_voice_sessions_used || 0,
        trend: 0,
      }
    }

    // Calculate streak (consecutive days practiced)
    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.created_at)
      sessionDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor(
        (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === streak || (streak === 0 && diffDays === 0)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Calculate average score
    const completedSessions = sessions.filter(
      (s) => s.status === 'completed' && s.average_score !== null
    )
    const averageScore =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.average_score || 0), 0) /
        completedSessions.length
        : 0

    // Calculate trend (last 5 vs previous 5)
    const recentScores = completedSessions.slice(0, 5).map((s) => s.average_score || 0)
    const previousScores = completedSessions.slice(5, 10).map((s) => s.average_score || 0)

    const recentAvg = recentScores.length > 0
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      : 0
    const previousAvg = previousScores.length > 0
      ? previousScores.reduce((a, b) => a + b, 0) / previousScores.length
      : 0

    const trend = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0

    return {
      streak,
      averageScore,
      totalCompleted: completedSessions.length,
      sessionsThisMonth: profile?.star_voice_sessions_used || 0,
      trend,
    }
  }, [sessions, profile])

  // Calculate earned badges
  const badges = useMemo(() => {
    const earnedBadges: Array<{ id: string; title: string; description: string; icon: string; color: string; earned: boolean }> = []

    // Streak-based badges
    if (stats.streak >= 1) earnedBadges.push({ id: 'first-day', title: 'First Step', description: 'Completed your first practice', icon: '🎯', color: 'from-blue-500 to-cyan-500', earned: true })
    if (stats.streak >= 3) earnedBadges.push({ id: 'streak-3', title: 'On Fire', description: '3-day practice streak', icon: '🔥', color: 'from-orange-500 to-red-500', earned: true })
    if (stats.streak >= 7) earnedBadges.push({ id: 'streak-7', title: 'Unstoppable', description: '7-day practice streak', icon: '⚡', color: 'from-yellow-500 to-orange-500', earned: true })
    if (stats.streak >= 30) earnedBadges.push({ id: 'streak-30', title: 'Legend', description: '30-day practice streak', icon: '👑', color: 'from-purple-500 to-pink-500', earned: true })

    // Session count badges
    if (stats.totalCompleted >= 1) earnedBadges.push({ id: 'sessions-1', title: 'Warmup', description: 'Completed 1 session', icon: '🌱', color: 'from-emerald-500 to-green-500', earned: true })
    if (stats.totalCompleted >= 5) earnedBadges.push({ id: 'sessions-5', title: 'Getting Serious', description: 'Completed 5 sessions', icon: '💪', color: 'from-blue-500 to-indigo-500', earned: true })
    if (stats.totalCompleted >= 10) earnedBadges.push({ id: 'sessions-10', title: 'Committed', description: 'Completed 10 sessions', icon: '🏆', color: 'from-amber-500 to-yellow-500', earned: true })
    if (stats.totalCompleted >= 25) earnedBadges.push({ id: 'sessions-25', title: 'Interview Pro', description: 'Completed 25 sessions', icon: '🌟', color: 'from-pink-500 to-rose-500', earned: true })

    // Performance badges
    if (stats.averageScore >= 80) earnedBadges.push({ id: 'high-performer', title: 'High Performer', description: 'Average score above 80', icon: '⭐', color: 'from-yellow-400 to-amber-500', earned: true })
    if (stats.averageScore >= 90) earnedBadges.push({ id: 'excellence', title: 'Excellence', description: 'Average score above 90', icon: '💎', color: 'from-cyan-400 to-blue-500', earned: true })
    if (stats.trend > 10) earnedBadges.push({ id: 'improving', title: 'Rising Star', description: 'Score improving by 10%+', icon: '📈', color: 'from-green-400 to-emerald-500', earned: true })

    return earnedBadges
  }, [stats])

  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (filter === 'all') return sessions

    return sessions.filter((session) => {
      const category = session.question_category?.toLowerCase() || ''
      return category.includes(filter)
    })
  }, [sessions, filter])

  // Check if user can start new session
  const canStartSession = () => {
    if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
      return true
    }
    return (profile?.star_voice_sessions_used || 0) < 5
  }

  // Handle session deletion
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this practice session?')) {
      return
    }

    try {
      const response = await fetch(`/api/practice/session/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId))
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  // Get last incomplete session
  const lastIncompleteSession = sessions.find((s) => s.status !== 'completed')

  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  // Practice Reminder Logic
  const reminder = useMemo(() => {
    if (reminderDismissed) return null

    const now = new Date()
    const hour = now.getHours()
    const today = now.toDateString()

    // Check if practiced today
    const practicedToday = sessions.some(s => new Date(s.created_at).toDateString() === today)

    if (practicedToday) return null

    // Determine reminder type
    if (stats.streak > 0) {
      // Streak at risk warning
      return {
        type: 'streak',
        icon: AlertTriangle,
        title: '🔥 Protect Your Streak!',
        message: `You're on a ${stats.streak}-day streak! Complete a practice today to keep it alive.`,
        color: 'from-orange-500 to-red-500',
        urgent: true
      }
    }

    // Time-based motivational message
    const messages = {
      morning: { title: '☀️ Good Morning!', message: 'Start your day with a quick practice session.' },
      afternoon: { title: '💪 Afternoon Boost', message: 'Take a short break to sharpen your interview skills.' },
      evening: { title: '🌙 Evening Practice', message: 'Wind down with a focused practice session.' }
    }

    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
    const msg = messages[timeOfDay]

    return {
      type: 'reminder',
      icon: Bell,
      title: msg.title,
      message: msg.message,
      color: 'from-purple-500 to-pink-500',
      urgent: false
    }
  }, [sessions, stats.streak, reminderDismissed])

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-[1800px] mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col px-4 pt-1 mb-6">
        <div className="flex items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-tight">Practice Command Center</h1>
              <p className="text-white/40 text-sm">Master your interview skills with AI-powered feedback</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard/practice/new"
              className="group/btn inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              Start New Session
            </Link>
          </div>
        </div>

        {/* Toolbar: Stats & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 glass-panel border-white/5 bg-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar whitespace-nowrap px-2">
            {(['all', 'behavioral', 'technical', 'leadership'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${filter === f
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-white/40 hover:text-white hover:bg-white/10'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 px-2">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/40 hover:text-white'
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/40 hover:text-white'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8">
        {/* Practice Reminder Banner */}
        <AnimatePresence>
          {reminder && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-6"
            >
              <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${reminder.color} shadow-lg`}>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-white/20 ${reminder.urgent ? 'animate-pulse' : ''}`}>
                    <reminder.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{reminder.title}</p>
                    <p className="text-sm text-white/80">{reminder.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/practice/new"
                    className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors"
                  >
                    Practice Now
                  </Link>
                  <button
                    onClick={() => setReminderDismissed(true)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PracticeStatsCard
            title="Practice Streak"
            value={stats.streak}
            subtitle={stats.streak === 1 ? '1 day' : `${stats.streak} days`}
            icon={Flame}
            gradient="from-orange-500 to-red-500"
          />

          <PracticeStatsCard
            title="Average Score"
            value={Math.round(stats.averageScore)}
            icon={Target}
            gradient="from-purple-500 to-pink-500"
            progress={stats.averageScore}
            trend={
              stats.trend !== 0
                ? {
                  value: Math.round(stats.trend),
                  isPositive: stats.trend > 0,
                }
                : undefined
            }
          />

          <PracticeStatsCard
            title="Sessions Completed"
            value={stats.totalCompleted}
            subtitle="Total practice sessions"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
          />

          {!isPro ? (
            <PracticeStatsCard
              title="Monthly Usage"
              value={`${stats.sessionsThisMonth} / 5`}
              subtitle="Free tier limit"
              icon={Clock}
              gradient="from-blue-500 to-cyan-500"
              progress={(stats.sessionsThisMonth / 5) * 100}
            />
          ) : (
            <PracticeStatsCard
              title="Pro Member"
              value="∞"
              subtitle="Unlimited sessions"
              icon={TrendingUp}
              gradient="from-yellow-500 to-orange-500"
            />
          )}
        </div>

        {/* Badges/Achievements Section */}
        {badges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Your Achievements</h3>
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-bold">
                  {badges.length} Earned
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br ${badge.color} shadow-lg cursor-default hover:scale-105 transition-transform`}
                  title={badge.description}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{badge.title}</p>
                    <p className="text-[10px] text-white/70">{badge.description}</p>
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="mb-8">
          <Leaderboard />
        </div>

        {/* Hero or Content */}
        {sessions.length === 0 ? (
          <div className="mb-12">
            <StartSessionHero
              canStartSession={canStartSession()}
              lastSessionId={lastIncompleteSession?.id}
              sessionsUsed={stats.sessionsThisMonth}
              sessionsLimit={5}
              isPro={isPro}
            />
          </div>
        ) : null}


        {/* Session History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-purple-400" />
              My STAR Practices
            </h2>
          </div>


          {/* Sessions Display */}
          {loading ? (
            <div className="glass-panel p-12 text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading your practice sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 text-center"
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {filter === 'all' ? 'No practice sessions yet' : `No ${filter} sessions found`}
              </h3>
              <p className="text-white/60 mb-6">
                {filter === 'all'
                  ? 'Start your first session to improve your interview skills'
                  : 'Try selecting a different filter or start a new session'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all"
                >
                  Show All Sessions
                </button>
              )}
            </motion.div>
          ) : (
            <div>
              {/* List View Header */}
              {viewMode === 'list' && (
                <div className="glass-panel p-4 mb-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/50">
                    <div className="col-span-3">Session</div>
                    <div className="col-span-2 text-center">Questions</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>
                </div>
              )}

              {/* Sessions Grid/List */}
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-3'
                }
              >
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SessionCard
                      session={session}
                      onDelete={handleDeleteSession}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
