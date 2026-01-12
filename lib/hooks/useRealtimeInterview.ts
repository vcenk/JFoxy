// lib/hooks/useRealtimeInterview.ts
// WebRTC hook for OpenAI Realtime Voice API mock interviews

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  InterviewState,
  InterviewPhase,
  RealtimeSessionConfig,
  ServerEvent,
  FunctionCallDoneEvent,
  AudioTranscriptDoneEvent,
  InputTranscriptionCompletedEvent,
  ErrorEvent,
  createSessionUpdateMessage,
  createResponseMessage,
  createFunctionOutputMessage,
  getInterviewTools,
  getInterviewTurnDetection
} from '@/lib/services/realtimeClient'

export interface TranscriptMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

export interface UseRealtimeInterviewOptions {
  sessionId: string
  onStateChange?: (state: InterviewState) => void
  onPhaseChange?: (phase: InterviewPhase) => void
  onTranscript?: (message: TranscriptMessage) => void
  onError?: (error: Error) => void
  onComplete?: () => void
  onFunctionCall?: (name: string, args: Record<string, unknown>) => Promise<unknown>
}

export interface UseRealtimeInterviewReturn {
  // State
  state: InterviewState
  phase: InterviewPhase
  isConnected: boolean
  isSpeaking: boolean
  isListening: boolean
  error: string | null

  // Transcript
  transcript: TranscriptMessage[]

  // Audio levels (0-1)
  userAudioLevel: number
  aiAudioLevel: number

  // Actions
  connect: () => Promise<void>
  disconnect: () => void
  interrupt: () => void
}

