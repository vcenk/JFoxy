// app/api/practice/questions/route.ts
// Generate practice questions for a new practice session

import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'  // lib/clients/supabaseClient.ts
import { callLLM } from '@/lib/clients/openaiClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
  checkUsageLimits,
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
    const validation = validateRequiredFields(body, ['category', 'difficulty', 'questionCount'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { category, difficulty, questionCount, resumeId, jobDescriptionId } = body

    // Check usage limits for STAR voice practice sessions
    const limitCheck = await checkUsageLimits(user.id, 'star_voice_session')
    if (!limitCheck.allowed) {
      return badRequestResponse(limitCheck.reason || 'Practice session limit reached')
    }

    // Get resume if provided
    let resumeText: string | undefined
    let resumeContent: any = null
    if (resumeId) {
      const { data: resume } = await supabaseAdmin
        .from('resumes')
        .select('raw_text, content')
        .eq('id', resumeId)
        .eq('user_id', user.id)
        .single()

      resumeText = resume?.raw_text
      resumeContent = resume?.content
    }

    // Get job description if provided
    let jobText: string | undefined
    let jobTitle: string | undefined
    let jobCompany: string | undefined
    if (jobDescriptionId) {
      const { data: jd } = await supabaseAdmin
        .from('job_descriptions')
        .select('*')
        .eq('id', jobDescriptionId)
        .eq('user_id', user.id)
        .single()

      jobText = jd?.description
      jobTitle = jd?.title
      jobCompany = jd?.company
    }

    // Fetch previously asked questions for this user to avoid repetition
    // First get user's session IDs, then get questions from those sessions
    const { data: userSessions } = await supabaseAdmin
      .from('practice_sessions')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10) // Last 10 sessions

    const sessionIds = userSessions?.map(s => s.id) || []

    let recentQuestionTexts: string[] = []
    if (sessionIds.length > 0) {
      const { data: previousQuestions } = await supabaseAdmin
        .from('practice_questions')
        .select('question_text')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
        .limit(50)

      recentQuestionTexts = previousQuestions?.map(q => q.question_text) || []
    }

    // Create practice session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('practice_sessions')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        question_category: category,
        difficulty: difficulty,
        status: 'in_progress',
        total_questions: questionCount,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Practice`,
      })
      .select()
      .single()

    if (sessionError || !session) {
      console.error('[Practice Session Create Error]:', sessionError)
      return serverErrorResponse('Failed to create practice session')
    }

    // Generate questions based on category
    const questions = await generatePracticeQuestions({
      category,
      difficulty,
      count: questionCount,
      resumeContext: resumeText,
      resumeContent: resumeContent,
      jobContext: jobText,
      jobTitle: jobTitle,
      jobCompany: jobCompany,
      previousQuestions: recentQuestionTexts,
    })

    if (!questions || questions.length === 0) {
      return serverErrorResponse('Failed to generate practice questions')
    }

    // Save questions to database
    // If difficulty is 'random', assign a random difficulty to each question
    const difficultyLevels = ['easy', 'medium', 'hard']
    const getQuestionDifficulty = (baseDifficulty: string) => {
      if (baseDifficulty === 'random') {
        return difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)]
      }
      return baseDifficulty
    }

    const questionInserts = questions.map((q, index) => ({
      session_id: session.id,
      question_text: q.text,
      question_category: category,
      difficulty: getQuestionDifficulty(difficulty),
      order_index: index + 1,
      expected_components: {
        tips: q.tips,
        suggested_duration: q.suggested_duration || 120,
        type: q.type
      },
    }))

    const { data: savedQuestions, error: questionsError } = await supabaseAdmin
      .from('practice_questions')
      .insert(questionInserts)
      .select()

    if (questionsError) {
      console.error('[Practice Questions Save Error]:', questionsError)
      return serverErrorResponse('Failed to save practice questions')
    }

    // Track usage
    await trackUsage({
      userId: user.id,
      resourceType: 'practice_sessions',
      resourceCount: 1,
      sessionId: session.id,
      metadata: { category, difficulty, questionCount },
    })

    return successResponse({
      session,
      questions: savedQuestions,
    })
  } catch (error) {
    console.error('[Practice Questions API Error]:', error)
    return serverErrorResponse()
  }
}

// Helper function to generate practice questions using AI
async function generatePracticeQuestions({
  category,
  difficulty,
  count,
  resumeContext,
  resumeContent,
  jobContext,
  jobTitle,
  jobCompany,
  previousQuestions = [],
}: {
  category: string
  difficulty: string
  count: number
  resumeContext?: string
  resumeContent?: any
  jobContext?: string
  jobTitle?: string
  jobCompany?: string
  previousQuestions?: string[]
}): Promise<Array<{ text: string; type: string; suggested_duration?: number; tips?: string[] }>> {

  // ============================================
  // STEP 1: Extract specific details from resume
  // ============================================
  const extractedResume = {
    name: '',
    headline: '',
    skills: [] as string[],
    experiences: [] as { company: string; position: string; highlights: string[] }[],
    achievements: [] as string[],
  }

  if (resumeContent) {
    extractedResume.name = resumeContent.basics?.name || ''
    extractedResume.headline = resumeContent.basics?.headline || ''

    // Extract skills
    if (resumeContent.skills && Array.isArray(resumeContent.skills)) {
      extractedResume.skills = resumeContent.skills.flatMap((s: any) =>
        Array.isArray(s.keywords) ? s.keywords : [s.name]
      ).filter(Boolean).slice(0, 15)
    }

    // Extract experiences with ALL highlights
    if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
      extractedResume.experiences = resumeContent.experience.slice(0, 5).map((exp: any) => ({
        company: exp.company || 'Unknown Company',
        position: exp.position || 'Unknown Position',
        highlights: Array.isArray(exp.highlights) ? exp.highlights.slice(0, 5) : [],
      }))

      // Collect all achievements/highlights
      extractedResume.achievements = resumeContent.experience
        .flatMap((exp: any) => exp.highlights || [])
        .filter(Boolean)
        .slice(0, 20)
    }
  }

  // ============================================
  // STEP 2: Extract key requirements from job description
  // ============================================
  const extractedJob = {
    title: jobTitle || '',
    company: jobCompany || '',
    keyRequirements: [] as string[],
    responsibilities: [] as string[],
  }

  if (jobContext) {
    // Simple extraction of key phrases (skills, requirements)
    const skillPatterns = /(?:experience with|proficiency in|knowledge of|familiar with|expertise in|skilled in|ability to)\s+([^,.;]+)/gi
    const matches = Array.from(jobContext.matchAll(skillPatterns))
    for (const match of matches) {
      if (match[1] && match[1].length < 50) {
        extractedJob.keyRequirements.push(match[1].trim())
      }
    }

    // Extract bullet points or key phrases
    const bulletPoints = jobContext.match(/[•\-\*]\s*([^\n•\-\*]+)/g) || []
    extractedJob.responsibilities = bulletPoints
      .map(b => b.replace(/^[•\-\*]\s*/, '').trim())
      .filter(b => b.length > 10 && b.length < 200)
      .slice(0, 10)
  }

  // ============================================
  // STEP 3: Select random focus themes for variety
  // ============================================
  const focusThemes: Record<string, string[]> = {
    behavioral: [
      'problem-solving under pressure',
      'cross-functional collaboration',
      'adapting to change',
      'taking initiative',
      'learning from failure',
      'exceeding expectations',
      'building relationships',
      'handling ambiguity',
      'prioritization decisions',
      'influencing without authority',
    ],
    leadership: [
      'building high-performing teams',
      'managing underperformers',
      'driving organizational change',
      'strategic decision-making',
      'developing talent',
      'stakeholder management',
      'crisis leadership',
      'vision and direction setting',
      'resource allocation',
      'cultural transformation',
    ],
    technical: [
      'system scalability challenges',
      'debugging complex issues',
      'technical debt management',
      'architecture decisions',
      'performance optimization',
      'security considerations',
      'API design',
      'data modeling',
      'microservices patterns',
      'cloud infrastructure',
    ],
    conflict: [
      'disagreements with managers',
      'team member conflicts',
      'cross-team disputes',
      'customer escalations',
      'priority conflicts',
      'resource contention',
      'communication breakdowns',
      'ethical disagreements',
      'deadline pressures',
      'scope creep negotiations',
    ],
  }

  // Randomly select themes for this session
  const categoryThemes = focusThemes[category] || focusThemes.behavioral
  const shuffledThemes = categoryThemes.sort(() => Math.random() - 0.5)
  const selectedThemes = shuffledThemes.slice(0, count)

  // ============================================
  // STEP 4: Build rich context for LLM
  // ============================================
  let contextInfo = ''

  // Add resume context with specific details
  if (extractedResume.experiences.length > 0 || extractedResume.skills.length > 0) {
    contextInfo += '\n=== CANDIDATE PROFILE ===\n'
    if (extractedResume.headline) {
      contextInfo += `Current Role: ${extractedResume.headline}\n`
    }

    if (extractedResume.skills.length > 0) {
      contextInfo += `\nKey Skills: ${extractedResume.skills.join(', ')}\n`
    }

    if (extractedResume.experiences.length > 0) {
      contextInfo += '\nCareer History:\n'
      extractedResume.experiences.forEach((exp, i) => {
        contextInfo += `\n${i + 1}. ${exp.position} at ${exp.company}\n`
        if (exp.highlights.length > 0) {
          contextInfo += '   Achievements:\n'
          exp.highlights.forEach(h => {
            contextInfo += `   - ${h}\n`
          })
        }
      })
    }
  }

  // Add job context with extracted requirements
  if (extractedJob.title) {
    contextInfo += '\n\n=== TARGET POSITION ===\n'
    contextInfo += `Role: ${extractedJob.title}${extractedJob.company ? ` at ${extractedJob.company}` : ''}\n`

    if (extractedJob.keyRequirements.length > 0) {
      contextInfo += `\nKey Requirements: ${extractedJob.keyRequirements.slice(0, 8).join(', ')}\n`
    }

    if (extractedJob.responsibilities.length > 0) {
      contextInfo += '\nResponsibilities:\n'
      extractedJob.responsibilities.slice(0, 6).forEach(r => {
        contextInfo += `- ${r}\n`
      })
    }

    // Include full job description for more context
    if (jobContext) {
      contextInfo += `\nFull Description:\n${jobContext.substring(0, 1500)}\n`
    }
  }

  // ============================================
  // STEP 5: Build enhanced system prompt
  // ============================================
  const categoryInstructions: Record<string, string> = {
    behavioral: `Generate BEHAVIORAL interview questions that probe specific past experiences.
Each question MUST:
- Reference a SPECIFIC skill, achievement, or experience from the candidate's resume
- Be directly relevant to the target job requirements
- Use formats like: "Tell me about a time when...", "Describe a situation where...", "Give an example of..."
- Target different aspects of the candidate's background (don't repeat similar questions)`,

    leadership: `Generate LEADERSHIP interview questions that assess management and strategic abilities.
