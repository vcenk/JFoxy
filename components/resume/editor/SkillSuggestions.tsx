// components/resume/editor/SkillSuggestions.tsx
// Suggest relevant skills based on industry and current skills

'use client'

import { useMemo, useState } from 'react'
import {
  getAllKeywords,
  getATSKeywordsByIndustry,
  getAvailableIndustries,
} from '@/lib/data/atsKeywords'
import { Plus, Sparkles, Check, ChevronDown, Target, Zap, Award } from 'lucide-react'

interface SkillSuggestionsProps {
  currentSkills: string[]
  industry?: string
  onAddSkill: (skill: string) => void
  maxSuggestions?: number
}

export function SkillSuggestions({
  currentSkills,
  industry,
  onAddSkill,
  maxSuggestions = 15,
}: SkillSuggestionsProps) {
  const [selectedIndustry, setSelectedIndustry] = useState(industry || '')
  const [showAll, setShowAll] = useState(false)
  const [addedSkills, setAddedSkills] = useState<string[]>([])

  const industries = useMemo(() => getAvailableIndustries(), [])

  const keywordSet = useMemo(() => {
    if (!selectedIndustry) return null
    return getATSKeywordsByIndustry(selectedIndustry)
  }, [selectedIndustry])

  const suggestions = useMemo(() => {
    if (!keywordSet) return { mustHave: [], technical: [], soft: [], certifications: [] }

    const normalizedCurrentSkills = currentSkills.map((s) => s.toLowerCase().trim())

    const filterNotInCurrent = (keywords: string[]) =>
      keywords.filter(
        (kw) => !normalizedCurrentSkills.some(
          (cs) => cs.includes(kw.toLowerCase()) || kw.toLowerCase().includes(cs)
        )
      )

    return {
      mustHave: filterNotInCurrent(keywordSet.mustHave).slice(0, 8),
      technical: filterNotInCurrent(keywordSet.technical).slice(0, 10),
      soft: filterNotInCurrent(keywordSet.soft).slice(0, 6),
      certifications: filterNotInCurrent(keywordSet.certifications || []).slice(0, 5),
    }
  }, [keywordSet, currentSkills])

  const handleAddSkill = (skill: string) => {
    onAddSkill(skill)
    setAddedSkills((prev) => [...prev, skill])
    // Remove from added after animation
    setTimeout(() => {
      setAddedSkills((prev) => prev.filter((s) => s !== skill))
    }, 1500)
  }

  const formatIndustryName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  const totalSuggestions =
    suggestions.mustHave.length +
    suggestions.technical.length +
    suggestions.soft.length +
    suggestions.certifications.length

  if (!selectedIndustry) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="font-medium text-white">Skill Suggestions</span>
        </div>
        <p className="text-sm text-white/60 mb-3">
          Select your industry to get personalized skill suggestions that will help your resume pass ATS systems.
        </p>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
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
    )
  }

  return (
    <div className="space-y-4">
      {/* Industry Selector */}
      <div className="flex items-center gap-2">
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {formatIndustryName(ind)}
            </option>
          ))}
        </select>
        <div className="px-3 py-2 bg-blue-500/20 rounded-lg text-sm text-blue-300">
          {totalSuggestions} suggestions
        </div>
      </div>

      {/* Must-Have Skills */}
      {suggestions.mustHave.length > 0 && (
        <SuggestionCategory
          title="Must-Have Keywords"
          subtitle="Critical for ATS ranking"
          icon={<Target className="w-4 h-4 text-red-400" />}
          skills={suggestions.mustHave}
          onAddSkill={handleAddSkill}
          addedSkills={addedSkills}
          badgeColor="bg-red-500/20 text-red-300"
        />
      )}

      {/* Technical Skills */}
      {suggestions.technical.length > 0 && (
        <SuggestionCategory
          title="Technical Skills"
          subtitle="Industry-specific hard skills"
          icon={<Zap className="w-4 h-4 text-blue-400" />}
          skills={showAll ? suggestions.technical : suggestions.technical.slice(0, 6)}
          onAddSkill={handleAddSkill}
          addedSkills={addedSkills}
          badgeColor="bg-blue-500/20 text-blue-300"
        />
      )}

      {/* Soft Skills */}
      {suggestions.soft.length > 0 && (
        <SuggestionCategory
          title="Soft Skills"
          subtitle="Valued by recruiters"
          icon={<Sparkles className="w-4 h-4 text-purple-400" />}
          skills={suggestions.soft}
          onAddSkill={handleAddSkill}
          addedSkills={addedSkills}
          badgeColor="bg-purple-500/20 text-purple-300"
        />
      )}

      {/* Certifications */}
      {suggestions.certifications.length > 0 && (
        <SuggestionCategory
          title="Certifications"
          subtitle="Boost your credibility"
          icon={<Award className="w-4 h-4 text-green-400" />}
          skills={suggestions.certifications}
          onAddSkill={handleAddSkill}
          addedSkills={addedSkills}
          badgeColor="bg-green-500/20 text-green-300"
        />
      )}

      {/* Show More Button */}
      {suggestions.technical.length > 6 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 transition-colors"
        >
          Show more suggestions
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {totalSuggestions === 0 && (
        <div className="text-center py-4 text-white/50 text-sm">
          <Check className="w-8 h-8 mx-auto mb-2 text-green-400" />
          Great job! Your skills cover the key keywords for {formatIndustryName(selectedIndustry)}.
        </div>
      )}
    </div>
  )
}

