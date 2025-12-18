// lib/clients/openaiClient.ts - OpenAI client wrapper
import OpenAI from 'openai'
import { env } from '../config/env'

const client = new OpenAI({
  apiKey: env.openai.apiKey,
})

type Role = 'system' | 'user' | 'assistant'

interface CallLLMOptions {
  model?: string
  messages: { role: Role; content: string }[]
  temperature?: number
  maxTokens?: number
}

/**
 * Call OpenAI LLM with standardized error handling
 */
export async function callLLM({
  model,
  messages,
  temperature = 0.3,
  maxTokens = 1500,
}: CallLLMOptions): Promise<string> {
  const usedModel = model ?? env.openai.modelMain

  // Validate API key
  if (!env.openai.apiKey) {
    console.error('[OpenAI Error]: API key is missing')
    throw new Error('OpenAI API key is not configured. Please check your environment variables.')
  }

  try {
    const response = await client.chat.completions.create({
      model: usedModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      console.error('[OpenAI Error]: Empty response from API')
      throw new Error('OpenAI returned an empty response')
    }

    return content
  } catch (error: any) {
    console.error('[OpenAI Error Details]:', {
      message: error.message,
      type: error.type,
      code: error.code,
      status: error.status,
      model: usedModel,
    })

    // Provide more specific error messages
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing.')
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.')
    } else if (error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again in a moment.')
    } else if (error.status >= 500) {
      throw new Error('OpenAI service is temporarily unavailable. Please try again later.')
    }

    throw new Error(`OpenAI API error: ${error.message}`)
  }
}

/**
 * Strip markdown code blocks from text
 */
function stripMarkdownCodeBlocks(text: string): string {
  // Remove ```json and ``` markers
  let cleaned = text.trim()

  // Remove opening ```json or ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7) // Remove ```json
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3) // Remove ```
  }

  // Remove closing ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3)
  }

  return cleaned.trim()
}

/**
 * Call OpenAI with JSON response mode
 */
export async function callLLMJSON<T = any>({
  model,
  messages,
  temperature = 0.3,
  maxTokens = 1500,
}: CallLLMOptions): Promise<T | null> {
  try {
    const content = await callLLM({ model, messages, temperature, maxTokens })

    if (!content || content.trim().length === 0) {
      console.error('[JSON Parse Error]: Received empty content from LLM')
      return null
    }

    // Strip markdown code blocks before parsing
    const cleanedContent = stripMarkdownCodeBlocks(content)

    if (!cleanedContent || cleanedContent.trim().length === 0) {
      console.error('[JSON Parse Error]: Content became empty after cleaning markdown')
      console.error('[Original content]:', content)
      return null
    }

    try {
      return JSON.parse(cleanedContent) as T
    } catch (parseError) {
      console.error('[JSON Parse Error]: Failed to parse JSON')
      console.error('[Parse error details]:', parseError)
      console.error('[Cleaned content]:', cleanedContent.substring(0, 500))
      console.error('[Raw content]:', content.substring(0, 500))
      return null
    }
  } catch (error: any) {
    console.error('[callLLMJSON Error]:', error.message)
    throw error // Re-throw to let caller handle it
  }
}

export { client as openaiClient }
