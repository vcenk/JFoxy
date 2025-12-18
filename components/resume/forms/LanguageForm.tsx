// components/resume/forms/LanguageForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const LanguageForm = () => {
  const { resumeData, setResumeData } = useResume()

  const languages = ((resumeData as any).languages as any[]) || []

  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [...languages, { name: '', proficiency: 'Native' }],
    })
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languages]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, languages: updated })
  }

  const removeLanguage = (index: number) => {
    setResumeData({
      ...resumeData,
      languages: languages.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Languages">
      <div className="space-y-6">
        {languages.map((lang, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Language {index + 1}</h4>
              <button
                onClick={() => removeLanguage(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
                <input
                  type="text"
                  value={lang.name}
                  onChange={e => updateLanguage(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Proficiency</label>
                <select
                  value={lang.proficiency}
                  onChange={e => updateLanguage(index, 'proficiency', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addLanguage}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Language</span>
        </button>
      </div>
    </GlassCard>
  )
}
