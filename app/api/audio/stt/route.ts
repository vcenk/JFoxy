// app/api/audio/stt/route.ts
// Convert speech to text using Deepgram

import { NextRequest } from 'next/server'
import { createClient } from '@deepgram/sdk'  // @deepgram/sdk
import { env } from '@/lib/config/env'  // lib/config/env.ts
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'  // lib/utils/apiHelpers.ts

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    // Get audio file from form data
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return badRequestResponse('No audio file provided')
    }

    // Validate file type
    const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg']
    if (!validTypes.includes(audioFile.type)) {
      return badRequestResponse(`Invalid audio type. Supported: ${validTypes.join(', ')}`)
    }

    // Validate file size (max 25MB)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return badRequestResponse('Audio file exceeds maximum size of 25MB')
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBuffer = Buffer.from(arrayBuffer)

    // Initialize Deepgram client
    const deepgram = createClient(env.deepgram.apiKey)

    // Transcribe audio
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: env.deepgram.sttModel,
        smart_format: true,
        punctuate: true,
        paragraphs: true,
        utterances: true,
        diarize: false, // Single speaker
      }
    )

    if (error) {
      console.error('[Deepgram STT Error]:', error)
      return serverErrorResponse('Failed to transcribe audio')
    }

    // Extract transcript
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript

    if (!transcript) {
      return badRequestResponse('No speech detected in audio')
    }

    // Get confidence score
    const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0

    // Get word-level details if available
    const words = result?.results?.channels?.[0]?.alternatives?.[0]?.words || []

    // Calculate duration from audio metadata
    const duration = result?.metadata?.duration || 0

    return successResponse({
      transcript,
      confidence,
      duration,
      wordCount: words.length,
      words: words.map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
        confidence: w.confidence,
      })),
    })
  } catch (error) {
    console.error('[STT API Error]:', error)
    return serverErrorResponse('Failed to transcribe audio')
  }
}
