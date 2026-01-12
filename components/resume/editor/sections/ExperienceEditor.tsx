// components/resume/editor/sections/ExperienceEditor.tsx
// Experience section with granular toggles for entries, fields, and bullets

'use client'

import React, { useState } from 'react'
import { Briefcase, ChevronDown, ChevronRight, Check, Trash2, GripVertical, Sparkles, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ExperienceEntry, BulletItem as BulletItemType, RichText } from '@/lib/types/resume'
import { BulletItem, FieldRow, AddItemButton, InlineEditor } from '../components'
import { createExperienceEntry, createBulletItem } from '@/lib/utils/dataMigration'

interface ExperienceEditorProps {
  experiences: ExperienceEntry[]
  onChange: (experiences: ExperienceEntry[]) => void
  onGenerateBullets?: (experienceId: string) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences,
  onChange,
  onGenerateBullets,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(experiences.map(e => e.id))
  )

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const updateExperience = (id: string, updates: Partial<ExperienceEntry>) => {
    onChange(experiences.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    ))
  }

  const updateBullet = (expId: string, bulletId: string, updates: Partial<BulletItemType>) => {
    onChange(experiences.map(exp => {
      if (exp.id !== expId) return exp
      return {
        ...exp,
        bullets: exp.bullets.map(b =>
          b.id === bulletId ? { ...b, ...updates } : b
        )
      }
    }))
  }

  const addBullet = (expId: string) => {
    onChange(experiences.map(exp => {
      if (exp.id !== expId) return exp
      return {
        ...exp,
        bullets: [...exp.bullets, createBulletItem(`exp-${expId}`, exp.bullets.length)]
      }
    }))
  }

  const deleteBullet = (expId: string, bulletId: string) => {
    onChange(experiences.map(exp => {
      if (exp.id !== expId) return exp
      return {
        ...exp,
        bullets: exp.bullets.filter(b => b.id !== bulletId)
      }
    }))
  }

  const addExperience = () => {
    const newExp = createExperienceEntry(experiences.length)
    onChange([...experiences, newExp])
    setExpandedIds(new Set([...Array.from(expandedIds), newExp.id]))
  }

  const deleteExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id))
  }

  const formatDateRange = (exp: ExperienceEntry) => {
    const start = exp.startDate || ''
    const end = exp.current ? 'Present' : (exp.endDate || '')
    if (!start && !end) return ''
    return `${start}${start && end ? ' - ' : ''}${end}`
  }

  return (
    <div className="space-y-3">
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
          <Briefcase className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Work Experience</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {experiences.filter(e => e.enabled).length} of {experiences.length}
          </span>
        </div>
      </div>

      {/* Experience Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              {/* Entry Toggle */}
              <button
                onClick={() => updateExperience(exp.id, { enabled: !exp.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  exp.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {exp.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Expand/Collapse */}
              <button
                onClick={() => toggleExpanded(exp.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(exp.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!exp.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {exp.company || 'New Company'}
                  </div>
                  <div className="text-sm text-white/60">
                    {exp.position || 'Position'} {formatDateRange(exp) && `• ${formatDateRange(exp)}`}
                  </div>
                </div>
              </button>

              {/* Bullet Count */}
              <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/50">
                {exp.bullets.filter(b => b.enabled).length} bullets
              </span>

              {/* Delete Button */}
              <button
                onClick={() => deleteExperience(exp.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(exp.id) && (
              <div className={cn('px-4 pb-4 space-y-4', !exp.enabled && 'opacity-50')}>
                {/* Fields */}
                <div className="space-y-1 pt-2">
                  <FieldRow
                    label="Company"
                    value={exp.company}
                    enabled={exp.companyEnabled !== false}
                    onValueChange={(v) => updateExperience(exp.id, { company: v })}
                    onEnabledChange={(e) => updateExperience(exp.id, { companyEnabled: e })}
                    placeholder="Company name"
                  />
                  <FieldRow
                    label="Position"
                    value={exp.position}
                    enabled={exp.positionEnabled !== false}
                    onValueChange={(v) => updateExperience(exp.id, { position: v })}
                    onEnabledChange={(e) => updateExperience(exp.id, { positionEnabled: e })}
                    placeholder="Job title"
                  />
                  <FieldRow
                    label="Location"
                    value={exp.location || ''}
                    enabled={exp.locationEnabled !== false}
                    onValueChange={(v) => updateExperience(exp.id, { location: v })}
                    onEnabledChange={(e) => updateExperience(exp.id, { locationEnabled: e })}
                    placeholder="City, State"
                  />

                  {/* Dates Row */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      onClick={() => updateExperience(exp.id, { dateEnabled: !exp.dateEnabled })}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        exp.dateEnabled !== false
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-white/30 bg-white/5'
                      )}
                    >
                      {exp.dateEnabled !== false && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium w-24 text-white/80">Dates</span>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="Start date"
                        className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-white/40">to</span>
                      <input
                        type="text"
                        value={exp.current ? 'Present' : (exp.endDate || '')}
                        onChange={(e) => {
                          if (e.target.value.toLowerCase() === 'present') {
                            updateExperience(exp.id, { current: true, endDate: '' })
                          } else {
                            updateExperience(exp.id, { current: false, endDate: e.target.value })
                          }
                        }}
                        placeholder="End date"
                        className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/60">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                        className="rounded border-white/20"
                      />
                      Current
                    </label>
                  </div>
                </div>

                {/* Bullets */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">Achievements & Responsibilities</span>
                    {onGenerateBullets && (
                      <button
                        onClick={() => onGenerateBullets(exp.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-amber-400 hover:bg-amber-500/20 transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate with AI
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {exp.bullets.map((bullet) => (
                      <BulletItem
                        key={bullet.id}
                        bullet={bullet}
                        onToggle={(enabled) => updateBullet(exp.id, bullet.id, { enabled })}
                        onEdit={(content) => updateBullet(exp.id, bullet.id, { content })}
                        onDelete={() => deleteBullet(exp.id, bullet.id)}
                        onOptimize={() => {/* TODO: Implement AI optimization */}}
                        onQuantify={() => {/* TODO: Implement AI quantify */}}
                        onShorten={() => {/* TODO: Implement AI shorten */}}
                        onExpand={() => {/* TODO: Implement AI expand */}}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => addBullet(exp.id)}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-white/20 text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Bullet
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Experience Button */}
      <AddItemButton
        label="Add Work Experience"
        onClick={addExperience}
      />
    </div>
  )
}
