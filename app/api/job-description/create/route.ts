// app/api/job-description/create/route.ts
// Create a new job description

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
} from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, ['title', 'description'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { title, company, description } = body

    // Create job description
    const { data: jobDescription, error } = await supabaseAdmin
      .from('job_descriptions')
      .insert({
        user_id: user.id,
        title: title.trim(),
        company: company?.trim() || null,
        description: description.trim(),
      })
      .select()
      .single()

    if (error || !jobDescription) {
      console.error('[Job Description Create Error]:', error)
      return serverErrorResponse('Failed to create job description')
    }

    return successResponse({ jobDescription })
  } catch (error) {
    console.error('[Job Description Create API Error]:', error)
    return serverErrorResponse()
  }
}
