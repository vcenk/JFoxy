// lib/engines/mockInterviewEngine.ts
// Generate and manage mock interview flow with hybrid structure

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface InterviewQuestion {
  id: string
  type: 'intro' | 'behavioral' | 'technical' | 'closing'
  text: string
  target_competency?: string
  follow_up_allowed: boolean
}

export interface InterviewPlan {
  questions: InterviewQuestion[]
  estimated_duration_minutes: number
  focus_areas: string[]
}

/**
 * Generate a structured interview question plan
 */
export async function generateInterviewPlan({
  resumeSummary,
  jobSummary,
  personaId,
  durationMinutes,
  focus = 'mixed',
  difficulty = 'standard',
}: {
  resumeSummary: string
  jobSummary?: string
  personaId: 'emma-hr' | 'james-manager' | 'sato-tech'
  durationMinutes: number
  focus?: 'behavioral' | 'technical' | 'mixed'
  difficulty?: 'easy' | 'standard' | 'hard'
}): Promise<InterviewPlan | null> {
  const personaContext = {
    'emma-hr': 'HR Recruiter focused on culture fit, soft skills, and career motivations',
    'james-manager': 'Hiring Manager focused on leadership, results, and team dynamics',
    'sato-tech': 'Technical Lead focused on problem-solving, technical depth, and system design',
  }[personaId]

  const system = `
You are a professional interviewer creating a mock interview question plan.
Persona: ${personaContext}
Generate a structured set of questions appropriate for a ${durationMinutes}-minute interview.
Return strict JSON only.
`.trim()

  const user = `
Generate an interview question plan.

DURATION: ${durationMinutes} minutes
FOCUS: ${focus}
DIFFICULTY: ${difficulty}

RESUME:
"""
${resumeSummary}
"""

${jobSummary ? `JOB DESCRIPTION:\n"""\n${jobSummary}\n"""` : ''}

Create a structured interview with:
- 1 opening/intro question (warm-up)
- ${durationMinutes <= 15 ? '2-3' : durationMinutes <= 25 ? '3-4' : '4-5'} behavioral questions
- ${focus === 'technical' || focus === 'mixed' ? '1-2 technical questions' : '0 technical questions'}
- 1 closing question

Each question should:
- Be specific to the candidate's experience
- Test key competencies (leadership, conflict resolution, technical depth, etc.)
- Allow for follow-up probing

Return JSON:
{
  "questions": [
    {
      "id": "q1",
      "type": "intro",
      "text": "Tell me about yourself and why you're interested in this role.",
      "target_competency": "communication",
      "follow_up_allowed": false
    },
    {
      "id": "q2",
      "type": "behavioral",
      "text": "Tell me about a time you had to resolve a conflict within your team.",
      "target_competency": "conflict_resolution",
      "follow_up_allowed": true
    }
  ],
  "estimated_duration_minutes": ${durationMinutes},
  "focus_areas": ["leadership", "problem_solving", "technical_depth"]
}
`.trim()

  try {
    const result = await callLLMJSON<InterviewPlan>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 1500,
    })

    // Add IDs if not present
    if (result?.questions) {
      result.questions = result.questions.map((q, idx) => ({
        ...q,
        id: q.id || `q${idx + 1}`,
      }))
    }

    return result
  } catch (error) {
    console.error('[Interview Plan Generation Error]:', error)
    return null
  }
}

/**
 * Generate a follow-up question based on the answer
 */
export async function generateFollowUp({
  question,
  transcript,
  evaluation,
  maxFollowUps = 1,
  currentFollowUpCount = 0,
}: {
  question: string
  transcript: string
  evaluation: {
    star_completeness?: { has_result?: boolean; has_action?: boolean }
    clarity_score?: number
    relevance_score?: number
  }
  maxFollowUps?: number
  currentFollowUpCount?: number
}): Promise<string | null> {
  // Don't generate follow-up if we've reached the limit
  if (currentFollowUpCount >= maxFollowUps) {
    return null
  }

  // Don't follow up if answer is strong and complete
  const isComplete = evaluation.star_completeness?.has_result && evaluation.star_completeness?.has_action
  const isStrong = (evaluation.clarity_score || 0) >= 75 && (evaluation.relevance_score || 0) >= 75

  if (isComplete && isStrong) {
    return null
  }

  const system = `
You are an interviewer generating follow-up probing questions.
If the answer is strong and specific, return null (no follow-up needed).
Otherwise, ask ONE short follow-up question for clarification or depth.
Keep it conversational and specific to their answer.
`.trim()

  const user = `
Should you ask a follow-up question?

ORIGINAL QUESTION:
"${question}"

CANDIDATE'S ANSWER:
"""
${transcript}
"""

EVALUATION:
- Missing result: ${!evaluation.star_completeness?.has_result}
- Missing action details: ${!evaluation.star_completeness?.has_action}
- Clarity: ${evaluation.clarity_score || 0}/100
- Relevance: ${evaluation.relevance_score || 0}/100

If a follow-up is needed, ask ONE short question to:
- Get the specific result/outcome (if missing)
- Clarify vague actions
- Probe for metrics or specifics

Return ONLY the follow-up question text, or null if no follow-up needed.
Examples:
- "What was the specific outcome of that initiative?"
- "Can you give me a specific example of how you handled that?"
- "What metrics did you use to measure success?"

Keep it under 15 words, conversational tone.
`.trim()

  try {
    const response = await callLLMJSON<{ follow_up: string | null }>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 100,
    })

    return response?.follow_up || null
  } catch (error) {
    console.error('[Follow-up Generation Error]:', error)
    return null
  }
}
