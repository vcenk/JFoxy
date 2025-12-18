// components/resume/forms/VolunteerForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const VolunteerForm = () => {
  const { resumeData, setResumeData } = useResume()

  const volunteer = ((resumeData as any).volunteer as any[]) || []

  const addVolunteer = () => {
    setResumeData({
      ...resumeData,
      volunteer: [
        ...volunteer,
        { organization: '', role: '', startDate: '', endDate: '', description: '' },
      ],
    })
  }

  const updateVolunteer = (index: number, field: string, value: string) => {
    const updated = [...volunteer]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, volunteer: updated })
  }

  const removeVolunteer = (index: number) => {
    setResumeData({
      ...resumeData,
      volunteer: volunteer.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Volunteer Experience">
      <div className="space-y-6">
        {volunteer.map((vol, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Experience {index + 1}</h4>
              <button
                onClick={() => removeVolunteer(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Organization
                </label>
                <input
                  type="text"
                  value={vol.organization}
                  onChange={e => updateVolunteer(index, 'organization', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Local Food Bank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Role</label>
                <input
                  type="text"
                  value={vol.role}
                  onChange={e => updateVolunteer(index, 'role', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Volunteer Coordinator"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={vol.startDate}
                    onChange={e => updateVolunteer(index, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Jan 2022"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">End Date</label>
                  <input
                    type="text"
                    value={vol.endDate}
                    onChange={e => updateVolunteer(index, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Present"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                <textarea
                  value={vol.description}
                  onChange={e => updateVolunteer(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe your responsibilities and impact..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addVolunteer}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Volunteer Experience</span>
        </button>
      </div>
    </GlassCard>
  )
}
