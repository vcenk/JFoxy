// components/mock/MicrophoneControl.tsx
// Always-on microphone with VAD indicator for Realtime API

'use client'

import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react'
import AudioWaveform from './AudioWaveform'

type MicState = 'disabled' | 'ready' | 'listening' | 'connecting' | 'error'

interface MicrophoneControlProps {
    state: MicState
    audioLevel?: number
    isInterrupting?: boolean
}

export default function MicrophoneControl({
    state,
    audioLevel = 0,
    isInterrupting = false
}: MicrophoneControlProps) {
    const isActive = state === 'listening' || state === 'ready'
    const isDisabled = state === 'disabled'
    const isConnecting = state === 'connecting'
    const hasError = state === 'error'

    const getButtonClasses = () => {
        if (hasError) {
            return 'bg-red-700 ring-2 ring-red-500/50'
        }
        if (isConnecting) {
            return 'bg-yellow-600/50 ring-2 ring-yellow-500/30'
        }
        if (isDisabled) {
            return 'bg-gray-700'
        }
        if (state === 'listening') {
            return 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
        }
        if (isInterrupting) {
            return 'bg-gradient-to-br from-orange-500 to-red-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]'
        }
        // Ready state - mic is on, waiting for speech
        return 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
    }

    const getStatusText = () => {
        switch (state) {
            case 'error':
                return 'Microphone error'
            case 'connecting':
                return 'Connecting...'
            case 'disabled':
                return 'Wait for the interviewer...'
            case 'listening':
                return isInterrupting ? 'Interrupting...' : 'Listening...'
            case 'ready':
                return 'Speak when ready'
            default:
                return ''
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Listening Indicator */}
            {state === 'listening' && (
                <div className={`flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] rounded-full border ${
                    isInterrupting ? 'border-orange-500/30' : 'border-green-500/30'
                }`}>
                    <span className={`w-3 h-3 rounded-full animate-pulse ${
                        isInterrupting ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                        isInterrupting ? 'text-orange-400' : 'text-green-400'
                    }`}>
                        {isInterrupting ? 'Interrupting' : 'Listening'}
                    </span>
                </div>
            )}

            {/* Audio Level Visualization (when active) */}
            {isActive && audioLevel > 0 && (
                <div className="w-48">
                    <AudioWaveform
                        isActive={true}
                        audioLevel={audioLevel}
                        color={isInterrupting ? 'orange' : 'blue'}
                        barCount={20}
                    />
                </div>
            )}

            {/* Main Mic Indicator (no click action - always on) */}
            <div
                className={`
                    relative w-20 h-20 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${getButtonClasses()}
                `}
                aria-label={`Microphone ${isActive ? 'active' : 'inactive'}`}
            >
                {/* Pulse Animation for Listening */}
                {state === 'listening' && !isInterrupting && (
                    <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
                )}

                {/* Pulse Animation for Interrupting */}
                {isInterrupting && (
                    <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
                )}

                {/* Icon */}
                <div className="relative z-10">
                    {isConnecting ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : hasError ? (
                        <AlertCircle className="w-8 h-8 text-white" />
                    ) : isDisabled ? (
                        <MicOff className="w-8 h-8 text-gray-400" />
                    ) : (
                        <Mic className="w-8 h-8 text-white" />
                    )}
                </div>
            </div>

            {/* Status Text */}
            <p className={`text-sm text-center ${
                hasError ? 'text-red-400' :
                isConnecting ? 'text-yellow-400' :
                state === 'listening' ? 'text-green-400' :
                'text-gray-400'
            }`}>
                {getStatusText()}
            </p>

            {/* Voice Activity Indicator */}
            {isActive && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className={`w-2 h-2 rounded-full ${
                        audioLevel > 0.1 ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                    <span>Voice detection active</span>
                </div>
            )}
        </div>
    )
}
