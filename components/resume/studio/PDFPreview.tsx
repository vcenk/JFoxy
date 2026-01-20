'use client'

// components/resume/studio/PDFPreview.tsx
// PDF Preview component using React-PDF

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Maximize2, Download, Loader2, X } from 'lucide-react'
import { ParsedResume } from '@/lib/types/resume'
import { DesignerSettings } from '@/lib/types/designer'
import { ResumeDesign, DEFAULT_DESIGN, TemplateId } from '@/lib/pdf/types'
import { getTemplateComponent } from '@/lib/pdf/templates'
import { convertToResumeDesign } from '@/lib/pdf/utils/designerAdapter'
import { motion, AnimatePresence } from 'framer-motion'

// Dynamic import to avoid SSR issues with react-pdf
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-black/50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
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
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  // Generate filename
  const fileName = useMemo(() => {
    const name = data.contact.name || 'Resume'
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_')
    return `${cleanName}_Resume.pdf`
  }, [data.contact.name])

  return (
    <>
      <div className={`flex flex-col h-full bg-black/50 ${className}`}>
        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors touch-target"
                title="Fullscreen preview"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Preview</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <PDFDownloadLink
                document={<TemplateComponent data={data} design={design} />}
                fileName={fileName}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors touch-target"
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
                      <span className="hidden sm:inline">Download</span>
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

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col safe-area-inset-x"
            onClick={(e) => {
              // Close when clicking backdrop (not the PDF)
              if (e.target === e.currentTarget) setIsFullscreen(false)
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-black/50 border-b border-white/10 safe-area-inset-top">
              <h3 className="text-white font-medium text-sm sm:text-base">Resume Preview</h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <PDFDownloadLink
                  document={<TemplateComponent data={data} design={design} />}
                  fileName={fileName}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl transition-colors touch-target touch-active"
                  onClick={() => onDownload?.()}
                >
                  {({ loading }) =>
                    loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="hidden sm:inline">Preparing...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span className="hidden sm:inline">Download</span>
                      </>
                    )
                  }
                </PDFDownloadLink>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors touch-target touch-active"
                  title="Close preview"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Fullscreen PDF Viewer */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-start justify-center safe-area-inset-bottom">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full h-full max-w-4xl"
                style={{ minHeight: '70vh' }}
              >
                <PDFViewer
                  key={`fullscreen-${design.templateId}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  showToolbar={false}
                >
                  <TemplateComponent data={data} design={design} />
                </PDFViewer>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PDFPreview
