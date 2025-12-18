// components/resume/analysis/AnalysisDashboard.tsx
'use client'

import { FitnessRings } from './FitnessRings'
import { InsightCard } from './InsightCard'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const SkillsRadarChart = dynamic(() => import('./RadarChart'), { ssr: false })

import { ATSWarning } from '@/lib/types/analysis'
import { AlertTriangle, CheckCircle2, AlertCircle, Info, Sparkles, Loader2 } from 'lucide-react'

// Define the shape of data we expect from the analysis engine
// Matching lib/engines/resumeAnalysisEngine.ts ResumeAnalysisResult
export interface AnalysisData {
  ats_score: number
  jd_match_score: number
  skills_fit_score: number

  // NEW: Detailed coaching explanations
  ats_score_explanation?: string
  job_match_explanation?: string
  skills_fit_explanation?: string
  keyword_strategy?: string
  ats_health_check?: string
  skills_breakdown_coaching?: {
    technical?: string
    tools?: string
    domain?: string
    communication?: string
    soft_skills?: string
  }
  strength_highlights?: string[]
  coaching_summary?: string
  bullet_improvements?: Array<{
    before: string
    after: string
    reason: string
  }>

  // Enhanced keyword data
  resume_keywords?: string[]
  jd_keywords?: string[]
  matched_keywords?: string[]
  missing_keywords?: string[]

  // ATS warnings and good practices
  ats_warnings?: ATSWarning[]
  ats_good_practices?: string[]

  // Legacy fields (keeping for backward compatibility)
  keyword_analysis: {
    missing: string[]
    present: string[]
  }
  weaknesses: string[]
  strengths: string[]
  formatting_issues: string[]
  skills_radar_data: Array<{ subject: string; A: number; fullMark: number }>
  missing_skills?: string[]
}

interface AnalysisDashboardProps {
  data: AnalysisData | null
  onFixIssue: (issueType: string) => void
  onOptimizeResume?: () => void
  isOptimizing?: boolean
}

