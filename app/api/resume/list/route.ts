// app/api/resume/list/route.ts
// List all resumes for the authenticated user

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { getAuthUser } from '@/lib/utils/apiHelpers'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: resumes, error } = await supabaseAdmin
      .from('resumes')
      .select(`
        *,
        job_description:job_descriptions(
          id,
          title,
          company
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[Resume List Error]:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch resumes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resumes: resumes || [],
    })
  } catch (error: any) {
    console.error('[Resume List API Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
