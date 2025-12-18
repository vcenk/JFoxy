'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { JSONContent } from '@tiptap/core'
import { useEffect, useState } from 'react'

interface RichTextDisplayProps {
  content: JSONContent | undefined | null
  className?: string
  inline?: boolean  // For rendering inside list items
}

export const RichTextDisplay = ({ content, className = '', inline = false }: RichTextDisplayProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: true,
        orderedList: true,
        listItem: true,
        code: false,
        strike: false,
      }),
      Underline,
    ],
    content: content || { type: 'doc', content: [] },
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `rich-text-display ${inline ? 'inline-mode' : ''} focus:outline-none`,
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (!editor || !content) return

    const currentContent = editor.getJSON()
    if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!mounted || !editor) {
    return <div className={className} />
  }

  return (
    <div className={`${className} ${inline ? 'inline-rich-text' : ''}`}>
      <EditorContent editor={editor} />
      <style>{`
        /* Base Styles */
        .rich-text-display p {
          margin: 0;
          min-height: 1.2em;
          white-space: pre-wrap;
          line-height: inherit; /* Reverted to inherit to respect Designer settings */
          color: #374151; /* Default to text-gray-700 on white background */
        }
        
        .rich-text-display ul, 
        .rich-text-display ol {
          padding-left: 1.25rem;
          margin: 0.25rem 0;
        }

        .rich-text-display li {
          margin-bottom: 0.125rem;
          display: list-item;
          color: #374151; /* Default to text-gray-700 on white background */
        }

        /* Ensure Tiptap's root element also uses correct color */
        .rich-text-display.ProseMirror {
          color: #374151; /* Force color for ProseMirror root */
        }

        /* Inline Mode Styles */
        .inline-rich-text {
          display: inline-block; /* Changed from inline to inline-block for better safety */
        }

        .inline-rich-text .ProseMirror,
        .inline-rich-text .rich-text-display,
        .rich-text-display.inline-mode {
          display: inline !important;
        }

        .inline-rich-text .rich-text-display p,
        .rich-text-display.inline-mode p {
          display: inline !important;
          margin: 0 !important;
          color: #374151 !important; /* Force color for inline mode paragraphs */
        }

        /* Formatting */
        .rich-text-display strong { font-weight: 600; }
        .rich-text-display em { font-style: italic; }
        .rich-text-display u { text-decoration: underline; }
      `}</style>
    </div>
  )
}