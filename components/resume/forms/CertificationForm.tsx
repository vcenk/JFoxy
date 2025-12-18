// components/resume/forms/CertificationForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard } from '@/components/ui/glass-card'
import { Plus, Trash2 } from 'lucide-react'

export const CertificationForm = () => {
  const { resumeData, setResumeData } = useResume()

  const certifications = ((resumeData as any).certifications as any[]) || []

  const addCertification = () => {
    setResumeData({
      ...resumeData,
      certifications: [
        ...certifications,
        { name: '', issuer: '', date: '', credentialId: '', url: '' },
      ],
    })
  }

  const updateCertification = (index: number, field: string, value: string) => {
    const updated = [...certifications]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, certifications: updated })
  }

  const removeCertification = (index: number) => {
    setResumeData({
      ...resumeData,
      certifications: certifications.filter((_, i) => i !== index),
    })
  }

  return (
    <GlassCard title="Certifications">
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Certification {index + 1}</h4>
              <button
                onClick={() => removeCertification(index)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Certification Name
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={e => updateCertification(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={e => updateCertification(index, 'issuer', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Amazon Web Services"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={e => updateCertification(index, 'date', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Jan 2023"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  value={cert.credentialId || ''}
                  onChange={e => updateCertification(index, 'credentialId', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="ABC123XYZ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  URL (Optional)
                </label>
                <input
                  type="url"
                  value={cert.url || ''}
                  onChange={e => updateCertification(index, 'url', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addCertification}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certification</span>
        </button>
      </div>
    </GlassCard>
  )
}
