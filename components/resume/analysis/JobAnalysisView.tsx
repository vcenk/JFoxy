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
    setIsExporting(true)

    try {
      // Dynamically import jsPDF and autoTable
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default
      const doc = new jsPDF()

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const maxWidth = pageWidth - (margin * 2)
      let yPos = 0

      // Color definitions (RGB)
      const PURPLE: [number, number, number] = [106, 71, 255]
      const GREEN: [number, number, number] = [34, 197, 94]
      const RED: [number, number, number] = [239, 68, 68]
      const ORANGE: [number, number, number] = [245, 158, 11]
      const BLUE: [number, number, number] = [59, 130, 246]
      const DARK: [number, number, number] = [51, 51, 51]
      const LIGHT: [number, number, number] = [102, 102, 102]

      // Helper: Get score color
      const getScoreColor = (score: number): [number, number, number] => {
        if (score >= 70) return GREEN
        if (score >= 50) return ORANGE
        return RED
      }

      // Helper: Check page break
      const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin - 10) {
          doc.addPage()
          yPos = margin
          return true
        }
        return false
      }

      // Helper: Add text with word wrap
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = DARK, indent: number = 0) => {
        if (!text) return
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.setTextColor(color[0], color[1], color[2])
        const lines = doc.splitTextToSize(text, maxWidth - indent)
        lines.forEach((line: string) => {
          checkPageBreak(fontSize * 0.5)
          doc.text(line, margin + indent, yPos)
          yPos += fontSize * 0.45
        })
      }

      // Helper: Section header with purple underline
      const addSectionHeader = (title: string) => {
        checkPageBreak(18)
        yPos += 10
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2])
        doc.text(title.toUpperCase(), margin, yPos)
        yPos += 2
        doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2])
        doc.setLineWidth(0.5)
        doc.line(margin, yPos, margin + maxWidth, yPos)
        yPos += 8
      }

      // ============================================
      // SECTION 1: HEADER
      // ============================================
      doc.setFillColor(PURPLE[0], PURPLE[1], PURPLE[2])
      doc.rect(0, 0, pageWidth, 42, 'F')

      yPos = 16
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('RESUME ANALYSIS REPORT', margin, yPos)

      yPos += 10
      doc.setFontSize(13)
      doc.setFont('helvetica', 'normal')
      doc.text(jobTitle || 'Job Analysis', margin, yPos)

      yPos += 7
      doc.setFontSize(10)
      doc.setTextColor(200, 200, 255)
      if (company) doc.text(`at ${company}`, margin, yPos)
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - margin, yPos, { align: 'right' })

      yPos = 55

      // ============================================
      // SECTION 2: SCORE DASHBOARD (Table)
      // ============================================
      const scoreData = [
        [
          { content: `${analysisResult.ats_score}%`, styles: { fontSize: 24, fontStyle: 'bold' as const, textColor: getScoreColor(analysisResult.ats_score), halign: 'center' as const } },
          { content: `${analysisResult.jd_match_score || 0}%`, styles: { fontSize: 24, fontStyle: 'bold' as const, textColor: getScoreColor(analysisResult.jd_match_score || 0), halign: 'center' as const } },
          { content: `${analysisResult.skills_fit_score || 0}%`, styles: { fontSize: 24, fontStyle: 'bold' as const, textColor: getScoreColor(analysisResult.skills_fit_score || 0), halign: 'center' as const } }
        ],
        [
          { content: 'ATS SCORE', styles: { fontSize: 9, textColor: LIGHT, halign: 'center' as const, fontStyle: 'bold' as const } },
          { content: 'JOB MATCH', styles: { fontSize: 9, textColor: LIGHT, halign: 'center' as const, fontStyle: 'bold' as const } },
          { content: 'SKILLS FIT', styles: { fontSize: 9, textColor: LIGHT, halign: 'center' as const, fontStyle: 'bold' as const } }
        ]
      ]

      autoTable(doc, {
        startY: yPos,
        body: scoreData,
        theme: 'plain',
        styles: { cellPadding: 4, valign: 'middle' },
        columnStyles: {
          0: { cellWidth: maxWidth / 3 },
          1: { cellWidth: maxWidth / 3 },
          2: { cellWidth: maxWidth / 3 }
        },
        margin: { left: margin, right: margin }
      })

      yPos = (doc as any).lastAutoTable.finalY + 8

      // ============================================
      // SECTION 3: EXECUTIVE SUMMARY
      // ============================================
      const coachingSummary = typeof analysisResult.coaching_summary === 'string'
        ? analysisResult.coaching_summary
        : analysisResult.coaching_summary?.insight

      if (coachingSummary) {
        addSectionHeader("Executive Summary")
        addText(coachingSummary, 10, false, DARK)
        yPos += 5
      }

      // ============================================
      // SECTION 4: JD REQUIREMENTS ANALYSIS (Table)
      // ============================================
      if (analysisResult.jd_requirements && analysisResult.jd_requirements.length > 0) {
        addSectionHeader("Job Requirements Analysis")

        const matched = analysisResult.jd_requirements.filter(r => r.status === 'matched').length
        const partial = analysisResult.jd_requirements.filter(r => r.status === 'partial').length
        const missing = analysisResult.jd_requirements.filter(r => r.status === 'missing').length
        const total = analysisResult.jd_requirements.length

        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(GREEN[0], GREEN[1], GREEN[2])
        doc.text(`${matched} of ${total} requirements matched`, margin, yPos)
        doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2])
        doc.setFont('helvetica', 'normal')
        doc.text(` • ${partial} partial • ${missing} missing`, margin + 55, yPos)
        yPos += 8

        const reqTableData = analysisResult.jd_requirements.map(req => {
          const statusColor = req.status === 'matched' ? GREEN : req.status === 'partial' ? ORANGE : RED
          return [
            { content: req.requirement.substring(0, 50) + (req.requirement.length > 50 ? '...' : ''), styles: { fontSize: 8 } },
            { content: req.category, styles: { fontSize: 8, fontStyle: 'italic' as const } },
            { content: req.importance, styles: { fontSize: 8 } },
            { content: req.status.toUpperCase(), styles: { fontSize: 8, fontStyle: 'bold' as const, textColor: statusColor } },
            { content: req.evidence?.substring(0, 30) || '-', styles: { fontSize: 7, textColor: LIGHT, fontStyle: 'italic' as const } }
          ]
        })

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: 'Requirement', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' } },
            { content: 'Category', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' } },
            { content: 'Importance', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' } },
            { content: 'Status', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' } },
            { content: 'Evidence', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' } }
          ]],
          body: reqTableData,
          theme: 'grid',
          styles: { cellPadding: 3, fontSize: 8 },
          columnStyles: {
            0: { cellWidth: maxWidth * 0.35 },
            1: { cellWidth: maxWidth * 0.12 },
            2: { cellWidth: maxWidth * 0.13 },
            3: { cellWidth: maxWidth * 0.12 },
            4: { cellWidth: maxWidth * 0.28 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = (doc as any).lastAutoTable.finalY + 5
      }

      // ============================================
      // SECTION 5: KEYWORD ANALYSIS (Two-column table)
      // ============================================
      const matchedKw = analysisResult.matched_keywords || []
      const missingKw = analysisResult.missing_keywords || []

      if (matchedKw.length > 0 || missingKw.length > 0) {
        addSectionHeader("Keyword Analysis")

        if (analysisResult.keyword_strategy) {
          doc.setFontSize(9)
          doc.setFont('helvetica', 'italic')
          doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2])
          const strategyLines = doc.splitTextToSize(analysisResult.keyword_strategy, maxWidth)
          strategyLines.slice(0, 2).forEach((line: string) => {
            doc.text(line, margin, yPos)
            yPos += 4
          })
          yPos += 4
        }

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: `MATCHED (${matchedKw.length})`, styles: { fillColor: [240, 253, 244], textColor: GREEN, fontSize: 9, fontStyle: 'bold' } },
            { content: `MISSING (${missingKw.length})`, styles: { fillColor: [254, 242, 242], textColor: RED, fontSize: 9, fontStyle: 'bold' } }
          ]],
          body: [[
            { content: matchedKw.slice(0, 20).join(', ') || 'None', styles: { fontSize: 8 } },
            { content: missingKw.slice(0, 20).join(', ') || 'None', styles: { fontSize: 8 } }
          ]],
          theme: 'grid',
          styles: { cellPadding: 5 },
          columnStyles: {
            0: { cellWidth: maxWidth / 2 },
            1: { cellWidth: maxWidth / 2 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = (doc as any).lastAutoTable.finalY + 5
      }

      // ============================================
      // SECTION 6: ATS HEALTH CHECK
      // ============================================
      if (analysisResult.ats_health_check || (analysisResult.ats_warnings && analysisResult.ats_warnings.length > 0) || (analysisResult.ats_good_practices && analysisResult.ats_good_practices.length > 0)) {
        addSectionHeader("ATS Health Check")

        if (analysisResult.ats_health_check) {
          addText(analysisResult.ats_health_check, 9, false, DARK)
          yPos += 5
        }

        const criticalWarnings = analysisResult.ats_warnings?.filter(w => w.severity === 'critical') || []
        const regularWarnings = analysisResult.ats_warnings?.filter(w => w.severity === 'warning') || []

        if (criticalWarnings.length > 0) {
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(RED[0], RED[1], RED[2])
          doc.text('CRITICAL ISSUES', margin, yPos)
          yPos += 6

          criticalWarnings.forEach(w => {
            checkPageBreak(14)
            doc.setFontSize(9)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(DARK[0], DARK[1], DARK[2])
            doc.text(`Issue: `, margin + 3, yPos)
            doc.setFont('helvetica', 'normal')
            const issueLines = doc.splitTextToSize(w.issue, maxWidth - 20)
            doc.text(issueLines[0], margin + 15, yPos)
            yPos += 5
            doc.setTextColor(GREEN[0], GREEN[1], GREEN[2])
            doc.setFont('helvetica', 'bold')
            doc.text(`Fix: `, margin + 3, yPos)
            doc.setFont('helvetica', 'italic')
            const fixLines = doc.splitTextToSize(w.recommendation, maxWidth - 15)
            doc.text(fixLines[0], margin + 12, yPos)
            yPos += 7
          })
        }

        if (regularWarnings.length > 0) {
          checkPageBreak(10)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(ORANGE[0], ORANGE[1], ORANGE[2])
          doc.text('WARNINGS', margin, yPos)
          yPos += 6

          regularWarnings.forEach(w => {
            checkPageBreak(8)
            doc.setFontSize(8)
            doc.setTextColor(DARK[0], DARK[1], DARK[2])
            doc.text(`• ${w.issue}`, margin + 3, yPos)
            doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2])
            doc.setFont('helvetica', 'italic')
            const recLines = doc.splitTextToSize(` → ${w.recommendation}`, maxWidth - 10)
            yPos += 4
            doc.text(recLines[0], margin + 6, yPos)
            yPos += 5
          })
        }

        if (analysisResult.ats_good_practices && analysisResult.ats_good_practices.length > 0) {
          checkPageBreak(10)
          yPos += 3
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(GREEN[0], GREEN[1], GREEN[2])
          doc.text('WHAT YOU\'RE DOING RIGHT', margin, yPos)
          yPos += 6

          analysisResult.ats_good_practices.forEach(p => {
            checkPageBreak(6)
            doc.setFontSize(8)
            doc.setTextColor(GREEN[0], GREEN[1], GREEN[2])
            doc.text(`✓ ${p}`, margin + 3, yPos)
            yPos += 5
          })
        }

        if (analysisResult.formatting_issues && analysisResult.formatting_issues.length > 0) {
          checkPageBreak(10)
          yPos += 3
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(ORANGE[0], ORANGE[1], ORANGE[2])
          doc.text('FORMATTING ISSUES', margin, yPos)
          yPos += 6

          analysisResult.formatting_issues.forEach(issue => {
            checkPageBreak(6)
            doc.setFontSize(8)
            doc.setTextColor(DARK[0], DARK[1], DARK[2])
            doc.text(`• ${issue}`, margin + 3, yPos)
            yPos += 5
          })
        }

        yPos += 3
      }

      // ============================================
      // SECTION 7: SKILLS ANALYSIS
      // ============================================
      if (analysisResult.skills_fit_explanation || analysisResult.skills_breakdown_coaching || (analysisResult.missing_skills && analysisResult.missing_skills.length > 0)) {
        addSectionHeader("Skills Analysis")

        if (analysisResult.skills_fit_explanation) {
          addText(analysisResult.skills_fit_explanation, 9, false, DARK)
          yPos += 5
        }

        if (analysisResult.missing_skills && analysisResult.missing_skills.length > 0) {
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(ORANGE[0], ORANGE[1], ORANGE[2])
          doc.text('Skills Gap - Consider adding:', margin, yPos)
          yPos += 6

          analysisResult.missing_skills.slice(0, 10).forEach(skill => {
            checkPageBreak(5)
            doc.setFontSize(8)
            doc.setTextColor(DARK[0], DARK[1], DARK[2])
            doc.text(`• ${skill}`, margin + 3, yPos)
            yPos += 4
          })
          yPos += 3
        }

        if (analysisResult.skills_breakdown_coaching) {
          const categories = [
            { key: 'technical', label: 'Technical Skills', color: PURPLE },
            { key: 'tools', label: 'Tools & Technologies', color: BLUE },
            { key: 'domain', label: 'Domain Knowledge', color: GREEN },
            { key: 'soft_skills', label: 'Soft Skills', color: ORANGE }
          ]

          categories.forEach(cat => {
            const content = analysisResult.skills_breakdown_coaching?.[cat.key as keyof typeof analysisResult.skills_breakdown_coaching]
            if (content) {
              checkPageBreak(15)
              doc.setFontSize(9)
              doc.setFont('helvetica', 'bold')
              doc.setTextColor(cat.color[0], cat.color[1], cat.color[2])
              doc.text(cat.label, margin, yPos)
              yPos += 5
              doc.setFont('helvetica', 'normal')
              doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2])
              const contentLines = doc.splitTextToSize(content, maxWidth - 5)
              contentLines.slice(0, 2).forEach((line: string) => {
                doc.text(line, margin + 3, yPos)
                yPos += 4
              })
              yPos += 3
            }
          })
        }
      }

      // ============================================
      // SECTION 8: SECTION FEEDBACK (Table)
      // ============================================
      if (analysisResult.section_feedback && analysisResult.section_feedback.length > 0) {
        addSectionHeader("Section-by-Section Feedback")

        const feedbackData = analysisResult.section_feedback.map(sf => {
          const scoreColor = getScoreColor(sf.score)
          return [
            { content: sf.section, styles: { fontSize: 9, fontStyle: 'bold' as const } },
            { content: `${sf.score}%`, styles: { fontSize: 10, fontStyle: 'bold' as const, textColor: scoreColor, halign: 'center' as const } },
            { content: sf.feedback, styles: { fontSize: 8 } }
          ]
        })

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: 'Section', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' } },
            { content: 'Score', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' } },
            { content: 'Feedback', styles: { fillColor: PURPLE, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' } }
          ]],
          body: feedbackData,
          theme: 'grid',
          styles: { cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: maxWidth * 0.18 },
            1: { cellWidth: maxWidth * 0.12 },
            2: { cellWidth: maxWidth * 0.70 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = (doc as any).lastAutoTable.finalY + 5
      }

      // ============================================
      // SECTION 9: POWER WORDS (Table)
      // ============================================
      if (analysisResult.power_words && analysisResult.power_words.suggestions && analysisResult.power_words.suggestions.length > 0) {
        addSectionHeader("Power Words & Language")

        const pwColor = getScoreColor(analysisResult.power_words.score)
        const impColor = analysisResult.power_words.improvementPotential === 'high' ? RED : analysisResult.power_words.improvementPotential === 'medium' ? ORANGE : GREEN

        doc.setFontSize(10)
        doc.setTextColor(DARK[0], DARK[1], DARK[2])
        doc.text('Language Score: ', margin, yPos)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(pwColor[0], pwColor[1], pwColor[2])
        doc.text(`${analysisResult.power_words.score}%`, margin + 30, yPos)
        doc.setTextColor(DARK[0], DARK[1], DARK[2])
        doc.setFont('helvetica', 'normal')
        doc.text(' • Improvement Potential: ', margin + 45, yPos)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(impColor[0], impColor[1], impColor[2])
        doc.text(analysisResult.power_words.improvementPotential.toUpperCase(), margin + 90, yPos)
        yPos += 8

        const pwData = analysisResult.power_words.suggestions.slice(0, 10).map(s => [
          { content: s.weak, styles: { fontSize: 9, textColor: RED, fillColor: [254, 242, 242] as [number, number, number] } },
          { content: s.alternatives.join(', '), styles: { fontSize: 9, textColor: GREEN, fillColor: [240, 253, 244] as [number, number, number] } }
        ])

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: 'Weak Word', styles: { fillColor: RED, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' } },
            { content: 'Suggested Alternatives', styles: { fillColor: GREEN, textColor: [255, 255, 255], fontSize: 9, fontStyle: 'bold' } }
          ]],
          body: pwData,
          theme: 'grid',
          styles: { cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: maxWidth * 0.25 },
            1: { cellWidth: maxWidth * 0.75 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = (doc as any).lastAutoTable.finalY + 5
      }

      // ============================================
      // SECTION 10: QUANTIFICATION
      // ============================================
      if (analysisResult.quantification) {
        addSectionHeader("Quantification & Metrics")

        const qColor = getScoreColor(analysisResult.quantification.score)
        doc.setFontSize(10)
        doc.setTextColor(DARK[0], DARK[1], DARK[2])
        doc.text('Metrics Score: ', margin, yPos)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(qColor[0], qColor[1], qColor[2])
        doc.text(`${analysisResult.quantification.score}%`, margin + 28, yPos)
        doc.setTextColor(analysisResult.quantification.hasMetrics ? GREEN[0] : ORANGE[0], analysisResult.quantification.hasMetrics ? GREEN[1] : ORANGE[1], analysisResult.quantification.hasMetrics ? GREEN[2] : ORANGE[2])
        doc.setFont('helvetica', 'normal')
        doc.text(analysisResult.quantification.hasMetrics ? ' • Metrics found in resume' : ' • No metrics detected', margin + 42, yPos)
        yPos += 7

        if (analysisResult.quantification.metricTypes && analysisResult.quantification.metricTypes.length > 0) {
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(DARK[0], DARK[1], DARK[2])
          doc.text('Types of metrics found: ', margin, yPos)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(GREEN[0], GREEN[1], GREEN[2])
          doc.text(analysisResult.quantification.metricTypes.join(', '), margin + 40, yPos)
          yPos += 6
        }

        if (analysisResult.quantification.suggestions && analysisResult.quantification.suggestions.length > 0) {
          yPos += 2
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(DARK[0], DARK[1], DARK[2])
          doc.text('Suggestions to add metrics:', margin, yPos)
          yPos += 5

          analysisResult.quantification.suggestions.forEach(s => {
            checkPageBreak(5)
            doc.setFontSize(8)
            doc.setFont('helvetica', 'normal')
            doc.text(`• ${s}`, margin + 3, yPos)
            yPos += 4
          })
        }
        yPos += 3
      }

      // ============================================
      // SECTION 11: BULLET IMPROVEMENTS (Tables)
      // ============================================
      if (analysisResult.bullet_improvements && analysisResult.bullet_improvements.length > 0) {
        addSectionHeader("Bullet Point Improvements")

        analysisResult.bullet_improvements.forEach((imp, i) => {
          checkPageBreak(35)

          doc.setFontSize(11)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2])
          doc.text(`Improvement ${i + 1}`, margin, yPos)
          yPos += 6

          autoTable(doc, {
            startY: yPos,
            body: [
              [
                { content: 'BEFORE', styles: { fontStyle: 'bold', fontSize: 8, textColor: RED, fillColor: [254, 242, 242], cellWidth: 18 } },
                { content: imp.before, styles: { fontSize: 8, fillColor: [254, 242, 242] } }
              ],
              [
                { content: 'AFTER', styles: { fontStyle: 'bold', fontSize: 8, textColor: GREEN, fillColor: [240, 253, 244], cellWidth: 18 } },
                { content: imp.after, styles: { fontSize: 8, fillColor: [240, 253, 244] } }
              ]
            ],
            theme: 'grid',
            styles: { cellPadding: 4 },
            margin: { left: margin, right: margin }
          })

          yPos = (doc as any).lastAutoTable.finalY + 3
          doc.setFontSize(8)
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(LIGHT[0], LIGHT[1], LIGHT[2])
          doc.text('Why: ', margin + 3, yPos)
          doc.setFont('helvetica', 'italic')
          const reasonLines = doc.splitTextToSize(imp.reason, maxWidth - 15)
          doc.text(reasonLines[0], margin + 14, yPos)
          yPos += 8
        })
      }

      // ============================================
      // SECTION 12: STRENGTHS & WEAKNESSES (Table)
      // ============================================
      if ((analysisResult.strengths && analysisResult.strengths.length > 0) || (analysisResult.weaknesses && analysisResult.weaknesses.length > 0)) {
        addSectionHeader("Strengths & Areas for Improvement")

        const maxRows = Math.max(analysisResult.strengths?.length || 0, analysisResult.weaknesses?.length || 0, 1)
        const strengthsList = analysisResult.strengths?.slice(0, 8) || []
        const weaknessesList = analysisResult.weaknesses?.slice(0, 8) || []

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: '✓ STRENGTHS', styles: { fillColor: [240, 253, 244], textColor: GREEN, fontSize: 10, fontStyle: 'bold' } },
            { content: '⚠ AREAS FOR IMPROVEMENT', styles: { fillColor: [254, 247, 231], textColor: ORANGE, fontSize: 10, fontStyle: 'bold' } }
          ]],
          body: [[
            { content: strengthsList.map(s => `• ${s}`).join('\n') || 'None identified', styles: { fontSize: 8 } },
            { content: weaknessesList.map(w => `• ${w}`).join('\n') || 'None identified', styles: { fontSize: 8 } }
          ]],
          theme: 'grid',
          styles: { cellPadding: 6, valign: 'top' },
          columnStyles: {
            0: { cellWidth: maxWidth / 2 },
            1: { cellWidth: maxWidth / 2 }
          },
          margin: { left: margin, right: margin }
        })

        yPos = (doc as any).lastAutoTable.finalY + 5
      }

      // ============================================
      // SECTION 13: NEXT STEPS
      // ============================================
      const actionItems: string[] = []
      const criticalW = analysisResult.ats_warnings?.filter(w => w.severity === 'critical') || []
      criticalW.forEach(w => actionItems.push(`[CRITICAL] ${w.recommendation}`))
      if (missingKw.length > 0) actionItems.push(`Add missing keywords: ${missingKw.slice(0, 5).join(', ')}`)
      if (analysisResult.missing_skills && analysisResult.missing_skills.length > 0) {
        actionItems.push(`Highlight skills: ${analysisResult.missing_skills.slice(0, 3).join(', ')}`)
      }
      if (analysisResult.power_words?.improvementPotential === 'high') {
        actionItems.push('Replace weak action verbs with power words')
      }
      if (analysisResult.quantification && analysisResult.quantification.score < 50) {
        actionItems.push('Add quantifiable achievements (%, $, numbers)')
      }

      if (actionItems.length > 0) {
        addSectionHeader("Recommended Next Steps")

        actionItems.slice(0, 10).forEach((item, i) => {
          checkPageBreak(8)
          const isCritical = item.includes('[CRITICAL]')
          doc.setFontSize(9)
          doc.setFont('helvetica', isCritical ? 'bold' : 'normal')
          doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2])
          doc.text(`${i + 1}. `, margin, yPos)
          doc.setTextColor(isCritical ? RED[0] : DARK[0], isCritical ? RED[1] : DARK[1], isCritical ? RED[2] : DARK[2])
          doc.text(item.replace('[CRITICAL] ', ''), margin + 8, yPos)
          yPos += 6
        })
      }

      // ============================================
      // FOOTER (All pages)
      // ============================================
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setDrawColor(224, 224, 224)
        doc.setLineWidth(0.3)
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12)
        doc.setFontSize(8)
        doc.setTextColor(170, 170, 170)
        doc.text('Generated by JobFoxy AI Analysis', margin, pageHeight - 6)
        doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2])
        doc.text('www.jobfoxy.com', pageWidth / 2, pageHeight - 6, { align: 'center' })
        doc.setTextColor(170, 170, 170)
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' })
      }

      // Save PDF
      const safeTitle = (jobTitle || 'Analysis').replace(/[^a-z0-9]/gi, '-').substring(0, 30)
      doc.save(`JobFoxy_Analysis_${safeTitle}.pdf`)
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