// app/api/mock/plan/route.ts
// Generate mock interview plan with structured questions

import { NextRequest } from 'next/server'
import { generateInterviewPlan } from '@/lib/engines/mockInterviewEngine'  // lib/engines/mockInterviewEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  checkUsageLimits,
  trackUsage,
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
    const validation = validateRequiredFields(body, ['resumeId', 'durationMinutes'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, jobDescriptionId, durationMinutes, personaId, focus, difficulty } = body

    // Check usage limits for mock interviews
    const limitCheck = await checkUsageLimits(user.id, 'mock_interviews')
    if (!limitCheck.allowed) {
      return badRequestResponse(limitCheck.message || 'Mock interview limit reached')
    }

    // Get resume
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('raw_text')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return badRequestResponse('Resume not found')
    }

    // Get job description if provided
    let jobText: string | undefined
    if (jobDescriptionId) {
      const { data: jd } = await supabaseAdmin
        .from('job_descriptions')
        .select('description')
        .eq('id', jobDescriptionId)
        .eq('user_id', user.id)
        .single()

      jobText = jd?.description
    }

    // Generate interview plan using AI engine
    const plan = await generateInterviewPlan({
      resumeSummary: resume.raw_text,
      jobSummary: jobText,
      personaId: personaId || 'professional',
      durationMinutes: durationMinutes || 30,
      focus: focus || 'balanced',
      difficulty: difficulty || 'medium',
    })

    if (!plan) {
      return serverErrorResponse('Failed to generate interview plan')
    }

    // Create mock interview session
    const { data: mockInterview, error: mockError } = await supabaseAdmin
      .from('mock_interviews')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        interviewer_persona: personaId || 'professional',
        difficulty_level: difficulty || 'medium',
        duration_minutes: durationMinutes,
        focus_area: focus || 'balanced',
        status: 'in_progress',
        intro_text: plan.intro,
        closing_text: plan.closing,
      })
      .select()
      .single()

    if (mockError || !mockInterview) {
      console.error('[Mock Interview Create Error]:', mockError)
      return serverErrorResponse('Failed to create mock interview')
    }

    // Save all questions as exchanges (with null answer for now)
    const allQuestions = [
      ...plan.behavioral_questions.map((q) => ({ text: q, type: 'behavioral' })),
      ...plan.technical_questions.map((q) => ({ text: q, type: 'technical' })),
      ...plan.situational_questions.map((q) => ({ text: q, type: 'situational' })),
    ]

    const exchangeInserts = allQuestions.map((q, index) => ({
      mock_interview_id: mockInterview.id,
      exchange_number: index + 1,
      question_type: q.type,
      question_text: q.text,
      is_followup: false,
    }))

    const { error: exchangesError } = await supabaseAdmin
      .from('mock_interview_exchanges')
      .insert(exchangeInserts)

    if (exchangesError) {
      console.error('[Mock Exchanges Save Error]:', exchangesError)
      return serverErrorResponse('Failed to save interview questions')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'mock_interviews',
      resourceCount: 1,
      sessionId: mockInterview.id,
      metadata: { durationMinutes, difficulty, focus },
    })

    return successResponse({
      mockInterview,
      plan,
    })
  } catch (error) {
    console.error('[Mock Plan API Error]:', error)
    return serverErrorResponse()
  }
}
