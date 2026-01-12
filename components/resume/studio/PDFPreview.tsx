'use client'

// components/resume/studio/PDFPreview.tsx
// PDF Preview component using React-PDF

import React, { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ZoomIn, ZoomOut, RotateCcw, Download, Loader2 } from 'lucide-react'
import { ParsedResume } from '@/lib/types/resume'
import { DesignerSettings } from '@/lib/types/designer'
import { ResumeDesign, DEFAULT_DESIGN, TemplateId } from '@/lib/pdf/types'
import { getTemplateComponent } from '@/lib/pdf/templates'
import { convertToResumeDesign } from '@/lib/pdf/utils/designerAdapter'

// Dynamic import to avoid SSR issues with react-pdf
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    ),
  }
)

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface PDFPreviewProps {
  data: ParsedResume
  design?: Partial<ResumeDesign>
  // Legacy props for backwards compatibility
  legacyDesignerSettings?: Partial<DesignerSettings>
  legacySectionSettings?: Record<string, { visible?: boolean; customTitle?: string }>
  className?: string
  showControls?: boolean
  onDownload?: () => void
}

export function PDFPreview({
  data,
  design: designOverrides,
  legacyDesignerSettings,
  legacySectionSettings,
  className = '',
  showControls = true,
  onDownload,
}: PDFPreviewProps) {
  const [zoom, setZoom] = useState(100)

  // Merge design with defaults, supporting both new and legacy formats
  const design: ResumeDesign = useMemo(() => {
    // If legacy settings provided, convert them
    if (legacyDesignerSettings && !designOverrides) {
      return convertToResumeDesign(legacyDesignerSettings, legacySectionSettings)
    }

    // Otherwise use new format
    return {
      ...DEFAULT_DESIGN,
      ...designOverrides,
      sectionSettings: {
        ...DEFAULT_DESIGN.sectionSettings,
        ...designOverrides?.sectionSettings,
      },
    }
  }, [designOverrides, legacyDesignerSettings, legacySectionSettings])

  // Get template component
  const TemplateComponent = useMemo(() => {
    return getTemplateComponent(design.templateId)
  }, [design.templateId])

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoom(100)
  }, [])

  // Generate filename
  const fileName = useMemo(() => {
    const name = data.contact.name || 'Resume'
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_')
    return `${cleanName}_Resume.pdf`
  }, [data.contact.name])

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${className}`}>
      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <PDFDownloadLink
              document={<TemplateComponent data={data} design={design} />}
              fileName={fileName}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              onClick={() => onDownload?.()}
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer
          key={design.templateId}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          showToolbar={false}
        >
          <TemplateComponent data={data} design={design} />
        </PDFViewer>
      </div>
    </div>
  )
}

export default PDFPreview
