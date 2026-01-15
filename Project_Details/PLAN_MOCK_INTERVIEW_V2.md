# Mock Interview V2 Architecture Plan

## Overview

This document outlines the complete architecture for rebuilding the Mock Interview system using **OpenAI Realtime Voice API with WebRTC**. This replaces the previous ElevenLabs + Deepgram + OpenAI LLM stack.

### Why OpenAI Realtime API?

| Feature | Old Stack (ElevenLabs+Deepgram+OpenAI) | New Stack (OpenAI Realtime) |
|---------|----------------------------------------|------------------------------|
| Round-trip latency | 2-4 seconds | 300-500ms |
| Interruption (barge-in) | Manual implementation, complex | Native support |
| VAD | Custom implementation | Built-in (server_vad, semantic_vad) |
| Turn detection | Manual silence detection | Automatic with configurable threshold |
| Backchannels | Separate TTS calls | Can be built into conversation flow |
| Cost per 15min interview | ~$0.60 | ~$0.90-1.20 (higher but better UX) |

### Sources
- [OpenAI Realtime API Guide](https://platform.openai.com/docs/guides/realtime)
- [OpenAI Realtime WebRTC Guide](https://platform.openai.com/docs/guides/realtime-webrtc)
- [OpenAI Realtime VAD Guide](https://platform.openai.com/docs/guides/realtime-vad)
- [OpenAI Realtime Pricing](https://platform.openai.com/docs/guides/realtime-costs)
- [WebRTC Implementation Guide](https://webrtchacks.com/the-unofficial-guide-to-openai-realtime-webrtc-api/)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    InterviewRoom Component                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │   │
│  │  │ Interviewer  │  │  State       │  │   Audio Controls     │   │   │
│  │  │ Presence     │  │  Display     │  │   (Mic/Speaker)      │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                useRealtimeInterview Hook                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │   │
│  │  │ WebRTC     │  │ State      │  │ Event      │  │ Audio     │  │   │
│  │  │ Connection │  │ Machine    │  │ Handler    │  │ Pipeline  │  │   │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                       │
│                     DataChannel (oai-events)                            │
│                                  │                                       │
└──────────────────────────────────┼───────────────────────────────────────┘
                                   │
                    WebRTC PeerConnection (audio tracks)
                                   │
┌──────────────────────────────────┼───────────────────────────────────────┐
│                         OPENAI REALTIME API                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  gpt-4o-realtime-preview                                          │   │
│  │  • Speech-to-Speech                                               │   │
│  │  • Server VAD / Semantic VAD                                      │   │
│  │  • Native Interruption Handling                                   │   │
│  │  • Function Calling (for phase transitions, scoring)              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼───────────────────────────────────────┐
│                           BACKEND                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              /api/mock/realtime/session                           │   │
│  │  • Generate ephemeral token                                       │   │
│  │  • Return session config (instructions, tools, voice)             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              /api/mock/[id]/tool-response                         │   │
│  │  • Handle function calls from Realtime API                        │   │
│  │  • Save answers, scores to database                               │   │
│  │  • Return next question/phase info                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              /api/mock/[id]/complete                              │   │
│  │  • Generate final report                                          │   │
│  │  • Calculate scores                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼───────────────────────────────────────┐
│                         SUPABASE                                         │
│  • mock_interview_sessions                                               │
│  • mock_interview_exchanges                                              │
│  • profiles                                                              │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## State Machine

```
                    ┌─────────┐
                    │  IDLE   │
                    └────┬────┘
                         │ user clicks "Start Interview"
                         ▼
                    ┌─────────┐
                    │CONNECTING│ (WebRTC setup)
                    └────┬────┘
                         │ connection established
                         ▼
                    ┌─────────┐
        ┌──────────│ READY   │◄─────────────────────┐
        │          └────┬────┘                       │
        │               │ AI starts speaking         │ AI finishes, no user speech
        │               ▼                            │
        │          ┌─────────┐                       │
        │          │SPEAKING │───────────────────────┤
        │          └────┬────┘                       │
        │               │ user interrupts (barge-in) │
        │               ▼                            │
        │          ┌──────────┐                      │
        │          │INTERRUPTED│                     │
        │          └────┬─────┘                      │
        │               │ AI acknowledges, stops     │
        │               ▼                            │
        │          ┌─────────┐                       │
        └─────────►│LISTENING│                       │
                   └────┬────┘                       │
                        │ silence detected (VAD)     │
                        ▼                            │
                   ┌─────────┐                       │
                   │THINKING │───────────────────────┘
                   └─────────┘
                        │
                        │ all questions done
                        ▼
                   ┌─────────┐
                   │COMPLETED│
                   └─────────┘
```

### State Definitions

| State | Description | UI Indication |
|-------|-------------|---------------|
| IDLE | Waiting for user to start | "Click to begin" |
| CONNECTING | WebRTC handshake in progress | Spinner |
| READY | Connected, waiting for interaction | Interviewer neutral |
| SPEAKING | AI is speaking | Interviewer animated, waveform |
| LISTENING | User is speaking | Mic active, waveform |
| THINKING | AI processing response | Subtle thinking indicator |
| INTERRUPTED | User interrupted AI | Brief acknowledgment |
| COMPLETED | Interview finished | Redirect to report |

---

## Interview Flow (6 Phases)

### Phase 1: WELCOME
```
AI: "Hi [Name]! How are you doing today?"
User: [responds]
→ Transition to SMALL_TALK
```

### Phase 2: SMALL_TALK
```
AI: [Small talk question from template]
User: [responds]
AI: [Sentiment-aware response + transition]
→ Transition to COMPANY_INTRO
```

### Phase 3: COMPANY_INTRO
```
AI: "Let me tell you a bit about [Company] and the [Role]..."
[No user input expected, auto-transition]
→ Transition to QUESTIONS
```

### Phase 4: QUESTIONS (Loop)
```
FOR each question in interview_plan:
  AI: [Ask question]
  User: [Answer]
  AI: [Brief acknowledgment: "Great, thank you."]
  [TOOL CALL: save_answer → triggers backend scoring]

  IF more questions:
    AI: [Transition phrase + next question]
  ELSE:
    → Transition to WRAP_UP
```

### Phase 5: WRAP_UP
```
AI: "Those are all my questions. Do you have any questions for me?"
User: [asks questions or says no]
AI: [Responds to questions or acknowledges]
→ Transition to GOODBYE
```

### Phase 6: GOODBYE
```
AI: "Thank you for your time today, [Name]. Your detailed feedback..."
→ State: COMPLETED
→ Generate report
→ Redirect to report page
```

---

## OpenAI Realtime API Configuration

### Session Configuration

```typescript
const sessionConfig = {
  model: "gpt-4o-realtime-preview",
  modalities: ["text", "audio"],
  voice: "ash", // or persona-specific voice
  instructions: `You are ${persona.name}, a ${persona.title} conducting a mock interview.

PERSONA TRAITS:
- Style: ${persona.style}
- Warmth: ${persona.warmth}/10
- Strictness: ${persona.strictness}/10

INTERVIEW CONTEXT:
- Candidate: ${userName}
- Company: ${companyName}
- Role: ${jobTitle}
- Questions prepared: ${questions.length}

BEHAVIOR RULES:
1. Keep responses to 1-2 sentences maximum
2. Ask questions, don't lecture
3. Use brief acknowledgments ("Got it", "I see", "Okay")
4. Never give advice during the interview
5. Be interruptible - if candidate speaks, stop and listen
6. After each answer, briefly acknowledge then ask the next question

CURRENT PHASE: ${currentPhase}
CURRENT QUESTION INDEX: ${currentQuestionIndex}

QUESTIONS TO ASK:
${questions.map((q, i) => `${i + 1}. ${q.text}`).join('\n')}
`,

  input_audio_transcription: {
    model: "whisper-1"
  },

  turn_detection: {
    type: "semantic_vad", // Better for interviews
    eagerness: "medium",
    create_response: true,
    interrupt_response: true
  },

  tools: [
    {
      type: "function",
      name: "save_candidate_answer",
      description: "Save the candidate's answer to the current question for scoring",
      parameters: {
        type: "object",
        properties: {
          question_index: { type: "number" },
          answer_transcript: { type: "string" },
          answer_quality_estimate: {
            type: "string",
            enum: ["weak", "average", "strong"]
          }
        },
        required: ["question_index", "answer_transcript"]
      }
    },
    {
      type: "function",
      name: "advance_to_phase",
      description: "Transition to the next interview phase",
      parameters: {
        type: "object",
        properties: {
          next_phase: {
            type: "string",
            enum: ["small_talk", "company_intro", "questions", "wrap_up", "goodbye", "completed"]
          }
        },
        required: ["next_phase"]
      }
    },
    {
      type: "function",
      name: "end_interview",
      description: "End the interview and generate the final report",
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            enum: ["completed", "candidate_ended", "technical_issue"]
          }
        },
        required: ["reason"]
      }
    }
  ],

  tool_choice: "auto"
}
```

### Voice Selection by Persona

| Persona Type | OpenAI Voice | Characteristics |
|--------------|--------------|-----------------|
| Friendly Startup | `coral` or `shimmer` | Warm, encouraging |
| Senior Corporate | `ash` or `sage` | Professional, measured |
| Behavioral Expert | `ballad` | Patient, probing |
| Technical Lead | `echo` | Direct, precise |
| HR Generalist | `marin` | Balanced, neutral |

---

## File Structure (New)

```
/app
  /dashboard
    /mock
      /page.tsx                    # List of mock interviews
      /new/page.tsx                # Create new interview
      /[id]
        /page.tsx                  # Live interview room (NEW)
        /report/page.tsx           # Interview report

/components
  /mock
    /InterviewRoom.tsx             # Main container (REFACTORED)
    /InterviewerCard.tsx           # Interviewer display (KEEP)
    /ConversationTranscript.tsx    # Live transcript (ENHANCED)
    /PhaseIndicator.tsx            # Phase progress (KEEP)
    /AudioWaveform.tsx             # Audio visualization (REFACTORED)
    /ConnectionStatus.tsx          # WebRTC status (NEW)
    /InterruptionIndicator.tsx     # Barge-in feedback (NEW)

/lib
  /hooks
    /useRealtimeInterview.ts       # Main WebRTC hook (NEW)
    /useInterviewStateMachine.ts   # State management (NEW)

  /services
    /realtimeClient.ts             # OpenAI Realtime wrapper (NEW)
    /interviewInstructions.ts      # Prompt builder (NEW)

  /data
    /interviewerPersonas.ts        # Personas (UPDATE: add OpenAI voice mapping)
    /smallTalkTemplates.ts         # KEEP
    /backchannelPhrases.ts         # KEEP (for instruction prompts)

/app/api
  /mock
    /realtime
      /session/route.ts            # Generate ephemeral token (NEW)
    /[id]
      /route.ts                    # GET session details (KEEP)
      /tool-response/route.ts      # Handle function calls (NEW)
      /complete/route.ts           # Generate report (KEEP/REFACTOR)
```

---

## Files to DELETE

```
# Old voice integrations (no longer needed)
/lib/clients/elevenlabsClient.ts
/lib/clients/deepgramClient.ts

# Old conversation manager (replaced by Realtime API)
/lib/services/conversationManager.ts

# Old VAD hook (Realtime API has built-in VAD)
/lib/hooks/useVoiceActivityDetection.ts

# Old API endpoints
/app/api/mock/transcribe/route.ts
/app/api/mock/[id]/speak/route.ts
/app/api/mock/[id]/analyze/route.ts

# Old voice preview endpoints (if not used elsewhere)
/app/api/elevenlabs/voices/route.ts
/app/api/elevenlabs/preview/route.ts
/app/api/deepgram/voices/route.ts
/app/api/deepgram/preview/route.ts

# Old mock components (if completely replaced)
/components/mock/VoicePlayer.tsx
/components/mock/MicrophoneControl.tsx
```

---

## Implementation Details

### 1. Ephemeral Token Generation (`/api/mock/realtime/session/route.ts`)

```typescript
// POST /api/mock/realtime/session
// Request: { sessionId: string }
// Response: { token: string, config: SessionConfig }

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { sessionId } = await req.json()

  // 1. Fetch session from DB
  const session = await getSession(sessionId, user.id)

  // 2. Get persona config
  const persona = getPersonaByVoiceId(session.interviewer_voice)

  // 3. Build instructions
  const instructions = buildInterviewInstructions({
    persona,
    userName: user.full_name,
    companyName: session.company_name,
    jobTitle: session.job_title,
    questions: session.interview_plan.questions
  })

  // 4. Generate ephemeral token from OpenAI
  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview',
      voice: mapPersonaToOpenAIVoice(persona),
      modalities: ['text', 'audio']
    })
  })

  const { client_secret } = await response.json()

  return successResponse({
    token: client_secret.value,
    config: {
      instructions,
      voice: mapPersonaToOpenAIVoice(persona),
      tools: getInterviewTools(),
      turn_detection: {
        type: 'semantic_vad',
        eagerness: 'medium'
      }
    }
  })
}
```

### 2. WebRTC Hook (`/lib/hooks/useRealtimeInterview.ts`)

```typescript
interface UseRealtimeInterviewOptions {
  sessionId: string
  onStateChange: (state: InterviewState) => void
  onTranscript: (role: 'user' | 'ai', text: string) => void
  onPhaseChange: (phase: InterviewPhase) => void
  onError: (error: Error) => void
  onComplete: () => void
}

interface UseRealtimeInterviewReturn {
  state: InterviewState
  phase: InterviewPhase
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  isSpeaking: boolean
  isListening: boolean
  audioLevel: number
}

export function useRealtimeInterview(options: UseRealtimeInterviewOptions): UseRealtimeInterviewReturn {
  const [state, setState] = useState<InterviewState>('IDLE')
  const [phase, setPhase] = useState<InterviewPhase>('welcome')

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const connect = async () => {
    setState('CONNECTING')

    // 1. Get ephemeral token from our backend
    const { token, config } = await fetch(`/api/mock/realtime/session`, {
      method: 'POST',
      body: JSON.stringify({ sessionId: options.sessionId })
    }).then(r => r.json())

    // 2. Get user media
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 3. Create peer connection
    const pc = new RTCPeerConnection()
    pcRef.current = pc

    // 4. Handle remote audio (AI speaking)
    pc.ontrack = (e) => {
      audioRef.current = new Audio()
      audioRef.current.srcObject = e.streams[0]
      audioRef.current.play()
    }

    // 5. Add local audio track (user speaking)
    pc.addTrack(stream.getAudioTracks()[0], stream)

    // 6. Create data channel for events
    const dc = pc.createDataChannel('oai-events')
    dcRef.current = dc

    dc.onopen = () => {
      // Send session configuration
      dc.send(JSON.stringify({
        type: 'session.update',
        session: config
      }))

      // Trigger initial response (welcome)
      dc.send(JSON.stringify({
        type: 'response.create',
        response: {
          instructions: 'Greet the candidate warmly and ask how they are doing.'
        }
      }))
    }

    dc.onmessage = (e) => handleServerEvent(JSON.parse(e.data))

    // 7. Create and set local offer
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    // 8. Send offer to OpenAI and get answer
    const sdpResponse = await fetch(
      'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      }
    )

    const answerSdp = await sdpResponse.text()
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })

    setState('READY')
  }

  const handleServerEvent = async (event: any) => {
    switch (event.type) {
      case 'response.audio.delta':
        // AI is speaking
        setState('SPEAKING')
        break

      case 'response.audio.done':
        // AI finished speaking
        setState('READY')
        break

      case 'input_audio_buffer.speech_started':
        // User started speaking
        setState('LISTENING')
        break

      case 'input_audio_buffer.speech_stopped':
        // User stopped speaking
        setState('THINKING')
        break

      case 'response.audio_transcript.done':
        // AI transcript available
        options.onTranscript('ai', event.transcript)
        break

      case 'conversation.item.input_audio_transcription.completed':
        // User transcript available
        options.onTranscript('user', event.transcript)
        break

      case 'response.function_call_arguments.done':
        // Function call from AI - handle it
        await handleFunctionCall(event)
        break
    }
  }

  const handleFunctionCall = async (event: any) => {
    const { name, arguments: args, call_id } = event
    const parsedArgs = JSON.parse(args)

    switch (name) {
      case 'save_candidate_answer':
        // Save to backend
        await fetch(`/api/mock/${options.sessionId}/tool-response`, {
          method: 'POST',
          body: JSON.stringify({
            tool: 'save_candidate_answer',
            ...parsedArgs
          })
        })

        // Send function result back
        dcRef.current?.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id,
            output: JSON.stringify({ success: true })
          }
        }))

        // Trigger next response
        dcRef.current?.send(JSON.stringify({
          type: 'response.create'
        }))
        break

      case 'advance_to_phase':
        setPhase(parsedArgs.next_phase)
        options.onPhaseChange(parsedArgs.next_phase)
        // Continue conversation
        dcRef.current?.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id,
            output: JSON.stringify({ success: true })
          }
        }))
        dcRef.current?.send(JSON.stringify({
          type: 'response.create'
        }))
        break

      case 'end_interview':
        options.onComplete()
        disconnect()
        break
    }
  }

  const disconnect = () => {
    pcRef.current?.close()
    setState('COMPLETED')
  }

  return {
    state,
    phase,
    connect,
    disconnect,
    isConnected: state !== 'IDLE' && state !== 'CONNECTING' && state !== 'COMPLETED',
    isSpeaking: state === 'SPEAKING',
    isListening: state === 'LISTENING',
    audioLevel: 0 // TODO: implement audio level monitoring
  }
}
```

### 3. Interview Room Component (`/components/mock/InterviewRoom.tsx`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRealtimeInterview } from '@/lib/hooks/useRealtimeInterview'
import InterviewerCard from './InterviewerCard'
import ConversationTranscript from './ConversationTranscript'
import PhaseIndicator from './PhaseIndicator'
import ConnectionStatus from './ConnectionStatus'

interface InterviewRoomProps {
  sessionId: string
  session: InterviewSession
}

export default function InterviewRoom({ sessionId, session }: InterviewRoomProps) {
  const router = useRouter()
  const [transcript, setTranscript] = useState<Array<{role: 'user'|'ai', text: string}>>([])

  const interview = useRealtimeInterview({
    sessionId,
    onStateChange: (state) => {
      console.log('[Interview] State:', state)
    },
    onTranscript: (role, text) => {
      setTranscript(prev => [...prev, { role, text }])
    },
    onPhaseChange: (phase) => {
      console.log('[Interview] Phase:', phase)
    },
    onError: (error) => {
      console.error('[Interview] Error:', error)
    },
    onComplete: () => {
      router.push(`/dashboard/mock/${sessionId}/report`)
    }
  })

  // State-based UI
  const getStatusText = () => {
    switch (interview.state) {
      case 'IDLE': return 'Click to start interview'
      case 'CONNECTING': return 'Connecting...'
      case 'READY': return 'Listening...'
      case 'SPEAKING': return `${session.interviewer_name} is speaking`
      case 'LISTENING': return 'You are speaking...'
      case 'THINKING': return 'Processing...'
      case 'INTERRUPTED': return 'Go ahead...'
      case 'COMPLETED': return 'Interview complete'
      default: return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a14] via-[#0f0f1a] to-[#1a0a1a] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <img src="/JobFoxyDark.svg" alt="JobFoxy" className="h-8" />
        <ConnectionStatus state={interview.state} />
        <button
          onClick={interview.disconnect}
          className="text-gray-400 hover:text-red-400"
        >
          End Interview
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center gap-8 px-8">
        {/* Interviewer Card */}
        <div className="w-96">
          <InterviewerCard
            name={session.interviewer_name}
            title={session.interviewer_title}
            photoUrl={session.interviewer_photo}
            isSpeaking={interview.state === 'SPEAKING'}
            isThinking={interview.state === 'THINKING'}
            isListening={interview.state === 'LISTENING'}
          />
        </div>

        {/* Transcript */}
        <div className="w-96 h-[500px]">
          <ConversationTranscript
            messages={transcript}
            interviewerName={session.interviewer_name}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 pt-4 text-center">
        <PhaseIndicator
          currentPhase={interview.phase}
          questionIndex={0}
          totalQuestions={session.total_questions}
        />
        <p className="text-gray-400 mt-4">{getStatusText()}</p>

        {interview.state === 'IDLE' && (
          <button
            onClick={interview.connect}
            className="mt-4 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl"
          >
            Start Interview
          </button>
        )}
      </footer>
    </div>
  )
}
```

---

## Persona Voice Mapping

Update `interviewerPersonas.ts` to include OpenAI voice mapping:

```typescript
export interface InterviewerPersona {
  id: string
  name: string
  title: string
  gender: 'male' | 'female'

  // Voice settings
  elevenLabsVoiceId: string  // DEPRECATED - keep for backwards compat
  openAIVoice: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse' | 'marin' | 'cedar'

  // Persona traits
  style: 'friendly' | 'professional' | 'direct' | 'warm'
  warmth: number  // 1-10
  strictness: number  // 1-10
  backchannelFrequency: 'low' | 'medium' | 'high'

  // Best for
  bestFor: string[]

  photoUrl: string
}

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    title: 'Senior Recruiter',
    gender: 'female',
    elevenLabsVoiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
    openAIVoice: 'coral', // Warm, friendly female
    style: 'friendly',
    warmth: 9,
    strictness: 3,
    backchannelFrequency: 'high',
    bestFor: ['startup', 'tech', 'marketing'],
    photoUrl: '/interviewers/sarah.jpg'
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    title: 'Engineering Manager',
    gender: 'male',
    elevenLabsVoiceId: 'VR6AewLTigWG4xSOukaG',
    openAIVoice: 'ash', // Professional male
    style: 'direct',
    warmth: 5,
    strictness: 7,
    backchannelFrequency: 'low',
    bestFor: ['engineering', 'technical', 'senior roles'],
    photoUrl: '/interviewers/michael.jpg'
  },
  // ... more personas
]
```

---

## Backchannel Behavior

With OpenAI Realtime API, backchannels are handled through the instruction prompt rather than separate audio calls:

```typescript
const backchannelInstructions = `
BACKCHANNEL BEHAVIOR:
- When the candidate is giving a long answer (more than 15 seconds), you may interject with brief acknowledgments
- Use phrases like: "Mm-hmm", "I see", "Right", "Okay", "Got it", "Interesting"
- Do NOT interrupt more than once per answer
- Wait for natural pauses before backchanneling
- Keep backchannels under 1 second
- Backchannels should encourage, not interrupt the flow
`
```

---

## Interruption (Barge-in) Handling

OpenAI Realtime API handles this natively with `interrupt_response: true`:

```typescript
turn_detection: {
  type: 'semantic_vad',
  eagerness: 'medium',
  create_response: true,
  interrupt_response: true  // <-- This enables barge-in
}
```

The instruction prompt guides how to handle it:

```typescript
const interruptionInstructions = `
INTERRUPTION HANDLING:
- If the candidate interrupts while you're speaking, immediately stop and listen
- After they finish, briefly acknowledge their point: "Sure, go ahead" or "Of course"
- Then address their question or comment before continuing
- Do not repeat what you were saying before the interruption
- Resume the interview flow naturally
`
```

---

## Cost Estimation

| Component | Per 15-min Interview | Notes |
|-----------|---------------------|-------|
| Audio Input (user) | $0.60 | ~10 min @ $0.06/min |
| Audio Output (AI) | $0.60 | ~2.5 min @ $0.24/min |
| Text Tokens | $0.10 | Instructions + context |
| **Total** | **~$1.30** | vs $0.60 old stack |

**Trade-off**: 2x cost for 5x better latency and native barge-in support.

---

## Migration Steps

### Phase 1: Create New Infrastructure
1. [ ] Create `/lib/hooks/useRealtimeInterview.ts`
2. [ ] Create `/lib/services/realtimeClient.ts`
3. [ ] Create `/lib/services/interviewInstructions.ts`
4. [ ] Create `/api/mock/realtime/session/route.ts`
5. [ ] Create `/api/mock/[id]/tool-response/route.ts`
6. [ ] Update `interviewerPersonas.ts` with OpenAI voice mapping

### Phase 2: Update Components
7. [ ] Refactor `/components/mock/InterviewRoom.tsx`
8. [ ] Create `/components/mock/ConnectionStatus.tsx`
9. [ ] Update `/components/mock/InterviewerCard.tsx` (minor)
10. [ ] Update `/components/mock/ConversationTranscript.tsx`

### Phase 3: Update Pages
11. [ ] Refactor `/app/dashboard/mock/[id]/page.tsx`

### Phase 4: Delete Old Files
12. [ ] Delete `/lib/clients/elevenlabsClient.ts`
13. [ ] Delete `/lib/clients/deepgramClient.ts`
14. [ ] Delete `/lib/services/conversationManager.ts`
15. [ ] Delete `/lib/hooks/useVoiceActivityDetection.ts`
16. [ ] Delete `/app/api/mock/transcribe/route.ts`
17. [ ] Delete `/app/api/mock/[id]/speak/route.ts`
18. [ ] Delete `/app/api/mock/[id]/analyze/route.ts`
19. [ ] Delete old voice preview APIs (if not used elsewhere)

### Phase 5: Testing
20. [ ] Test full interview flow
21. [ ] Test interruptions (barge-in)
22. [ ] Test all personas
23. [ ] Test error handling
24. [ ] Performance testing

---

## Environment Variables

Add to `.env.local`:
```
# OpenAI Realtime API (same key as regular OpenAI)
OPENAI_API_KEY=sk-...

# Remove or keep for other features
# ELEVENLABS_API_KEY=...  (can remove if not used elsewhere)
# DEEPGRAM_API_KEY=...    (can remove if not used elsewhere)
```

---

## Questions Before Implementation

1. **Personas**: Should we keep all 11 personas or consolidate to fewer with better-mapped voices?

2. **Transcript Storage**: Should we store the full conversation transcript in the database for the report, or just the Q&A exchanges?

3. **Fallback**: Do you want a fallback to the old stack if OpenAI Realtime fails, or just show an error?

4. **Practice Mode**: Should we update the Practice section to use the same Realtime API, or keep it separate?

5. **ElevenLabs/Deepgram**: Are these used anywhere else in the app (e.g., Practice mode, Resume reading)? If so, we should keep the clients.

---

## Approval Checklist

Please confirm:
- [ ] Architecture looks good
- [ ] State machine covers all scenarios
- [ ] File structure is clear
- [ ] Cost increase (~2x) is acceptable for better UX
- [ ] Ready to proceed with implementation
