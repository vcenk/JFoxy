'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, Mic, Volume2 } from 'lucide-react'
import InterviewRoom from '@/components/mock/InterviewRoom'
import ConversationTranscript from '@/components/mock/ConversationTranscript'
import { getPersonaByName } from '@/lib/data/interviewerPersonas'
import { useRealtimeInterview } from '@/lib/hooks/useRealtimeInterview'
import { InterviewPhase } from '@/lib/services/realtimeClient'

interface InterviewSession {
  id: string
  status: string
  current_phase: InterviewPhase
  current_question_index: number
  total_questions: number
  interviewer_name: string
  interviewer_title: string
  interviewer_voice: string
  interviewer_gender: 'male' | 'female' | 'neutral'
  company_name?: string
  job_title?: string
}

export default function LiveInterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  // Session loading state
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Pre-interview state
  const [hasPermission, setHasPermission] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  // Stable callback refs
  const handlePhaseChange = useCallback((phase: InterviewPhase) => {
    console.log('[Interview] Phase changed:', phase)
    setSession(prev => prev ? { ...prev, current_phase: phase } : null)
  }, [])

  const handleError = useCallback((error: Error) => {
    console.error('[Interview] Error:', error.message)
  }, [])

  const handleComplete = useCallback(() => {
    console.log('[Interview] Completed')
    // Small delay then redirect to report
    setTimeout(() => {
      router.push(`/dashboard/mock/${id}/report`)
    }, 2000)
  }, [id, router])

  // Realtime interview hook
  const interview = useRealtimeInterview({
    sessionId: id,
    onPhaseChange: handlePhaseChange,
    onError: handleError,
    onComplete: handleComplete
  })

  // Get interviewer photo from persona
  const getInterviewerPhoto = () => {
    if (!session) return undefined
    const persona = getPersonaByName(session.interviewer_voice)
    return persona?.photoUrl
  }

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/mock/${id}`)
        const data = await response.json()
        if (data.success) {
          setSession(data.data)
        } else {
          setLoadError(data.error || 'Failed to load session')
        }
      } catch (err) {
        console.error('Failed to load session:', err)
        setLoadError('An error occurred loading the session')
      } finally {
        setLoading(false)
      }
    }
    loadSession()
  }, [id])

  // Request microphone permission and start
  const handleStartInterview = useCallback(async () => {
    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop()) // Stop the test stream
      setHasPermission(true)

      // Connect to OpenAI Realtime API
      await interview.connect()
    } catch (err) {
      console.error('Failed to start interview:', err)
      setLoadError('Failed to access microphone. Please check your permissions.')
    }
  }, [interview])

  // Handle ending the interview
  const handleEndInterview = useCallback(async () => {
    if (interview.state === 'COMPLETED') {
      router.push(`/dashboard/mock/${id}/report`)
      return
    }

    if (!window.confirm('Are you sure you want to end the interview early?')) {
      return
    }

    interview.disconnect()
    router.push(`/dashboard/mock/${id}/report`)
  }, [interview, id, router])

  // Handle retry connection
  const handleRetryConnection = useCallback(async () => {
    await interview.connect()
  }, [interview])

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading interview session...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError || !session) {
    return (
      <div className="fixed inset-0 bg-[#0f0f1a] flex items-center justify-center">
        <div className="max-w-md text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Unable to Load Interview</h2>
          <p className="text-gray-400 mb-6">{loadError || 'Session not found'}</p>
          <button
            onClick={() => router.push('/dashboard/mock')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Back to Mock Interviews
          </button>
        </div>
      </div>
    )
  }

  // Pre-interview permission screen
  if (!hasPermission || interview.state === 'IDLE') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a14] via-[#0f0f1a] to-[#1a0a1a] flex items-center justify-center">
        <div className="max-w-lg text-center p-8">
          {/* Interview info card */}
          <div className="bg-[#1E1E2E]/80 border border-purple-500/20 rounded-2xl p-6 mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {session.job_title || 'Interview'} at {session.company_name || 'Company'}
            </h1>
            <p className="text-gray-400 mb-4">
              You'll be interviewed by <span className="text-purple-400">{session.interviewer_name}</span>,
              {' '}{session.interviewer_title}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>{session.total_questions} questions</span>
              <span>~15-20 minutes</span>
            </div>
          </div>

          {/* Microphone permission */}
          <div className="bg-[#1a1a2e]/80 border border-gray-700/50 rounded-xl p-6 mb-6">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Microphone Required</h3>
            <p className="text-gray-400 text-sm mb-4">
              This is a voice-based interview. Please ensure your microphone is working
              and you're in a quiet environment.
            </p>
          </div>

          {/* Tips */}
          <div className="text-left bg-[#1a1a2e]/50 border border-gray-700/30 rounded-lg p-4 mb-8">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Tips for success:</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• You can interrupt the interviewer if needed</li>
              <li>• Take your time to think before answering</li>
            </ul>
          </div>

          {/* Start button */}
          <button
            onClick={handleStartInterview}
            disabled={interview.state === 'CONNECTING'}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-800 disabled:to-pink-800 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
          >
            {interview.state === 'CONNECTING' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                Start Interview
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <InterviewRoom
        interviewerName={session.interviewer_name}
        interviewerTitle={session.interviewer_title}
        interviewerGender={session.interviewer_gender}
        interviewerPhoto={getInterviewerPhoto()}
        companyName={session.company_name}
        state={interview.state}
        phase={interview.phase}
        isConnected={interview.isConnected}
        error={interview.error}
        aiAudioLevel={interview.aiAudioLevel}
        userAudioLevel={interview.userAudioLevel}
        onEndInterview={handleEndInterview}
        onRetryConnection={handleRetryConnection}
      />

      {/* Transcript toggle button */}
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="fixed bottom-24 right-4 z-40 px-4 py-2 bg-[#1a1a2e]/90 border border-gray-700/50 rounded-lg text-sm text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors"
      >
        {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
      </button>

      {/* Floating transcript panel */}
      {showTranscript && (
        <div className="fixed bottom-32 right-4 w-96 z-40 shadow-2xl">
          <ConversationTranscript
            messages={interview.transcript}
            interviewerName={session.interviewer_name}
            userName="You"
            isThinking={interview.state === 'THINKING'}
            isSpeaking={interview.isSpeaking}
          />
        </div>
      )}

      {/* Debug overlay (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 rounded-lg p-3 text-xs font-mono text-gray-300 z-50">
          <p>State: {interview.state} | Phase: {interview.phase}</p>
          <p>Connected: {interview.isConnected ? '✅' : '❌'} | Speaking: {interview.isSpeaking ? '🔊' : '—'} | Listening: {interview.isListening ? '🎤' : '—'}</p>
          <p>AI Level: {interview.aiAudioLevel.toFixed(2)} | User Level: {interview.userAudioLevel.toFixed(2)}</p>
          <p>Transcript: {interview.transcript.length} messages</p>
          {interview.error && <p className="text-red-400">Error: {interview.error}</p>}
        </div>
      )}
    </>
  )
}
