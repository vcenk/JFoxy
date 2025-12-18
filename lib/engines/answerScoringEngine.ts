// lib/engines/answerScoringEngine.ts
// Score user answers for practice sessions

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface AnswerScore {
  overall_score: number // 0-100
  star: {
    has_situation: boolean
    has_task: boolean
    has_action: boolean
    has_result: boolean
    completeness_score: number // 0-100
  }
  clarity_score: number // 0-100
  relevance_score: number // 0-100
  impact_score: number // 0-100
  strengths: string[]
  areas_for_improvement: string[]
  one_sentence_summary: string
  detailed_feedback: string
  ideal_answer?: string
}

/**
 * Score a practice answer using STAR framework and job alignment
 */
export async function scoreAnswer({
  question,
  transcript,
  resumeSummary,
  jobSummary,
}: {
  question: string
  transcript: string
  resumeSummary?: string
  jobSummary?: string
}): Promise<AnswerScore | null> {
  const system = `
You are an interview answer scoring engine.
Evaluate behavioral answers using STAR framework and alignment with job description.
Be constructive but honest in your feedback.
Return strict JSON only.
`.trim()

  const user = `
Score this interview answer.

QUESTION:
"${question}"

ANSWER (TRANSCRIPT):
"""
${transcript}
"""

${resumeSummary ? `RESUME SUMMARY:\n"""\n${resumeSummary}\n"""` : ''}
${jobSummary ? `JOB SUMMARY:\n"""\n${jobSummary}\n"""` : ''}

Evaluate on:

1. STAR COMPLETENESS:
   - Situation: Did they set the context?
   - Task: Did they explain what needed to be done?
   - Action: Did they describe their specific actions (using "I", not "we")?
   - Result: Did they share quantifiable outcomes?

2. CLARITY (0-100):
   - Clear structure and flow
   - Easy to follow
   - Good pacing

3. RELEVANCE (0-100):
   - Directly answers the question
   - Aligns with job requirements
   - Appropriate example chosen

4. IMPACT (0-100):
   - Shows meaningful results
   - Demonstrates skills
   - Includes metrics

Return JSON:
{
  "overall_score": 0-100,
  "star": {
    "has_situation": true,
    "has_task": true,
    "has_action": true,
    "has_result": false,
    "completeness_score": 75
  },
  "clarity_score": 0-100,
  "relevance_score": 0-100,
  "impact_score": 0-100,
  "strengths": [
    "Clear situation setup",
    "Specific actions described"
  ],
  "areas_for_improvement": [
    "Missing quantifiable result",
    "Could use stronger action verbs"
  ],
  "one_sentence_summary": "Good structure but needs stronger results.",
  "detailed_feedback": "Your answer effectively sets up the situation and describes your actions, but it's missing the key 'Result' component. Try adding specific metrics like 'which resulted in a 30% reduction in customer complaints' to make the impact clear."
}
`.trim()

  try {
    const result = await callLLMJSON<AnswerScore>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      maxTokens: 1000,
    })

    return result
  } catch (error) {
    console.error('[Answer Scoring Error]:', error)
    return null
  }
}

/**
 * Generate improvement suggestions for a specific answer
 */
export async function generateAnswerImprovement({
  question,
  transcript,
  score,
}: {
  question: string
  transcript: string
  score: AnswerScore
}): Promise<{ improved_answer: string; changes_made: string[] } | null> {
  const system = `
You are an interview coach improving candidate answers.
Rewrite the answer to address the identified weaknesses while keeping the core story.
Return strict JSON only.
`.trim()

  const user = `
Improve this interview answer based on the feedback.

QUESTION:
"${question}"

ORIGINAL ANSWER:
"""
${transcript}
"""

FEEDBACK:
Overall Score: ${score.overall_score}/100
Missing: ${Object.entries(score.star).filter(([k, v]) => k.startsWith('has_') && !v).map(([k]) => k.replace('has_', '')).join(', ')}
Areas for improvement: ${score.areas_for_improvement.join(', ')}

Rewrite the answer to:
- Include all STAR components
- Add specific metrics where possible
- Use stronger action verbs
- Keep it concise (60-90 seconds spoken)

Return JSON:
{
  "improved_answer": "Full improved answer...",
  "changes_made": [
    "Added specific result metric: 25% increase",
    "Clarified task requirements",
    "Used stronger action verb: 'spearheaded' instead of 'helped'"
  ]
}
`.trim()

  try {
    const result = await callLLMJSON<{
      improved_answer: string
      changes_made: string[]
    }>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 1000,
    })

    return result
  } catch (error) {
    console.error('[Answer Improvement Error]:', error)
    return null
  }
}

/**
 * Generate an ideal answer example for a question
 */
export async function generateIdealAnswer({
  question,
  resumeSummary,
  jobSummary,
}: {
  question: string
  resumeSummary?: string
  jobSummary?: string
}): Promise<string | null> {
  const system = `
You are an expert interview coach generating example answers.
Create realistic, strong STAR-method answers that candidates can learn from.
The answer should be natural, conversational, and demonstrate best practices.
`.trim()

  const user = `
Generate an ideal example answer for this interview question.

QUESTION:
"${question}"

${resumeSummary ? `CANDIDATE'S BACKGROUND (use this for relevant examples):\n"""\n${resumeSummary.substring(0, 1000)}\n"""` : ''}
${jobSummary ? `TARGET JOB REQUIREMENTS:\n"""\n${jobSummary.substring(0, 1000)}\n"""` : ''}

Create an answer that:
1. Uses complete STAR structure (Situation, Task, Action, Result)
2. Takes 60-90 seconds to speak
3. Includes specific metrics and outcomes
4. Uses strong action verbs ("spearheaded", "implemented", "achieved")
5. Demonstrates relevant skills for the role
6. Sounds natural and conversational (not robotic)

${resumeSummary ? 'Base the example on plausible scenarios from the candidate\'s background where possible.' : 'Create a realistic professional scenario.'}

Return ONLY the example answer as plain text, no JSON, no explanations.
Start directly with the answer.
`.trim()

  try {
    const result = await callLLMJSON<{ ideal_answer: string }>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user + '\n\nReturn JSON: {"ideal_answer": "your answer here"}' },
      ],
      temperature: 0.7,
      maxTokens: 600,
    })

    return result.ideal_answer
  } catch (error) {
    console.error('[Ideal Answer Generation Error]:', error)
    return null
  }
}
