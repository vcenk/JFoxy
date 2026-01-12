// app/api/mock/[id]/analyze/route.ts
// Analyze User's Answer Using AI

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  analyzeAnswer,
  AnswerAnalysis
} from '@/lib/engines/mockInterviewEngine'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields
} from '@/lib/utils/apiHelpers'

/**
 * POST /api/mock/[id]/analyze
 *
 * Analyzes user's answer using AI and STAR framework
 *
 * Request Body:
 * - questionId: string (exchange ID)
 * - userAnswer: string (transcribed answer)
 * - questionIndex?: number (optional, for fetching question from session)
 *
 * Response:
 * - analysis: AnswerAnalysis object
 * - saved: boolean (whether analysis was saved to database)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const sessionId = params.id

  try {
    const body = await req.json()
    const { questionId, userAnswer, questionIndex } = body

    if (!userAnswer) {
      return badRequestResponse('Missing required field: userAnswer')
    }

    // 1. Fetch Session (using mock_interviews table)
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('mock_interview_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return badRequestResponse('Interview session not found or access denied')
    }

    const interviewPlan = session.interview_plan || {}

    // 2. Get Question Details
    let question: any
    let questionText = ''
    let questionType = 'behavioral'

    if (questionId) {
      // Fetch from exchanges table
      const { data: exchange, error: exchangeError } = await supabaseAdmin
        .from('mock_interview_exchanges')
        .select('*')
        .eq('id', questionId)
        .eq('session_id', sessionId)
        .single()

      if (exchangeError || !exchange) {
        return badRequestResponse('Question not found')
      }

      question = exchange
      questionText = exchange.question_text
      questionType = exchange.exchange_type || 'behavioral'
    } else if (questionIndex !== undefined) {
      // Get from session's interview_plan
      const questions = interviewPlan.questions || []
      if (questionIndex >= questions.length) {
        return badRequestResponse('Invalid question index')
      }
      question = questions[questionIndex]
      questionText = question.text
      questionType = question.type || 'behavioral'
    } else {
      return badRequestResponse('Either questionId or questionIndex is required')
    }

    // 3. Get Resume Context (optional but helpful for analysis)
    let resumeContext: string | undefined
    if (session.resume_id) {
      const { data: resume } = await supabaseAdmin
        .from('resumes')
        .select('content')
        .eq('id', session.resume_id)
        .single()

      if (resume?.content) {
        resumeContext = JSON.stringify(resume.content)
      }
    }

    // 4. Get Job Context (optional)
    let jobContext: string | undefined
    if (session.job_description_id) {
      const { data: jd } = await supabaseAdmin
        .from('job_descriptions')
        .select('description, title, company')
        .eq('id', session.job_description_id)
        .single()

      if (jd) {
        jobContext = `
Job Title: ${jd.title}
Company: ${jd.company}
Description: ${jd.description}
`.trim()
      }
    }

    console.log('[Analyze] Analyzing answer for question:', questionText.substring(0, 50))

    // 5. Analyze Answer with AI
    const analysis: AnswerAnalysis = await analyzeAnswer({
      question: questionText,
      questionType,
      userAnswer,
      resumeContext,
      jobContext
    })

    console.log('[Analyze] Analysis complete, score:', analysis.score)

    // 6. Save Analysis to Exchange (if questionId provided)
    if (questionId) {
      const { error: updateError } = await supabaseAdmin
        .from('mock_interview_exchanges')
        .update({
          user_answer_text: userAnswer,
          answer_score: analysis.score,
          star_components: {
            situation: analysis.starAnalysis?.hasSituation || false,
            task: analysis.starAnalysis?.hasTask || false,
            action: analysis.starAnalysis?.hasAction || false,
            result: analysis.starAnalysis?.hasResult || false
          },
          analyzed_at: new Date().toISOString()
        })
        .eq('id', questionId)

      if (updateError) {
        console.error('[Analyze] Failed to save analysis:', updateError)
        return NextResponse.json(
          {
            success: true,
            analysis,
            saved: false,
            warning: 'Analysis generated but not saved to database'
          },
          { status: 200 }
        )
      }

      console.log('[Analyze] Saved analysis to exchange:', questionId)
    }

    // 7. Return Analysis
    return successResponse({
      analysis,
      saved: !!questionId,
      metadata: {
        sessionId,
        questionText: questionText.substring(0, 100),
        answerLength: userAnswer.length,
        hasResumeContext: !!resumeContext,
        hasJobContext: !!jobContext
      }
    })

  } catch (error) {
    console.error('[Analyze Error]:', error)
    return serverErrorResponse('An unexpected error occurred while analyzing the answer')
  }
}
