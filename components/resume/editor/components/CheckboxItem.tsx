// components/resume/editor/components/CheckboxItem.tsx
// Reusable checkbox item with content display

'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxItemProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  indeterminate?: boolean
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  checked,
  onChange,
  children,
  className,
  disabled = false,
  indeterminate = false,
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-3 group',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5',
          checked
            ? 'bg-purple-500 border-purple-500'
            : 'border-white/30 bg-white/5 hover:border-purple-400',
          disabled && 'pointer-events-none'
        )}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
        {indeterminate && !checked && (
          <div className="w-2 h-0.5 bg-white/60 rounded" />
        )}
      </button>
      <div
        className={cn(
          'flex-1 transition-opacity',
          !checked && 'opacity-50'
        )}
      >
        {children}
      </div>
    </div>
  )
}
