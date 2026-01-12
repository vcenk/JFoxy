// components/resume/editor/sections/VolunteerEditor.tsx
// Volunteer section with granular toggles

'use client'

import React, { useState } from 'react'
import { Heart, ChevronDown, ChevronRight, Check, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VolunteerEntry, BulletItem as BulletItemType } from '@/lib/types/resume'
import { FieldRow, AddItemButton, BulletItem } from '../components'
import { createVolunteerEntry, createBulletItem } from '@/lib/utils/dataMigration'

interface VolunteerEditorProps {
  volunteer: VolunteerEntry[]
  onChange: (volunteer: VolunteerEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const VolunteerEditor: React.FC<VolunteerEditorProps> = ({
  volunteer,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(volunteer.map(v => v.id))
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

  const updateVolunteer = (id: string, updates: Partial<VolunteerEntry>) => {
    onChange(volunteer.map(vol =>
      vol.id === id ? { ...vol, ...updates } : vol
    ))
  }

  const updateBullet = (volId: string, bulletId: string, updates: Partial<BulletItemType>) => {
    onChange(volunteer.map(vol => {
      if (vol.id !== volId) return vol
      return {
        ...vol,
        bullets: vol.bullets?.map(b =>
          b.id === bulletId ? { ...b, ...updates } : b
        )
      }
    }))
  }

  const addBullet = (volId: string) => {
    onChange(volunteer.map(vol => {
      if (vol.id !== volId) return vol
      return {
        ...vol,
        bullets: [...(vol.bullets || []), createBulletItem(`vol-${volId}`, vol.bullets?.length || 0)]
      }
    }))
  }

  const deleteBullet = (volId: string, bulletId: string) => {
    onChange(volunteer.map(vol => {
      if (vol.id !== volId) return vol
      return {
        ...vol,
        bullets: vol.bullets?.filter(b => b.id !== bulletId)
      }
    }))
  }

  const addVolunteer = () => {
    const newVol = createVolunteerEntry(volunteer.length)
    onChange([...volunteer, newVol])
    setExpandedIds(new Set([...Array.from(expandedIds), newVol.id]))
  }

  const deleteVolunteer = (id: string) => {
    onChange(volunteer.filter(vol => vol.id !== id))
  }

  const formatDateRange = (vol: VolunteerEntry) => {
    const start = vol.startDate || ''
    const end = vol.current ? 'Present' : (vol.endDate || '')
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
          <Heart className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Volunteer Experience</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {volunteer.filter(v => v.enabled).length} of {volunteer.length}
          </span>
        </div>
      </div>

      {/* Volunteer Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {volunteer.map((vol) => (
          <div
            key={vol.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              <button
                onClick={() => updateVolunteer(vol.id, { enabled: !vol.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  vol.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {vol.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              <button
                onClick={() => toggleExpanded(vol.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(vol.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!vol.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {vol.organization || 'New Organization'}
                  </div>
                  <div className="text-sm text-white/60">
                    {vol.role || 'Role'} {formatDateRange(vol) && `• ${formatDateRange(vol)}`}
                  </div>
                </div>
              </button>

              <button
                onClick={() => deleteVolunteer(vol.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(vol.id) && (
              <div className={cn('px-4 pb-4 space-y-4 pt-2', !vol.enabled && 'opacity-50')}>
                {/* Fields */}
                <div className="space-y-1">
                  <FieldRow
                    label="Organization"
                    value={vol.organization}
                    enabled={vol.organizationEnabled !== false}
                    onValueChange={(v) => updateVolunteer(vol.id, { organization: v })}
                    onEnabledChange={(e) => updateVolunteer(vol.id, { organizationEnabled: e })}
                    placeholder="Organization name"
                  />
                  <FieldRow
                    label="Role"
                    value={vol.role}
                    enabled={vol.roleEnabled !== false}
                    onValueChange={(v) => updateVolunteer(vol.id, { role: v })}
                    onEnabledChange={(e) => updateVolunteer(vol.id, { roleEnabled: e })}
                    placeholder="Your role"
                  />

                  {/* Dates Row */}
                  <div className="flex items-center gap-3 py-2">
                    <button
                      onClick={() => updateVolunteer(vol.id, { dateEnabled: !vol.dateEnabled })}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        vol.dateEnabled !== false
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-white/30 bg-white/5'
                      )}
                    >
                      {vol.dateEnabled !== false && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium w-24 text-white/80">Dates</span>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={vol.startDate || ''}
                        onChange={(e) => updateVolunteer(vol.id, { startDate: e.target.value })}
                        placeholder="Start date"
                        className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-white/40">to</span>
                      <input
                        type="text"
                        value={vol.current ? 'Present' : (vol.endDate || '')}
                        onChange={(e) => {
                          if (e.target.value.toLowerCase() === 'present') {
                            updateVolunteer(vol.id, { current: true, endDate: '' })
                          } else {
                            updateVolunteer(vol.id, { current: false, endDate: e.target.value })
                          }
                        }}
                        placeholder="End date"
                        className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-white/60">
                      <input
                        type="checkbox"
                        checked={vol.current || false}
                        onChange={(e) => updateVolunteer(vol.id, { current: e.target.checked })}
                        className="rounded border-white/20"
                      />
                      Current
                    </label>
                  </div>
                </div>

                {/* Bullets */}
                <div className="border-t border-white/10 pt-4">
                  <span className="text-sm font-medium text-white/70 mb-2 block">Description & Achievements</span>
                  <div className="space-y-1">
                    {vol.bullets?.map((bullet) => (
                      <BulletItem
                        key={bullet.id}
                        bullet={bullet}
                        onToggle={(enabled) => updateBullet(vol.id, bullet.id, { enabled })}
                        onEdit={(content) => updateBullet(vol.id, bullet.id, { content })}
                        onDelete={() => deleteBullet(vol.id, bullet.id)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => addBullet(vol.id)}
                    className="w-full mt-2 flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-white/20 text-sm text-white/60 hover:bg-white/5 transition-colors"
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

      {/* Add Volunteer Button */}
      <AddItemButton
        label="Add Volunteer Experience"
        onClick={addVolunteer}
      />
    </div>
  )
}
