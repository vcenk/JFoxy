// components/resume/editor/sections/ProjectsEditor.tsx
// Projects section with granular toggles

'use client'

import React, { useState } from 'react'
import { FolderGit2, ChevronDown, ChevronRight, Check, Trash2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectEntry, BulletItem as BulletItemType } from '@/lib/types/resume'
import { FieldRow, AddItemButton, BulletItem } from '../components'
import { createProjectEntry, createBulletItem } from '@/lib/utils/dataMigration'

interface ProjectsEditorProps {
  projects: ProjectEntry[]
  onChange: (projects: ProjectEntry[]) => void
  sectionEnabled?: boolean
  onSectionEnabledChange?: (enabled: boolean) => void
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({
  projects,
  onChange,
  sectionEnabled = true,
  onSectionEnabledChange,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(projects.map(p => p.id))
  )
  const [newTech, setNewTech] = useState<Record<string, string>>({})

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const updateProject = (id: string, updates: Partial<ProjectEntry>) => {
    onChange(projects.map(proj =>
      proj.id === id ? { ...proj, ...updates } : proj
    ))
  }

  const addTech = (projId: string) => {
    const tech = newTech[projId]?.trim()
    if (!tech) return

    onChange(projects.map(proj => {
      if (proj.id !== projId) return proj
      return {
        ...proj,
        technologies: [...(proj.technologies || []), tech]
      }
    }))
    setNewTech({ ...newTech, [projId]: '' })
  }

  const removeTech = (projId: string, index: number) => {
    onChange(projects.map(proj => {
      if (proj.id !== projId) return proj
      return {
        ...proj,
        technologies: proj.technologies?.filter((_, i) => i !== index)
      }
    }))
  }

  const addProject = () => {
    const newProj = createProjectEntry(projects.length)
    onChange([...projects, newProj])
    setExpandedIds(new Set([...Array.from(expandedIds), newProj.id]))
  }

  const deleteProject = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id))
  }

  const updateBullet = (projId: string, bulletId: string, updates: Partial<BulletItemType>) => {
    onChange(projects.map(proj => {
      if (proj.id !== projId) return proj
      return {
        ...proj,
        bullets: proj.bullets?.map(b =>
          b.id === bulletId ? { ...b, ...updates } : b
        )
      }
    }))
  }

  const addBullet = (projId: string) => {
    onChange(projects.map(proj => {
      if (proj.id !== projId) return proj
      return {
        ...proj,
        bullets: [...(proj.bullets || []), createBulletItem(`proj-${projId}`, proj.bullets?.length || 0)]
      }
    }))
  }

  const deleteBullet = (projId: string, bulletId: string) => {
    onChange(projects.map(proj => {
      if (proj.id !== projId) return proj
      return {
        ...proj,
        bullets: proj.bullets?.filter(b => b.id !== bulletId)
      }
    }))
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
          <FolderGit2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Projects</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/60">
            {projects.filter(p => p.enabled).length} of {projects.length}
          </span>
        </div>
      </div>

      {/* Project Entries */}
      <div className={cn('space-y-3', !sectionEnabled && 'opacity-50')}>
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            {/* Entry Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5">
              <button
                onClick={() => updateProject(proj.id, { enabled: !proj.enabled })}
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  proj.enabled
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-white/30 bg-white/5'
                )}
              >
                {proj.enabled && <Check className="w-3 h-3 text-white" />}
              </button>

              <button
                onClick={() => toggleExpanded(proj.id)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                {expandedIds.has(proj.id) ? (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
                <div className={cn(!proj.enabled && 'opacity-50')}>
                  <div className="font-semibold text-white">
                    {proj.name || 'New Project'}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-sm text-white/60">
                      {proj.technologies.slice(0, 3).join(' • ')}
                      {proj.technologies.length > 3 && ` +${proj.technologies.length - 3}`}
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => deleteProject(proj.id)}
                className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Entry Content */}
            {expandedIds.has(proj.id) && (
              <div className={cn('px-4 pb-4 space-y-4 pt-2', !proj.enabled && 'opacity-50')}>
                {/* Fields */}
                <div className="space-y-1">
                  <FieldRow
                    label="Name"
                    value={proj.name}
                    enabled={proj.nameEnabled !== false}
                    onValueChange={(v) => updateProject(proj.id, { name: v })}
                    onEnabledChange={(e) => updateProject(proj.id, { nameEnabled: e })}
                    placeholder="Project name"
                  />
                  <FieldRow
                    label="Link"
                    value={proj.link || ''}
                    enabled={proj.linkEnabled !== false}
                    onValueChange={(v) => updateProject(proj.id, { link: v })}
                    onEnabledChange={(e) => updateProject(proj.id, { linkEnabled: e })}
                    placeholder="https://..."
                    type="url"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProject(proj.id, { descriptionEnabled: !proj.descriptionEnabled })}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        proj.descriptionEnabled !== false
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-white/30 bg-white/5'
                      )}
                    >
                      {proj.descriptionEnabled !== false && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium text-white/70">Description</span>
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    placeholder="Brief description of the project..."
                    rows={2}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProject(proj.id, { technologiesEnabled: !proj.technologiesEnabled })}
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        proj.technologiesEnabled !== false
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-white/30 bg-white/5'
                      )}
                    >
                      {proj.technologiesEnabled !== false && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium text-white/70">Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies?.map((tech, index) => (
                      <span
                        key={index}
                        className="group flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(proj.id, index)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full hover:bg-white/20"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newTech[proj.id] || ''}
                      onChange={(e) => setNewTech({ ...newTech, [proj.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTech(proj.id)
                        }
                      }}
                      placeholder="Add tech..."
                      className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Bullets */}
                {proj.bullets && proj.bullets.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <span className="text-sm font-medium text-white/70 mb-2 block">Highlights</span>
                    <div className="space-y-1">
                      {proj.bullets.map((bullet) => (
                        <BulletItem
                          key={bullet.id}
                          bullet={bullet}
                          onToggle={(enabled) => updateBullet(proj.id, bullet.id, { enabled })}
                          onEdit={(content) => updateBullet(proj.id, bullet.id, { content })}
                          onDelete={() => deleteBullet(proj.id, bullet.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => addBullet(proj.id)}
                  className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-white/20 text-sm text-white/60 hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add Highlight
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      <AddItemButton
        label="Add Project"
        onClick={addProject}
      />
    </div>
  )
}
