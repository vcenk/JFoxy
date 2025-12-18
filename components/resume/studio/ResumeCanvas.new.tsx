// components/resume/studio/ResumeCanvas.tsx
// Simplified Resume Canvas using Section Registry

'use client'

import React, { useEffect } from 'react'
import { useResume } from '@/contexts/ResumeContext'
import { SECTION_REGISTRY } from '@/lib/sectionRegistry'
import { ResumePaper } from './ResumePaper'
import { SectionDivider } from '../renderers'

// Import section components to trigger registration
import '@/components/resume/sections'

export const ResumeCanvas = () => {
  const {
    activeSection,
    sectionOrder,
    sectionSettings,
    selectedJsonResumeTheme,
    renderedThemeHtml,
    isThemeLoading,
    resumeData,
    setIsThemeLoading,
    setRenderedThemeHtml,
  } = useResume()

  // Scroll to section on click
  useEffect(() => {
    const el = document.querySelector(`[data-resume-section="${activeSection}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [activeSection])

  // Fetch JSON Resume theme if selected
  useEffect(() => {
    const fetchThemedResume = async () => {
      if (selectedJsonResumeTheme && resumeData) {
        setIsThemeLoading(true)
        setRenderedThemeHtml(null)

        try {
          const response = await fetch('/api/resume/render-theme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resumeData, themeName: selectedJsonResumeTheme }),
          })

          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`)
          }

          const html = await response.text()
          setRenderedThemeHtml(html)
        } catch (error) {
          console.error('Failed to render JSON Resume theme:', error)
          setRenderedThemeHtml(`
            <div style="padding: 20px; color: red; text-align: center;">
              Error loading theme: ${selectedJsonResumeTheme}. Please check console for details.
            </div>
          `)
        } finally {
          setIsThemeLoading(false)
        }
      } else if (!selectedJsonResumeTheme) {
        setRenderedThemeHtml(null)
      }
    }

    fetchThemedResume()
  }, [resumeData, selectedJsonResumeTheme, setIsThemeLoading, setRenderedThemeHtml])

  // Render JSON Resume theme if selected
  if (selectedJsonResumeTheme) {
    return (
      <div className="flex-1 h-full overflow-y-auto p-8 flex items-start justify-center bg-gray-900/50 relative">
        {isThemeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 text-white text-lg z-10">
            Loading {selectedJsonResumeTheme} theme...
          </div>
        )}
        {renderedThemeHtml && (
          <iframe
            id="resume-theme-iframe"
            title="JSON Resume Theme Preview"
            srcDoc={renderedThemeHtml}
            className="resume-paper w-[8.5in] shadow-2xl bg-white border-none"
            style={{ minHeight: '11in', width: '8.5in', height: 'auto' }}
          />
        )}
        {!isThemeLoading && !renderedThemeHtml && selectedJsonResumeTheme && (
          <div className="text-gray-400 text-lg">Failed to load theme.</div>
        )}
      </div>
    )
  }

  // Render JobFoxy custom resume builder
  const headerSections = ['contact', 'targetTitle']
  const sidebarSections = [
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'volunteer',
    'publications',
    'languages',
  ]

  // Filter sections based on visibility and registration
  const visibleSections = sectionOrder.filter(sectionId => {
    const isVisible = sectionSettings[sectionId]?.visible !== false
    const isRegistered = !!SECTION_REGISTRY[sectionId]
    return isVisible && isRegistered
  })

  const headerContent = visibleSections.filter(id => headerSections.includes(id))
  const mainColContent: typeof visibleSections = []
  const sideColContent: typeof visibleSections = []

  if (designerSettings.columns === 2) {
    visibleSections.forEach(id => {
      if (headerSections.includes(id)) return
      if (sidebarSections.includes(id)) {
        sideColContent.push(id)
      } else {
        mainColContent.push(id)
      }
    })
  }

  const renderSection = (sectionId: string) => {
    const SectionComponent = SECTION_REGISTRY[sectionId as keyof typeof SECTION_REGISTRY]
    if (!SectionComponent) return null

    return (
      <SectionComponent
        key={sectionId}
        isActive={activeSection === sectionId}
        onClick={() => {}}
      />
    )
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 flex items-start justify-center bg-gray-900/50">
      <ResumePaper>
        {/* Render header sections */}
        {headerContent.map((sectionId, index) => (
          <React.Fragment key={sectionId}>
            {renderSection(sectionId)}
            {index < headerContent.length - 1 && <SectionDivider />}
          </React.Fragment>
        ))}

        {headerContent.length > 0 && <SectionDivider />}

        {/* Render main content in columns or single column */}
        {designerSettings.columns === 2 ? (
          <div className="flex space-x-8">
            <div className="w-2/3">
              {mainColContent.map((sectionId, index) => (
                <React.Fragment key={sectionId}>
                  {renderSection(sectionId)}
                  {index < mainColContent.length - 1 && <SectionDivider />}
                </React.Fragment>
              ))}
            </div>
            <div className="w-1/3">
              {sideColContent.map((sectionId, index) => (
                <React.Fragment key={sectionId}>
                  {renderSection(sectionId)}
                  {index < sideColContent.length - 1 && <SectionDivider />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {visibleSections
              .filter(id => !headerSections.includes(id))
              .map((sectionId, index, arr) => (
                <React.Fragment key={sectionId}>
                  {renderSection(sectionId)}
                  {index < arr.length - 1 && <SectionDivider />}
                </React.Fragment>
              ))}
          </div>
        )}
      </ResumePaper>
    </div>
  )
}
