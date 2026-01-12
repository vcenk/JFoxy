// app/api/admin/analytics/route.ts
// Admin analytics endpoint

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  try {
    // Check if user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return Response.json(
        { success: false, error: 'Access denied. Admin only.' },
        { status: 403 }
      )
    }

    // Fetch all analytics data in parallel
    const [
      usersResult,
      resumesResult,
      coverLettersResult,
      practiceSessionsResult,
      mockInterviewsResult,
      jobDescriptionsResult,
      starStoriesResult,
      swotAnalysesResult,
    ] = await Promise.all([
      // Total users with full details
      supabaseAdmin
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          created_at,
          subscription_status,
          subscription_tier,
          stripe_customer_id,
          stripe_subscription_id,
          resume_builds_this_month,
          job_analyses_this_month,
          audio_practice_sessions_this_month,
          mock_interviews_this_month,
          monthly_video_credits,
          purchased_video_credits,
          last_login_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false }),

      // Total resumes
      supabaseAdmin
        .from('resumes')
        .select('id, user_id, title, created_at', { count: 'exact' }),

      // Total cover letters
      supabaseAdmin
        .from('cover_letters')
        .select('id, user_id, title, created_at', { count: 'exact' }),

      // Total practice sessions
      supabaseAdmin
        .from('practice_sessions')
        .select('id, user_id, status, average_score, created_at', { count: 'exact' }),

      // Total mock interviews
      supabaseAdmin
        .from('mock_interview_sessions')
        .select('id, user_id, status, overall_score, created_at', { count: 'exact' }),

      // Total job descriptions
      supabaseAdmin
        .from('job_descriptions')
        .select('id, user_id, title, created_at', { count: 'exact' }),

      // Total STAR stories
      supabaseAdmin
        .from('star_stories')
        .select('id, user_id, title, created_at', { count: 'exact' }),

      // Total SWOT analyses
      supabaseAdmin
        .from('swot_analyses')
        .select('id, user_id, created_at', { count: 'exact' }),
    ])

    // Get subscription breakdown
    const subscriptionBreakdown = {
      free: 0,
      active: 0,
      trialing: 0,
      canceled: 0,
      past_due: 0,
    }

    usersResult.data?.forEach((user: any) => {
      const status = user.subscription_status || 'free'
      if (status in subscriptionBreakdown) {
        subscriptionBreakdown[status as keyof typeof subscriptionBreakdown]++
      }
    })

    // Get practice sessions breakdown
    const practiceBreakdown = {
      completed: 0,
      in_progress: 0,
      abandoned: 0,
    }

    practiceSessionsResult.data?.forEach((session: any) => {
      const status = session.status || 'in_progress'
      if (status in practiceBreakdown) {
        practiceBreakdown[status as keyof typeof practiceBreakdown]++
      }
    })

    // Get mock interviews breakdown
    const mockBreakdown = {
      completed: 0,
      in_progress: 0,
      planned: 0,
      abandoned: 0,
    }

    mockInterviewsResult.data?.forEach((interview: any) => {
      const status = interview.status || 'planned'
      if (status in mockBreakdown) {
        mockBreakdown[status as keyof typeof mockBreakdown]++
      }
    })

    // Calculate average scores
    const completedPractices = practiceSessionsResult.data?.filter(
      (s: any) => s.status === 'completed' && s.average_score !== null
    )
    const avgPracticeScore =
      completedPractices && completedPractices.length > 0
        ? Math.round(
            completedPractices.reduce((sum: number, s: any) => sum + (s.average_score || 0), 0) /
              completedPractices.length
          )
        : 0

    const completedMocks = mockInterviewsResult.data?.filter(
      (m: any) => m.status === 'completed' && m.overall_score !== null
    )
    const avgMockScore =
      completedMocks && completedMocks.length > 0
        ? Math.round(
            completedMocks.reduce((sum: number, m: any) => sum + (m.overall_score || 0), 0) /
              completedMocks.length
          )
        : 0

    // Get recent activity (last 10 items)
    const recentUsers = usersResult.data
      ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const recentResumes = resumesResult.data
      ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const analytics = {
      totals: {
        users: usersResult.count || 0,
        resumes: resumesResult.count || 0,
        coverLetters: coverLettersResult.count || 0,
        practiceSessions: practiceSessionsResult.count || 0,
        mockInterviews: mockInterviewsResult.count || 0,
        jobDescriptions: jobDescriptionsResult.count || 0,
        starStories: starStoriesResult.count || 0,
        swotAnalyses: swotAnalysesResult.count || 0,
      },
      subscriptions: subscriptionBreakdown,
      practices: {
        ...practiceBreakdown,
        avgScore: avgPracticeScore,
      },
      mocks: {
        ...mockBreakdown,
        avgScore: avgMockScore,
      },
      recentActivity: {
        users: recentUsers,
        resumes: recentResumes,
      },
      allUsers: usersResult.data || [],
    }

    return successResponse({ analytics })
  } catch (error) {
    console.error('[Admin Analytics Error]:', error)
    return serverErrorResponse()
  }
}
