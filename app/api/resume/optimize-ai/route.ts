// app/api/resume/optimize-ai/route.ts
// AI-powered resume optimization using OpenAI + powerWords + atsKeywords

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { callLLMJSON } from '@/lib/clients/openaiClient'
import {
    getAuthUser,
    unauthorizedResponse,
    badRequestResponse,
    serverErrorResponse,
    successResponse,
} from '@/lib/utils/apiHelpers'
import {
    POWER_WORD_SYNONYMS,
    WEAK_WORDS,
    ACTION_VERBS,
    INDUSTRY_POWER_WORDS,
} from '@/lib/data/powerWords'
import {
    ATS_KEYWORDS_BY_INDUSTRY,
    getATSKeywordsByIndustry,
} from '@/lib/data/atsKeywords'
import { searchJobTitles } from '@/lib/data/jobTitleTaxonomy'

// Build context from our data files for the AI
function buildOptimizationContext(industry?: string, jobTitle?: string) {
    // Get industry-specific data
    const industryKeywords = industry ? getATSKeywordsByIndustry(industry) : null
    const industryPowerWords = industry && INDUSTRY_POWER_WORDS[industry as keyof typeof INDUSTRY_POWER_WORDS]
        ? INDUSTRY_POWER_WORDS[industry as keyof typeof INDUSTRY_POWER_WORDS]
        : []

    // Get job title skills
    let jobSkills: string[] = []
    if (jobTitle) {
        const matches = searchJobTitles(jobTitle)
        if (matches.length > 0) {
            const topMatch = matches[0]
            jobSkills = [
                ...(topMatch.typicalSkills?.technical || []).slice(0, 8),
                ...(topMatch.typicalSkills?.soft || []).slice(0, 4),
            ]
        }
    }

    return {
        weakWordsToReplace: WEAK_WORDS.slice(0, 15),
        powerWordAlternatives: Object.entries(POWER_WORD_SYNONYMS)
            .slice(0, 20)
            .map(([weak, alts]) => `"${weak}" → ${alts.slice(0, 3).join(', ')}`),
        industryKeywords: industryKeywords?.mustHave?.slice(0, 15) || [],
        industryTechnical: industryKeywords?.technical?.slice(0, 15) || [],
        industryPowerWords: industryPowerWords.slice(0, 10),
        jobSkills,
        actionVerbs: [
            ...ACTION_VERBS.leadership.slice(0, 5),
            ...ACTION_VERBS.technical.slice(0, 5),
            ...ACTION_VERBS.analytical.slice(0, 5),
        ],
    }
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req)
    if (!user) {
        return unauthorizedResponse()
    }

    try {
        const body = await req.json()
        const { resumeId, jobTitle, jobDescription, industry, missingKeywords } = body

        if (!resumeId) {
            return badRequestResponse('Resume ID is required')
        }

        // Get resume
        const { data: resume, error: fetchError } = await supabaseAdmin
            .from('resumes')
            .select('*')
            .eq('id', resumeId)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !resume) {
            return badRequestResponse('Resume not found')
        }

        if (!resume.content) {
            return badRequestResponse('Resume has no content to optimize')
        }

        const content = resume.content

        // Build optimization context from our data files
        const context = buildOptimizationContext(industry, jobTitle)

        // Build the AI prompt
        const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to rewrite and optimize a resume for maximum impact and ATS compatibility.

OPTIMIZATION GUIDELINES:

1. POWER WORDS - Replace weak language with strong action verbs:
   Weak words to AVOID: ${context.weakWordsToReplace.join(', ')}
   Strong alternatives: ${context.powerWordAlternatives.join('; ')}
   Recommended action verbs: ${context.actionVerbs.join(', ')}

2. INDUSTRY KEYWORDS - Incorporate these ATS-friendly terms naturally:
   Must-have keywords: ${context.industryKeywords.join(', ') || 'Use general professional terms'}
   Technical skills: ${context.industryTechnical.join(', ') || 'Highlight relevant technical skills'}
   ${context.industryPowerWords.length > 0 ? `Industry power words: ${context.industryPowerWords.join(', ')}` : ''}