Each question MUST:
- Reference specific leadership experiences or team sizes from the resume
- Connect to responsibilities in the target role
- Cover different leadership competencies: team building, strategy, change management, talent development
- Challenge the candidate to demonstrate executive-level thinking`,

    technical: `Generate TECHNICAL interview questions that assess problem-solving and system design skills.
Each question MUST:
- Reference specific technologies, projects, or technical achievements from the resume
- Be relevant to the technical requirements of the target position
- Cover different technical competencies: architecture, debugging, optimization, trade-offs
- Be answerable through the STAR method (not pure coding questions)`,

    conflict: `Generate CONFLICT RESOLUTION questions that assess interpersonal and negotiation skills.
Each question MUST:
- Be realistic workplace scenarios relevant to the candidate's seniority level
- Cover different types of conflicts: peer, manager, stakeholder, customer
- Reference contexts from the candidate's industry or role type
- Require demonstration of emotional intelligence and professionalism`,
  }

  const instructions = categoryInstructions[category] || categoryInstructions.behavioral

  // Include previously asked questions to avoid
  let exclusionNote = ''
  if (previousQuestions.length > 0) {
    exclusionNote = `\n\n**QUESTIONS TO AVOID (already asked recently):**\n${previousQuestions.slice(0, 15).map(q => `- "${q.substring(0, 100)}..."`).join('\n')}\n\nGenerate DIFFERENT questions that explore other aspects of the candidate's experience.`
  }

  const systemPrompt = `You are an elite interview coach creating a personalized practice session.

${instructions}

**CRITICAL REQUIREMENTS:**
1. EVERY question MUST directly reference specific details from the candidate's resume or target job
2. Questions should feel like they were written by someone who carefully reviewed the candidate's background
3. DO NOT generate generic questions - each should feel tailored to THIS specific candidate
4. Difficulty level: ${difficulty.toUpperCase()}
5. Generate EXACTLY ${count} questions
6. Each question should explore a DIFFERENT theme/competency

**FOCUS THEMES FOR THIS SESSION:**
${selectedThemes.map((t, i) => `${i + 1}. ${t}`).join('\n')}

**DIFFICULTY GUIDE:**
- Easy: Direct questions about clear accomplishments, straightforward scenarios
- Medium: Questions requiring detailed storytelling, multiple stakeholders, measurable outcomes
- Hard: Complex scenarios with competing priorities, failures/setbacks, strategic trade-offs${exclusionNote}

**OUTPUT FORMAT:**
Return a JSON array with EXACTLY ${count} objects:
[
  {
    "text": "The personalized interview question referencing specific resume/job details",
    "type": "${category}",
    "focus_theme": "the theme this question targets",
    "suggested_duration": 120,
    "tips": ["Specific tip 1", "Specific tip 2", "Specific tip 3"]
  }
]

Return ONLY valid JSON, no other text.`

  const userPrompt = contextInfo.length > 50
    ? `Based on this candidate profile and target job, generate ${count} highly personalized ${category} interview questions:\n${contextInfo}`
    : `Generate ${count} ${difficulty} difficulty ${category} interview questions for a professional practice session. Make them engaging and thought-provoking.`

  // ============================================
  // STEP 6: Call LLM with higher temperature for variety
  // ============================================
  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.9, // Higher temperature for more variety
      maxTokens: 2000,
    })

    // Parse the JSON response
    let questions: any[]
    try {
      let cleanedResponse = response.trim()
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '')
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '')
      }

      questions = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('[Question Generation Parse Error]:', parseError)
      console.error('[LLM Response]:', response)
      return generateFallbackQuestions(category, count, extractedResume, extractedJob)
    }

    if (Array.isArray(questions) && questions.length > 0) {
      return questions.slice(0, count).map(q => ({
        text: q.text || 'Tell me about a relevant experience from your background.',
        type: q.type || category,
        suggested_duration: q.suggested_duration || 120,
        tips: Array.isArray(q.tips) ? q.tips : ['Use the STAR method', 'Be specific', 'Quantify results'],
      }))
    } else {
      console.error('[Question Generation Validation Error]: Invalid questions array')
      return generateFallbackQuestions(category, count, extractedResume, extractedJob)
    }
  } catch (error) {
    console.error('[Question Generation Error]:', error)
    return generateFallbackQuestions(category, count, extractedResume, extractedJob)
  }
}

