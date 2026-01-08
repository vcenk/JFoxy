// components/mock/ConversationTranscript.tsx
// Displays real-time conversation transcript for mock interviews

'use client'

import { useEffect, useRef } from 'react'
import { User, Bot } from 'lucide-react'
import { TranscriptMessage } from '@/lib/hooks/useRealtimeInterview'

interface ConversationTranscriptProps {
  messages: TranscriptMessage[]
  interviewerName?: string
  userName?: string
  isThinking?: boolean
  isSpeaking?: boolean
}

export default function ConversationTranscript({
  messages,
  interviewerName = 'Interviewer',
  userName = 'You',
  isThinking = false,
  isSpeaking = false
}: ConversationTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-[#1E1E2E] rounded-lg p-4 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300">Conversation</h3>
        <div className="flex items-center gap-3">
          {isSpeaking && (
            <span className="flex items-center gap-1.5 text-xs text-purple-400">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              Speaking
            </span>
          )}
          <span className="text-xs text-gray-500">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && !isThinking ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Conversation will appear here...
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                )}

                <div
                  className={`max-w-[70%] ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'bg-[#2A2A3C] border border-gray-700'
                  } rounded-lg p-3`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-medium ${
                        message.role === 'user' ? 'text-blue-400' : 'text-purple-400'
                      }`}
                    >
                      {message.role === 'user' ? userName : interviewerName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{message.text}</p>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="bg-[#2A2A3C] border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Also export legacy Message type for backward compatibility
export interface Message {
  id: string
  type: 'ai' | 'user'
  speaker: string
  text: string
  timestamp: Date
}

// Helper to convert legacy messages to new format
export function convertLegacyMessages(messages: Message[]): TranscriptMessage[] {
  return messages.map(m => ({
    id: m.id,
    role: m.type === 'ai' ? 'assistant' : 'user',
    text: m.text,
    timestamp: m.timestamp
  }))
}
