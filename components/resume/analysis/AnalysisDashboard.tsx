// components/resume/analysis/AnalysisDashboard.tsx
'use client'

import { HeroScoresSection } from './HeroScoresSection'
import { JDRequirementMatch, JDRequirement } from './JDRequirementMatch'
import { QuickWinsSection, QuickWin } from './QuickWinsSection'
import { ATSKeywordOptimization } from './ATSKeywordOptimization'
import { SectionFeedback, SectionFeedbackItem } from './SectionFeedback'
import { InsightCard } from './InsightCard'
import { PowerWordsSuggestions } from './PowerWordsSuggestions'
import { QuantificationScore } from './QuantificationScore'
import { KeywordCoverage } from './KeywordCoverage'
import { BulletImprovements } from './BulletImprovements'
import { ATSHealthCheck } from './ATSHealthCheck'
import { BulletAnalysisPanel } from './BulletAnalysisPanel'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ParsedResume } from '@/lib/types/resume'

const SkillsRadarChart = dynamic(
  () => import('./RadarChart').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-[300px] flex items-center justify-center text-white/30">Loading chart...</div>
  }
)

import { ATSWarning } from '@/lib/types/analysis'
import { useState } from 'react'
import { AlertTriangle, CheckCircle2, AlertCircle, Info, Sparkles, Loader2, ArrowRight, Target, TrendingUp, Zap, ChevronDown } from 'lucide-react'

// Define the shape of data we expect from the analysis engine
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
  strength_highlights?: (string | { title: string; source: string; insight: string })[]
  coaching_summary?: string | { title: string; source: string; insight: string }
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

  // Phase 1: Power Words Analysis
  power_words?: {
    score: number
    weakWords: string[]
    suggestions: Array<{ weak: string; alternatives: string[] }>
    totalWeakWordsFound: number
    improvementPotential: 'low' | 'medium' | 'high'
  }

  // Phase 1: Quantification Analysis
  quantification?: {
    hasMetrics: boolean
    score: number
    metricTypes: string[]
    suggestions: string[]
  }

  // Phase 1: Industry Keyword Coverage
  keyword_coverage?: {
    coverage: number
    matched: string[]
    missing: string[]
    mustHaveMissing: string[]
    industry: string | null
    suggestions: string[]
  } | null

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

  // Section-specific feedback
  section_feedback?: SectionFeedbackItem[]

  // NEW: JD Requirements Matching
  jd_requirements?: JDRequirement[]
}

interface AnalysisDashboardProps {
  data: AnalysisData | null
  onFixIssue: (issueType: string) => void
  onOptimizeResume?: () => void
  isOptimizing?: boolean
  jobTitle?: string
  company?: string
  resumeText?: string
  resumeData?: ParsedResume
  industry?: string
  onApplyBulletImprovement?: (improvement: { before: string; after: string; reason: string }) => void
  onBulletImprovementsApplied?: (improvements: Array<{ original: string; improved: string }>) => void
}

// Helper to safely render coaching text (handles both string and object formats)
const renderCoachingText = (text: string | { title: string; source: string; insight: string } | undefined) => {
  if (!text) return null

  // Handle object format
  if (typeof text === 'object' && text !== null) {
    return (
      <div className="space-y-2">
        {text.title && <div className="font-semibold text-white/90 text-sm">{text.title}</div>}
        {text.source && <div className="text-white/60 text-xs italic">{text.source}</div>}
        {text.insight && <div className="text-white/70 text-sm leading-relaxed">{text.insight}</div>}
      </div>
    )
  }

  // Handle string format
  return formatTextWithBullets(text)
}

