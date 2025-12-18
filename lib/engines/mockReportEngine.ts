// lib/engines/mockReportEngine.ts
// Generate comprehensive reports for mock interviews

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface MockInterviewReport {
  verdict: 'strong_hire' | 'hire' | 'borderline' | 'not_ready'
  overall_score: number
  performance_breakdown: {
    communication: number
    structure: number // STAR usage
    role_fit: number
    technical_depth?: number
  }
  key_strengths: string[]
  key_gaps: string[]
  interview_highlights: string[]
  improvement_plan: {
    day_1: string[]
    day_3: string[]
    day_5: string[]
    day_7: string[]
  }
  summary: string
  next_mock_recommendations: {
    persona: string
    focus_areas: string[]
    difficulty: string
  }
}

/**
 * Generate a comprehensive mock interview report
 */
export async function generateMockReport({
  exchanges,
  resumeSummary,
  jobSummary,
  personaId,
  durationMinutes,
}: {
  exchanges: Array<{
    question: string
    answer: string
    score: number
    star_completeness?: any
  }>
  resumeSummary: string
  jobSummary?: string
  personaId: string
  durationMinutes: number
}): Promise<MockInterviewReport | null> {
  const avgScore = exchanges.reduce((sum, ex) => sum + ex.score, 0) / exchanges.length

  const system = `
You are a senior interview coach providing comprehensive mock interview feedback.
Analyze the full interview performance and provide actionable improvement plans.
Be honest but constructive. Focus on growth.
Return strict JSON only.
`.trim()

  const user = `
Generate a mock interview report.

INTERVIEW DETAILS:
- Persona: ${personaId}
- Duration: ${durationMinutes} minutes
- Questions: ${exchanges.length}
- Average score: ${avgScore.toFixed(1)}/100

RESUME:
"""
${resumeSummary}
"""

${jobSummary ? `JOB:\n"""\n${jobSummary}\n"""` : ''}

INTERVIEW EXCHANGES:
${exchanges.map((ex, i) => `
Q${i + 1}: ${ex.question}
A${i + 1}: ${ex.answer}
Score: ${ex.score}/100
`).join('\n')}

Provide:
1. VERDICT (strong_hire, hire, borderline, not_ready)
2. PERFORMANCE BREAKDOWN:
   - Communication (clarity, confidence)
   - Structure (STAR usage)
   - Role Fit (alignment with job)
   - Technical Depth (if applicable)
3. KEY STRENGTHS (top 3)
4. KEY GAPS (top 3)
5. INTERVIEW HIGHLIGHTS (memorable moments)
6. 7-DAY IMPROVEMENT PLAN
7. NEXT MOCK RECOMMENDATIONS

Return JSON:
{
  "verdict": "hire",
  "overall_score": ${avgScore},
  "performance_breakdown": {
    "communication": 75,
    "structure": 65,
    "role_fit": 80,
    "technical_depth": 70
  },
  "key_strengths": [
    "Strong technical knowledge demonstrated",
    "Good energy and enthusiasm",
    "Relevant experience highlighted"
  ],
  "key_gaps": [
    "STAR results often missing metrics",
    "Tendency to use 'we' instead of 'I'",
    "Could be more concise"
  ],
  "interview_highlights": [
    "Excellent answer on the migration project (Q3)",
    "Good recovery after stumbling on conflict question"
  ],
  "improvement_plan": {
    "day_1": [
      "Review all answers and add specific metrics to results",
      "Practice using 'I' statements"
    ],
    "day_3": [
      "Record 3 practice answers and review for conciseness",
      "Build 2 new STAR stories for leadership questions"
    ],
    "day_5": [
      "Do a mini mock with technical focus",
      "Practice 'Tell me about yourself' pitch"
    ],
    "day_7": [
      "Full mock interview with harder difficulty",
      "Review this report and track improvements"
    ]
  },
  "summary": "Overall solid performance with clear potential. Main focus should be on tightening up STAR structure and adding quantifiable results. Ready to interview with some refinement.",
  "next_mock_recommendations": {
    "persona": "sato-tech",
    "focus_areas": ["technical_depth", "system_design"],
    "difficulty": "standard"
  }
}
`.trim()

  try {
    const result = await callLLMJSON<MockInterviewReport>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 2000,
    })

    return result
  } catch (error) {
    console.error('[Mock Report Generation Error]:', error)
    return null
  }
}
