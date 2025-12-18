// app/api/mock/followup/route.ts
// Generate dynamic follow-up question based on candidate's answer

import { NextRequest } from 'next/server'
import { generateFollowUp } from '@/lib/engines/mockInterviewEngine'  // lib/engines/mockInterviewEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'mockInterviewId',
      'exchangeId',
      'transcript',
    ])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { mockInterviewId, exchangeId, transcript, evaluation } = body

    // Get mock interview
    const { data: mockInterview } = await supabaseAdmin
      .from('mock_interviews')
      .select('*')
      .eq('id', mockInterviewId)
      .eq('user_id', user.id)
      .single()

    if (!mockInterview) {
      return badRequestResponse('Mock interview not found')
    }

    // Get the original exchange
    const { data: exchange } = await supabaseAdmin
      .from('mock_interview_exchanges')
      .select('*')
      .eq('id', exchangeId)
      .eq('mock_interview_id', mockInterviewId)
      .single()

    if (!exchange) {
      return badRequestResponse('Exchange not found')
    }

    // Update exchange with the answer
    await supabaseAdmin
      .from('mock_interview_exchanges')
      .update({
        answer_transcript: transcript,
        evaluation_notes: evaluation,
      })
      .eq('id', exchangeId)

    // Generate follow-up question using AI engine
    const followUpQuestion = await generateFollowUp({
      question: exchange.question_text,
      transcript,
      evaluation,
    })

    // If AI returns null, it means answer was strong and no follow-up needed
    if (!followUpQuestion) {
      return successResponse({
        hasFollowUp: false,
        message: 'Answer was strong and complete. Moving to next question.',
      })
    }

    // Save follow-up as a new exchange
    const { data: followUpExchange, error: followUpError } = await supabaseAdmin
      .from('mock_interview_exchanges')
      .insert({
        mock_interview_id: mockInterviewId,
        exchange_number: exchange.exchange_number + 0.5, // Between current and next
        question_type: exchange.question_type,
        question_text: followUpQuestion,
        is_followup: true,
        parent_exchange_id: exchangeId,
      })
      .select()
      .single()

    if (followUpError) {
      console.error('[Follow-up Save Error]:', followUpError)
      return serverErrorResponse('Failed to save follow-up question')
    }

    return successResponse({
      hasFollowUp: true,
      followUp: followUpExchange,
    })
  } catch (error) {
    console.error('[Mock Follow-up API Error]:', error)
    return serverErrorResponse()
  }
}
