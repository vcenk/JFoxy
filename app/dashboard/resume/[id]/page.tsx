// app/dashboard/resume/[id]/page.tsx
// Glass Studio Resume Editor

'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ResumeProvider, useResume } from '@/contexts/ResumeContext'
import { ResumeCanvas } from '@/components/resume/studio/ResumeCanvas'
import { StudioLayout } from '@/components/resume/studio/StudioLayout'
import { useAutoSave } from '@/hooks/useAutoSave'
import { ArrowLeft, Download, Check, Loader2, X, FileEdit, ScanSearch, FileText } from 'lucide-react'
import { JobAnalysisView, JobAnalysisViewRef } from '@/components/resume/analysis/JobAnalysisView'
import { CoverLetterView, CoverLetterViewRef } from '@/components/resume/analysis/CoverLetterView'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { ExportDropdown } from '@/components/ui/ExportDropdown'
import { exportResumeToDocx } from '@/lib/utils/docxExport'
import { pdf } from '@react-pdf/renderer'
import { getTemplateComponent } from '@/lib/pdf/templates'


interface ResumeEditorContentProps {
  params: { id: string }
}

function ResumeEditorContent({ params }: ResumeEditorContentProps) {
  const router = useRouter()
  const {
    resumeData,
    setResumeData,
    sectionSettings,
    designerSettings,
    updateDesignerSettings,
    updateSectionSettings,
    pdfDesign,
    updatePdfDesign
  } = useResume()
  const [resumeId, setResumeId] = useState<string>(params.id)
  const [loading, setLoading] = useState(true)
  const [resumeTitle, setResumeTitle] = useState('')
  const [hasAnalysisResults, setHasAnalysisResults] = useState(false)
  const [hasCoverLetter, setHasCoverLetter] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const coverLetterRef = useRef<CoverLetterViewRef>(null)
  const jobAnalysisRef = useRef<JobAnalysisViewRef>(null)

  const [viewMode, setViewMode] = useState<'builder' | 'job-analysis' | 'cover-letter'>('builder');

  // Combine all data for saving
  const fullResumeData = useMemo(() => ({
    ...resumeData,
    _settings: {
      sections: sectionSettings,
      designer: designerSettings
    }
  }), [resumeData, sectionSettings, designerSettings])

  // Auto-save hook with full data including PDF design settings
  const { saving, lastSaved, triggerSave } = useAutoSave({
    resumeId: resumeId || '',
    data: fullResumeData,
    templateId: pdfDesign.templateId,
    designSettings: pdfDesign,
    enabled: !loading && resumeId !== null,
  })

  // Fetch resume data
  useEffect(() => {
    if (!resumeId) return

    const fetchResume = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`)
        const data = await response.json()

        if (data.success && data.resume) {
          setResumeTitle(data.resume.title)

          // Load PDF design settings from database if they exist
          if (data.resume.design_settings && Object.keys(data.resume.design_settings).length > 0) {
            updatePdfDesign(data.resume.design_settings)
          } else if (data.resume.template_id) {
            // If only template_id exists, update just the template
            updatePdfDesign({ templateId: data.resume.template_id })
          }

          // Check if analysis results exist
          if (data.resume.analysis_results) {
            setHasAnalysisResults(true)
          }

          // Check if cover letter exists for this resume
          const coverLetterResponse = await fetch(`/api/cover-letter/list?resumeId=${resumeId}`)
          const coverLetterData = await coverLetterResponse.json()
          // Fix: API returns data wrapped in 'data' object
          const coverLetters = coverLetterData.data?.coverLetters || coverLetterData.coverLetters || []
          if (coverLetterData.success && coverLetters.length > 0) {
            setHasCoverLetter(true)
          }

          if (data.resume.content) {
            const content = data.resume.content

            // Extract settings if they exist
            if (content._settings) {
              // Load section settings
              if (content._settings.sections) {
                Object.entries(content._settings.sections).forEach(([key, value]: [string, any]) => {
                  updateSectionSettings(key as any, value)
                })
              }

              // Load designer settings with proper deep merge for nested objects
              if (content._settings.designer) {
                // Deep merge nested pageNumbers to preserve defaults
                const designerFromDB = content._settings.designer
                if (designerFromDB.pageNumbers) {
                  // Ensure we don't lose the alignment property
                  updateDesignerSettings({
                    ...designerFromDB,
                    pageNumbers: {
                      enabled: designerFromDB.pageNumbers.enabled ?? false,
                      alignment: designerFromDB.pageNumbers.alignment ?? 'center',
                    }
                  })
                } else {
                  updateDesignerSettings(designerFromDB)
                }
              }

              // Remove _settings from resumeData before setting
              const { _settings, ...resumeContent } = content

              // Convert legacy string summary to JSONContent if needed
              if (resumeContent.summary && typeof resumeContent.summary === 'string') {
                resumeContent.summary = plainTextToJSON(resumeContent.summary)
              }

              // Convert legacy string bullets to JSONContent if needed
              if (resumeContent.experience && Array.isArray(resumeContent.experience)) {
                resumeContent.experience = resumeContent.experience.map((exp: any) => ({
                  ...exp,
                  bullets: exp.bullets?.map((bullet: any) =>
                    typeof bullet === 'string' ? plainTextToJSON(bullet) : bullet
                  ) || []
                }))
              }

              setResumeData(resumeContent)
            } else {
              // Convert legacy string summary to JSONContent if needed
              if (content.summary && typeof content.summary === 'string') {
                content.summary = plainTextToJSON(content.summary)
              }

              // Convert legacy string bullets to JSONContent if needed
              if (content.experience && Array.isArray(content.experience)) {
                content.experience = content.experience.map((exp: any) => ({
                  ...exp,
                  bullets: exp.bullets?.map((bullet: any) =>
                    typeof bullet === 'string' ? plainTextToJSON(bullet) : bullet
                  ) || []
                }))
              }

              setResumeData(content)
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch resume:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [resumeId, setResumeData, updateSectionSettings, updateDesignerSettings, updatePdfDesign])

  // Handle Print / Export PDF using React-PDF
  const handleExportPDF = async () => {
    if (viewMode === 'cover-letter' && coverLetterRef.current) {
      await coverLetterRef.current.handleDownload()
    } else if (viewMode === 'job-analysis' && jobAnalysisRef.current) {
      await jobAnalysisRef.current.handleExportReport()
    } else {
      try {
        setIsExporting(true)

        // Get the template component based on the current design
        const TemplateComponent = getTemplateComponent(pdfDesign.templateId)

        // Generate PDF using React-PDF - same as preview
        const blob = await pdf(
          <TemplateComponent data={resumeData as any} design={pdfDesign} />
        ).toBlob()

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${resumeTitle || 'Resume'}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('PDF generation failed:', error)
        alert('Failed to export PDF. Please try again.')
      } finally {
        setIsExporting(false)
      }
    }
  }

  const handleExportDOCX = async () => {
    if (viewMode === 'cover-letter' && coverLetterRef.current) {
      await coverLetterRef.current.handleExportDOCX()
    } else if (viewMode === 'job-analysis' && jobAnalysisRef.current) {
      await jobAnalysisRef.current.handleExportDOCX()
    } else {
      setIsExporting(true)
      try {
        // Export using the same design settings as the PDF preview
        await exportResumeToDocx(resumeData as any, resumeTitle || 'Resume', pdfDesign)
      } catch (error) {
        console.error('DOCX Export Error:', error)
        alert('Failed to export DOCX')
      } finally {
        setIsExporting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="h-screen flex flex-col p-2 sm:p-4 overflow-hidden">
        {/* Studio Header */}
        <div className="glass-panel py-1.5 px-2 sm:px-4 mb-3 mx-auto w-full max-w-6xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Back + Title */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink">
              <button
                onClick={() => router.push('/dashboard/resume')}
                className="glass-panel px-2 sm:px-3 py-1.5 hover:bg-white/15 transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
              </button>

              <div className="min-w-0 flex-shrink">
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={e => {
                    setResumeTitle(e.target.value)
                    triggerSave()
                  }}
                  className="text-sm sm:text-lg font-bold text-white bg-transparent border-none focus:outline-none focus:ring-0 px-1 sm:px-2 py-0.5 rounded hover:bg-white/10 transition-all w-full max-w-[120px] sm:max-w-[200px] md:max-w-[300px] truncate"
                  placeholder="Resume Title"
                />
                <div className="hidden sm:flex items-center space-x-2 text-sm text-white/60 px-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : lastSaved ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span>Saved {lastSaved}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">

              {/* Resume-JD Analysis Button */}
              <button
                onClick={() => setViewMode('job-analysis')}
                className={`
                  px-2 py-1.5 sm:px-3 md:px-4 rounded-lg sm:rounded-xl border border-white/10 transition-all flex items-center gap-1 sm:gap-2 relative flex-shrink-0
                  ${viewMode === 'job-analysis'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : hasAnalysisResults
                      ? 'glass-panel border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-white'
                      : 'glass-panel hover:bg-white/15 text-white/80 hover:text-white'}
                `}
                title="Resume Analysis"
              >
                <ScanSearch className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium min-w-0 truncate hidden md:inline">Analysis</span>
                {hasAnalysisResults && viewMode !== 'job-analysis' && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex items-center justify-center w-4 h-4 sm:w-auto sm:h-auto sm:gap-1 bg-green-500 text-white sm:px-2 sm:py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Ready</span>
                  </span>
                )}
              </button>

              {/* Cover Letter Button */}
              <button
                onClick={() => setViewMode('cover-letter')}
                className={`
                  px-2 py-1.5 sm:px-3 md:px-4 rounded-lg sm:rounded-xl border border-white/10 transition-all flex items-center gap-1 sm:gap-2 relative flex-shrink-0
                  ${viewMode === 'cover-letter'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : hasCoverLetter
                      ? 'glass-panel border-green-500/30 bg-green-500/5 hover:bg-green-500/10 text-white'
                      : 'glass-panel hover:bg-white/15 text-white/80 hover:text-white'}
                `}
                title="Cover Letter"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium min-w-0 truncate hidden md:inline">Cover Letter</span>
                {hasCoverLetter && viewMode !== 'cover-letter' && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 flex items-center justify-center w-4 h-4 sm:w-auto sm:h-auto sm:gap-1 bg-green-500 text-white sm:px-2 sm:py-0.5 rounded-full text-[10px] font-bold shadow-lg">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Ready</span>
                  </span>
                )}
              </button>

              {/* Back to Editor Button - Show when not in builder mode */}
              {viewMode !== 'builder' && (
                <button
                  onClick={() => setViewMode('builder')}
                  className="glass-panel px-2 py-1.5 sm:px-3 md:px-4 rounded-lg sm:rounded-xl border border-white/10 hover:bg-white/15 transition-all flex items-center gap-1 sm:gap-2 text-white/80 hover:text-white flex-shrink-0"
                  title="Back to Editor"
                >
                  <FileEdit className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium min-w-0 truncate hidden md:inline">Editor</span>
                </button>
              )}

              <ExportDropdown
                onExportPDF={handleExportPDF}
                onExportDOCX={handleExportDOCX}
                isExporting={isExporting}
                variant="outline"
                label="Export"
              />
            </div>
          </div>
        </div>

        {/* Studio Layout */}
        <div className="flex-1 flex overflow-hidden rounded-2xl relative">
          {viewMode === 'builder' ? (
            <StudioLayout />
          ) : viewMode === 'job-analysis' ? (
            <div className="w-full bg-black/30 backdrop-blur-xl overflow-y-auto">
              {resumeId && (
                <JobAnalysisView
                  ref={jobAnalysisRef}
                  resumeId={resumeId}
                  onSwitchToBuilder={() => setViewMode('builder')}
                />
              )}
            </div>
          ) : (
            <div className="w-full bg-black/30 backdrop-blur-xl overflow-y-auto">
              {resumeId && (
                <CoverLetterView
                  ref={coverLetterRef}
                  resumeId={resumeId}
                  contactInfo={resumeData.contact}
                  onCoverLetterGenerated={() => setHasCoverLetter(true)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          /* Hide everything except the canvas */
          .glass-panel,
          nav,
          button,
          header,
          aside,
          .no-print {
            display: none !important;
          }

          /* Show only the resume paper */
          #resume-paper, .resume-paper {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0.5in !important;
            box-shadow: none !important;
            background: white !important;
          }

          /* For JSON Resume themes */
          #resume-theme-iframe {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            border: none !important;
          }

          /* Hide scrollbars and other UI elements */
          .overflow-y-auto, .overflow-x-auto {
            overflow: visible !important;
          }

          /* Ensure proper pagination */
          .print-avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </>
  )
}

// Page wrapper to handle async params and provide ResumeContext
export default function ResumePage({ params }: ResumeEditorContentProps) {
  return (
    <ResumeProvider>
      <ResumeEditorContent params={params} />
    </ResumeProvider>
  )
}
