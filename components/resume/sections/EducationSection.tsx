// components/resume/sections/EducationSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection, DateFormatter } from '../renderers'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const EducationSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('education')
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

  const getTitle = () => sectionSettings['education']?.customTitle || 'Education'

  return (
    <BaseSection sectionKey="education" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="space-y-3">
          {resumeData.education.map((edu, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`text-gray-900 ${
                      designerSettings.boldPosition ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  <DateFormatter dateStr={edu.graduationDate} />
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseSection>
  )
}
