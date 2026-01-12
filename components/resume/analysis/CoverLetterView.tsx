// components/resume/analysis/CoverLetterView.tsx
'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, FileText, AlertCircle, Copy, Check, Download, Sparkles, Info, RefreshCw, PanelLeftClose, PanelLeftOpen, Zap, Minimize2, TrendingUp, Award, Briefcase, X } from 'lucide-react'
import { ExportDropdown } from '@/components/ui/ExportDropdown'
import { exportCoverLetterToDocx } from '@/lib/utils/docxExport'
import { ContactInfo } from '@/lib/types/resume'

export interface CoverLetterViewRef {
  handleDownload: () => Promise<void>
  handleExportDOCX: () => Promise<void>
}

interface CoverLetterViewProps {
  resumeId: string
  contactInfo?: ContactInfo
  onCoverLetterGenerated?: () => void
}

export const CoverLetterView = forwardRef<CoverLetterViewRef, CoverLetterViewProps>(({ resumeId, contactInfo, onCoverLetterGenerated }, ref) => {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<'professional' | 'enthusiastic' | 'friendly'>('professional')
  const [generating, setGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loadingJobInfo, setLoadingJobInfo] = useState(true)
  const [refinePrompt, setRefinePrompt] = useState('')
  const [showRefineInput, setShowRefineInput] = useState(false)
  const [refining, setRefining] = useState(false)
  const [existingCoverLetter, setExistingCoverLetter] = useState<any>(null)
  const [selectedText, setSelectedText] = useState('')
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null)
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [showRefinePopover, setShowRefinePopover] = useState(false)

  // Helper to get display name from contact info
  const getDisplayName = () => {
    if (contactInfo?.name) return contactInfo.name
    if (contactInfo?.firstName || contactInfo?.lastName) {
      return `${contactInfo.firstName || ''} ${contactInfo.lastName || ''}`.trim()
    }
    return ''
  }

  // Helper to build contact line (email | phone | location | linkedin)
  const getContactLine = () => {
    const parts: string[] = []
    if (contactInfo?.email && contactInfo?.emailEnabled !== false) parts.push(contactInfo.email)
    if (contactInfo?.phone && contactInfo?.phoneEnabled !== false) parts.push(contactInfo.phone)
    if (contactInfo?.location && contactInfo?.locationEnabled !== false) parts.push(contactInfo.location)
    if (contactInfo?.linkedin && contactInfo?.linkedinEnabled !== false) {
      // Clean up LinkedIn URL for display (remove https:// prefix)
      const linkedinDisplay = contactInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')
      parts.push(linkedinDisplay)
    }
    return parts.join(' | ')
  }

  const displayName = getDisplayName()
  const contactLine = getContactLine()
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Load existing cover letter and job info
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('[CoverLetterView] Loading data for resume:', resumeId)

        // Load existing cover letters first
        const coverLetterResponse = await fetch(`/api/cover-letter/list?resumeId=${resumeId}`)
        const coverLetterData = await coverLetterResponse.json()

        console.log('[CoverLetterView] API Response:', coverLetterData)
        console.log('[CoverLetterView] Resume ID we are querying:', resumeId)

        let hasExistingCoverLetter = false

        // Fix: The API returns data wrapped in a 'data' object
        const allCoverLetters = coverLetterData.data?.coverLetters || coverLetterData.coverLetters || []
        console.log('[CoverLetterView] Total cover letters found:', allCoverLetters.length)

        // Filter by current tone or default to professional
        const currentTone = tone
        const coverLetterForTone = allCoverLetters.find((cl: any) => cl.tone === currentTone)

        console.log('[CoverLetterView] Looking for tone:', currentTone)
        console.log('[CoverLetterView] Available tones:', allCoverLetters.map((cl: any) => cl.tone))

        if (coverLetterData.success && coverLetterForTone) {
          // Load the cover letter for the current tone
          hasExistingCoverLetter = true

          setExistingCoverLetter(coverLetterForTone)
          setCoverLetter(coverLetterForTone.content)
          setJobTitle(coverLetterForTone.position_title || '')
          setCompany(coverLetterForTone.company_name || '')
          // Don't override tone - it's already set

          console.log('[CoverLetterView] ✅ Loaded cover letter for tone:', currentTone)
          console.log('[CoverLetterView] Cover letter ID:', coverLetterForTone.id)
          console.log('[CoverLetterView] Content length:', coverLetterForTone.content?.length)
        } else if (coverLetterData.success && allCoverLetters.length > 0) {
          // No cover letter for this tone, but others exist
          console.log('[CoverLetterView] No cover letter found for tone:', currentTone)
          console.log('[CoverLetterView] But found', allCoverLetters.length, 'cover letter(s) with other tones')

          // Load job info from any existing cover letter
          const anyLetter = allCoverLetters[0]
          setJobTitle(anyLetter.position_title || '')
          setCompany(anyLetter.company_name || '')
        } else {
          console.log('[CoverLetterView] No existing cover letters found')
        }

        // Load job description from resume
        const response = await fetch(`/api/resume/${resumeId}`)
        const data = await response.json()

        console.log('[CoverLetterView] Resume data:', {
          success: data.success,
          hasResume: !!data.resume,
          jobDescriptionId: data.resume?.job_description_id
        })

        if (data.success && data.resume && data.resume.job_description_id) {
          console.log('[CoverLetterView] Fetching job description:', data.resume.job_description_id)
          const jdResponse = await fetch(`/api/job-description/${data.resume.job_description_id}`)
          const jdData = await jdResponse.json()

          console.log('[CoverLetterView] Job description data:', {
            success: jdData.success,
            hasJobDescription: !!jdData.data?.jobDescription,
            title: jdData.data?.jobDescription?.title,
            company: jdData.data?.jobDescription?.company
          })

          if (jdData.success && jdData.data?.jobDescription) {
            // Only update job title and company if we DON'T have an existing cover letter
            // Always load job description for context
            if (!hasExistingCoverLetter) {
              setJobTitle(jdData.data.jobDescription.title || '')
              setCompany(jdData.data.jobDescription.company || '')
              console.log('[CoverLetterView] Set job info from JD')
            } else {
              console.log('[CoverLetterView] Skipped JD info - using existing cover letter data')
            }
            setJobDescription(jdData.data.jobDescription.description || '')
          } else {
            console.warn('[CoverLetterView] Job description fetch failed:', jdData)
          }
        } else {
          console.log('[CoverLetterView] No job description linked to resume')
        }
      } catch (err) {
        console.error('[CoverLetterView] Failed to load data:', err)
      } finally {
        setLoadingJobInfo(false)
      }
    }

    loadData()
  }, [resumeId])

  // Reload cover letter when tone changes
  useEffect(() => {
    const loadCoverLetterForTone = async () => {
      try {
        const coverLetterResponse = await fetch(`/api/cover-letter/list?resumeId=${resumeId}`)
        const coverLetterData = await coverLetterResponse.json()

        const allCoverLetters = coverLetterData.data?.coverLetters || coverLetterData.coverLetters || []
        const coverLetterForTone = allCoverLetters.find((cl: any) => cl.tone === tone)

        console.log('[CoverLetterView] Tone changed to:', tone)
        console.log('[CoverLetterView] Found cover letter for this tone:', !!coverLetterForTone)

        if (coverLetterForTone) {
          setExistingCoverLetter(coverLetterForTone)
          setCoverLetter(coverLetterForTone.content)
          console.log('[CoverLetterView] ✅ Switched to', tone, 'cover letter')
        } else {
          // Clear current cover letter if no match for this tone
          setCoverLetter(null)
          setExistingCoverLetter(null)
          console.log('[CoverLetterView] No cover letter exists for', tone, 'tone')
        }
      } catch (err) {
        console.error('[CoverLetterView] Failed to load cover letter for tone:', err)
      }
    }

    // Only reload if we already loaded initially
    if (!loadingJobInfo && resumeId) {
      loadCoverLetterForTone()
    }
  }, [tone, resumeId, loadingJobInfo])

  const handleGenerate = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          jobTitle: jobTitle.trim(),
          companyName: company.trim() || null,
          jobDescription: jobDescription.trim(),
          tone,
        }),
      })

      if (!response.ok) {
        let errorMessage = `Generation failed with status ${response.status}`
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError)
        }
        console.error('Cover letter generation error:', errorMessage)
        setError(errorMessage)
        return
      }

      const data = await response.json()
      console.log('Cover letter response:', data)

      if (data.success && data.data?.coverLetter) {
        setCoverLetter(data.data.coverLetter.content)
        setExistingCoverLetter(data.data.coverLetter)
        // Notify parent component that cover letter was generated
        if (onCoverLetterGenerated) {
          onCoverLetterGenerated()
        }
      } else {
        const errorMsg = data.error || 'Generation failed. Please try again.'
        console.error('Generation failed:', errorMsg)
        setError(errorMsg)
      }
    } catch (err: any) {
      console.error('Cover letter generation error:', err)
      const errorMessage = err.message || 'An unexpected error occurred. Please try again.'
      setError(errorMessage)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!coverLetter) return
    try {
      await navigator.clipboard.writeText(coverLetter)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = async () => {
    if (!coverLetter) return

    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20 // Reduced margin for more space
      const maxWidth = pageWidth - (margin * 2)
      const footerHeight = 20
      const signatureHeight = displayName ? 25 : 0 // Space needed for signature block
      const contentBottom = pageHeight - margin - footerHeight - signatureHeight
      let yPos = margin

      // Contact Header - Centered (matches preview)
      if (displayName) {
        doc.setFontSize(16) // Slightly smaller
        doc.setFont('times', 'bold')
        doc.setTextColor(106, 71, 255) // JobFoxy Purple
        doc.text(displayName, pageWidth / 2, yPos, { align: 'center' })
        yPos += 6

        if (contactLine) {
          doc.setFontSize(9)
          doc.setFont('times', 'normal')
          doc.setTextColor(120, 120, 120)
          doc.text(contactLine, pageWidth / 2, yPos, { align: 'center' })
          yPos += 6
        }

        // Divider line
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 8
      }

      // Date
      doc.setFontSize(10)
      doc.setFont('times', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(dateStr, margin, yPos)
      yPos += 8

      // Job Info Block
      if (jobTitle) {
        doc.setFont('times', 'bold')
        doc.setTextColor(60, 60, 60)
        doc.text(`Re: ${jobTitle}`, margin, yPos)
        yPos += 5
        doc.setFont('times', 'normal')
      }

      if (company) {
        doc.setTextColor(100, 100, 100)
        doc.text(company, margin, yPos)
        yPos += 10
      } else {
        yPos += 6
      }

      // Body Content - tighter line spacing
      const paragraphs = coverLetter.split('\n')

      doc.setTextColor(40, 40, 40)
      doc.setFontSize(10) // Slightly smaller for better fit
      doc.setFont('times', 'normal')

      paragraphs.forEach(paragraph => {
        const trimmed = paragraph.trim()
        if (!trimmed) {
            yPos += 3
            return
        }

        const lines = doc.splitTextToSize(trimmed, maxWidth)

        lines.forEach((line: string) => {
            // Check if we need a new page (leave room for signature on first page)
            if (yPos + 4.5 > contentBottom) {
                doc.addPage()
                yPos = margin
            }
            doc.text(line, margin, yPos)
            yPos += 4.5 // Tighter line height
        })
        yPos += 4 // Paragraph spacing
      })

      // Signature Block (matches preview) - keep together
      if (displayName) {
        // Check if signature fits on current page
        const signatureNeeded = 20 // "Sincerely," + name + spacing
        if (yPos + signatureNeeded > pageHeight - margin - footerHeight) {
          doc.addPage()
          yPos = margin
        }

        yPos += 6
        doc.setFontSize(10)
        doc.setFont('times', 'italic')
        doc.setTextColor(80, 80, 80)
        doc.text('Sincerely,', margin, yPos)
        yPos += 8
        doc.setFont('times', 'bold')
        doc.setTextColor(60, 60, 60)
        doc.text(displayName, margin, yPos)
      }

      // Footer on last page
      const footerY = pageHeight - 12
      doc.setDrawColor(240, 240, 240)
      doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4)

      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      doc.text('Generated by JobFoxy', pageWidth / 2, footerY, { align: 'center' })

      // Save PDF
      const fileName = `Cover-Letter-${jobTitle?.replace(/\s+/g, '-') || 'Document'}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

    } catch (err) {
      console.error('PDF Export Error:', err)
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDOCX = async () => {
    if (!coverLetter) return
    setIsExporting(true)
    try {
      await exportCoverLetterToDocx(
        coverLetter,
        jobTitle || 'Job Application',
        company || '',
        displayName,
        contactLine
      )
    } catch (err) {
      console.error('DOCX Export Error:', err)
      setError('Failed to generate DOCX. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Expose handles to parent
  useImperativeHandle(ref, () => ({
    handleDownload,
    handleExportDOCX
  }))

  const handleRefine = async (customPrompt?: string) => {
    const prompt = customPrompt || refinePrompt
    if (!prompt.trim() || !coverLetter) return

    setRefining(true)
    setError(null)

    try {
      const response = await fetch('/api/cover-letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCoverLetter: coverLetter,
          refinePrompt: prompt.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Refinement failed')
      }

      const data = await response.json()

      if (data.success && data.data?.refinedCoverLetter) {
        setCoverLetter(data.data.refinedCoverLetter)
        setRefinePrompt('')
        setShowRefineInput(false)
      }
    } catch (err: any) {
      console.error('Refinement error:', err)
      setError(err.message || 'Failed to refine cover letter. Please try again.')
    } finally {
      setRefining(false)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString())
      // We'll use this for regenerating specific parts
    }
  }

  const handleRegenerateSelection = async () => {
    if (!selectedText || !coverLetter) return

    setRefining(true)
    setError(null)

    try {
      const response = await fetch('/api/cover-letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCoverLetter: coverLetter,
          refinePrompt: `Rewrite this specific part: "${selectedText}". Make it more compelling and professional. Keep the rest of the letter the same.`,
        }),
      })

      if (!response.ok) {
        throw new Error('Regeneration failed')
      }

      const data = await response.json()

      if (data.success && data.data?.refinedCoverLetter) {
        setCoverLetter(data.data.refinedCoverLetter)
        setSelectedText('')
      }
    } catch (err: any) {
      console.error('Regeneration error:', err)
      setError(err.message || 'Failed to regenerate selection. Please try again.')
    } finally {
      setRefining(false)
    }
  }

  if (loadingJobInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading job information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-[1600px] mx-auto">
      <div className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Cover Letter Generator</h2>
          <p className="text-white/60 text-sm sm:text-base">
            Create tailored cover letters for your job applications
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden relative">

          {/* Collapse/Expand Button */}
          <button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-6 h-12 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 rounded-r-lg transition-all group"
            style={{ left: leftPanelCollapsed ? 0 : 'calc(41.666% - 12px)' }}
            title={leftPanelCollapsed ? 'Show input form' : 'Hide input form'}
          >
            {leftPanelCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* LEFT COLUMN: Input Form */}
          <AnimatePresence initial={false}>
            {!leftPanelCollapsed && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full lg:w-5/12 xl:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar overflow-hidden"
              >
            
            {/* Job Info Banner */}
            {jobTitle && jobDescription && (
              <div className="glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">Job Information Loaded</h4>
                    <p className="text-xs text-white/70">
                      Using job description from your resume analysis: <span className="font-medium text-blue-300">{jobTitle}</span>
                      {company && <span className="text-white/50"> at {company}</span>}
                    </p>
                    <p className="text-xs text-white/50 mt-1">You can edit the details below if needed.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Input Fields */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Job Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Company <span className="text-white/40 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['professional', 'enthusiastic', 'friendly'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-2.5 rounded-xl border transition-all text-sm font-medium ${tone === t
                          ? 'bg-purple-500 border-purple-500 text-white'
                          : 'bg-black/20 border-white/10 text-white/70 hover:border-white/20'}`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div className="flex flex-col flex-1">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Job Description <span className="text-red-400">*</span>
                </label>
                <div className="glass-panel p-1 rounded-xl border border-white/10 relative group focus-within:border-purple-500/50 transition-colors min-h-[200px]">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-full min-h-[200px] bg-transparent border-none resize-none p-4 text-white placeholder-white/30 focus:outline-none focus:ring-0 text-sm leading-relaxed"
                  />
                  {jobDescription.length > 0 && (
                    <div className="absolute bottom-3 right-3 text-xs text-white/40">
                      {jobDescription.length} chars
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </motion.div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating || !jobTitle.trim() || !jobDescription.trim()}
                className={`
                  w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all mt-2
                  ${generating || !jobTitle.trim() || !jobDescription.trim()
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'glow-button text-white hover:scale-[1.01] active:scale-[0.99]'}
                `}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {existingCoverLetter || coverLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT COLUMN: Output Canvas */}
          <div className={`flex flex-col gap-4 overflow-hidden h-full transition-all duration-300 ${leftPanelCollapsed ? 'w-full' : 'w-full lg:w-7/12 xl:w-2/3'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Preview
              </h3>

              {coverLetter && (
                <div className="flex items-center gap-2">
                  {/* Refine Button */}
                  <button
                    onClick={() => setShowRefinePopover(!showRefinePopover)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm border ${
                      showRefinePopover
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white/5 hover:bg-purple-500/20 text-white border-white/10 hover:border-purple-500/30'
                    } ${refining ? 'animate-pulse' : ''}`}
                  >
                    {refining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Refine
                  </button>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <ExportDropdown
                    onExportPDF={handleDownload}
                    onExportDOCX={handleExportDOCX}
                    isExporting={isExporting}
                    variant="glass"
                  />
                </div>
              )}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-black/20 rounded-2xl p-4 sm:p-6 border border-white/5 relative">
              {coverLetter ? (
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white text-gray-900 p-8 sm:p-12 shadow-2xl rounded-sm mx-auto max-w-[800px]"
                  >
                    {/* Contact Header - Centered */}
                    {displayName && (
                      <div className="text-center mb-4">
                        <h1 className="text-lg sm:text-xl font-bold text-[#6A47FF] mb-1">
                          {displayName}
                        </h1>
                        {contactLine && (
                          <p className="text-[10pt] sm:text-[11pt] text-gray-500">
                            {contactLine}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Divider Line */}
                    {displayName && (
                      <div className="border-t border-gray-200 my-4" />
                    )}

                    {/* Date and Job Info */}
                    <div className="mb-6 font-serif">
                      <p className="text-[11pt] sm:text-[12pt] text-gray-600 mb-4">{dateStr}</p>
                      {jobTitle && (
                        <p className="text-[11pt] sm:text-[12pt] font-semibold text-gray-800">
                          Re: {jobTitle}
                        </p>
                      )}
                      {company && (
                        <p className="text-[11pt] sm:text-[12pt] text-gray-600">{company}</p>
                      )}
                    </div>

                    {/* Cover Letter Content */}
                    <div
                      className="font-serif leading-relaxed whitespace-pre-wrap text-[11pt] sm:text-[12pt] select-text text-gray-800"
                      onMouseUp={handleTextSelection}
                    >
                      {coverLetter}
                    </div>

                    {/* Signature Block */}
                    {displayName && (
                      <div className="mt-8 font-serif">
                        <p className="text-[11pt] sm:text-[12pt] italic text-gray-700 mb-4">Sincerely,</p>
                        <p className="text-[11pt] sm:text-[12pt] font-semibold text-gray-800">{displayName}</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Selection Regenerate Button */}
                  {selectedText && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
                    >
                      <div className="glass-panel px-4 py-3 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-xl flex items-center gap-3">
                        <div className="text-white/80 text-sm max-w-[200px] truncate">
                          <span className="font-medium">{selectedText.length}</span> characters selected
                        </div>
                        <button
                          onClick={handleRegenerateSelection}
                          disabled={refining}
                          className={`
                            px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2
                            ${refining
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'}
                          `}
                        >
                          {refining ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Rewriting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4" />
                              Regenerate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedText('')}
                          className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-xl bg-white/5 p-8 text-center">
                  {generating ? (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex flex-col items-center"
                    >
                      <Loader2 className="w-12 h-12 mb-4 text-purple-500 animate-spin" />
                      <p className="text-lg font-medium text-white/80">Drafting your cover letter...</p>
                      <p className="text-sm mt-2">Analyzing your resume against the job description</p>
                    </motion.div>
                  ) : (
                    <>
                      <FileText className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No Cover Letter Generated Yet</p>
                      <p className="text-sm max-w-xs mx-auto">
                        Fill in the job details on the left and click "Generate" to create a tailored cover letter.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Slide-out Refine Panel from Right */}
            <AnimatePresence>
              {showRefinePopover && coverLetter && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 top-0 bottom-0 w-64 glass-panel border-l border-purple-500/30 bg-gray-900/98 backdrop-blur-xl shadow-2xl z-10 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Refine
                    </h3>
                    <button
                      onClick={() => setShowRefinePopover(false)}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-3">
                    {refining && (
                      <div className="flex items-center gap-2 text-purple-300 text-xs mb-3 bg-purple-500/10 p-2 rounded-lg">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Refining...
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-1.5 mb-4">
                      {[
                        { label: 'Shorter', icon: Minimize2, prompt: 'Make the cover letter more concise and shorter while keeping the key points' },
                        { label: 'Professional', icon: Briefcase, prompt: 'Make the tone more formal and professional' },
                        { label: 'Enthusiastic', icon: Zap, prompt: 'Add more enthusiasm and energy to the cover letter' },
                        { label: 'Highlight Skills', icon: Award, prompt: 'Emphasize my technical skills and achievements more prominently' },
                        { label: 'Better Opening', icon: TrendingUp, prompt: 'Rewrite the opening paragraph to be more attention-grabbing and compelling' },
                      ].map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleRefine(action.prompt)}
                          disabled={refining}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all w-full text-left
                            ${refining
                              ? 'bg-white/5 text-white/30 cursor-not-allowed'
                              : 'bg-white/5 hover:bg-purple-500/20 text-white/80 hover:text-white'}
                          `}
                        >
                          <action.icon className="w-4 h-4 flex-shrink-0" />
                          {action.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Input */}
                    <div className="border-t border-white/10 pt-3">
                      <textarea
                        value={refinePrompt}
                        onChange={(e) => setRefinePrompt(e.target.value)}
                        placeholder="Custom instruction..."
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none h-16"
                      />
                      <button
                        onClick={() => handleRefine()}
                        disabled={refining || !refinePrompt.trim()}
                        className={`
                          w-full mt-2 px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2
                          ${refining || !refinePrompt.trim()
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600 text-white'}
                        `}
                      >
                        {refining ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  )
})

CoverLetterView.displayName = 'CoverLetterView'
