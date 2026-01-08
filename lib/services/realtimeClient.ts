// lib/services/realtimeClient.ts
// OpenAI Realtime API Client for WebRTC-based voice interviews

import { env } from '../config/env'

const OPENAI_REALTIME_URL = 'https://api.openai.com/v1/realtime'

/**
 * Available OpenAI Realtime voices
 */
export type OpenAIVoice =
  | 'alloy'
  | 'ash'
  | 'ballad'
  | 'coral'
  | 'echo'
  | 'sage'
  | 'shimmer'
  | 'verse'
  | 'marin'
  | 'cedar'

/**
 * Interview state machine states
 */
export type InterviewState =
  | 'IDLE'
  | 'CONNECTING'
  | 'READY'
  | 'SPEAKING'
  | 'LISTENING'
  | 'THINKING'
  | 'INTERRUPTED'
  | 'COMPLETED'

/**
 * Interview phases
 */
export type InterviewPhase =
  | 'welcome'
  | 'small_talk'
  | 'company_intro'
  | 'questions'
  | 'wrap_up'
  | 'goodbye'
  | 'completed'

/**
 * Turn detection configuration
 */
export interface TurnDetectionConfig {
  type: 'server_vad' | 'semantic_vad'
  threshold?: number
  prefix_padding_ms?: number
  silence_duration_ms?: number
  create_response?: boolean
  interrupt_response?: boolean
  eagerness?: 'low' | 'medium' | 'high'
}

/**
 * Tool/Function definition for Realtime API
 */
export interface RealtimeTool {
  type: 'function'
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description?: string
      enum?: string[]
    }>
    required?: string[]
  }
}

/**
 * Session configuration for Realtime API
 */
export interface RealtimeSessionConfig {
  model?: string
  modalities?: ('text' | 'audio')[]
  voice?: OpenAIVoice
  instructions?: string
  input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw'
  output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw'
  input_audio_transcription?: {
    model: 'whisper-1'
  }
  turn_detection?: TurnDetectionConfig | null
  tools?: RealtimeTool[]
  tool_choice?: 'auto' | 'none' | 'required' | { type: 'function', name: string }
  temperature?: number
  max_response_output_tokens?: number | 'inf'
}

/**
 * Ephemeral token response from OpenAI
 */
export interface EphemeralTokenResponse {
  client_secret: {
    value: string
    expires_at: number
  }
}

/**
 * Create an ephemeral token for client-side WebRTC connection
 * This should be called from the server-side only
 */