3. JOB-SPECIFIC SKILLS:
   ${context.jobSkills.length > 0 ? `Target job skills: ${context.jobSkills.join(', ')}` : 'Focus on transferable professional skills'}
   ${missingKeywords?.length > 0 ? `Missing keywords to add: ${missingKeywords.join(', ')}` : ''}

4. ADDING QUANTIFIABLE METRICS (VERY IMPORTANT):
   For EACH bullet point, try to add one of these metric types:
   - Percentage improvements: "increased efficiency by 15%", "reduced errors by 25%"
   - Dollar amounts: "managed $50K budget", "generated $100K in revenue"
   - Team/project sizes: "led team of 5", "managed 12 projects"
   - Time savings: "reduced processing time by 4 hours weekly"
   - Volume/scale: "processed 500+ transactions", "supported 200+ users"

   RULES FOR REALISTIC METRICS:
   - If original bullet mentions a result, quantify it with reasonable estimates
   - Use conservative, realistic estimates (10-30% improvements, not 500%)
   - ALWAYS provide actual numbers - NEVER use placeholders like [X%] or [X] or brackets
   - Example: "Improved process efficiency" → "Improved process efficiency by 20%, reducing manual workload"
   - If you truly cannot estimate a metric, keep the bullet impactful without numbers rather than using placeholders

5. BULLET POINT STRUCTURE:
   - Start every bullet with a strong action verb
   - Use format: [Action Verb] + [What You Did] + [Quantified Result/Impact]
   - Keep bullets concise (1-2 lines max)
   - Remove filler words and passive voice

6. SUMMARY RULES:
   - Lead with years of experience and key expertise
   - Mention 2-3 top skills/technologies
   - Include a unique value proposition
   - Keep to 2-3 sentences

CRITICAL RULES:
- DO NOT exaggerate or make up unrealistic claims
- Keep all facts and achievements truthful to the original
- When adding metrics, be conservative and realistic
- If unsure about a number, use a reasonable range like [15-25%]
Return ONLY valid JSON matching the exact structure provided.`

        const userPrompt = `Optimize this resume content for ${jobTitle || 'a professional role'}${industry ? ` in the ${industry} industry` : ''}.

