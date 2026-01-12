// components/resume/analysis/BulletAnalysisPanel.tsx
// Panel showing bullet point quality analysis with AI improvement option

'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Target,
} from 'lucide-react'
import { analyzeAllBullets, analyzeBullet, BulletAnalysis } from '@/lib/utils/bulletAnalyzer'
import { ParsedResume, ExperienceEntry, BulletItem } from '@/lib/types/resume'
import { cn } from '@/lib/utils'

interface BulletAnalysisPanelProps {
  resumeData: ParsedResume
  onImproveWithAI?: (bullets: string[]) => Promise<void>
  isImproving?: boolean
}

// Helper to extract plain text from RichText
function getPlainText(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  if (content.type === 'doc' && content.content) {
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || ''
      if (node.content && Array.isArray(node.content)) {
        return node.content.map(extractText).join('')
      }
      return ''
    }
    return content.content.map(extractText).join('\n')
  }

  return ''
}

// Get all bullets from resume
function getAllBullets(resumeData: ParsedResume): { text: string; source: string }[] {
  const bullets: { text: string; source: string }[] = []

  // Experience bullets
  if (resumeData.experience) {
    resumeData.experience.forEach((exp: ExperienceEntry) => {
      if (exp.bullets && Array.isArray(exp.bullets)) {
        exp.bullets.forEach((bullet: any) => {
          const text = getPlainText(bullet.content || bullet)
          if (text.trim()) {
            bullets.push({
              text,
              source: `${exp.company || 'Unknown Company'} - ${exp.position || 'Position'}`
            })
          }
        })
      }
    })
  }

  // Project bullets
  if (resumeData.projects) {
    resumeData.projects.forEach((proj: any) => {
      if (proj.highlights && Array.isArray(proj.highlights)) {
        proj.highlights.forEach((bullet: any) => {
          const text = getPlainText(bullet.content || bullet)
          if (text.trim()) {
            bullets.push({
              text,
              source: `Project: ${proj.name || 'Unknown Project'}`
            })
          }
        })
      }
    })
  }

  return bullets
}

