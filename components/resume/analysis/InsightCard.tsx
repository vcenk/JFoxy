// components/resume/analysis/InsightCard.tsx
'use client'

import { AlertTriangle, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react'

type InsightType = 'success' | 'warning' | 'error' | 'info'

interface InsightCardProps {
  title: string
  description: string
  type: InsightType
  score?: number
  actionLabel?: string
  onAction?: () => void
  children?: React.ReactNode
}

export function InsightCard({ 
  title, 
  description, 
  type, 
  score, 
  actionLabel, 
  onAction,
  children 
}: InsightCardProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'info': return <Lightbulb className="w-5 h-5 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/20'
      case 'warning': return 'border-yellow-500/20'
      case 'error': return 'border-red-500/20'
      default: return 'border-white/10'
    }
  }

  return (
    <div className={`glass-panel p-6 rounded-3xl border ${getBorderColor()} relative overflow-hidden group hover:bg-white/10 transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            {getIcon()}
          </div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
        </div>
        {score !== undefined && (
          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/5 ${
            score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {score}/100
          </span>
        )}
      </div>
      
      <p className="text-white/70 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {children && <div className="mb-4">{children}</div>}

      {actionLabel && (
        <button 
          onClick={onAction}
          className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors group/btn"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}
