// lib/utils/richTextHelpers.ts

import { JSONContent } from '@tiptap/core'

/**
 * Convert plain text to Tiptap JSON format
 */
export function plainTextToJSON(text: string | null | undefined): JSONContent {
  if (!text || text.trim() === '') {
    return {
      type: 'doc',
      content: [],
    }
  }

  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      },
    ],
  }
}

/**
 * Extract plain text from Tiptap JSON format
 */
export function jsonToPlainText(json: JSONContent | null | undefined): string {
  if (!json || !json.content) return ''

  const extractText = (node: any): string => {
    if (node.type === 'text') {
      return node.text || ''
    }

    if (node.content) {
      return node.content.map(extractText).join('')
    }

    return ''
  }

  return json.content.map(extractText).join('\n')
}

/**
 * Check if Tiptap JSON content is effectively empty
 */
export function isRichTextEmpty(json: JSONContent | null | undefined): boolean {
  if (!json || !json.content || json.content.length === 0) return true

  // Special case for Tiptap's default empty state
  if (
    json.content.length === 1 &&
    json.content[0].type === 'paragraph' &&
    (!json.content[0].content || json.content[0].content.length === 0)
  ) {
    return true
  }

  const text = jsonToPlainText(json)
  return text.trim() === ''
}

/**
 * Validate if a value is valid Tiptap JSON
 */
export function isValidTiptapJSON(value: any): value is JSONContent {
  if (typeof value !== 'object' || value === null) return false
  if (value.type !== 'doc') return false
  if (!Array.isArray(value.content)) return false
  return true
}

/**
 * Ensure value is valid JSONContent (convert if needed)
 */
export function ensureJSONContent(value: any): JSONContent {
  // Already valid JSON
  if (isValidTiptapJSON(value)) {
    return value
  }

  // Plain text string
  if (typeof value === 'string') {
    return plainTextToJSON(value)
  }

  // Invalid or null - return empty doc
  return plainTextToJSON('')
}