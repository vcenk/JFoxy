// app/api/cover-letter/generate/route.ts
// Generate a tailored cover letter based on resume and job description

import { NextRequest } from 'next/server'
import { generateCoverLetter } from '@/lib/engines/coverLetterEngine'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
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
    const validation = validateRequiredFields(body, ['resumeId', 'jobTitle', 'jobDescription'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, jobTitle, companyName, jobDescription, tone = 'professional' } = body

    // Get resume
    const { data: resume } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) {
      return badRequestResponse('Resume not found')
    }

    // Generate resume text
    let resumeText = resume.raw_text
    if (!resumeText || resumeText.trim().length === 0) {
      // Generate from content
      if (resume.content) {
        try {
          const content = resume.content
          const sections = []

          // Header/Contact
          if (content.header) {
            sections.push(content.header.name || '')
            sections.push(content.header.title || '')
            sections.push(content.header.email || '')
            sections.push(content.header.phone || '')
            sections.push(content.header.location || '')
          }

          // Summary
          if (content.summary) {
            sections.push('\nSUMMARY')
            sections.push(content.summary)
          }

          // Experience
          if (content.experience && Array.isArray(content.experience)) {
            sections.push('\nEXPERIENCE')
            content.experience.forEach((exp: any) => {
              sections.push(`${exp.title || ''} at ${exp.company || ''}`)
              sections.push(`${exp.date || ''}`)
              if (exp.bullets && Array.isArray(exp.bullets)) {
                exp.bullets.forEach((bullet: string) => sections.push(`• ${bullet}`))
              }
            })
          }

          // Education
          if (content.education && Array.isArray(content.education)) {
            sections.push('\nEDUCATION')
            content.education.forEach((edu: any) => {
              sections.push(`${edu.degree || ''} - ${edu.school || ''}`)
              sections.push(`${edu.date || ''}`)
            })
          }

          // Skills
          if (content.skills && Array.isArray(content.skills)) {
            sections.push('\nSKILLS')
            content.skills.forEach((skill: any) => {
              sections.push(`${skill.category || ''}: ${skill.items?.join(', ') || ''}`)
            })
          }

          resumeText = sections.filter(s => s).join('\n')
        } catch (err) {
          console.error('[Resume Text Generation Error]:', err)
          return badRequestResponse('Resume content is invalid or missing')
        }
      } else {
        return badRequestResponse('Resume has no content')
      }
    }

    // Generate cover letter
    let coverLetterContent: string
    try {
      coverLetterContent = await generateCoverLetter({
        resumeText,
        jobTitle,
        companyName: companyName || undefined,
        jobDescription,
        tone,
      })
    } catch (generationError: any) {
      console.error('[Cover Letter Generation Error]:', generationError)
      return serverErrorResponse(generationError.message || 'Failed to generate cover letter')
    }

    if (!coverLetterContent || coverLetterContent.trim().length === 0) {
      return serverErrorResponse('Cover letter generation returned empty results.')
    }

    // Save cover letter to database
    const { data: coverLetter, error: saveError } = await supabaseAdmin
      .from('cover_letters')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        title: `Cover Letter - ${jobTitle}${companyName ? ` @ ${companyName}` : ''}`,
        content: coverLetterContent,
        company_name: companyName || null,
        position_title: jobTitle,
        tone,
      })
      .select()
      .single()

    if (saveError) {
      console.error('[Cover Letter Save Error]:', saveError)
      return serverErrorResponse('Failed to save cover letter')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'cover_letter_generation',
      metadata: {
        resumeId,
        jobTitle,
        companyName: companyName || null,
        tone,
      },
    })

    return successResponse({
      coverLetter,
    })
  } catch (error) {
    console.error('[Cover Letter Generation API Error]:', error)
    return serverErrorResponse()
  }
}
