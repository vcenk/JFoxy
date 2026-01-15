# Voice-Only Mock Interview Implementation Guide

## Overview

This document outlines the complete migration from HeyGen LiveAvatar (video-based) to a voice-only mock interview system using Text-to-Speech (TTS) technology.

**Benefits:**
- 95% cost reduction ($0.75 vs $6 per interview)
- Faster, more reliable user experience
- Better mobile compatibility
- Simpler codebase (remove 500+ lines of complex WebRTC logic)

---

## Table of Contents

1. [What is "Animated Interviewer UI"?](#what-is-animated-interviewer-ui)
2. [User Experience Flow](#user-experience-flow)
3. [Technical Architecture](#technical-architecture)
4. [Cost Analysis](#cost-analysis)
5. [Implementation Steps](#implementation-steps)
6. [Code Examples](#code-examples)
7. [Testing Strategy](#testing-strategy)
8. [Rollback Plan](#rollback-plan)

---

## What is "Animated Interviewer UI"?

Instead of a video avatar, we create a **sophisticated audio interface** with visual feedback that represents the AI interviewer.

### Visual Components

#### 1. Interviewer Profile Card
- Professional headshot or icon (static image)
- Name and title: "Sarah Mitchell - Senior HR Interviewer"
- Subtle breathing animation when idle
- Glowing ring animation when speaking
- Audio waveform visualization during speech

#### 2. State Indicators

**Idle State:**
```
┌─────────────────┐
│   ╭─────╮       │
│   │ 👤  │       │  Profile image
│   ╰─────╯       │  Subtle pulse animation
└─────────────────┘
Sarah Mitchell
Senior HR Interviewer
Status: Ready
```

**Speaking State:**
```
┌─────────────────┐
│   ╭─────╮       │
│ ⚪│ 👤  │⚪     │  Pulsing ring (purple)
│   ╰─────╯       │
└─────────────────┘
▂▃▅▇▅▃▂▃▅▇        Audio waveform (animated)
Status: Speaking...
```

**Listening State:**
```
┌─────────────────┐
│   ╭─────╮       │
│ 🔴│ 🎤  │🔴     │  Recording indicator (red)
│   ╰─────╯       │
└─────────────────┘
▂▅▇▂▃▇▅▂▃▅        Your voice waveform
Status: Listening...
```

**Processing State:**
```
┌─────────────────┐
│   ╭─────╮       │
│ 🔄│ 💭  │🔄     │  Thinking animation
│   ╰─────╯       │
└─────────────────┘
Status: Analyzing your answer...
```

### Real-World Examples
This UI pattern is used by:
- **Google Assistant** - Animated dots that respond to voice
- **Siri** - Colorful waveform orb
- **Clubhouse/Twitter Spaces** - Profile pictures with audio indicators
- **Zoom Audio Mode** - Profile with speaking indicator
- **Discord Voice Channels** - User avatars with green ring when speaking

---

## User Experience Flow

### Complete Interview Journey

#### Step 1: Start Interview
```
User clicks "Start Mock Interview"
    ↓
[Loading screen: "Preparing your interviewer..."]
    ↓
[Interviewer card fades in with breathing animation]
    ↓
Audio plays: "Hello! I'm Sarah Mitchell, your AI interviewer today.
             I'll be asking you behavioral questions to help you
             practice and improve your interview skills. Ready? Let's begin!"
    ↓
[Profile glows purple, waveform animates in sync with audio]
    ↓
Audio finishes
    ↓
[Smooth transition to first question]
```

#### Step 2: Question Asked
```
[Interviewer profile visible]
    ↓
[Purple glow animation begins]
    ↓
[Audio plays question]
"Tell me about a time you demonstrated leadership
 in a challenging situation."
    ↓
[Question text appears below profile]
[Audio waveform visualizes speech rhythm]
    ↓
[Progress indicator: Question 1 of 5]
    ↓
Audio completes
    ↓
[UI transitions to listening mode - red recording indicator]
[Microphone icon replaces profile temporarily]
```

#### Step 3: User Records Answer
```
[Red recording pulse starts]
[Timer begins: 00:00]
    ↓
User speaks their answer
    ↓
[Real-time waveform shows user's voice activity]
[Live transcript appears below (optional feature)]
    ↓
User clicks "Finish Answer" or speaks for 2+ minutes
    ↓
[Recording stops]
[Processing animation starts]
```

#### Step 4: AI Analysis
```
[Processing animation with progress indicator]
"Transcribing your answer..."
"Analyzing content..."
"Generating feedback..."
    ↓
[Takes 5-10 seconds]
    ↓
[Feedback dashboard slides in]
```

#### Step 5: Feedback Display
```
┌────────────────────────────────────┐
│  Your Answer Score: 7.8/10         │
├────────────────────────────────────┤
│  ✅ Strengths:                     │
│  • Clear structure (STAR method)   │
│  • Specific example provided       │
│                                    │
│  💡 Areas to Improve:              │
│  • Add more quantifiable results   │
│  • Emphasize your specific role    │
├────────────────────────────────────┤
│  [ Try Again ]  [ Next Question ]  │
└────────────────────────────────────┘
```

#### Step 6: Continue or Complete
```
User clicks "Next Question"
    ↓
[Return to Step 2 with new question]
    ↓
After 5 questions:
    ↓
[Interview Complete screen]
[Overall performance dashboard]
[Button: "View Detailed Report"]
```

---

## Technical Architecture

### Current Architecture (HeyGen Video)

```
┌──────────────┐
│   Frontend   │
│   (React)    │
└──────┬───────┘
       │
       ↓ (Initialize SDK with session token)
┌──────────────────────┐
│  HeyGen LiveAvatar   │
│   Web SDK (~2MB)     │
└──────┬───────────────┘
       │
       ↓ (WebRTC connection)
┌──────────────────────┐
│   HeyGen Streaming   │
│   API ($$$)          │
└──────┬───────────────┘
       │
       ↓ (Video stream - high bandwidth)
┌──────────────────────┐
│   Video Player       │
│   (Complex, can      │
│    fail easily)      │
└──────────────────────┘

Problems:
❌ Expensive ($0.20-0.40/minute)
❌ Complex (WebRTC, SDK, tokens)
❌ Unreliable (streaming can fail)
❌ Heavy bandwidth (300-500 KB/s)
❌ Poor mobile experience
```

### New Architecture (Voice-Only)

```
┌──────────────┐
│   Frontend   │
│   (React)    │
└──────┬───────┘
       │
       ↓ (Simple API call with text)
┌──────────────────────┐
│   TTS API Endpoint   │
│   (/api/mock/tts)    │
└──────┬───────────────┘
       │
       ↓ (Generate audio)
┌──────────────────────┐
│  OpenAI TTS API      │
│  or ElevenLabs       │
│  ($0.015 per 1K      │
│   characters)        │
└──────┬───────────────┘
       │
       ↓ (MP3 audio file - 20-50 KB)
┌──────────────────────┐
│   Audio Player       │
│   (Simple, reliable) │
└──────────────────────┘

Benefits:
✅ Cheap ($0.0075 per interview)
✅ Simple (no SDK, no tokens)
✅ Reliable (audio rarely fails)
✅ Light bandwidth (20-50 KB per question)
✅ Great mobile experience
```

### Technology Stack Changes

#### Remove These Dependencies
```json
{
  "@heygen/liveavatar-web-sdk": "^1.0.0",  ← Remove
  "WebRTC logic": "complex",                ← Remove
  "Video streaming components": "many"      ← Remove
}
```

#### Add These Dependencies
```json
{
  "openai": "^4.20.0"  // Already have this!
  // OR
  "elevenlabs": "^1.0.0"  // If you want better voices
}
```

#### Keep These (No Changes)
```json
{
  "@deepgram/sdk": "existing",      // Speech-to-text ✅
  "openai": "existing",             // GPT-4 for feedback ✅
  "MediaRecorder API": "native",    // User recording ✅
  "All backend logic": "unchanged"  // Database, API routes ✅
}
```

---

## Cost Analysis

### Detailed Cost Comparison

#### Current System (HeyGen LiveAvatar)

**Per Interview Breakdown:**
```
Average interview duration: 15 minutes
HeyGen cost: $0.30/minute (average)
Cost per interview: 15 × $0.30 = $4.50

Questions asked: 5 questions
Welcome message: 1
Total audio: ~5 minutes of AI speaking
Video stream for entire 15 minutes: $4.50
```

**Monthly Costs (100 interviews):**
```
100 interviews × $4.50 = $450/month
Plus: Deepgram transcription: ~$10/month
Plus: OpenAI GPT-4 feedback: ~$20/month
Total: $480/month
```

#### New System (Voice-Only with OpenAI TTS)

**Per Interview Breakdown:**
```
Questions asked: 5 questions
Average question length: 100 characters
Total characters: 500 per interview

OpenAI TTS HD pricing: $0.015 per 1,000 characters
Cost per interview: (500 / 1000) × $0.015 = $0.0075
```

**Monthly Costs (100 interviews):**
```
100 interviews × $0.0075 = $0.75/month
Plus: Deepgram transcription: ~$10/month
Plus: OpenAI GPT-4 feedback: ~$20/month
Total: $30.75/month
```

#### Cost Savings
```
Old system: $480/month
New system: $30.75/month
Savings: $449.25/month (93.6% reduction!)

At 1,000 interviews/month:
Old system: $4,800/month
New system: $307.50/month
Savings: $4,492.50/month!!
```

### Voice Quality Options

#### Option 1: OpenAI TTS (Recommended to Start)
```
Model: tts-1-hd
Price: $0.015 per 1,000 characters
Voices: 6 options (alloy, echo, fable, onyx, nova, shimmer)
Quality: Very good, natural-sounding
Latency: 1-2 seconds
Best for: Cost-conscious startups
```

#### Option 2: ElevenLabs (Premium Upgrade Path)
```
Model: eleven_multilingual_v2
Price: $0.30 per 1,000 characters (20x more expensive)
Voices: 100+ pre-made voices
Quality: Exceptional, ultra-realistic
Latency: 1-2 seconds
Best for: Premium tier, user complaints about voice quality
```

**Recommendation:** Start with OpenAI TTS. If users complain about voice quality, offer ElevenLabs as a "Premium Interview Mode" for paid users.

---

## Implementation Steps

### Phase 1: Setup (30 minutes)

#### 1.1: Install Dependencies (if needed)

OpenAI is already installed, but verify:
```bash
npm ls openai
# If not installed:
npm install openai
```

For ElevenLabs (optional):
```bash
npm install elevenlabs
```

#### 1.2: Add API Keys

You already have `OPENAI_API_KEY` in `.env`, so no changes needed!

For ElevenLabs (optional):
```env
# .env
ELEVENLABS_API_KEY=your_key_here
```

---

### Phase 2: Create TTS Client (45 minutes)

#### 2.1: Create TTS Utility

Create `lib/clients/ttsClient.ts`:

```typescript
// lib/clients/ttsClient.ts
import { openaiClient } from './openaiClient'

export type VoiceOption = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'

export interface TTSConfig {
  voice?: VoiceOption
  speed?: number  // 0.25 to 4.0
  model?: 'tts-1' | 'tts-1-hd'
}

/**
 * Generate speech audio from text using OpenAI TTS
 * Returns audio as ArrayBuffer
 */
export async function generateSpeech(
  text: string,
  config: TTSConfig = {}
): Promise<ArrayBuffer> {
  const {
    voice = 'nova',        // Professional female voice (good for interviewer)
    speed = 0.95,          // Slightly slower for clarity
    model = 'tts-1-hd'     // High quality
  } = config

  try {
    console.log('[TTS] Generating speech for:', text.substring(0, 50) + '...')
    console.log('[TTS] Voice:', voice, 'Speed:', speed, 'Model:', model)

    const mp3 = await openaiClient.audio.speech.create({
      model,
      voice,
      input: text,
      speed,
    })

    const arrayBuffer = await mp3.arrayBuffer()
    console.log('[TTS] ✅ Audio generated successfully:', arrayBuffer.byteLength, 'bytes')

    return arrayBuffer
  } catch (error: any) {
    console.error('[TTS] ❌ Error generating speech:', error)
    throw new Error(`TTS generation failed: ${error.message}`)
  }
}

/**
 * Estimate audio duration based on text length
 * ~150 words per minute average speaking rate
 */
export function estimateAudioDuration(text: string, speed: number = 0.95): number {
  const words = text.split(/\s+/).length
  const baseMinutes = words / 150
  const adjustedMinutes = baseMinutes / speed
  return Math.ceil(adjustedMinutes * 60 * 1000) // Return milliseconds
}
```

#### 2.2: Create TTS API Endpoint

Create `app/api/mock/tts/route.ts`:

```typescript
// app/api/mock/tts/route.ts
import { NextRequest } from 'next/server'
import { generateSpeech } from '@/lib/clients/ttsClient'
import { serverErrorResponse, badRequestResponse } from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, voice, speed } = body

    // Validate input
    if (!text || typeof text !== 'string') {
      return badRequestResponse('Text is required')
    }

    if (text.length > 4000) {
      return badRequestResponse('Text too long (max 4000 characters)')
    }

    // Generate speech
    const audioBuffer = await generateSpeech(text, { voice, speed })

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(audioBuffer)

    // Return audio as MP3
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error: any) {
    console.error('[TTS API Error]:', error)
    return serverErrorResponse('Failed to generate speech')
  }
}
```

---

### Phase 3: Create UI Components (2-3 hours)

#### 3.1: Create InterviewerPresence Component

Create `components/mock/InterviewerPresence.tsx`:

```typescript
'use client'

import { Video, Mic, Brain, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface InterviewerPresenceProps {
  isActive: boolean          // Is this section visible?
  isSpeaking: boolean       // Is AI currently speaking?
  isProcessing: boolean     // Is AI analyzing answer?
  audioLevel?: number       // 0-100 for waveform visualization
}

export function InterviewerPresence({
  isActive,
  isSpeaking,
  isProcessing,
  audioLevel = 50,
}: InterviewerPresenceProps) {
  const [pulseScale, setPulseScale] = useState(1)

  // Breathing animation when idle
  useEffect(() => {
    if (!isSpeaking && !isProcessing && isActive) {
      const interval = setInterval(() => {
        setPulseScale(prev => (prev === 1 ? 1.02 : 1))
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isSpeaking, isProcessing, isActive])

  const getStatusText = () => {
    if (isProcessing) return 'Analyzing your answer...'
    if (isSpeaking) return 'Speaking...'
    if (isActive) return 'Listening...'
    return 'Ready'
  }

  const getStatusColor = () => {
    if (isProcessing) return 'text-blue-400'
    if (isSpeaking) return 'text-purple-400'
    if (isActive) return 'text-green-400'
    return 'text-gray-400'
  }

  const getIcon = () => {
    if (isProcessing) return <Brain className="w-16 h-16 text-white opacity-80" />
    if (isSpeaking) return <Video className="w-16 h-16 text-white opacity-80" />
    return <Mic className="w-16 h-16 text-white opacity-80" />
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-8">
      {/* Main Profile Circle */}
      <div className="relative mb-6">
        {/* Outer Ring - Glows when speaking */}
        <div
          className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${isSpeaking ? 'ring-4 ring-purple-500/50 animate-pulse scale-110' : ''}
            ${isProcessing ? 'ring-4 ring-blue-500/50 animate-spin' : ''}
          `}
          style={{ width: '180px', height: '180px', margin: '-10px' }}
        />

        {/* Main Circle */}
        <div
          className={`
            w-40 h-40 rounded-full bg-gradient-to-br from-purple-600 to-blue-600
            flex items-center justify-center shadow-2xl
            transition-all duration-500
          `}
          style={{ transform: `scale(${pulseScale})` }}
        >
          {getIcon()}

          {/* Spinning loader overlay when processing */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-20 h-20 text-white/30 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Interviewer Info */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-1">
          Sarah Mitchell
        </h3>
        <p className="text-sm text-gray-400">
          Senior HR Interviewer
        </p>
      </div>

      {/* Audio Waveform (when speaking) */}
      {isSpeaking && (
        <div className="mb-4">
          <AudioWaveform audioLevel={audioLevel} />
        </div>
      )}

      {/* Status Badge */}
      <div className="bg-gray-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700">
        <p className={`text-sm font-medium flex items-center gap-2 ${getStatusColor()}`}>
          <span className={`
            w-2 h-2 rounded-full
            ${isProcessing ? 'bg-blue-500 animate-pulse' : ''}
            ${isSpeaking ? 'bg-purple-500 animate-pulse' : ''}
            ${isActive && !isSpeaking && !isProcessing ? 'bg-green-500 animate-pulse' : ''}
            ${!isActive ? 'bg-gray-500' : ''}
          `} />
          {getStatusText()}
        </p>
      </div>
    </div>
  )
}

// Audio Waveform Visualization Component
function AudioWaveform({ audioLevel }: { audioLevel: number }) {
  return (
    <div className="flex gap-1.5 items-center justify-center h-12">
      {[...Array(12)].map((_, i) => {
        const randomHeight = 20 + Math.random() * 30
        const delay = i * 0.1

        return (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full animate-wave"
            style={{
              height: `${randomHeight}px`,
              animationDelay: `${delay}s`,
              animationDuration: '1s',
            }}
          />
        )
      })}
    </div>
  )
}

// Add this to your global CSS (globals.css)
/*
@keyframes wave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1.2); }
}

.animate-wave {
  animation: wave 1s ease-in-out infinite;
}
*/
```

#### 3.2: Add Animation to Global CSS

Add to `app/globals.css`:

```css
/* Audio waveform animation */
@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
    opacity: 0.7;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}

.animate-wave {
  animation: wave 1s ease-in-out infinite;
}

/* Breathing animation for idle state */
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.animate-breathe {
  animation: breathe 3s ease-in-out infinite;
}
```

#### 3.3: Create VoicePlayer Component

Create `components/mock/VoicePlayer.tsx`:

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

interface VoicePlayerProps {
  audioUrl: string | null
  onPlayStart?: () => void
  onPlayEnd?: () => void
  onError?: (error: string) => void
  autoPlay?: boolean
}

export function VoicePlayer({
  audioUrl,
  onPlayStart,
  onPlayEnd,
  onError,
  autoPlay = true,
}: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Load and play audio when URL changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    // Reset state
    setIsPlaying(false)
    setCurrentTime(0)

    // Load new audio
    audio.src = audioUrl
    audio.load()

    // Auto-play if enabled
    if (autoPlay) {
      audio.play().catch((err) => {
        console.error('[VoicePlayer] Autoplay failed:', err)
        onError?.('Autoplay failed. Please click to play.')
      })
    }
  }, [audioUrl, autoPlay])

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      console.log('[VoicePlayer] Playing')
      setIsPlaying(true)
      onPlayStart?.()
    }

    const handlePause = () => {
      console.log('[VoicePlayer] Paused')
      setIsPlaying(false)
    }

    const handleEnded = () => {
      console.log('[VoicePlayer] Ended')
      setIsPlaying(false)
      setCurrentTime(0)
      onPlayEnd?.()
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      console.log('[VoicePlayer] Duration:', audio.duration)
    }

    const handleError = (e: Event) => {
      console.error('[VoicePlayer] Error:', e)
      onError?.('Failed to play audio')
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('error', handleError)
    }
  }, [onPlayStart, onPlayEnd, onError])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Optional: Visual player controls (can be hidden if you prefer invisible playback) */}
      {audioUrl && (
        <div className="bg-gray-900/50 backdrop-blur-md rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Progress Bar */}
            <div className="flex-1">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

### Phase 4: Update Main Mock Interview Page (2 hours)

#### 4.1: Modify `app/dashboard/mock/[id]/page.tsx`

Replace the HeyGen logic with voice-only logic:

```typescript
// app/dashboard/mock/[id]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { InterviewerPresence } from '@/components/mock/InterviewerPresence'
import { VoicePlayer } from '@/components/mock/VoicePlayer'
import { ListeningControls } from '@/components/mock/ListeningControls'
import { ProcessingPanel } from '@/components/mock/ProcessingPanel'
import { FeedbackDashboard } from '@/components/mock/FeedbackDashboard'
import { Loader2 } from 'lucide-react'
import { MockInterviewAttemptResponse } from '@/lib/types/mock'

type ViewState = 'INTRO_LOADING' | 'ASKING' | 'LISTENING' | 'PROCESSING' | 'FEEDBACK'

export default function MockSessionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id: sessionId } = params

  const [viewState, setViewState] = useState<ViewState>('INTRO_LOADING')
  const [currentExchange, setCurrentExchange] = useState<any>(null)
  const [feedback, setFeedback] = useState<MockInterviewAttemptResponse | null>(null)
  const [transcript, setTranscript] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLastQuestion, setIsLastQuestion] = useState(false)

  // Voice-only state
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Media Recorder Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Track initialization
  const welcomeSpokeRef = useRef(false)

  // Initialization: Play welcome message
  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      console.log('[Mock Session] Initializing voice-only session...')

      // Generate welcome audio
      if (!welcomeSpokeRef.current) {
        welcomeSpokeRef.current = true
        await speakText(
          "Hello! Welcome to your mock interview. I'm Sarah Mitchell, your AI interviewer today. " +
          "I'll be asking you behavioral questions to help you practice and improve your interview skills. " +
          "Are you ready to begin? Let's get started!"
        )

        // Wait for welcome to finish, then start first question
        // (VoicePlayer's onPlayEnd will trigger this automatically)
      }
    } catch (error) {
      console.error('[Mock Session] Failed to initialize:', error)
      // Fallback: start without audio
      setTimeout(() => startNextQuestion(), 2000)
    }
  }

  /**
   * Generate speech from text and set audio URL
   */
  const speakText = async (text: string) => {
    try {
      console.log('[TTS] Requesting audio for:', text.substring(0, 50) + '...')

      const response = await fetch('/api/mock/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: 'nova',  // Professional female voice
          speed: 0.95,    // Slightly slower for clarity
        }),
      })

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      console.log('[TTS] ✅ Audio ready:', url)
    } catch (error) {
      console.error('[TTS] Failed to generate speech:', error)
      throw error
    }
  }

  const handleAudioPlayStart = () => {
    console.log('[Audio] Started playing')
    setIsSpeaking(true)
  }

  const handleAudioPlayEnd = () => {
    console.log('[Audio] Finished playing')
    setIsSpeaking(false)

    // Auto-transition based on current state
    if (viewState === 'INTRO_LOADING') {
      // Welcome message finished, start first question
      setTimeout(() => startNextQuestion(), 1000)
    } else if (viewState === 'ASKING') {
      // Question finished, start listening
      setTimeout(() => {
        setViewState('LISTENING')
        startRecording()
      }, 1000)
    }
  }

  const startNextQuestion = async () => {
    setViewState('INTRO_LOADING')
    setAudioUrl(null)

    try {
      const res = await fetch(`/api/mock/${sessionId}/next-question`, { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        if (data.data.completed) {
          router.push(`/dashboard/mock/${sessionId}/report`)
          return
        }

        setCurrentExchange(data.data)
        setViewState('ASKING')

        // Generate speech for the question
        await speakText(data.data.questionText)
        // Audio will auto-play via VoicePlayer
      }
    } catch (error) {
      console.error('Failed to start question', error)
      alert('Failed to load question. Please try again.')
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start()
      console.log('[Recording] Started')
    } catch (err) {
      console.error('Mic access denied', err)
      alert('Microphone access is required for mock interviews.')
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder) return resolve(new Blob())

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        console.log('[Recording] Stopped, size:', blob.size)
        resolve(blob)
      }
      recorder.stop()
      recorder.stream.getTracks().forEach(t => t.stop())
    })
  }

  const handleFinishAnswer = async () => {
    setViewState('PROCESSING')
    setIsProcessing(true)
    const audioBlob = await stopRecording()

    try {
      // 1. Transcribe
      const formData = new FormData()
      formData.append('audio', audioBlob, 'answer.webm')

      const transRes = await fetch('/api/mock/transcribe', {
        method: 'POST',
        body: formData,
      })
      const transData = await transRes.json()

      if (!transData.success) throw new Error('Transcription failed')

      const { transcript, metrics } = transData.data
      setTranscript(transcript)

      // 2. Submit to AI for feedback
      const submitRes = await fetch('/api/mock/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchangeId: currentExchange.exchangeId,
          transcript,
          metrics,
          audioUrl: '',
        }),
      })
      const submitData = await submitRes.json()

      if (!submitData.success) throw new Error('AI processing failed')

      setFeedback(submitData.data.feedback)
      setIsProcessing(false)
      setViewState('FEEDBACK')
    } catch (error) {
      console.error(error)
      setIsProcessing(false)
      alert('Something went wrong processing your answer.')
      setViewState('LISTENING')
    }
  }

  const handleRetry = () => {
    setFeedback(null)
    setTranscript('')
    setAudioUrl(null)
    setViewState('ASKING')
    setTimeout(() => {
      setViewState('LISTENING')
      startRecording()
    }, 1500)
  }

  const handleFinishSession = async () => {
    await fetch(`/api/mock/${sessionId}/finish`, { method: 'POST' })
    router.push(`/dashboard/mock/${sessionId}/report`)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
          ← Exit
        </button>
        <div className="text-sm font-medium text-gray-500">
          Session ID: {sessionId.slice(0, 8)}...
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
        {/* INTRO_LOADING: Show welcome screen */}
        {viewState === 'INTRO_LOADING' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <InterviewerPresence
              isActive={true}
              isSpeaking={isSpeaking}
              isProcessing={false}
            />
            {!audioUrl && (
              <div className="mt-8">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                <p className="text-gray-400 mt-2 text-center">Preparing your interview...</p>
              </div>
            )}
          </div>
        )}

        {/* ASKING or LISTENING: Show interviewer + question */}
        {(viewState === 'ASKING' || viewState === 'LISTENING') && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <InterviewerPresence
              isActive={viewState === 'LISTENING'}
              isSpeaking={isSpeaking}
              isProcessing={false}
            />

            <div className="mt-8 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 max-w-4xl mx-auto">
                {currentExchange?.questionText}
              </h2>

              {viewState === 'LISTENING' && (
                <ListeningControls
                  isListening={true}
                  transcript={transcript}
                  onFinish={handleFinishAnswer}
                  onRestart={handleRetry}
                />
              )}
            </div>
          </div>
        )}

        {/* PROCESSING: Show processing animation */}
        {viewState === 'PROCESSING' && <ProcessingPanel />}

        {/* FEEDBACK: Show feedback dashboard */}
        {viewState === 'FEEDBACK' && feedback && (
          <FeedbackDashboard
            feedback={feedback}
            transcript={transcript}
            onNextQuestion={startNextQuestion}
            onRetryQuestion={handleRetry}
            onAnswerFollowUp={() => {}}
            isLastQuestion={false}
          />
        )}

        {/* Voice Player (invisible, handles audio playback) */}
        {audioUrl && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <VoicePlayer
              audioUrl={audioUrl}
              onPlayStart={handleAudioPlayStart}
              onPlayEnd={handleAudioPlayEnd}
              onError={(err) => {
                console.error('[Audio Error]:', err)
                alert('Audio playback failed. Please refresh.')
              }}
              autoPlay={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### Phase 5: Clean Up Old Code (30 minutes)

#### 5.1: Remove HeyGen Dependencies

```bash
npm uninstall @heygen/liveavatar-web-sdk
```

#### 5.2: Delete Unused Files

```bash
# Delete HeyGen-specific components
rm components/mock/AvatarStage.tsx
rm components/mock/AvatarStageEmbed.tsx

# Delete HeyGen API routes
rm app/api/mock/heygen/ice/route.ts
rm app/api/mock/heygen/sdp/route.ts
rm app/api/mock/heygen/speak/route.ts
rm app/api/mock/[id]/init-session/route.ts
```

#### 5.3: Clean Up HeyGen Client

Simplify `lib/clients/heygenClient.ts` (remove all LiveAvatar functions):

```typescript
// lib/clients/heygenClient.ts
// This file can be deleted or simplified to only keep
// non-avatar HeyGen features if you use them elsewhere
```

---

## Testing Strategy

### Test Plan

#### Phase 1: Component Testing (Local Development)

**Test 1: TTS API Endpoint**
```bash
# Test TTS generation
curl -X POST http://localhost:3000/api/mock/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test of the text to speech system.", "voice": "nova"}' \
  --output test.mp3

# Play the audio file
# Windows: start test.mp3
# Mac: open test.mp3
```

**Expected Result:** MP3 file plays with clear, natural voice.

**Test 2: InterviewerPresence Component**
```typescript
// Create test page: app/test/voice/page.tsx
'use client'
import { InterviewerPresence } from '@/components/mock/InterviewerPresence'
import { useState } from 'react'

export default function TestPage() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  return (
    <div className="min-h-screen bg-black p-8">
      <InterviewerPresence
        isActive={true}
        isSpeaking={isSpeaking}
        isProcessing={false}
      />
      <button
        onClick={() => setIsSpeaking(!isSpeaking)}
        className="mt-8 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Toggle Speaking
      </button>
    </div>
  )
}
```

**Expected Result:**
- Idle state shows breathing animation
- Clicking button shows glowing ring + waveform animation

**Test 3: VoicePlayer Component**
```typescript
// Add to test page
<VoicePlayer
  audioUrl="/test-audio.mp3"
  onPlayStart={() => console.log('Started')}
  onPlayEnd={() => console.log('Ended')}
/>
```

**Expected Result:** Audio plays automatically, events fire correctly.

#### Phase 2: Integration Testing

**Test 4: Complete Interview Flow**
1. Start new mock interview
2. Verify welcome message plays
3. Verify first question loads and plays
4. Record answer
5. Verify feedback appears
6. Click "Next Question"
7. Complete all 5 questions
8. View final report

**Checklist:**
- [ ] Welcome audio plays clearly
- [ ] Questions load sequentially
- [ ] Audio timing matches text display
- [ ] Recording starts after question ends
- [ ] Transcription works correctly
- [ ] Feedback generation succeeds
- [ ] Navigation works between questions
- [ ] Final report displays correctly

#### Phase 3: Edge Case Testing

**Test 5: Error Scenarios**
- [ ] TTS API fails (mock 500 error)
- [ ] Audio fails to load
- [ ] Microphone access denied
- [ ] Network interruption during recording
- [ ] Transcription service down

**Expected Behavior:**
- Graceful error messages
- Ability to retry
- No data loss

**Test 6: Performance Testing**
- [ ] Test with slow network (throttle to 3G)
- [ ] Test on mobile devices
- [ ] Test with multiple concurrent users
- [ ] Monitor API costs during testing

#### Phase 4: User Acceptance Testing

**Test 7: User Experience**
- [ ] Voice sounds natural and professional
- [ ] UI animations are smooth, not distracting
- [ ] Timing feels natural (not too fast/slow)
- [ ] Visual feedback is clear
- [ ] Mobile experience is good

**Get Feedback On:**
- Voice quality (natural? too robotic?)
- Speaking speed (too fast? too slow?)
- UI clarity (confusing? intuitive?)
- Overall preference vs video avatar

---

## Rollback Plan

### If Issues Arise

#### Quick Rollback (30 minutes)

If critical issues discovered during testing:

```bash
# 1. Revert to previous commit
git log --oneline  # Find commit before voice-only changes
git revert <commit-hash>

# 2. Reinstall HeyGen SDK
npm install @heygen/liveavatar-web-sdk

# 3. Restore deleted files from git
git checkout HEAD~1 -- components/mock/AvatarStage.tsx
git checkout HEAD~1 -- components/mock/AvatarStageEmbed.tsx

# 4. Deploy
git push
```

#### Partial Rollback (Feature Flag)

Implement both systems with a toggle:

```typescript
// app/dashboard/mock/[id]/page.tsx
const USE_VOICE_ONLY = process.env.NEXT_PUBLIC_USE_VOICE_ONLY === 'true'

// In render:
{USE_VOICE_ONLY ? (
  <InterviewerPresence ... />
) : (
  <AvatarStage ... />
)}
```

This allows A/B testing:
- 50% of users see voice-only
- 50% of users see video avatar
- Compare metrics and user feedback

---

## Success Metrics

### Track These Metrics

#### Technical Metrics
- **API Response Time**: TTS generation should be <2s
- **Audio File Size**: Should be 20-50 KB per question
- **Error Rate**: Should be <1% for TTS generation
- **Cost Per Interview**: Should be ~$0.01 (vs $4.50 before)

#### User Experience Metrics
- **Completion Rate**: % of users who finish all 5 questions
- **Average Session Duration**: Should be similar to video version
- **User Satisfaction**: Survey after interview (1-5 stars)
- **Mobile Usage**: % of interviews on mobile (should increase)

#### Business Metrics
- **Cost Savings**: Monthly cost reduction
- **User Growth**: Can support 10x more users with same budget
- **Churn Rate**: Monitor if users cancel due to no video
- **Premium Conversion**: If offering video as upgrade tier

### Success Criteria

✅ **Launch is Successful If:**
- Completion rate ≥ 85% (similar to video version)
- User satisfaction ≥ 4.0/5.0
- Cost per interview < $0.05
- Error rate < 2%
- Positive user feedback in surveys

❌ **Rollback If:**
- Completion rate drops below 70%
- User satisfaction < 3.0/5.0
- Multiple complaints about audio quality
- Technical error rate > 5%

---

## Next Steps After Implementation

### Phase 1 Improvements (Week 2-4)

1. **Voice Customization**
   - Allow users to choose from 6 OpenAI voices
   - Add voice preview on settings page
   - Remember user preference

2. **Advanced Animations**
   - Add lip-sync visualization (fake but looks good)
   - More sophisticated waveform (react to actual audio frequencies)
   - Smooth state transitions with GSAP or Framer Motion

3. **Mobile Optimization**
   - Test on iOS/Android browsers
   - Optimize touch interactions
   - Reduce component sizes for small screens

### Phase 2 Enhancements (Month 2)

1. **Premium Tier: ElevenLabs Voices**
   - Offer ultra-realistic voices for paid users
   - Allow voice cloning (user can clone their interviewer's voice)
   - Professional voice packs (different industries)

2. **Interactive Features**
   - Real-time transcript display during answer
   - AI interruptions ("Can you elaborate on that?")
   - Follow-up questions based on answers

3. **Analytics Dashboard**
   - Track which voices users prefer
   - Monitor completion rates by voice
   - A/B test different speaking speeds

### Phase 3 Advanced Features (Month 3+)

1. **Multi-Language Support**
   - OpenAI TTS supports 50+ languages
   - Translate questions to user's language
   - Practice in native language

2. **Voice-to-Voice Mode**
   - User speaks → AI responds immediately (no manual next question)
   - Conversational flow like ChatGPT Voice Mode
   - More natural interview experience

3. **Video Avatar as Premium Add-On**
   - Keep voice-only as default (free/cheap)
   - Offer HeyGen/Tavus avatar for $5/interview premium tier
   - Best of both worlds: accessible + premium option

---

## Conclusion

The voice-only approach provides:

✅ **Better Economics**: 95% cost reduction
✅ **Better UX**: Faster, more reliable
✅ **Better Mobile**: Works great on phones
✅ **Simpler Code**: Easier to maintain
✅ **Scalability**: Support 10x more users

**Recommended Next Steps:**

1. ✅ **Read this document thoroughly**
2. ✅ **Set up a test branch**: `git checkout -b voice-only`
3. ✅ **Implement Phase 1** (TTS client + API)
4. ✅ **Test audio generation** (verify quality)
5. ✅ **Implement Phase 2** (UI components)
6. ✅ **Test components in isolation** (use test page)
7. ✅ **Implement Phase 3** (update main page)
8. ✅ **Full end-to-end testing**
9. ✅ **Soft launch** (10-20 beta users)
10. ✅ **Collect feedback and iterate**
11. ✅ **Full launch** (all users)

**Timeline:** 1-2 days for implementation, 1 week for testing, 1 week for iteration.

**Total Time to Production:** 2-3 weeks

---

## Questions & Support

If you have questions during implementation:

1. **OpenAI TTS Docs**: https://platform.openai.com/docs/guides/text-to-speech
2. **ElevenLabs Docs**: https://docs.elevenlabs.io/api-reference/text-to-speech
3. **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

Good luck with the implementation! This is a solid technical decision that will save you money and improve user experience. 🚀
