// components/resume/sections/LanguagesSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const LanguagesSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('languages')
    setInspectorTab('content')
    onClick()
  }

  const languages =
    resumeData.languages || (resumeData.skills.languages?.map(l => ({ language: l })) || [])

  if (languages.length === 0) return null

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
    const layout = sectionSettings['languages']?.layout || 'list'
    if (layout === 'grid') return 'grid grid-cols-2 gap-x-4 gap-y-2'
    if (layout === 'columns') return 'columns-2 gap-8'
    return 'space-y-2'
  }

  const getTitle = () => sectionSettings['languages']?.customTitle || 'Languages'

  return (
    <BaseSection sectionKey="languages" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <div className={`${getLayoutContainerClass()} text-gray-700`}>
        {languages.map((lang, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="font-medium">{lang.language}</span>
            {lang.fluency && <span className="text-gray-500 text-sm">{lang.fluency}</span>}
          </div>
        ))}
      </div>
    </BaseSection>
  )
}
