// components/resume/analysis/CoverLetterView.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2, FileText, AlertCircle, Copy, Check, Download, Sparkles, Info } from 'lucide-react'

interface CoverLetterViewProps {
  resumeId: string
}

export function CoverLetterView({ resumeId }: CoverLetterViewProps) {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone] = useState<'professional' | 'enthusiastic' | 'friendly'>('professional')
  const [generating, setGenerating] = useState(false)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loadingJobInfo, setLoadingJobInfo] = useState(true)
  const [refinePrompt, setRefinePrompt] = useState('')
  const [showRefineInput, setShowRefineInput] = useState(false)
  const [refining, setRefining] = useState(false)

  // Load job description from resume if available
  useEffect(() => {
    const loadJobInfo = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`)
        const data = await response.json()

        if (data.success && data.resume && data.resume.job_description_id) {
          const jdResponse = await fetch(`/api/job-description/${data.resume.job_description_id}`)
          const jdData = await jdResponse.json()

          if (jdData.success && jdData.jobDescription) {
            setJobTitle(jdData.jobDescription.title || '')
            setCompany(jdData.jobDescription.company || '')
            setJobDescription(jdData.jobDescription.description || '')
          }
        }
      } catch (err) {
        console.error('Failed to load job info:', err)
      } finally {
        setLoadingJobInfo(false)
      }
    }

    loadJobInfo()
  }, [resumeId])

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

      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter.content)
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

  const handleDownload = () => {
    if (!coverLetter) return
    const blob = new Blob([coverLetter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Cover-Letter-${jobTitle?.replace(/\s+/g, '-') || 'Document'}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleRefine = async () => {
    if (!refinePrompt.trim() || !coverLetter) return

    setRefining(true)
    setError(null)

    try {
      const response = await fetch('/api/cover-letter/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCoverLetter: coverLetter,
          refinePrompt: refinePrompt.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Refinement failed')
      }

      const data = await response.json()

      if (data.success && data.refinedCoverLetter) {
        setCoverLetter(data.refinedCoverLetter)
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

  if (coverLetter) {
    return (
      <div className="flex flex-col h-full overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Cover Letter</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => setCoverLetter(null)}
              className="text-sm text-purple-300 hover:text-white transition-colors"
            >
              Generate New
            </button>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 whitespace-pre-wrap text-white/90 leading-relaxed mb-6">
          {coverLetter}
        </div>

        {/* Refine AI Section */}
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Refine with AI</h3>
            </div>
            {!showRefineInput && (
              <button
                onClick={() => setShowRefineInput(true)}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all text-sm font-medium"
              >
                Refine Letter
              </button>
            )}
          </div>

          {showRefineInput && (
            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Tell AI how you'd like to refine your cover letter (e.g., "Make it more enthusiastic" or "Add emphasis on my leadership experience")
              </p>
              <textarea
                value={refinePrompt}
                onChange={(e) => setRefinePrompt(e.target.value)}
                placeholder="E.g., Make it more concise, emphasize my technical skills..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefine}
                  disabled={refining || !refinePrompt.trim()}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                    ${refining || !refinePrompt.trim()
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600 text-white'}
                  `}
                >
                  {refining ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Apply Refinement
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRefineInput(false)
                    setRefinePrompt('')
                    setError(null)
                  }}
                  className="px-4 py-3 text-white/60 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="p-4 sm:p-6 md:p-8 pb-6 sm:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Cover Letter Generator</h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg">
            Create a tailored cover letter for your job application.
          </p>
        </div>

        {/* Job Info Banner - Show if loaded from resume */}
        {jobTitle && jobDescription && (
          <div className="mb-6 glass-panel p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
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

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tone
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['professional', 'enthusiastic', 'friendly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-3 rounded-xl border transition-all ${
                    tone === t
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : 'bg-black/20 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
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
            onClick={handleGenerate}
            disabled={generating || !jobTitle.trim() || !jobDescription.trim()}
            className={`
              w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all
              ${generating || !jobTitle.trim() || !jobDescription.trim()
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'glow-button text-white hover:scale-[1.01] active:scale-[0.99]'}
            `}
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                Generating Cover Letter...
              </>
            ) : (
              <>
                Generate Cover Letter
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </>
            )}
          </button>

          {/* Info Footer */}
          <div className="mt-6 sm:mt-8 text-center text-white/40 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              <span>AI-powered cover letter tailored to your resume and the job</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
