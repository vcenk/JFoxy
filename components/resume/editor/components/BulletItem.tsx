// components/resume/editor/components/BulletItem.tsx
// Bullet point with toggle, edit, and AI capabilities

'use client'

import React, { useState, useMemo } from 'react'
import { Check, MoreVertical, Sparkles, Hash, Scissors, Expand, Trash2, GripVertical, TrendingUp, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BulletItem as BulletItemType, RichText } from '@/lib/types/resume'
import { analyzeBullet, findWeakWordsWithPositions } from '@/lib/utils/bulletAnalyzer'

interface BulletItemProps {
  bullet: BulletItemType
  onToggle: (enabled: boolean) => void
  onEdit: (content: RichText) => void
  onDelete: () => void
  onOptimize?: () => void
  onQuantify?: () => void
  onShorten?: () => void
  onExpand?: () => void
  isDragging?: boolean
  dragHandleProps?: any
}

// Helper to extract plain text from RichText
function getPlainText(content: RichText): string {
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

// Component to render text with weak word highlighting
function HighlightedBulletText({ text }: { text: string }) {
  const weakWordsWithPositions = useMemo(() => findWeakWordsWithPositions(text), [text])

  if (weakWordsWithPositions.length === 0) {
    return <span>{text}</span>
  }

  // Build the highlighted text
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  weakWordsWithPositions.forEach((weakWord, i) => {
    // Add text before this weak word
    if (weakWord.start > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, weakWord.start)}</span>)
    }

    // Add the highlighted weak word with tooltip
    const alternatives = weakWord.alternatives.slice(0, 3).join(', ')
    parts.push(
      <span
        key={`weak-${i}`}
        className="weak-word-highlight"
        title={`Try: ${alternatives}`}
      >
        {text.slice(weakWord.start, weakWord.end)}
      </span>
    )

    lastIndex = weakWord.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

export const BulletItem: React.FC<BulletItemProps> = ({
  bullet,
  onToggle,
  onEdit,
  onDelete,
  onOptimize,
  onQuantify,
  onShorten,
  onExpand,
  isDragging = false,
  dragHandleProps,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(getPlainText(bullet.content))
  const [showMenu, setShowMenu] = useState(false)

  // Analyze the bullet for scoring
  const bulletText = getPlainText(bullet.content)
  const analysis = useMemo(() => analyzeBullet(bulletText), [bulletText])

  const handleSave = () => {
    const newContent: RichText = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: editValue ? [{ type: 'text', text: editValue }] : [],
        },
      ],
    }
    onEdit(newContent)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditValue(getPlainText(bullet.content))
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2 group py-1.5 px-2 rounded-lg transition-all',
        'hover:bg-white/5',
        isDragging && 'bg-purple-500/20 shadow-lg'
      )}
    >
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-white/40" />
      </div>

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(!bullet.enabled)}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5',
          bullet.enabled
            ? 'bg-purple-500 border-purple-500'
            : 'border-white/30 bg-white/5 hover:border-purple-400'
        )}
      >
        {bullet.enabled && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Content */}
      <div className={cn('flex-1 min-w-0', !bullet.enabled && 'opacity-50')}>
        {isEditing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full bg-white/10 border border-purple-500/50 rounded px-2 py-1 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            rows={2}
          />
        ) : (
          <div className="space-y-1">
            <p
              onClick={() => setIsEditing(true)}
              className="text-sm text-white/90 cursor-text hover:bg-white/5 rounded px-1 py-0.5 -mx-1"
            >
              {bulletText ? (
                <HighlightedBulletText text={bulletText} />
              ) : (
                <span className="text-white/40 italic">Click to add bullet...</span>
              )}
            </p>
            {/* Score indicators - only show when there's content */}
            {bulletText && bulletText.trim().length > 0 && (
              <div className="flex items-center gap-3 text-[10px] px-1">
                {/* Score badge */}
                <div
                  className={cn(
                    'flex items-center gap-1 px-1.5 py-0.5 rounded',
                    analysis.strength === 'strong' ? 'bg-green-500/20 text-green-400' :
                    analysis.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  )}
                >
                  <span className="font-medium">{analysis.score}</span>
                </div>
                {/* Quick indicators */}
                <div className={cn('flex items-center gap-0.5', analysis.startsWithActionVerb ? 'text-green-400/70' : 'text-white/30')} title={analysis.startsWithActionVerb ? 'Starts with action verb' : 'Missing action verb'}>
                  <Zap className="w-3 h-3" />
                </div>
                <div className={cn('flex items-center gap-0.5', analysis.hasMetrics ? 'text-green-400/70' : 'text-white/30')} title={analysis.hasMetrics ? 'Has metrics' : 'Add metrics for impact'}>
                  <TrendingUp className="w-3 h-3" />
                </div>
                {analysis.weakWords.length > 0 && (
                  <div className="flex items-center gap-0.5 text-yellow-400/70" title={`${analysis.weakWords.length} weak word(s) found`}>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{analysis.weakWords.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all"
        >
          <MoreVertical className="w-4 h-4 text-white/60" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-20 bg-gray-900 border border-white/20 rounded-lg shadow-xl py-1 min-w-[180px]">
              {onOptimize && (
                <button
                  onClick={() => { onOptimize(); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Optimize with AI
                </button>
              )}
              {onQuantify && (
                <button
                  onClick={() => { onQuantify(); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Hash className="w-4 h-4 text-blue-400" />
                  Add Metrics
                </button>
              )}
              {onShorten && (
                <button
                  onClick={() => { onShorten(); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Scissors className="w-4 h-4 text-green-400" />
                  Make Shorter
                </button>
              )}
              {onExpand && (
                <button
                  onClick={() => { onExpand(); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Expand className="w-4 h-4 text-yellow-400" />
                  Expand
                </button>
              )}
              <div className="border-t border-white/10 my-1" />
              <button
                onClick={() => { onDelete(); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
