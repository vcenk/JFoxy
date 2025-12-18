// components/resume/forms/ProjectForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const ProjectForm = () => {
  const { resumeData, setResumeData } = useResume()

  const projects = (resumeData.projects as any[]) || []

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...projects,
        { name: '', description: '', technologies: [], link: '' },
      ],
    })
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...projects]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, projects: updated })
  }

  const removeProject = (index: number) => {
    setResumeData({
      ...resumeData,
      projects: projects.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Projects">
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Project {index + 1}</h4>
              <button
                onClick={() => removeProject(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={e => updateProject(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="E-commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  value={project.description}
                  onChange={e => updateProject(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe the project and your role..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={project.technologies?.join(', ') || ''}
                  onChange={e =>
                    updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={e => updateProject(index, 'link', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Project</span>
        </button>
      </div>
    </GlassCard>
  )
}
