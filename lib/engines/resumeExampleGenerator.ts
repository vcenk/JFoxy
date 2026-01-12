// lib/engines/resumeExampleGenerator.ts
// AI-powered resume example generator for building 2000+ resume library

import { openaiClient as openai } from '@/lib/clients/openaiClient'
import { POWER_WORD_SYNONYMS, ACTION_VERBS } from '@/lib/data/powerWords'
import { ATS_KEYWORDS_BY_INDUSTRY } from '@/lib/data/atsKeywords'
import { analyzeResumeATS } from '@/lib/engines/resumeAnalysisEngine'
import { ParsedResume } from '@/lib/types/resume'

// Generation request interface
export interface ResumeGenerationRequest {
  jobTitle: string
  industry: string
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  templateId?: string
  customInstructions?: string
}

// Generated example with metadata
export interface GeneratedResumeExample {
  slug: string
  jobTitle: string
  industry: string
  experienceLevel: string
  content: ParsedResume
  rawText: string
  atsScore: number
  powerWordsCount: number
  quantifiedAchievementsCount: number
  keywords: string[]
  metaTitle: string
  metaDescription: string
  h1Heading: string
  h2Headings: string[]
  targetKeywords: string[]
  canonicalUrl: string
  qualityScore: number
  generationCost: number
}

// System prompt for resume generation
const SYSTEM_PROMPT = `You are an expert resume writer and career coach with 15+ years of experience helping professionals land their dream jobs.

Your task is to generate realistic, high-quality resume examples that:
1. Use strong action verbs and power words
2. Include quantified achievements with specific metrics
3. Follow ATS best practices
4. Showcase industry-specific skills and keywords
5. Tell a compelling career story
6. Are tailored to the specific job title and industry
7. Match the experience level appropriately

Rules:
- Use REAL-SOUNDING company names (not "XYZ Corp" or "Company Name")
- Include specific numbers, percentages, dollar amounts
- Use power words from the provided list
- Include industry-specific technical skills
- Make accomplishments believable and impressive
- Follow proper resume formatting
- No placeholder text or generic phrases
- Make each resume unique and authentic`

/**
 * Generate a high-quality resume example using AI
 */
export async function generateResumeExample(
  request: ResumeGenerationRequest
): Promise<GeneratedResumeExample> {
  console.log('[Resume Generator] Starting generation:', request)

  // Step 1: Gather context data
  const contextData = gatherContextData(request)

  // Step 2: Build AI prompt
  const userPrompt = buildGenerationPrompt(request, contextData)

  // Step 3: Generate resume content using OpenAI
  const startTime = Date.now()
  const generatedContent = await generateWithAI(userPrompt)
  const generationTime = Date.now() - startTime

  // Step 4: Parse and structure the generated content
  const parsedResume = parseGeneratedResume(generatedContent, request)

  // Step 5: Convert to plain text for analysis
  const rawText = convertToPlainText(parsedResume)

  // Step 6: Analyze quality (ATS score, power words, etc.)
  const qualityMetrics = await analyzeQuality(rawText, request)

  // Step 7: Generate SEO metadata
  const seoMetadata = generateSEOMetadata(request)

  // Step 8: Calculate generation cost (rough estimate)
  const tokens = Math.ceil((userPrompt.length + generatedContent.length) / 4)
  const cost = (tokens / 1000) * 0.03 // GPT-4 pricing

  console.log('[Resume Generator] Generation complete:', {
    time: generationTime,
    atsScore: qualityMetrics.atsScore,
    cost
  })

  return {
    ...seoMetadata,
    jobTitle: request.jobTitle,
    industry: request.industry,
    experienceLevel: request.experienceLevel,
    content: parsedResume,
    rawText,
    atsScore: qualityMetrics.atsScore,
    powerWordsCount: qualityMetrics.powerWordsCount,
    quantifiedAchievementsCount: qualityMetrics.quantifiedAchievementsCount,
    keywords: qualityMetrics.keywords,
    qualityScore: calculateOverallQualityScore(qualityMetrics),
    generationCost: cost
  }
}

/**
 * Gather context data for generation (keywords, power words, etc.)
 */