CURRENT RESUME JSON (you MUST return the same structure with improved content):
${JSON.stringify(content, null, 2)}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription.slice(0, 1000)}\n` : ''}

CRITICAL INSTRUCTIONS:
1. Return VALID JSON with ALL sections - do not omit any section
2. Keep the EXACT same structure as the input
3. Only improve the TEXT content, not the structure
4. summary MUST be a non-empty string
5. skills MUST be an array with at least the same categories
6. experience bullets should be enhanced but keep the same count

Return JSON with this EXACT structure (fill in improved content):
{
  "header": ${JSON.stringify(content.header || {})},
  "summary": "IMPROVED: [your enhanced summary here - 2-3 sentences with power words]",
  "experience": [
    ${(content.experience || []).map((exp: any, i: number) => `{
      "title": "${exp.title || ''}",
      "company": "${exp.company || ''}",
      "date": "${exp.date || ''}",
      "bullets": ["IMPROVED bullet 1", "IMPROVED bullet 2", ...]
    }`).join(',\n    ')}
  ],
  "education": ${JSON.stringify(content.education || [])},
  "skills": ${JSON.stringify(content.skills || [])}
}`

        // Call OpenAI
        const optimizedContent = await callLLMJSON<any>({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            maxTokens: 4000,
        })

        if (!optimizedContent) {
            return serverErrorResponse('AI optimization failed to return results')
        }

        // Helper to clean placeholder brackets from AI output (e.g., [X%] → 15%)
        const cleanPlaceholders = (text: string): string => {
            return text
                // Replace [X%] or [X] patterns with realistic estimates
                .replace(/\[X%?\]/gi, '15%')
                .replace(/\[\d+-\d+%?\]/g, (match) => {
                    // Extract first number from range like [15-20%]
                    const num = match.match(/\d+/)?.[0] || '15'
                    return match.includes('%') ? `${num}%` : num
                })
                .replace(/\[X\s*(hours?|days?|weeks?|months?)\]/gi, '4 hours')
                .replace(/\[\$?X[Kk]?\]/gi, '$50K')
                .replace(/\[X\+?\]/gi, '20+')
        }

        // Helper to convert plain text to RichText format
        const textToRichText = (text: string) => ({
            type: 'doc',
            content: [{ type: 'paragraph', content: text ? [{ type: 'text', text: cleanPlaceholders(text) }] : [] }]
        })

        // Helper to extract plain text from any bullet format
        const extractBulletText = (bullet: any): string => {
            if (typeof bullet === 'string') return bullet
            if (bullet?.content?.content?.[0]?.content?.[0]?.text) {
                return bullet.content.content[0].content[0].text
            }
            if (bullet?.content?.[0]?.content?.[0]?.text) {
                return bullet.content[0].content[0].text
            }
            return ''
        }

        // CRITICAL: Preserve original structure, only update text content
        // Merge experience - preserve IDs, enabled flags, and structure
        let mergedExperience = content.experience
        if (optimizedContent.experience && Array.isArray(optimizedContent.experience) && content.experience) {
            mergedExperience = content.experience.map((origExp: any, expIndex: number) => {
                // Find matching AI-optimized experience by index (AI returns same order)
                const aiExp = optimizedContent.experience[expIndex]
                if (!aiExp) return origExp // Keep original if AI didn't return this index

                // Merge bullets - preserve structure, only update text
                const mergedBullets = (origExp.bullets || []).map((origBullet: any, bulletIndex: number) => {
                    const aiBulletText = aiExp.bullets?.[bulletIndex]
                    if (!aiBulletText || typeof aiBulletText !== 'string') {
                        return origBullet // Keep original if no AI improvement
                    }

                    // Preserve BulletItem structure (id, enabled), update content
                    if (origBullet.id !== undefined) {
                        return {
                            ...origBullet,
                            content: textToRichText(aiBulletText)
                        }
                    }
                    // Legacy format - just return RichText
                    return textToRichText(aiBulletText)
                })

                return {
                    ...origExp,
                    bullets: mergedBullets
                }
            })
        }

        // Merge summary - handle RichText format
        let mergedSummary = content.summary
        if (optimizedContent.summary && typeof optimizedContent.summary === 'string' && optimizedContent.summary.trim().length > 0) {
            // Check if original summary is RichText or string
            if (typeof content.summary === 'object' && content.summary?.type === 'doc') {
                mergedSummary = textToRichText(optimizedContent.summary)
            } else {
                mergedSummary = cleanPlaceholders(optimizedContent.summary)
            }
        }

        // Build final content preserving ALL original structure
        const finalContent = {
            ...content,
            summary: mergedSummary,
            experience: mergedExperience,
            // Keep skills, education, and everything else exactly as is
        }

        // Update resume in database
        const { error: updateError } = await supabaseAdmin
            .from('resumes')
            .update({
                content: finalContent,
                updated_at: new Date().toISOString(),
            })
            .eq('id', resumeId)
            .eq('user_id', user.id)

        if (updateError) {
            console.error('[Resume AI Optimization Update Error]:', updateError)
            return serverErrorResponse('Failed to save optimized resume')
        }

        return successResponse({
            message: 'Resume optimized with AI-powered enhancements!',
            optimized: true,
            optimizedContent: finalContent,
            improvements: {
                industryKeywordsUsed: context.industryKeywords.length,
                jobSkillsMatched: context.jobSkills.length,
                powerWordsApplied: true,
            },
        })

    } catch (error: any) {
        console.error('[Resume AI Optimize Error]:', error)
        return serverErrorResponse(error.message || 'AI optimization failed')
    }
}
