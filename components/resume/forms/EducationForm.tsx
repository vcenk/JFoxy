// components/resume/forms/EducationForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const EducationForm = () => {
  const { resumeData, setResumeData } = useResume()

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { institution: '', degree: '', field: '', graduationDate: '', gpa: '' },
      ],
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...resumeData.education]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, education: updated })
  }

  const removeEducation = (index: number) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Education">
      <div className="space-y-6">
        {resumeData.education.map((edu, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Education {index + 1}</h4>
              <button onClick={() => removeEducation(index)} className="text-red-400 hover:text-red-300 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={e => updateEducation(index, 'institution', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="University Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => updateEducation(index, 'degree', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Field</label>
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={e => updateEducation(index, 'field', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Graduation Date</label>
                  <input
                    type="text"
                    value={edu.graduationDate || ''}
                    onChange={e => updateEducation(index, 'graduationDate', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="May 2023"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">GPA (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={e => updateEducation(index, 'gpa', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
        </button>
      </div>
    </GlassCard>
  )
}
