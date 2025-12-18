// components/resume/sections/ContactSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const ContactSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('contact')
    setInspectorTab('content')
    onClick()
  }

  return (
    <BaseSection sectionKey="contact" isActive={isActive} onClick={handleClick}>
      <h1
        className="text-gray-900 mb-2"
        style={{
          fontSize: `${designerSettings.fontSizeName}pt`,
          fontWeight: designerSettings.fontWeightName,
        }}
      >
        {resumeData.contact.name || 'Your Name'}
      </h1>
      <div className="text-sm text-gray-600 space-x-4">
        {resumeData.contact.email && <span>{resumeData.contact.email}</span>}
        {resumeData.contact.phone && <span> | {resumeData.contact.phone}</span>}
        {resumeData.contact.location && <span> | {resumeData.contact.location}</span>}
      </div>
      {(resumeData.contact.linkedin ||
        resumeData.contact.github ||
        resumeData.contact.portfolio) && (
        <div className="text-sm text-gray-600 mt-1 space-x-4">
          {resumeData.contact.linkedin && <span>{resumeData.contact.linkedin}</span>}
          {resumeData.contact.github && <span> | {resumeData.contact.github}</span>}
          {resumeData.contact.portfolio && <span> | {resumeData.contact.portfolio}</span>}
        </div>
      )}
    </BaseSection>
  )
}
