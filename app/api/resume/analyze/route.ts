// app/api/resume/analyze/route.ts
// Analyze resume against ATS or job description

import { NextRequest } from 'next/server'
import {
  analyzeResumeATS,
  analyzeResumeAgainstJob,
} from '@/lib/engines/resumeAnalysisEngine'  // lib/engines/resumeAnalysisEngine.ts
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  trackUsage,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, ['resumeId'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { resumeId, jobDescriptionId, jobText: rawJobText, jobTitle, jobCompany, createTailoredVersion = false } = body

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

    // Ensure resume has raw_text - generate from content if missing
    let resumeTextToAnalyze = resume.raw_text
    if (!resumeTextToAnalyze || resumeTextToAnalyze.trim().length === 0) {
      // Generate plain text from JSON content
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
            sections.push(content.header.linkedin || '')
            sections.push(content.header.website || '')
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

          resumeTextToAnalyze = sections.filter(s => s).join('\n')
        } catch (err) {
          console.error('[Resume Text Generation Error]:', err)
          return badRequestResponse('Resume content is invalid or missing')
        }
      } else {
        return badRequestResponse('Resume has no content to analyze')
      }
    }

    // Get or create job description
    let jobText = rawJobText
    let actualJobDescriptionId = jobDescriptionId

    if (rawJobText && jobTitle) {
      // Create a new job_description record if we have job data
      const { data: newJobDesc, error: jobCreateError } = await supabaseAdmin
        .from('job_descriptions')
        .insert({
          user_id: user.id,
          title: jobTitle,
          company: jobCompany || null,
          description: rawJobText,
        })
        .select()
        .single()

      if (jobCreateError) {
        console.error('[Job Description Creation Error]:', jobCreateError)
        return serverErrorResponse('Failed to save job description: ' + (jobCreateError.message || 'Unknown error'))
      }

      if (newJobDesc) {
        actualJobDescriptionId = newJobDesc.id
        console.log('[Job Description Created]:', actualJobDescriptionId)
      }
    } else if (!jobText && jobDescriptionId) {
      // Fetch existing job description
      const { data: jd } = await supabaseAdmin
        .from('job_descriptions')
        .select('*')
        .eq('id', jobDescriptionId)
        .eq('user_id', user.id)
        .single()

      if (jd) {
        jobText = jd.description
        actualJobDescriptionId = jd.id
      }
    }

    // Analyze resume
    let analysis
    try {
      analysis = jobText
        ? await analyzeResumeAgainstJob({
            resumeText: resumeTextToAnalyze,
            jobText,
          })
        : await analyzeResumeATS(resumeTextToAnalyze)
    } catch (analysisError: any) {
      console.error('[Resume Analysis Error]:', analysisError)
      return serverErrorResponse(analysisError.message || 'Failed to analyze resume')
    }

    if (!analysis) {
      return serverErrorResponse('Analysis returned empty results. Please try again.')
    }

    // Update the resume with generated raw_text if it was missing
    if (!resume.raw_text || resume.raw_text.trim().length === 0) {
      await supabaseAdmin
        .from('resumes')
        .update({ raw_text: resumeTextToAnalyze })
        .eq('id', resumeId)
    }

    let targetResumeId = resumeId
    let newResume = null

    // If analyzing against a job description AND user wants a tailored version, create a new resume
    if (jobText && createTailoredVersion) {
      const tailoredTitle = jobTitle
        ? `${resume.title} - ${jobTitle}${jobCompany ? ` @ ${jobCompany}` : ''}`
        : `${resume.title} - Tailored`

      console.log('[Creating Tailored Resume]:', {
        source_resume_id: resumeId,
        job_description_id: actualJobDescriptionId,
        title: tailoredTitle
      })

      const { data: tailoredResume, error: createError } = await supabaseAdmin
        .from('resumes')
        .insert({
          user_id: user.id,
          title: tailoredTitle,
          content: resume.content,
          raw_text: resumeTextToAnalyze,
          is_base_version: false,
          source_resume_id: resumeId,
          job_description_id: actualJobDescriptionId || null,
          ats_score: analysis.ats_score,
          jd_match_score: analysis.jd_match_score,
          last_analyzed_at: new Date().toISOString(),
          analysis_results: analysis,
        })
        .select()
        .single()

      if (createError) {
        console.error('[Resume Duplication Error]:', createError)
        return serverErrorResponse('Failed to create tailored resume')
      }

      console.log('[Tailored Resume Created Successfully]:', tailoredResume.id)

      targetResumeId = tailoredResume.id
      newResume = tailoredResume
    } else {
      // Update existing resume with analysis results
      const updateData: any = {
        ats_score: analysis.ats_score,
        jd_match_score: jobText ? analysis.jd_match_score : null,
        last_analyzed_at: new Date().toISOString(),
        analysis_results: analysis,
      }

      // If we have a job description, link it to the resume
      if (actualJobDescriptionId) {
        updateData.job_description_id = actualJobDescriptionId
      }

      await supabaseAdmin
        .from('resumes')
        .update(updateData)
        .eq('id', resumeId)
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'resume_analysis',
      metadata: {
        resumeId,
        jobDescriptionId: actualJobDescriptionId,
        createTailoredVersion,
        jobTitle: jobTitle || null,
        jobCompany: jobCompany || null,
      },
    })

    return successResponse({
      ...analysis,
      newResumeId: newResume ? targetResumeId : null,
      newResume: newResume,
    })
  } catch (error) {
    console.error('[Resume Analysis API Error]:', error)
    return serverErrorResponse()
  }
}
