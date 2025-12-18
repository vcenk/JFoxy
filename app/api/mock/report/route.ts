// app/api/mock/report/route.ts
// Generate comprehensive mock interview report with verdict

import { NextRequest } from 'next/server'
import { generateMockReport } from '@/lib/engines/mockReportEngine'  // lib/engines/mockReportEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
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
    const validation = validateRequiredFields(body, ['mockInterviewId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { mockInterviewId } = body

    // Get mock interview with all exchanges
    const { data: mockInterview } = await supabaseAdmin
      .from('mock_interviews')
      .select(`
        *,
        mock_interview_exchanges (
          id,
          exchange_number,
          question_type,
          question_text,
          answer_transcript,
          is_followup,
          evaluation_notes
        )
      `)
      .eq('id', mockInterviewId)
      .eq('user_id', user.id)
      .single()

    if (!mockInterview) {
      return badRequestResponse('Mock interview not found')
    }

    // Filter out exchanges without answers
    const answeredExchanges = mockInterview.mock_interview_exchanges.filter(
      (ex: any) => ex.answer_transcript
    )

    if (answeredExchanges.length === 0) {
      return badRequestResponse('No answered questions found for this interview')
    }

    // Build Q&A history for report generation
    const qaHistory = answeredExchanges.map((ex: any) => ({
      question: ex.question_text,
      answer: ex.answer_transcript,
      type: ex.question_type,
      isFollowUp: ex.is_followup,
    }))

    // Generate comprehensive report using AI engine
    const report = await generateMockReport({
      interviewType: mockInterview.focus_area,
      qaHistory,
      difficulty: mockInterview.difficulty_level,
    })

    if (!report) {
      return serverErrorResponse('Failed to generate mock interview report')
    }

    // Calculate overall score from section scores
    const sectionScores = [
      report.communication_score,
      report.technical_score,
      report.problem_solving_score,
      report.cultural_fit_score,
    ]
    const overallScore = Math.round(
      sectionScores.reduce((sum, score) => sum + score, 0) / sectionScores.length
    )

    // Update mock interview with report and status
    const { data: updatedMockInterview, error } = await supabaseAdmin
      .from('mock_interviews')
      .update({
        status: 'completed',
        overall_score: overallScore,
        communication_score: report.communication_score,
        technical_score: report.technical_score,
        problem_solving_score: report.problem_solving_score,
        cultural_fit_score: report.cultural_fit_score,
        verdict: report.verdict,
        verdict_reasoning: report.verdict_reasoning,
        top_strengths: report.top_strengths,
        critical_improvements: report.critical_improvements,
        next_steps: report.next_steps,
        completed_at: new Date().toISOString(),
      })
      .eq('id', mockInterviewId)
      .select()
      .single()

    if (error) {
      console.error('[Mock Report Update Error]:', error)
      return serverErrorResponse('Failed to update interview with report')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'mock_report',
      sessionId: mockInterviewId,
      metadata: {
        overallScore,
        verdict: report.verdict,
        totalQuestions: qaHistory.length,
      },
    })

    return successResponse({
      mockInterview: updatedMockInterview,
      report,
    })
  } catch (error) {
    console.error('[Mock Report API Error]:', error)
    return serverErrorResponse()
  }
}
