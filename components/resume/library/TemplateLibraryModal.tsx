// components/resume/library/TemplateLibraryModal.tsx
// Full-screen template library modal with filters and live preview

'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Crown, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAllTemplateConfigs } from '@/lib/templates/templateConfigs'
import { TemplateConfig } from '@/lib/types/template'

interface TemplateLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
  onApplyTemplate: (templateId: string) => void
}

type CategoryFilter = 'all' | 'minimal' | 'modern' | 'classic' | 'professional' | 'creative'
type LayoutFilter = 'all' | 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right'
type MembershipFilter = 'all' | 'free' | 'premium'

interface FilterCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  count?: number
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, checked, onChange, count }) => (
  <button
    onClick={() => onChange(!checked)}
    className={cn(
      'flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors',
      checked ? 'bg-purple-500/20 text-white' : 'text-white/70 hover:bg-white/5'
    )}
  >
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
        checked ? 'bg-purple-500 border-purple-500' : 'border-white/30'
      )}>
        {checked && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <span>{label}</span>
    </div>
    {typeof count === 'number' && (
      <span className="text-xs text-white/40">{count}</span>
    )}
  </button>
)

interface FilterGroupProps {
  title: string
  children: React.ReactNode
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider px-3">
      {title}
    </h4>
    <div className="space-y-1">
      {children}
    </div>
  </div>
)

interface TemplateCardProps {
  template: TemplateConfig
  selected: boolean
  onClick: () => void
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, selected, onClick }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all text-left group',
        selected
          ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
          : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
      )}
    >
      {/* Template Preview */}
      <div className="aspect-[8.5/11] bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        {!imageError ? (
          <img
            src={`/templates/${template.id}.svg`}
            alt={`${template.name} template preview`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full p-2">
            {/* Fallback placeholder */}
            <div className="w-full h-full bg-gray-100 rounded flex flex-col p-2 gap-1">
              <div className="h-3 bg-gray-300 rounded w-2/3" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
              <div className="flex-1 space-y-1 mt-2">
                <div className="h-1.5 bg-gray-200 rounded w-full" />
                <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                <div className="h-1.5 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white text-sm">{template.name}</h4>
          {selected && <Check className="w-4 h-4 text-purple-400" />}
        </div>
        <p className="text-xs text-white/50 line-clamp-2">{template.description}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className={cn(
            'px-2 py-0.5 rounded-full text-[10px] font-medium',
            template.behavior?.atsOptimized
              ? 'bg-green-500/20 text-green-400'
              : 'bg-yellow-500/20 text-yellow-400'
          )}>
            {template.behavior?.atsOptimized ? 'ATS-Optimized' : 'Creative'}
          </span>
          {template.isPremium && (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-medium">
              <Crown className="w-2.5 h-2.5" />
              Premium
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
  onApplyTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [layoutFilter, setLayoutFilter] = useState<LayoutFilter>('all')
  const [membershipFilter, setMembershipFilter] = useState<MembershipFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(selectedTemplate)

  const allTemplates = getAllTemplateConfigs()

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          template.name.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.tags?.some(tag => tag.toLowerCase().includes(query))
        if (!matchesSearch) return false
      }

      // Category filter
      if (categoryFilter !== 'all' && template.category !== categoryFilter) {
        return false
      }

      // Layout filter
      if (layoutFilter !== 'all' && template.layout.type !== layoutFilter) {
        return false
      }

      // Membership filter
      if (membershipFilter === 'free' && template.isPremium) return false
      if (membershipFilter === 'premium' && !template.isPremium) return false

      return true
    })
  }, [allTemplates, searchQuery, categoryFilter, layoutFilter, membershipFilter])

  // Count templates for filter labels
  const getCategoryCount = (cat: string) =>
    cat === 'all'
      ? allTemplates.length
      : allTemplates.filter(t => t.category === cat).length

  const getLayoutCount = (layout: string) =>
    layout === 'all'
      ? allTemplates.length
      : allTemplates.filter(t => t.layout.type === layout).length

  const getMembershipCount = (membership: string) =>
    membership === 'all'
      ? allTemplates.length
      : membership === 'free'
        ? allTemplates.filter(t => !t.isPremium).length
        : allTemplates.filter(t => t.isPremium).length

  const handleApply = () => {
    if (selectedId) {
      onApplyTemplate(selectedId)
      onClose()
    }
  }

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
          <h2 className="text-xl font-bold text-white">Template Library</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Filters */}
          <div className="w-56 border-r border-white/10 p-4 space-y-6 overflow-y-auto bg-black/30">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Style Filters */}
            <FilterGroup title="Styles">
              {(['all', 'minimal', 'modern', 'classic', 'professional', 'creative'] as const).map(cat => (
                <FilterCheckbox
                  key={cat}
                  label={cat === 'all' ? 'All Styles' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  checked={categoryFilter === cat}
                  onChange={() => setCategoryFilter(cat)}
                  count={getCategoryCount(cat)}
                />
              ))}
            </FilterGroup>

            {/* Layout Filters */}
            <FilterGroup title="Layouts">
              {[
                { id: 'all', label: 'All Layouts' },
                { id: 'single-column', label: 'Single Column' },
                { id: 'two-column', label: 'Two Column' },
                { id: 'sidebar-left', label: 'Sidebar Left' },
                { id: 'sidebar-right', label: 'Sidebar Right' },
              ].map(layout => (
                <FilterCheckbox
                  key={layout.id}
                  label={layout.label}
                  checked={layoutFilter === layout.id}
                  onChange={() => setLayoutFilter(layout.id as LayoutFilter)}
                  count={getLayoutCount(layout.id)}
                />
              ))}
            </FilterGroup>

            {/* Membership Filters */}
            <FilterGroup title="Membership">
              {[
                { id: 'all', label: 'All Templates' },
                { id: 'free', label: 'Free' },
                { id: 'premium', label: 'Premium' },
              ].map(membership => (
                <FilterCheckbox
                  key={membership.id}
                  label={membership.label}
                  checked={membershipFilter === membership.id}
                  onChange={() => setMembershipFilter(membership.id as MembershipFilter)}
                  count={getMembershipCount(membership.id)}
                />
              ))}
            </FilterGroup>
          </div>

          {/* Center - Template Grid */}
          <div className="flex-1 overflow-y-auto p-6 bg-black/20">
            <div className="mb-4 text-sm text-white/60">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </div>

            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedId === template.id}
                  onClick={() => setSelectedId(template.id)}
                />
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No templates match your filters</p>
                <button
                  onClick={() => {
                    setCategoryFilter('all')
                    setLayoutFilter('all')
                    setMembershipFilter('all')
                    setSearchQuery('')
                  }}
                  className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedId}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-colors',
              selectedId
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            )}
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
