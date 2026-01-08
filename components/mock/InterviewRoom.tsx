// components/mock/InterviewRoom.tsx
// Main Zoom-style interview room container for OpenAI Realtime API

'use client'

import { LogOut, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import InterviewerCard from './InterviewerCard'
import MicrophoneControl from './MicrophoneControl'
import { InterviewState, InterviewPhase } from '@/lib/services/realtimeClient'

interface InterviewRoomProps {
    // Interviewer info
    interviewerName: string
    interviewerTitle: string
    interviewerGender: 'male' | 'female' | 'neutral'
    interviewerPhoto?: string
    companyName?: string

    // Connection & State
    state: InterviewState
    phase: InterviewPhase
    isConnected: boolean
    error?: string | null

    // Audio levels
    aiAudioLevel?: number
    userAudioLevel?: number

    // Callbacks
    onEndInterview: () => void
    onRetryConnection?: () => void
}

export default function InterviewRoom({
    interviewerName,
    interviewerTitle,
    interviewerGender,
    interviewerPhoto,
    companyName,
    state,
    phase,
    isConnected,
    error,
    aiAudioLevel = 0,
    userAudioLevel = 0,
    onEndInterview,
    onRetryConnection
}: InterviewRoomProps) {
    // Map InterviewState to UI states
    const isAISpeaking = state === 'SPEAKING'
    const isAIThinking = state === 'THINKING'
    const isListening = state === 'LISTENING'
    const isInterrupted = state === 'INTERRUPTED'
    const isConnecting = state === 'CONNECTING'
    const isCompleted = state === 'COMPLETED'

    // Determine mic state for MicrophoneControl
    const getMicState = (): 'disabled' | 'ready' | 'listening' | 'connecting' | 'error' => {
        if (error) return 'error'
        if (isConnecting) return 'connecting'
        if (!isConnected) return 'disabled'
        if (isAISpeaking || isAIThinking) return 'disabled'
        if (isListening || isInterrupted) return 'listening'
        return 'ready'
    }

    // Determine interviewer ready state
    const isInterviewerReady = isConnected && !isAISpeaking && !isAIThinking && state === 'READY'

    // Phase display name
    const getPhaseLabel = (phase: InterviewPhase): string => {
        switch (phase) {
            case 'welcome': return 'Welcome'
            case 'small_talk': return 'Getting Started'
            case 'company_intro': return 'About the Role'
            case 'questions': return 'Interview Questions'
            case 'wrap_up': return 'Wrapping Up'
            case 'goodbye': return 'Concluding'
            case 'completed': return 'Interview Complete'
            default: return ''
        }
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a14] via-[#0f0f1a] to-[#1a0a1a] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        src="/JobFoxyDark.svg"
                        alt="JobFoxy"
                        className="h-8 w-auto"
                    />
                </div>

                {/* Phase & Connection Status */}
                <div className="flex items-center gap-4">
                    {/* Connection indicator */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
                        isConnected
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : isConnecting
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                        {isConnected ? (
                            <Wifi className="w-3 h-3" />
                        ) : (
                            <WifiOff className="w-3 h-3" />
                        )}
                        <span>{isConnected ? 'Live' : isConnecting ? 'Connecting...' : 'Disconnected'}</span>
                    </div>

                    {/* Phase indicator */}
                    {phase !== 'welcome' && (
                        <div className="text-gray-400 text-sm hidden md:block">
                            {getPhaseLabel(phase)}
                        </div>
                    )}

                    {/* Company Name */}
                    {companyName && (
                        <div className="text-gray-400 text-sm hidden lg:block">
                            Interview with <span className="text-white font-medium">{companyName}</span>
                        </div>
                    )}
                </div>

                {/* End Interview */}
                <button
                    onClick={onEndInterview}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline text-sm">End Interview</span>
                </button>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="mx-6 mb-4 flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm flex-1">{error}</p>
                    {onRetryConnection && (
                        <button
                            onClick={onRetryConnection}
                            className="px-3 py-1 text-sm text-red-300 hover:text-white hover:bg-red-500/20 rounded transition-colors"
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}

            {/* Main Content - Centered Interviewer Card */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-xl">
                    {/* Glassmorphism Card */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-3xl overflow-hidden">
                        <InterviewerCard
                            name={interviewerName}
                            title={interviewerTitle}
                            companyName={companyName}
                            photoUrl={interviewerPhoto}
                            gender={interviewerGender}
                            isSpeaking={isAISpeaking}
                            isThinking={isAIThinking || isConnecting}
                            isReady={isInterviewerReady}
                            audioLevel={aiAudioLevel}
                        />
                    </div>
                </div>
            </main>

            {/* Bottom Controls */}
            <footer className="pb-8 pt-4">
                <div className="flex justify-center">
                    <div className="backdrop-blur-xl bg-[#1a1a2e]/80 border border-gray-700/50 rounded-2xl px-8 py-6">
                        <MicrophoneControl
                            state={getMicState()}
                            audioLevel={userAudioLevel}
                            isInterrupting={isInterrupted}
                        />
                    </div>
                </div>
            </footer>

            {/* Completed Overlay */}
            {isCompleted && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Interview Complete!</h2>
                        <p className="text-gray-400 mb-6">Your detailed feedback report is being generated...</p>
                        <button
                            onClick={onEndInterview}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                            View Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
