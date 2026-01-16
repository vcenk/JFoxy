// app/dashboard/practice/session/[id]/page.tsx
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import {
  Mic,
  StopCircle,
  Loader2,
  XCircle,
  Volume2,
  RefreshCcw,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle,
  LogOut,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { SessionHeader } from '@/components/practice/SessionHeader'
import { QuestionQueue } from '@/components/practice/QuestionQueue'
import { RecordingHub } from '@/components/practice/RecordingHub'
import { LiveConsole } from '@/components/practice/LiveConsole'

interface PracticeQuestion {
  id: string
  question_text: string
  question_category: string
  difficulty: string
  order_index: number
  expected_components?: {
    tips?: string[]
    suggested_duration?: number
    type?: string
  }
}

interface PracticeAnswer {
  id: string
  question_id: string
  transcript: string
  overall_score: number
  star_analysis: {
    situation: boolean
    task: boolean
    action: boolean
    result: boolean
  }
  strengths: string[]
  improvements: string[]
  summary: string
}

interface PracticeSessionData {
  id: string
  title: string
  question_category: string
  total_questions: number
  completed_questions: number
  status: string
  practice_questions: Array<PracticeQuestion & { practice_answers: PracticeAnswer[] }>
}

const PracticeSessionPage = () => {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string
  const { user, profile } = useAuthStore()

  const [loadingSession, setLoadingSession] = useState(true)
  const [sessionData, setSessionData] = useState<PracticeSessionData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [sessionStatus, setSessionStatus] = useState<'loading' | 'active' | 'generating_feedback' | 'finished'>('loading')
  const [sessionPhase, setSessionPhase] = useState<'intro' | 'ai_greeting' | 'speaking_question' | 'user_answering' | 'processing_answer' | 'ready_for_next' | 'session_finished'>('intro');
  const [countdown, setCountdown] = useState(0);

  // Audio States
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [userTranscript, setUserTranscript] = useState('')
  const [isSendingAnswer, setIsSendingAnswer] = useState(false)
  const [lastAnswerFeedback, setLastAnswerFeedback] = useState<PracticeAnswer | null>(null)

  // UI States
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)
  const [showIdealAnswer, setShowIdealAnswer] = useState(false)
  const [isRegeneratingQuestion, setIsRegeneratingQuestion] = useState(false)
  const [showNoSpeechWarning, setShowNoSpeechWarning] = useState(false)
  const [showEndSessionModal, setShowEndSessionModal] = useState(false)

  // Adaptive Difficulty States
  const [recentScores, setRecentScores] = useState<number[]>([])
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [difficultyJustChanged, setDifficultyJustChanged] = useState(false)

  // Chat/History Display
  const chatEndRef = useRef<HTMLDivElement>(null)
  const spokenQuestionIdRef = useRef<string | null>(null) // Track which question has been spoken

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lastAnswerFeedback]) // Scroll when new feedback arrives

  // Fetch session data on load
  useEffect(() => {
    if (!user || !sessionId) return

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/practice/session/${sessionId}`)
        const data = await res.json()
        if (data.success && data.data?.session) {
          const fetchedSession = data.data.session as PracticeSessionData
          setSessionData(fetchedSession)

          if (fetchedSession.status === 'completed') {
            setSessionStatus('finished')
            return
          }

          const completedCount = fetchedSession.completed_questions || 0
          setCurrentQuestionIndex(completedCount)

          // Find the next question to ask
          if (completedCount < fetchedSession.practice_questions.length) {
            setCurrentQuestion(fetchedSession.practice_questions[completedCount])
            setSessionStatus('active')
            setSessionPhase('intro') // Start with intro phase
          } else if (fetchedSession.status === 'in_progress') {
            // All questions answered, but session not marked completed
            setSessionStatus('generating_feedback') // Trigger end
            setSessionPhase('session_finished') // Also mark phase as finished
          } else {
            setSessionStatus('finished')
            setSessionPhase('session_finished') // Mark phase as finished
          }

        } else {
          router.push('/dashboard/practice') // Redirect if session not found
        }
      } catch (e) {
        console.error('Failed to fetch practice session:', e)
        router.push('/dashboard/practice')
      } finally {
        setLoadingSession(false)
      }
    }
    fetchSession()
  }, [user, sessionId, router])

  // Initialize microphone
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setAudioStream(stream)
      } catch (err) {
        console.error('Error accessing microphone:', err)
        alert('Please allow microphone access to start the practice session.')
      }
    }
    initMedia()
  }, [])

  // Text-to-Speech for AI Questions and Feedback
  const speakText = useCallback(async (text: string, onEndCallback?: () => void) => {
    setAiSpeaking(true)
    try {
      const response = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch audio from TTS API')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setAiSpeaking(false)
        if (onEndCallback) onEndCallback()
      }
      audio.onplay = () => setAiSpeaking(true);
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setAiSpeaking(false);
        if (onEndCallback) onEndCallback();
        alert('Failed to play audio. Please try again.');
      };

      await audio.play()
    } catch (error) {
      console.error('Error in speakText:', error)
      setAiSpeaking(false)
      if (onEndCallback) onEndCallback()
      alert('AI voice currently unavailable. Please check your network and settings.')
    }
  }, [])

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && sessionPhase === 'speaking_question' && currentQuestion) {
      speakText(currentQuestion.question_text, () => {
        setSessionPhase('user_answering')
        spokenQuestionIdRef.current = currentQuestion.id; // Mark as spoken
      })
    }
  }, [countdown, sessionPhase, currentQuestion, speakText])

  // End session process
  const endSession = useCallback(async () => {
    setSessionStatus('generating_feedback')
    try {
      const response = await fetch(`/api/practice/session/${sessionId}/end`, { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setSessionStatus('finished')
        router.push(`/dashboard/practice/session/${sessionId}/report`)
      } else {
        alert('Error ending session: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      console.error('Error ending session:', e)
      alert('Failed to end session properly.')
    }
  }, [sessionId])

  // Send audio to STT and then to /api/practice/session/[id]/answer
  const sendAudioForTranscriptionAndEvaluation = useCallback(async (audioBlob: Blob) => {
    if (!sessionData || !currentQuestion) return

    setIsSendingAnswer(true)
    setUserTranscript('Transcribing your answer...')

    try {
      // 1. Send audio for transcription using Deepgram
      const formData = new FormData()
      formData.append('audio', audioBlob, 'answer.webm')

      const sttResponse = await fetch('/api/audio/stt', {
        method: 'POST',
        body: formData,
      })

      const sttData = await sttResponse.json()

      // Check if it's an empty audio/no speech detected error (400 status)
      if (sttResponse.status === 400 || !sttData.success || !sttData.data?.transcript) {
        // Show friendly message for empty audio
        if (sttResponse.status === 400 || !sttData.data?.transcript || sttData.data?.transcript.trim() === '') {
          setShowNoSpeechWarning(true)
          setUserTranscript('')
          return
        }
        throw new Error('Failed to transcribe audio')
      }

      const transcript = sttData.data.transcript
      const duration = sttData.data.duration || 0

      setUserTranscript(transcript) // Update UI with real transcript

      // Calculate suggested difficulty based on recent performance
      const updatedScores = [...recentScores, 0].slice(-2) // Placeholder, will update after response
      let suggestedDifficulty: 'easy' | 'medium' | 'hard' = currentDifficulty
      if (recentScores.length >= 2) {
        const avgRecentScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
        if (avgRecentScore >= 80 && currentDifficulty !== 'hard') {
          suggestedDifficulty = currentDifficulty === 'easy' ? 'medium' : 'hard'
        } else if (avgRecentScore < 50 && currentDifficulty !== 'easy') {
          suggestedDifficulty = currentDifficulty === 'hard' ? 'medium' : 'easy'
        }
      }

      // 2. Send transcript and current question details to backend
      const response = await fetch(`/api/practice/session/${sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: {
            transcript: transcript,
            audioUrl: '', // TODO: Upload audio to storage and get URL
            duration: duration,
          },
          questionText: currentQuestion.question_text,
          questionType: currentQuestion.question_category,
          currentQuestionIndex: currentQuestionIndex,
          totalQuestionsInSession: sessionData.total_questions,
          suggestedDifficulty: suggestedDifficulty,
        }),
      })

      const data = await response.json()

      if (data.success && data.data) {
        setLastAnswerFeedback(data.data.savedAnswer)

        // Update recent scores for adaptive difficulty
        const newScore = data.data.evaluation?.overall_score || 0
        setRecentScores(prev => [...prev.slice(-1), newScore])

        // Check if difficulty changed
        if (data.data.nextQuestion) {
          const nextDiff = data.data.nextQuestion.difficulty as 'easy' | 'medium' | 'hard'
          if (nextDiff !== currentDifficulty) {
            setCurrentDifficulty(nextDiff)
            setDifficultyJustChanged(true)
            setTimeout(() => setDifficultyJustChanged(false), 3000) // Reset after 3 seconds
          }
        }

        // Update sessionData to include the new answer
        setSessionData(prevData => {
          if (!prevData) return prevData
          return {
            ...prevData,
            practice_questions: prevData.practice_questions.map(q =>
              q.id === currentQuestion.id
                ? { ...q, practice_answers: [data.data.savedAnswer] }
                : q
            )
          }
        })

        if (data.data.nextQuestion) {
          setCurrentQuestion(data.data.nextQuestion)
          setCurrentQuestionIndex(prev => prev + 1)
          setSessionPhase('processing_answer') // Keep processing while speaking feedback

          // Speak feedback first, then show "Next Question" button
          speakText(`Here's your feedback: "${data.data.evaluation.summary}". Click Next Question when you're ready to continue.`, async () => {
            // After feedback is spoken, transition to ready_for_next phase
            // User can now view tips and click "Next Question" when ready
            setSessionPhase('ready_for_next');
          });
        } else if (data.data.isSessionFinished) {
          await endSession()
        } else {
          console.warn("No next question or session not finished, but got here.");
          await endSession();
        }
      } else {
        alert('Error processing answer: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      console.error('Error in sending answer:', e)
      alert('Failed to process your answer. Please try again.')
    } finally {
      setIsSendingAnswer(false)
    }
  }, [sessionData, currentQuestion, sessionId, currentQuestionIndex, speakText, endSession])

  // Start recording user's answer
  const startRecording = useCallback(() => {
    if (!audioStream) return console.error('Audio stream not available.')
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') return

    audioChunksRef.current = []
    const mediaRecorder = new MediaRecorder(audioStream)
    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    }
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
      await sendAudioForTranscriptionAndEvaluation(audioBlob)
      audioChunksRef.current = []
    }
    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setIsRecording(true)
    console.log('Recording started...')
  }, [audioStream, sendAudioForTranscriptionAndEvaluation])

  // Stop recording user's answer
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      console.log('Recording stopped...')
    }
  }, [])

  // Clear transcript when moving to a new question
  useEffect(() => {
    if (currentQuestion) {
      setUserTranscript('')
      spokenQuestionIdRef.current = null; // Reset spoken status for new question
    }
  }, [currentQuestion])

  // Handle regenerate question
  const handleRegenerate = async () => {
    if (!currentQuestion || !sessionData) return

    setIsRegeneratingQuestion(true)
    try {
      const response = await fetch(`/api/practice/session/${sessionId}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQuestion.id }),
      })

      const data = await response.json()

      if (data.success && data.data?.question) {
        // Update current question with regenerated one
        setCurrentQuestion(data.data.question)

        // Update session data to reflect the change
        if (sessionData) {
          const updatedQuestions = sessionData.practice_questions.map(q =>
            q.id === currentQuestion.id ? data.data.question : q
          )
          setSessionData({
            ...sessionData,
            practice_questions: updatedQuestions
          })
        }

        // Reset spoken status so it can be spoken again
        spokenQuestionIdRef.current = null
      } else {
        alert('Failed to regenerate question: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error regenerating question:', error)
      alert('Failed to regenerate question. Please try again.')
    } finally {
      setIsRegeneratingQuestion(false)
    }
  }

  // Handle end session with confirmation
  const handleEndSession = () => {
    setShowEndSessionModal(true)
  }

  // Confirm end session
  const confirmEndSession = () => {
    setShowEndSessionModal(false)
    router.push('/dashboard/practice')
  }

  if (loadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400 mb-4" />
        <p className="text-xl">Loading Practice Session...</p>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <XCircle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-xl">Practice session not found or inaccessible.</p>
        <button onClick={() => router.push('/dashboard/practice')} className="mt-4 text-purple-400 hover:underline">
          Go to Practice Sessions
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-[1800px] mx-auto overflow-hidden">

      {/* Session Header */}
      <SessionHeader
        title={sessionData.title}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={sessionData.total_questions}
        onEndSession={handleEndSession}
      />

      {/* Main Workspace: 3-Panel Layout */}
      <div className="flex-1 flex gap-6 px-4 pb-4 overflow-hidden relative">

        {/* Left Panel: Question Queue (25%) */}
        <aside className="hidden lg:flex w-80 flex-col shrink-0">
          <QuestionQueue
            questions={sessionData.practice_questions}
            currentQuestionIndex={currentQuestionIndex}
            expandedQuestionId={expandedQuestionId}
            setExpandedQuestionId={setExpandedQuestionId}
          />
        </aside>

        {/* Center Panel: The Stage (50%) */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0">
          <RecordingHub
            sessionPhase={sessionPhase}
            countdown={countdown}
            aiSpeaking={aiSpeaking}
            currentQuestion={currentQuestion}
            isRecording={isRecording}
            isSendingAnswer={isSendingAnswer}
            isRegeneratingQuestion={isRegeneratingQuestion}
            audioStream={audioStream}
            // User context for personalized greeting
            userName={user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
            sessionTrack={sessionData?.question_category}
            jobTitle={sessionData?.title}
            totalQuestions={sessionData?.total_questions}
            // Adaptive difficulty
            currentDifficulty={currentDifficulty}
            difficultyJustChanged={difficultyJustChanged}
            // Tips for answering questions
            expectedComponents={currentQuestion?.expected_components}
            onStartInterview={() => {
              // Transition to greeting phase and speak personalized intro
              setSessionPhase('ai_greeting');
              const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
              const track = sessionData?.question_category || 'behavioral';
              const totalQ = sessionData?.total_questions || 5;
              // Determine coach name based on user's voice preference
              // Female voices: alloy, nova, shimmer / Male voices: echo, fable, onyx
              const femaleVoices = ['alloy', 'nova', 'shimmer'];
              const voiceId = (profile as any)?.mock_voice_id || 'default';
              const isFemaleVoice = femaleVoices.includes(voiceId) || voiceId === 'default';
              const coachName = isFemaleVoice ? 'Sarah' : 'John';
              const greetingText = `Hello ${userName}! I'm ${coachName}, your interview coach from JobFoxy. Welcome to your ${track} interview practice session. I've prepared ${totalQ} questions tailored specifically to your background. Take your time with each answer, and I'll provide detailed feedback after every response. Let's build your confidence together. Your first question is coming up!`;
              speakText(greetingText, () => {
                setSessionPhase('speaking_question');
                setCountdown(3);
              });
            }}
            onToggleRecording={isRecording ? stopRecording : startRecording}
            onRegenerateQuestion={handleRegenerate}
            onReturnToDashboard={() => router.push(`/dashboard/practice/session/${sessionId}/report`)}
            onNextQuestion={() => {
              // User clicked "Next Question" - start the question speaking sequence
              setSessionPhase('speaking_question');
              setCountdown(3);
            }}
          />
        </main>

        {/* Right Panel: Live Console (25%) */}
        <aside className="hidden xl:flex w-80 flex-col shrink-0">
          <LiveConsole
            userTranscript={userTranscript}
            isRecording={isRecording}
            isSendingAnswer={isSendingAnswer}
            lastAnswerFeedback={lastAnswerFeedback}
          />
        </aside>

      </div>

      {/* No Speech Warning Modal */}
      <AnimatePresence>
        {showNoSpeechWarning && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 max-w-md w-full border-2 border-yellow-500/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Speech Detected</h3>
                <p className="text-white/70 mb-6">
                  Please speak your answer to receive scoring and feedback. The recording was empty or too quiet.
                </p>
                <button
                  onClick={() => setShowNoSpeechWarning(false)}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all w-full"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* End Session Confirmation Modal */}
      <AnimatePresence>
        {showEndSessionModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 max-w-md w-full border-2 border-red-500/30"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">End Practice Session?</h3>
                <p className="text-white/70 mb-6">
                  Are you sure you want to end this session? Your progress will be saved, but unanswered questions won't be scored.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowEndSessionModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                  >
                    Continue Practice
                  </button>
                  <button
                    onClick={confirmEndSession}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
                  >
                    End Session
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PracticeSessionPage