export function BulletAnalysisPanel({
  resumeData,
  onImproveWithAI,
  isImproving = false,
}: BulletAnalysisPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedBullets, setSelectedBullets] = useState<Set<number>>(new Set())

  // Get all bullets and analyze them
  const bulletsWithSource = useMemo(() => getAllBullets(resumeData), [resumeData])
  const bulletTexts = useMemo(() => bulletsWithSource.map(b => b.text), [bulletsWithSource])
  const aggregateAnalysis = useMemo(() => analyzeAllBullets(bulletTexts), [bulletTexts])
  const individualAnalyses = useMemo(
    () => bulletTexts.map(text => analyzeBullet(text)),
    [bulletTexts]
  )

  // Find weak bullets (score < 70)
  const weakBullets = useMemo(() => {
    return individualAnalyses
      .map((analysis, index) => ({ analysis, index, ...bulletsWithSource[index] }))
      .filter(item => item.analysis.score < 70)
      .sort((a, b) => a.analysis.score - b.analysis.score)
  }, [individualAnalyses, bulletsWithSource])

  const handleImproveSelected = async () => {
    if (!onImproveWithAI) return

    const bulletsToImprove = selectedBullets.size > 0
      ? Array.from(selectedBullets).map(i => bulletTexts[i])
      : weakBullets.slice(0, 5).map(b => b.text)

    await onImproveWithAI(bulletsToImprove)
    setSelectedBullets(new Set())
  }

  const toggleBulletSelection = (index: number) => {
    const newSelection = new Set(selectedBullets)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedBullets(newSelection)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 50) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  if (bulletTexts.length === 0) {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gray-900/60 backdrop-blur-xl">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Bullet Point Analysis</h3>
              <p className="text-sm text-white/50">
                {bulletTexts.length} bullets analyzed
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="text-right">
            <div className={cn('text-3xl font-bold', getScoreColor(aggregateAnalysis.averageScore))}>
              {aggregateAnalysis.averageScore}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              Avg Score
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className={cn('w-4 h-4', aggregateAnalysis.bulletsWithActionVerbs === bulletTexts.length ? 'text-green-400' : 'text-yellow-400')} />
            </div>
            <div className="text-lg font-bold text-white">
              {aggregateAnalysis.bulletsWithActionVerbs}/{bulletTexts.length}
            </div>
            <div className="text-[10px] text-white/50">Action Verbs</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className={cn('w-4 h-4', aggregateAnalysis.bulletsWithMetrics === bulletTexts.length ? 'text-green-400' : 'text-yellow-400')} />
            </div>
            <div className="text-lg font-bold text-white">
              {aggregateAnalysis.bulletsWithMetrics}/{bulletTexts.length}
            </div>
            <div className="text-[10px] text-white/50">With Metrics</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className={cn('w-4 h-4', aggregateAnalysis.totalWeakWords === 0 ? 'text-green-400' : 'text-red-400')} />
            </div>
            <div className="text-lg font-bold text-white">
              {aggregateAnalysis.totalWeakWords}
            </div>
            <div className="text-[10px] text-white/50">Weak Words</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className={cn('w-4 h-4', weakBullets.length === 0 ? 'text-green-400' : 'text-yellow-400')} />
            </div>
            <div className="text-lg font-bold text-white">
              {bulletTexts.length - weakBullets.length}
            </div>
            <div className="text-[10px] text-white/50">Strong Bullets</div>
          </div>
        </div>

        {/* Top Tips */}
        {aggregateAnalysis.topTips.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Top Improvement Tips
            </div>
            <ul className="space-y-1">
              {aggregateAnalysis.topTips.slice(0, 3).map((tip, i) => (
                <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weak Bullets Section */}
        {weakBullets.length > 0 && (
          <div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors mb-3"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-300">
                  {weakBullets.length} bullets need improvement
                </span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-white/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/50" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mb-4"
                >
                  {weakBullets.slice(0, 10).map((item) => (
                    <div
                      key={item.index}
                      className={cn(
                        'p-3 rounded-xl border transition-all cursor-pointer',
                        selectedBullets.has(item.index)
                          ? 'bg-purple-500/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      )}
                      onClick={() => toggleBulletSelection(item.index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5',
                          selectedBullets.has(item.index)
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-white/30 bg-white/5'
                        )}>
                          {selectedBullets.has(item.index) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              'text-xs font-medium px-2 py-0.5 rounded',
                              getScoreBg(item.analysis.score),
                              getScoreColor(item.analysis.score)
                            )}>
                              {item.analysis.score}
                            </span>
                            <span className="text-xs text-white/40 truncate">
                              {item.source}
                            </span>
                          </div>
                          <p className="text-sm text-white/70 line-clamp-2">
                            {item.text}
                          </p>
                          {item.analysis.tips.length > 0 && (
                            <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {item.analysis.tips[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* AI Improve Button */}
        {onImproveWithAI && weakBullets.length > 0 && (
          <button
            onClick={handleImproveSelected}
            disabled={isImproving}
            className={cn(
              'w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
              isImproving
                ? 'bg-purple-500/30 text-purple-300 cursor-wait'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
            )}
          >
            {isImproving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Improving bullets with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Improve {selectedBullets.size > 0 ? selectedBullets.size : Math.min(5, weakBullets.length)} Bullet{(selectedBullets.size > 0 ? selectedBullets.size : Math.min(5, weakBullets.length)) !== 1 ? 's' : ''} with AI
              </>
            )}
          </button>
        )}

        {/* Success state */}
        {weakBullets.length === 0 && (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-medium">All bullets are well-optimized!</p>
            <p className="text-sm text-white/50 mt-1">Your resume bullets are strong and impactful.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulletAnalysisPanel
