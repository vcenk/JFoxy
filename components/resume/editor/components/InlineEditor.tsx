// components/resume/editor/components/InlineEditor.tsx
// Click-to-edit text field with save on blur/enter

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface InlineEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
  displayClassName?: string
  multiline?: boolean
  disabled?: boolean
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit...',
  className,
  inputClassName,
  displayClassName,
  multiline = false,
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    }
    if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  if (disabled) {
    return (
      <span className={cn('text-white/90', className, displayClassName)}>
        {value || <span className="text-white/40 italic">{placeholder}</span>}
      </span>
    )
  }

  if (isEditing) {
    const inputProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      placeholder,
      className: cn(
        'bg-white/10 border border-purple-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500',
        className,
        inputClassName
      ),
    }

    if (multiline) {
      return <textarea {...inputProps} rows={3} />
    }

    return <input type="text" {...inputProps} />
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className={cn(
        'text-left hover:bg-white/5 rounded px-2 py-1 -mx-2 transition-colors',
        className,
        displayClassName
      )}
    >
      {value ? (
        <span className="text-white/90">{value}</span>
      ) : (
        <span className="text-white/40 italic">{placeholder}</span>
      )}
    </button>
  )
}
