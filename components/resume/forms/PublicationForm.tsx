// components/resume/forms/PublicationForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const PublicationForm = () => {
  const { resumeData, setResumeData } = useResume()

  const publications = ((resumeData as any).publications as any[]) || []

  const addPublication = () => {
    setResumeData({
      ...resumeData,
      publications: [
        ...publications,
        { title: '', publisher: '', date: '', url: '', description: '' },
      ],
    })
  }

  const updatePublication = (index: number, field: string, value: string) => {
    const updated = [...publications]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, publications: updated })
  }

  const removePublication = (index: number) => {
    setResumeData({
      ...resumeData,
      publications: publications.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Publications">
      <div className="space-y-6">
        {publications.map((pub, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Publication {index + 1}</h4>
              <button
                onClick={() => removePublication(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
                <input
                  type="text"
                  value={pub.title}
                  onChange={e => updatePublication(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Machine Learning in Practice"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Publisher</label>
                  <input
                    type="text"
                    value={pub.publisher}
                    onChange={e => updatePublication(index, 'publisher', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="IEEE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                  <input
                    type="text"
                    value={pub.date}
                    onChange={e => updatePublication(index, 'date', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Mar 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  URL (Optional)
                </label>
                <input
                  type="url"
                  value={pub.url || ''}
                  onChange={e => updatePublication(index, 'url', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={pub.description || ''}
                  onChange={e => updatePublication(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Brief summary..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addPublication}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Publication</span>
        </button>
      </div>
    </GlassCard>
  )
}