export function AnalysisDashboard({ data, onFixIssue, onOptimizeResume, isOptimizing }: AnalysisDashboardProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/50">
        <p>Run analysis to see insights</p>
      </div>
    )
  }

  // Generate Quick Wins from analysis data
  const generateQuickWins = () => {
    const wins: Array<{ icon: string; title: string; action: string; impact: 'high' | 'medium' }> = []

    // Priority 1: Critical ATS issues
    const criticalWarnings = data.ats_warnings?.filter(w => w.severity === 'critical') || []
    if (criticalWarnings.length > 0) {
      wins.push({
        icon: '🚨',
        title: 'Fix Critical ATS Issue',
        action: criticalWarnings[0].recommendation,
        impact: 'high'
      })
    }

    // Priority 2: Missing keywords
    const missingCount = data.missing_keywords?.length || 0
    if (missingCount > 3) {
      const topKeywords = data.missing_keywords?.slice(0, 3).join(', ') || ''
      wins.push({
        icon: '🔑',
        title: 'Add Key Missing Keywords',
        action: `Include these important keywords: ${topKeywords}`,
        impact: 'high'
      })
    }

    // Priority 3: Low scores - suggest improvements
    if (data.ats_score < 75) {
      const atsWarnings = data.ats_warnings?.filter(w => w.severity === 'warning').slice(0, 1) || []
      if (atsWarnings.length > 0) {
        wins.push({
          icon: '⚡',
          title: 'Improve ATS Score',
          action: atsWarnings[0].recommendation,
          impact: 'medium'
        })
      }
    } else if (data.jd_match_score && data.jd_match_score < 75) {
      wins.push({
        icon: '🎯',
        title: 'Boost Job Match',
        action: 'Align your experience bullets more closely with job requirements',
        impact: 'high'
      })
    } else if (data.skills_fit_score < 75) {
      const missingSkills = data.missing_skills?.slice(0, 2).join(', ') || 'key skills'
      wins.push({
        icon: '⚡',
        title: 'Highlight More Skills',
        action: `Add or emphasize: ${missingSkills}`,
        impact: 'medium'
      })
    }

    // Limit to top 3
    return wins.slice(0, 3)
  }

  // Generate Progress Roadmap
  const generateProgressRoadmap = () => {
    const currentScore = data.ats_score || 0
    let targetScore = 90
    let currentTier = 'Needs Work'
    let nextTier = 'Excellent'

    if (currentScore >= 90) {
      targetScore = 100
      currentTier = 'Excellent'
      nextTier = 'Perfect'
    } else if (currentScore >= 75) {
      targetScore = 90
      currentTier = 'Good'
      nextTier = 'Excellent'
    } else if (currentScore >= 60) {
      targetScore = 75
      currentTier = 'Fair'
      nextTier = 'Good'
    } else {
      targetScore = 60
      currentTier = 'Needs Work'
      nextTier = 'Fair'
    }

    const pointsNeeded = targetScore - currentScore
    const progress = ((currentScore % 15) / 15) * 100 // Progress within current tier

    // Generate specific steps to reach next tier
    const steps: Array<{ text: string; completed: boolean }> = []

    // Add steps based on what's missing
    if (data.ats_warnings && data.ats_warnings.filter(w => w.severity === 'critical').length > 0) {
      steps.push({ text: 'Fix all critical ATS issues', completed: false })
    }

    if (data.missing_keywords && data.missing_keywords.length > 3) {
      steps.push({ text: `Add ${Math.min(5, data.missing_keywords.length)} missing keywords`, completed: false })
    }

    if (data.ats_warnings && data.ats_warnings.filter(w => w.severity === 'warning').length > 2) {
      steps.push({ text: 'Resolve formatting warnings', completed: false })
    }

    if (data.skills_fit_score < 70) {
      steps.push({ text: 'Improve skills section', completed: false })
    }

    // Fill with generic suggestions if we don't have enough specific ones
    if (steps.length < 3) {
      if (currentScore < 90) {
        steps.push({ text: 'Quantify achievements with metrics', completed: false })
      }
      if (currentScore < 75) {
        steps.push({ text: 'Use stronger action verbs', completed: false })
      }
    }

    return {
      currentScore,
      targetScore,
      pointsNeeded,
      currentTier,
      nextTier,
      progress,
      steps: steps.slice(0, 3)
    }
  }

  const quickWins = generateQuickWins()
  const roadmap = generateProgressRoadmap()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      {/* SECTION A: Hero Rings */}
      <motion.div variants={item}>
        <FitnessRings
          atsScore={data.ats_score}
          matchScore={data.jd_match_score || 0}
          skillsScore={data.skills_fit_score}
        />
      </motion.div>

      {/* Quick Wins Section - NEW */}
      {quickWins.length > 0 && (
        <motion.div variants={item} className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">⚡</div>
            <div>
              <h3 className="text-lg font-bold text-white">Quick Wins</h3>
              <p className="text-sm text-white/60">Top priority improvements for maximum impact</p>
            </div>
          </div>
          <div className="space-y-3">
            {quickWins.map((win, index) => (
              <div
                key={index}
                className={`flex gap-4 p-4 rounded-xl border transition-all ${
                  win.impact === 'high'
                    ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50'
                    : 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50'
                }`}
              >
                <div className="text-2xl flex-shrink-0">{win.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm">{win.title}</h4>
                    {win.impact === 'high' && (
                      <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded-full font-medium">
                        High Impact
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{win.action}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress Roadmap - NEW */}
      {roadmap.pointsNeeded > 0 && roadmap.currentScore < 90 && (
        <motion.div variants={item} className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-white">Path to {roadmap.nextTier}</h3>
                <p className="text-sm text-white/60">Just {roadmap.pointsNeeded} points away</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-300">{roadmap.currentScore}%</div>
              <div className="text-xs text-white/50">Current Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span>{roadmap.currentTier}</span>
              <span className="text-purple-300 font-medium">Target: {roadmap.targetScore}%</span>
            </div>
            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(roadmap.currentScore / roadmap.targetScore) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-2">
                <div className="h-4 w-0.5 bg-white/30" style={{ marginRight: `${100 - (roadmap.currentScore / roadmap.targetScore) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Steps to reach next tier */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-3">Complete these steps:</h4>
            <div className="space-y-2">
              {roadmap.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    step.completed ? 'bg-green-500 border-green-500' : 'border-white/30'
                  }`}>
                    {step.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-white/80">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Optimize Button - NEW */}
      {onOptimizeResume && (
        <motion.div variants={item}>
          <button
            onClick={onOptimizeResume}
            disabled={isOptimizing}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-[2px] hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl px-8 py-6 flex items-center justify-between group-hover:from-gray-900/90 group-hover:to-gray-900/90 transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Sparkles className={`w-8 h-8 text-purple-400 ${isOptimizing ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  {isOptimizing && (
                    <Loader2 className="w-8 h-8 text-purple-400 absolute inset-0 animate-spin" />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {isOptimizing ? 'Creating Optimized Resume...' : 'AI Optimize Resume'}
                  </h3>
                  <p className="text-sm text-white/70">
                    {isOptimizing
                      ? 'Applying improvements and tailoring to job description...'
                      : 'Create a tailored version with all recommended improvements applied'
                    }
                  </p>
                </div>
              </div>
              {!isOptimizing && (
                <div className="hidden sm:flex items-center gap-2 text-purple-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Let's Go</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </motion.div>
      )}

      {/* SECTION A1: Coaching Summary - NEW */}
      {data.coaching_summary && (
        <motion.div variants={item} className="glass-panel p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">💼</span>
            Overall Assessment
          </h3>
          <div className="text-white/80 leading-relaxed whitespace-pre-line">
            {data.coaching_summary}
          </div>
        </motion.div>
      )}

      {/* SECTION A2: Detailed Coaching Sections - NEW */}
      {(data.ats_score_explanation || data.job_match_explanation || data.skills_fit_explanation) && (
        <motion.div variants={item} className="space-y-4">
          {/* ATS Score Coaching */}
          {data.ats_score_explanation && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                ATS Score Explained
              </h3>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {data.ats_score_explanation}
              </div>
            </div>
          )}

          {/* Job Match Coaching */}
          {data.job_match_explanation && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Job Match Analysis
              </h3>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {data.job_match_explanation}
              </div>
            </div>
          )}

          {/* Skills Fit Coaching */}
          {data.skills_fit_explanation && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Skills Assessment
              </h3>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {data.skills_fit_explanation}
              </div>
            </div>
          )}

          {/* Keyword Strategy */}
          {data.keyword_strategy && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">🔑</span>
                Keyword Strategy
              </h3>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {data.keyword_strategy}
              </div>
            </div>
          )}

          {/* ATS Health Check */}
          {data.ats_health_check && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                ATS Health Check
              </h3>
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {data.ats_health_check}
              </div>
            </div>
          )}

          {/* Skills Breakdown Coaching */}
          {data.skills_breakdown_coaching && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Skills Breakdown
              </h3>
              <div className="space-y-3">
                {data.skills_breakdown_coaching.technical && (
                  <div>
                    <div className="text-sm font-semibold text-purple-300 mb-1">Technical Skills</div>
                    <div className="text-white/70 text-sm leading-relaxed">{data.skills_breakdown_coaching.technical}</div>
                  </div>
                )}
                {data.skills_breakdown_coaching.tools && (
                  <div>
                    <div className="text-sm font-semibold text-blue-300 mb-1">Tools & Technologies</div>
                    <div className="text-white/70 text-sm leading-relaxed">{data.skills_breakdown_coaching.tools}</div>
                  </div>
                )}
                {data.skills_breakdown_coaching.domain && (
                  <div>
                    <div className="text-sm font-semibold text-green-300 mb-1">Domain Knowledge</div>
                    <div className="text-white/70 text-sm leading-relaxed">{data.skills_breakdown_coaching.domain}</div>
                  </div>
                )}
                {data.skills_breakdown_coaching.communication && (
                  <div>
                    <div className="text-sm font-semibold text-yellow-300 mb-1">Communication</div>
                    <div className="text-white/70 text-sm leading-relaxed">{data.skills_breakdown_coaching.communication}</div>
                  </div>
                )}
                {data.skills_breakdown_coaching.soft_skills && (
                  <div>
                    <div className="text-sm font-semibold text-pink-300 mb-1">Soft Skills</div>
                    <div className="text-white/70 text-sm leading-relaxed">{data.skills_breakdown_coaching.soft_skills}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Strength Highlights */}
          {data.strength_highlights && data.strength_highlights.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                Your Strengths
              </h3>
              <div className="space-y-3">
                {data.strength_highlights.map((strength, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="text-green-400 font-bold text-lg mt-0.5">✓</div>
                    <div className="text-white/80 text-sm leading-relaxed flex-1">{strength}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Before/After Bullet Improvements */}
          {data.bullet_improvements && data.bullet_improvements.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Bullet Point Examples
              </h3>
              <p className="text-sm text-white/60 mb-4">See how to strengthen your experience bullets</p>
              <div className="space-y-4">
                {data.bullet_improvements.map((improvement, index) => (
                  <div key={index} className="border border-white/10 rounded-xl overflow-hidden">
                    {/* Before */}
                    <div className="p-4 bg-red-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-red-300 bg-red-500/20 px-2 py-0.5 rounded">BEFORE</span>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">{improvement.before}</p>
                    </div>
                    {/* Arrow */}
                    <div className="flex items-center justify-center py-2 bg-white/5">
                      <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    {/* After */}
                    <div className="p-4 bg-green-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-2 py-0.5 rounded">AFTER</span>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed font-medium">{improvement.after}</p>
                    </div>
                    {/* Reason */}
                    <div className="p-4 bg-blue-500/5 border-t border-white/10">
                      <div className="flex items-start gap-2">
                        <div className="text-blue-400 mt-0.5">💡</div>
                        <p className="text-xs text-blue-200/80 leading-relaxed flex-1">{improvement.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* SECTION B: Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Keyword Matching - Enhanced */}
        <motion.div variants={item}>
          <InsightCard
            title="Keyword Analysis"
            description={
              (data.matched_keywords?.length || 0) === 0 && (data.missing_keywords?.length || 0) === 0
                ? 'See Keyword Strategy section above for detailed guidance'
                : `${data.matched_keywords?.length || 0} matched · ${data.missing_keywords?.length || 0} missing from JD`
            }
            type={(data.missing_keywords?.length || 0) > 3 ? 'warning' : 'success'}
          >
            <div className="space-y-3">
              {/* Matched Keywords */}
              {data.matched_keywords && data.matched_keywords.length > 0 && (
                <div>
                  <div className="text-xs text-green-400 font-medium mb-1.5">✓ Matched ({data.matched_keywords.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.matched_keywords.slice(0, 8).map(kw => (
                      <span key={kw} className="px-2 py-0.5 bg-green-500/10 text-green-300 text-xs rounded border border-green-500/20">
                        {kw}
                      </span>
                    ))}
                    {data.matched_keywords.length > 8 && (
                      <span className="px-2 py-0.5 text-white/40 text-xs">+{data.matched_keywords.length - 8}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {data.missing_keywords && data.missing_keywords.length > 0 && (
                <div>
                  <div className="text-xs text-red-400 font-medium mb-1.5">✗ Missing ({data.missing_keywords.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.missing_keywords.slice(0, 8).map(kw => (
                      <span key={kw} className="px-2 py-0.5 bg-red-500/10 text-red-300 text-xs rounded border border-red-500/20">
                        {kw}
                      </span>
                    ))}
                    {data.missing_keywords.length > 8 && (
                      <span className="px-2 py-0.5 text-white/40 text-xs">+{data.missing_keywords.length - 8}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Fallback message if no keywords detected */}
              {(!data.matched_keywords || data.matched_keywords.length === 0) &&
               (!data.missing_keywords || data.missing_keywords.length === 0) && (
                <div className="text-center text-white/50 py-4 text-sm">
                  Check the Keyword Strategy section above for detailed keyword guidance.
                </div>
              )}
            </div>
          </InsightCard>
        </motion.div>

        {/* ATS Health Check - New */}
        <motion.div variants={item}>
          <InsightCard
            title="ATS Health Check"
            description={
              (() => {
                const score = data.ats_score || 0
                const totalIssues = data.ats_warnings?.length || 0
                const criticalCount = data.ats_warnings?.filter(w => w.severity === 'critical').length || 0

                if (score >= 90) return `${score}% - Excellent ATS compatibility`
                if (score >= 75) return totalIssues > 0 ? `${score}% - Good (${totalIssues} suggestion${totalIssues > 1 ? 's' : ''})` : `${score}% - Good compatibility`
                if (score >= 60) return `${score}% - Needs improvement (${totalIssues} issue${totalIssues > 1 ? 's' : ''})`
                return `${score}% - Requires attention (${criticalCount} critical)`
              })()
            }
            type={
              data.ats_warnings && data.ats_warnings.some(w => w.severity === 'critical')
                ? 'error'
                : (data.ats_score || 0) >= 75
                  ? 'success'
                  : 'warning'
            }
          >
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* Critical Warnings */}
              {data.ats_warnings?.filter(w => w.severity === 'critical').map((warning, i) => (
                <div key={i} className="flex gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-red-300 font-medium">{warning.issue}</div>
                    <div className="text-xs text-white/60 mt-1">{warning.recommendation}</div>
                  </div>
                </div>
              ))}

              {/* Regular Warnings */}
              {data.ats_warnings?.filter(w => w.severity === 'warning').slice(0, 3).map((warning, i) => (
                <div key={i} className="flex gap-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-yellow-300 font-medium">{warning.issue}</div>
                    <div className="text-xs text-white/60 mt-1">{warning.recommendation}</div>
                  </div>
                </div>
              ))}

              {/* Info Tips */}
              {data.ats_warnings?.filter(w => w.severity === 'info').slice(0, 2).map((warning, i) => (
                <div key={i} className="flex gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-blue-300 font-medium">{warning.issue}</div>
                    <div className="text-xs text-white/60 mt-1">{warning.recommendation}</div>
                  </div>
                </div>
              ))}

              {/* Good Practices */}
              {data.ats_good_practices && data.ats_good_practices.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-green-400 font-medium mb-2">✓ What you're doing right:</div>
                  {data.ats_good_practices.slice(0, 3).map((practice, i) => (
                    <div key={i} className="flex gap-2 items-start mb-1">
                      <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white/70">{practice}</span>
                    </div>
                  ))}
                </div>
              )}

              {(!data.ats_warnings || data.ats_warnings.length === 0) && (
                <div className="text-center text-green-400 py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">Excellent ATS compatibility!</div>
                </div>
              )}
            </div>
          </InsightCard>
        </motion.div>

        {/* Skills Gap */}
        <motion.div variants={item}>
          <InsightCard
            title="Skills Analysis"
            description="Visual breakdown of your hard and soft skills alignment."
            type="info"
          >
             <SkillsRadarChart data={data.skills_radar_data} />
          </InsightCard>
        </motion.div>

      </div>
    </motion.div>
  )
}

