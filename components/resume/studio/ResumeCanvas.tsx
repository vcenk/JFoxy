// components/resume/studio/ResumeCanvas.tsx
// Simplified Resume Canvas using React-PDF

'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { useResume } from '@/contexts/ResumeContext'
import { Loader2 } from 'lucide-react'

// Dynamic import for PDFPreview to avoid SSR issues
const PDFPreview = dynamic(
  () => import('./PDFPreview').then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-900/50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-2" />
          <p className="text-white/60 text-sm">Loading PDF Preview...</p>
        </div>
      </div>
    ),
  }
)

export const ResumeCanvas = () => {
  const { resumeData, pdfDesign } = useResume()

  return (
    <PDFPreview
      data={resumeData}
      design={pdfDesign}
      className="flex-1 h-full"
      showControls={true}
    />
  )
}
