// app/api/mock/realtime/session/route.ts
// Generate ephemeral token and session config for OpenAI Realtime API

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse
} from '@/lib/utils/apiHelpers'
import { createEphemeralToken, OpenAIVoice } from '@/lib/services/realtimeClient'
import {
  buildInterviewInstructions,
  buildGreetingInstruction,
  InterviewerPersonaConfig
} from '@/lib/services/interviewInstructions'
import { getPersonaByVoiceId } from '@/lib/data/interviewerPersonas'

/**
 * POST /api/mock/realtime/session
 *
 * Creates an ephemeral token and returns session configuration for WebRTC connection
 *
 * Request Body:
 * - sessionId: string (mock interview session ID)
 *
 * Response:
 * - token: string (ephemeral token for WebRTC auth)
 * - voice: OpenAIVoice
 * - config: {
 *     instructions: string
 *     greetingInstruction: string
 *   }
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const { sessionId } = body

    if (!sessionId) {
      return badRequestResponse('Missing required field: sessionId')
    }

    // 1. Fetch session from database (using mock_interviews table)
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mock_interviews')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      console.error('[Realtime Session] Session not found:', sessionError)
      return badRequestResponse('Interview session not found or access denied')
    }

    if (session.status === 'completed') {
      return badRequestResponse('Interview already completed')
    }

    // 2. Get user profile for name
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const userName = profile?.full_name || 'Candidate'

    // 3. Get interviewer persona (persona_id contains the voice_id)
    const persona = getPersonaByVoiceId(session.persona_id)

    if (!persona) {
      console.error('[Realtime Session] Invalid persona ID:', session.persona_id)
      return badRequestResponse('Invalid interviewer configuration')
    }

    // 4. Map persona to OpenAI voice
    const openAIVoice = mapPersonaToOpenAIVoice(persona)

    // 5. Build persona config for instructions
    // Extract stored interviewer info from planned_questions
    const plannedQuestions = session.planned_questions || {}
    const personaConfig: InterviewerPersonaConfig = {
      name: plannedQuestions.interviewer_name || persona.name,
      title: plannedQuestions.interviewer_title || persona.default_title,
      style: persona.style || 'professional',
      warmth: persona.warmth || 6,
      strictness: persona.strictness || 5,
      backchannelFrequency: persona.backchannel_frequency || 'medium'
    }

    // 6. Extract questions from planned_questions
    const questions = plannedQuestions.questions || []

    // 7. Build instructions
    const instructions = buildInterviewInstructions({
      persona: personaConfig,
      userName,
      companyName: plannedQuestions.company_name,
      jobTitle: plannedQuestions.job_title || session.focus,
      questions,
      currentPhase: plannedQuestions.current_phase || 'welcome',
      currentQuestionIndex: plannedQuestions.current_question_index || 0
    })

    // 8. Build greeting instruction
    const greetingInstruction = buildGreetingInstruction(userName)

    // 9. Create ephemeral token from OpenAI
    console.log('[Realtime Session] Creating ephemeral token for voice:', openAIVoice)
    const tokenResponse = await createEphemeralToken({
      model: 'gpt-4o-realtime-preview',
      voice: openAIVoice,
      modalities: ['text', 'audio']
    })

    // 10. Update session status to 'in_progress' if needed
    if (session.status === 'planned') {
      await supabaseAdmin
        .from('mock_interviews')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    }

    console.log('[Realtime Session] Session ready, token expires:', new Date(tokenResponse.client_secret.expires_at * 1000))

    return successResponse({
      token: tokenResponse.client_secret.value,
      voice: openAIVoice,
      config: {
        instructions,
        greetingInstruction
      },
      session: {
        id: session.id,
        interviewerName: plannedQuestions.interviewer_name || persona.name,
        interviewerTitle: plannedQuestions.interviewer_title || persona.default_title,
        companyName: plannedQuestions.company_name,
        jobTitle: plannedQuestions.job_title || session.focus,
        totalQuestions: questions.length,
        currentPhase: plannedQuestions.current_phase || 'welcome',
        currentQuestionIndex: plannedQuestions.current_question_index || 0
      }
    })

  } catch (error) {
    console.error('[Realtime Session Error]:', error)
    return serverErrorResponse('Failed to create realtime session')
  }
}

/**
 * Map our interviewer persona to OpenAI Realtime voice
 */
function mapPersonaToOpenAIVoice(persona: any): OpenAIVoice {
  // If persona has explicit OpenAI voice mapping, use it
  if (persona.openai_voice) {
    return persona.openai_voice as OpenAIVoice
  }

  // Otherwise, map based on gender and style
  const gender = persona.gender || 'female'
  const style = persona.style || 'professional'

  // Voice mapping based on characteristics
  // Female voices: coral, shimmer, ballad, marin
  // Male voices: ash, echo, sage, verse, alloy, cedar

  if (gender === 'female') {
    switch (style) {
      case 'friendly':
      case 'warm':
        return 'coral' // Warm, friendly
      case 'professional':
        return 'shimmer' // Polished, professional
      case 'direct':
        return 'ballad' // Clear, direct
      default:
        return 'marin' // Balanced, recommended by OpenAI
    }
  } else {
    switch (style) {
      case 'friendly':
      case 'warm':
        return 'verse' // Approachable
      case 'professional':
        return 'ash' // Professional, measured
      case 'direct':
        return 'echo' // Direct, efficient
      default:
        return 'cedar' // Balanced, recommended by OpenAI
    }
  }
}
