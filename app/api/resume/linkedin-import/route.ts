// app/api/resume/linkedin-import/route.ts
// API endpoint to import LinkedIn profile data

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { parseLinkedInProfile, isValidLinkedInProfile } from '@/lib/linkedinParser'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { linkedinData, title } = body

    // Validate LinkedIn data
    if (!isValidLinkedInProfile(linkedinData)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid LinkedIn profile data. Please ensure it follows the JSON Resume schema.',
        },
        { status: 400 }
      )
    }

    // Parse LinkedIn data to resume format
    const resumeContent = parseLinkedInProfile(linkedinData)

    // Create resume in database
    const { data: resume, error } = await supabase
      .from('resumes')
      .insert({
        user_id: session.user.id,
        title: title || 'LinkedIn Import',
        content: resumeContent,
        is_base_version: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resume,
      message: 'LinkedIn profile imported successfully',
    })
  } catch (error) {
    console.error('LinkedIn import error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process LinkedIn data' },
      { status: 500 }
    )
  }
}
