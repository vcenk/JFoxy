// lib/engines/resumeParsingEngine.ts
// Parse uploaded resume files or text into structured format

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts
import { ParsedResume } from '@/lib/types/resume'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'

/**
 * Parse resume text into structured JSON format
 */
export async function parseResume(
  resumeText: string
): Promise<ParsedResume | null> {
  // Truncate very large resumes to prevent token overflow
  // Limit to ~15,000 characters (roughly 4,000 tokens)
  const MAX_CHARS = 15000
  const truncatedText = resumeText.length > MAX_CHARS
    ? resumeText.substring(0, MAX_CHARS) + '\n\n[Resume truncated for processing]'
    : resumeText

  const system = `
You are a resume parsing engine for a career coaching app.
Extract structured information from the resume text and return strict JSON.
Be thorough and extract all available information.
`.trim()

  const user = `
Parse the following resume into structured JSON format.

RESUME TEXT:
"""
${truncatedText}
"""

Return JSON with this exact structure:
{
  "contact": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "https://..."
  },
  "summary": "Professional summary or objective",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "bullets": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "graduationDate": "May 2020",
      "gpa": "3.8"
    }
  ],
  "skills": {
    "technical": ["JavaScript", "Python"],
    "soft": ["Leadership", "Communication"],
    "other": ["Project Management"]
  },
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["React", "Node.js"],
      "link": "https://..."
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Jan 2023"
    }
  ],
  "languages": [
    {
      "language": "English",
      "fluency": "Native"
    },
    {
      "language": "Spanish",
      "fluency": "Intermediate"
    }
  ],
  "awards": [
    {
      "title": "Award Name",
      "issuer": "Organization",
      "date": "2023",
      "description": "Award description"
    }
  ],
  "volunteer": [
    {
      "organization": "Organization Name",
      "role": "Volunteer Role",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "description": "Volunteer work description"
    }
  ],
  "publications": [
    {
      "title": "Publication Title",
      "publisher": "Publisher Name",
      "date": "2023",
      "link": "https://...",
      "description": "Brief description"
    }
  ]
}

Extract ALL sections that exist in the resume. Only include fields that are present. Use empty arrays [] for sections with no data.
`.trim()

  try {
    const parsed = await callLLMJSON<any>({
      model: 'gpt-4o-mini', // Use mini model - cheaper, faster, higher rate limits
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.1, // Low temperature for accurate parsing
      maxTokens: 3000, // Increased for larger resumes
    })

    // Convert string fields to RichText (JSONContent) format
    if (parsed) {
      // Convert summary from string to JSONContent
      if (parsed.summary && typeof parsed.summary === 'string') {
        parsed.summary = plainTextToJSON(parsed.summary)
      }

      // Convert experience bullets from string[] to RichText[]
      if (parsed.experience && Array.isArray(parsed.experience)) {
        parsed.experience = parsed.experience.map((exp: any) => ({
          ...exp,
          bullets: exp.bullets?.map((bullet: string) =>
            typeof bullet === 'string' ? plainTextToJSON(bullet) : bullet
          ) || []
        }))
      }
    }

    return parsed as ParsedResume
  } catch (error) {
    console.error('[Resume Parsing Error]:', error)
    return null
  }
}

/**
 * Extract plain text from resume for AI analysis
 */
export function extractResumeText(parsedResume: ParsedResume): string {
  const sections: string[] = []

  // Contact
  if (parsedResume.contact.name) {
    sections.push(`Name: ${parsedResume.contact.name}`)
  }

  // Summary
  if (parsedResume.summary) {
    sections.push(`\nSummary:\n${parsedResume.summary}`)
  }

  // Experience
  if (parsedResume.experience.length > 0) {
    sections.push('\nExperience:')
    parsedResume.experience.forEach((exp) => {
      sections.push(
        `\n${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`
      )
      exp.bullets.forEach((bullet) => sections.push(`- ${bullet}`))
    })
  }

  // Education
  if (parsedResume.education.length > 0) {
    sections.push('\nEducation:')
    parsedResume.education.forEach((edu) => {
      sections.push(
        `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationDate})`
      )
    })
  }

  // Skills
  if (parsedResume.skills.technical?.length) {
    sections.push(`\nTechnical Skills: ${parsedResume.skills.technical.join(', ')}`)
  }

  return sections.join('\n')
}
