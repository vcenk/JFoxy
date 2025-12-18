// app/api/audio/tts/route.ts
// Convert text to speech using Deepgram

import { NextRequest } from 'next/server'
import { createClient } from '@deepgram/sdk'  // @deepgram/sdk
import { env } from '@/lib/config/env'  // lib/config/env.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  validateRequiredFields,
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
    const validation = validateRequiredFields(body, ['text'])
    if (!validation.valid) {
      return badRequestResponse(`Missing fields: ${validation.missing?.join(', ')}`)
    }

    const { text, voice } = body

    // Validate text length (max 2000 characters for TTS)
    if (text.length > 2000) {
      return badRequestResponse('Text exceeds maximum length of 2000 characters')
    }

    // Initialize Deepgram client
    const deepgram = createClient(env.deepgram.apiKey)

    // Generate speech
    const response = await deepgram.speak.request(
      { text },
      {
        model: voice || env.deepgram.ttsModel,
        encoding: 'mp3',
        container: 'mp3',
      }
    )

    // Get audio stream
    const stream = await response.getStream()
    if (!stream) {
      return serverErrorResponse('Failed to get audio stream')
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    const reader = stream.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    // Combine chunks into single buffer
    const audioBuffer = Buffer.concat(chunks)

    // Return audio as MP3
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error('[TTS API Error]:', error)
    return serverErrorResponse('Failed to generate speech')
  }
}
