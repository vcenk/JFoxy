// lib/engines/gapDefenseEngine.ts
// Generate defense scripts for resume gaps and weaknesses

import { callLLMJSON } from '../clients/openaiClient'  // lib/clients/openaiClient.ts

export interface GapDefense {
  pivot: string // The Reframe
  proof: string // The Parallel Evidence
  promise: string // The Roadmap/Growth
}

/**
 * Generate a gap defense script using 3-part framework
 */
export async function generateGapDefense({
  gapType,
  gapDescription,
  resumeContext,
  jobContext,
}: {
  gapType: 'missing_skill' | 'short_tenure' | 'industry_switch' | 'employment_gap' | 'other'
  gapDescription: string
  resumeContext: string
  jobContext?: string
}): Promise<GapDefense | null> {
  const system = `
You are a career coach helping candidates defend resume gaps and weaknesses.
Use the 3-part framework: PIVOT (reframe), PROOF (evidence), PROMISE (growth).
Create compelling, honest defenses that turn weaknesses into strengths.
Return strict JSON only.
`.trim()

  const user = `
Create a defense script for this gap/weakness.

GAP TYPE: ${gapType}
GAP DESCRIPTION: ${gapDescription}

RESUME CONTEXT:
"""
${resumeContext}
"""

${jobContext ? `JOB CONTEXT:\n"""\n${jobContext}\n"""` : ''}

Use the 3-part defense framework:

1. PIVOT (The Reframe):
   - Acknowledge the gap honestly
   - Reframe it as a positive or learning experience
   - 2-3 sentences

2. PROOF (The Parallel Evidence):
   - Show related experience or transferable skills
   - Provide concrete examples from resume
   - 2-3 sentences

3. PROMISE (The Roadmap/Growth):
   - Demonstrate commitment to bridge the gap
   - Show specific actions taken or planned
   - Express enthusiasm
   - 2-3 sentences

Return JSON:
{
  "pivot": "The reframe explanation...",
  "proof": "The parallel evidence...",
  "promise": "The growth roadmap..."
}
`.trim()

  try {
    const result = await callLLMJSON<GapDefense>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 600,
    })

    return result
  } catch (error) {
    console.error('[Gap Defense Generation Error]:', error)
    return null
  }
}

/**
 * Refine an existing gap defense script
 */
export async function refineGapDefense({
  defense,
  focusPart,
}: {
  defense: GapDefense
  focusPart?: 'pivot' | 'proof' | 'promise'
}): Promise<GapDefense | null> {
  const system = `
You are an interview coach refining gap defense scripts.
Make them more compelling, specific, and interview-ready.
Return strict JSON only.
`.trim()

  const user = `
Refine this gap defense script.
${focusPart ? `Focus especially on improving the ${focusPart.toUpperCase()} section.` : ''}

CURRENT DEFENSE:
Pivot: ${defense.pivot}
Proof: ${defense.proof}
Promise: ${defense.promise}

Make it:
- More specific with concrete examples
- More confident and positive
- More concise (2-3 sentences each)

Return the improved defense in the same JSON format.
`.trim()

  try {
    const result = await callLLMJSON<GapDefense>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      maxTokens: 600,
    })

    return result
  } catch (error) {
    console.error('[Gap Defense Refinement Error]:', error)
    return null
  }
}