// Fallback questions if AI generation fails - now with more variety and context-awareness
function generateFallbackQuestions(
  category: string,
  count: number,
  resumeData?: { skills: string[]; experiences: { company: string; position: string }[] },
  jobData?: { title: string; company: string }
): Array<{ text: string; type: string; suggested_duration: number; tips: string[] }> {

  // Large pool of fallback questions per category - randomly selected
  const fallbackPools: Record<string, string[]> = {
    behavioral: [
      "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
      "Describe a situation where you had to work with a difficult team member.",
      "Give me an example of a time when you showed leadership without having a formal leadership role.",
      "Tell me about a project that didn't go as planned. What did you learn?",
      "Describe a time when you had to adapt quickly to a major change.",
      "Give me an example of when you exceeded expectations on a project.",
      "Tell me about a time when you had to persuade someone to see things your way.",
      "Describe a situation where you had to make a decision with incomplete information.",
      "Tell me about a time when you received critical feedback. How did you respond?",
      "Give me an example of when you took initiative to solve a problem nobody asked you to solve.",
      "Describe a time when you had to balance multiple competing priorities.",
      "Tell me about a situation where you had to build a relationship with someone difficult.",
      "Give me an example of a time when you failed. What happened and what did you learn?",
      "Describe a time when you went above and beyond for a customer or stakeholder.",
      "Tell me about a situation where you had to work under a tight deadline.",
    ],
    leadership: [
      "Describe a time when you had to lead a team through a major change or initiative.",
      "Tell me about a strategic decision you made and how you implemented it.",
      "Give me an example of how you've mentored or developed someone on your team.",
      "Tell me about a time when you had to make an unpopular decision as a leader.",
      "Describe a situation where you had to manage a team through a crisis.",
      "Give me an example of how you built and motivated a high-performing team.",
      "Tell me about a time when you had to deal with an underperforming team member.",
      "Describe how you've influenced organizational strategy or direction.",
      "Tell me about a time when you had to delegate something important. How did you ensure success?",
      "Give me an example of how you've driven innovation within your team or organization.",
      "Describe a time when you had to align multiple stakeholders with different priorities.",
      "Tell me about a situation where you had to manage up effectively.",
    ],
    technical: [
      "Tell me about a complex technical problem you solved. Walk me through your approach.",
      "Describe a time when you had to make a significant architectural decision. What were the trade-offs?",
      "Give me an example of how you've improved system performance or scalability.",
      "Tell me about a time when you had to debug a particularly challenging issue.",
      "Describe a situation where you had to balance technical debt with feature development.",
      "Give me an example of a technical decision you made that you later had to revisit.",
      "Tell me about a time when you had to learn a new technology quickly to deliver a project.",
      "Describe how you've mentored other engineers on technical best practices.",
      "Tell me about a system you designed from scratch. What were your key considerations?",
      "Give me an example of how you've improved code quality or development processes.",
    ],
    conflict: [
      "Tell me about a time when you had to resolve a conflict between team members.",
      "Describe a situation where you disagreed with a colleague. How did you handle it?",
      "Give me an example of dealing with a difficult stakeholder or client.",
      "Tell me about a time when you disagreed with your manager's decision.",
      "Describe a situation where you had to deliver difficult news to someone.",
      "Give me an example of how you've navigated office politics professionally.",
      "Tell me about a time when you had to say no to a request from someone important.",
      "Describe a situation where you mediated a dispute between others.",
      "Tell me about a time when your work was criticized unfairly. How did you respond?",
      "Give me an example of turning a difficult relationship into a productive one.",
    ],
  }

  const pool = fallbackPools[category] || fallbackPools.behavioral

  // Shuffle and select questions
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  let selectedQuestions = shuffled.slice(0, count)

  // Try to personalize with available context
  if (resumeData?.experiences?.length || jobData?.title) {
    selectedQuestions = selectedQuestions.map((q, i) => {
      // Add context to some questions
      if (i === 0 && resumeData?.experiences?.[0]) {
        const exp = resumeData.experiences[0]
        return q.replace('at work', `during your time at ${exp.company}`)
      }
      if (i === 1 && jobData?.title) {
        return q + ` How would this experience help you in the ${jobData.title} role?`
      }
      return q
    })
  }

  return selectedQuestions.map(text => ({
    text,
    type: category,
    suggested_duration: 120,
    tips: ['Use the STAR method: Situation, Task, Action, Result', 'Be specific with examples and metrics', 'Keep your answer focused and under 2 minutes'],
  }))
}
