// components/resume/editor/BulletScoreIndicator.tsx
// Real-time bullet point quality indicator

'use client'

import { useMemo } from 'react'
import { analyzeBullet, getScoreColor, BulletAnalysis } from '@/lib/utils/bulletAnalyzer'
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

interface BulletScoreIndicatorProps {
  text: string
  showDetails?: boolean
  compact?: boolean
}

export function BulletScoreIndicator({
  text,
  showDetails = false,
  compact = false,
}: BulletScoreIndicatorProps) {
  const analysis = useMemo(() => analyzeBullet(text), [text])

  if (!text || text.trim().length === 0) {
    return null
  }

  const scoreColor = getScoreColor(analysis.score)

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${
            analysis.strength === 'strong'
              ? 'bg-green-500'
              : analysis.strength === 'moderate'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        />
        <span className={`text-xs font-medium ${scoreColor}`}>
          {analysis.score}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Score Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              analysis.strength === 'strong'
                ? 'bg-green-500'
                : analysis.strength === 'moderate'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${analysis.score}%` }}
          />
        </div>
        <span className={`text-xs font-medium min-w-[2rem] ${scoreColor}`}>
          {analysis.score}
        </span>
      </div>

      {/* Quick Status Icons */}
      <div className="flex items-center gap-3 text-xs">
        <div
          className={`flex items-center gap-1 ${
            analysis.startsWithActionVerb ? 'text-green-400' : 'text-white/40'
          }`}
          title={analysis.startsWithActionVerb ? 'Starts with action verb' : 'Missing action verb'}
        >
          <Zap className="w-3 h-3" />
          <span>Action</span>
        </div>
        <div
          className={`flex items-center gap-1 ${
            analysis.hasMetrics ? 'text-green-400' : 'text-white/40'
          }`}
          title={analysis.hasMetrics ? 'Has quantified metrics' : 'Missing metrics'}
        >
          <TrendingUp className="w-3 h-3" />
          <span>Metrics</span>
        </div>
        {analysis.weakWords.length > 0 && (
          <div className="flex items-center gap-1 text-yellow-400" title="Weak words detected">
            <AlertTriangle className="w-3 h-3" />
            <span>{analysis.weakWords.length} weak</span>
          </div>
        )}
      </div>

      {/* Tips (optional detailed view) */}
      {showDetails && analysis.tips.length > 0 && (
        <div className="mt-2 space-y-1">
          {analysis.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-white/60">
              <Lightbulb className="w-3 h-3 mt-0.5 text-yellow-400 flex-shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions for weak words */}
      {showDetails && analysis.suggestions.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="text-xs font-medium text-yellow-400 mb-1">Suggested Improvements</div>
          {analysis.suggestions.slice(0, 2).map((suggestion, i) => (
            <div key={i} className="text-xs text-white/70">
              <span className="text-red-400 line-through">{suggestion.weak}</span>
              {' → '}
              <span className="text-green-400">{suggestion.alternatives.slice(0, 2).join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Aggregate score for all bullets in an experience entry
 */
interface ExperienceBulletsSummaryProps {
  bullets: string[]
}

export function ExperienceBulletsSummary({ bullets }: ExperienceBulletsSummaryProps) {
  const analyses = useMemo(
    () => bullets.filter(b => b.trim()).map(b => analyzeBullet(b)),
    [bullets]
  )

  if (analyses.length === 0) {
    return null
  }

  const averageScore = Math.round(
    analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length
  )
  const withMetrics = analyses.filter(a => a.hasMetrics).length
  const withActionVerbs = analyses.filter(a => a.startsWithActionVerb).length
  const totalWeakWords = analyses.reduce((sum, a) => sum + a.weakWords.length, 0)

  const scoreColor = getScoreColor(averageScore)

  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white/70">Bullet Quality</span>
        <span className={`text-sm font-bold ${scoreColor}`}>{averageScore}/100</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-white/5 rounded">
          <div className={`text-lg font-bold ${withActionVerbs === analyses.length ? 'text-green-400' : 'text-yellow-400'}`}>
            {withActionVerbs}/{analyses.length}
          </div>
          <div className="text-[10px] text-white/50">Action Verbs</div>
        </div>
        <div className="p-2 bg-white/5 rounded">
          <div className={`text-lg font-bold ${withMetrics === analyses.length ? 'text-green-400' : 'text-yellow-400'}`}>
            {withMetrics}/{analyses.length}
          </div>
          <div className="text-[10px] text-white/50">With Metrics</div>
        </div>
        <div className="p-2 bg-white/5 rounded">
          <div className={`text-lg font-bold ${totalWeakWords === 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalWeakWords}
          </div>
          <div className="text-[10px] text-white/50">Weak Words</div>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="mt-3 space-y-1">
        {withActionVerbs < analyses.length && (
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <AlertTriangle className="w-3 h-3" />
            <span>{analyses.length - withActionVerbs} bullets need action verbs</span>
          </div>
        )}
        {withMetrics < analyses.length && (
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <AlertTriangle className="w-3 h-3" />
            <span>{analyses.length - withMetrics} bullets need metrics</span>
          </div>
        )}
        {totalWeakWords === 0 && withActionVerbs === analyses.length && withMetrics === analyses.length && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span>Great job! All bullets are well-optimized</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulletScoreIndicator
