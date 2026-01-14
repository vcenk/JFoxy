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
}: {
  category: string
  difficulty: string
  count: number
  resumeContext?: string
  resumeContent?: any
  jobContext?: string
  jobTitle?: string
  jobCompany?: string
}): Promise<Array<{ text: string; type: string; suggested_duration?: number; tips?: string[] }>> {

  // Build context for the LLM
  let contextInfo = ''

  if (resumeContext || resumeContent) {
    contextInfo += '\n\n=== CANDIDATE RESUME ===\n'
    if (resumeContent?.basics) {
      contextInfo += `Name: ${resumeContent.basics.name || 'N/A'}\n`
      contextInfo += `Headline: ${resumeContent.basics.headline || 'N/A'}\n`
    }
    if (resumeContent?.experience && Array.isArray(resumeContent.experience)) {
      contextInfo += '\nEXPERIENCE:\n'
      resumeContent.experience.slice(0, 3).forEach((exp: any) => {
        contextInfo += `- ${exp.position || 'Position'} at ${exp.company || 'Company'}\n`
        if (exp.highlights && Array.isArray(exp.highlights)) {
          exp.highlights.slice(0, 2).forEach((h: string) => {
            contextInfo += `  • ${h}\n`
          })
        }
      })
    }
    if (resumeContext && resumeContext.length > 0) {
      contextInfo += '\n' + resumeContext.substring(0, 2000)
    }
  }

  if (jobContext && jobTitle) {
    contextInfo += '\n\n=== TARGET JOB ===\n'
    contextInfo += `Position: ${jobTitle}\n`
    if (jobCompany) {
      contextInfo += `Company: ${jobCompany}\n`
    }
    contextInfo += `\nJob Description:\n${jobContext.substring(0, 2000)}\n`
  }

  // Category-specific instructions
  const categoryInstructions: Record<string, string> = {
    behavioral: `Generate ${count} BEHAVIORAL interview questions using the STAR method (Situation, Task, Action, Result).
Questions should ask about past experiences and should be relevant to the candidate's background and target role.
Format: "Tell me about a time when..." or "Describe a situation where..." or "Give me an example of..."`,

    leadership: `Generate ${count} LEADERSHIP and STRATEGY interview questions focused on:
- Team leadership and management
- Strategic thinking and planning
- Driving initiatives and change
- Mentoring and coaching others
Questions should be challenging and relevant to senior-level responsibilities.`,

    conflict: `Generate ${count} CONFLICT RESOLUTION interview questions about:
- Handling disagreements with team members
- Managing difficult conversations
- Resolving workplace conflicts
- Dealing with challenging stakeholders
Questions should focus on interpersonal skills and professionalism.`,

    'system-design': `Generate ${count} SYSTEM DESIGN and TECHNICAL ARCHITECTURE questions about:
- Designing scalable systems
- Technical trade-offs and decisions
- Architecture patterns and best practices
- Performance and reliability considerations
Questions should be technical and suitable for senior engineering roles.`
  }

  const instructions = categoryInstructions[category] || categoryInstructions['behavioral']

  // Build the system prompt
  const systemPrompt = `
You are an expert interview coach specializing in ${category} interviews.

Your task is to generate personalized interview questions for a practice session.

${instructions}

**IMPORTANT REQUIREMENTS:**
1. Questions MUST be highly personalized based on the candidate's resume and target job
2. Questions should reference specific experiences, skills, or requirements from the provided context
3. All questions should be realistic and commonly asked in real interviews
4. Questions should match the difficulty level: ${difficulty}
5. Return EXACTLY ${count} questions
6. Each question should be clear, specific, and answerable using the STAR method

**DIFFICULTY LEVELS:**
- Easy: Basic questions about straightforward experiences
- Medium: Questions requiring detailed examples and problem-solving
- Hard: Complex scenarios requiring strategic thinking and leadership

**OUTPUT FORMAT:**
Return a JSON array with EXACTLY ${count} objects, each containing:
{
  "text": "The interview question",
  "type": "${category}",
  "suggested_duration": 180,
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Return ONLY the JSON array, no additional text.
`.trim()

  const userPrompt = contextInfo.length > 0
    ? `Generate ${count} personalized ${category} interview questions based on this context:\n${contextInfo}`
    : `Generate ${count} general ${category} interview questions for a ${difficulty} difficulty practice session.`

  try {
    const response = await callLLM({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      maxTokens: 1500,
    })

    // Parse the JSON response
    let questions: any[]
    try {
      // Remove markdown code blocks if present
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
      // Fallback to generic questions if parsing fails
      return generateFallbackQuestions(category, count)
    }

    // Validate and return questions
    if (Array.isArray(questions) && questions.length > 0) {
      return questions.slice(0, count).map(q => ({
        text: q.text || 'Tell me about a relevant experience.',
        type: q.type || category,
        suggested_duration: q.suggested_duration || 180,
        tips: Array.isArray(q.tips) ? q.tips : ['Use the STAR method', 'Be specific', 'Quantify results'],
      }))
    } else {
      console.error('[Question Generation Validation Error]: Invalid questions array')
      return generateFallbackQuestions(category, count)
    }
  } catch (error) {
    console.error('[Question Generation Error]:', error)
    return generateFallbackQuestions(category, count)
  }
}

// Fallback questions if AI generation fails
function generateFallbackQuestions(category: string, count: number): Array<{ text: string; type: string; suggested_duration: number; tips: string[] }> {
  const fallbackQuestions: Record<string, string[]> = {
    behavioral: [
      "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
      "Describe a situation where you had to work with a difficult team member.",
      "Give me an example of a time when you showed leadership.",
    ],
    leadership: [
      "Describe a time when you had to lead a team through a major change or initiative.",
      "Tell me about a strategic decision you made and how you implemented it.",
      "Give me an example of how you've mentored or developed someone on your team.",
    ],
    conflict: [
      "Tell me about a time when you had to resolve a conflict between team members.",
      "Describe a situation where you disagreed with a colleague. How did you handle it?",
      "Give me an example of dealing with a difficult stakeholder or client.",
    ],
    'system-design': [
      "How would you design a scalable URL shortening service like bit.ly?",
      "Describe how you would architect a real-time messaging system.",
      "Explain the trade-offs between SQL and NoSQL databases for a social media platform.",
    ],
  }

  const questions = fallbackQuestions[category] || fallbackQuestions.behavioral

  return questions.slice(0, count).map(text => ({
    text,
    type: category,
    suggested_duration: 180,
    tips: ['Use the STAR method', 'Be specific with examples', 'Quantify your results'],
  }))
}
