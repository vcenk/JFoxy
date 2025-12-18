// lib/engines/swotEngine.ts
// Generate SWOT analysis from resume and job description

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface SwotItem {
  title: string
  insight: string
  source?: string // Where this came from (e.g., "Resume: PM role at TechCorp")
}

export interface SwotAnalysis {
  strengths: SwotItem[]
  weaknesses: SwotItem[]
  opportunities: SwotItem[]
  threats: SwotItem[]
}

/**
 * Generate SWOT analysis from resume and job description
 */
export async function generateSwotAnalysis({
  resumeText,
  jobText,
}: {
  resumeText: string
  jobText?: string
}): Promise<SwotAnalysis | null> {
  const system = `
You are a career coach performing SWOT analysis for interview preparation.
Analyze the candidate's profile against the job requirements (if provided).
Focus on interview-relevant insights, not just resume content.
Return strict JSON only.
`.trim()

  const user = `
Perform a SWOT analysis for this candidate.

RESUME:
"""
${resumeText}
"""

${jobText ? `JOB DESCRIPTION:\n"""\n${jobText}\n"""` : ''}

Generate a SWOT analysis with 3-5 items per category.

Return JSON:
{
  "strengths": [
    {
      "title": "Strong technical leadership",
      "insight": "Led team of 5 engineers through migration project",
      "source": "Resume: Engineering Manager at TechCorp"
    }
  ],
  "weaknesses": [
    {
      "title": "Limited cloud experience",
      "insight": "No evidence of AWS/Azure work despite JD requirement",
      "source": "Gap identified vs JD requirements"
    }
  ],
  "opportunities": [
    {
      "title": "Industry growth trend",
      "insight": "AI/ML field is rapidly expanding - strong demand",
      "source": "Market trend analysis"
    }
  ],
  "threats": [
    {
      "title": "Competing with cloud-native candidates",
      "insight": "Other applicants may have stronger cloud portfolios",
      "source": "Competitive analysis"
    }
  ]
}

Focus on:
- Strengths: What makes this candidate stand out
- Weaknesses: Skills gaps or potential concerns
- Opportunities: Market trends, company growth, role potential
- Threats: Competition, market changes, skill obsolescence
`.trim()

  try {
    const result = await callLLMJSON<SwotAnalysis>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 1500,
    })

    return result
  } catch (error) {
    console.error('[SWOT Generation Error]:', error)
    return null
  }
}

/**
 * Refine a specific SWOT item with AI assistance
 */
export async function refineSwotItem({
  item,
  category,
  context,
}: {
  item: SwotItem
  category: 'strength' | 'weakness' | 'opportunity' | 'threat'
  context?: string
}): Promise<SwotItem | null> {
  const system = `
You are a career coach helping refine SWOT analysis items.
Make them more specific, impactful, and interview-ready.
Return strict JSON only.
`.trim()

  const user = `
Refine this ${category} item to be more compelling and specific.

CURRENT ITEM:
Title: ${item.title}
Insight: ${item.insight}

${context ? `CONTEXT:\n${context}` : ''}

Return JSON:
{
  "title": "Improved title",
  "insight": "More specific and actionable insight",
  "source": "Where this evidence comes from"
}
`.trim()

  try {
    const result = await callLLMJSON<SwotItem>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 300,
    })

    return result
  } catch (error) {
    console.error('[SWOT Item Refinement Error]:', error)
    return null
  }
}