function gatherContextData(request: ResumeGenerationRequest) {
  // Get industry-specific keywords
  const industryKeywords = ATS_KEYWORDS_BY_INDUSTRY[request.industry.toLowerCase()] || {
    mustHave: [],
    technical: [],
    soft: []
  }

  // Select relevant power words (mix from different categories)
  const powerWords = selectPowerWordsForIndustry(request.industry)

  // Experience level guidelines
  const experienceGuidelines = {
    entry: '1-3 years of relevant experience, 1-2 previous roles',
    mid: '3-6 years of relevant experience, 2-3 previous roles',
    senior: '6-12 years of relevant experience, 3-4 previous roles',
    executive: '12+ years of relevant experience, 4-5 previous roles with leadership'
  }

  return {
    mustHaveKeywords: industryKeywords.mustHave.slice(0, 10),
    technicalSkills: industryKeywords.technical.slice(0, 15),
    softSkills: industryKeywords.soft.slice(0, 8),
    powerWords: powerWords.slice(0, 20),
    experienceGuideline: experienceGuidelines[request.experienceLevel],
    certifications: industryKeywords.certifications?.slice(0, 3) || []
  }
}

/**
 * Select power words relevant to the industry
 */
function selectPowerWordsForIndustry(industry: string): string[] {
  const industryMapping: Record<string, string[]> = {
    technology: ['leadership', 'technical', 'innovation', 'analytical'],
    finance: ['analytical', 'financial', 'management', 'leadership'],
    marketing: ['creative', 'communication', 'achievement', 'analytical'],
    sales: ['achievement', 'communication', 'leadership'],
    healthcare: ['analytical', 'collaboration', 'problem_solving'],
    default: ['leadership', 'achievement', 'technical', 'analytical']
  }

  const categories = industryMapping[industry.toLowerCase()] || industryMapping.default
  const words: string[] = []

  categories.forEach(category => {
    const categoryWords = ACTION_VERBS[category as keyof typeof ACTION_VERBS] || []
    words.push(...categoryWords.slice(0, 5))
  })

  return words
}

/**
 * Build the AI generation prompt
 */
function buildGenerationPrompt(
  request: ResumeGenerationRequest,
  context: ReturnType<typeof gatherContextData>
): string {
  return `Generate a complete, realistic resume for the following professional:

JOB TITLE: ${request.jobTitle}
INDUSTRY: ${request.industry}
EXPERIENCE LEVEL: ${request.experienceLevel} (${context.experienceGuideline})

REQUIREMENTS:
1. Use these POWER WORDS in the experience bullets: ${context.powerWords.join(', ')}
2. Include these TECHNICAL SKILLS: ${context.technicalSkills.join(', ')}
3. Mention these INDUSTRY KEYWORDS naturally: ${context.mustHaveKeywords.join(', ')}
4. Soft skills to demonstrate: ${context.softSkills.join(', ')}
${context.certifications.length > 0 ? `5. Relevant certifications: ${context.certifications.join(', ')}` : ''}

RESUME STRUCTURE (return as JSON):
{
  "header": {
    "name": "[Realistic full name]",
    "title": "${request.jobTitle}",
    "email": "[professional email]",
    "phone": "[phone number format: (555) 123-4567]",
    "location": "[City, State]",
    "linkedin": "[linkedin.com/in/firstname-lastname]",
    "website": "[optional portfolio URL]"
  },
  "summary": "[3-4 sentences highlighting years of experience, key expertise, and major achievements. Use power words and quantified results.]",
  "experience": [
    {
      "title": "[Job Title]",
      "company": "[REAL-SOUNDING Company Name]",
      "date": "[Start Month Year] - [End Month Year or Present]",
      "bullets": [
        "[Achievement-focused bullet with quantified result using power word]",
        "[Another achievement with specific metrics like % increase, $ saved, # of people managed, etc.]",
        "[Technical accomplishment showcasing relevant skills]",
        "[Leadership or collaboration achievement]",
        "[Process improvement or innovation with measurable impact]"
      ]
    }
    // Include 2-4 work experiences based on experience level
  ],
  "education": [
    {
      "degree": "[Degree Type]",
      "school": "[University Name]",
      "date": "[Graduation Year]",
      "details": "[Optional: GPA, honors, relevant coursework]"
    }
  ],
  "skills": [
    {
      "category": "Technical Skills",
      "items": [/* Include technical skills from requirements */]
    },
    {
      "category": "Tools & Technologies",
      "items": [/* Industry-relevant tools */]
    },
    {
      "category": "Soft Skills",
      "items": [/* From soft skills list */]
    }
  ],
  "certifications": [
    /* If applicable - from certifications list */
  ]
}

CRITICAL RULES:
- Every experience bullet must include a NUMBER (%, $, time saved, people managed, etc.)
- Use DIFFERENT power words for each bullet (don't repeat)
- Company names must sound REAL (e.g., "TechVision Solutions", "DataCore Analytics")
- Achievements must be SPECIFIC and CREDIBLE (not exaggerated)
- Dates must be LOGICAL and sequential
- Skills must match the job title and industry
- NO placeholder text like "Company Name" or "XYZ Corp"

${request.customInstructions ? `ADDITIONAL INSTRUCTIONS: ${request.customInstructions}` : ''}

Generate the complete resume as valid JSON following the exact structure above.`
}

