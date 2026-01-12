// components/resume/analysis/KeywordCoveragePanel.tsx
// Display keyword coverage analysis for a resume against an industry

'use client'

import { useMemo, useState } from 'react'
import {
  checkKeywordCoverage,
  getAvailableIndustries,
  getATSKeywordsByIndustry,
  ATSKeywordSet,
} from '@/lib/data/atsKeywords'
import {
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react'

interface KeywordCoveragePanelProps {
  resumeText: string
  industry?: string
  onIndustryChange?: (industry: string) => void
}

export function KeywordCoveragePanel({
  resumeText,
  industry,
  onIndustryChange,
}: KeywordCoveragePanelProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(industry || '')
  const [expandedSection, setExpandedSection] = useState<string | null>('mustHave')
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null)

  const industries = useMemo(() => getAvailableIndustries(), [])

  const coverage = useMemo(() => {
    if (!selectedIndustry) return null
    return checkKeywordCoverage(resumeText, selectedIndustry)
  }, [resumeText, selectedIndustry])

  const keywordSet = useMemo(() => {
    if (!selectedIndustry) return null
    return getATSKeywordsByIndustry(selectedIndustry)
  }, [selectedIndustry])

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry)
    onIndustryChange?.(industry)
  }

  const copyKeyword = async (keyword: string) => {
    await navigator.clipboard.writeText(keyword)
    setCopiedKeyword(keyword)
    setTimeout(() => setCopiedKeyword(null), 2000)
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 70) return 'text-green-400'
    if (coverage >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getCoverageBarColor = (coverage: number) => {
    if (coverage >= 70) return 'bg-green-500'
    if (coverage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatIndustryName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  return (
    <div className="space-y-4">
      {/* Industry Selector */}
      <div>
        <label className="block text-xs font-medium text-white/70 mb-2">
          Select Industry for Keyword Analysis
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => handleIndustryChange(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="">Choose an industry...</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {formatIndustryName(ind)}
            </option>
          ))}
        </select>
      </div>

      {/* Coverage Overview */}
      {coverage && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="font-medium text-white">Keyword Coverage</span>
            </div>
            <span className={`text-2xl font-bold ${getCoverageColor(coverage.coverage)}`}>
              {coverage.coverage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 ${getCoverageBarColor(coverage.coverage)}`}
              style={{ width: `${coverage.coverage}%` }}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <div className="text-lg font-bold text-green-400">{coverage.matched.length}</div>
              <div className="text-[10px] text-white/50">Matched</div>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg">
              <div className="text-lg font-bold text-red-400">{coverage.missing.length}</div>
              <div className="text-[10px] text-white/50">Missing</div>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <div className="text-lg font-bold text-yellow-400">{coverage.mustHaveMissing.length}</div>
              <div className="text-[10px] text-white/50">Critical Missing</div>
            </div>
          </div>

          {/* Critical Missing Warning */}
          {coverage.mustHaveMissing.length > 0 && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-2">
                <AlertTriangle className="w-4 h-4" />
                Critical Keywords Missing
              </div>
              <div className="flex flex-wrap gap-2">
                {coverage.mustHaveMissing.slice(0, 8).map((kw) => (
                  <button
                    key={kw}
                    onClick={() => copyKeyword(kw)}
                    className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs text-red-300 flex items-center gap-1 transition-colors"
                  >
                    {kw}
                    {copiedKeyword === kw ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Keyword Categories */}
      {keywordSet && (
        <div className="space-y-2">
          {/* Must Have Keywords */}
          <KeywordSection
            title="Must-Have Keywords"
            icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
            keywords={keywordSet.mustHave}
            matchedKeywords={coverage?.matched || []}
            expanded={expandedSection === 'mustHave'}
            onToggle={() => setExpandedSection(expandedSection === 'mustHave' ? null : 'mustHave')}
            onCopyKeyword={copyKeyword}
            copiedKeyword={copiedKeyword}
            priority="critical"
          />

          {/* Technical Keywords */}
          <KeywordSection
            title="Technical Skills"
            icon={<Sparkles className="w-4 h-4 text-blue-400" />}
            keywords={keywordSet.technical}
            matchedKeywords={coverage?.matched || []}
            expanded={expandedSection === 'technical'}
            onToggle={() => setExpandedSection(expandedSection === 'technical' ? null : 'technical')}
            onCopyKeyword={copyKeyword}
            copiedKeyword={copiedKeyword}
            priority="high"
          />

          {/* Soft Skills */}
          <KeywordSection
            title="Soft Skills"
            icon={<Target className="w-4 h-4 text-purple-400" />}
            keywords={keywordSet.soft}
            matchedKeywords={coverage?.matched || []}
            expanded={expandedSection === 'soft'}
            onToggle={() => setExpandedSection(expandedSection === 'soft' ? null : 'soft')}
            onCopyKeyword={copyKeyword}
            copiedKeyword={copiedKeyword}
            priority="medium"
          />

          {/* Certifications */}
          {keywordSet.certifications && keywordSet.certifications.length > 0 && (
            <KeywordSection
              title="Certifications"
              icon={<CheckCircle className="w-4 h-4 text-green-400" />}
              keywords={keywordSet.certifications}
              matchedKeywords={coverage?.matched || []}
              expanded={expandedSection === 'certifications'}
              onToggle={() => setExpandedSection(expandedSection === 'certifications' ? null : 'certifications')}
              onCopyKeyword={copyKeyword}
              copiedKeyword={copiedKeyword}
              priority="medium"
            />
          )}

          {/* Methodologies */}
          {keywordSet.methodologies && keywordSet.methodologies.length > 0 && (
            <KeywordSection
              title="Methodologies"
              icon={<Target className="w-4 h-4 text-cyan-400" />}
              keywords={keywordSet.methodologies}
              matchedKeywords={coverage?.matched || []}
              expanded={expandedSection === 'methodologies'}
              onToggle={() => setExpandedSection(expandedSection === 'methodologies' ? null : 'methodologies')}
              onCopyKeyword={copyKeyword}
              copiedKeyword={copiedKeyword}
              priority="low"
            />
          )}
        </div>
      )}

      {!selectedIndustry && (
        <div className="text-center py-8 text-white/50">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an industry to see keyword coverage analysis</p>
        </div>
      )}
    </div>
  )
}

interface KeywordSectionProps {
  title: string
  icon: React.ReactNode
  keywords: string[]
  matchedKeywords: string[]
  expanded: boolean
  onToggle: () => void
  onCopyKeyword: (keyword: string) => void
  copiedKeyword: string | null
  priority: 'critical' | 'high' | 'medium' | 'low'
}

function KeywordSection({
  title,
  icon,
  keywords,
  matchedKeywords,
  expanded,
  onToggle,
  onCopyKeyword,
  copiedKeyword,
  priority,
}: KeywordSectionProps) {
  const matchedCount = keywords.filter((kw) =>
    matchedKeywords.some((m) => m.toLowerCase() === kw.toLowerCase())
  ).length

  const matchPercentage = Math.round((matchedCount / keywords.length) * 100)

  return (
    <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-white text-sm">{title}</span>
          <span className="text-xs text-white/50">
            {matchedCount}/{keywords.length} matched
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                matchPercentage >= 70
                  ? 'bg-green-500'
                  : matchPercentage >= 40
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-white/50" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/50" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => {
              const isMatched = matchedKeywords.some(
                (m) => m.toLowerCase() === kw.toLowerCase()
              )
              return (
                <button
                  key={kw}
                  onClick={() => !isMatched && onCopyKeyword(kw)}
                  disabled={isMatched}
                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                    isMatched
                      ? 'bg-green-500/20 text-green-300 cursor-default'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white cursor-pointer'
                  }`}
                >
                  {isMatched ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : copiedKeyword === kw ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-50" />
                  )}
                  {kw}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default KeywordCoveragePanel
