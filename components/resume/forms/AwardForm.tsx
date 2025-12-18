// components/resume/forms/AwardForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const AwardForm = () => {
  const { resumeData, setResumeData } = useResume()

  const awards = ((resumeData as any).awards as any[]) || []

  const addAward = () => {
    setResumeData({
      ...resumeData,
      awards: [...awards, { title: '', issuer: '', date: '', description: '' }],
    })
  }

  const updateAward = (index: number, field: string, value: string) => {
    const updated = [...awards]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, awards: updated })
  }

  const removeAward = (index: number) => {
    setResumeData({
      ...resumeData,
      awards: awards.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Awards & Honors">
      <div className="space-y-6">
        {awards.map((award, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Award {index + 1}</h4>
              <button
                onClick={() => removeAward(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Award Title</label>
                <input
                  type="text"
                  value={award.title}
                  onChange={e => updateAward(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Employee of the Year"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={e => updateAward(index, 'issuer', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                  <input
                    type="text"
                    value={award.date}
                    onChange={e => updateAward(index, 'date', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Dec 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={award.description || ''}
                  onChange={e => updateAward(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Brief description of the award..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addAward}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Award</span>
        </button>
      </div>
    </GlassCard>
  )
}
