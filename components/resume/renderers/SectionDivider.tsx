// components/resume/renderers/SectionDivider.tsx
// Divider component between resume sections

'use client'

import { useResume } from '@/contexts/ResumeContext'

export const SectionDivider: React.FC = () => {
  const { designerSettings } = useResume()

  switch (designerSettings.dividerStyle) {
    case 'line':
      return <hr className="my-4" style={{ borderColor: designerSettings.accentColor }} />
    case 'dots':
      return <div className="text-center my-3 text-gray-400 tracking-[0.4em]">...</div>
    default:
      return null
  }
}
