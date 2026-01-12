// components/resume/editor/components/AddItemButton.tsx
// "+ Add" style button for adding new items

'use client'

import React from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AddItemButtonProps {
  label: string
  onClick: () => void
  variant?: 'default' | 'ai' | 'subtle'
  className?: string
  icon?: React.ReactNode
}

export const AddItemButton: React.FC<AddItemButtonProps> = ({
  label,
  onClick,
  variant = 'default',
  className,
  icon,
}) => {
  const variants = {
    default: 'text-purple-400 hover:bg-purple-500/20 border-dashed border-purple-500/30',
    ai: 'text-amber-400 hover:bg-amber-500/20 border-dashed border-amber-500/30',
    subtle: 'text-white/60 hover:bg-white/10 border-transparent hover:border-white/20',
  }

  const IconComponent = variant === 'ai' ? Sparkles : Plus

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-center gap-2 py-3 rounded-lg border transition-all',
        'text-sm font-medium',
        variants[variant],
        className
      )}
    >
      {icon || <IconComponent className="w-4 h-4" />}
      {label}
    </button>
  )
}
