// components/ui/ScoreBadge.tsx
'use client'

interface ScoreBadgeProps {
  score: number | null
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({ score, showLabel = false, size = 'md' }: ScoreBadgeProps) {
  if (score === null || score === undefined) {
    return (
      <span className="text-white/20 text-sm">—</span>
    )
  }

  // Color thresholds
  const getColor = () => {
    if (score >= 76) return {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      dot: 'bg-green-500',
    }
    if (score >= 51) return {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      dot: 'bg-yellow-500',
    }
    if (score >= 26) return {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      dot: 'bg-orange-500',
    }
    return {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      dot: 'bg-red-500',
    }
  }

  const getLabel = () => {
    if (score >= 76) return 'Excellent'
    if (score >= 51) return 'Good'
    if (score >= 26) return 'Fair'
    return 'Needs Work'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const colors = getColor()

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-full border
      ${colors.bg} ${colors.border} ${sizeClasses[size]}
    `}>
      <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      <span className={`font-bold ${colors.text}`}>
        {score}%
      </span>
      {showLabel && (
        <span className={`${colors.text} opacity-80 font-medium`}>
          {getLabel()}
        </span>
      )}
    </div>
  )
}
