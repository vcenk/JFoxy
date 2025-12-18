// components/resume/forms/TargetTitleForm.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'

export const TargetTitleForm = () => {
  const { resumeData, setResumeData } = useResume()

  const updateTargetTitle = (value: string) => {
    setResumeData({ ...resumeData, targetTitle: value })
  }

  return (
    <GlassCard title="Target Job Title">
      <GlassCardSection>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Job Title / Role
            </label>
            <input
              type="text"
              value={(resumeData as any).targetTitle || ''}
              onChange={e => updateTargetTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-200">
              💡 <strong>Tip:</strong> This will be displayed prominently below your name as
              your professional headline.
            </p>
          </div>
        </div>
      </GlassCardSection>
    </GlassCard>
  )
}
