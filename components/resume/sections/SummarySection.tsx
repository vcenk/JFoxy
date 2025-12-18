// components/resume/sections/SummarySection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import { RichTextDisplay } from '@/components/ui/RichTextDisplay'
import { isValidTiptapJSON, plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const SummarySection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('summary')
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

  const getTitle = () => sectionSettings['summary']?.customTitle || 'Professional Summary'

  return (
    <BaseSection sectionKey="summary" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-2" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <div className="text-gray-700">
        <RichTextDisplay
          key={JSON.stringify(resumeData.summary)}
          content={ensureRichText(resumeData.summary)}
        />
      </div>
    </BaseSection>
  )
}
