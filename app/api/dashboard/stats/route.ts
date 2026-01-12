// app/api/dashboard/stats/route.ts
// Aggregated stats for the main dashboard

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
    // 1. Fetch counts and latest timestamps in parallel
    const [
      { count: resumeCount, data: resumes },
      { count: swotCount, data: swots },
      { count: starCount, data: stars },
      { count: gapCount, data: gaps },
      { count: pitchCount, data: pitches },
      { count: mockCount },
      { count: coverLetterCount },
      { data: allResumes }
    ] = await Promise.all([
      supabaseAdmin.from('resumes').select('created_at, title', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('swot_analyses').select('created_at', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('star_stories').select('created_at, title', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('gap_defenses').select('created_at, gap_type', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('intro_pitches').select('created_at', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
      supabaseAdmin.from('mock_interview_sessions').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabaseAdmin.from('cover_letters').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabaseAdmin.from('resumes').select('ats_score').eq('user_id', user.id).not('ats_score', 'is', null)
    ])

    // Calculate Avg ATS Score
    let avgAtsScore = 0
    if (allResumes && allResumes.length > 0) {
      const total = allResumes.reduce((sum, r) => sum + (r.ats_score || 0), 0)
      avgAtsScore = Math.round(total / allResumes.length)
    }

    // 2. Calculate Readiness Score (Simple Heuristic)
    // Max 100
    // Resume: 20 pts
    // SWOT: 15 pts
    // STAR (at least 3): 30 pts (10 each)
    // Gap Defense (if any): 15 pts
    // Intro Pitch: 20 pts
    
    let score = 0
    if ((resumeCount || 0) > 0) score += 20
    if ((swotCount || 0) > 0) score += 15
    if ((starCount || 0) >= 3) score += 30
    else score += (starCount || 0) * 10
    if ((gapCount || 0) > 0) score += 15
    if ((pitchCount || 0) > 0) score += 20

    if (score > 100) score = 100

    // 3. Compile Recent Activity
    const activities = []

    if (resumes && resumes.length > 0) {
      activities.push({
        type: 'resume',
        title: `Resume Uploaded: ${resumes[0].title}`,
        date: new Date(resumes[0].created_at),
        href: '/dashboard/resume'
      })
    }
    if (swots && swots.length > 0) {
      activities.push({
        type: 'swot',
        title: 'SWOT Analysis Generated',
        date: new Date(swots[0].created_at),
        href: '/dashboard/coaching'
      })
    }
    if (stars && stars.length > 0) {
      activities.push({
        type: 'star',
        title: `STAR Story: ${stars[0].title}`,
        date: new Date(stars[0].created_at),
        href: '/dashboard/coaching'
      })
    }
    if (gaps && gaps.length > 0) {
      activities.push({
        type: 'gap',
        title: `Gap Defense: ${gaps[0].gap_type}`,
        date: new Date(gaps[0].created_at),
        href: '/dashboard/coaching'
      })
    }
    if (pitches && pitches.length > 0) {
      activities.push({
        type: 'pitch',
        title: 'Intro Pitch Created',
        date: new Date(pitches[0].created_at),
        href: '/dashboard/coaching'
      })
    }

    // Sort by date desc and take top 3
    activities.sort((a, b) => b.date.getTime() - a.date.getTime())
    const recentActivity = activities.slice(0, 3)

    return successResponse({
      readinessScore: score,
      counts: {
        resumes: resumeCount,
        swot: swotCount,
        stars: starCount,
        gaps: gapCount,
        pitches: pitchCount,
        mocks: mockCount,
        coverLetters: coverLetterCount
      },
      avgAtsScore,
      recentActivity
    })
  } catch (error) {
    console.error('[Dashboard Stats Error]:', error)
    return serverErrorResponse()
  }
}
