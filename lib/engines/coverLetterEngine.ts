// lib/engines/coverLetterEngine.ts
// Generate tailored cover letters based on resume and job description

import { callLLM } from '../clients/openaiClient'

export interface CoverLetterOptions {
  resumeText: string
  jobTitle: string
  companyName?: string
  jobDescription: string
  tone?: 'professional' | 'enthusiastic' | 'friendly'
}

/**
 * Generate a tailored cover letter based on resume and job description
 */
export async function generateCoverLetter(options: CoverLetterOptions): Promise<string> {
  const { resumeText, jobTitle, companyName, jobDescription, tone = 'professional' } = options

  const toneInstructions = {
    professional: 'Use a formal, professional tone. Be concise and focused on qualifications.',
    enthusiastic: 'Use an enthusiastic, passionate tone while maintaining professionalism. Show genuine excitement about the opportunity.',
    friendly: 'Use a warm, approachable tone that feels personable yet professional. Strike a balance between casual and formal.'
  }

  const system = `
You are an expert cover letter writer with years of experience in career coaching.

Your goal is to create a compelling cover letter that:
1. Demonstrates the candidate's fit for the specific role
2. Highlights relevant experience from their resume
3. Shows knowledge of the company (when provided)
4. Uses specific examples and achievements
5. Maintains the requested tone: ${tone}
6. Is concise (300-400 words, 3-4 paragraphs)
7. Follows professional cover letter structure

Tone Guidelines: ${toneInstructions[tone]}

Structure:
- Opening: State the position and express interest
- Body (2-3 paragraphs): Connect your experience to job requirements with specific examples
- Closing: Express enthusiasm and request next steps

IMPORTANT:
- Do NOT use placeholders like [Your Name], [Date], [Company Address]
- Do NOT include contact information, addresses, or signature blocks
- Start directly with the opening paragraph
- Be specific and use real details from the resume
- Match qualifications to job requirements explicitly
- Keep it under 400 words
`.trim()

  const user = `
Generate a compelling cover letter for this candidate.

RESUME:
"""
${resumeText}
"""

JOB INFORMATION:
Position: ${jobTitle}
${companyName ? `Company: ${companyName}` : ''}

JOB DESCRIPTION:
"""
${jobDescription}
"""

Create a cover letter that:
1. Immediately captures attention with why this role excites the candidate
2. Draws specific connections between their resume experience and job requirements
3. Demonstrates knowledge of ${companyName || 'the company'} (if company info available)
4. Uses concrete examples and achievements from the resume
5. Shows personality while maintaining professionalism
6. Ends with a strong call to action

Return ONLY the cover letter content. No subject line, no signature block, just the letter paragraphs.
`.trim()

  try {
    const result = await callLLM({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7, // More creative for cover letters
      maxTokens: 600,
    })

    if (!result || result.trim().length === 0) {
      throw new Error('AI returned empty cover letter')
    }

    return result.trim()
  } catch (error: any) {
    console.error('[Cover Letter Generation Error]:', error)
    throw new Error(`Cover letter generation failed: ${error.message || 'Unknown error'}`)
  }
}
