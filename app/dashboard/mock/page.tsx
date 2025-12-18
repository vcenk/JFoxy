// app/dashboard/mock/page.tsx
// Mock interview page - full interview simulation with AI

'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'  // store/authStore.ts
import { Video, Loader2, Clock, Award, TrendingUp, CheckCircle, Play } from 'lucide-react'

interface MockInterview {
  id: string
  interviewer_persona: string
  difficulty_level: string
  duration_minutes: number
  status: string
  overall_score: number | null
  verdict: string | null
  created_at: string
  completed_at: string | null
}

export default function MockPage() {
  const { user, profile } = useAuthStore()
  const [interviews, setInterviews] = useState<MockInterview[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewInterview, setShowNewInterview] = useState(false)

  useEffect(() => {
    if (user) {
      fetchInterviews()
    }
  }, [user])

  const fetchInterviews = async () => {
    try {
      // TODO: Implement fetch from Supabase
      setLoading(false)
    } catch (error) {
      console.error('Error fetching mock interviews:', error)
      setLoading(false)
    }
  }

  const canStartNewInterview = () => {
    if (profile?.subscription_status === 'pro') return true
    return (profile?.mock_interviews_this_month || 0) < 1
  }

  const getVerdictColor = (verdict: string | null) => {
    if (!verdict) return 'bg-gray-100 text-gray-800'
    if (verdict === 'Strong Hire') return 'bg-green-100 text-green-800'
    if (verdict === 'Hire') return 'bg-blue-100 text-blue-800'
    if (verdict === 'Maybe') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Interviews</h1>
        <p className="text-gray-600">
          Full interview simulation with AI interviewer and comprehensive feedback
        </p>
      </div>

      {/* Usage stats */}
      {profile?.subscription_status === 'free' && (
        <div className="mb-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">
                Mock Interviews This Month
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {profile.mock_interviews_this_month || 0} / 1
              </p>
            </div>
            <Clock className="w-12 h-12 text-purple-400" />
          </div>
          {(profile.mock_interviews_this_month || 0) >= 1 && (
            <p className="mt-2 text-sm text-purple-700">
              Limit reached. Upgrade to Pro for unlimited mock interviews.
            </p>
          )}
        </div>
      )}

      {/* New interview button */}
      <div className="mb-8">
        <button
          onClick={() => setShowNewInterview(true)}
          disabled={!canStartNewInterview()}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-5 h-5" />
          <span>Start New Mock Interview</span>
        </button>
        {!canStartNewInterview() && (
          <p className="mt-2 text-sm text-red-600">
            Monthly limit reached. Upgrade to Pro for unlimited access.
          </p>
        )}
      </div>

      {/* Interviews list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No mock interviews yet
          </h3>
          <p className="text-gray-600">
            Start your first mock interview to practice with our AI interviewer
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {interview.difficulty_level} Interview
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(interview.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    interview.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {interview.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">
                    {interview.duration_minutes} min
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Persona</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {interview.interviewer_persona}
                  </span>
                </div>

                {interview.verdict && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Verdict</span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getVerdictColor(
                          interview.verdict
                        )}`}
                      >
                        {interview.verdict}
                      </span>
                    </div>
                  </div>
                )}

                {interview.overall_score !== null && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Score</span>
                      <span className="font-bold text-gray-900">
                        {interview.overall_score}/100
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${interview.overall_score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button className="mt-4 w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                {interview.status === 'completed' ? 'View Report' : 'Continue'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New interview modal */}
      {showNewInterview && (
        <NewInterviewModal onClose={() => setShowNewInterview(false)} />
      )}
    </div>
  )
}

function NewInterviewModal({ onClose }: { onClose: () => void }) {
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [difficulty, setDifficulty] = useState('medium')
  const [persona, setPersona] = useState('professional')
  const [focus, setFocus] = useState('balanced')
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    setLoading(true)
    try {
      // TODO: Get resumeId from user selection
      const response = await fetch('/api/mock/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: 'placeholder', // TODO: Get from resume selection
          durationMinutes,
          difficulty,
          personaId: persona,
          focus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // TODO: Navigate to interview session page
        alert('Mock interview created! Navigate to session.')
        onClose()
      } else {
        alert('Error: ' + (data.error || 'Failed to create interview'))
      }
    } catch (error) {
      console.error('Error creating interview:', error)
      alert('Failed to create interview')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          New Mock Interview
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer Persona
            </label>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="strict">Strict</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Area
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="balanced">Balanced</option>
              <option value="behavioral">Behavioral</option>
              <option value="technical">Technical</option>
              <option value="situational">Situational</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <button
            onClick={handleStart}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Start Interview'
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
