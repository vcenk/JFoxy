// lib/clients/deepgramClient.ts - Deepgram client wrapper
import { env } from '../config/env'

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1'

/**
 * Text-to-Speech using Deepgram
 */
export async function textToSpeech({
  text,
  voice = 'aura-asteria-en',
  model = env.deepgram.ttsModel,
}: {
  text: string
  voice?: string
  model?: string
}): Promise<ArrayBuffer> {
  const response = await fetch(`${DEEPGRAM_API_URL}/speak?model=${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${env.deepgram.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Deepgram TTS error: ${response.statusText}`)
  }

  return response.arrayBuffer()
}

/**
 * Speech-to-Text using Deepgram
 */
export async function speechToText({
  audioBuffer,
  model = env.deepgram.sttModel,
}: {
  audioBuffer: Buffer
  model?: string
}): Promise<{
  transcript: string
  confidence?: number
  words?: Array<{ word: string; start: number; end: number }>
}> {
  const response = await fetch(
    `${DEEPGRAM_API_URL}/listen?model=${model}&punctuate=true&smart_format=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${env.deepgram.apiKey}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBuffer,
    }
  )

  if (!response.ok) {
    throw new Error(`Deepgram STT error: ${response.statusText}`)
  }

  const data = await response.json()

  const transcript =
    data.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? ''
  const confidence =
    data.results?.channels?.[0]?.alternatives?.[0]?.confidence ?? 0
  const words = data.results?.channels?.[0]?.alternatives?.[0]?.words ?? []

  return {
    transcript,
    confidence,
    words,
  }
}
