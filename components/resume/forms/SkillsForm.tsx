// components/resume/forms/SkillsForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'
import { X } from 'lucide-react'
import { useState } from 'react'

export const SkillsForm = () => {
  const { resumeData, setResumeData } = useResume()
  const [newSkill, setNewSkill] = useState({ technical: '', tools: '', languages: '' })

  const addSkill = (category: 'technical' | 'tools' | 'languages') => {
    if (!newSkill[category].trim()) return

    const currentSkills = resumeData.skills[category] || []
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: [...currentSkills, newSkill[category].trim()],
      },
    })
    setNewSkill({ ...newSkill, [category]: '' })
  }

  const removeSkill = (category: 'technical' | 'tools' | 'languages', index: number) => {
    const currentSkills = resumeData.skills[category] || []
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: currentSkills.filter((_, i) => i !== index),
      },
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent, category: 'technical' | 'tools' | 'languages') => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(category)
    }
  }

  return (
    <GlassCard title="Skills">
      <GlassCardSection title="Technical Skills">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(resumeData.skills.technical || []).map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill('technical', index)}
                  className="hover:text-red-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill.technical}
              onChange={e => setNewSkill({ ...newSkill, technical: e.target.value })}
              onKeyPress={e => handleKeyPress(e, 'technical')}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., JavaScript, Python, React"
            />
            <button
              onClick={() => addSkill('technical')}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-200 font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </GlassCardSection>

      <GlassCardSection title="Tools & Technologies">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(resumeData.skills.tools || []).map((tool, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-sm"
              >
                <span>{tool}</span>
                <button onClick={() => removeSkill('tools', index)} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill.tools}
              onChange={e => setNewSkill({ ...newSkill, tools: e.target.value })}
              onKeyPress={e => handleKeyPress(e, 'tools')}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Git, Docker, AWS"
            />
            <button
              onClick={() => addSkill('tools')}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-200 font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </GlassCardSection>

      <GlassCardSection title="Languages">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(resumeData.skills.languages || []).map((lang, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full text-green-200 text-sm"
              >
                <span>{lang}</span>
                <button onClick={() => removeSkill('languages', index)} className="hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill.languages}
              onChange={e => setNewSkill({ ...newSkill, languages: e.target.value })}
              onKeyPress={e => handleKeyPress(e, 'languages')}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., English (Native), Spanish (Fluent)"
            />
            <button
              onClick={() => addSkill('languages')}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-xl text-green-200 font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </GlassCardSection>
    </GlassCard>
  )
}
