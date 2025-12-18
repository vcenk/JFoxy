// app/api/job-description/[id]/route.ts
// Fetch a job description by ID

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const resolved = params instanceof Promise ? await params : params
    const { id } = resolved

    if (!id) {
      return badRequestResponse('Job description ID is required')
    }

    const { data: jobDescription, error } = await supabaseAdmin
      .from('job_descriptions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !jobDescription) {
      return badRequestResponse('Job description not found')
    }

    return successResponse({ jobDescription })
  } catch (error) {
    console.error('[Job Description Fetch Error]:', error)
    return badRequestResponse('Failed to fetch job description')
  }
}
