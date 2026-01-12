'use client'

// components/resume/design/PDFDesignPanel.tsx
// Word-style design panel for React-PDF templates

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  AlignLeft,
  AlignCenter,
  Minus,
  Plus,
  Check,
  Type,
  Palette,
  Layout,
  List,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ResumeDesign,
  FontFamily,
  HeadingStyle,
  PaperSize,
  SectionKey,
  PageNumberPosition,
  CustomMargins,
  CustomSpacing,
} from '@/lib/pdf/types'
import { COLOR_PRESETS, MARGIN_PRESETS, SPACING_PRESETS } from '@/lib/pdf/styles/presets'

interface PDFDesignPanelProps {
  design: ResumeDesign
  onDesignChange: (design: Partial<ResumeDesign>) => void
}

// Section info
const SECTION_INFO: Record<SectionKey, { label: string; description: string }> = {
  contact: { label: 'Contact', description: 'Name, email, phone, links' },
  summary: { label: 'Summary', description: 'Professional summary' },
  experience: { label: 'Experience', description: 'Work history' },
  education: { label: 'Education', description: 'Degrees & schools' },
  skills: { label: 'Skills', description: 'Technical & soft skills' },
  projects: { label: 'Projects', description: 'Personal projects' },
  certifications: { label: 'Certifications', description: 'Professional certs' },
  awards: { label: 'Awards', description: 'Honors & achievements' },
  languages: { label: 'Languages', description: 'Language skills' },
  volunteer: { label: 'Volunteer', description: 'Volunteer work' },
  publications: { label: 'Publications', description: 'Published works' },
}

// Simple Section Item Component
interface SectionItemProps {
  sectionKey: SectionKey
  isEnabled: boolean
  isExpanded: boolean
  onToggleEnabled: () => void
  onToggleExpand: () => void
  onCustomTitleChange: (title: string) => void
  customTitle: string
  settings: { enabled?: boolean; columns?: 1 | 2 | 3; customTitle?: string }
  onColumnsChange?: (cols: 1 | 2 | 3) => void
}

