// components/resume/editor/sections/LanguagesEditor.tsx
// Languages section with granular toggles

'use client'

import React, { useState } from 'react'
import { Languages, Check, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageEntry } from '@/lib/types/resume'
import { AddItemButton } from '../components'
import { createLanguageEntry } from '@/lib/utils/dataMigration'

interface LanguagesEditorProps {
  languages: LanguageEntry[]
  onChange: (languages: LanguageEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

const FLUENCY_OPTIONS = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic',
]

export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({
  languages,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newLanguage, setNewLanguage] = useState('')
  const [newFluency, setNewFluency] = useState('Fluent')

  const updateLanguage = (id: string, updates: Partial<LanguageEntry>) => {
    onChange(languages.map(lang =>
      lang.id === id ? { ...lang, ...updates } : lang
    ))
  }

  const addLanguage = () => {
    if (!newLanguage.trim()) return
    const newEntry = createLanguageEntry(languages.length)
    newEntry.language = newLanguage.trim()
    newEntry.fluency = newFluency
    onChange([...languages, newEntry])
    setNewLanguage('')
    setNewFluency('Fluent')
    setIsAdding(false)
  }

  const deleteLanguage = (id: string) => {
    onChange(languages.filter(lang => lang.id !== id))
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
          <Languages className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Languages</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {languages.filter(l => l.enabled).length} of {languages.length}
          </span>
        </div>
      </div>

      {/* Language Entries */}
      <div className={cn('rounded-xl border border-white/10 bg-white/5 p-4', !sectionEnabled && 'opacity-50')}>
        <div className="space-y-2">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 group"
            >
              {/* Toggle */}
              <button
                onClick={() => updateLanguage(lang.id, { enabled: !lang.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  lang.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {lang.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              {/* Language Name */}
              <input
                type="text"
                value={lang.language}
                onChange={(e) => updateLanguage(lang.id, { language: e.target.value })}
                className={cn(
                  'flex-1 bg-transparent text-white focus:outline-none',
                  !lang.enabled && 'opacity-50'
                )}
                placeholder="Language"
              />

              {/* Fluency Toggle */}
              <button
                onClick={() => updateLanguage(lang.id, { fluencyEnabled: !lang.fluencyEnabled })}
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  lang.fluencyEnabled !== false
                    ? 'bg-purple-500/50 border-purple-500/50'
                    : 'border-white/20 bg-transparent'
                )}
              >
                {lang.fluencyEnabled !== false && <Check className="w-2.5 h-2.5 text-white" />}
              </button>

              {/* Fluency Select */}
              <select
                value={lang.fluency || 'Fluent'}
                onChange={(e) => updateLanguage(lang.id, { fluency: e.target.value })}
                className={cn(
                  'bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500',
                  (!lang.enabled || lang.fluencyEnabled === false) && 'opacity-50'
                )}
              >
                {FLUENCY_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-gray-900">
                    {opt}
                  </option>
                ))}
              </select>

              {/* Delete */}
              <button
                onClick={() => deleteLanguage(lang.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add New Language */}
          {isAdding ? (
            <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5">
              <div className="w-5 h-5 rounded border-2 border-white/30 bg-white/5" />
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addLanguage()
                  if (e.key === 'Escape') {
                    setNewLanguage('')
                    setIsAdding(false)
                  }
                }}
                autoFocus
                placeholder="Language name"
                className="flex-1 bg-transparent text-white focus:outline-none"
              />
              <select
                value={newFluency}
                onChange={(e) => setNewFluency(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none"
              >
                {FLUENCY_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-gray-900">
                    {opt}
                  </option>
                ))}
              </select>
              <button
                onClick={addLanguage}
                className="px-3 py-1 rounded bg-purple-500 text-white text-sm hover:bg-purple-600 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setNewLanguage(''); setIsAdding(false) }}
                className="px-3 py-1 rounded bg-white/10 text-white/60 text-sm hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-white/20 text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Language
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
