// lib/engines/resumeContentEngine.ts
// AI engine for resume content generation - summaries, bullets, skills

import { callLLM, callLLMJSON } from '@/lib/clients/openaiClient'
import {
  ACTION_VERBS,
  INDUSTRY_POWER_WORDS,
} from '@/lib/data/powerWords'
import { getATSKeywordsByIndustry } from '@/lib/data/atsKeywords'

interface ExperienceContext {
  company: string
  position: string
  bullets?: string[]
}

interface GenerateSummaryParams {
  experience: ExperienceContext[]
  targetRole?: string
  targetIndustry?: string
  yearsExperience?: number
  tone?: 'professional' | 'creative' | 'executive'
}

interface OptimizeBulletParams {
  bullet: string
  company: string
  position: string
  optimization: 'quantify' | 'action-verb' | 'concise' | 'expand' | 'ats'
  industry?: string
}

interface GenerateBulletsParams {
  jobDescription: string
  company: string
  position: string
  existingBullets?: string[]
  count?: number
  industry?: string
}

interface SuggestSkillsParams {
  experience: ExperienceContext[]
  existingSkills: string[]
  targetRole?: string
  industry?: string
}

/**
 * Generate a professional summary based on experience
 */
export async function generateProfessionalSummary(
  params: GenerateSummaryParams
): Promise<string | null> {
  const { experience, targetRole, targetIndustry, yearsExperience, tone = 'professional' } = params

  // Get industry-specific power words
  const industryPowerWords = targetIndustry && INDUSTRY_POWER_WORDS[targetIndustry as keyof typeof INDUSTRY_POWER_WORDS]
    ? INDUSTRY_POWER_WORDS[targetIndustry as keyof typeof INDUSTRY_POWER_WORDS]
    : []

  const experienceSummary = experience.map(exp =>
    `${exp.position} at ${exp.company}${exp.bullets ? `: ${exp.bullets.slice(0, 3).join('; ')}` : ''}`
  ).join('\n')

  const systemPrompt = `You are an expert resume writer who crafts compelling professional summaries.

SUMMARY GUIDELINES:
- Lead with years of experience and key expertise area
- Mention 2-3 top skills or technologies relevant to the target role
- Include a unique value proposition or key achievement
- Keep to 2-3 sentences (50-80 words)
- Use ${tone} tone

${industryPowerWords.length > 0 ? `Industry power words to incorporate: ${industryPowerWords.slice(0, 8).join(', ')}` : ''}

DO NOT:
- Use clichés like "results-driven" or "team player" unless backed by specifics
- Make claims without evidence
- Start with "I am" or "I have"
- Exceed 3 sentences`

  const userPrompt = `Write a professional summary for someone with this background:

EXPERIENCE:
${experienceSummary}

${yearsExperience ? `Years of experience: ${yearsExperience}` : ''}
${targetRole ? `Target role: ${targetRole}` : ''}
${targetIndustry ? `Industry: ${targetIndustry}` : ''}

Return ONLY the summary text, no quotes or labels.`

  const summary = await callLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    maxTokens: 200,
  })

  return summary
}

/**
 * Optimize a single bullet point
 */
