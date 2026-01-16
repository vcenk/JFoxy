// lib/engines/linkedinEngine.ts
// Generate LinkedIn profile optimization suggestions

import { callLLMJSON } from '../clients/openaiClient'
import { LinkedInProfileData } from '../types/linkedin'

interface LinkedInEngineParams {
  resumeText: string
  targetRole?: string
  tone?: 'professional' | 'creative' | 'executive'
}

/**
 * Generate LinkedIn profile optimization based on resume
 */
export async function generateLinkedInProfile({
  resumeText,
  targetRole,
  tone = 'professional',
}: LinkedInEngineParams): Promise<LinkedInProfileData | null> {
  const system = `
You are an expert LinkedIn optimization specialist and personal branding consultant.
Your job is to transform resume content into compelling LinkedIn profile content that:
- Maximizes visibility in recruiter searches
- Tells a compelling career story
- Showcases achievements with impact metrics
- Uses strategic keywords for the target industry
- Follows LinkedIn best practices for engagement

Return strict JSON only. No markdown, no explanations outside the JSON.
`.trim()

  const toneGuidelines = {
    professional: 'Use polished, confident language suitable for corporate environments. Focus on achievements and impact.',
    creative: 'Use engaging, personality-driven language that stands out. Show creativity while maintaining professionalism.',
    executive: 'Use authoritative, strategic language that demonstrates leadership and vision. Focus on transformation and business impact.',
  }

  const user = `
Transform this resume into optimized LinkedIn profile content.

${targetRole ? `TARGET ROLE/INDUSTRY: ${targetRole}` : ''}
TONE: ${tone} - ${toneGuidelines[tone]}

RESUME:
"""
${resumeText}
"""

Generate LinkedIn content in this exact JSON structure:

{
  "headline": {
    "primary": "The recommended headline (max 220 chars). Format: [Title] | [Value Proposition] | [Key Skills/Industry]",
    "alternates": ["Alternative headline 1", "Alternative headline 2", "Alternative headline 3"]
  },
  "about": {
    "text": "Full about section (2000 char max). Start with a hook, include key achievements with metrics, end with call to action.",
    "hook": "The attention-grabbing opening line",
    "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
    "callToAction": "The closing call to action"
  },
  "skills": [
    {
      "name": "Skill name",
      "category": "technical|business|soft|industry|tools",
      "priority": "featured|standard"
    }
  ],
  "featured": [
    {
      "type": "accomplishment|project|publication|certification",
      "title": "Featured item title",
      "description": "Brief description of why this should be featured",
      "suggestedMedia": "Suggestion for what visual/document to add"
    }
  ],
  "experienceRewrites": [
    {
      "company": "Company name",
      "title": "Job title",
      "originalBullets": ["Original bullet 1", "Original bullet 2"],
      "optimizedBullets": ["Optimized bullet with metrics and action verbs 1", "Optimized bullet 2"],
      "improvements": ["What was improved - added metrics", "Changed passive to active voice"]
    }
  ],
  "optimizationTips": [
    "Tip 1: Add a professional headshot...",
    "Tip 2: Request recommendations from...",
    "Tip 3: Join relevant LinkedIn groups..."
  ]
}

Guidelines:
1. HEADLINE: Use powerful title + value prop + 2-3 keywords. Include industry buzzwords recruiters search for.
2. ABOUT: First-person, conversational. Hook in first line. Include 2-3 specific metrics. End with soft CTA.
3. SKILLS: Include 15-20 skills. Top 3 should be "featured" priority. Mix technical and soft skills.
4. FEATURED: Suggest 3-4 items that showcase biggest achievements or notable work.
5. EXPERIENCE: Rewrite bullets to lead with action verbs and include quantifiable results.
6. TIPS: Provide 5-7 actionable profile optimization tips.

Make content keyword-rich for LinkedIn's algorithm while keeping it human and engaging.
`.trim()

  try {
    const result = await callLLMJSON<LinkedInProfileData>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.6,
      maxTokens: 3000,
    })

    return result
  } catch (error) {
    console.error('[LinkedIn Profile Generation Error]:', error)
    return null
  }
}

/**
 * Regenerate a specific section of the LinkedIn profile
 */
export async function regenerateLinkedInSection({
  section,
  currentContent,
  resumeText,
  feedback,
  tone = 'professional',
}: {
  section: 'headline' | 'about' | 'skills' | 'featured' | 'experience'
  currentContent: string
  resumeText: string
  feedback?: string
  tone?: 'professional' | 'creative' | 'executive'
}): Promise<any | null> {
  const system = `
You are an expert LinkedIn optimization specialist.
Regenerate the specified section with improvements based on feedback.
Return strict JSON only.
`.trim()

  const sectionPrompts = {
    headline: 'Generate 4 new headline options in JSON: { "primary": "...", "alternates": ["...", "...", "..."] }',
    about: 'Generate a new about section in JSON: { "text": "...", "hook": "...", "keyStrengths": [...], "callToAction": "..." }',
    skills: 'Generate a new skills list in JSON: { "skills": [{ "name": "...", "category": "...", "priority": "..." }, ...] }',
    featured: 'Generate new featured items in JSON: { "featured": [{ "type": "...", "title": "...", "description": "...", "suggestedMedia": "..." }, ...] }',
    experience: 'Generate new experience rewrites in JSON: { "experienceRewrites": [{ "company": "...", "title": "...", "originalBullets": [...], "optimizedBullets": [...], "improvements": [...] }, ...] }',
  }

  const user = `
Regenerate the ${section} section for LinkedIn.

CURRENT CONTENT:
${currentContent}

${feedback ? `USER FEEDBACK:\n${feedback}` : ''}

TONE: ${tone}

RESUME CONTEXT:
"""
${resumeText.slice(0, 2000)}
"""

${sectionPrompts[section]}

Make it more compelling, keyword-rich, and engaging.
`.trim()

  try {
    const result = await callLLMJSON<any>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      maxTokens: 1500,
    })

    return result
  } catch (error) {
    console.error('[LinkedIn Section Regeneration Error]:', error)
    return null
  }
}
