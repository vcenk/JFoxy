// components/resume/sections/CertificationsSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import { CustomList } from '../renderers/ListStyles'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const CertificationsSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('certifications')
    setInspectorTab('content')
    onClick()
  }

  const certs =
    resumeData.certifications ||
    (resumeData.skills.certifications?.map(c => ({ name: c })) || [])

  if (certs.length === 0) return null

  const getHeaderStyle = () => ({
    color: designerSettings.accentColor,
    fontSize: `${designerSettings.fontSizeHeadings}pt`,
    fontWeight: designerSettings.fontWeightHeadings,
    letterSpacing: `${designerSettings.letterSpacing}em`,
    textTransform: designerSettings.textTransform as any,
    fontStyle: designerSettings.fontStyleHeadings,
    textDecoration: designerSettings.textDecorationHeadings,
  })

  const getTitle = () => sectionSettings['certifications']?.customTitle || 'Certifications'

  return (
    <BaseSection sectionKey="certifications" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <CustomList style={sectionSettings['certifications']?.listStyle || 'disc'}>
        {certs.map((cert, idx) => (
          <li key={idx}>
            <span className="font-medium text-gray-900">{cert.name}</span>
            {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
            {cert.date && <span className="text-gray-500 text-sm"> ({cert.date})</span>}
          </li>
        ))}
      </CustomList>
    </BaseSection>
  )
}
