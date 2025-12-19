// app/api/resume/[id]/route.ts
// CRUD operations for individual resumes

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { getAuthUser } from '@/lib/utils/apiHelpers'

// GET - Fetch single resume
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .single()

    if (error || !resume) {
      return NextResponse.json(
        { success: false, error: 'Resume not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      resume,
    })
  } catch (error: any) {
    console.error('[Resume Get Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update resume
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const body = await req.json()
    const { content, title, raw_text } = body

    const updates: any = { updated_at: new Date().toISOString() }
    if (content !== undefined) updates.content = content
    if (title !== undefined) updates.title = title
    if (raw_text !== undefined) updates.raw_text = raw_text

    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .update(updates)
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('[Resume Update Error]:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      resume,
    })
  } catch (error: any) {
    console.error('[Resume Update API Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete resume
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = params instanceof Promise ? await params : params
    const { error } = await supabaseAdmin
      .from('resumes')
      .delete()
      .eq('id', resolvedParams.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[Resume Delete Error]:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete resume' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('[Resume Delete API Error]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
