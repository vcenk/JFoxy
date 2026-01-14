// app/api/resume/create/route.ts
// Create a new blank resume

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { getAuthUser, checkUsageLimits, incrementUsage } from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check usage limits
    const limitCheck = await checkUsageLimits(user.id, 'resume')
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: limitCheck.reason, code: 'LIMIT_REACHED' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, is_base_version = true } = body

    // Create blank resume structure
    const blankContent = {
      contact: {},
      summary: '',
      experience: [],
      education: [],
      skills: {},
      projects: [],
    }

    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id: user.id,
        title: title || `Resume ${new Date().toLocaleDateString()}`,
        content: blankContent,
        is_base_version,
        raw_text: '',
      })
      .select()
      .single()

    if (error) {
      console.error('[Resume Create Error]:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create resume' },
        { status: 500 }
      )
    }

    // Increment usage counter on success
    await incrementUsage(user.id, 'resume_builds_this_month')

    return NextResponse.json({
      success: true,
      resume,
    })
  } catch (error: any) {
    console.error('[Resume Create API Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
