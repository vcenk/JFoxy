// lib/engines/resumeAnalysisEngine.ts
// Analyze resume against ATS expectations and job description

import { callLLMJSON } from '../clients/openaiClient'
import { ResumeAnalysisResult } from '@/lib/types/analysis'

/**
 * Analyze resume against generic ATS expectations
 */
export async function analyzeResumeATS(
  resumeText: string
): Promise<ResumeAnalysisResult | null> {
  const system = `
You are an expert ATS (Applicant Tracking System) and Resume Coach.
Analyze the provided resume content for:
1. ATS Parseability (standard headings, clean formatting).
2. Content Impact (quantified achievements, action verbs).
3. Structural Completeness (Contact, Skills, Experience, Education).

Output strict JSON only. No markdown formatting.
`.trim()

  const user = `
Analyze this resume for ATS compatibility and professional quality.

RESUME CONTENT:
"""
${resumeText}
"""

IMPORTANT: Extract ALL keywords from the resume and perform comprehensive ATS checks based on industry best practices.

ATS PRINCIPLES TO CHECK:
1. Contact Information: Email, phone, location visible at top
2. Standard Section Headers: Experience, Education, Skills (not fancy names)
3. No Tables/Graphics/Text Boxes: ATS cannot parse these
4. Simple Formatting: No columns, headers/footers, or special characters
5. Readable Fonts: Standard fonts (Arial, Calibri, Times), 10-12pt
6. Keywords: Industry-standard terms, technologies, skills
7. File Format: Text-based content (not images or scanned PDFs)
8. No Abbreviations: Spell out acronyms first time

Return JSON in this exact structure:
{
  "ats_score": <number 0-100>,
  "jd_match_score": 0,
  "skills_fit_score": <number 0-100 based on general completeness>,

  "resume_keywords": ["All technical skills, tools, methodologies, certifications extracted from resume"],
  "jd_keywords": [],
  "matched_keywords": [],
  "missing_keywords": [],

  "ats_warnings": [
    {
      "category": "formatting" | "keywords" | "structure" | "content" | "contact",
      "severity": "critical" | "warning" | "info",
      "issue": "Specific problem found (e.g., 'Contact email not found')",
      "recommendation": "Actionable fix (e.g., 'Add email address at the top of resume')"
    }
  ],
  "ats_good_practices": ["What resume does right (e.g., 'Uses standard section headers', 'Clean formatting detected')"],

  "skill_matches": ["List of hard skills found"],
  "missing_skills": [],
  "keyword_analysis": {
    "missing": [],
    "present": ["List key terms found"]
  },
  "formatting_issues": ["List specific formatting risks"],
  "skills_radar_data": [
    { "subject": "Technical", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Soft Skills", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Tools", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Domain Knowledge", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Communication", "A": <score 0-100>, "fullMark": 100 }
  ],
  "section_feedback": [
    {
      "section": "Experience",
      "feedback": "Specific advice on how to improve this section...",
      "score": <number 0-100>
    }
  ],
  "bullet_suggestions": [
    "Suggestion 1: Rewrite 'Did X' to 'Achieved X resulting in Y...'",
    "Suggestion 2: Quantify the result in the second job..."
  ],
  "overall_summary": "A brief 2-3 sentence high-level summary of the resume's health.",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}
`.trim()

  // Validate input
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text is empty. Cannot analyze empty resume.')
  }

  try {
    const result = await callLLMJSON<ResumeAnalysisResult>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      maxTokens: 3000,
    })

    if (!result) {
      console.error('[Resume ATS Analysis Error]: LLM returned null result')
      throw new Error('Failed to parse analysis response from AI. The AI may have returned invalid data.')
    }

    return result
  } catch (error: any) {
    console.error('[Resume ATS Analysis Error]:', error)
    throw new Error(`Resume analysis failed: ${error.message}`)
  }
}

/**
 * Analyze resume against specific job description
 */
