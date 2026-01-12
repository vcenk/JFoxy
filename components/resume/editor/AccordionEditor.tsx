'use client'

// components/resume/editor/AccordionEditor.tsx
// Accordion-style content editor with checkboxes - Dark Theme

import React, { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Plus, Trash2, Pencil, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResume } from '@/contexts/ResumeContext'
import { ParsedResume, ExperienceEntry, EducationEntry } from '@/lib/types/resume'
import { extractPlainText } from '@/lib/pdf/utils/richTextToPlain'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { analyzeBullet, findWeakWordsWithPositions } from '@/lib/utils/bulletAnalyzer'

interface AccordionEditorProps {
  resumeData: ParsedResume
  onChange: (data: ParsedResume) => void
}

type SectionId = 'contact' | 'targetTitle' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'awards' | 'volunteer' | 'publications' | 'languages'

interface SectionConfig {
  id: SectionId
  label: string
  hasItems?: boolean
}

const SECTIONS: SectionConfig[] = [
  { id: 'contact', label: 'Contact Information' },
  { id: 'targetTitle', label: 'Target Title' },
  { id: 'summary', label: 'Professional Summary' },
  { id: 'experience', label: 'Work Experience', hasItems: true },
  { id: 'education', label: 'Education', hasItems: true },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects', hasItems: true },
  { id: 'certifications', label: 'Certifications', hasItems: true },
  { id: 'awards', label: 'Awards', hasItems: true },
  { id: 'volunteer', label: 'Volunteer Experience', hasItems: true },
  { id: 'publications', label: 'Publications', hasItems: true },
  { id: 'languages', label: 'Languages', hasItems: true },
]

// Checkbox component - Dark theme
const Checkbox = ({
  checked,
  onChange,
  className
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onChange(!checked)
    }}
    className={cn(
      'w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0',
      checked
        ? 'bg-purple-500 border-purple-500'
        : 'bg-white/5 border-white/30 hover:border-purple-400',
      className
    )}
  >
    {checked && (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </button>
)

// Editable text component - Dark theme
const EditableText = ({
  value,
  onChange,
  placeholder,
  className,
  multiline = false,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  multiline?: boolean
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)

  const handleBlur = () => {
    setIsEditing(false)
    if (localValue !== value) {
      onChange(localValue)
    }
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className={cn(
            'w-full px-2 py-1 text-sm bg-white/10 border border-purple-500 rounded text-white focus:outline-none resize-none',
            className
          )}
          rows={3}
        />
      )
    }
    return (
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        autoFocus
        className={cn(
          'px-2 py-0.5 text-sm bg-white/10 border border-purple-500 rounded text-white focus:outline-none',
          className
        )}
      />
    )
  }

  return (
    <span
      onClick={() => {
        setLocalValue(value)
        setIsEditing(true)
      }}
      className={cn(
        'cursor-text hover:bg-white/10 px-1 py-0.5 rounded transition-colors',
        !value && 'text-white/40 italic',
        className
      )}
    >
      {value || placeholder || 'Click to edit'}
    </span>
  )
}

// Component to render text with weak word highlighting
const HighlightedBulletText = ({ text }: { text: string }) => {
  const weakWordsWithPositions = useMemo(() => findWeakWordsWithPositions(text), [text])

  if (!text || weakWordsWithPositions.length === 0) {
    return <span>{text || 'Click to edit'}</span>
  }

  // Build the highlighted text
  const parts: React.ReactNode[] = []
  let lastIndex = 0

  weakWordsWithPositions.forEach((weakWord, i) => {
    // Add text before this weak word
    if (weakWord.start > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, weakWord.start)}</span>)
    }

    // Add the highlighted weak word with tooltip
    const alternatives = weakWord.alternatives.slice(0, 3).join(', ')
    parts.push(
      <span
        key={`weak-${i}`}
        className="weak-word-highlight"
        title={`Try: ${alternatives}`}
      >
        {text.slice(weakWord.start, weakWord.end)}
      </span>
    )

    lastIndex = weakWord.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

