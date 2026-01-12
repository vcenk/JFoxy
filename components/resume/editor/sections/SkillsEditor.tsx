// components/resume/editor/sections/SkillsEditor.tsx
// Skills section with tag-style editing and category toggles

'use client'

import React, { useState } from 'react'
import { Wrench, Check, X, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkillsData, SkillCategory } from '@/lib/types/resume'
import { createSkillEntry } from '@/lib/utils/dataMigration'

interface SkillsEditorProps {
  skills: SkillsData
  onChange: (skills: SkillsData) => void
  onSuggestSkills?: () => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

interface SkillTagProps {
  skill: SkillCategory
  onToggle: () => void
  onRemove: () => void
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, onToggle, onRemove }) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all',
        skill.enabled
          ? 'bg-purple-500/20 border-purple-500/50 text-white'
          : 'bg-white/5 border-white/20 text-white/50'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
          skill.enabled
            ? 'bg-purple-500 border-purple-500'
            : 'border-white/30 bg-transparent'
        )}
      >
        {skill.enabled && <Check className="w-2.5 h-2.5 text-white" />}
      </button>
      <span className="text-sm">{skill.name}</span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/20 transition-all"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}

interface SkillCategoryEditorProps {
  title: string
  skills: SkillCategory[]
  onChange: (skills: SkillCategory[]) => void
  categoryKey: 'technical' | 'soft' | 'other'
}

const SkillCategoryEditor: React.FC<SkillCategoryEditorProps> = ({
  title,
  skills,
  onChange,
  categoryKey,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const toggleSkill = (id: string) => {
    onChange(skills.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ))
  }

  const removeSkill = (id: string) => {
    onChange(skills.filter(s => s.id !== id))
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    const entry = createSkillEntry(categoryKey, newSkill.trim())
    onChange([...skills, entry])
    setNewSkill('')
    setIsAdding(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
    if (e.key === 'Escape') {
      setNewSkill('')
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">{title}</span>
        <span className="text-xs text-white/40">
          {skills.filter(s => s.enabled).length} of {skills.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <SkillTag
            key={skill.id}
            skill={skill}
            onToggle={() => toggleSkill(skill.id)}
            onRemove={() => removeSkill(skill.id)}
          />
        ))}

        {isAdding ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (newSkill.trim()) addSkill()
                else setIsAdding(false)
              }}
              autoFocus
              placeholder="Type skill..."
              className="w-32 px-2 py-1 bg-white/10 border border-purple-500/50 rounded-full text-sm text-white focus:outline-none"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-white/30 text-sm text-white/50 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>
    </div>
  )
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  onChange,
  onSuggestSkills,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const updateCategory = (category: 'technical' | 'soft' | 'other', updated: SkillCategory[]) => {
    onChange({ ...skills, [category]: updated })
  }

  // Count total enabled skills
  const totalEnabled =
    (skills.technical?.filter(s => s.enabled).length || 0) +
    (skills.soft?.filter(s => s.enabled).length || 0) +
    (skills.other?.filter(s => s.enabled).length || 0)

  const totalSkills =
    (skills.technical?.length || 0) +
    (skills.soft?.length || 0) +
    (skills.other?.length || 0)

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onSectionEnabledChange && (
            <button
              onClick={() => onSectionEnabledChange(!sectionEnabled)}
              className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                sectionEnabled
                  ? 'bg-purple-500 border-purple-500'
                  : 'border-white/30 bg-white/5'
              )}
            >
              {sectionEnabled && <Check className="w-3 h-3 text-white" />}
            </button>
          )}
          <Wrench className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Skills</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {totalEnabled} of {totalSkills}
          </span>
        </div>

        {onSuggestSkills && (
          <button
            onClick={onSuggestSkills}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            Suggest Skills
          </button>
        )}
      </div>

      {/* Skill Categories */}
      <div className={cn('space-y-6', !sectionEnabled && 'opacity-50')}>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <SkillCategoryEditor
            title="Technical Skills"
            skills={skills.technical || []}
            onChange={(updated) => updateCategory('technical', updated)}
            categoryKey="technical"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <SkillCategoryEditor
            title="Soft Skills"
            skills={skills.soft || []}
            onChange={(updated) => updateCategory('soft', updated)}
            categoryKey="soft"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <SkillCategoryEditor
            title="Other Skills"
            skills={skills.other || []}
            onChange={(updated) => updateCategory('other', updated)}
            categoryKey="other"
          />
        </div>
      </div>
    </div>
  )
}