export async function optimizeBullet(
  params: OptimizeBulletParams
): Promise<string | null> {
  const { bullet, company, position, optimization, industry } = params

  // Get industry keywords
  const industryKeywords = industry ? getATSKeywordsByIndustry(industry) : null
  const actionVerbs = [
    ...ACTION_VERBS.leadership.slice(0, 5),
    ...ACTION_VERBS.technical.slice(0, 5),
    ...ACTION_VERBS.analytical.slice(0, 5),
    ...ACTION_VERBS.communication.slice(0, 3),
  ]

  const optimizationInstructions: Record<string, string> = {
    'quantify': `Add specific metrics and numbers to quantify the achievement.
Examples of metrics to add:
- Percentages: "by 25%", "improved 30%"
- Dollar amounts: "$500K", "6-figure budget"
- Team/project sizes: "team of 8", "12 projects"
- Time savings: "reduced by 2 hours daily"
- Volume: "500+ customers", "10,000 transactions"
If you cannot infer exact numbers, use realistic placeholders like [X%] or [$X].`,

    'action-verb': `Start with a stronger action verb from this list: ${actionVerbs.join(', ')}.
Replace weak openings like "Responsible for", "Helped", "Worked on" with impactful action verbs.`,

    'concise': `Make this bullet more concise and impactful.
- Remove filler words and redundancies
- Keep to one line if possible (under 15 words)
- Focus on the key achievement`,

    'expand': `Expand this bullet with more context and detail.
- Add the method or approach used
- Include the scope or scale
- Mention tools or technologies if relevant
- Keep to 1-2 lines max`,

    'ats': `Optimize for ATS (Applicant Tracking Systems).
${industryKeywords ? `Keywords to naturally incorporate: ${industryKeywords.mustHave?.slice(0, 5).join(', ') || industryKeywords.technical?.slice(0, 5).join(', ')}` : ''}
- Use industry-standard terminology
- Spell out acronyms on first use
- Include relevant technical skills`,
  }

  const systemPrompt = `You are an expert resume writer. Your task is to optimize a single resume bullet point.

CONTEXT:
Position: ${position}
Company: ${company}
${industry ? `Industry: ${industry}` : ''}

OPTIMIZATION GOAL: ${optimization.toUpperCase()}
${optimizationInstructions[optimization]}

CRITICAL RULES:
- Keep the core message and facts unchanged
- Do not exaggerate or add false information
- Maintain a professional tone
- Return ONLY the optimized bullet, nothing else`

  const userPrompt = `Optimize this bullet point:

"${bullet}"

Return ONLY the improved bullet point text, no quotes or explanations.`

  const optimized = await callLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.6,
    maxTokens: 150,
  })

  return optimized
}

/**
 * Generate bullet points from a job description
 */
export async function generateBulletsFromJD(
  params: GenerateBulletsParams
): Promise<string[] | null> {
  const { jobDescription, company, position, existingBullets, count = 3, industry } = params

  // Get industry keywords
  const industryKeywords = industry ? getATSKeywordsByIndustry(industry) : null

  const systemPrompt = `You are an expert resume writer who creates impactful achievement-focused bullet points.

BULLET STRUCTURE (XYZ Formula):
- Start with action verb
- Describe what was accomplished
- Include quantified result or impact

EXAMPLES OF GOOD BULLETS:
- "Spearheaded migration to cloud infrastructure, reducing operational costs by 35% and improving uptime to 99.9%"
- "Developed automated testing framework that increased code coverage from 45% to 85%, preventing $200K in potential bug-related costs"
- "Led cross-functional team of 6 engineers to deliver product launch 2 weeks ahead of schedule"

${industryKeywords ? `Industry keywords to incorporate: ${industryKeywords.mustHave?.slice(0, 8).join(', ')}` : ''}

RULES:
- Each bullet must be unique and specific
- Use realistic but impactful metrics
- If you cannot infer a real number, use placeholders like [X%] or [$X]
- Match the tone and level of the job description
- Avoid generic statements that could apply to anyone`

  const userPrompt = `Generate ${count} resume bullet points for someone who works at ${company} as ${position}.

JOB DESCRIPTION TO TARGET:
${jobDescription.slice(0, 1500)}

${existingBullets?.length ? `EXISTING BULLETS (generate different achievements):\n${existingBullets.join('\n')}` : ''}

Return a JSON array of ${count} bullet point strings.
Example format: ["Bullet 1 text", "Bullet 2 text", "Bullet 3 text"]`

  const result = await callLLMJSON<string[]>({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    maxTokens: 500,
  })

  return result
}

/**
 * Suggest skills based on experience
 */
