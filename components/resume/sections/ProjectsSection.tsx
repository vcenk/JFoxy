// components/resume/sections/ProjectsSection.tsx
'use client'

import { useResume } from '@/contexts/ResumeContext'
import { BaseSection } from '../renderers'
import { RichTextDisplay } from '@/components/ui/RichTextDisplay'
import { isValidTiptapJSON, plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'
import type { SectionComponentProps } from '@/lib/sectionRegistry'

export const ProjectsSection: React.FC<SectionComponentProps> = ({ isActive, onClick }) => {
  const { resumeData, designerSettings, sectionSettings, setActiveSection, setInspectorTab } = useResume()

  const handleClick = () => {
    setActiveSection('projects')
    setInspectorTab('content')
    onClick()
  }

  if (!resumeData.projects || resumeData.projects.length === 0) return null

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

  const getTitle = () => sectionSettings['projects']?.customTitle || 'Projects'

  return (
    <BaseSection sectionKey="projects" isActive={isActive} onClick={handleClick}>
      <h2 className="mb-3" style={getHeaderStyle()}>
        {getTitle()}
      </h2>
      <div className="space-y-4">
        {resumeData.projects.map((project, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3
                  className={`text-gray-900 ${
                    designerSettings.boldPosition ? 'font-bold' : 'font-normal'
                  }`}
                >
                  {project.name}
                </h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {project.link.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
            <div className="text-gray-700 mb-1">
              <RichTextDisplay
                key={JSON.stringify(project.description)}
                content={ensureRichText(project.description)}
              />
            </div>
            {project.technologies && project.technologies.length > 0 && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Tech:</span> {project.technologies.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </BaseSection>
  )
}
