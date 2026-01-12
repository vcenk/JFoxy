// components/resume/editor/components/CollapsibleSection.tsx
// Expandable section header with toggle and add button

'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Check, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  count?: number
  enabled?: boolean
  onEnabledChange?: (enabled: boolean) => void
  onAdd?: () => void
  addLabel?: string
  defaultExpanded?: boolean
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  count,
  enabled = true,
  onEnabledChange,
  onAdd,
  addLabel = 'Add',
  defaultExpanded = true,
  children,
  className,
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/5 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
        {/* Section Toggle */}
        {onEnabledChange && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEnabledChange(!enabled) }}
            className={cn(
              'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              enabled
                ? 'bg-purple-500 border-purple-500'
                : 'border-white/30 bg-white/5 hover:border-purple-400'
            )}
          >
            {enabled && <Check className="w-3 h-3 text-white" />}
          </button>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/60" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/60" />
          )}

          {icon && <span className="text-white/60">{icon}</span>}

          <span className={cn(
            'font-semibold',
            enabled ? 'text-white' : 'text-white/50'
          )}>
            {title}
          </span>

          {typeof count === 'number' && (
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
              {count}
            </span>
          )}
        </button>

        {/* Add Button */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            {addLabel}
          </button>
        )}

        {/* Visibility Indicator */}
        <div className="text-white/30">
          {enabled ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={cn(
          'px-4 pb-4',
          !enabled && 'opacity-50'
        )}>
          {children}
        </div>
      )}
    </div>
  )
}
