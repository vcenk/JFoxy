// components/resume/editor/components/FieldRow.tsx
// Field with toggle and inline editing

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Check, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FieldRowProps {
  label: string
  value: string
  enabled?: boolean
  onValueChange: (value: string) => void
  onEnabledChange?: (enabled: boolean) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'date'
  showToggle?: boolean
  className?: string
  required?: boolean
}

export const FieldRow: React.FC<FieldRowProps> = ({
  label,
  value,
  enabled = true,
  onValueChange,
  onEnabledChange,
  placeholder,
  type = 'text',
  showToggle = true,
  className,
  required = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    onValueChange(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  return (
    <div className={cn('flex items-center gap-3 py-2', className)}>
      {/* Toggle Button */}
      {showToggle && onEnabledChange && (
        <button
          type="button"
          onClick={() => onEnabledChange(!enabled)}
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

      {/* Label */}
      <span
        className={cn(
          'text-sm font-medium w-24 flex-shrink-0',
          enabled ? 'text-white/80' : 'text-white/40'
        )}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>

      {/* Value / Input */}
      <div className={cn('flex-1', !enabled && 'opacity-50')}>
        {isEditing ? (
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
            className="w-full bg-white/10 border border-purple-500/50 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-white/5 transition-colors"
          >
            {value ? (
              <span className="text-white/90">{value}</span>
            ) : (
              <span className="text-white/40 italic">{placeholder || `Add ${label.toLowerCase()}...`}</span>
            )}
          </button>
        )}
      </div>

      {/* Visibility Indicator */}
      {showToggle && (
        <div className="flex-shrink-0 text-white/30">
          {enabled ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </div>
      )}
    </div>
  )
}
