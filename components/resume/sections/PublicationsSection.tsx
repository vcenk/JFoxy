// components/resume/sections/PublicationsSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import { CustomList } from '../renderers/ListStyles'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const PublicationsSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('publications')
    setInspectorTab('content')
    onClick()
  }

  if (!resumeData.publications || resumeData.publications.length === 0) return null

  const getHeaderStyle = () => ({
    color: designerSettings.accentColor,
    fontSize: `${designerSettings.fontSizeHeadings}pt`,
    fontWeight: designerSettings.fontWeightHeadings,
    letterSpacing: `${designerSettings.letterSpacing}em`,
    textTransform: designerSettings.textTransform as any,
    fontStyle: designerSettings.fontStyleHeadings,
    textDecoration: designerSettings.textDecorationHeadings,
  })

  const getTitle = () => sectionSettings['publications']?.customTitle || 'Publications'

  return (
    <BaseSection sectionKey="publications" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <CustomList style={sectionSettings['publications']?.listStyle || 'disc'}>
        {resumeData.publications.map((pub, idx) => (
          <li key={idx}>
            <span className="font-medium text-gray-900">{pub.title}</span>
            {pub.publisher && <span>, {pub.publisher}</span>}
            {pub.date && <span className="text-gray-500 text-sm"> ({pub.date})</span>}
            {pub.link && (
              <a
                href={pub.link}
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-xs text-blue-600 hover:underline"
              >
                Link
              </a>
            )}
          </li>
        ))}
      </CustomList>
    </BaseSection>
  )
}
