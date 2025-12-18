// components/ui/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { JSONContent } from '@tiptap/core'
import { Bold, Italic, UnderlineIcon } from 'lucide-react'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: JSONContent
  onChange: (json: JSONContent) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
}

export const RichTextEditor = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  minHeight = '80px'
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable features we don't need
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        code: false,
        strike: false,
      }),
      Underline,
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        'data-placeholder': placeholder,
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Update editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  if (!editor) return null

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 bg-white/5 border-b border-white/10 rounded-t-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
          className={`
            p-2 rounded-lg transition-all
            ${editor.isActive('bold')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/15'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
          className={`
            p-2 rounded-lg transition-all
            ${editor.isActive('italic')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/15'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run() || disabled}
          className={`
            p-2 rounded-lg transition-all
            ${editor.isActive('underline')
              ? 'bg-purple-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/15'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={`
          prose prose-invert max-w-none
          px-4 py-3 bg-white/10 border border-white/20 rounded-b-xl
          focus-within:ring-2 focus-within:ring-purple-500
          ${disabled ? 'opacity-50' : ''}
        `}
      />

      {/* Styling for editor content */}
      <style jsx global>{`
        .ProseMirror {
          min-height: ${minHeight};
          outline: none;
          color: white;
        }

        .ProseMirror p {
          margin: 0;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          height: 0;
        }

        .ProseMirror strong {
          font-weight: bold;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
