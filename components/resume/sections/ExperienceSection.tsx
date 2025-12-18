// components/resume/sections/ExperienceSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection, DateFormatter } from '../renderers'
import { CustomList } from '../renderers/ListStyles'
import { RichTextDisplay } from '@/components/ui/RichTextDisplay'
import { isValidTiptapJSON, plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const ExperienceSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('experience')
    setInspectorTab('content')
    onClick()
  }

  const ensureRichText = (content: any): JSONContent => {
    if (isValidTiptapJSON(content)) {
      return content
    }
    if (typeof content === 'string') {
      return plainTextToJSON(content)
    }
    return plainTextToJSON('')
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

  const getListClass = () => {
    const style = sectionSettings['experience']?.listStyle || 'disc'
    const baseClasses = 'list-outside ml-5 space-y-1 text-gray-700'

    // Map style to Tailwind class
    switch (style) {
      case 'disc':
        return `list-disc ${baseClasses}`
      case 'circle':
        return `list-disc ${baseClasses}` // Tailwind doesn't have list-circle, use disc
      case 'square':
        return `list-disc ${baseClasses}` // Tailwind doesn't have list-square, use disc
      case 'none':
        return `list-none ${baseClasses} ml-0`
      default:
        return `list-disc ${baseClasses}`
    }
  }

  const getTitle = () => sectionSettings['experience']?.customTitle || 'Experience'

  return (
    <BaseSection sectionKey="experience" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="space-y-4">
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} className="print-avoid-break">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3
                    className={`text-gray-900 ${
                      designerSettings.boldPosition ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {exp.position}
                  </h3>
                  <p className="text-sm text-gray-700">{exp.company}</p>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <DateFormatter dateStr={exp.startDate} /> -{' '}
                  <DateFormatter dateStr={exp.endDate} current={exp.current} />
                </div>
              </div>
              {exp.bullets && exp.bullets.length > 0 && (
                <CustomList style={sectionSettings['experience']?.listStyle || 'disc'}>
                  {exp.bullets.map((bullet, bidx) => (
                    <li key={bidx}>
                      <RichTextDisplay
                        key={JSON.stringify(bullet)}
                        content={ensureRichText(bullet)}
                      />
                    </li>
                  ))}
                </CustomList>
              )}
            </div>
          ))}
        </div>
      )}
    </BaseSection>
  )
}
