// components/resume/editor/sections/PublicationsEditor.tsx
// Publications section with granular toggles

'use client'

import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PublicationEntry } from '@/lib/types/resume'
import { FieldRow, AddItemButton } from '../components'
import { createPublicationEntry } from '@/lib/utils/dataMigration'

interface PublicationsEditorProps {
  publications: PublicationEntry[]
  onChange: (publications: PublicationEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const PublicationsEditor: React.FC<PublicationsEditorProps> = ({
  publications,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(publications.map(p => p.id))
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

  const updatePublication = (id: string, updates: Partial<PublicationEntry>) => {
    onChange(publications.map(pub =>
      pub.id === id ? { ...pub, ...updates } : pub
    ))
  }

  const addPublication = () => {
    const newPub = createPublicationEntry(publications.length)
    onChange([...publications, newPub])
    setExpandedIds(new Set([...Array.from(expandedIds), newPub.id]))
  }

  const deletePublication = (id: string) => {
    onChange(publications.filter(pub => pub.id !== id))
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
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Publications</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {publications.filter(p => p.enabled).length} of {publications.length}
          </span>
        </div>
      </div>

      {/* Publication Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {publications.map((pub) => (
          <div
            key={pub.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              <button
                onClick={() => updatePublication(pub.id, { enabled: !pub.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  pub.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {pub.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              <button
                onClick={() => toggleExpanded(pub.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(pub.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!pub.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {pub.title || 'New Publication'}
                  </div>
                  <div className="text-sm text-white/60">
                    {pub.publisher} {pub.date && `• ${pub.date}`}
                  </div>
                </div>
              </button>

              <button
                onClick={() => deletePublication(pub.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(pub.id) && (
              <div className={cn('px-4 pb-4 space-y-1 pt-2', !pub.enabled && 'opacity-50')}>
                <FieldRow
                  label="Title"
                  value={pub.title}
                  enabled={pub.titleEnabled !== false}
                  onValueChange={(v) => updatePublication(pub.id, { title: v })}
                  onEnabledChange={(e) => updatePublication(pub.id, { titleEnabled: e })}
                  placeholder="Publication title"
                />
                <FieldRow
                  label="Publisher"
                  value={pub.publisher || ''}
                  enabled={pub.publisherEnabled !== false}
                  onValueChange={(v) => updatePublication(pub.id, { publisher: v })}
                  onEnabledChange={(e) => updatePublication(pub.id, { publisherEnabled: e })}
                  placeholder="Publisher or journal"
                />
                <FieldRow
                  label="Date"
                  value={pub.date || ''}
                  enabled={pub.dateEnabled !== false}
                  onValueChange={(v) => updatePublication(pub.id, { date: v })}
                  onEnabledChange={(e) => updatePublication(pub.id, { dateEnabled: e })}
                  placeholder="Month Year"
                />
                <FieldRow
                  label="Link"
                  value={pub.link || ''}
                  enabled={pub.linkEnabled !== false}
                  onValueChange={(v) => updatePublication(pub.id, { link: v })}
                  onEnabledChange={(e) => updatePublication(pub.id, { linkEnabled: e })}
                  placeholder="https://..."
                  type="url"
                />

                {/* Description */}
                <div className="flex items-start gap-3 py-2">
                  <button
                    onClick={() => updatePublication(pub.id, { descriptionEnabled: !pub.descriptionEnabled })}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5',
                      pub.descriptionEnabled !== false
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-white/30 bg-white/5'
                    )}
                  >
                    {pub.descriptionEnabled !== false && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-white/80 block mb-1">Description</span>
                    <textarea
                      value={pub.description || ''}
                      onChange={(e) => updatePublication(pub.id, { description: e.target.value })}
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

      {/* Add Publication Button */}
      <AddItemButton
        label="Add Publication"
        onClick={addPublication}
      />
    </div>
  )
}