/**
 * Generate content using OpenAI API
 */
async function generateWithAI(prompt: string): Promise<string> {
  try {
    const completion = await openai().chat.completions.create({
      model: 'gpt-4o', // gpt-4o supports JSON response format
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8, // Higher temperature for more creative/varied output
      max_tokens: 2500,
      response_format: { type: 'json_object' } // Force JSON response
    })

    const content = completion.choices[0]?.message?.content || '{}'
    return content
  } catch (error: any) {
    console.error('[Resume Generator] OpenAI API error:', error)
    throw new Error(`Failed to generate resume: ${error.message}`)
  }
}

/**
 * Parse generated JSON into ParsedResume format
 */
function parseGeneratedResume(
  jsonContent: string,
  request: ResumeGenerationRequest
): ParsedResume {
  try {
    const data = JSON.parse(jsonContent)

    // Convert plain text to RichText format (Tiptap JSONContent)
    const toRichText = (text: string) => ({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text }] }]
    })

    return {
      contact: data.header || data.contact || {},
      targetTitle: data.header?.title || data.targetTitle || '',
      summary: toRichText(data.summary || ''),
      experience: (data.experience || []).map((exp: any) => ({
        ...exp,
        bullets: (exp.bullets || []).map((bullet: string) => toRichText(bullet))
      })),
      education: data.education || [],
      skills: data.skills || {},
      certifications: data.certifications || [],
      projects: data.projects || [],
      awards: data.awards || [],
      languages: data.languages || []
    }
  } catch (error: any) {
    console.error('[Resume Generator] JSON parse error:', error)
    throw new Error(`Failed to parse generated resume: ${error.message}`)
  }
}

/**
 * Convert ParsedResume to plain text for analysis
 */
