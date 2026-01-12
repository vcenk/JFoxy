'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp, Award, Lightbulb, Target, Loader2 } from 'lucide-react'

interface InterviewReport {
  overallScore: number
  summary: string
  keyStrengths: string[]
  areasForImprovement: string[]
  detailedFeedback: string
  recommendations: string[]
  questionScores: Array<{
    question: string
    score: number
    feedback: string
  }>
}

export default function InterviewReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [report, setReport] = useState<InterviewReport | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReport = async () => {
      try {
        // Fetch session data
        const sessionRes = await fetch(`/api/mock/${id}`)
        const sessionData = await sessionRes.json()

        if (sessionData.success) {
          setSession(sessionData.data)

          // If report exists in session, use it
          if (sessionData.data.final_report) {
            setReport(sessionData.data.final_report)
          } else {
            // Generate report if not yet generated
            const completeRes = await fetch(`/api/mock/${id}/complete`, {
              method: 'POST'
            })
            const completeData = await completeRes.json()

            if (completeData.success) {
              setReport(completeData.data.report)
              setSession(completeData.data.session)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load report:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [id])

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30'
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-400">Generating your interview report...</p>
      </div>
    )
  }

  if (!report || !session) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Report Not Available</h2>
        <p className="text-gray-400 mb-6">Complete the interview to see your report</p>
        <button
          onClick={() => router.push('/dashboard/mock')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Back to Interviews
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard/mock')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Interviews
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Report</h1>
            <p className="text-gray-400">
              {session.job_title || 'General Interview'}
              {session.company_name && ` at ${session.company_name}`}
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className={`px-6 py-4 rounded-xl border-2 ${getScoreBgColor(report.overallScore || 0)}`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(report.overallScore || 0)}`}>
                {(report.overallScore || 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400 mt-1">Overall Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#1E1E2E] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Summary</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">{report.summary || 'No summary available'}</p>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Strengths */}
        <div className="bg-[#1E1E2E] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Key Strengths</h3>
          </div>
          <ul className="space-y-3">
            {(report.keyStrengths || []).length > 0 ? (
              report.keyStrengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{strength}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No strengths recorded yet</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-[#1E1E2E] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Areas to Improve</h3>
          </div>
          <ul className="space-y-3">
            {(report.areasForImprovement || []).length > 0 ? (
              report.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{area}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No improvement areas identified yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="bg-[#1E1E2E] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Detailed Feedback</h2>
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {report.detailedFeedback || 'Complete the interview to receive detailed feedback'}
        </p>
      </div>

      {/* Question Breakdown */}
      {(report.questionScores || []).length > 0 && (
        <div className="bg-[#1E1E2E] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Question Breakdown</h2>
          <div className="space-y-4">
            {report.questionScores.map((item, index) => (
              <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">Question {index + 1}</h4>
                  <span className={`text-lg font-bold ${getScoreColor(item.score || 0)}`}>
                    {(item.score || 0).toFixed(1)}/10
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{item.question}</p>
                <p className="text-gray-300 text-sm">{item.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Recommendations</h2>
        </div>
        <ul className="space-y-3">
          {(report.recommendations || []).length > 0 ? (
            report.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-400 text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-300">{rec}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 italic">Complete the interview to receive personalized recommendations</li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => router.push('/dashboard/mock/new')}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all"
        >
          Practice Again
        </button>
        <button
          onClick={() => router.push('/dashboard/mock')}
          className="px-6 py-3 bg-[#2A2A3C] hover:bg-[#3A3A4C] text-white rounded-lg transition-colors"
        >
          View All Interviews
        </button>
      </div>
    </div>
  )
}
