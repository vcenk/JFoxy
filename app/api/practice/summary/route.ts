// app/api/practice/summary/route.ts
// Generate AI summary for completed practice session

import { NextRequest } from 'next/server'
import { generatePracticeSummary } from '@/lib/engines/practiceSummaryEngine'  // lib/engines/practiceSummaryEngine.ts
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
    const validation = validateRequiredFields(body, ['practiceSessionId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { practiceSessionId } = body

    // Get practice session with all questions and answers
    const { data: session } = await supabaseAdmin
      .from('practice_sessions')
      .select(`
        *,
        practice_questions (
          id,
          question_text,
          question_type,
          practice_answers (
            transcript,
            score_overall,
            score_clarity,
            score_relevance,
            score_impact,
            has_situation,
            has_task,
            has_action,
            has_result,
            strengths,
            improvements
          )
        )
      `)
      .eq('id', practiceSessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return badRequestResponse('Practice session not found')
    }

    // Build Q&A pairs for the summary engine
    const qaHistory = session.practice_questions
      .filter((q: any) => q.practice_answers && q.practice_answers.length > 0)
      .map((q: any) => ({
        question: q.question_text,
        answer: q.practice_answers[0].transcript,
        score: q.practice_answers[0].score_overall,
      }))

    if (qaHistory.length === 0) {
      return badRequestResponse('No answers found for this session')
    }

    // Generate summary using AI engine
    const summary = await generatePracticeSummary({
      sessionType: session.session_type,
      qaHistory,
    })

    if (!summary) {
      return serverErrorResponse('Failed to generate practice summary')
    }

    // Calculate overall session score
    const totalScore = qaHistory.reduce((sum: number, qa: any) => sum + (qa.score || 0), 0)
    const averageScore = Math.round(totalScore / qaHistory.length)

    // Update session with summary and status
    const { data: updatedSession, error } = await supabaseAdmin
      .from('practice_sessions')
      .update({
        status: 'completed',
        overall_score: averageScore,
        summary_strengths: summary.top_strengths,
        summary_improvements: summary.areas_for_improvement,
        summary_next_steps: summary.recommended_next_steps,
        completed_at: new Date().toISOString(),
      })
      .eq('id', practiceSessionId)
      .select()
      .single()

    if (error) {
      console.error('[Practice Session Update Error]:', error)
      return serverErrorResponse('Failed to update session with summary')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'practice_summary',
      sessionId: practiceSessionId,
      metadata: { averageScore, totalQuestions: qaHistory.length },
    })

    return successResponse({
      session: updatedSession,
      summary,
      averageScore,
    })
  } catch (error) {
    console.error('[Practice Summary API Error]:', error)
    return serverErrorResponse()
  }
}
