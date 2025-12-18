// components/resume/sections/AwardsSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const AwardsSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('awards')
    setInspectorTab('content')
    onClick()
  }

  if (!resumeData.awards || resumeData.awards.length === 0) return null

  const getHeaderStyle = () => ({
    color: designerSettings.accentColor,
    fontSize: `${designerSettings.fontSizeHeadings}pt`,
    fontWeight: designerSettings.fontWeightHeadings,
    letterSpacing: `${designerSettings.letterSpacing}em`,
    textTransform: designerSettings.textTransform as any,
    fontStyle: designerSettings.fontStyleHeadings,
    textDecoration: designerSettings.textDecorationHeadings,
  })

  const getTitle = () => sectionSettings['awards']?.customTitle || 'Awards'

  return (
    <BaseSection sectionKey="awards" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <div className="space-y-2">
        {resumeData.awards.map((award, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium text-gray-900">{award.title}</h3>
              <span className="text-sm text-gray-600">{award.date}</span>
            </div>
            {(award.issuer || award.description) && (
              <p className="text-sm text-gray-700">
                {award.issuer && <span className="font-medium">{award.issuer}</span>}
                {award.issuer && award.description && ' - '}
                {award.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </BaseSection>
  )
}