export function useRealtimeInterview(options: UseRealtimeInterviewOptions): UseRealtimeInterviewReturn {
  const {
    sessionId,
    onStateChange,
    onPhaseChange,
    onTranscript,
    onError,
    onComplete,
    onFunctionCall
  } = options

  // State
  const [state, setState] = useState<InterviewState>('IDLE')
  const [phase, setPhase] = useState<InterviewPhase>('welcome')
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [userAudioLevel, setUserAudioLevel] = useState(0)
  const [aiAudioLevel, setAiAudioLevel] = useState(0)

  // Refs
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const connectingRef = useRef(false) // Prevent double connection attempts

  // State refs for callbacks
  const stateRef = useRef(state)
  const phaseRef = useRef(phase)

  // Sync state refs
  useEffect(() => {
    stateRef.current = state
    onStateChange?.(state)
  }, [state, onStateChange])

  useEffect(() => {
    phaseRef.current = phase
    onPhaseChange?.(phase)
  }, [phase, onPhaseChange])

  // Update state helper
  const updateState = useCallback((newState: InterviewState) => {
    console.log('[RealtimeInterview] State:', stateRef.current, '→', newState)
    setState(newState)
  }, [])

  // Add transcript message
  const addTranscript = useCallback((role: 'user' | 'assistant', text: string) => {
    const message: TranscriptMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      text,
      timestamp: new Date()
    }
    setTranscript(prev => [...prev, message])
    onTranscript?.(message)
  }, [onTranscript])

  // Handle server events from data channel
  const handleServerEvent = useCallback(async (event: ServerEvent) => {
    console.log('[RealtimeInterview] Event:', event.type)

    switch (event.type) {
      case 'session.created':
        console.log('[RealtimeInterview] Session created')
        break

      case 'session.updated':
        console.log('[RealtimeInterview] Session updated')
        break

      case 'input_audio_buffer.speech_started':
        // User started speaking
        updateState('LISTENING')
        break

      case 'input_audio_buffer.speech_stopped':
        // User stopped speaking, AI will process
        updateState('THINKING')
        break

      case 'response.created':
        // AI is preparing response
        if (stateRef.current !== 'THINKING') {
          updateState('THINKING')
        }
        break

      case 'response.audio.delta':
        // AI is speaking (audio chunk received)
        if (stateRef.current !== 'SPEAKING') {
          updateState('SPEAKING')
        }
        // Simulate audio level
        setAiAudioLevel(0.3 + Math.random() * 0.5)
        break

      case 'response.audio.done':
        // AI finished this audio segment
        setAiAudioLevel(0)
        break

      case 'response.done':
        // AI finished entire response
        updateState('READY')
        setAiAudioLevel(0)
        break

      case 'response.audio_transcript.done': {
        // AI's spoken text (for transcript)
        const transcriptEvent = event as AudioTranscriptDoneEvent
        if (transcriptEvent.transcript) {
          addTranscript('assistant', transcriptEvent.transcript)
        }
        break
      }

      case 'conversation.item.input_audio_transcription.completed': {
        // User's spoken text (for transcript)
        const inputEvent = event as InputTranscriptionCompletedEvent
        if (inputEvent.transcript) {
          addTranscript('user', inputEvent.transcript)
        }
        break
      }

      case 'response.function_call_arguments.done': {
        // Function call from AI
        const funcEvent = event as FunctionCallDoneEvent
        await handleFunctionCall(funcEvent)
        break
      }

      case 'error': {
        const errorEvent = event as ErrorEvent
        console.error('[RealtimeInterview] Error:', errorEvent.error)
        setError(errorEvent.error.message)
        onError?.(new Error(errorEvent.error.message))
        break
      }

      case 'rate_limits.updated':
        // Rate limit info - can log for monitoring
        break

      default:
        // Log unhandled events for debugging
        if (!event.type.includes('delta')) {
          console.log('[RealtimeInterview] Unhandled event:', event.type)
        }
    }
  }, [updateState, addTranscript, onError])

  // Handle function calls from AI
  const handleFunctionCall = useCallback(async (event: FunctionCallDoneEvent) => {
    const { name, arguments: argsJson, call_id } = event
    console.log('[RealtimeInterview] Function call:', name, argsJson)

    try {
      const args = JSON.parse(argsJson)
      let result: unknown = { success: true }

      switch (name) {
        case 'save_candidate_answer':
          // Call backend to save answer
          if (onFunctionCall) {
            result = await onFunctionCall(name, args)
          } else {
            // Default: call our API
            await fetch(`/api/mock/${sessionId}/tool-response`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tool: name, ...args })
            })
          }
          break

        case 'advance_phase':
          const newPhase = args.next_phase as InterviewPhase
          setPhase(newPhase)

          // Call backend to update phase
          await fetch(`/api/mock/${sessionId}/tool-response`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: name, ...args })
          })
          break

        case 'end_interview':
          // Call backend to complete interview
          await fetch(`/api/mock/${sessionId}/tool-response`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tool: name, ...args })
          })

          // Trigger completion
          updateState('COMPLETED')
          onComplete?.()
          return // Don't send function output, we're done
      }

      // Send function output back to continue conversation
      if (dcRef.current?.readyState === 'open') {
        dcRef.current.send(createFunctionOutputMessage(call_id, result))
        // Trigger next response
        dcRef.current.send(createResponseMessage())
      }
    } catch (err) {
      console.error('[RealtimeInterview] Function call error:', err)
      // Send error result
      if (dcRef.current?.readyState === 'open') {
        dcRef.current.send(createFunctionOutputMessage(call_id, { error: String(err) }))
        dcRef.current.send(createResponseMessage())
      }
    }
  }, [sessionId, onFunctionCall, updateState, onComplete])

  // Setup audio level monitoring for user input
  const setupAudioMonitoring = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      const updateLevel = () => {
        if (!analyserRef.current) return

        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length
        const level = Math.min(1, average / 128)
        setUserAudioLevel(level)

        animationFrameRef.current = requestAnimationFrame(updateLevel)
      }

      updateLevel()
    } catch (err) {
      console.error('[RealtimeInterview] Audio monitoring error:', err)
    }
  }, [])

  // Connect to OpenAI Realtime API
  const connect = useCallback(async () => {
    // GUARD: Prevent double connection attempts (React StrictMode/Fast Refresh)
    if (connectingRef.current || stateRef.current !== 'IDLE') {
      console.warn('[RealtimeInterview] Already connecting/connected, ref:', connectingRef.current, 'state:', stateRef.current)
      return
    }
    connectingRef.current = true

    try {
      updateState('CONNECTING')
      setError(null)

      // 1. Get ephemeral token and config from our backend
      console.log('[RealtimeInterview] Fetching session config...')
      const sessionResponse = await fetch('/api/mock/realtime/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to get session configuration')
      }

      const sessionData = await sessionResponse.json()
      console.log('[RTC Debug] Response structure:', {
        hasData: !!sessionData.data,
        hasSuccess: !!sessionData.success,
        dataKeys: sessionData.data ? Object.keys(sessionData.data) : [],
        topLevelKeys: Object.keys(sessionData)
      })

      const { token, config, voice } = sessionData.data || sessionData
      console.log('[RTC Debug] Extracted values:', {
        hasToken: !!token,
        tokenPrefix: token ? token.substring(0, 10) + '...' : 'MISSING',
        voice,
        hasConfig: !!config
      })

      // GUARD: Validate token
      if (!token) {
        throw new Error('Ephemeral token missing from session response')
      }

      // 2. Get user media (microphone)
      console.log('[RealtimeInterview] Requesting microphone...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      localStreamRef.current = stream
      setupAudioMonitoring(stream)

      // 3. Create RTCPeerConnection
      console.log('[RealtimeInterview] Creating peer connection...')
      const pc = new RTCPeerConnection()
      pcRef.current = pc

      // 4. Handle remote audio (AI speaking)
      pc.ontrack = (event) => {
        console.log('[RealtimeInterview] Remote track received')
        if (!remoteAudioRef.current) {
          remoteAudioRef.current = new Audio()
          remoteAudioRef.current.autoplay = true
        }
        remoteAudioRef.current.srcObject = event.streams[0]
      }

      // 5. Add local audio track
      const audioTrack = stream.getAudioTracks()[0]
      pc.addTrack(audioTrack, stream)

      // 6. Create data channel for events
      console.log('[RealtimeInterview] Creating data channel...')
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc

      dc.onopen = () => {
        console.log('[RealtimeInterview] Data channel open')

        // Send session configuration
        const sessionConfig: RealtimeSessionConfig = {
          modalities: ['text', 'audio'],
          voice,
          instructions: config.instructions,
          input_audio_transcription: { model: 'whisper-1' },
          turn_detection: getInterviewTurnDetection(),
          tools: getInterviewTools(),
          tool_choice: 'auto',
          temperature: 0.7
        }

        dc.send(createSessionUpdateMessage(sessionConfig))

        // Small delay then trigger initial greeting
        setTimeout(() => {
          dc.send(createResponseMessage({
            instructions: config.greetingInstruction
          }))
          updateState('READY')
        }, 500)
      }

      dc.onmessage = (event) => {
        try {
          const serverEvent = JSON.parse(event.data) as ServerEvent
          handleServerEvent(serverEvent)
        } catch (err) {
          console.error('[RealtimeInterview] Failed to parse event:', err)
        }
      }

      dc.onerror = (event) => {
        console.error('[RealtimeInterview] Data channel error:', event)
        setError('Connection error')
      }

      dc.onclose = () => {
        console.log('[RealtimeInterview] Data channel closed')
      }

      // 7. Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('[RealtimeInterview] Connection state:', pc.connectionState)
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setError('Connection lost')
          updateState('IDLE')
        }
      }

      // 8. Create and set local offer
      console.log('[RTC] Creating offer...')
      const offer = await pc.createOffer()
      console.log('[RTC] Offer created successfully')

      await pc.setLocalDescription(offer)
      console.log('[RTC] Local description set')

      // 9. Wait for ICE gathering to complete
      console.log('[RTC] Waiting for ICE gathering... (state:', pc.iceGatheringState, ')')
      if (pc.iceGatheringState !== 'complete') {
        await new Promise<void>((resolve) => {
          const onStateChange = () => {
            console.log('[RTC] ICE gathering state:', pc.iceGatheringState)
            if (pc.iceGatheringState === 'complete') {
              pc.removeEventListener('icegatheringstatechange', onStateChange)
              resolve()
            }
          }
          pc.addEventListener('icegatheringstatechange', onStateChange)

          // Timeout after 5 seconds
          setTimeout(() => {
            pc.removeEventListener('icegatheringstatechange', onStateChange)
            console.log('[RTC] ICE gathering timeout, proceeding anyway')
            resolve()
          }, 5000)
        })
      }
      console.log('[RTC] ICE gathering complete')

      // 10. Send offer to OpenAI as FormData
      console.log('[RTC] Sending SDP to OpenAI...')
      console.log('[RTC] Authorization header:', token ? `Bearer ${token.substring(0, 15)}...` : 'MISSING TOKEN')

      const formData = new FormData()
      formData.append('sdp', offer.sdp || '')

      const sdpResponse = await fetch(
        'https://api.openai.com/v1/realtime/calls',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'OpenAI-Beta': 'realtime=v1'
          },
          body: formData
        }
      )

      console.log('[RTC] SDP response status:', sdpResponse.status, sdpResponse.statusText)

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text()
        console.error('[RTC] SDP request failed:', sdpResponse.status, errorText)
        throw new Error(`OpenAI connection failed: ${sdpResponse.status} ${errorText}`)
      }

      const answerSdp = await sdpResponse.text()
      console.log('[RTC] Got SDP answer from OpenAI')

      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp })
      console.log('[RTC] Remote description set - Connection established!')

      connectingRef.current = false // Reset on success

    } catch (err) {
      console.error('[RealtimeInterview] Connection error:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      onError?.(err instanceof Error ? err : new Error('Connection failed'))
      updateState('IDLE')
      cleanup()
    }
  }, [sessionId, updateState, setupAudioMonitoring, handleServerEvent, onError])

  // Cleanup resources
  const cleanup = useCallback(() => {
    // GUARD: Don't cleanup during CONNECTING (prevents Fast Refresh issues)
    if (stateRef.current === 'CONNECTING') {
      console.log('[RealtimeInterview] Skipping cleanup - currently CONNECTING')
      return
    }

    console.log('[RealtimeInterview] Cleaning up...')

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null
      remoteAudioRef.current = null
    }

    if (dcRef.current) {
      dcRef.current.close()
      dcRef.current = null
    }

    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }

    setUserAudioLevel(0)
    setAiAudioLevel(0)
  }, [])

  // Disconnect
  const disconnect = useCallback(() => {
    cleanup()
    updateState('COMPLETED')
  }, [cleanup, updateState])

  // Interrupt AI (barge-in)
  const interrupt = useCallback(() => {
    if (stateRef.current === 'SPEAKING' && dcRef.current?.readyState === 'open') {
      console.log('[RealtimeInterview] Interrupting AI')
      dcRef.current.send(JSON.stringify({ type: 'response.cancel' }))
      updateState('INTERRUPTED')
    }
  }, [updateState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    state,
    phase,
    isConnected: state !== 'IDLE' && state !== 'CONNECTING' && state !== 'COMPLETED',
    isSpeaking: state === 'SPEAKING',
    isListening: state === 'LISTENING',
    error,
    transcript,
    userAudioLevel,
    aiAudioLevel,
    connect,
    disconnect,
    interrupt
  }
}