// Helper to render text with bullets if detected
const formatTextWithBullets = (text: string) => {
  if (!text) return null

  // Split by newlines
  const lines = text.split('\n').filter(line => line.trim().length > 0)

  // Check if it looks like a list (starts with dash, bullet, or asterisk)
  // or if we just want to treat every line as a potential bullet if it's long enough text block
  const isList = lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().startsWith('*'))

  if (isList) {
    return (
      <ul className="space-y-2">
        {lines.map((line, i) => {
          // Remove the bullet character if present to avoid double bullets
          const content = line.replace(/^[-•*]\s*/, '').trim()
          return (
            <li key={i} className="flex gap-2.5 items-start text-white/70 text-sm leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
              <span>{content}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  // If no explicit bullets, still render paragraphs nicely
  return (
    <div className="space-y-3 text-white/70 text-sm leading-relaxed">
      {lines.map((line, i) => <p key={i}>{line}</p>)}
    </div>
  )
}

export function AnalysisDashboard({ data, onFixIssue, onOptimizeResume, isOptimizing, jobTitle, company, resumeText, resumeData, industry, onApplyBulletImprovement, onBulletImprovementsApplied }: AnalysisDashboardProps) {
  const [expandedRoadmapStep, setExpandedRoadmapStep] = useState<number | null>(null)
  const [isImprovingBullets, setIsImprovingBullets] = useState(false)

  // Handler for AI bullet improvements
  const handleImproveWithAI = async (bulletTexts: string[]) => {
    if (!resumeData || !onBulletImprovementsApplied) return

    setIsImprovingBullets(true)
    try {
      const response = await fetch('/api/resume/improve-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullets: bulletTexts.map(text => ({ text })),
          industry,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to improve bullets')
      }

      const data = await response.json()
      if (data.success && data.data.improvements) {
        onBulletImprovementsApplied(data.data.improvements)
      }
    } catch (error) {
      console.error('Error improving bullets:', error)
    } finally {
      setIsImprovingBullets(false)
    }
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-white/40 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-white/20" />
        <p>Running analysis...</p>
      </div>
    )
  }

  // Generate Quick Wins from analysis data
  const generateQuickWins = (): QuickWin[] => {
    const wins: QuickWin[] = []

    // Priority 1: Critical ATS issues
    const criticalWarnings = data.ats_warnings?.filter(w => w.severity === 'critical') || []
    if (criticalWarnings.length > 0) {
      wins.push({
        id: 'ats-critical',
        icon: '🚨',
        title: 'Fix Critical ATS Issue',
        action: criticalWarnings[0].recommendation,
        impact: 'high',
        targetSection: 'ats-health-section'
      })
    }

    // Priority 2: Missing keywords
    const missingCount = data.missing_keywords?.length || 0
    if (missingCount > 3) {
      const topKeywords = data.missing_keywords?.slice(0, 3).join(', ') || ''
      wins.push({
        id: 'keywords-missing',
        icon: '🔑',
        title: 'Add Key Missing Keywords',
        action: `Include these important keywords: ${topKeywords}`,
        impact: 'high',
        targetSection: 'keyword-section'
      })
    }

    // Priority 3: Low scores - suggest improvements
    if (data.ats_score < 75) {
      const atsWarnings = data.ats_warnings?.filter(w => w.severity === 'warning').slice(0, 1) || []
      if (atsWarnings.length > 0) {
        wins.push({
          id: 'ats-improve',
          icon: '⚡',
          title: 'Improve ATS Score',
          action: atsWarnings[0].recommendation,
          impact: 'medium',
          targetSection: 'ats-health-section'
        })
      }
    } else if (data.jd_match_score && data.jd_match_score < 75) {
      wins.push({
        id: 'jd-match',
        icon: '🎯',
        title: 'Boost Job Match',
        action: 'Align your experience bullets more closely with job requirements',
        impact: 'high',
        targetSection: 'jd-requirements-section'
      })
    } else if (data.skills_fit_score < 75) {
      const missingSkills = data.missing_skills?.slice(0, 2).join(', ') || 'key skills'
      wins.push({
        id: 'skills-improve',
        icon: '⚡',
        title: 'Highlight More Skills',
        action: `Add or emphasize: ${missingSkills}`,
        impact: 'medium',
        targetSection: 'skills-section'
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

    // Generate specific steps to reach next tier with details
    const steps: Array<{ text: string; completed: boolean; details?: string[] }> = []

    // Add steps based on what's missing
    if (data.ats_warnings && data.ats_warnings.filter(w => w.severity === 'critical').length > 0) {
      const criticalIssues = data.ats_warnings
        .filter(w => w.severity === 'critical')
        .slice(0, 3)
        .map(w => w.recommendation)
      steps.push({
        text: 'Fix all critical ATS issues',
        completed: false,
        details: criticalIssues
      })
    }

    if (data.missing_keywords && data.missing_keywords.length > 3) {
      const keywordsToShow = data.missing_keywords.slice(0, 5)
      steps.push({
        text: `Add ${Math.min(5, data.missing_keywords.length)} missing keywords`,
        completed: false,
        details: keywordsToShow.map(k => `Add "${k}" to skills or experience`)
      })
    }

    if (data.ats_warnings && data.ats_warnings.filter(w => w.severity === 'warning').length > 2) {
      const warningIssues = data.ats_warnings
        .filter(w => w.severity === 'warning')
        .slice(0, 3)
        .map(w => w.recommendation)
      steps.push({
        text: 'Resolve formatting warnings',
        completed: false,
        details: warningIssues
      })
    }

    if (data.skills_fit_score < 70) {
      const missingSkills = data.missing_skills?.slice(0, 3) || []
      steps.push({
        text: 'Improve skills section',
        completed: false,
        details: missingSkills.length > 0
          ? missingSkills.map(s => `Add: ${s}`)
          : ['Consider adding more relevant technical skills']
      })
    }

    // Fill with generic suggestions if we don't have enough specific ones
    if (steps.length < 3) {
      if (currentScore < 90) {
        steps.push({
          text: 'Quantify achievements with metrics',
          completed: false,
          details: [
            'Add % improvements (e.g., "increased sales by 25%")',
            'Include $ amounts (e.g., "managed $1M budget")',
            'Add team sizes (e.g., "led team of 8 engineers")'
          ]
        })
      }
      if (currentScore < 75) {
        steps.push({
          text: 'Use stronger action verbs',
          completed: false,
          details: [
            'Replace "managed" → "Spearheaded"',
            'Replace "helped" → "Facilitated"',
            'Replace "worked on" → "Executed"'
          ]
        })
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

  // Get top priority for hero section
  const getTopPriority = (): string | undefined => {
    const criticalWarnings = data.ats_warnings?.filter(w => w.severity === 'critical') || []
    if (criticalWarnings.length > 0) {
      return criticalWarnings[0].recommendation
    }
    if (data.missing_keywords && data.missing_keywords.length > 0) {
      return `Add keyword: "${data.missing_keywords[0]}"`
    }
    return undefined
  }

  // Get coaching summary text
  const getCoachingSummaryText = (): string | undefined => {
    if (!data.coaching_summary) return undefined
    if (typeof data.coaching_summary === 'string') return data.coaching_summary
    if (typeof data.coaching_summary === 'object' && data.coaching_summary.insight) {
      return data.coaching_summary.insight
    }
    return undefined
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
      className="space-y-6 pb-20 w-full"
    >
      {/* SECTION A: Hero Scores Section (Full Width Redesign) */}
      <motion.div variants={item}>
        <HeroScoresSection
          atsScore={data.ats_score}
          matchScore={data.jd_match_score || 0}
          skillsScore={data.skills_fit_score}
          coachingSummary={getCoachingSummaryText()}
          topPriority={getTopPriority()}
          jobTitle={jobTitle}
          company={company}
          atsExplanation={data.ats_score_explanation}
          matchExplanation={data.job_match_explanation}
          skillsExplanation={data.skills_fit_explanation}
          onTopPriorityClick={() => {
            // Scroll to Quick Wins or JD Requirements section
            document.getElementById('jd-requirements-section')?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      </motion.div>

      {/* SECTION B: JD Requirements Match (Position #2) */}
      <motion.div variants={item} id="jd-requirements-section">
        <JDRequirementMatch
          requirements={data.jd_requirements || []}
          matchedKeywords={data.matched_keywords}
          missingKeywords={data.missing_keywords}
        />
      </motion.div>

      {/* SECTION C: Quick Wins (Full Width - Position #3) */}
      {quickWins.length > 0 && (
        <motion.div variants={item} id="quick-wins-section">
          <QuickWinsSection
            wins={quickWins}
            onActionClick={(win) => {
              if (win.targetSection) {
                document.getElementById(win.targetSection)?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          />
        </motion.div>
      )}

      {/* SECTION D: ATS Keyword Optimization (Full Width - Position #4) */}
      <motion.div variants={item}>
        {resumeText ? (
          <ATSKeywordOptimization
            resumeText={resumeText}
            industry={industry}
            onKeywordClick={(keyword) => {
              // Future: Open modal to add keyword to resume
              console.log('Add keyword:', keyword)
            }}
          />
        ) : (
          <div className="relative w-full overflow-hidden rounded-3xl border border-purple-500/20 bg-gray-900/60 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 text-white/60">
              <Target className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-white">ATS Keyword Optimization</h3>
                <p className="text-sm text-white/50">Resume text not available. Complete an analysis to see keyword coverage.</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION E: Section Feedback (Full Width - Position #5) */}
      {data.section_feedback && data.section_feedback.length > 0 && (
        <motion.div variants={item}>
          <SectionFeedback
            sections={data.section_feedback}
            onSectionClick={(section) => {
              // Future: Scroll to that section in the resume editor
              console.log('Section clicked:', section.section)
            }}
          />
        </motion.div>
      )}

      {/* ============================================
          SECTION B: BODY - What to Fix
          ============================================ */}

      {/* ATS Health Check - Combines ats_health_check, ats_warnings, and formatting_issues */}
      {(data.ats_health_check || (data.ats_warnings && data.ats_warnings.length > 0) || (data.formatting_issues && data.formatting_issues.length > 0) || (data.ats_good_practices && data.ats_good_practices.length > 0)) && (
        <motion.div variants={item}>
          <ATSHealthCheck
            atsScore={data.ats_score}
            healthSummary={data.ats_health_check}
            warnings={data.ats_warnings}
            formattingIssues={data.formatting_issues}
            goodPractices={data.ats_good_practices}
          />
        </motion.div>
      )}

      {/* Bullet Improvements - Impact Improvements with Copy/Apply */}
      {data.bullet_improvements && data.bullet_improvements.length > 0 && (
        <motion.div variants={item}>
          <BulletImprovements
            improvements={data.bullet_improvements}
            onApplyImprovement={onApplyBulletImprovement ? (improvement) => {
              onApplyBulletImprovement(improvement)
            } : undefined}
          />
        </motion.div>
      )}

      {/* Bullet Analysis Panel - Real-time bullet quality analysis with AI improvement */}
      {resumeData && (
        <motion.div variants={item}>
          <BulletAnalysisPanel
            resumeData={resumeData}
            onImproveWithAI={onBulletImprovementsApplied ? handleImproveWithAI : undefined}
            isImproving={isImprovingBullets}
          />
        </motion.div>
      )}

      {/* ============================================
          SECTION C: FINAL - Deep Dive & Next Steps
          ============================================ */}

      {/* Skills Profile: Radar Chart + Skills Breakdown */}
      {(data.skills_radar_data || data.skills_breakdown_coaching) && (
        <motion.div variants={item} className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-white px-1">Skills Profile</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Radar Chart */}
            <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Hard vs Soft Skills Balance
              </h3>
              <div className="flex justify-center">
                <SkillsRadarChart data={data.skills_radar_data} />
              </div>
            </div>

            {/* Skills Breakdown */}
            {data.skills_breakdown_coaching && (
              <div className="bg-gray-900/40 p-6 rounded-2xl border border-white/10">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Skills Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.skills_breakdown_coaching.technical && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Technical</div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-white/70">
                        {formatTextWithBullets(data.skills_breakdown_coaching.technical)}
                      </div>
                    </div>
                  )}
                  {data.skills_breakdown_coaching.tools && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Tools</div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-white/70">
                        {formatTextWithBullets(data.skills_breakdown_coaching.tools)}
                      </div>
                    </div>
                  )}
                  {data.skills_breakdown_coaching.domain && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-green-400">Domain</div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-white/70">
                        {formatTextWithBullets(data.skills_breakdown_coaching.domain)}
                      </div>
                    </div>
                  )}
                  {data.skills_breakdown_coaching.soft_skills && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-pink-400">Soft Skills</div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs text-white/70">
                        {formatTextWithBullets(data.skills_breakdown_coaching.soft_skills)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Roadmap + AI Optimize */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Roadmap */}
        {roadmap.pointsNeeded > 0 && roadmap.currentScore < 90 && (
          <motion.div variants={item} className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gray-900/40 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="p-6 relative z-10 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Roadmap</h3>
                    <p className="text-sm text-white/50">Next level: {roadmap.nextTier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
                    {roadmap.pointsNeeded}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Points Needed</div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-medium text-white/60 mb-2">
                  <span>{roadmap.currentTier}</span>
                  <span className="text-purple-300">Goal: {roadmap.targetScore}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                    style={{ width: `${(roadmap.currentScore / roadmap.targetScore) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-auto">
                <div className="space-y-2">
                  {roadmap.steps.map((step, index) => {
                    const isExpanded = expandedRoadmapStep === index
                    const hasDetails = step.details && step.details.length > 0

                    return (
                      <div key={index}>
                        <button
                          onClick={() => hasDetails && setExpandedRoadmapStep(isExpanded ? null : index)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-left transition-all ${hasDetails ? 'hover:bg-white/10 cursor-pointer' : ''}`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${step.completed
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'border-white/20 text-transparent'
                            }`}>
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <span className="text-sm text-white/70 flex-1">{step.text}</span>
                          {hasDetails && (
                            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          )}
                        </button>
                        {isExpanded && step.details && (
                          <div className="mt-1 ml-8 p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                            <ul className="space-y-1">
                              {step.details.map((detail, i) => (
                                <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                                  <span className="text-purple-400">→</span>
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Optimize Button */}
        {onOptimizeResume && (
          <motion.div variants={item}>
            <button
              onClick={onOptimizeResume}
              disabled={isOptimizing}
              className="w-full h-full group relative overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900 rounded-2xl px-6 py-5 flex items-center justify-between transition-all group-hover:bg-gray-900/90 h-full">
                <div className="flex items-center gap-5">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    {isOptimizing ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-100 transition-colors">
                      {isOptimizing ? 'Optimizing Resume...' : 'AI Optimize Resume'}
                    </h3>
                    <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                      Auto-fix formatting, keywords, and impact.
                    </p>
                  </div>
                </div>
                {!isOptimizing && (
                  <div className="flex items-center text-purple-300 group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                )}
              </div>
            </button>
          </motion.div>
        )}
      </div>

      {/* Coach's Summary - Final comprehensive summary */}
      {data.coaching_summary && (
        <motion.div variants={item}>
          <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💼</span>
              <h3 className="font-bold text-white">Coach's Summary</h3>
            </div>
            {renderCoachingText(data.coaching_summary)}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
