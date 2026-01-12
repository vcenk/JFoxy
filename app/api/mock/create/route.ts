// app/api/mock/create/route.ts
// Create New Voice-Only Mock Interview Session

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  generateInterviewQuestions,
  calculateQuestionCount,
  detectSeniorityLevel,
  extractIndustry,
  MockInterviewContext
} from '@/lib/engines/mockInterviewEngine'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  checkUsageLimits,
  trackUsage,
  validateRequiredFields,
  incrementUsage
} from '@/lib/utils/apiHelpers'
import {
  getPersonaByName,
  getRecommendedPersona,
  getPersonaTitle,
  ALL_PERSONAS
} from '@/lib/data/interviewerPersonas'

/**
 * POST /api/mock/create
 *
 * Creates a new voice mock interview session with OpenAI Realtime API
 *
 * Request Body:
 * - resumeId: string (required)
 * - jobDescriptionId?: string (optional)
 * - durationMinutes: 15 | 20 | 30 (required)
 * - voiceId?: string (optional, uses user preference if not provided)
 *
 * Response:
 * - session: Interview session data
 * - questions: Generated interview questions
 * - interviewer: Persona details (includes openaiVoice for Realtime API)
 * - jobContext: Job context for the interview
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()
    const { valid, missing } = validateRequiredFields(body, [
      'resumeId',
      'durationMinutes'
    ])

    if (!valid) {
      console.error('[Mock Create] Validation failed:', missing)
      return badRequestResponse(`Missing required fields: ${missing?.join(', ')}`)
    }

    const {
      resumeId,
      jobDescriptionId,
      durationMinutes
    } = body

    // Validate duration
    if (![15, 20, 30].includes(durationMinutes)) {
      return badRequestResponse('Duration must be 15, 20, or 30 minutes')
    }

    // 1. Check Usage Limits (Mock Interview)
    const limitCheck = await checkUsageLimits(user.id, 'mock_interview')
    if (!limitCheck.allowed) {
      console.warn('[Mock Create] Usage limit reached for user:', user.id)
      return NextResponse.json(
        {
          success: false,
          error: limitCheck.reason,
          code: 'LIMIT_REACHED'
        },
        { status: 403 }
      )
    }

    // 2. Get User Profile (for voice preferences)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('preferred_interviewer_gender, full_name, preferences')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[Mock Create] Profile fetch error:', profileError)
      // Continue with defaults
    }

    // 3. Fetch Resume
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (resumeError || !resume) {
      return badRequestResponse('Resume not found or access denied')
    }

    // 4. Fetch Job Description (if provided)
    let jobDescription: any = null
    let jobTitle = ''
    let companyName = ''

    if (jobDescriptionId) {
      const { data: jd, error: jdError } = await supabaseAdmin
        .from('job_descriptions')
        .select('*')
        .eq('id', jobDescriptionId)
        .eq('user_id', user.id)
        .single()

      if (!jdError && jd) {
        jobDescription = jd
        jobTitle = jd.title || ''
        companyName = jd.company || ''
      }
    }

    // 5. Determine Interviewer Persona
    // Read from user preferences (saved via IntegrationsTab)
    const prefs = profile?.preferences as { mockInterview?: { persona_name?: string } } | null
    let personaName = body.personaName || prefs?.mockInterview?.persona_name

    // If no persona specified, get recommended persona based on job
    if (!personaName) {
      const recommendedPersona = getRecommendedPersona(jobTitle, profile?.preferred_interviewer_gender)
      personaName = recommendedPersona.name
    }

    const persona = getPersonaByName(personaName)
    if (!persona) {
      return badRequestResponse('Invalid persona selection')
    }

    // Adjust interviewer title based on job context
    const interviewerTitle = getPersonaTitle(persona, jobTitle)

    // 6. Build Context for Question Generation
    const resumeContent = resume.content || {}
    const seniorityLevel = detectSeniorityLevel(jobTitle, resumeContent)
    const industry = extractIndustry(jobDescription?.description, resumeContent)

    const questionContext: MockInterviewContext = {
      resumeData: resumeContent,
      jobTitle,
      jobDescription: jobDescription?.description,
      companyName,
      duration: durationMinutes,
      industry,
      seniorityLevel
    }

    // 7. Generate Interview Questions
    console.log('[Mock Create] Generating questions for:', {
      duration: durationMinutes,
      seniority: seniorityLevel,
      industry
    })

    const questions = await generateInterviewQuestions(questionContext)

    if (!questions || questions.length === 0) {
      return serverErrorResponse('Failed to generate interview questions')
    }

    console.log('[Mock Create] Generated', questions.length, 'questions')

    // 8. Create Interview Session
    // Using the actual 'mock_interviews' table with correct schema
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mock_interview_sessions')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        duration_minutes: durationMinutes,
        interviewer_voice: personaName, // Persona name identifier
        interviewer_name: persona.name,
        interviewer_gender: persona.gender,
        interviewer_title: interviewerTitle,
        job_title: jobTitle || null,
        company_name: companyName,
        total_questions: questions.length,
        interview_plan: {
          questions: questions.map(q => ({
            text: q.text,
            type: q.type,
            difficulty: q.difficulty,
            expectedDuration: q.expectedDuration,
            tips: q.tips,
            focusAreas: q.focusAreas
          })),
          seniority_level: seniorityLevel,
          industry,
          duration: durationMinutes
        },
        current_phase: 'welcome',
        current_question_index: 0,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (sessionError) {
      console.error('[Mock Create] Session creation error:', sessionError)
      return serverErrorResponse('Failed to create interview session')
    }

    // 9. Create Question Exchanges (pre-populate with generated questions)
    const exchanges = questions.map((q, index) => ({
      session_id: session.id,
      question_text: q.text,
      exchange_type: q.type || 'behavioral',
      order_index: index + 1
    }))

    const { error: exchangesError } = await supabaseAdmin
      .from('mock_interview_exchanges')
      .insert(exchanges)

    if (exchangesError) {
      console.error('[Mock Create] Exchanges creation error:', exchangesError)
      // Clean up session
      await supabaseAdmin
        .from('mock_interview_sessions')
        .delete()
        .eq('id', session.id)
      return serverErrorResponse('Failed to initialize interview questions')
    }

    // 10. Track Usage
    await trackUsage({
      userId: user.id,
      resourceType: 'mock_interview',
      resourceCount: 1,
      sessionId: session.id
    })

    await incrementUsage(user.id, 'mock_interviews_this_month')

    // 11. Return Success
    return successResponse({
      session: {
        id: session.id,
        status: session.status,
        currentPhase: 'welcome',
        durationMinutes: session.duration_minutes,
        totalQuestions: questions.length,
        createdAt: session.created_at
      },
      interviewer: {
        name: persona.name,
        title: interviewerTitle,
        personaName,
        openaiVoice: persona.openai_voice, // OpenAI Realtime voice
        gender: persona.gender,
        personality: persona.personality
      },
      questions: questions.map(q => ({
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        tips: q.tips
      })),
      jobContext: {
        title: jobTitle || 'General Interview',
        company: companyName || 'Company',
        industry
      }
    })

  } catch (error) {
    console.error('[Mock Create Error]:', error)
    return serverErrorResponse('An unexpected error occurred while creating the interview')
  }
}