interface SuggestionCategoryProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  skills: string[]
  onAddSkill: (skill: string) => void
  addedSkills: string[]
  badgeColor: string
}

function SuggestionCategory({
  title,
  subtitle,
  icon,
  skills,
  onAddSkill,
  addedSkills,
  badgeColor,
}: SuggestionCategoryProps) {
  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-[10px] text-white/50">{subtitle}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const isAdded = addedSkills.includes(skill)
          return (
            <button
              key={skill}
              onClick={() => !isAdded && onAddSkill(skill)}
              disabled={isAdded}
              className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500/30 text-green-300 scale-95'
                  : `${badgeColor} hover:scale-105 hover:brightness-125`
              }`}
            >
              {isAdded ? (
                <Check className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              {skill}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact version for inline use in skills form
 */
interface CompactSkillSuggestionsProps {
  currentSkills: string[]
  industry: string
  onAddSkill: (skill: string) => void
}

export function CompactSkillSuggestions({
  currentSkills,
  industry,
  onAddSkill,
}: CompactSkillSuggestionsProps) {
  const [addedSkills, setAddedSkills] = useState<string[]>([])

  const keywordSet = useMemo(() => {
    if (!industry) return null
    return getATSKeywordsByIndustry(industry)
  }, [industry])

  const suggestions = useMemo(() => {
    if (!keywordSet) return []

    const normalizedCurrentSkills = currentSkills.map((s) => s.toLowerCase().trim())
    const allKeywords = [
      ...keywordSet.mustHave,
      ...keywordSet.technical.slice(0, 5),
    ]

    return allKeywords
      .filter(
        (kw) =>
          !normalizedCurrentSkills.some(
            (cs) => cs.includes(kw.toLowerCase()) || kw.toLowerCase().includes(cs)
          )
      )
      .slice(0, 8)
  }, [keywordSet, currentSkills])

  const handleAddSkill = (skill: string) => {
    onAddSkill(skill)
    setAddedSkills((prev) => [...prev, skill])
    setTimeout(() => {
      setAddedSkills((prev) => prev.filter((s) => s !== skill))
    }, 1500)
  }

  if (suggestions.length === 0 || !industry) return null

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-3 h-3 text-yellow-400" />
        <span className="text-xs text-white/60">Suggested for ATS</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((skill) => {
          const isAdded = addedSkills.includes(skill)
          return (
            <button
              key={skill}
              onClick={() => !isAdded && handleAddSkill(skill)}
              disabled={isAdded}
              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
                isAdded
                  ? 'bg-green-500/30 text-green-300'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              {isAdded ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
              {skill}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SkillSuggestions
