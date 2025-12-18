// components/ui/glass-card.tsx
// Reusable Glass Card Component for Inspector panels

import { ReactNode } from 'react'

interface GlassCardProps {
  title?: string
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export const GlassCard = ({ title, children, className = '', noPadding = false }: GlassCardProps) => {
  return (
    <div className={`glass-panel ${noPadding ? '' : 'p-6'} ${className}`}>
      {title && (
        <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-white/10">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export const GlassCardSection = ({ title, children, className = '' }: GlassCardProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <h4 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
          {title}
        </h4>
      )}
      {children}
    </div>
  )
}
