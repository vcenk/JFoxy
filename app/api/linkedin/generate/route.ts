// app/api/linkedin/generate/route.ts
// Generate LinkedIn profile optimization from resume

import { NextRequest } from 'next/server'
import { generateLinkedInProfile, regenerateLinkedInSection } from '@/lib/engines/linkedinEngine'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
  checkSubscriptionTier,
} from '@/lib/utils/apiHelpers'
import { hasFeatureAccess } from '@/lib/utils/subscriptionLimits'

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  // Check subscription tier for LinkedIn optimizer access
  const tier = await checkSubscriptionTier(user.id)
  if (!hasFeatureAccess(tier, 'linkedinOptimizer')) {
    return badRequestResponse('LinkedIn Profile Optimizer requires Basic subscription or higher. Please upgrade to access this feature.')
  }

  try {
    const body = await req.json()
    const validation = validateRequiredFields(body, ['resumeId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, targetRole, tone, regenerateSection, currentContent, feedback } = body

    // Get the resume
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('raw_text, title')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume?.raw_text) {
      return badRequestResponse('Resume not found or has no content')
    }

    // If regenerating a specific section
    if (regenerateSection) {
      const result = await regenerateLinkedInSection({
        section: regenerateSection,
        currentContent: currentContent || '',
        resumeText: resume.raw_text,
        feedback,
        tone: tone || 'professional',
      })

      if (!result) {
        return serverErrorResponse('Failed to regenerate section')
      }

      return successResponse(result)
    }

    // Check for existing LinkedIn profile data for this resume
    const { data: existingProfile } = await supabaseAdmin
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // If exists and not forcing regeneration, return existing
    if (existingProfile && !body.forceRegenerate) {
      return successResponse({
        ...existingProfile.profile_data,
        id: existingProfile.id,
        cached: true,
      })
    }

    // Generate new LinkedIn profile content
    const profileData = await generateLinkedInProfile({
      resumeText: resume.raw_text,
      targetRole,
      tone: tone || 'professional',
    })

    if (!profileData) {
      return serverErrorResponse('Failed to generate LinkedIn profile content')
    }

    // Save to database
    const { data: savedProfile, error } = await supabaseAdmin
      .from('linkedin_profiles')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        target_role: targetRole,
        tone: tone || 'professional',
        profile_data: profileData,
      })
      .select()
      .single()

    if (error) {
      console.error('[LinkedIn Profile Save Error]:', error)
      // Still return the generated data even if save fails
      return successResponse(profileData)
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'linkedin_profile_generation',
      metadata: { resumeId, targetRole, tone },
    })

    return successResponse({
      ...profileData,
      id: savedProfile.id,
    })
  } catch (error) {
    console.error('[LinkedIn API Error]:', error)
    return serverErrorResponse((error as Error).message)
  }
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const resumeId = searchParams.get('resumeId')

  if (!resumeId) return badRequestResponse('resumeId is required')

  try {
    const { data, error } = await supabaseAdmin
      .from('linkedin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[LinkedIn Profile Fetch Error]:', error)
      return serverErrorResponse()
    }

    if (!data) {
      return successResponse(null)
    }

    return successResponse({
      ...data.profile_data,
      id: data.id,
    })
  } catch (error) {
    console.error('[LinkedIn GET Error]:', error)
    return serverErrorResponse()
  }
}