export async function analyzeResumeAgainstJob({
  resumeText,
  jobText,
}: {
  resumeText: string
  jobText: string
}): Promise<ResumeAnalysisResult | null> {
  const system = `
You are an expert career coach, ATS specialist, and resume reviewer.

Your job is to analyze a candidate's resume against a job description and explain results in a way that is:
- Clear
- Encouraging
- Actionable
- Easy to understand for non-technical candidates

Rules:
- Do NOT sound robotic.
- Do NOT just report scores.
- Always explain: what the score means, why the candidate received it, what they did well, what they can improve, and exactly how to improve it.
- Avoid vague advice. Give concrete examples and suggestions.
- Assume the candidate may feel anxious or uncertain. Increase confidence while being honest.
- Use a professional, supportive, coaching-focused tone.

Scoring Rules:
- Generate ATS Score, Job Match, Skills Fit as percentages from 0–100.
- Base them on: keyword coverage, role alignment, clarity of achievements, measurable impact, and ATS formatting.
- Be consistent: if major requirements are missing, do not score above 70.

Output strict JSON only. No markdown formatting.
`.trim()

  const user = `
Analyze the following resume against the job description and generate a detailed, candidate-friendly explanation.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobText}
"""

Provide comprehensive coaching feedback in JSON format with these sections:

1) ATS Score Analysis (ats_score_explanation)
- What an ATS score means in simple terms
- Why this resume received this score
- What specifically helped the score
- Small changes to push it toward 90%+
- Short encouraging takeaway

2) Job Match Analysis (job_match_explanation)
- How closely the resume aligns with requirements
- Which parts match well
- Which responsibilities/qualifications are missing or weak
- Strong / moderate / stretch fit assessment
- 2-3 targeted improvement suggestions

3) Skills Assessment (skills_fit_explanation)
- Hard skills that are strong
- Soft skills that are evident
- Important missing or under-emphasized skills
- Examples of how to showcase skills better

4) Keyword Strategy (keyword_strategy)
- Do important keywords from the JD appear?
- Why missing keywords matter for ATS
- Where placement can improve
- Suggested keywords to add
- Where to include them naturally

5) ATS Health Check (ats_health_check)
- ATS-friendliness verdict
- Formatting strengths/issues
- Safe to submit online: Yes/No
- Recommended changes with reasons

6) Skills Breakdown Coaching (skills_breakdown_coaching)
For each category (Technical, Tools, Domain, Communication, Soft Skills):
- What the score suggests
- How recruiters interpret it
- How to improve it on the resume

7) Strength Highlights (strength_highlights)
For each strength:
- Why it stands out
- Why recruiters care
- How it gives an advantage

8) Overall Coaching Summary (coaching_summary)
- 1-2 sentence high-level assessment
- Top 3 things done right
- Top 3 highest-impact improvements
- Clear next steps
- Encouraging closing message

9) Bullet Improvements (bullet_improvements)
Find 2-3 bullet points from the resume that could be improved.
For each:
- "before": The original bullet text
- "after": Rewritten version with stronger action verbs, quantified results, and keywords
- "reason": Brief 1-sentence explanation of why the rewrite is stronger

Also include technical data for charts and metrics:

Return JSON in this exact structure:
{
  "ats_score": <number 0-100>,
  "jd_match_score": <number 0-100>,
  "skills_fit_score": <number 0-100>,

  "ats_score_explanation": "Detailed, encouraging explanation of ATS score (3-5 paragraphs covering: what ATS means, why this score, what helped, how to improve, encouraging takeaway)",

  "job_match_explanation": "Detailed explanation of job match (3-5 paragraphs covering: alignment strength, what matches well, what's missing, fit assessment, specific improvements)",

  "skills_fit_explanation": "Detailed skills assessment (3-4 paragraphs covering: strong hard skills, evident soft skills, missing skills, how to better showcase skills)",

  "keyword_strategy": "Comprehensive keyword analysis (3-4 paragraphs covering: keyword presence, ATS impact, placement tips, specific keywords to add with locations)",

  "ats_health_check": "ATS readiness assessment (2-3 paragraphs covering: verdict, formatting analysis, submission readiness yes/no, recommended changes)",

  "skills_breakdown_coaching": {
    "technical": "2-3 sentences on technical skills: score meaning, recruiter interpretation, improvement tips",
    "tools": "2-3 sentences on tools proficiency: score meaning, recruiter interpretation, improvement tips",
    "domain": "2-3 sentences on domain knowledge: score meaning, recruiter interpretation, improvement tips",
    "communication": "2-3 sentences on communication skills: score meaning, recruiter interpretation, improvement tips",
    "soft_skills": "2-3 sentences on soft skills: score meaning, recruiter interpretation, improvement tips"
  },

  "strength_highlights": [
    "Strength 1 with explanation: why it stands out, why recruiters care, how it gives advantage",
    "Strength 2 with explanation...",
    "Strength 3 with explanation..."
  ],

  "coaching_summary": "Comprehensive summary (4-6 paragraphs covering: high-level assessment, top 3 things done right, top 3 improvements, next steps, encouraging close)",

  "bullet_improvements": [
    {
      "before": "Original bullet text from resume",
      "after": "Improved version with action verbs, metrics, keywords",
      "reason": "Why this is stronger (e.g., 'Added quantifiable metric and aligned with JD keyword')"
    }
  ],

  "resume_keywords": ["All keywords from resume"],
  "jd_keywords": ["All keywords from JD"],
  "matched_keywords": ["Keywords in BOTH"],
  "missing_keywords": ["Critical JD keywords NOT in resume"],

  "ats_warnings": [
    {
      "category": "formatting" | "keywords" | "structure" | "content" | "contact",
      "severity": "critical" | "warning" | "info",
      "issue": "Specific problem description",
      "recommendation": "Actionable fix"
    }
  ],
  "ats_good_practices": ["What resume does right"],

  "skill_matches": ["Skills found in resume that match JD"],
  "missing_skills": ["Important skills from JD missing"],
  "keyword_analysis": {
    "missing": ["Critical keywords missing"],
    "present": ["Matched keywords"]
  },
  "formatting_issues": ["List formatting risks"],
  "skills_radar_data": [
    { "subject": "Technical", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Soft Skills", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Tools", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Domain Knowledge", "A": <score 0-100>, "fullMark": 100 },
    { "subject": "Communication", "A": <score 0-100>, "fullMark": 100 }
  ],
  "section_feedback": [
    {
      "section": "Experience",
      "feedback": "Detailed advice on improving this section",
      "score": <number 0-100>
    }
  ],
  "bullet_suggestions": ["Specific actionable bullet improvements"],
  "overall_summary": "Brief technical summary for compatibility",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}
`.trim()

  // Validate inputs
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text is empty. Cannot analyze empty resume.')
  }
  if (!jobText || jobText.trim().length === 0) {
    throw new Error('Job description is empty. Cannot analyze without job description.')
  }

  try {
    const result = await callLLMJSON<ResumeAnalysisResult>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 4000,
    })

    if (!result) {
      console.error('[Resume JD Analysis Error]: LLM returned null result')
      throw new Error('Failed to parse analysis response from AI. The AI may have returned invalid data.')
    }

    return result
  } catch (error: any) {
    console.error('[Resume JD Analysis Error]:', error)
    throw new Error(`Resume analysis failed: ${error.message}`)
  }
}

