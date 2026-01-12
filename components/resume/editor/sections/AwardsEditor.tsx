// components/resume/editor/sections/AwardsEditor.tsx
// Awards section with granular toggles

'use client'

import React, { useState } from 'react'
import { Trophy, ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AwardEntry } from '@/lib/types/resume'
import { FieldRow, AddItemButton } from '../components'
import { createAwardEntry } from '@/lib/utils/dataMigration'

interface AwardsEditorProps {
  awards: AwardEntry[]
  onChange: (awards: AwardEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const AwardsEditor: React.FC<AwardsEditorProps> = ({
  awards,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(awards.map(a => a.id))
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

  const updateAward = (id: string, updates: Partial<AwardEntry>) => {
    onChange(awards.map(award =>
      award.id === id ? { ...award, ...updates } : award
    ))
  }

  const addAward = () => {
    const newAward = createAwardEntry(awards.length)
    onChange([...awards, newAward])
    setExpandedIds(new Set([...Array.from(expandedIds), newAward.id]))
  }

  const deleteAward = (id: string) => {
    onChange(awards.filter(award => award.id !== id))
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
          <Trophy className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Awards & Honors</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {awards.filter(a => a.enabled).length} of {awards.length}
          </span>
        </div>
      </div>

      {/* Award Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {awards.map((award) => (
          <div
            key={award.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              <button
                onClick={() => updateAward(award.id, { enabled: !award.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  award.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {award.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              <button
                onClick={() => toggleExpanded(award.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(award.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!award.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {award.title || 'New Award'}
                  </div>
                  <div className="text-sm text-white/60">
                    {award.issuer} {award.date && `• ${award.date}`}
                  </div>
                </div>
              </button>

              <button
                onClick={() => deleteAward(award.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(award.id) && (
              <div className={cn('px-4 pb-4 space-y-1 pt-2', !award.enabled && 'opacity-50')}>
                <FieldRow
                  label="Title"
                  value={award.title}
                  enabled={award.titleEnabled !== false}
                  onValueChange={(v) => updateAward(award.id, { title: v })}
                  onEnabledChange={(e) => updateAward(award.id, { titleEnabled: e })}
                  placeholder="Award title"
                />
                <FieldRow
                  label="Issuer"
                  value={award.issuer || ''}
                  enabled={award.issuerEnabled !== false}
                  onValueChange={(v) => updateAward(award.id, { issuer: v })}
                  onEnabledChange={(e) => updateAward(award.id, { issuerEnabled: e })}
                  placeholder="Issuing organization"
                />
                <FieldRow
                  label="Date"
                  value={award.date || ''}
                  enabled={award.dateEnabled !== false}
                  onValueChange={(v) => updateAward(award.id, { date: v })}
                  onEnabledChange={(e) => updateAward(award.id, { dateEnabled: e })}
                  placeholder="Month Year"
                />

                {/* Description */}
                <div className="flex items-start gap-3 py-2">
                  <button
                    onClick={() => updateAward(award.id, { descriptionEnabled: !award.descriptionEnabled })}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5',
                      award.descriptionEnabled !== false
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-white/30 bg-white/5'
                    )}
                  >
                    {award.descriptionEnabled !== false && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-white/80 block mb-1">Description</span>
                    <textarea
                      value={award.description || ''}
                      onChange={(e) => updateAward(award.id, { description: e.target.value })}
                      placeholder="Brief description..."
                      rows={2}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Award Button */}
      <AddItemButton
        label="Add Award"
        onClick={addAward}
      />
    </div>
  )
}
