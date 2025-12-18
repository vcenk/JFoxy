'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, ArrowRight, RotateCcw, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

// --- Types ---

type SessionMode = 'focus' | 'debrief' | 'summary'

interface Question {
  id: string
  question_text: string
  question_type: string
  category: string
  tips?: string[]
  sequence_number: number
}

interface Session {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  session_type: string
  difficulty_level: string
  status: string
  total_questions: number
}

interface Feedback {
  transcript: string
  duration: number
  wordCount: number
  scores: {
    star: number
    clarity: number
    relevance: number
    impact: number
  }
  feedback: string
  highlights: Array<{
    text: string
    type: 'good' | 'bad'
  }>
  idealAnswer?: string
}

// --- Main Component ---

export default function PracticeSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [mode, setMode] = useState<SessionMode>('focus')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingSession, setLoadingSession] = useState(true)
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null)

  // Audio recording state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load session and questions on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch(`/api/practice/session/${sessionId}`)
        const data = await response.json()

        if (data.success && data.session && data.questions) {
          setSession(data.session)
          setQuestions(data.questions.sort((a: Question, b: Question) => a.sequence_number - b.sequence_number))
        } else {
          setError(data.error || 'Failed to load practice session')
        }
      } catch (err) {
        console.error('Failed to load session:', err)
        setError('Failed to load practice session')
      } finally {
        setLoadingSession(false)
      }
    }

    if (sessionId && sessionId !== 'undefined') {
      loadSession()
    } else {
      setError('Invalid session ID')
      setLoadingSession(false)
    }
  }, [sessionId])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // --- Recording Handlers ---

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setTimer(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Failed to start recording:', err)
      setError('Failed to access microphone. Please grant permission.')
    }
  }

  const stopRecording = () => {
    return new Promise<Blob>((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current

      if (!mediaRecorder) {
        reject(new Error('No media recorder found'))
        return
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        resolve(audioBlob)

        // Clean up
        mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    })
  }

  const handleStopRecording = async () => {
    try {
      setIsProcessing(true)
      setError(null)

      const audioBlob = await stopRecording()

      // Upload audio to STT API
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      const sttResponse = await fetch('/api/audio/stt', {
        method: 'POST',
        body: formData,
      })

      const sttData = await sttResponse.json()

      if (!sttData.success || !sttData.transcript) {
        throw new Error(sttData.error || 'Failed to transcribe audio')
      }

      // Score the answer
      const scoreResponse = await fetch('/api/practice/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceQuestionId: currentQuestion.id,
          practiceSessionId: session?.id,
          transcript: sttData.transcript,
          audioDurationSeconds: sttData.duration || timer,
        }),
      })

      const scoreData = await scoreResponse.json()

      if (!scoreData.success) {
        throw new Error(scoreData.error || 'Failed to score answer')
      }

      // Set feedback
      setCurrentFeedback({
        transcript: sttData.transcript,
        duration: sttData.duration || timer,
        wordCount: sttData.wordCount || 0,
        scores: scoreData.score ? {
          star: Math.round(((scoreData.score.star?.has_situation ? 25 : 0) +
                            (scoreData.score.star?.has_task ? 25 : 0) +
                            (scoreData.score.star?.has_action ? 25 : 0) +
                            (scoreData.score.star?.has_result ? 25 : 0))),
          clarity: scoreData.score.clarity_score || 0,
          relevance: scoreData.score.relevance_score || 0,
          impact: scoreData.score.impact_score || 0,
        } : {
          star: 0,
          clarity: 0,
          relevance: 0,
          impact: 0,
        },
        feedback: scoreData.score?.feedback || 'No feedback available',
        highlights: scoreData.score?.highlights || [],
        idealAnswer: scoreData.score?.ideal_answer || undefined,
      })

      setMode('debrief')
    } catch (err: any) {
      console.error('Failed to process recording:', err)
      setError(err.message || 'Failed to process your answer. Please try again.')
      setIsRecording(false)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      // Update session status to completed
      fetch(`/api/practice/session/${sessionId}/complete`, {
        method: 'POST',
      }).catch(console.error)

      setMode('summary')
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setMode('focus')
      setTimer(0)
      setCurrentFeedback(null)
    }
  }

  const handleRetry = () => {
    setMode('focus')
    setTimer(0)
    setCurrentFeedback(null)
    setError(null)
  }

  // --- Renderers ---

  if (loadingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-white/60">Loading practice session...</p>
        </div>
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <Link
            href="/dashboard/practice"
            className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Return to Practice Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (mode === 'summary') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 max-w-lg w-full"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Session Complete!</h2>
          <p className="text-white/60 mb-8">
            Great job practicing! Your answers have been saved and analyzed. Check your dashboard for detailed analytics and progress tracking.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/practice"
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Return to Dashboard
            </Link>
            <Link
              href="/dashboard/practice/new"
              className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
            >
              Start New Session
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] relative max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + (mode === 'debrief' ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="pt-12">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'focus' ? (
            <FocusView
              key="focus"
              question={currentQuestion}
              isRecording={isRecording}
              timer={timer}
              onStart={startRecording}
              onStop={handleStopRecording}
              isProcessing={isProcessing}
            />
          ) : (
            <DebriefView
              key="debrief"
              question={currentQuestion}
              feedback={currentFeedback}
              onNext={handleNext}
              onRetry={handleRetry}
              isLast={isLastQuestion}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- Sub-Components ---

function FocusView({
  question,
  isRecording,
  timer,
  onStart,
  onStop,
  isProcessing
}: {
  question: Question
  isRecording: boolean
  timer: number
  onStart: () => void
  onStop: () => void
  isProcessing: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh]"
    >
      <div className="text-center max-w-3xl mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/60 text-sm font-medium mb-6">
          {question?.category || 'Practice'} Question
        </span>
        <h2 className={`text-3xl md:text-4xl font-bold text-white transition-opacity duration-500 ${isRecording ? 'opacity-50' : 'opacity-100'}`}>
          {question?.question_text || 'Loading question...'}
        </h2>
        {question?.tips && question.tips.length > 0 && !isRecording && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {question.tips.map((tip, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm border border-blue-500/20">
                💡 {tip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visualizer / Controls */}
      <div className="relative">
        {/* Waveform Placeholder */}
        <div className="h-32 flex items-center justify-center gap-1 mb-8">
          {isRecording ? (
            Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-purple-500 rounded-full"
                animate={{
                  height: [20, Math.random() * 80 + 20, 20],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5,
                  delay: i * 0.05,
                }}
              />
            ))
          ) : (
            <div className="h-1 w-full bg-white/5 rounded-full" />
          )}
        </div>

        {/* Timer */}
        {isRecording && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-8">
            <span className="text-red-400 font-mono text-lg animate-pulse">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Main Action Button */}
        <div className="flex justify-center">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
              <span className="text-white/60">Analyzing your answer...</span>
            </div>
          ) : !isRecording ? (
            <button
              onClick={onStart}
              className="group relative flex items-center justify-center w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
              <Mic className="w-10 h-10 text-white" />
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20" />
            </button>
          ) : (
            <button
              onClick={onStop}
              className="flex items-center justify-center w-24 h-24 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 border-2 border-white/20"
            >
              <Square className="w-8 h-8 text-white fill-white" />
            </button>
          )}
        </div>

        {!isRecording && !isProcessing && (
          <p className="text-center text-white/40 mt-6">
            Click the microphone to start recording your answer
          </p>
        )}
      </div>
    </motion.div>
  )
}

function DebriefView({
  question,
  feedback,
  onNext,
  onRetry,
  isLast
}: {
  question: Question
  feedback: Feedback | null
  onNext: () => void
  onRetry: () => void
  isLast: boolean
}) {
  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full"
    >
      {/* Left: Transcript */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Mic className="w-4 h-4 text-purple-400" />
          Your Answer Transcript
        </h3>
        <div className="flex-1 overflow-y-auto space-y-4 text-white/80 leading-relaxed p-4 bg-black/20 rounded-xl text-sm max-h-96">
          <p className="whitespace-pre-wrap">{feedback.transcript}</p>
        </div>
        <div className="mt-4 flex gap-4 text-xs text-white/40">
          <div>Duration: {Math.floor(feedback.duration)}s</div>
          <div>Words: {feedback.wordCount}</div>
        </div>
      </div>

      {/* Right: Feedback & Scores */}
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4">
          <ScoreCard label="STAR Method" score={feedback.scores.star} />
          <ScoreCard label="Clarity" score={feedback.scores.clarity} />
          <ScoreCard label="Relevance" score={feedback.scores.relevance} />
          <ScoreCard label="Impact" score={feedback.scores.impact} />
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Feedback
          </h3>
          <p className="text-white/70 text-sm whitespace-pre-wrap">
            {feedback.feedback}
          </p>
        </div>

        {/* Ideal Answer Example */}
        {feedback.idealAnswer && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              💡 Example Strong Answer
            </h3>
            <p className="text-white/70 text-sm whitespace-pre-wrap leading-relaxed">
              {feedback.idealAnswer}
            </p>
            <p className="text-white/40 text-xs mt-4 italic">
              This is an AI-generated example to guide your practice. Use it to understand structure and approach.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Question
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLast ? 'Finish Session' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const getColor = (s: number) => {
    if (s >= 90) return 'text-green-400 bg-green-400/10 border-green-400/20'
    if (s >= 70) return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  }

  const style = getColor(score)

  return (
    <div className={`p-4 rounded-xl border ${style} flex flex-col items-center justify-center text-center`}>
      <span className="text-3xl font-bold mb-1">{score}</span>
      <span className="text-xs opacity-80 uppercase tracking-wider">{label}</span>
    </div>
  )
}