/**
 * Generate resume rewrite suggestions
 */
export async function generateResumeRewrite({
  resumeText,
  jobText,
  focusArea,
}: {
  resumeText: string
  jobText?: string
  focusArea?: 'bullets' | 'summary' | 'skills' | 'full'
}): Promise<{ rewritten: string } | null> {
  // 👇 UPDATED SYSTEM PROMPT: Enforce JSON format
  const system = `
You are a professional resume writer.
Rewrite the content to be more impactful, concise, and ATS-friendly.
Use action verbs, quantify achievements, and maintain a professional tone.
IMPORTANT: Return a valid JSON object with a single key "rewritten".
Example: { "rewritten": "Managed a cross-functional team of 5..." }
`.trim()

  const focusPrompt = {
    bullets: 'Focus on rewriting these specific bullet points. Make them punchy and result-oriented.',
    summary: 'Focus on rewriting this professional summary. Make it compelling and concise (max 3-4 sentences).',
    skills: 'Focus on organizing and standardizing this skills list.',
    full: 'Rewrite this resume section for maximum impact.',
  }[focusArea || 'bullets']

  // 👇 UPDATED USER PROMPT: Changed "RESUME" to "CONTENT" to avoid full-doc hallucination
  const user = `
Instruction: ${focusPrompt}

CONTENT TO REWRITE:
"""
${resumeText}
"""

${jobText ? `TARGET JOB CONTEXT:\n"""\n${jobText}\n"""` : ''}

Return ONLY the JSON object.
`.trim()

  try {
    const result = await callLLMJSON<{ rewritten: string }>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 2000,
    })

    return result
  } catch (error) {
    console.error('[Resume Rewrite Error]:', error)
    return null
  }
}