// components/resume/forms/ContactForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'

export const ContactForm = () => {
  const { resumeData, setResumeData } = useResume()

  const updateContact = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      contact: { ...resumeData.contact, [field]: value },
    })
  }

  return (
    <GlassCard title="Contact Information">
      <GlassCardSection title="Basic Info">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
            <input
              type="text"
              value={resumeData.contact.name || ''}
              onChange={e => updateContact('name', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={resumeData.contact.email || ''}
              onChange={e => updateContact('email', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Phone</label>
            <input
              type="tel"
              value={resumeData.contact.phone || ''}
              onChange={e => updateContact('phone', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Location</label>
            <input
              type="text"
              value={resumeData.contact.location || ''}
              onChange={e => updateContact('location', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="San Francisco, CA"
            />
          </div>
        </div>
      </GlassCardSection>

      <GlassCardSection title="Links">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">LinkedIn</label>
            <input
              type="url"
              value={resumeData.contact.linkedin || ''}
              onChange={e => updateContact('linkedin', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="linkedin.com/in/johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">GitHub</label>
            <input
              type="url"
              value={resumeData.contact.github || ''}
              onChange={e => updateContact('github', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="github.com/johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Portfolio</label>
            <input
              type="url"
              value={resumeData.contact.portfolio || ''}
              onChange={e => updateContact('portfolio', e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="johndoe.com"
            />
          </div>
        </div>
      </GlassCardSection>
    </GlassCard>
  )
}