export async function createEphemeralToken(config?: {
  model?: string
  voice?: OpenAIVoice
  modalities?: ('text' | 'audio')[]
}): Promise<EphemeralTokenResponse> {
  const response = await fetch(`${OPENAI_REALTIME_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.openai.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config?.model || 'gpt-4o-realtime-preview',
      voice: config?.voice || 'ash',
      modalities: config?.modalities || ['text', 'audio']
    })
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('[RealtimeClient] Failed to create ephemeral token:', error)
    throw new Error(`Failed to create ephemeral token: ${response.status}`)
  }

  const data = await response.json()
  console.log('[RealtimeClient] Ephemeral token created, expires:', new Date(data.client_secret.expires_at * 1000))

  return data
}

/**
 * Get the interview tools (function definitions)
 */
export function getInterviewTools(): RealtimeTool[] {
  return [
    {
      type: 'function',
      name: 'save_candidate_answer',
      description: 'Save the candidate\'s answer to the current interview question for later scoring and feedback. Call this after the candidate finishes answering each question.',
      parameters: {
        type: 'object',
        properties: {
          question_index: {
            type: 'number',
            description: 'The index of the question being answered (0-based)'
          },
          answer_summary: {
            type: 'string',
            description: 'A brief summary of what the candidate said in their answer'
          },
          used_star_method: {
            type: 'boolean',
            description: 'Whether the candidate used the STAR method (Situation, Task, Action, Result) in their answer'
          },
          answer_quality: {
            type: 'string',
            enum: ['weak', 'average', 'strong'],
            description: 'Initial assessment of the answer quality'
          }
        },
        required: ['question_index', 'answer_summary']
      }
    },
    {
      type: 'function',
      name: 'advance_phase',
      description: 'Transition to the next phase of the interview. Call this when the current phase is complete.',
      parameters: {
        type: 'object',
        properties: {
          next_phase: {
            type: 'string',
            enum: ['small_talk', 'company_intro', 'questions', 'wrap_up', 'goodbye', 'completed'],
            description: 'The phase to transition to'
          },
          reason: {
            type: 'string',
            description: 'Brief reason for the phase transition'
          }
        },
        required: ['next_phase']
      }
    },
    {
      type: 'function',
      name: 'end_interview',
      description: 'End the interview session and trigger report generation. Call this after the goodbye phase.',
      parameters: {
        type: 'object',
        properties: {
          reason: {
            type: 'string',
            enum: ['completed', 'candidate_ended', 'technical_issue'],
            description: 'Reason for ending the interview'
          },
          overall_impression: {
            type: 'string',
            description: 'Brief overall impression of the candidate\'s performance'
          }
        },
        required: ['reason']
      }
    }
  ]
}

/**
 * Get default turn detection config optimized for interviews
 */
export function getInterviewTurnDetection(): TurnDetectionConfig {
  return {
    type: 'semantic_vad',
    eagerness: 'medium',
    create_response: true,
    interrupt_response: true
  }
}

/**
 * Client event types that can be sent to the Realtime API
 */
export type ClientEventType =
  | 'session.update'
  | 'input_audio_buffer.append'
  | 'input_audio_buffer.commit'
  | 'input_audio_buffer.clear'
  | 'conversation.item.create'
  | 'conversation.item.truncate'
  | 'conversation.item.delete'
  | 'response.create'
  | 'response.cancel'

/**
 * Server event types received from the Realtime API
 */
export type ServerEventType =
  | 'error'
  | 'session.created'
  | 'session.updated'
  | 'conversation.created'
  | 'conversation.item.created'
  | 'conversation.item.input_audio_transcription.completed'
  | 'conversation.item.input_audio_transcription.failed'
  | 'conversation.item.truncated'
  | 'conversation.item.deleted'
  | 'input_audio_buffer.committed'
  | 'input_audio_buffer.cleared'
  | 'input_audio_buffer.speech_started'
  | 'input_audio_buffer.speech_stopped'
  | 'response.created'
  | 'response.done'
  | 'response.output_item.added'
  | 'response.output_item.done'
  | 'response.content_part.added'
  | 'response.content_part.done'
  | 'response.text.delta'
  | 'response.text.done'
  | 'response.audio_transcript.delta'
  | 'response.audio_transcript.done'
  | 'response.audio.delta'
  | 'response.audio.done'
  | 'response.function_call_arguments.delta'
  | 'response.function_call_arguments.done'
  | 'rate_limits.updated'

/**
 * Base server event structure
 */
export interface ServerEvent {
  type: ServerEventType
  event_id?: string
  [key: string]: unknown
}

/**
 * Function call arguments done event
 */
export interface FunctionCallDoneEvent extends ServerEvent {
  type: 'response.function_call_arguments.done'
  response_id: string
  item_id: string
  output_index: number
  call_id: string
  name: string
  arguments: string
}

/**
 * Audio transcript done event
 */
export interface AudioTranscriptDoneEvent extends ServerEvent {
  type: 'response.audio_transcript.done'
  response_id: string
  item_id: string
  output_index: number
  content_index: number
  transcript: string
}

/**
 * Input audio transcription completed event
 */
export interface InputTranscriptionCompletedEvent extends ServerEvent {
  type: 'conversation.item.input_audio_transcription.completed'
  item_id: string
  content_index: number
  transcript: string
}

/**
 * Error event
 */
export interface ErrorEvent extends ServerEvent {
  type: 'error'
  error: {
    type: string
    code?: string
    message: string
    param?: string
  }
}

/**
 * Create a session.update message
 */
export function createSessionUpdateMessage(config: RealtimeSessionConfig): string {
  return JSON.stringify({
    type: 'session.update',
    session: config
  })
}

/**
 * Create a response.create message
 */
export function createResponseMessage(options?: {
  instructions?: string
  modalities?: ('text' | 'audio')[]
}): string {
  return JSON.stringify({
    type: 'response.create',
    response: options || {}
  })
}

/**
 * Create a function call output message
 */
export function createFunctionOutputMessage(callId: string, output: unknown): string {
  return JSON.stringify({
    type: 'conversation.item.create',
    item: {
      type: 'function_call_output',
      call_id: callId,
      output: JSON.stringify(output)
    }
  })
}

/**
 * Create a response cancel message
 */
export function createResponseCancelMessage(): string {
  return JSON.stringify({
    type: 'response.cancel'
  })
}
