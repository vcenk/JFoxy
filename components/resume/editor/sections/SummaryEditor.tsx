// components/resume/editor/sections/SummaryEditor.tsx
// Professional summary editor with AI capabilities

'use client'

import React, { useState } from 'react'
import { FileText, Check, Sparkles, RefreshCw, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RichText } from '@/lib/types/resume'

interface SummaryEditorProps {
  summary: RichText | undefined
  onChange: (summary: RichText) => void
  targetTitle?: string
  enabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  onGenerate?: () => void
  onRewrite?: () => void
  onShorten?: () => void
}

// Helper to extract plain text from RichText
function getPlainText(content: RichText | undefined): string {
  if (!content || !content.content) return ''

  const extractText = (node: any): string => {
    if (node.type === 'text') return node.text || ''
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join('')
    }
    return ''
  }

  return content.content.map(extractText).join('\n')
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  summary,
  onChange,
  targetTitle,
  enabled = true,
  onEnabledChange,
  onGenerate,
  onRewrite,
  onShorten,
}) => {
  const [editValue, setEditValue] = useState(getPlainText(summary))

  const handleChange = (value: string) => {
    setEditValue(value)
    const newContent: RichText = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: value ? [{ type: 'text', text: value }] : [],
        },
      ],
    }
    onChange(newContent)
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onEnabledChange && (
            <button
              onClick={() => onEnabledChange(!enabled)}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                enabled
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-white/30 bg-white/5'
              )}
            >
              {enabled && <Check className="w-3 h-3 text-white" />}
            </button>
          )}
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Professional Summary</h3>
        </div>
      </div>

      {/* Target Title (if provided) */}
      {targetTitle && (
        <div className="text-sm text-white/60 mb-2">
          Targeting: <span className="text-purple-400">{targetTitle}</span>
        </div>
      )}

      {/* Summary Content */}
      <div className={cn('rounded-xl border border-white/10 bg-white/5 overflow-hidden', !enabled && 'opacity-50')}>
        <textarea
          value={editValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key qualifications and career goals..."
          rows={5}
          className="w-full bg-transparent p-4 text-sm text-white resize-none focus:outline-none"
        />

        {/* AI Actions */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-white/5">
          {onGenerate && (
            <button
              onClick={onGenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Generate with AI
            </button>
          )}
          {onRewrite && editValue && (
            <button
              onClick={onRewrite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Rewrite
            </button>
          )}
          {onShorten && editValue && (
            <button
              onClick={onShorten}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors"
            >
              <Scissors className="w-3 h-3" />
              Make Shorter
            </button>
          )}

          {/* Character count */}
          <div className="ml-auto text-xs text-white/40">
            {editValue.length} characters
          </div>
        </div>
      </div>
    </div>
  )
}
