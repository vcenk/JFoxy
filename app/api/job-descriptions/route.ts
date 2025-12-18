// app/api/job-descriptions/route.ts
// List all job descriptions for the authenticated user

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'

export async function GET(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const { data: jobDescriptions, error } = await supabaseAdmin
      .from('job_descriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Job Descriptions List Error]:', error)
      return serverErrorResponse('Failed to fetch job descriptions')
    }

    return successResponse({ jobDescriptions: jobDescriptions || [] })
  } catch (error) {
    console.error('[Job Descriptions List API Error]:', error)
    return serverErrorResponse()
  }
}
