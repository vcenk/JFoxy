// components/resume/analysis/JobAnalysisView.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, Target, FileText, Check, AlertCircle, Download } from 'lucide-react'
import { AnalysisDashboard, AnalysisData } from './AnalysisDashboard'
import { ResumeAnalysisResult } from '@/lib/types/analysis'

interface JobAnalysisViewProps {
  resumeId: string
  currentResumeText?: string // Optional context for display
}

export function JobAnalysisView({ resumeId, currentResumeText }: JobAnalysisViewProps) {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingExisting, setLoadingExisting] = useState(true)

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
              keyword_analysis: results.keyword_analysis || { missing: [], present: [] },
              weaknesses: results.weaknesses || [],
              strengths: results.strengths || [],
              formatting_issues: results.formatting_issues || [],
              skills_radar_data: results.skills_radar_data || [],
              missing_skills: results.missing_skills || [],
            })
          }

          // Load job description info if available
          if (data.resume.job_description_id) {
            const jdResponse = await fetch(`/api/job-description/${data.resume.job_description_id}`)
            const jdData = await jdResponse.json()

            if (jdData.success && jdData.jobDescription) {
              setJobTitle(jdData.jobDescription.title || '')
              setCompany(jdData.jobDescription.company || '')
              setJobDescription(jdData.jobDescription.description || '')
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
          createTailoredVersion: true, // Always create a new tailored version for each job analysis
        }),
      })

      if (!response.ok) {
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

            // Original fields
            keyword_analysis: result.keyword_analysis || { missing: [], present: [] },
            weaknesses: result.weaknesses || [],
            strengths: result.strengths || [],
            formatting_issues: result.formatting_issues || [],
            skills_radar_data: result.skills_radar_data || [],
            missing_skills: result.missing_skills || [],
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
      let yPos = margin

      // Helper function to add text with auto page break
      const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(fontSize)
        doc.setFont('helvetica', isBold ? 'bold' : 'normal')
        doc.setTextColor(color[0], color[1], color[2])

        const lines = doc.splitTextToSize(text, maxWidth)

        lines.forEach((line: string) => {
          if (yPos + fontSize * 0.5 > pageHeight - margin) {
            doc.addPage()
            yPos = margin
          }
          doc.text(line, margin, yPos)
          yPos += fontSize * 0.5
        })
      }

      const addSpace = (space: number = 6) => {
        yPos += space
      }

      // Title
      doc.setFillColor(106, 71, 255) // Purple
      doc.rect(0, 0, pageWidth, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('RESUME ANALYSIS REPORT', pageWidth / 2, 20, { align: 'center' })
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' })

      yPos = 50

      // Job Information
      if (jobTitle) {
        addText(`Job Title: ${jobTitle}`, 12, true)
        if (company) {
          addText(`Company: ${company}`, 12, true)
        }
        addSpace(10)
      }

      // Scores Section
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, yPos, maxWidth, 40, 'F')
      yPos += 10
      addText('SCORES', 14, true, [106, 71, 255])
      addSpace(5)
      addText(`ATS Score: ${analysisResult.ats_score}%`, 11, false)
      if (analysisResult.jd_match_score) {
        addText(`Job Match: ${analysisResult.jd_match_score}%`, 11, false)
      }
      addText(`Skills Fit: ${analysisResult.skills_fit_score}%`, 11, false)
      addSpace(10)

      // Coaching Summary
      if (analysisResult.coaching_summary) {
        addText('OVERALL ASSESSMENT', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.coaching_summary, 10, false)
        addSpace(10)
      }

      // ATS Score Explanation
      if (analysisResult.ats_score_explanation) {
        addText('ATS SCORE EXPLAINED', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.ats_score_explanation, 10, false)
        addSpace(10)
      }

      // Job Match Explanation
      if (analysisResult.job_match_explanation) {
        addText('JOB MATCH ANALYSIS', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.job_match_explanation, 10, false)
        addSpace(10)
      }

      // Skills Fit Explanation
      if (analysisResult.skills_fit_explanation) {
        addText('SKILLS ASSESSMENT', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.skills_fit_explanation, 10, false)
        addSpace(10)
      }

      // Keyword Strategy
      if (analysisResult.keyword_strategy) {
        addText('KEYWORD STRATEGY', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.keyword_strategy, 10, false)
        addSpace(10)
      }

      // Matched Keywords
      if (analysisResult.matched_keywords && analysisResult.matched_keywords.length > 0) {
        addText(`MATCHED KEYWORDS (${analysisResult.matched_keywords.length})`, 14, true, [34, 197, 94])
        addSpace(5)
        addText(analysisResult.matched_keywords.join(', '), 9, false)
        addSpace(10)
      }

      // Missing Keywords
      if (analysisResult.missing_keywords && analysisResult.missing_keywords.length > 0) {
        addText(`MISSING KEYWORDS (${analysisResult.missing_keywords.length})`, 14, true, [239, 68, 68])
        addSpace(5)
        addText(analysisResult.missing_keywords.join(', '), 9, false)
        addSpace(10)
      }

      // ATS Health Check
      if (analysisResult.ats_health_check) {
        addText('ATS HEALTH CHECK', 14, true, [106, 71, 255])
        addSpace(5)
        addText(analysisResult.ats_health_check, 10, false)
        addSpace(10)
      }

      // ATS Warnings
      if (analysisResult.ats_warnings && analysisResult.ats_warnings.length > 0) {
        addText('ATS WARNINGS & RECOMMENDATIONS', 14, true, [239, 68, 68])
        addSpace(5)
        analysisResult.ats_warnings.forEach((warning, i) => {
          addText(`${i + 1}. [${warning.severity.toUpperCase()}] ${warning.issue}`, 10, true)
          addText(`   → ${warning.recommendation}`, 9, false, [60, 60, 60])
          addSpace(4)
        })
        addSpace(10)
      }

      // Bullet Improvements
      if (analysisResult.bullet_improvements && analysisResult.bullet_improvements.length > 0) {
        addText('BULLET POINT IMPROVEMENTS', 14, true, [106, 71, 255])
        addSpace(5)
        analysisResult.bullet_improvements.forEach((improvement, i) => {
          addText(`Example ${i + 1}:`, 11, true)
          addSpace(3)
          addText(`BEFORE: ${improvement.before}`, 9, false, [239, 68, 68])
          addSpace(3)
          addText(`AFTER: ${improvement.after}`, 9, false, [34, 197, 94])
          addSpace(3)
          addText(`WHY: ${improvement.reason}`, 9, false, [59, 130, 246])
          addSpace(8)
        })
      }

      // Skills Breakdown
      if (analysisResult.skills_breakdown_coaching) {
        addText('SKILLS BREAKDOWN', 14, true, [106, 71, 255])
        addSpace(5)
        const breakdown = analysisResult.skills_breakdown_coaching
        if (breakdown.technical) {
          addText('Technical Skills:', 11, true)
          addText(breakdown.technical, 9, false)
          addSpace(4)
        }
        if (breakdown.tools) {
          addText('Tools & Technologies:', 11, true)
          addText(breakdown.tools, 9, false)
          addSpace(4)
        }
        if (breakdown.domain) {
          addText('Domain Knowledge:', 11, true)
          addText(breakdown.domain, 9, false)
          addSpace(4)
        }
        if (breakdown.communication) {
          addText('Communication:', 11, true)
          addText(breakdown.communication, 9, false)
          addSpace(4)
        }
        if (breakdown.soft_skills) {
          addText('Soft Skills:', 11, true)
          addText(breakdown.soft_skills, 9, false)
          addSpace(4)
        }
        addSpace(10)
      }

      // Strengths
      if (analysisResult.strength_highlights && analysisResult.strength_highlights.length > 0) {
        addText('YOUR STRENGTHS', 14, true, [34, 197, 94])
        addSpace(5)
        analysisResult.strength_highlights.forEach((strength, i) => {
          addText(`${i + 1}. ${strength}`, 10, false)
          addSpace(4)
        })
        addSpace(10)
      }

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      const footerY = pageHeight - 10
      doc.text('Generated by JobFoxy Resume Analyzer', pageWidth / 2, footerY, { align: 'center' })

      // Save PDF
      const fileName = `Resume-Analysis-${jobTitle?.replace(/\s+/g, '-') || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('PDF Export Error:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }

  const handleOptimizeResume = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setError('Job information is missing. Please analyze first.')
      return
    }

    setOptimizing(true)
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
          createTailoredVersion: true, // Create optimized version
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
        console.error('Optimization API error:', errorMessage)
        setError(errorMessage)
        return
      }

      const data = await response.json()
      console.log('Optimization response:', data)

      if (data.success) {
        const result = data.data

        // If a new tailored resume was created, redirect to it
        if (result.newResumeId) {
          router.push(`/dashboard/resume/${result.newResumeId}`)
        } else {
          setError('Optimization completed but no new resume was created.')
        }
      } else {
        const errorMsg = data.error || 'Optimization failed. Please try again.'
        console.error('Optimization failed:', errorMsg)
        setError(errorMsg)
      }
    } catch (err: any) {
      console.error('Optimization error:', err)
      const errorMessage = err.message || 'An unexpected error occurred during optimization.'
      setError(errorMessage)
    } finally {
      setOptimizing(false)
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
      <div className="flex flex-col h-full overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={() => {
                setAnalysisResult(null)
                setJobTitle('')
                setCompany('')
                setJobDescription('')
              }}
              className="text-sm text-purple-300 hover:text-white transition-colors"
            >
              Analyze Another Job
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <AnalysisDashboard
          data={analysisResult}
          onFixIssue={() => {}}
          onOptimizeResume={handleOptimizeResume}
          isOptimizing={optimizing}
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

        <button
          onClick={handleAnalyze}
          disabled={analyzing || !jobTitle.trim() || !jobDescription.trim()}
          className={`
            w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all
            ${analyzing || !jobTitle.trim() || !jobDescription.trim()
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'glow-button text-white hover:scale-[1.01] active:scale-[0.99]'}
          `}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              Analyzing Match...
            </>
          ) : (
            <>
              Start Analysis
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </>
          )}
        </button>

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
    </div>
  )
}
