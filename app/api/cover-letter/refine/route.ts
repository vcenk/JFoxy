// app/api/cover-letter/refine/route.ts
// Refine an existing cover letter based on user prompt

import { NextRequest } from 'next/server'
import { callLLM } from '@/lib/clients/openaiClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  validateRequiredFields,
} from '@/lib/utils/apiHelpers'

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequiredFields(body, ['currentCoverLetter', 'refinePrompt'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { currentCoverLetter, refinePrompt } = body

    // Refine the cover letter using AI
    const system = `
You are an expert cover letter editor.

Your task is to refine an existing cover letter based on the user's specific instructions.

Guidelines:
- Make only the changes requested by the user
- Maintain the original structure and tone unless asked to change it
- Keep the cover letter professional and concise
- Preserve all factual information unless specifically asked to modify it
- Return ONLY the refined cover letter text, no explanations or meta-commentary
`.trim()

    const userPrompt = `
Please refine this cover letter according to the following instruction:

INSTRUCTION: ${refinePrompt}

CURRENT COVER LETTER:
"""
${currentCoverLetter}
"""

Return the refined version of the cover letter.
`.trim()

    const refinedCoverLetter = await callLLM({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 800,
    })

    if (!refinedCoverLetter || refinedCoverLetter.trim().length === 0) {
      return serverErrorResponse('Refinement returned empty results')
    }

    return successResponse({
      refinedCoverLetter: refinedCoverLetter.trim(),
    })
  } catch (error) {
    console.error('[Cover Letter Refine API Error]:', error)
    return serverErrorResponse()
  }
}
