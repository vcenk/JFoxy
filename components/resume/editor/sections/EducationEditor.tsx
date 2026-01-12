// components/resume/editor/sections/EducationEditor.tsx
// Education section with granular toggles for entries and fields

'use client'

import React, { useState } from 'react'
import { GraduationCap, ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EducationEntry } from '@/lib/types/resume'
import { FieldRow, AddItemButton } from '../components'
import { createEducationEntry } from '@/lib/utils/dataMigration'

interface EducationEditorProps {
  education: EducationEntry[]
  onChange: (education: EducationEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
  education,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(education.map(e => e.id))
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

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    onChange(education.map(edu =>
      edu.id === id ? { ...edu, ...updates } : edu
    ))
  }

  const addEducation = () => {
    const newEdu = createEducationEntry(education.length)
    onChange([...education, newEdu])
    setExpandedIds(new Set([...Array.from(expandedIds), newEdu.id]))
  }

  const deleteEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id))
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
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {education.filter(e => e.enabled).length} of {education.length}
          </span>
        </div>
      </div>

      {/* Education Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              {/* Entry Toggle */}
              <button
                onClick={() => updateEducation(edu.id, { enabled: !edu.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  edu.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {edu.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Expand/Collapse */}
              <button
                onClick={() => toggleExpanded(edu.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(edu.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!edu.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {edu.institution || 'New Institution'}
                  </div>
                  <div className="text-sm text-white/60">
                    {edu.degree || 'Degree'}{edu.field ? ` in ${edu.field}` : ''} {edu.graduationDate && `• ${edu.graduationDate}`}
                  </div>
                </div>
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteEducation(edu.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(edu.id) && (
              <div className={cn('px-4 pb-4 space-y-1 pt-2', !edu.enabled && 'opacity-50')}>
                <FieldRow
                  label="Institution"
                  value={edu.institution}
                  enabled={edu.institutionEnabled !== false}
                  onValueChange={(v) => updateEducation(edu.id, { institution: v })}
                  onEnabledChange={(e) => updateEducation(edu.id, { institutionEnabled: e })}
                  placeholder="University or school name"
                />
                <FieldRow
                  label="Degree"
                  value={edu.degree}
                  enabled={edu.degreeEnabled !== false}
                  onValueChange={(v) => updateEducation(edu.id, { degree: v })}
                  onEnabledChange={(e) => updateEducation(edu.id, { degreeEnabled: e })}
                  placeholder="Bachelor's, Master's, etc."
                />
                <FieldRow
                  label="Field"
                  value={edu.field || ''}
                  enabled={edu.fieldEnabled !== false}
                  onValueChange={(v) => updateEducation(edu.id, { field: v })}
                  onEnabledChange={(e) => updateEducation(edu.id, { fieldEnabled: e })}
                  placeholder="Field of study"
                />
                <FieldRow
                  label="Graduation"
                  value={edu.graduationDate || ''}
                  enabled={edu.dateEnabled !== false}
                  onValueChange={(v) => updateEducation(edu.id, { graduationDate: v })}
                  onEnabledChange={(e) => updateEducation(edu.id, { dateEnabled: e })}
                  placeholder="Month Year or Year"
                />
                <FieldRow
                  label="GPA"
                  value={edu.gpa || ''}
                  enabled={edu.gpaEnabled !== false}
                  onValueChange={(v) => updateEducation(edu.id, { gpa: v })}
                  onEnabledChange={(e) => updateEducation(edu.id, { gpaEnabled: e })}
                  placeholder="3.8/4.0"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Education Button */}
      <AddItemButton
        label="Add Education"
        onClick={addEducation}
      />
    </div>
  )
}
