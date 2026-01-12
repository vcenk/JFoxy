// components/resume/editor/sections/CertificationsEditor.tsx
// Certifications section with granular toggles

'use client'

import React, { useState } from 'react'
import { Award, ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CertificationEntry } from '@/lib/types/resume'
import { FieldRow, AddItemButton } from '../components'
import { createCertificationEntry } from '@/lib/utils/dataMigration'

interface CertificationsEditorProps {
  certifications: CertificationEntry[]
  onChange: (certifications: CertificationEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({
  certifications,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(certifications.map(c => c.id))
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

  const updateCertification = (id: string, updates: Partial<CertificationEntry>) => {
    onChange(certifications.map(cert =>
      cert.id === id ? { ...cert, ...updates } : cert
    ))
  }

  const addCertification = () => {
    const newCert = createCertificationEntry(certifications.length)
    onChange([...certifications, newCert])
    setExpandedIds(new Set([...Array.from(expandedIds), newCert.id]))
  }

  const deleteCertification = (id: string) => {
    onChange(certifications.filter(cert => cert.id !== id))
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
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Certifications</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {certifications.filter(c => c.enabled).length} of {certifications.length}
          </span>
        </div>
      </div>

      {/* Certification Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              <button
                onClick={() => updateCertification(cert.id, { enabled: !cert.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  cert.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {cert.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              <button
                onClick={() => toggleExpanded(cert.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(cert.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!cert.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {cert.name || 'New Certification'}
                  </div>
                  <div className="text-sm text-white/60">
                    {cert.issuer} {cert.date && `• ${cert.date}`}
                  </div>
                </div>
              </button>

              <button
                onClick={() => deleteCertification(cert.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(cert.id) && (
              <div className={cn('px-4 pb-4 space-y-1 pt-2', !cert.enabled && 'opacity-50')}>
                <FieldRow
                  label="Name"
                  value={cert.name}
                  enabled={cert.nameEnabled !== false}
                  onValueChange={(v) => updateCertification(cert.id, { name: v })}
                  onEnabledChange={(e) => updateCertification(cert.id, { nameEnabled: e })}
                  placeholder="Certification name"
                />
                <FieldRow
                  label="Issuer"
                  value={cert.issuer || ''}
                  enabled={cert.issuerEnabled !== false}
                  onValueChange={(v) => updateCertification(cert.id, { issuer: v })}
                  onEnabledChange={(e) => updateCertification(cert.id, { issuerEnabled: e })}
                  placeholder="Issuing organization"
                />
                <FieldRow
                  label="Date"
                  value={cert.date || ''}
                  enabled={cert.dateEnabled !== false}
                  onValueChange={(v) => updateCertification(cert.id, { date: v })}
                  onEnabledChange={(e) => updateCertification(cert.id, { dateEnabled: e })}
                  placeholder="Month Year"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Certification Button */}
      <AddItemButton
        label="Add Certification"
        onClick={addCertification}
      />
    </div>
  )
}