// Bullet item with score indicator and highlighting
const BulletItemWithAnalysis = ({
  text,
  enabled,
  onToggle,
  onChange,
  onDelete,
}: {
  text: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onChange: (value: string) => void
  onDelete: () => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(text)
  const analysis = useMemo(() => analyzeBullet(text), [text])

  const handleBlur = () => {
    setIsEditing(false)
    if (localValue !== text) {
      onChange(localValue)
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-start gap-2 group">
        <Checkbox checked={enabled !== false} onChange={onToggle} className="mt-1" />
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          className="flex-1 px-2 py-1 text-sm bg-white/10 border border-purple-500 rounded text-white focus:outline-none resize-none"
          rows={3}
        />
        <button
          onClick={onDelete}
          className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Delete bullet"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 group">
      <Checkbox checked={enabled !== false} onChange={onToggle} className="mt-1" />
      <div className="flex-1 space-y-1">
        <span
          onClick={() => {
            setLocalValue(text)
            setIsEditing(true)
          }}
          className={cn(
            'cursor-text hover:bg-white/10 px-1 py-0.5 rounded transition-colors text-sm text-white/70 block',
            !text && 'text-white/40 italic'
          )}
        >
          {text ? <HighlightedBulletText text={text} /> : 'Bullet point...'}
        </span>
        {/* Score indicators */}
        {text && text.trim().length > 0 && (
          <div className="flex items-center gap-2 text-[10px] px-1">
            <div
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded',
                analysis.strength === 'strong' ? 'bg-green-500/20 text-green-400' :
                analysis.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              )}
            >
              <span className="font-medium">{analysis.score}</span>
            </div>
            <div className={cn('flex items-center gap-0.5', analysis.startsWithActionVerb ? 'text-green-400/70' : 'text-white/30')} title={analysis.startsWithActionVerb ? 'Starts with action verb' : 'Missing action verb'}>
              <Zap className="w-3 h-3" />
            </div>
            <div className={cn('flex items-center gap-0.5', analysis.hasMetrics ? 'text-green-400/70' : 'text-white/30')} title={analysis.hasMetrics ? 'Has metrics' : 'Add metrics for impact'}>
              <TrendingUp className="w-3 h-3" />
            </div>
            {analysis.weakWords.length > 0 && (
              <div className="flex items-center gap-0.5 text-yellow-400/70" title={`${analysis.weakWords.length} weak word(s) found`}>
                <AlertTriangle className="w-3 h-3" />
                <span>{analysis.weakWords.length}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={onDelete}
        className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete bullet"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}

export function AccordionEditor({ resumeData, onChange }: AccordionEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set<SectionId>(['experience']))
  const { pdfDesign, updatePdfDesign } = useResume()

  const toggleSection = (sectionId: SectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const updateResumeData = (updates: Partial<ParsedResume>) => {
    onChange({ ...resumeData, ...updates })
  }

  const isSectionEnabled = (sectionId: SectionId): boolean => {
    const settings = pdfDesign.sectionSettings[sectionId as keyof typeof pdfDesign.sectionSettings]
    return settings?.enabled !== false
  }

  // Render Contact Section
  const renderContactSection = () => {
    const contact = resumeData.contact || {}
    const updateContact = (updates: Partial<typeof contact>) => {
      updateResumeData({ contact: { ...contact, ...updates } })
    }

    return (
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={contact.nameEnabled !== false}
            onChange={(checked) => updateContact({ nameEnabled: checked })}
          />
          <EditableText
            value={`${contact.firstName || ''} ${contact.lastName || ''}`.trim()}
            onChange={(value) => {
              const parts = value.split(' ')
              updateContact({
                firstName: parts[0] || '',
                lastName: parts.slice(1).join(' ') || '',
                name: value,
              })
            }}
            placeholder="Full Name"
            className="font-medium text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={contact.emailEnabled !== false}
            onChange={(checked) => updateContact({ emailEnabled: checked })}
          />
          <EditableText
            value={contact.email || ''}
            onChange={(value) => updateContact({ email: value })}
            placeholder="Email"
            className="text-white/80"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={contact.phoneEnabled !== false}
            onChange={(checked) => updateContact({ phoneEnabled: checked })}
          />
          <EditableText
            value={contact.phone || ''}
            onChange={(value) => updateContact({ phone: value })}
            placeholder="Phone"
            className="text-white/80"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={contact.locationEnabled !== false}
            onChange={(checked) => updateContact({ locationEnabled: checked })}
          />
          <EditableText
            value={contact.location || ''}
            onChange={(value) => updateContact({ location: value })}
            placeholder="Location"
            className="text-white/80"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={contact.linkedinEnabled !== false}
            onChange={(checked) => updateContact({ linkedinEnabled: checked })}
          />
          <EditableText
            value={contact.linkedin || ''}
            onChange={(value) => updateContact({ linkedin: value })}
            placeholder="LinkedIn URL"
            className="text-white/80"
          />
        </div>
      </div>
    )
  }

  // Render Target Title Section
  const renderTargetTitleSection = () => {
    return (
      <div className="p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={resumeData.targetTitleEnabled !== false}
            onChange={(checked) => updateResumeData({ targetTitleEnabled: checked })}
          />
          <EditableText
            value={resumeData.targetTitle || ''}
            onChange={(value) => updateResumeData({ targetTitle: value })}
            placeholder="e.g. Senior Software Engineer"
            className="flex-1 text-white"
          />
        </div>
      </div>
    )
  }

  // Render Summary Section
  const renderSummarySection = () => {
    const summaryText = resumeData.summary ? extractPlainText(resumeData.summary) : ''

    return (
      <div className="p-3">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={resumeData.summaryEnabled !== false}
            onChange={(checked) => updateResumeData({ summaryEnabled: checked })}
            className="mt-1"
          />
          <EditableText
            value={summaryText}
            onChange={(value) => updateResumeData({ summary: plainTextToJSON(value) })}
            placeholder="Write a brief professional summary..."
            className="flex-1 text-white/80"
            multiline
          />
        </div>
      </div>
    )
  }

  // Render Experience Section
  const renderExperienceSection = () => {
    const experiences = resumeData.experience || []

    const updateExperience = (index: number, updates: Partial<ExperienceEntry>) => {
      const newExperiences = [...experiences]
      newExperiences[index] = { ...newExperiences[index], ...updates }
      updateResumeData({ experience: newExperiences })
    }

    const addExperience = () => {
      const newExp: ExperienceEntry = {
        id: `exp-${Date.now()}`,
        enabled: true,
        company: '',
        companyEnabled: true,
        position: '',
        positionEnabled: true,
        location: '',
        locationEnabled: true,
        startDate: '',
        endDate: '',
        current: false,
        dateEnabled: true,
        bullets: [],
      }
      updateResumeData({ experience: [...experiences, newExp] })
    }

    const deleteExperience = (index: number) => {
      const newExperiences = experiences.filter((_, i) => i !== index)
      updateResumeData({ experience: newExperiences })
    }

    const deleteBullet = (expIndex: number, bulletIndex: number) => {
      const exp = experiences[expIndex]
      const newBullets = exp.bullets.filter((_, i) => i !== bulletIndex)
      updateExperience(expIndex, { bullets: newBullets })
    }

    const addBullet = (expIndex: number) => {
      const exp = experiences[expIndex]
      const newBullet = {
        id: `bullet-${Date.now()}`,
        enabled: true,
        content: plainTextToJSON(''),
      }
      updateExperience(expIndex, {
        bullets: [...(exp.bullets || []), newBullet],
      })
    }

    const updateBullet = (expIndex: number, bulletIndex: number, updates: any) => {
      const exp = experiences[expIndex]
      const newBullets = [...(exp.bullets || [])]
      newBullets[bulletIndex] = { ...newBullets[bulletIndex], ...updates }
      updateExperience(expIndex, { bullets: newBullets })
    }

    return (
      <div className="divide-y divide-white/10">
        {experiences.map((exp, expIndex) => (
          <div key={exp.id} className="p-3 space-y-2">
            {/* Company */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={exp.enabled !== false}
                onChange={(checked) => updateExperience(expIndex, { enabled: checked })}
              />
              <EditableText
                value={exp.company || ''}
                onChange={(value) => updateExperience(expIndex, { company: value })}
                placeholder="Company Name"
                className="font-semibold text-white flex-1"
              />
              <button
                onClick={() => deleteExperience(expIndex)}
                className="ml-auto p-1 text-white/40 hover:text-red-400 transition-colors"
                title="Delete experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Position */}
            <div className="flex items-center gap-2 ml-6">
              <Checkbox
                checked={exp.positionEnabled !== false}
                onChange={(checked) => updateExperience(expIndex, { positionEnabled: checked })}
              />
              <EditableText
                value={exp.position || ''}
                onChange={(value) => updateExperience(expIndex, { position: value })}
                placeholder="Job Title"
                className="text-white/80"
              />
            </div>

            {/* Location & Dates */}
            <div className="flex items-center gap-2 ml-6 text-sm text-white/60">
              <Checkbox
                checked={exp.locationEnabled !== false}
                onChange={(checked) => updateExperience(expIndex, { locationEnabled: checked })}
              />
              <EditableText
                value={exp.location || ''}
                onChange={(value) => updateExperience(expIndex, { location: value })}
                placeholder="Location"
              />
              <Checkbox
                checked={exp.dateEnabled !== false}
                onChange={(checked) => updateExperience(expIndex, { dateEnabled: checked })}
                className="ml-2"
              />
              <EditableText
                value={exp.startDate || ''}
                onChange={(value) => updateExperience(expIndex, { startDate: value })}
                placeholder="Start"
              />
              <span>-</span>
              <EditableText
                value={exp.current ? 'Present' : exp.endDate || ''}
                onChange={(value) => {
                  if (value.toLowerCase() === 'present') {
                    updateExperience(expIndex, { current: true, endDate: '' })
                  } else {
                    updateExperience(expIndex, { current: false, endDate: value })
                  }
                }}
                placeholder="End"
              />
            </div>

            {/* Bullets */}
            <div className="ml-6 space-y-2">
              {(exp.bullets || []).map((bullet, bulletIndex) => (
                <BulletItemWithAnalysis
                  key={bullet.id}
                  text={extractPlainText(bullet.content)}
                  enabled={bullet.enabled !== false}
                  onToggle={(checked) => updateBullet(expIndex, bulletIndex, { enabled: checked })}
                  onChange={(value) => updateBullet(expIndex, bulletIndex, { content: plainTextToJSON(value) })}
                  onDelete={() => deleteBullet(expIndex, bulletIndex)}
                />
              ))}
              <button
                onClick={() => addBullet(expIndex)}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mt-2 ml-6"
              >
                <Plus className="w-4 h-4" />
                Add Bullet
              </button>
            </div>
          </div>
        ))}
        <div className="p-3">
          <button
            onClick={addExperience}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
      </div>
    )
  }

  // Render Education Section
  const renderEducationSection = () => {
    const education = resumeData.education || []

    const updateEducation = (index: number, updates: Partial<EducationEntry>) => {
      const newEducation = [...education]
      newEducation[index] = { ...newEducation[index], ...updates }
      updateResumeData({ education: newEducation })
    }

    const addEducation = () => {
      const newEdu: EducationEntry = {
        id: `edu-${Date.now()}`,
        enabled: true,
        institution: '',
        institutionEnabled: true,
        degree: '',
        degreeEnabled: true,
        field: '',
        fieldEnabled: true,
        graduationDate: '',
        dateEnabled: true,
      }
      updateResumeData({ education: [...education, newEdu] })
    }

    const deleteEducation = (index: number) => {
      const newEducation = education.filter((_, i) => i !== index)
      updateResumeData({ education: newEducation })
    }

    return (
      <div className="divide-y divide-white/10">
        {education.map((edu, index) => (
          <div key={edu.id} className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={edu.enabled !== false}
                onChange={(checked) => updateEducation(index, { enabled: checked })}
              />
              <EditableText
                value={edu.institution || ''}
                onChange={(value) => updateEducation(index, { institution: value })}
                placeholder="Institution"
                className="font-semibold text-white flex-1"
              />
              <button
                onClick={() => deleteEducation(index)}
                className="ml-auto p-1 text-white/40 hover:text-red-400 transition-colors"
                title="Delete education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <Checkbox
                checked={edu.degreeEnabled !== false}
                onChange={(checked) => updateEducation(index, { degreeEnabled: checked })}
              />
              <EditableText
                value={edu.degree || ''}
                onChange={(value) => updateEducation(index, { degree: value })}
                placeholder="Degree"
                className="text-white/80"
              />
              <span className="text-white/40">in</span>
              <EditableText
                value={edu.field || ''}
                onChange={(value) => updateEducation(index, { field: value })}
                placeholder="Field of Study"
                className="text-white/80"
              />
            </div>
            <div className="flex items-center gap-2 ml-6 text-sm text-white/60">
              <Checkbox
                checked={edu.dateEnabled !== false}
                onChange={(checked) => updateEducation(index, { dateEnabled: checked })}
              />
              <EditableText
                value={edu.graduationDate || ''}
                onChange={(value) => updateEducation(index, { graduationDate: value })}
                placeholder="Graduation Date"
              />
            </div>
          </div>
        ))}
        <div className="p-3">
          <button
            onClick={addEducation}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      </div>
    )
  }

  // Render Skills Section
  const renderSkillsSection = () => {
    const skills = resumeData.skills || { technical: [], soft: [] }

    const updateSkills = (updates: Partial<typeof skills>) => {
      updateResumeData({ skills: { ...skills, ...updates } })
    }

    const toggleSkill = (type: 'technical' | 'soft', index: number, enabled: boolean) => {
      const arr = [...(skills[type] || [])]
      arr[index] = { ...arr[index], enabled }
      updateSkills({ [type]: arr })
    }

    const addSkill = (type: 'technical' | 'soft') => {
      const arr = [...(skills[type] || [])]
      arr.push({ id: `skill-${Date.now()}`, name: '', enabled: true })
      updateSkills({ [type]: arr })
    }

    const deleteSkill = (type: 'technical' | 'soft', index: number) => {
      const arr = (skills[type] || []).filter((_, i) => i !== index)
      updateSkills({ [type]: arr })
    }

    return (
      <div className="p-3 space-y-4">
        <div>
          <div className="text-sm font-medium text-white/60 mb-2">Technical Skills</div>
          <div className="flex flex-wrap gap-2">
            {(skills.technical || []).map((skill, index) => (
              <div key={skill.id || index} className="flex items-center gap-1 bg-white/5 rounded px-2 py-1 border border-white/10 group">
                <Checkbox
                  checked={skill.enabled !== false}
                  onChange={(checked) => toggleSkill('technical', index, checked)}
                />
                <EditableText
                  value={skill.name || ''}
                  onChange={(value) => {
                    const arr = [...(skills.technical || [])]
                    arr[index] = { ...arr[index], name: value }
                    updateSkills({ technical: arr })
                  }}
                  placeholder="Skill"
                  className="text-sm text-white/80"
                />
                <button
                  onClick={() => deleteSkill('technical', index)}
                  className="p-0.5 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addSkill('technical')}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm px-2 py-1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-white/60 mb-2">Soft Skills</div>
          <div className="flex flex-wrap gap-2">
            {(skills.soft || []).map((skill, index) => (
              <div key={skill.id || index} className="flex items-center gap-1 bg-white/5 rounded px-2 py-1 border border-white/10 group">
                <Checkbox
                  checked={skill.enabled !== false}
                  onChange={(checked) => toggleSkill('soft', index, checked)}
                />
                <EditableText
                  value={skill.name || ''}
                  onChange={(value) => {
                    const arr = [...(skills.soft || [])]
                    arr[index] = { ...arr[index], name: value }
                    updateSkills({ soft: arr })
                  }}
                  placeholder="Skill"
                  className="text-sm text-white/80"
                />
                <button
                  onClick={() => deleteSkill('soft', index)}
                  className="p-0.5 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete skill"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addSkill('soft')}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm px-2 py-1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Generic list section renderer
  const renderGenericListSection = (sectionId: SectionId) => {
    const items = (resumeData[sectionId as keyof ParsedResume] as any[]) || []

    const updateItem = (index: number, updates: any) => {
      const newItems = [...items]
      newItems[index] = { ...newItems[index], ...updates }
      updateResumeData({ [sectionId]: newItems })
    }

    const addItem = () => {
      const newItem = {
        id: `${sectionId}-${Date.now()}`,
        enabled: true,
        name: '',
        nameEnabled: true,
        // Section-specific defaults
        ...(sectionId === 'languages' && { language: '', fluency: '', fluencyEnabled: true }),
        ...(sectionId === 'certifications' && { issuer: '', date: '', issuerEnabled: true, dateEnabled: true }),
        ...(sectionId === 'projects' && { description: '', technologies: [], link: '' }),
        ...(sectionId === 'awards' && { title: '', issuer: '', date: '', description: '' }),
        ...(sectionId === 'volunteer' && { organization: '', role: '', startDate: '', endDate: '' }),
        ...(sectionId === 'publications' && { title: '', publisher: '', date: '', link: '' }),
      }
      updateResumeData({ [sectionId]: [...items, newItem] })
    }

    const deleteItem = (index: number) => {
      const newItems = items.filter((_, i) => i !== index)
      updateResumeData({ [sectionId]: newItems })
    }

    // Get display value and field name based on section
    const getDisplayValue = (item: any) => {
      if (sectionId === 'languages') return item.language || ''
      if (sectionId === 'awards' || sectionId === 'publications') return item.title || ''
      if (sectionId === 'volunteer') return item.organization || ''
      return item.name || ''
    }

    const getPlaceholder = () => {
      if (sectionId === 'languages') return 'Language'
      if (sectionId === 'awards') return 'Award title'
      if (sectionId === 'publications') return 'Publication title'
      if (sectionId === 'volunteer') return 'Organization'
      if (sectionId === 'certifications') return 'Certification name'
      if (sectionId === 'projects') return 'Project name'
      return `${sectionId.slice(0, -1)} name`
    }

    return (
      <div className="divide-y divide-white/10">
        {items.map((item, index) => (
          <div key={item.id || index} className="p-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.enabled !== false}
                onChange={(checked) => updateItem(index, { enabled: checked })}
              />
              <EditableText
                value={getDisplayValue(item)}
                onChange={(value) => {
                  if (sectionId === 'languages') updateItem(index, { language: value })
                  else if (sectionId === 'awards' || sectionId === 'publications') updateItem(index, { title: value })
                  else if (sectionId === 'volunteer') updateItem(index, { organization: value })
                  else updateItem(index, { name: value })
                }}
                placeholder={getPlaceholder()}
                className="font-medium text-white flex-1"
              />
              {/* Show fluency for languages */}
              {sectionId === 'languages' && item.fluency && (
                <span className="text-sm text-white/50">({item.fluency})</span>
              )}
              <button
                onClick={() => deleteItem(index)}
                className="p-1 text-white/40 hover:text-red-400 transition-colors"
                title={`Delete ${sectionId.slice(0, -1)}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {/* Additional fields for certain sections */}
            {sectionId === 'languages' && (
              <div className="flex items-center gap-2 ml-6 mt-2">
                <EditableText
                  value={item.fluency || ''}
                  onChange={(value) => updateItem(index, { fluency: value })}
                  placeholder="Fluency level (e.g., Native, Fluent)"
                  className="text-sm text-white/60"
                />
              </div>
            )}
            {sectionId === 'certifications' && (
              <div className="flex items-center gap-2 ml-6 mt-2 text-sm text-white/60">
                <EditableText
                  value={item.issuer || ''}
                  onChange={(value) => updateItem(index, { issuer: value })}
                  placeholder="Issuer"
                />
                <span>•</span>
                <EditableText
                  value={item.date || ''}
                  onChange={(value) => updateItem(index, { date: value })}
                  placeholder="Date"
                />
              </div>
            )}
          </div>
        ))}
        <div className="p-3">
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add {sectionId === 'languages' ? 'Language' : sectionId.slice(0, -1)}
          </button>
        </div>
      </div>
    )
  }

  // Render section content based on section ID
  const renderSectionContent = (sectionId: SectionId) => {
    switch (sectionId) {
      case 'contact':
        return renderContactSection()
      case 'targetTitle':
        return renderTargetTitleSection()
      case 'summary':
        return renderSummarySection()
      case 'experience':
        return renderExperienceSection()
      case 'education':
        return renderEducationSection()
      case 'skills':
        return renderSkillsSection()
      default:
        return renderGenericListSection(sectionId)
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Section Accordions */}
      <div className="divide-y divide-white/10">
        {SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id)
          const isEnabled = isSectionEnabled(section.id)

          return (
            <div key={section.id}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  )}
                  <span className={cn(
                    'font-medium',
                    isEnabled ? 'text-purple-400' : 'text-white/40'
                  )}>
                    {section.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {section.hasItems && (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-white/40 hover:text-purple-400"
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  )}
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-white/40 hover:text-white/60"
                  >
                    <Pencil className="w-4 h-4" />
                  </span>
                </div>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="bg-white/5 border-t border-white/10">
                  {renderSectionContent(section.id)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AccordionEditor
