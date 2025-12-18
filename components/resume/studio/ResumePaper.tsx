// components/resume/studio/ResumePaper.tsx
// Resume paper container with pagination support

'use client'

import React, { ReactNode } from 'react'
import { useResume } from '@/contexts/ResumeContext'

interface ResumePaperProps {
  children: ReactNode
}

export const ResumePaper: React.FC<ResumePaperProps> = ({ children }) => {
  const { designerSettings, resumeData } = useResume()

  const PAGE_DIMENSIONS = {
    letter: { width: '8.5in', height: '11in', heightPx: 1056 },
    a4: { width: '210mm', height: '297mm', heightPx: 1123 },
  }

  const currentDim = PAGE_DIMENSIONS[designerSettings.paperSize]

  const PageNumberStyles = () => {
    const { enabled, alignment } = designerSettings.pageNumbers

    const alignmentMap = {
      left: '0',
      center: '50%',
      right: '100%',
    }

    const transformMap = {
      left: 'translateX(0)',
      center: 'translateX(-50%)',
      right: 'translateX(-100%)',
    }

    const pageNumberCss = enabled
      ? `
        @media print {
          @page {
            margin-bottom: 0.6in;
          }

          .resume-page-footer {
            display: block;
            position: fixed;
            bottom: 0.25in;
            left: ${alignmentMap[alignment]};
            transform: ${transformMap[alignment]};
            font-size: 9pt;
            color: #666;
            text-align: ${alignment};
          }
        }
      `
      : `
        @media print {
          .resume-page-footer {
            display: none;
          }
        }
      `

    const css = `
      @media print {
        .print-avoid-break {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
      ${pageNumberCss}

      @media screen {
        .resume-page-footer {
          display: none;
        }
      }
    `
    return <style>{css}</style>
  }

  // Get contact name for footer
  const getFooterName = () => {
    if (resumeData?.contact?.firstName && resumeData?.contact?.lastName) {
      return `${resumeData.contact.firstName} ${resumeData.contact.lastName}`
    }
    return 'Resume'
  }

  return (
    <>
      <PageNumberStyles />
      <div
        id="resume-paper"
        className="resume-paper bg-white shadow-2xl transition-all duration-300 ease-in-out relative"
        style={{
          width: currentDim.width,
          minHeight: currentDim.height,
          padding: `${designerSettings.margins}px`,
          paddingBottom: designerSettings.pageNumbers.enabled
            ? `${designerSettings.margins + 30}px`
            : `${designerSettings.margins}px`,
          fontFamily:
            designerSettings.fontFamily === 'inter'
              ? 'var(--font-inter), sans-serif'
              : '-apple-system, BlinkMacSystemFont, sans-serif',
          lineHeight: designerSettings.lineHeight,
          fontSize: `${designerSettings.fontSizeBody}pt`,
        }}
      >
        {children}

        {/* Page footer - only visible in print */}
        {designerSettings.pageNumbers.enabled && (
          <div className="resume-page-footer">
            {getFooterName()}
          </div>
        )}
      </div>

      {/* Print-specific overrides */}
      <style jsx>{`
        @media print {
          #resume-paper {
            background-image: none !important;
            box-shadow: none !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  )
}
