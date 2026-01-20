'use client'

// components/resume/studio/StudioLayout.tsx
// Studio layout with tabs and split view - Dark Theme

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FileText, Palette, LayoutGrid, Loader2, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useResume } from '@/contexts/ResumeContext'
import { AccordionEditor } from '@/components/resume/editor/AccordionEditor'
import { PDFDesignPanel } from '@/components/resume/design/PDFDesignPanel'
import { TemplatesPanel } from '@/components/resume/design/TemplatesPanel'
import { ParsedResume } from '@/lib/types/resume'

// Dynamic import for PDFPreview to avoid SSR issues
const PDFPreview = dynamic(
  () => import('./PDFPreview').then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-black/50">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    ),
  }
)

type TabId = 'content' | 'designer' | 'templates'

interface TabConfig {
  id: TabId
  label: string
  icon: React.ElementType
}

const TABS: TabConfig[] = [
  { id: 'content', label: 'Content Editor', icon: FileText },
  { id: 'designer', label: 'Designer', icon: Palette },
  { id: 'templates', label: 'Templates', icon: LayoutGrid },
]

export function StudioLayout() {
  const [activeTab, setActiveTab] = useState<TabId>('content')
  const [showPreview, setShowPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { resumeData, setResumeData, pdfDesign, updatePdfDesign } = useResume()

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleResumeChange = (data: ParsedResume) => {
    setResumeData(data)
  }

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId)
  }

  const renderLeftPanel = () => {
    switch (activeTab) {
      case 'content':
        return (
          <AccordionEditor
            resumeData={resumeData}
            onChange={handleResumeChange}
          />
        )
      case 'designer':
        return (
          <PDFDesignPanel
            design={pdfDesign}
            onDesignChange={updatePdfDesign}
          />
        )
      case 'templates':
        return <TemplatesPanel />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <div className="flex gap-1 px-4 overflow-x-auto items-center justify-between">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'text-purple-400 border-purple-500'
                      : 'text-white/60 border-transparent hover:text-white hover:border-white/30'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Preview Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                showPreview
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              )}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor/Designer (hidden on mobile when preview is shown) */}
        <div className={cn(
          "flex-1 border-r border-white/10 bg-black/30 backdrop-blur-xl overflow-y-auto",
          isMobile && showPreview && "hidden"
        )}>
          {renderLeftPanel()}
        </div>

        {/* Right Panel - PDF Preview (hidden on mobile unless preview is toggled) */}
        <div className={cn(
          "bg-black/50 overflow-hidden",
          isMobile
            ? showPreview ? "flex-1" : "hidden"
            : "w-[720px] flex-shrink-0"
        )}>
          <PDFPreview
            data={resumeData}
            design={pdfDesign}
            className="h-full"
            showControls={true}
          />
        </div>
      </div>
    </div>
  )
}

export default StudioLayout
