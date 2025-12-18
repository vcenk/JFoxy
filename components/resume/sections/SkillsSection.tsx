// components/resume/sections/SkillsSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const SkillsSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('skills')
    setInspectorTab('content')
    onClick()
  }

  const getHeaderStyle = () => ({
    color: designerSettings.accentColor,
    fontSize: `${designerSettings.fontSizeHeadings}pt`,
    fontWeight: designerSettings.fontWeightHeadings,
    letterSpacing: `${designerSettings.letterSpacing}em`,
    textTransform: designerSettings.textTransform as any,
    fontStyle: designerSettings.fontStyleHeadings,
    textDecoration: designerSettings.textDecorationHeadings,
  })

  const getLayoutContainerClass = () => {
    const layout = sectionSettings['skills']?.layout || 'list'
    if (layout === 'grid') return 'grid grid-cols-2 gap-x-4 gap-y-2'
    if (layout === 'columns') return 'columns-2 gap-8'
    return 'space-y-2'
  }

  const getTitle = () => sectionSettings['skills']?.customTitle || 'Skills'

  return (
    <BaseSection sectionKey="skills" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      {(resumeData.skills.technical?.length ||
        resumeData.skills.tools?.length ||
        resumeData.skills.languages?.length) && (
        <div className={`${getLayoutContainerClass()} text-sm`}>
          {resumeData.skills.technical && resumeData.skills.technical.length > 0 && (
            <div>
              <span className="font-semibold text-gray-900">Technical: </span>
              <span className="text-gray-700">{resumeData.skills.technical.join(', ')}</span>
            </div>
          )}
          {resumeData.skills.tools && resumeData.skills.tools.length > 0 && (
            <div>
              <span className="font-semibold text-gray-900">Tools: </span>
              <span className="text-gray-700">{resumeData.skills.tools.join(', ')}</span>
            </div>
          )}
          {!resumeData.languages &&
            resumeData.skills.languages &&
            resumeData.skills.languages.length > 0 && (
              <div>
                <span className="font-semibold text-gray-900">Languages: </span>
                <span className="text-gray-700">{resumeData.skills.languages.join(', ')}</span>
              </div>
            )}
        </div>
      )}
    </BaseSection>
  )
}