function convertToPlainText(resume: ParsedResume): string {
  const sections: string[] = []

  // Contact
  if (resume.contact) {
    sections.push(`${resume.contact.firstName || ''} ${resume.contact.lastName || ''}`.trim())
    if (resume.targetTitle) sections.push(`${resume.targetTitle}`)
    sections.push(`${resume.contact.email || ''} | ${resume.contact.phone || ''}`)
    sections.push(`${resume.contact.location || ''}`)
  }

  // Summary
  if (resume.summary) {
    sections.push('\nSUMMARY')
    const summaryText = extractTextFromRichText(resume.summary)
    sections.push(summaryText)
  }

  // Experience
  if (resume.experience?.length > 0) {
    sections.push('\nEXPERIENCE')
    resume.experience.forEach(exp => {
      sections.push(`${exp.position} at ${exp.company}`)
      sections.push(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`)
      exp.bullets?.forEach(bullet => {
        const bulletText = extractTextFromRichText(bullet)
        sections.push(`• ${bulletText}`)
      })
    })
  }

  // Education
  if (resume.education?.length > 0) {
    sections.push('\nEDUCATION')
    resume.education.forEach(edu => {
      sections.push(`${edu.degree} - ${edu.institution}`)
      sections.push(`${edu.graduationDate || ''}`)
    })
  }

  // Skills
  if (resume.skills) {
    sections.push('\nSKILLS')
    if (resume.skills.technical?.length) {
      sections.push(`Technical: ${resume.skills.technical.join(', ')}`)
    }
    if (resume.skills.soft?.length) {
      sections.push(`Soft Skills: ${resume.skills.soft.join(', ')}`)
    }
    if (resume.skills.other?.length) {
      sections.push(`Other: ${resume.skills.other.join(', ')}`)
    }
  }

  return sections.filter(s => s).join('\n')
}

/**
 * Extract plain text from RichText (Tiptap JSONContent)
 */
function extractTextFromRichText(richText: any): string {
  if (typeof richText === 'string') return richText

  if (!richText?.content) return ''

  let text = ''
  richText.content.forEach((node: any) => {
    if (node.type === 'text') {
      text += node.text
    } else if (node.content) {
      text += extractTextFromRichText(node)
    }
  })

  return text
}

/**
 * Analyze quality of generated resume
 */
async function analyzeQuality(resumeText: string, request: ResumeGenerationRequest) {
  // Run ATS analysis
  const atsAnalysis = await analyzeResumeATS(resumeText)

  // Count power words
  const powerWordsCount = countPowerWords(resumeText)

  // Count quantified achievements
  const quantifiedCount = countQuantifiedAchievements(resumeText)

  // Extract keywords
  const keywords = extractKeywords(resumeText, request.industry)

  return {
    atsScore: atsAnalysis?.ats_score || 0,
    powerWordsCount,
    quantifiedAchievementsCount: quantifiedCount,
    keywords
  }
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Count power words in resume text
 */
function countPowerWords(text: string): number {
  let count = 0
  const allPowerWords = Object.values(ACTION_VERBS).flat()

  allPowerWords.forEach(word => {
    const escapedWord = escapeRegex(word)
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi')
    const matches = text.match(regex)
    if (matches) count += matches.length
  })

  return count
}

/**
 * Count quantified achievements (numbers, percentages, dollar amounts)
 */
function countQuantifiedAchievements(text: string): number {
  const patterns = [
    /\d+%/g,           // Percentages
    /\$\d+[\d,]*/g,    // Dollar amounts
    /\d+[KkMm]/g,      // Large numbers (10K, 5M)
    /#\d+/g,           // Rankings
    /\b\d+\+?\b/g      // General numbers
  ]

  let count = 0
  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) count += matches.length
  })

  return count
}

/**
 * Extract relevant keywords from resume text
 */
function extractKeywords(text: string, industry: string): string[] {
  const industryKeywords = ATS_KEYWORDS_BY_INDUSTRY[industry.toLowerCase()]
  if (!industryKeywords) return []

  const allKeywords = [
    ...industryKeywords.mustHave,
    ...industryKeywords.technical,
    ...industryKeywords.soft
  ]

  return allKeywords.filter(keyword => {
    const escapedKeyword = escapeRegex(keyword)
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i')
    return regex.test(text)
  })
}

/**
 * Generate SEO metadata for the resume example
 */
function generateSEOMetadata(request: ResumeGenerationRequest) {
  const { jobTitle, industry, experienceLevel } = request

  const slug = `${jobTitle}-${industry}-${experienceLevel}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const levelLabel = {
    entry: 'Entry Level',
    mid: 'Mid-Level',
    senior: 'Senior',
    executive: 'Executive'
  }[experienceLevel]

  return {
    slug,
    metaTitle: `${jobTitle} Resume Example | ${industry} | ${levelLabel}`,
    metaDescription: `Professional ${jobTitle} resume example for ${levelLabel.toLowerCase()} positions in ${industry}. Download ATS-optimized template with quantified achievements and industry keywords.`,
    h1Heading: `${jobTitle} Resume Example - ${industry} Industry`,
    h2Headings: [
      'Professional Summary',
      'Work Experience Highlights',
      'Technical Skills & Expertise',
      'How to Use This Resume Template'
    ],
    targetKeywords: [
      `${jobTitle} resume`,
      `${jobTitle} resume example`,
      `${industry} resume`,
      `${experienceLevel} ${jobTitle}`,
      `${jobTitle} resume template`,
      `${jobTitle} ${industry}`
    ],
    canonicalUrl: `/resumes/examples/${slug}`
  }
}

/**
 * Calculate overall quality score (0-100)
 */
function calculateOverallQualityScore(metrics: any): number {
  // Weighted scoring
  const atsWeight = 0.40
  const powerWordsWeight = 0.25
  const quantificationWeight = 0.20
  const keywordsWeight = 0.15

  // Normalize scores
  const atsScore = metrics.atsScore // Already 0-100
  const powerWordsScore = Math.min(100, (metrics.powerWordsCount / 10) * 100) // 10+ power words = 100
  const quantificationScore = Math.min(100, (metrics.quantifiedAchievementsCount / 8) * 100) // 8+ achievements = 100
  const keywordsScore = Math.min(100, (metrics.keywords.length / 10) * 100) // 10+ keywords = 100

  return Math.round(
    atsScore * atsWeight +
    powerWordsScore * powerWordsWeight +
    quantificationScore * quantificationWeight +
    keywordsScore * keywordsWeight
  )
}

/**
 * Batch generate multiple resume examples
 */
export async function batchGenerateExamples(
  requests: ResumeGenerationRequest[]
): Promise<GeneratedResumeExample[]> {
  console.log(`[Resume Generator] Starting batch generation of ${requests.length} examples`)

  const results: GeneratedResumeExample[] = []
  const errors: Array<{ request: ResumeGenerationRequest; error: string }> = []

  for (const request of requests) {
    try {
      const example = await generateResumeExample(request)
      results.push(example)
      console.log(`[Resume Generator] ✓ Generated: ${example.jobTitle} (Quality: ${example.qualityScore})`)
    } catch (error: any) {
      console.error(`[Resume Generator] ✗ Failed: ${request.jobTitle}`, error.message)
      errors.push({ request, error: error.message })
    }

    // Rate limiting: Wait 1 second between requests to avoid API limits
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log(`[Resume Generator] Batch complete: ${results.length} succeeded, ${errors.length} failed`)

  return results
}
