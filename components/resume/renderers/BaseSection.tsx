// components/resume/renderers/BaseSection.tsx
// Base wrapper for all resume sections

'use client'

import React, { ReactNode } from 'react'
import { useResume } from '@/contexts/ResumeContext'
import type { ResumeSectionKey } from '@/lib/sectionRegistry'

interface BaseSectionProps {
  sectionKey: ResumeSectionKey
  isActive: boolean
  onClick: () => void
  children: ReactNode
}

export const BaseSection: React.FC<BaseSectionProps> = ({
  sectionKey,
  isActive,
  onClick,
  children,
}) => {
  const { designerSettings } = useResume()

  const getSectionClassName = () => {
    const baseClasses = 'print-avoid-break cursor-pointer transition-all p-2 rounded-lg'
    if (isActive) {
      return `${baseClasses} opacity-100 ring-2 ring-purple-500`
    }
    return `${baseClasses} opacity-90 hover:opacity-100`
  }

  return (
    <div
      data-resume-section={sectionKey}
      onClick={onClick}
      className={getSectionClassName()}
      style={{
        fontFamily:
          designerSettings.fontFamily === 'inter'
            ? 'var(--font-inter), sans-serif'
            : '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {children}
    </div>
  )
}