const SectionItem: React.FC<SectionItemProps> = ({
  sectionKey,
  isEnabled,
  isExpanded,
  onToggleEnabled,
  onToggleExpand,
  onCustomTitleChange,
  customTitle,
  settings,
  onColumnsChange,
}) => {
  const info = SECTION_INFO[sectionKey]
  if (!info) return null

  return (
    <div
      className={cn(
        'rounded-lg border transition-all overflow-hidden',
        isEnabled
          ? 'border-white/10 bg-white/5'
          : 'border-white/5 bg-white/[0.02] opacity-50'
      )}
    >
      <div className="flex items-center gap-2 p-2.5">
        {/* Enable/Disable checkbox */}
        <button
          onClick={onToggleEnabled}
          className={cn(
            'w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
            isEnabled
              ? 'bg-purple-500 border-purple-500'
              : 'bg-transparent border-white/30'
          )}
        >
          {isEnabled && <Check className="w-2.5 h-2.5 text-white" />}
        </button>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className={cn('text-xs font-medium', isEnabled ? 'text-white' : 'text-white/40')}>
            {info.label}
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onToggleExpand}
          className="p-1 rounded hover:bg-white/10 text-white/40 flex-shrink-0"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded settings */}
      {isExpanded && (
        <div className="px-2.5 pb-2.5 pt-1 border-t border-white/5">
          <label className="block text-[10px] text-white/40 mb-1">
            Custom Title
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => onCustomTitleChange(e.target.value)}
            placeholder={info.label}
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
          />

          {sectionKey === 'skills' && onColumnsChange && (
            <div className="mt-2">
              <label className="block text-[10px] text-white/40 mb-1">
                Columns
              </label>
              <div className="flex gap-1">
                {([1, 2, 3] as const).map((cols) => (
                  <button
                    key={cols}
                    onClick={() => onColumnsChange(cols)}
                    className={cn(
                      'flex-1 py-1 px-2 rounded text-xs transition-all',
                      settings.columns === cols
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    )}
                  >
                    {cols}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Sections List Component (simple list without drag & drop)
interface SectionsListProps {
  design: ResumeDesign
  expandedSection: SectionKey | null
  setExpandedSection: (key: SectionKey | null) => void
  updateDesign: (updates: Partial<ResumeDesign>) => void
}

const SectionsList: React.FC<SectionsListProps> = ({
  design,
  expandedSection,
  setExpandedSection,
  updateDesign,
}) => {
  // Fixed section order
  const sections: SectionKey[] = [
    'contact', 'summary', 'experience', 'education', 'skills',
    'projects', 'certifications', 'awards', 'languages', 'volunteer', 'publications'
  ]

  return (
    <div className="space-y-2">
      {sections.map((key) => {
        const settings = design.sectionSettings[key] || { enabled: true }
        const isEnabled = settings.enabled !== false
        const isExpanded = expandedSection === key

        return (
          <SectionItem
            key={key}
            sectionKey={key}
            isEnabled={isEnabled}
            isExpanded={isExpanded}
            onToggleEnabled={() => {
              const current = design.sectionSettings[key] || { enabled: true }
              updateDesign({
                sectionSettings: {
                  ...design.sectionSettings,
                  [key]: { ...current, enabled: !current.enabled },
                },
              })
            }}
            onToggleExpand={() => setExpandedSection(isExpanded ? null : key)}
            onCustomTitleChange={(title) => {
              const current = design.sectionSettings[key] || { enabled: true }
              updateDesign({
                sectionSettings: {
                  ...design.sectionSettings,
                  [key]: { ...current, customTitle: title || undefined },
                },
              })
            }}
            customTitle={settings.customTitle || ''}
            settings={settings}
            onColumnsChange={key === 'skills' ? (cols) => {
              updateDesign({
                sectionSettings: {
                  ...design.sectionSettings,
                  skills: { ...settings, columns: cols },
                },
              })
            } : undefined}
          />
        )
      })}
    </div>
  )
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-white/50" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/50" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

// Number Input with +/- buttons
interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label: string
  unit?: string
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = 'pt',
}) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-white/70">{label}</span>
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <div className="w-14 text-center text-sm text-white">
        {value}{unit}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  </div>
)

// Option Button Group
interface OptionButtonProps {
  options: { id: string; label: string; icon?: React.ElementType }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const OptionButtons: React.FC<OptionButtonProps> = ({
  options,
  value,
  onChange,
  className,
}) => (
  <div className={cn('flex gap-1', className)}>
    {options.map((option) => {
      const Icon = option.icon
      return (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1',
            value === option.id
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
              : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20 hover:text-white'
          )}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{option.label}</span>
        </button>
      )
    })}
  </div>
)

export function PDFDesignPanel({ design, onDesignChange }: PDFDesignPanelProps) {
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>(null)

  const updateDesign = (updates: Partial<ResumeDesign>) => {
    onDesignChange(updates)
  }

  // Get current font sizes from preset or custom
  const getFontSizes = () => {
    const presets = {
      small: { name: 20, section: 11, body: 9 },
      normal: { name: 24, section: 12, body: 10 },
      large: { name: 28, section: 14, body: 11 },
    }
    return design.customFontSizes || presets[design.fontSize] || presets.normal
  }

  const fontSizes = getFontSizes()

  const updateFontSize = (key: 'name' | 'section' | 'body', value: number) => {
    updateDesign({
      customFontSizes: {
        ...fontSizes,
        [key]: value,
      },
    })
  }

  // Get current margins from custom or preset (with fallback to 'normal')
  const getMargins = (): CustomMargins => {
    if (design.customMargins) return design.customMargins
    return MARGIN_PRESETS[design.margins] || MARGIN_PRESETS.normal
  }

  const margins = getMargins()

  const updateMargin = (key: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    updateDesign({
      customMargins: {
        ...margins,
        [key]: value,
      },
    })
  }

  // Update all margins at once (uniform)
  const updateAllMargins = (value: number) => {
    updateDesign({
      customMargins: {
        top: value,
        right: value,
        bottom: value,
        left: value,
      },
    })
  }

  // Get current spacing from custom or preset
  const getSpacing = (): CustomSpacing => {
    if (design.customSpacing) return design.customSpacing
    const preset = SPACING_PRESETS[design.sectionSpacing] || SPACING_PRESETS.normal
    return { section: preset.section, item: preset.item }
  }

  const spacing = getSpacing()

  const updateSpacing = (key: 'section' | 'item', value: number) => {
    updateDesign({
      customSpacing: {
        ...spacing,
        [key]: value,
      },
    })
  }

  // Get line height (default 1.15)
  const lineHeight = design.lineHeight || 1.15

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Typography Section */}
      <CollapsibleSection title="Typography" icon={Type} defaultOpen={true}>
        <div className="space-y-4">
          {/* Font Family */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Font Family</label>
            <select
              value={design.fontFamily}
              onChange={(e) => updateDesign({ fontFamily: e.target.value as FontFamily })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <optgroup label="Sans-Serif (Modern)" className="bg-gray-800 text-white">
                <option value="helvetica" className="bg-gray-800 text-white py-1">Helvetica</option>
                <option value="inter" className="bg-gray-800 text-white py-1">Inter</option>
                <option value="roboto" className="bg-gray-800 text-white py-1">Roboto</option>
                <option value="open-sans" className="bg-gray-800 text-white py-1">Open Sans</option>
                <option value="lato" className="bg-gray-800 text-white py-1">Lato</option>
                <option value="source-sans" className="bg-gray-800 text-white py-1">Source Sans Pro</option>
                <option value="raleway" className="bg-gray-800 text-white py-1">Raleway</option>
              </optgroup>
              <optgroup label="Serif (Traditional)" className="bg-gray-800 text-white">
                <option value="times" className="bg-gray-800 text-white py-1">Times New Roman</option>
                <option value="merriweather" className="bg-gray-800 text-white py-1">Merriweather</option>
                <option value="eb-garamond" className="bg-gray-800 text-white py-1">EB Garamond</option>
                <option value="playfair" className="bg-gray-800 text-white py-1">Playfair Display</option>
              </optgroup>
              <optgroup label="Display / Condensed" className="bg-gray-800 text-white">
                <option value="oswald" className="bg-gray-800 text-white py-1">Oswald</option>
              </optgroup>
              <optgroup label="Monospace" className="bg-gray-800 text-white">
                <option value="courier" className="bg-gray-800 text-white py-1">Courier</option>
              </optgroup>
            </select>
          </div>

          {/* Font Sizes */}
          <div className="space-y-3 p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-white/50 font-medium mb-2">Font Sizes</div>
            <NumberInput
              label="Name"
              value={fontSizes.name}
              onChange={(v) => updateFontSize('name', v)}
              min={16}
              max={48}
              step={2}
            />
            <NumberInput
              label="Section Headings"
              value={fontSizes.section}
              onChange={(v) => updateFontSize('section', v)}
              min={10}
              max={18}
            />
            <NumberInput
              label="Body Text"
              value={fontSizes.body}
              onChange={(v) => updateFontSize('body', v)}
              min={8}
              max={14}
            />
          </div>

          {/* Heading Style */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Heading Style</label>
            <OptionButtons
              options={[
                { id: 'bold', label: 'Bold' },
                { id: 'caps', label: 'CAPS' },
                { id: 'underline', label: 'Underline' },
              ]}
              value={design.headingStyle}
              onChange={(v) => updateDesign({ headingStyle: v as HeadingStyle })}
            />
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Header Alignment</label>
            <OptionButtons
              options={[
                { id: 'left', label: 'Left', icon: AlignLeft },
                { id: 'center', label: 'Center', icon: AlignCenter },
              ]}
              value={design.headerAlignment || 'center'}
              onChange={(v) => updateDesign({ headerAlignment: v as 'left' | 'center' })}
            />
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Date Format</label>
            <select
              value={design.dateFormat}
              onChange={(e) => updateDesign({ dateFormat: e.target.value as any })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="Month Year" className="bg-gray-800 text-white">January 2024</option>
              <option value="Mon YYYY" className="bg-gray-800 text-white">Jan 2024</option>
              <option value="MM/YYYY" className="bg-gray-800 text-white">01/2024</option>
              <option value="YYYY" className="bg-gray-800 text-white">2024</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Layout Section */}
      <CollapsibleSection title="Page Layout" icon={Layout} defaultOpen={true}>
        <div className="space-y-4">
          {/* Paper Size */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Paper Size</label>
            <OptionButtons
              options={[
                { id: 'letter', label: 'US Letter' },
                { id: 'a4', label: 'A4' },
              ]}
              value={design.paperSize}
              onChange={(v) => updateDesign({ paperSize: v as PaperSize })}
            />
          </div>

          {/* Margins */}
          <div className="space-y-3 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/50 font-medium">Page Margins</div>
              <div className="text-[10px] text-white/30">72pt = 1 inch</div>
            </div>
            <NumberInput
              label="All Sides"
              value={margins.top}
              onChange={(v) => updateAllMargins(v)}
              min={24}
              max={72}
              step={4}
            />
            <div className="grid grid-cols-2 gap-2">
              <NumberInput
                label="Top"
                value={margins.top}
                onChange={(v) => updateMargin('top', v)}
                min={24}
                max={72}
                step={4}
              />
              <NumberInput
                label="Bottom"
                value={margins.bottom}
                onChange={(v) => updateMargin('bottom', v)}
                min={24}
                max={72}
                step={4}
              />
              <NumberInput
                label="Left"
                value={margins.left}
                onChange={(v) => updateMargin('left', v)}
                min={24}
                max={72}
                step={4}
              />
              <NumberInput
                label="Right"
                value={margins.right}
                onChange={(v) => updateMargin('right', v)}
                min={24}
                max={72}
                step={4}
              />
            </div>
          </div>

          {/* Section Spacing */}
          <div className="space-y-3 p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-white/50 font-medium">Spacing</div>
            <NumberInput
              label="Section Gap"
              value={spacing.section}
              onChange={(v) => updateSpacing('section', v)}
              min={8}
              max={28}
              step={2}
            />
            <NumberInput
              label="Item Gap"
              value={spacing.item}
              onChange={(v) => updateSpacing('item', v)}
              min={4}
              max={16}
              step={2}
            />
          </div>

          {/* Line Height */}
          <div className="space-y-3 p-3 bg-white/5 rounded-lg">
            <div className="text-xs text-white/50 font-medium">Line Height</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/70">Multiplier</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateDesign({ lineHeight: Math.max(1.0, lineHeight - 0.05) })}
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="w-14 text-center text-sm text-white">
                  {lineHeight.toFixed(2)}
                </div>
                <button
                  onClick={() => updateDesign({ lineHeight: Math.min(2.0, lineHeight + 0.05) })}
                  className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex gap-1">
              {[1.0, 1.15, 1.3, 1.5].map((val) => (
                <button
                  key={val}
                  onClick={() => updateDesign({ lineHeight: val })}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded text-xs transition-all',
                    lineHeight === val
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:border-white/20'
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Page Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-white/50">Page Numbers</label>
              <button
                onClick={() => updateDesign({ showPageNumbers: !design.showPageNumbers })}
                className={cn(
                  'w-10 h-5 rounded-full transition-colors relative',
                  design.showPageNumbers ? 'bg-purple-500' : 'bg-white/20'
                )}
              >
                <div
                  className={cn(
                    'absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform',
                    design.showPageNumbers ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
            {design.showPageNumbers && (
              <OptionButtons
                options={[
                  { id: 'bottom-center', label: 'Center' },
                  { id: 'bottom-right', label: 'Right' },
                ]}
                value={design.pageNumberPosition || 'bottom-center'}
                onChange={(v) => updateDesign({ pageNumberPosition: v as PageNumberPosition })}
              />
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Colors Section */}
      <CollapsibleSection title="Colors" icon={Palette} defaultOpen={false}>
        <div className="space-y-4">
          {/* Color Presets */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Color Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = design.colorPresetId === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => updateDesign({ colorPresetId: preset.id, customAccentColor: undefined })}
                    className={cn(
                      'relative p-2.5 rounded-lg border text-left transition-all',
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <span className="text-xs text-white flex-1">{preset.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-purple-400" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Accent */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Custom Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={design.customAccentColor || '#6366f1'}
                onChange={(e) => updateDesign({ customAccentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={design.customAccentColor || ''}
                onChange={(e) => updateDesign({ customAccentColor: e.target.value })}
                placeholder="#6366f1"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:border-purple-500 focus:outline-none"
              />
            </div>
            {design.customAccentColor && (
              <button
                onClick={() => updateDesign({ customAccentColor: undefined })}
                className="text-xs text-purple-400 hover:text-purple-300 mt-1.5"
              >
                Reset to theme
              </button>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Sections Management */}
      <CollapsibleSection title="Sections" icon={List} defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-xs text-white/40 mb-3">
            Toggle visibility and customize section titles
          </p>

          <SectionsList
            design={design}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
            updateDesign={updateDesign}
          />
        </div>
      </CollapsibleSection>

      {/* Quick Tips */}
      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] text-white/30 space-y-1">
          <p><strong className="text-white/50">Tip:</strong> Use 10-11pt body text for best readability</p>
          <p><strong className="text-white/50">ATS:</strong> Sans-serif fonts scan better</p>
        </div>
      </div>
    </div>
  )
}

export default PDFDesignPanel
