// components/practice/RecordingHub.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, StopCircle, Volume2, RefreshCcw, Loader2, Play, CheckCircle, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react'
import { AudioVisualizer } from './AudioVisualizer'
import { HowToAnswerModal } from './HowToAnswerModal'

interface RecordingHubProps {
    sessionPhase: 'intro' | 'ai_greeting' | 'speaking_question' | 'user_answering' | 'processing_answer' | 'ready_for_next' | 'session_finished'
    countdown: number
    aiSpeaking: boolean
    currentQuestion: any
    isRecording: boolean
    isSendingAnswer: boolean
    isRegeneratingQuestion: boolean
    audioStream: MediaStream | null
    // User context for personalized greeting
    userName?: string
    sessionTrack?: string
    jobTitle?: string
    companyName?: string
    totalQuestions?: number
    // Adaptive difficulty
    currentDifficulty?: 'easy' | 'medium' | 'hard'
    difficultyJustChanged?: boolean
    // Tips for answering questions
    expectedComponents?: {
        tips?: string[]
        suggested_duration?: number
        type?: string
    }
    onStartInterview: () => void
    onToggleRecording: () => void
    onRegenerateQuestion: () => void
    onReturnToDashboard: () => void
    onNextQuestion?: () => void
}

export function RecordingHub({
    sessionPhase,
    countdown,
    aiSpeaking,
    currentQuestion,
    isRecording,
    isSendingAnswer,
    isRegeneratingQuestion,
    audioStream,
    userName,
    sessionTrack,
    jobTitle,
    companyName,
    totalQuestions,
    currentDifficulty = 'medium',
    difficultyJustChanged = false,
    expectedComponents,
    onStartInterview,
    onToggleRecording,
    onRegenerateQuestion,
    onReturnToDashboard,
    onNextQuestion
}: RecordingHubProps) {
    // State for tips modal
    const [showTipsModal, setShowTipsModal] = useState(false)
    // Difficulty display config
    const difficultyConfig = {
        easy: { label: 'Easy Mode', color: 'bg-emerald-500', textColor: 'text-emerald-400', icon: TrendingDown },
        medium: { label: 'Standard', color: 'bg-blue-500', textColor: 'text-blue-400', icon: Minus },
        hard: { label: 'Challenge', color: 'bg-orange-500', textColor: 'text-orange-400', icon: TrendingUp }
    }
    // Use the question's actual difficulty from DB, fallback to adaptive difficulty state
    const displayDifficulty = (currentQuestion?.difficulty as 'easy' | 'medium' | 'hard') || currentDifficulty
    const diffConfig = difficultyConfig[displayDifficulty] || difficultyConfig.medium
    const DiffIcon = diffConfig.icon

    return (
        <div className="flex flex-col h-full bg-white/5 border border-white/5 rounded-2xl glass-panel relative overflow-hidden">
            {/* Dynamic Background Glow */}
            <div className={`absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none ${isRecording ? 'bg-red-500/20' : aiSpeaking ? 'bg-purple-500/20' : 'bg-transparent'
                }`} />

            <div className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative z-10 overflow-y-auto min-h-0">
                {/* Spacer to center content vertically when there's room */}
                <div className="flex-1 min-h-0" />

                {/* Phase: Intro */}
                {sessionPhase === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-lg"
                    >
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
                            <Play className="w-8 h-8 text-white fill-current" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 text-white">Ready to begin{userName ? `, ${userName}` : ''}?</h3>
                        <p className="text-white/40 mb-8 leading-relaxed">
                            We've tailored a custom set of {sessionTrack || 'interview'} questions{jobTitle ? ` for the ${jobTitle}${companyName ? ` role at ${companyName}` : ' role'}` : ' based on your resume'}. Click start when you're in a quiet place.
                        </p>
                        <button
                            onClick={onStartInterview}
                            className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Start Interview
                        </button>
                    </motion.div>
                )}

                {/* Phase: AI Greeting (NEW) */}
                {sessionPhase === 'ai_greeting' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center max-w-xl"
                    >
                        {/* AI Avatar with Speaking Animation */}
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ${aiSpeaking ? 'animate-pulse' : ''}`} />
                            <div className="absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center">
                                <Volume2 className={`w-12 h-12 text-purple-400 ${aiSpeaking ? 'animate-bounce' : ''}`} />
                            </div>
                            {/* Speaking Rings */}
                            {aiSpeaking && (
                                <>
                                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping" />
                                    <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-pulse" />
                                </>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-white">
                            {aiSpeaking ? 'Foxy is speaking...' : 'Welcome to your interview!'}
                        </h3>
                        <p className="text-white/40 mb-6 leading-relaxed text-sm">
                            {aiSpeaking
                                ? 'Listen carefully as I explain what we\'ll cover today.'
                                : `${totalQuestions || 5} ${sessionTrack || 'behavioral'} questions tailored just for you.`
                            }
                        </p>

                        {/* Context Cards */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {sessionTrack && (
                                <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-bold text-purple-300 uppercase tracking-wider">
                                    {sessionTrack} Track
                                </span>
                            )}
                            {jobTitle && (
                                <span className="px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs font-bold text-pink-300">
                                    {jobTitle}{companyName ? ` @ ${companyName}` : ''}
                                </span>
                            )}
                            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/50">
                                {totalQuestions || 5} Questions
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Phase: Countdown */}
                {sessionPhase === 'speaking_question' && countdown > 0 && (
                    <motion.div
                        key="countdown"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="text-center"
                    >
                        <p className="text-8xl font-black text-white mb-4">{countdown}</p>
                        <p className="text-white/40 uppercase tracking-widest font-bold">Question Starting...</p>
                    </motion.div>
                )}

                {/* Phase: Ready for Next Question - shows question preview with Next button */}
                {sessionPhase === 'ready_for_next' && currentQuestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl flex flex-col items-center text-center"
                    >
                        {/* Ready Status */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-300 text-sm font-medium mb-6">
                            <CheckCircle className="w-4 h-4" />
                            Ready for Next Question
                        </div>

                        {/* Question Preview with Badges */}
                        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                {currentQuestion.question_category}
                            </span>
                            <motion.span
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-white/5 border border-white/10 ${diffConfig.textColor}`}
                            >
                                <DiffIcon className="w-3 h-3" />
                                {diffConfig.label}
                            </motion.span>
                            {/* Tips Button */}
                            <button
                                onClick={() => setShowTipsModal(true)}
                                className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
                            >
                                <Lightbulb className="w-3 h-3" />
                                Tips
                            </button>
                        </div>

                        {/* Question Text Preview */}
                        <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-8 px-4">
                            "{currentQuestion.question_text}"
                        </h2>

                        {/* Next Question Button */}
                        <button
                            onClick={onNextQuestion}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20 flex items-center gap-3"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Question
                        </button>
                        <p className="text-white/40 text-sm mt-4">
                            Click to hear the question read aloud
                        </p>
                    </motion.div>
                )}

                {/* Phase: AI Speaking or User Answering */}
                {(sessionPhase === 'speaking_question' || sessionPhase === 'user_answering') && currentQuestion && (
                    <div className="w-full max-w-2xl flex flex-col items-center">

                        {/* AI Status */}
                        <AnimatePresence>
                            {aiSpeaking && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-4 sm:mb-6 lg:mb-8"
                                >
                                    <Volume2 className="w-4 h-4 animate-pulse" />
                                    AI Interviewer Speaking
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* The Question */}
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-6 sm:mb-8 lg:mb-12 flex-shrink-0"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-wider">
                                    {currentQuestion.question_category}
                                </span>
                                {/* Animated Difficulty Badge */}
                                <motion.span
                                    key={displayDifficulty}
                                    initial={difficultyJustChanged ? { scale: 1.3, opacity: 0 } : false}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${difficultyJustChanged
                                        ? `${diffConfig.color} text-white shadow-lg`
                                        : `bg-white/5 border border-white/10 ${diffConfig.textColor}`
                                        }`}
                                >
                                    <DiffIcon className="w-3 h-3" />
                                    {diffConfig.label}
                                </motion.span>
                                {/* Tips Button - only disabled while recording */}
                                <button
                                    onClick={() => setShowTipsModal(true)}
                                    disabled={isRecording || isSendingAnswer}
                                    className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Lightbulb className="w-3 h-3" />
                                    Tips
                                </button>
                            </div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-4 px-4">
                                "{currentQuestion.question_text}"
                            </h2>

                            {!isRecording && !isSendingAnswer && !aiSpeaking && (
                                <button
                                    onClick={onRegenerateQuestion}
                                    disabled={isRegeneratingQuestion}
                                    className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
                                >
                                    <RefreshCcw className={`w-3 h-3 ${isRegeneratingQuestion ? 'animate-spin' : ''}`} />
                                    Regenerate Question
                                </button>
                            )}
                        </motion.div>

                        {/* Visualizer Stage */}
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mb-6 sm:mb-8 lg:mb-12 flex items-center justify-center flex-shrink-0">
                            {/* Decorative Rings */}
                            <div className={`absolute inset-0 rounded-full border border-white/5 transition-all duration-700 ${isRecording ? 'scale-125 opacity-20' : 'scale-100 opacity-100'}`} />
                            <div className={`absolute inset-4 rounded-full border border-white/5 transition-all delay-75 duration-700 ${isRecording ? 'scale-125 opacity-10' : 'scale-100 opacity-100'}`} />

                            <div className="w-full h-full relative z-10 flex items-center justify-center">
                                {isRecording ? (
                                    <AudioVisualizer mode="user-recording" stream={audioStream} className="w-full h-full" />
                                ) : aiSpeaking ? (
                                    <AudioVisualizer mode="ai-speaking" className="w-full h-full" />
                                ) : (
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Mic className="w-10 h-10 lg:w-12 lg:h-12 text-white/10" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Controls */}
                        <div className="flex flex-col items-center gap-4 sm:gap-6 flex-shrink-0 pb-4">
                            <button
                                onClick={onToggleRecording}
                                disabled={aiSpeaking || isSendingAnswer}
                                className={`
                    w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl
                    ${isRecording
                                        ? 'bg-red-500 hover:bg-red-600 ring-8 ring-red-500/20 scale-110'
                                        : 'bg-white text-black hover:scale-110 active:scale-95'}
                    ${(aiSpeaking || isSendingAnswer) ? 'opacity-20 cursor-not-allowed grayscale' : 'opacity-100'}
                  `}
                            >
                                {isRecording ? (
                                    <StopCircle className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-current" />
                                ) : isSendingAnswer ? (
                                    <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 animate-spin" />
                                ) : (
                                    <Mic className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-current" />
                                )}
                            </button>

                            <div className="h-6 flex items-center">
                                <AnimatePresence mode="wait">
                                    {isRecording && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 font-bold text-sm flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            REC... Click to end answer
                                        </motion.p>
                                    )}
                                    {!isRecording && !aiSpeaking && !isSendingAnswer && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/40 text-sm font-medium">
                                            Click to start your answer
                                        </motion.p>
                                    )}
                                    {isSendingAnswer && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-purple-400 text-sm font-bold">
                                            AI is analyzing your response...
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}

                {/* Phase: Session Finished */}
                {sessionPhase === 'session_finished' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 text-white">Interview Complete!</h3>
                        <p className="text-white/40 mb-8 max-w-md mx-auto">
                            Great job! Your full analysis report is being generated. You can find detailed feedback and STAR recommendations in your dashboard.
                        </p>
                        <button
                            onClick={onReturnToDashboard}
                            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-purple-500/20"
                        >
                            View Full Report
                        </button>
                    </motion.div>
                )}

                {/* Spacer to center content vertically when there's room */}
                <div className="flex-1 min-h-0" />
            </div>

            {/* How to Answer Tips Modal */}
            <HowToAnswerModal
                isOpen={showTipsModal}
                onClose={() => setShowTipsModal(false)}
                questionCategory={currentQuestion?.question_category || 'behavioral'}
                tips={expectedComponents?.tips}
                questionText={currentQuestion?.question_text || ''}
            />
        </div>
    )
}
