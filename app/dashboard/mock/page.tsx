// app/dashboard/mock/page.tsx
// Mock Interview Dashboard - Command Center for Interview Practice

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Video,
  Plus,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  Loader2,
  TrendingUp,
  Target,
  Flame,
  Grid3x3,
  List,
  Trophy,
  Sparkles,
  Calendar,
  User,
  Star,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { PracticeStatsCard } from '@/components/practice/PracticeStatsCard'
import { getPersonaByName } from '@/lib/data/interviewerPersonas'

interface MockInterview {
  id: string
  job_title: string
  company_name: string
  duration_minutes: number
  status: 'planned' | 'in_progress' | 'completed'
  overall_score?: number
  current_phase: string
  total_questions: number
  created_at: string
  completed_at?: string
  interviewer_name: string
  interviewer_voice?: string
}

type ViewMode = 'grid' | 'list'

export default function MockInterviewsPage() {
  const router = useRouter()
  const { user, profile } = useAuthStore()
  const [interviews, setInterviews] = useState<MockInterview[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const response = await fetch('/api/mock/list')
        const data = await response.json()

        if (data.success) {
          setInterviews(data.data || [])
        }
      } catch (error) {
        console.error('Failed to load interviews:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInterviews()
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    if (interviews.length === 0) {
      return {
        streak: 0,
        averageScore: 0,
        totalCompleted: 0,
        minutesUsedThisMonth: profile?.mock_interview_minutes_used || 0,
        trend: 0,
      }
    }

    // Calculate streak (consecutive days practiced)
    const sortedInterviews = [...interviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const interview of sortedInterviews) {
      const interviewDate = new Date(interview.created_at)
      interviewDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor(
        (currentDate.getTime() - interviewDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === streak || (streak === 0 && diffDays === 0)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    // Calculate average score
    const completedInterviews = interviews.filter(
      (i) => i.status === 'completed' && i.overall_score !== undefined
    )
    const averageScore =
      completedInterviews.length > 0
        ? completedInterviews.reduce((sum, i) => sum + (i.overall_score || 0), 0) /
        completedInterviews.length
        : 0

    // Calculate trend (last 3 vs previous 3)
    const recentScores = completedInterviews.slice(0, 3).map((i) => i.overall_score || 0)
    const previousScores = completedInterviews.slice(3, 6).map((i) => i.overall_score || 0)

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
      totalCompleted: completedInterviews.length,
      minutesUsedThisMonth: profile?.mock_interview_minutes_used || 0,
      trend,
    }
  }, [interviews, profile])

  // Calculate achievements/badges
  const badges = useMemo(() => {
    const earnedBadges: Array<{ id: string; title: string; description: string; icon: string; color: string }> = []

    if (stats.totalCompleted >= 1) earnedBadges.push({ id: 'first-interview', title: 'Interview Ready', description: 'Completed first mock interview', icon: '🎤', color: 'from-blue-500 to-cyan-500' })
    if (stats.totalCompleted >= 5) earnedBadges.push({ id: 'seasoned', title: 'Seasoned Pro', description: 'Completed 5 interviews', icon: '💪', color: 'from-purple-500 to-pink-500' })
    if (stats.totalCompleted >= 10) earnedBadges.push({ id: 'master', title: 'Interview Master', description: 'Completed 10 interviews', icon: '🏆', color: 'from-yellow-500 to-orange-500' })
    if (stats.averageScore >= 8) earnedBadges.push({ id: 'high-scorer', title: 'Top Performer', description: 'Average score 8+', icon: '⭐', color: 'from-amber-500 to-yellow-500' })
    if (stats.streak >= 3) earnedBadges.push({ id: 'streak-3', title: 'On Fire', description: '3-day interview streak', icon: '🔥', color: 'from-orange-500 to-red-500' })

    return earnedBadges
  }, [stats])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )
      case 'in_progress':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <PlayCircle className="w-3 h-3" />
            In Progress
          </span>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded-full">
            Planned
          </span>
        )
    }
  }

  const getInterviewerPhoto = (interview: MockInterview) => {
    if (interview.interviewer_voice) {
      const persona = getPersonaByName(interview.interviewer_voice)
      return persona?.photoUrl
    }
    return undefined
  }

  // Handle interview deletion
  const handleDeleteInterview = async (e: React.MouseEvent, interviewId: string) => {
    e.stopPropagation() // Prevent card click navigation

    if (!confirm('Are you sure you want to delete this mock interview?')) {
      return
    }

    try {
      const response = await fetch(`/api/mock/${interviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setInterviews(interviews.filter((i) => i.id !== interviewId))
      }
    } catch (error) {
      console.error('Failed to delete interview:', error)
    }
  }

  const isPro = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-[1800px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col px-3 sm:px-4 pt-1 mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-3 sm:gap-6 mb-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight truncate">Mock Interview Studio</h1>
              <p className="text-white/40 text-xs sm:text-sm hidden sm:block">Practice with AI interviewers and ace your next interview</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/dashboard/mock/new"
              className="group/btn inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              Start Interview
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 p-2 glass-panel border-white/5 bg-white/5">
          <div className="flex items-center gap-2 px-1 sm:px-2">
            <span className="text-white/60 text-xs sm:text-sm">View:</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2">
            {/* View Mode Toggle */}
            <div className="flex p-1 bg-black/40 rounded-lg sm:rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'text-white/40 hover:text-white'
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'list'
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

      <div className="px-3 sm:px-4 pb-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <PracticeStatsCard
            title="Interview Streak"
            value={stats.streak}
            subtitle={stats.streak === 1 ? '1 day' : `${stats.streak} days`}
            icon={Flame}
            gradient="from-orange-500 to-red-500"
          />

          <PracticeStatsCard
            title="Average Score"
            value={stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '—'}
            icon={Target}
            gradient="from-purple-500 to-pink-500"
            progress={stats.averageScore * 10}
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
            title="Interviews Completed"
            value={stats.totalCompleted}
            subtitle="Total mock interviews"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
          />

          <PracticeStatsCard
            title="Minutes Used"
            value={`${stats.minutesUsedThisMonth} min`}
            subtitle="This month"
            icon={Clock}
            gradient="from-blue-500 to-cyan-500"
            progress={Math.min(100, (stats.minutesUsedThisMonth / 150) * 100)}
          />
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
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Interview History Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400" />
              My Mock Interviews
            </h2>
          </div>

          {/* Sessions Display */}
          {interviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-12 text-center"
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No mock interviews yet</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Start your first AI-powered mock interview to practice your skills and get personalized feedback
              </p>
              <Link
                href="/dashboard/mock/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                Start First Interview
              </Link>
            </motion.div>
          ) : (
            <div>
              {/* Grid/List Views */}
              {viewMode === 'list' && (
                <div className="hidden lg:block glass-panel p-4 mb-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-white/50">
                    <div className="col-span-1">Interviewer</div>
                    <div className="col-span-3">Position</div>
                    <div className="col-span-2">Company</div>
                    <div className="col-span-2 text-center">Score</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>
              )}

              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-3'
                }
              >
                {interviews.map((interview, index) => (
                  <motion.div
                    key={interview.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      // Grid Card
                      <div
                        className="glass-panel p-6 hover:bg-white/10 transition-all cursor-pointer group border border-white/5 hover:border-purple-500/30"
                        onClick={() => {
                          if (interview.status === 'completed') {
                            router.push(`/dashboard/mock/${interview.id}/report`)
                          } else {
                            router.push(`/dashboard/mock/${interview.id}`)
                          }
                        }}
                      >
                        {/* Interviewer Avatar + Delete Button */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30">
                              {getInterviewerPhoto(interview) ? (
                                <Image
                                  src={getInterviewerPhoto(interview)!}
                                  alt={interview.interviewer_name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-7 h-7 text-purple-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{interview.interviewer_name}</p>
                              <p className="text-xs text-white/40">AI Interviewer</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(interview.status)}
                            <button
                              onClick={(e) => handleDeleteInterview(e, interview.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete interview"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Job Title */}
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                          {interview.job_title || 'General Interview'}
                        </h3>
                        {interview.company_name && (
                          <p className="text-white/60 text-sm mb-4">{interview.company_name}</p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {interview.duration_minutes} min
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {interview.total_questions} questions
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(interview.created_at)}
                          </div>
                        </div>

                        {/* Score or Action */}
                        {interview.status === 'completed' && interview.overall_score != null ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-lg">
                              <TrendingUp className="w-4 h-4 text-purple-400" />
                              <span className="text-sm font-bold text-purple-400">
                                Score: {(interview.overall_score || 0).toFixed(1)}/10
                              </span>
                            </div>
                            <button className="text-xs text-white/40 hover:text-white transition-colors">
                              View Report →
                            </button>
                          </div>
                        ) : (
                          <button className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            {interview.status === 'in_progress' ? 'Continue Interview' : 'Start Interview'}
                          </button>
                        )}
                      </div>
                    ) : (
                      // List Row
                      <div
                        className="glass-panel p-4 hover:bg-white/10 transition-all cursor-pointer group"
                        onClick={() => {
                          if (interview.status === 'completed') {
                            router.push(`/dashboard/mock/${interview.id}/report`)
                          } else {
                            router.push(`/dashboard/mock/${interview.id}`)
                          }
                        }}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                              {getInterviewerPhoto(interview) ? (
                                <Image
                                  src={getInterviewerPhoto(interview)!}
                                  alt={interview.interviewer_name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-purple-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-span-3">
                            <p className="font-medium text-white group-hover:text-purple-400 transition-colors">
                              {interview.job_title || 'General Interview'}
                            </p>
                            <p className="text-xs text-white/40">{interview.interviewer_name}</p>
                          </div>
                          <div className="col-span-2 text-white/60 text-sm">
                            {interview.company_name || '—'}
                          </div>
                          <div className="col-span-2 text-center">
                            {interview.status === 'completed' && interview.overall_score != null ? (
                              <span className="text-purple-400 font-bold">{(interview.overall_score || 0).toFixed(1)}/10</span>
                            ) : (
                              getStatusBadge(interview.status)
                            )}
                          </div>
                          <div className="col-span-2 text-white/40 text-sm">
                            {formatDate(interview.created_at)}
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            {interview.status === 'completed' ? (
                              <button className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-colors">
                                View Report
                              </button>
                            ) : (
                              <button className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-medium transition-colors">
                                {interview.status === 'in_progress' ? 'Continue' : 'Start'}
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteInterview(e, interview.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                              title="Delete interview"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link
          href="/dashboard/mock/new"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-6 h-6 text-white" />
        </Link>
      </div>
    </div>
  )
}
