// components/ui/ThemePreview.tsx
// Theme preview card with placeholder image

'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { ResumeTheme } from '@/lib/resumeThemes'

interface ThemePreviewProps {
  theme: ResumeTheme
  isSelected: boolean
  onClick: () => void
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ theme, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-xl border-2 transition-all text-left group relative
        ${
          isSelected
            ? 'bg-white/10 border-purple-500 shadow-lg shadow-purple-500/20'
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Preview Image Container */}
      <div className="relative aspect-[8.5/11] rounded-t-lg overflow-hidden bg-white/5">
        {/* Placeholder SVG */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: `${theme.color}15` }}
        >
          <svg
            width="120"
            height="160"
            viewBox="0 0 120 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-20"
          >
            {/* Document outline */}
            <rect x="20" y="10" width="80" height="140" rx="4" stroke={theme.color} strokeWidth="2" />

            {/* Header lines */}
            <line x1="30" y1="25" x2="70" y2="25" stroke={theme.color} strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="33" x2="60" y2="33" stroke={theme.color} strokeWidth="1.5" strokeLinecap="round" />

            {/* Content blocks */}
            <rect x="30" y="45" width="60" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="52" width="55" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="59" width="50" height="2" rx="1" fill={theme.color} opacity="0.3" />

            <rect x="30" y="75" width="60" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="82" width="58" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="89" width="53" height="2" rx="1" fill={theme.color} opacity="0.3" />

            <rect x="30" y="105" width="60" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="112" width="55" height="2" rx="1" fill={theme.color} opacity="0.3" />
            <rect x="30" y="119" width="50" height="2" rx="1" fill={theme.color} opacity="0.3" />

            {/* Footer accent */}
            <circle cx="90" cy="135" r="3" fill={theme.color} opacity="0.5" />
          </svg>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
          <span className="text-xs text-white font-medium capitalize">{theme.category}</span>
        </div>

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Theme Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
            {theme.name}
          </h4>
          {theme.npm && (
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.color }} />
          )}
        </div>

        <p className="text-xs text-white/60 line-clamp-2">{theme.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 pt-1">
          {theme.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 bg-white/10 text-white/70 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
