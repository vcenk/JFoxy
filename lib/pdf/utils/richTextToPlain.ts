// lib/pdf/utils/richTextToPlain.ts
// Convert TipTap rich text to plain text for PDF rendering

import { JSONContent } from '@tiptap/core'
import { RichText } from '@/lib/types/resume'

/**
 * Extract plain text from TipTap JSONContent
 * Handles nested structures and inline formatting
 */
export function extractPlainText(content: RichText | string | undefined | null): string {
  if (!content) return ''

  // Already a string
  if (typeof content === 'string') return content

  // Handle JSONContent
  return extractFromNode(content)
}

function extractFromNode(node: JSONContent): string {
  // Direct text node
  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text
  }

  // Container node with content array
  if (node.content && Array.isArray(node.content)) {
    const texts = node.content.map(extractFromNode)

    // Add appropriate spacing based on node type
    switch (node.type) {
      case 'paragraph':
        return texts.join('') + '\n'
      case 'bulletList':
      case 'orderedList':
        return texts.join('\n')
      case 'listItem':
        return texts.join('')
      default:
        return texts.join('')
    }
  }

  return ''
}

/**
 * Extract plain text as a single line (no newlines)
 */
export function extractSingleLine(content: RichText | string | undefined | null): string {
  return extractPlainText(content).replace(/\n+/g, ' ').trim()
}

/**
 * Extract text with inline formatting markers preserved
 * Returns array of text segments with formatting info
 */
export interface TextSegment {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

export function extractFormattedText(content: RichText | string | undefined | null): TextSegment[] {
  if (!content) return []

  if (typeof content === 'string') {
    return [{ text: content }]
  }

  return extractSegmentsFromNode(content)
}

function extractSegmentsFromNode(node: JSONContent): TextSegment[] {
  const segments: TextSegment[] = []

  if (node.type === 'text' && typeof node.text === 'string') {
    const marks = node.marks || []
    const segment: TextSegment = { text: node.text }

    for (const mark of marks) {
      if (mark.type === 'bold') segment.bold = true
      if (mark.type === 'italic') segment.italic = true
      if (mark.type === 'underline') segment.underline = true
    }

    segments.push(segment)
  }

  if (node.content && Array.isArray(node.content)) {
    for (const child of node.content) {
      segments.push(...extractSegmentsFromNode(child))
    }
  }

  return segments
}

/**
 * Check if content is empty or contains only whitespace
 */
export function isEmptyContent(content: RichText | string | undefined | null): boolean {
  return extractPlainText(content).trim().length === 0
}
