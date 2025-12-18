// app/dashboard/practice/page.tsx
// Practice sessions - answer questions and get AI feedback

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'  // store/authStore.ts
import { Mic, Play, Square, Loader2, CheckCircle, Clock, TrendingUp } from 'lucide-react'

interface PracticeSession {
  id: string
  session_type: string
  difficulty_level: string
  status: string
  overall_score: number | null
  total_questions: number
  questions_answered: number
  created_at: string
}

export default function PracticePage() {
  const { user, profile } = useAuthStore()
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user])

  const fetchSessions = async () => {
    try {
      // TODO: Implement fetch sessions from Supabase
      setLoading(false)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setLoading(false)
    }
  }

  const canStartNewSession = () => {
    if (profile?.subscription_status === 'pro') return true
    return (profile?.practice_sessions_this_month || 0) < 5
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Sessions</h1>
        <p className="text-gray-600">
          Practice interview questions and get instant AI-powered feedback
        </p>
      </div>

      {/* Usage stats */}
      {profile?.subscription_status === 'free' && (
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">
                Practice Sessions This Month
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {profile.practice_sessions_this_month || 0} / 5
              </p>
            </div>
            <Clock className="w-12 h-12 text-blue-400" />
          </div>
          {(profile.practice_sessions_this_month || 0) >= 5 && (
            <p className="mt-2 text-sm text-blue-700">
              Limit reached. Upgrade to Pro for unlimited practice sessions.
            </p>
          )}
        </div>
      )}

      {/* New session button */}
      <div className="mb-8">
        <Link
          href="/dashboard/practice/new"
          className={`flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors w-fit ${!canStartNewSession() ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Play className="w-5 h-5" />
          <span>Start New Practice Session</span>
        </Link>
        {!canStartNewSession() && (
          <p className="mt-2 text-sm text-red-600">
            Monthly limit reached. Upgrade to Pro for unlimited access.
          </p>
        )}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No practice sessions yet
          </h3>
          <p className="text-gray-600">Start your first practice session to improve your skills</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {session.session_type}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {session.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium text-gray-900">
                    {session.questions_answered} / {session.total_questions}
                  </span>
                </div>

                {session.overall_score !== null && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Score</span>
                      <span className="font-bold text-gray-900">
                        {session.overall_score}/100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${session.overall_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {session.status === 'completed' ? 'View Results' : 'Continue'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

