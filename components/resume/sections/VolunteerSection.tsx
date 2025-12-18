// components/resume/sections/VolunteerSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection, DateFormatter } from '../renderers'
import { RichTextDisplay } from '@/components/ui/RichTextDisplay'
import { isValidTiptapJSON, plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const VolunteerSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('volunteer')
    setInspectorTab('content')
    onClick()
  }

  if (!resumeData.volunteer || resumeData.volunteer.length === 0) return null

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

  const getTitle = () => sectionSettings['volunteer']?.customTitle || 'Volunteer Experience'

  return (
    <BaseSection sectionKey="volunteer" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <div className="space-y-3">
        {resumeData.volunteer.map((vol, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-gray-900 ${
                    designerSettings.boldPosition ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {vol.role}
                </h3>
                <p className="text-sm text-gray-700">{vol.organization}</p>
              </div>
              <div className="text-sm text-gray-600">
                <DateFormatter dateStr={vol.startDate} /> -{' '}
                <DateFormatter dateStr={vol.endDate} current={vol.current} />
              </div>
            </div>
            {vol.description && (
              <div className="mt-1 text-gray-700">
                <RichTextDisplay
                  key={JSON.stringify(vol.description)}
                  content={ensureRichText(vol.description)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </BaseSection>
  )
}
