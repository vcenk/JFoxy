'use client'

// components/resume/design/TemplatesPanel.tsx
// Templates panel with My Templates grid and Browse Library button

import React, { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResume } from '@/contexts/ResumeContext'
import { TemplateLibraryModal } from '@/components/resume/library/TemplateLibraryModal'
import { TemplateId } from '@/lib/pdf/types'

// Available PDF templates
const PDF_TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'executive', name: 'Executive' },
]

interface TemplateCardProps {
  id: string
  name: string
  isSelected: boolean
  onClick: () => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({ id, name, isSelected, onClick }) => {
  const [imageError, setImageError] = React.useState(false)

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-[8.5/11] rounded-lg border-2 transition-all overflow-hidden group',
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/30'
          : 'border-white/20 hover:border-purple-500/50'
      )}
    >
      {/* Template Preview */}
      <div className="absolute inset-0 bg-white">
        {!imageError ? (
          <img
            src={`/templates/${id}.svg`}
            alt={`${name} template preview`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full p-2 flex flex-col">
            {/* Fallback placeholder */}
            <div className="text-center mb-2">
              <div className="h-2 bg-gray-300 rounded w-1/2 mx-auto mb-0.5" />
              <div className="h-1 bg-gray-200 rounded w-1/3 mx-auto" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="space-y-0.5">
                <div className="h-1 bg-gray-300 rounded w-1/4" />
                <div className="h-0.5 bg-gray-200 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-5/6" />
              </div>
              <div className="space-y-0.5">
                <div className="h-1 bg-gray-300 rounded w-1/3" />
                <div className="h-0.5 bg-gray-200 rounded w-full" />
                <div className="h-0.5 bg-gray-200 rounded w-4/5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Template name overlay on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-xs font-medium">{name}</span>
      </div>
    </button>
  )
}

export function TemplatesPanel() {
  const { pdfDesign, updatePdfDesign } = useResume()
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const handleSelectTemplate = (templateId: TemplateId) => {
    updatePdfDesign({ templateId })
  }

  return (
    <div className="p-4">
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-white/90 font-medium flex items-center gap-2">
          My Templates
        </h3>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Browse Template Library Button */}
        <button
          onClick={() => setIsLibraryOpen(true)}
          className="aspect-[8.5/11] rounded-lg border-2 border-dashed border-white/30 hover:border-purple-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2"
        >
          <div className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white/60" />
          </div>
          <span className="text-white/70 text-xs font-medium text-center px-2">
            Browse Template Library
          </span>
        </button>

        {/* Template Cards */}
        {PDF_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            name={template.name}
            isSelected={pdfDesign.templateId === template.id}
            onClick={() => handleSelectTemplate(template.id)}
          />
        ))}
      </div>

      {/* Template Library Modal */}
      <TemplateLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        selectedTemplate={pdfDesign.templateId}
        onSelectTemplate={(id) => handleSelectTemplate(id as TemplateId)}
        onApplyTemplate={(id) => {
          handleSelectTemplate(id as TemplateId)
          setIsLibraryOpen(false)
        }}
      />
    </div>
  )
}