export async function suggestSkillsFromExperience(
  params: SuggestSkillsParams
): Promise<{ technical: string[]; soft: string[] } | null> {
  const { experience, existingSkills, targetRole, industry } = params

  // Get industry keywords for context
  const industryKeywords = industry ? getATSKeywordsByIndustry(industry) : null

  const experienceSummary = experience.map(exp =>
    `${exp.position} at ${exp.company}${exp.bullets ? `:\n${exp.bullets.slice(0, 4).map(b => `  - ${b}`).join('\n')}` : ''}`
  ).join('\n\n')

  const systemPrompt = `You are a career advisor who identifies skills from work experience.

Your task is to:
1. Analyze the experience and extract skills that are demonstrated
2. Suggest additional skills that would complement this background
3. Focus on skills relevant to the target role/industry

${industryKeywords ? `Industry-relevant skills to consider: ${industryKeywords.technical?.slice(0, 15).join(', ')}` : ''}

SKILL CATEGORIES:
- Technical: Hard skills, tools, technologies, methodologies
- Soft: Leadership, communication, problem-solving abilities

RULES:
- Only suggest skills that are evident from or complementary to the experience
- Avoid duplicating skills that are already listed
- Focus on in-demand, marketable skills
- Be specific (e.g., "Python" not "programming")`

  const userPrompt = `Analyze this experience and suggest skills:

EXPERIENCE:
${experienceSummary}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}
${industry ? `INDUSTRY: ${industry}` : ''}

EXISTING SKILLS (do not repeat these):
${existingSkills.join(', ')}

Return a JSON object with this exact structure:
{
  "technical": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "soft": ["skill1", "skill2", "skill3"]
}`

  const result = await callLLMJSON<{ technical: string[]; soft: string[] }>({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.6,
    maxTokens: 300,
  })

  return result
}

/**
 * Smart optimize a bullet based on its weaknesses
 */
export async function smartOptimizeBullet(
  bullet: string,
  weaknesses: { needsActionVerb?: boolean; needsMetrics?: boolean; weakWords?: string[] },
  context?: { company?: string; position?: string; industry?: string }
): Promise<string | null> {
  // Determine what optimizations to apply
  const optimizations: string[] = []

  if (weaknesses.needsActionVerb) {
    optimizations.push('Start with a strong action verb from this list: Spearheaded, Orchestrated, Pioneered, Revolutionized, Accelerated, Transformed, Championed, Elevated, Streamlined, Architected')
  }

  if (weaknesses.needsMetrics) {
    optimizations.push(`Add specific metrics to quantify impact. Use realistic numbers for:
- Percentages: "by 25%", "improved 30%"
- Dollar amounts: "$500K", "6-figure"
- Team sizes: "team of 8"
- Time: "reduced by 50%"
If exact numbers unknown, use placeholders like [X%] or [$X].`)
  }

  if (weaknesses.weakWords && weaknesses.weakWords.length > 0) {
    optimizations.push(`Replace these weak words/phrases with stronger alternatives: ${weaknesses.weakWords.join(', ')}`)
  }

  if (optimizations.length === 0) {
    // Bullet is already good, just clean it up
    optimizations.push('Make minor improvements to clarity and impact while keeping the core message.')
  }

  const industryKeywords = context?.industry ? getATSKeywordsByIndustry(context.industry) : null

  const systemPrompt = `You are an expert resume writer. Improve this bullet point.

${context?.position ? `Position: ${context.position}` : ''}
${context?.company ? `Company: ${context.company}` : ''}
${context?.industry ? `Industry: ${context.industry}` : ''}
${industryKeywords ? `Industry keywords to incorporate naturally: ${industryKeywords.mustHave?.slice(0, 5).join(', ')}` : ''}

IMPROVEMENTS NEEDED:
${optimizations.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

RULES:
- Keep the core meaning and facts
- Do not exaggerate or add false information
- Make it ATS-friendly with clear terminology
- Return ONLY the improved bullet point`

  const result = await callLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Improve this bullet:\n\n"${bullet}"\n\nReturn ONLY the improved text.` },
    ],
    temperature: 0.6,
    maxTokens: 200,
  })

  return result
}

/**
 * Rewrite summary with different style
 */
export async function rewriteSummary(
  currentSummary: string,
  style: 'shorter' | 'longer' | 'more-confident' | 'more-formal'
): Promise<string | null> {
  const styleInstructions: Record<string, string> = {
    'shorter': 'Make this summary more concise - aim for 1-2 sentences while keeping the key message.',
    'longer': 'Expand this summary with more detail - add specifics about skills, achievements, or value proposition.',
    'more-confident': 'Rewrite with a more confident, assertive tone. Use stronger action words and definitive statements.',
    'more-formal': 'Rewrite in a more formal, executive tone suitable for senior positions.',
  }

  const systemPrompt = `You are an expert resume writer. ${styleInstructions[style]}

RULES:
- Keep the core facts and message
- Maintain professional tone
- Do not add false claims
- Return ONLY the rewritten summary`

  const userPrompt = `Rewrite this professional summary:

"${currentSummary}"

Return ONLY the new summary text, no quotes or labels.`

  const result = await callLLM({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    maxTokens: 200,
  })

  return result
}
