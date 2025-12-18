// app/api/resume/duplicate/route.ts
// Duplicate an existing resume

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { getAuthUser } from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { resumeId } = body

    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: 'Missing resumeId' },
        { status: 400 }
      )
    }

    // Fetch the original resume
    const { data: originalResume, error: fetchError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !originalResume) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Create duplicate
    const { data: duplicateResume, error: createError } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id: user.id,
        title: `${originalResume.title} (Copy)`,
        content: originalResume.content,
        raw_text: originalResume.raw_text,
        is_base_version: originalResume.is_base_version,
        source_resume_id: originalResume.is_base_version ? null : originalResume.source_resume_id,
      })
      .select()
      .single()

    if (createError) {
      console.error('[Resume Duplicate Error]:', createError)
      return NextResponse.json(
        { success: false, error: 'Failed to duplicate resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resume: duplicateResume,
    })
  } catch (error: any) {
    console.error('[Resume Duplicate API Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
