// app/api/job-descriptions/route.ts
// Get list of user's job descriptions

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
    // Fetch user's job descriptions
    const { data: jobDescriptions, error } = await supabaseAdmin
      .from('job_descriptions')
      .select('id, title, company, description, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[Job Descriptions List Error]:', error)
      return serverErrorResponse('Failed to fetch job descriptions')
    }

    return successResponse({
      jobDescriptions: jobDescriptions || [],
    })
  } catch (error) {
    console.error('[Job Descriptions API Error]:', error)
    return serverErrorResponse()
  }
}
