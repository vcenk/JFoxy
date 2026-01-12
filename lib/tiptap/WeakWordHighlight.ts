// lib/tiptap/WeakWordHighlight.ts
// TipTap extension to highlight weak words in real-time

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { WEAK_WORDS, getPowerWordAlternatives } from '@/lib/data/powerWords'

export interface WeakWordHighlightOptions {
  enabled: boolean
  className: string
  weakWords: string[]
}

export const WeakWordHighlightPluginKey = new PluginKey('weakWordHighlight')

/**
 * Find all weak words in the document and return decorations
 */
function findWeakWords(
  doc: any,
  weakWords: string[],
  className: string
): DecorationSet {
  const decorations: Decoration[] = []

  doc.descendants((node: any, pos: number) => {
    if (!node.isText) return

    const text = node.text || ''
    const lowerText = text.toLowerCase()

    weakWords.forEach(weakWord => {
      const lowerWeakWord = weakWord.toLowerCase()
      let index = 0

      while ((index = lowerText.indexOf(lowerWeakWord, index)) !== -1) {
        // Check word boundaries to avoid partial matches
        const before = index === 0 ? ' ' : lowerText[index - 1]
        const after = index + lowerWeakWord.length >= lowerText.length
          ? ' '
          : lowerText[index + lowerWeakWord.length]

        const isWordBoundaryBefore = /[\s,.\-:;!?'"()]/.test(before) || index === 0
        const isWordBoundaryAfter = /[\s,.\-:;!?'"()]/.test(after) || index + lowerWeakWord.length === lowerText.length

        if (isWordBoundaryBefore && isWordBoundaryAfter) {
          const from = pos + index
          const to = pos + index + weakWord.length

          // Get alternatives for tooltip
          const baseWord = weakWord.replace(/\s+(for|with|on|to|included)$/i, '').trim()
          const alternatives = getPowerWordAlternatives(baseWord)
          const tooltip = alternatives.length > 0
            ? `Weak phrase. Try: ${alternatives.slice(0, 3).join(', ')}`
            : 'Consider using a stronger action verb'

          decorations.push(
            Decoration.inline(from, to, {
              class: className,
              'data-weak-word': weakWord,
              'data-alternatives': alternatives.join(','),
              title: tooltip,
            })
          )
        }

        index += 1
      }
    })
  })

  return DecorationSet.create(doc, decorations)
}

/**
 * TipTap extension for highlighting weak words
 */
export const WeakWordHighlight = Extension.create<WeakWordHighlightOptions>({
  name: 'weakWordHighlight',

  addOptions() {
    return {
      enabled: true,
      className: 'weak-word-highlight',
      weakWords: WEAK_WORDS,
    }
  },

  addProseMirrorPlugins() {
    const { enabled, className, weakWords } = this.options

    if (!enabled) return []

    return [
      new Plugin({
        key: WeakWordHighlightPluginKey,
        state: {
          init(_, { doc }) {
            return findWeakWords(doc, weakWords, className)
          },
          apply(tr, oldState) {
            if (tr.docChanged) {
              return findWeakWords(tr.doc, weakWords, className)
            }
            return oldState
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
})

/**
 * CSS styles for weak word highlighting
 * Add this to your global CSS or component styles
 */
export const weakWordHighlightStyles = `
  .weak-word-highlight {
    background-color: rgba(251, 191, 36, 0.3);
    border-bottom: 2px wavy #f59e0b;
    cursor: help;
    position: relative;
  }

  .weak-word-highlight:hover {
    background-color: rgba(251, 191, 36, 0.5);
  }

  /* Dark mode styles */
  .dark .weak-word-highlight {
    background-color: rgba(251, 191, 36, 0.2);
    border-bottom-color: #fbbf24;
  }

  .dark .weak-word-highlight:hover {
    background-color: rgba(251, 191, 36, 0.3);
  }
`

export default WeakWordHighlight
