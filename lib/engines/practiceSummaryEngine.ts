// lib/engines/practiceSummaryEngine.ts
// Generate summary reports for practice sessions

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface PracticeSummary {
  overall_performance: string // "Excellent", "Good", "Needs Improvement"
  average_score: number
  trend_analysis: string
  key_strengths: string[]
  key_weaknesses: string[]
  next_steps: string[]
  improvement_plan: {
    focus_area: string
    specific_actions: string[]
    practice_recommendations: string[]
  }
}

/**
 * Generate a summary for a practice session
 */
export async function generatePracticeSummary({
  scores,
  questionCategories,
  strengths,
  improvements,
}: {
  scores: number[] // Array of question scores
  questionCategories: string[] // Categories of questions answered
  strengths: string[][] // Strengths from each answer
  improvements: string[][] // Improvements from each answer
}): Promise<PracticeSummary | null> {
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

  const allStrengths = strengths.flat()
  const allImprovements = improvements.flat()

  const system = `
You are an interview coach providing session summaries.
Analyze performance across multiple questions and provide actionable feedback.
Be constructive, specific, and encouraging.
Return strict JSON only.
`.trim()

  const user = `
Generate a practice session summary.

SESSION DATA:
- Questions answered: ${scores.length}
- Categories: ${questionCategories.join(', ')}
- Average score: ${avgScore.toFixed(1)}/100
- Scores: ${scores.join(', ')}

COMMON STRENGTHS:
${allStrengths.join('\n')}

COMMON AREAS FOR IMPROVEMENT:
${allImprovements.join('\n')}

Provide:
1. Overall performance assessment
2. Trend analysis (improving, consistent, or declining)
3. Top 3 strengths
4. Top 3 weaknesses
5. Specific next steps
6. Focused improvement plan

Return JSON:
{
  "overall_performance": "Good",
  "average_score": ${avgScore},
  "trend_analysis": "Your scores improved throughout the session...",
  "key_strengths": [
    "Consistently strong STAR structure",
    "Good use of metrics",
    "Clear communication"
  ],
  "key_weaknesses": [
    "Results section often lacks specificity",
    "Could use stronger action verbs",
    "Sometimes too verbose"
  ],
  "next_steps": [
    "Practice adding specific metrics to results",
    "Record yourself and time your answers (aim for 60-90 sec)",
    "Review the STAR framework cheat sheet"
  ],
  "improvement_plan": {
    "focus_area": "Quantifiable Results",
    "specific_actions": [
      "Add at least 2 metrics to every result",
      "Practice the 'So what?' test on each answer"
    ],
    "practice_recommendations": [
      "Practice 5 more leadership questions",
      "Focus on achievement-oriented stories"
    ]
  }
}
`.trim()

  try {
    const result = await callLLMJSON<PracticeSummary>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 1200,
    })

    return result
  } catch (error) {
    console.error('[Practice Summary Generation Error]:', error)
    return null
  }
}
