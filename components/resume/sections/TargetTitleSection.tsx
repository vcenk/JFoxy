// components/resume/sections/TargetTitleSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const TargetTitleSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('targetTitle')
    setInspectorTab('content')
    onClick()
  }

  if (!resumeData.targetTitle) return null

  const getHeaderStyle = () => ({
    color: designerSettings.accentColor,
    fontSize: `${designerSettings.fontSizeHeadings}pt`,
    fontWeight: designerSettings.fontWeightHeadings,
    letterSpacing: `${designerSettings.letterSpacing}em`,
    textTransform: 'uppercase' as any,
    fontStyle: designerSettings.fontStyleHeadings,
    textDecoration: designerSettings.textDecorationHeadings,
  })

  return (
    <BaseSection sectionKey="targetTitle" isActive={isActive} onClick={handleClick}>
      <h2
        className="text-center mb-2"
        style={{
          ...getHeaderStyle(),
          letterSpacing: '0.1em',
        }}
      >
        {resumeData.targetTitle}
      </h2>
    </BaseSection>
  )
}
