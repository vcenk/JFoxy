// lib/engines/introPitchEngine.ts
// Generate compelling intro pitches ("Tell me about yourself")

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface IntroPitch {
  full_pitch: string
  hook: string
  core_message: string
  call_to_action: string
  estimated_duration_seconds: number
}

/**
 * Generate an intro pitch for "Tell me about yourself"
 */
export async function generateIntroPitch({
  resumeSummary,
  jobDescription,
  targetDuration = 90, // seconds
  style = 'professional',
}: {
  resumeSummary: string
  jobDescription?: string
  targetDuration?: number // 60, 90, or 120 seconds
  style?: 'professional' | 'conversational' | 'enthusiastic'
}): Promise<IntroPitch | null> {
  const system = `
You are an interview coach crafting intro pitches for "Tell me about yourself."
Create compelling, concise pitches that hook the interviewer and highlight value.
Follow the structure: HOOK → CORE MESSAGE → CALL TO ACTION.
Return strict JSON only.
`.trim()

  const user = `
Create an intro pitch for this candidate.

TARGET DURATION: ${targetDuration} seconds
STYLE: ${style}

RESUME:
"""
${resumeSummary}
"""

${jobDescription ? `JOB DESCRIPTION:\n"""\n${jobDescription}\n"""` : ''}

Structure the pitch as:

1. HOOK (10-15 seconds):
   - Grab attention immediately
   - State current role or key achievement
   - Example: "I'm a product manager who's scaled 3 SaaS products to $10M ARR"

2. CORE MESSAGE (50-70 seconds):
   - Highlight 2-3 key achievements
   - Connect to job requirements
   - Show progression and impact
   - Use specific metrics

3. CALL TO ACTION (10-15 seconds):
   - Express enthusiasm for THIS role
   - Tie back to company mission
   - End on a forward-looking note

Return JSON:
{
  "full_pitch": "Complete pitch text (conversational, first-person)...",
  "hook": "Opening hook sentence...",
  "core_message": "Main achievements paragraph...",
  "call_to_action": "Closing statement...",
  "estimated_duration_seconds": 90
}

Keep it conversational, confident, and within ${targetDuration} seconds when spoken.
`.trim()

  try {
    const result = await callLLMJSON<IntroPitch>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.5,
      maxTokens: 800,
    })

    return result
  } catch (error) {
    console.error('[Intro Pitch Generation Error]:', error)
    return null
  }
}

/**
 * Refine an existing intro pitch
 */
export async function refineIntroPitch({
  pitch,
  feedback,
  targetDuration,
}: {
  pitch: IntroPitch
  feedback?: string
  targetDuration?: number
}): Promise<IntroPitch | null> {
  const system = `
You are an interview coach refining intro pitches.
Make them more compelling, concise, and impactful.
Return strict JSON only.
`.trim()

  const user = `
Refine this intro pitch.

CURRENT PITCH:
${pitch.full_pitch}

${feedback ? `FEEDBACK:\n${feedback}` : ''}
${targetDuration ? `TARGET DURATION: ${targetDuration} seconds` : ''}

Improvements:
- Stronger opening hook
- More specific metrics
- Better flow and pacing
- More confident tone

Return the improved pitch in the same JSON format.
`.trim()

  try {
    const result = await callLLMJSON<IntroPitch>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.5,
      maxTokens: 800,
    })

    return result
  } catch (error) {
    console.error('[Intro Pitch Refinement Error]:', error)
    return null
  }
}
