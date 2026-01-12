// components/resume/analysis/JobAnalysisView.tsx
'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Target, FileText, Check, AlertCircle, Download } from 'lucide-react'
import { AnalysisDashboard, AnalysisData } from './AnalysisDashboard'
import { ResumeAnalysisResult } from '@/lib/types/analysis'
import { UpgradeModal } from '@/components/ui/UpgradeModal'
import { getAvailableIndustries } from '@/lib/data/atsKeywords'
import { useResume } from '@/contexts/ResumeContext'
import { plainTextToJSON, jsonToPlainText } from '@/lib/utils/richTextHelpers'
import { ExportDropdown } from '@/components/ui/ExportDropdown'
import { exportAnalysisReportToDocx } from '@/lib/utils/docxExport'
import { OptimizeConfirmModal } from './OptimizeConfirmModal'
import { useToast } from '@/contexts/ToastContext'

export interface JobAnalysisViewRef {
  handleExportReport: () => Promise<void>
  handleExportDOCX: () => Promise<void>
}

interface JobAnalysisViewProps {
  resumeId: string
  currentResumeText?: string // Optional context for display
  onSwitchToBuilder?: () => void // Callback to switch to builder view
}

export const JobAnalysisView = forwardRef<JobAnalysisViewRef, JobAnalysisViewProps>(({ resumeId, currentResumeText, onSwitchToBuilder }, ref) => {
  const router = useRouter()
  const toast = useToast()
  const { resumeData, setResumeData } = useResume()
  const containerRef = useRef<HTMLDivElement>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showOptimizeModal, setShowOptimizeModal] = useState(false)
  const [optimizationComplete, setOptimizationComplete] = useState(false)
  const [optimizationMessage, setOptimizationMessage] = useState('')
  const [resumeRawText, setResumeRawText] = useState<string>('')

  // Get available industries for dropdown
  const availableIndustries = getAvailableIndustries()

  // Load existing analysis results on mount
  useEffect(() => {
    const loadExistingAnalysis = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`)
        const data = await response.json()

        if (data.success && data.resume) {
          // Check if there's existing analysis results
          if (data.resume.analysis_results) {
            const results = data.resume.analysis_results

            // Set analysis result
            setAnalysisResult({
              ats_score: results.ats_score || 0,
              jd_match_score: results.jd_match_score || 0,
              skills_fit_score: results.skills_fit_score || 0,
              ats_score_explanation: results.ats_score_explanation,
              job_match_explanation: results.job_match_explanation,
              skills_fit_explanation: results.skills_fit_explanation,
              keyword_strategy: results.keyword_strategy,
              ats_health_check: results.ats_health_check,
              skills_breakdown_coaching: results.skills_breakdown_coaching,
              strength_highlights: results.strength_highlights,
              coaching_summary: results.coaching_summary,
              bullet_improvements: results.bullet_improvements,
              resume_keywords: results.resume_keywords || [],
              jd_keywords: results.jd_keywords || [],
              matched_keywords: results.matched_keywords || [],
              missing_keywords: results.missing_keywords || [],
              ats_warnings: results.ats_warnings || [],
              ats_good_practices: results.ats_good_practices || [],
              power_words: results.power_words,
              quantification: results.quantification,
              keyword_coverage: results.keyword_coverage,
              keyword_analysis: results.keyword_analysis || { missing: [], present: [] },
              weaknesses: results.weaknesses || [],
              strengths: results.strengths || [],
              formatting_issues: results.formatting_issues || [],
              skills_radar_data: results.skills_radar_data || [],
              missing_skills: results.missing_skills || [],
              section_feedback: results.section_feedback || [],
              jd_requirements: results.jd_requirements || [],
            })
          }

          // Store resume raw text for ATS keyword analysis
          if (data.resume.raw_text) {
            setResumeRawText(data.resume.raw_text)
          }

          // Load job description info if available
          if (data.resume.job_description_id) {
            const jdResponse = await fetch(`/api/job-description/${data.resume.job_description_id}`)
            const jdData = await jdResponse.json()

            if (jdData.success && jdData.data?.jobDescription) {
              setJobTitle(jdData.data.jobDescription.title || '')
              setCompany(jdData.data.jobDescription.company || '')
              setJobDescription(jdData.data.jobDescription.description || '')
            }
          }
        }
      } catch (err) {
        console.error('Failed to load existing analysis:', err)
      } finally {
        setLoadingExisting(false)
      }
    }

    loadExistingAnalysis()
  }, [resumeId])

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          jobTitle: jobTitle.trim(),
          jobCompany: company.trim() || null,
          jobText: jobDescription.trim(),
          industry: industry || null,
          createTailoredVersion: true, // Create tailored resume and redirect to it
        }),
      })

      if (!response.ok) {
        // Handle Limit Reached
        if (response.status === 403) {
          const data = await response.json()
          if (data.code === 'LIMIT_REACHED') {
            setShowUpgradeModal(true)
            setAnalyzing(false)
            return
          }
        }

        let errorMessage = `Analysis failed with status ${response.status}`
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError)
        }
        console.error('Analysis API error:', errorMessage)
        setError(errorMessage)
        return
      }

      const data = await response.json()
      console.log('Analysis response:', data)

      if (data.success) {
        const result: ResumeAnalysisResult & { newResumeId?: string } = data.data

        // Validate that we have the required fields
        if (!result || typeof result.ats_score === 'undefined') {
          console.error('Invalid analysis result:', result)
          setError('Received invalid analysis results. Please try again.')
          return
        }

        // If a new tailored resume was created, redirect to it
        if (result.newResumeId) {
          router.push(`/dashboard/resume/${result.newResumeId}`)
        } else {
          // Otherwise show analysis results inline
          console.log('Setting analysis result with coaching data:', result)
          setAnalysisResult({
            ats_score: result.ats_score,
            jd_match_score: result.jd_match_score || 0,
            skills_fit_score: result.skills_fit_score || 0,

            // NEW: Coaching explanations
            ats_score_explanation: result.ats_score_explanation,
            job_match_explanation: result.job_match_explanation,
            skills_fit_explanation: result.skills_fit_explanation,
            keyword_strategy: result.keyword_strategy,
            ats_health_check: result.ats_health_check,
            skills_breakdown_coaching: result.skills_breakdown_coaching,
            strength_highlights: result.strength_highlights,
            coaching_summary: result.coaching_summary,
            bullet_improvements: result.bullet_improvements,

            // Enhanced keyword data
            resume_keywords: result.resume_keywords || [],
            jd_keywords: result.jd_keywords || [],
            matched_keywords: result.matched_keywords || [],
            missing_keywords: result.missing_keywords || [],

            // ATS warnings and good practices
            ats_warnings: result.ats_warnings || [],
            ats_good_practices: result.ats_good_practices || [],

            // Phase 1: Power Words & ATS Optimization
            power_words: result.power_words,
            quantification: result.quantification,
            keyword_coverage: result.keyword_coverage,

            // Original fields
            keyword_analysis: result.keyword_analysis || { missing: [], present: [] },
            weaknesses: result.weaknesses || [],
            strengths: result.strengths || [],
            formatting_issues: result.formatting_issues || [],
            skills_radar_data: result.skills_radar_data || [],
            missing_skills: result.missing_skills || [],
            section_feedback: result.section_feedback || [],
            jd_requirements: result.jd_requirements || [],
          })
        }
      } else {
        const errorMsg = data.error || 'Analysis failed. Please try again.'
        console.error('Analysis failed:', errorMsg)
        setError(errorMsg)
      }
    } catch (err: any) {
      console.error('Analysis error:', err)
      const errorMessage = err.message || 'An unexpected error occurred. Please check your internet connection and try again.'
      setError(errorMessage)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleExportReport = async () => {
    if (!analysisResult) return

    try {
      // Dynamically import jsPDF
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      const maxWidth = pageWidth - (margin * 2)
      let yPos = 0

      // --- Helper Functions ---
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [60, 60, 60], align: 'left' | 'center' | 'right' = 'left', xOffset: number = margin) => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.setTextColor(color[0], color[1], color[2])

        const lines = doc.splitTextToSize(text, maxWidth)

        lines.forEach((line: string) => {
          if (yPos + fontSize * 0.4 > pageHeight - margin) {
            doc.addPage()
            yPos = margin
          }
          doc.text(line, xOffset, yPos, { align })
          yPos += fontSize * 0.5
        })
      }

      const addSectionHeader = (title: string) => {
        yPos += 5
        if (yPos > pageHeight - margin - 20) { doc.addPage(); yPos = margin + 10; }

        doc.setFillColor(245, 245, 245)
        doc.roundedRect(margin - 5, yPos - 8, maxWidth + 10, 12, 2, 2, 'F')

        addText(title.toUpperCase(), 12, true, [106, 71, 255])
        yPos += 5
      }

      // --- 1. Header Block ---
      doc.setFillColor(106, 71, 255) // Purple
      doc.rect(0, 0, pageWidth, 50, 'F')

      yPos = 20
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('JOB FIT ANALYSIS', margin, yPos)

      yPos += 10
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      if (jobTitle) doc.text(jobTitle, margin, yPos)

      yPos += 6
      doc.setFontSize(10)
      doc.setTextColor(200, 200, 255)
      if (company) doc.text(`at ${company}`, margin, yPos)
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin, yPos, { align: 'right' })

      yPos = 70 // Start content below header

      // --- 2. Score Dashboard ---
      const drawScoreBox = (label: string, score: number, x: number) => {
        const boxWidth = (maxWidth - 20) / 3

        // Color based on score
        let r = 255, g = 0, b = 0
        if (score >= 70) { r = 34; g = 197; b = 94 } // Green
        else if (score >= 50) { r = 245; g = 158; b = 11 } // Orange

        doc.setDrawColor(r, g, b)
        doc.setLineWidth(1)
        doc.roundedRect(x, yPos, boxWidth, 30, 3, 3, 'S')

        // Score
        doc.setTextColor(r, g, b)
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.text(`${score}%`, x + boxWidth / 2, yPos + 18, { align: 'center' })

        // Label
        doc.setTextColor(100, 100, 100)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(label.toUpperCase(), x + boxWidth / 2, yPos + 26, { align: 'center' })
      }

      drawScoreBox("ATS Score", analysisResult.ats_score, margin)
      drawScoreBox("Job Match", analysisResult.jd_match_score || 0, margin + ((maxWidth - 20) / 3) + 10)
      drawScoreBox("Skills Fit", analysisResult.skills_fit_score || 0, margin + ((maxWidth - 20) / 3) * 2 + 20)

      yPos += 45

      // --- 3. Coaching Summary ---
      if (analysisResult.coaching_summary) {
        addSectionHeader("Executive Summary")
        const summary = typeof analysisResult.coaching_summary === 'string'
          ? analysisResult.coaching_summary
          : analysisResult.coaching_summary.insight
        addText(summary, 10, false, [60, 60, 60])
        yPos += 5
      }

      // --- 4. Keywords ---
      const matched = analysisResult.matched_keywords || [];
      const missing = analysisResult.missing_keywords || [];

      if (matched.length > 0 || missing.length > 0) {
        addSectionHeader("Keyword Analysis")

        if (matched.length > 0) {
          addText("MATCHED KEYWORDS:", 9, true, [34, 197, 94])
          addText(matched.join(', '), 9, false)
          yPos += 3
        }

        if (missing.length > 0) {
          addText("MISSING KEYWORDS:", 9, true, [239, 68, 68])
          addText(missing.join(', '), 9, false)
          yPos += 3
        }
      }

      // --- 5. Improvements ---
      if (analysisResult.bullet_improvements && analysisResult.bullet_improvements.length > 0) {
        addSectionHeader("Recommended Improvements")

        analysisResult.bullet_improvements.forEach((imp, i) => {
          if (yPos > pageHeight - margin - 40) { doc.addPage(); yPos = margin + 10; }

          yPos += 2
          addText(`SUGGESTION ${i + 1}:`, 10, true, [106, 71, 255])

          // Before
          doc.setFillColor(255, 245, 245)
          doc.roundedRect(margin, yPos, maxWidth, 10, 1, 1, 'F')
          doc.setTextColor(220, 38, 38)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text("BEFORE:", margin + 2, yPos + 6)
          doc.setFont('helvetica', 'normal')
          doc.text(imp.before.substring(0, 90) + "...", margin + 20, yPos + 6)
          yPos += 12

          // After
          doc.setFillColor(240, 253, 244)
          doc.roundedRect(margin, yPos, maxWidth, 10, 1, 1, 'F')
          doc.setTextColor(22, 163, 74)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.text("AFTER:", margin + 2, yPos + 6)
          doc.setFont('helvetica', 'normal')
          doc.text(imp.after.substring(0, 90) + "...", margin + 20, yPos + 6)
          yPos += 12

          addText(`Why: ${imp.reason}`, 9, false, [100, 100, 100])
          yPos += 6
        })
      }

      // Footer
      const footerY = pageHeight - 10
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text('Generated by JobFoxy AI Analysis', pageWidth / 2, footerY, { align: 'center' })

      // Save PDF
      const fileName = `Analysis-Report-${jobTitle?.replace(/\s+/g, '-') || 'JobFoxy'}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('PDF Export Error:', error)
      alert('Failed to export PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDOCX = async () => {
    if (!analysisResult) return
    setIsExporting(true)
    try {
      await exportAnalysisReportToDocx(analysisResult, jobTitle || 'Job Analysis', company || '')
    } catch (error) {
      console.error('DOCX Export Error:', error)
      alert('Failed to export DOCX. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Expose handler to parent
  useImperativeHandle(ref, () => ({
    handleExportReport,
    handleExportDOCX
  }))

  const handleOptimizeResume = async () => {
    if (!analysisResult) {
      setError('Please run an analysis first before optimizing.')
      return
    }

    // Show the modal instead of window.confirm
    setShowOptimizeModal(true)
  }

  // Actual optimization logic (called when modal confirms)
  const executeOptimization = async () => {
    setShowOptimizeModal(false)
    setOptimizing(true)
    setError(null)

    try {
      // Use AI-powered optimization endpoint
      const response = await fetch('/api/resume/optimize-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          jobTitle: jobTitle.trim() || null,
          jobDescription: jobDescription.trim() || null,
          industry: industry || null,
          missingKeywords: analysisResult?.missing_keywords || [],
        }),
      })

      if (!response.ok) {
        let errorMessage = `Optimization failed with status ${response.status}`
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError)
        }
        setError(errorMessage)
        return
      }

      const data = await response.json()
      console.log('AI Optimization response:', data)

      if (data.success) {
        const result = data.data

        if (result.optimized && result.optimizedContent) {
          // Update the resume context with optimized content
          setResumeData(result.optimizedContent)

          // Show toast notification
          toast.success('✅ Resume optimized! Click "View Updated Resume" to see changes.', 8000)

          // Set success state for banner
          setOptimizationComplete(true)
          setOptimizationMessage(result.message || 'Resume optimized successfully!')

          // Scroll to top to show the notification
          if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          }
        } else {
          toast.info('Resume is already well-optimized!', 5000)
          setOptimizationComplete(true)
          setOptimizationMessage(result.message || 'Resume is already well-optimized!')

          // Scroll to top to show the notification
          if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }
      } else {
        toast.error(data.error || 'Optimization failed. Please try again.')
        setError(data.error || 'Optimization failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Optimization error:', err)
      setError(err.message || 'An unexpected error occurred during optimization.')
    } finally {
      setOptimizing(false)
    }
  }

  // Handle applying a bullet improvement to the resume
  const handleApplyBulletImprovement = (improvement: { before: string; after: string; reason: string }) => {
    if (!resumeData.experience || resumeData.experience.length === 0) {
      setError('No experience section found in resume.')
      return
    }

    // Normalize text for comparison (remove quotes, extra spaces, etc.)
    const normalizeText = (text: string) => text.replace(/[""]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase()
    const normalizedBefore = normalizeText(improvement.before)

    // Search through all experience entries and their bullets
    let found = false
    const updatedExperience = resumeData.experience.map(exp => {
      if (found) return exp // Already found and replaced

      const updatedBullets = exp.bullets.map(bullet => {
        if (found) return bullet

        // Extract plain text from RichText - handle both old format (direct RichText) and new format (BulletItem)
        const bulletContent = (bullet as any).content || bullet
        const bulletText = jsonToPlainText(bulletContent)
        const normalizedBullet = normalizeText(bulletText)

        // Check if this bullet matches the "before" text (partial match)
        if (normalizedBullet.includes(normalizedBefore) || normalizedBefore.includes(normalizedBullet)) {
          found = true
          // Replace with the improved version - preserve BulletItem structure if present
          const newContent = plainTextToJSON(improvement.after)
          if ((bullet as any).id !== undefined) {
            return { ...bullet, content: newContent }
          }
          return newContent
        }

        return bullet
      })

      return { ...exp, bullets: updatedBullets }
    })

    if (found) {
      // Update the resume data (cast to any to handle backward compatibility)
      setResumeData({
        ...resumeData,
        experience: updatedExperience as any
      })
      // Show success (could use a toast notification in the future)
      console.log('Successfully applied improvement to resume!')
    } else {
      setError(`Could not find matching bullet in resume. The bullet may have already been changed.`)
    }
  }

  // Handle batch bullet improvements from the BulletAnalysisPanel
  const handleBulletImprovementsApplied = (improvements: Array<{ original: string; improved: string }>) => {
    if (!resumeData.experience || resumeData.experience.length === 0) {
      setError('No experience section found in resume.')
      return
    }

    // Normalize text for comparison
    const normalizeText = (text: string) => text.replace(/[""]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase()

    let updatedCount = 0

    // Process improvements one by one
    const updatedExperience = resumeData.experience.map(exp => {
      const updatedBullets = exp.bullets.map(bullet => {
        // Extract plain text from RichText
        const bulletContent = (bullet as any).content || bullet
        const bulletText = jsonToPlainText(bulletContent)
        const normalizedBullet = normalizeText(bulletText)

        // Check each improvement to see if it matches
        for (const improvement of improvements) {
          const normalizedOriginal = normalizeText(improvement.original)

          if (normalizedBullet === normalizedOriginal ||
              normalizedBullet.includes(normalizedOriginal) ||
              normalizedOriginal.includes(normalizedBullet)) {
            updatedCount++
            // Replace with the improved version - preserve BulletItem structure
            const newContent = plainTextToJSON(improvement.improved)
            if ((bullet as any).id !== undefined) {
              return { ...bullet, content: newContent }
            }
            return newContent
          }
        }

        return bullet
      })

      return { ...exp, bullets: updatedBullets }
    })

    if (updatedCount > 0) {
      setResumeData({
        ...resumeData,
        experience: updatedExperience as any
      })
      toast.success(`Successfully improved ${updatedCount} bullet${updatedCount > 1 ? 's' : ''}!`, 5000)
    } else {
      setError('Could not find matching bullets in resume. They may have already been changed.')
    }
  }

  // If we have results, show the dashboard with a "Back to Input" option?
  // Or just show results below/overlay?
  // Let's show results and keep the input accessible for tweaking?
  // For now, if result exists, show Dashboard. User can "Reset" to enter new JD.

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (analysisResult) {
    return (
      <div ref={containerRef} className="flex flex-col h-full overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <div className="flex items-center gap-3">
            <ExportDropdown
              onExportPDF={handleExportReport}
              onExportDOCX={handleExportDOCX}
              isExporting={isExporting}
              label="Export Report"
            />
            <button
              onClick={() => {
                setAnalysisResult(null)
                setJobTitle('')
                setCompany('')
                setJobDescription('')
                setIndustry('')
              }}
              className="text-sm text-purple-300 hover:text-white transition-colors"
            >
              Analyze Another Job
            </button>
          </div>
        </div>

        {/* Optimization Success Banner */}
        {optimizationComplete && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/20">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-green-400">Optimization Complete!</h3>
                  <p className="text-sm text-white/70">{optimizationMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    // Switch to builder view to see the updated resume
                    if (onSwitchToBuilder) {
                      onSwitchToBuilder()
                      // Scroll to top after a brief delay to let the view switch
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }, 100)
                    }
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Updated Resume
                </button>
                <button
                  onClick={() => setOptimizationComplete(false)}
                  className="text-sm text-white/50 hover:text-white/80 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <AnalysisDashboard
          data={analysisResult}
          onFixIssue={() => { }}
          onOptimizeResume={handleOptimizeResume}
          isOptimizing={optimizing}
          jobTitle={jobTitle}
          company={company}
          resumeText={resumeRawText || currentResumeText}
          resumeData={resumeData}
          industry={industry || 'technology'}
          onApplyBulletImprovement={handleApplyBulletImprovement}
          onBulletImprovementsApplied={handleBulletImprovementsApplied}
        />

        {/* Modal must be rendered in THIS return block to work */}
        <OptimizeConfirmModal
          isOpen={showOptimizeModal}
          onClose={() => setShowOptimizeModal(false)}
          onConfirm={executeOptimization}
          bulletImprovementsCount={analysisResult?.bullet_improvements?.length || 0}
          missingKeywordsCount={analysisResult?.missing_keywords?.length || 0}
          isLoading={optimizing}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 md:p-8 pb-6 sm:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Resume & Job Description</h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Enter job details to analyze how well your resume matches.
          </p>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Job Title & Company Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

          {/* Industry Selector */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Target Industry <span className="text-white/40 text-xs">(Optional - for ATS keyword optimization)</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' opacity='0.5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="" className="bg-gray-900">Select an industry...</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind} className="bg-gray-900">
                  {ind.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            <p className="text-xs text-white/40 mt-1.5">
              Selecting an industry enables keyword coverage analysis specific to your field
            </p>
          </div>

          {/* Job Description */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Job Description <span className="text-red-400">*</span>
            </label>
            <div className="glass-panel p-1 rounded-xl sm:rounded-2xl border border-white/10 relative group focus-within:border-purple-500/50 transition-colors h-[250px] sm:h-[300px] md:h-[350px]">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-full bg-transparent border-none resize-none p-4 sm:p-6 text-white placeholder-white/30 focus:outline-none focus:ring-0 text-sm sm:text-base leading-relaxed"
              />
              {jobDescription.length > 0 && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs text-white/40">
                  {jobDescription.length} characters
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
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <motion.button
            onClick={handleAnalyze}
            disabled={analyzing || !jobTitle.trim() || !jobDescription.trim()}
            animate={analyzing ? {
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.4)',
                '0 0 40px rgba(168, 85, 247, 0.6)',
                '0 0 20px rgba(168, 85, 247, 0.4)',
              ]
            } : {}}
            transition={{
              duration: 2,
              repeat: analyzing ? Infinity : 0,
              ease: "easeInOut"
            }}
            className={`
            w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all relative overflow-hidden
            ${analyzing
                ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white cursor-wait bg-[length:200%_100%] animate-gradient'
                : !jobTitle.trim() || !jobDescription.trim()
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'glow-button text-white hover:scale-[1.01] active:scale-[0.99]'}
          `}
          >
            {analyzing && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )}
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                <span className="relative z-10">Analyzing Resume</span>
                <motion.span
                  className="relative z-10"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            )}
          </motion.button>

          {/* Info Footer */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center text-white/40 text-xs sm:text-sm">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="p-1.5 sm:p-2 bg-white/5 rounded-full"><Target className="w-3 h-3 sm:w-4 sm:h-4" /></div>
              <span className="leading-tight">ATS Keyword Match</span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="p-1.5 sm:p-2 bg-white/5 rounded-full"><FileText className="w-3 h-3 sm:w-4 sm:h-4" /></div>
              <span className="leading-tight">Formatting Check</span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div className="p-1.5 sm:p-2 bg-white/5 rounded-full"><Check className="w-3 h-3 sm:w-4 sm:h-4" /></div>
              <span className="leading-tight">Tailoring Tips</span>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="AI Job Analysis"
      />
    </div>
  )
})

JobAnalysisView.displayName = 'JobAnalysisView'