'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Clock, Sparkles, ArrowRight, Loader2, Volume2 } from 'lucide-react'

interface Resume {
  id: string
  title: string
  job_description_id?: string
  updated_at: string
}

interface JobDescription {
  id: string
  title: string
  company?: string
  description: string
}

interface VoicePersona {
  voice_id: string
  name: string
  gender: 'female' | 'male'
  personality: string
  age_range: string
  best_for: string[]
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 Minutes', description: '3 questions - Quick practice' },
  { value: 20, label: '20 Minutes', description: '4 questions - Standard practice' },
  { value: 30, label: '30 Minutes', description: '5 questions - Comprehensive practice' }
]

export default function NewMockInterviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [voices, setVoices] = useState<VoicePersona[]>([])

  // Form state
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [duration, setDuration] = useState<number>(20)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load resumes (same endpoint as practice section)
        const resumesRes = await fetch('/api/resumes')
        const resumesData = await resumesRes.json()
        if (resumesData.success && resumesData.data?.resumes) {
          const loadedResumes = resumesData.data.resumes
          setResumes(loadedResumes)

          // Auto-select first resume and its linked job if available
          if (loadedResumes.length > 0) {
            const firstResume = loadedResumes[0]
            setSelectedResumeId(firstResume.id)

            // Auto-select job if resume has one linked
            if (firstResume.job_description_id) {
              setSelectedJobId(firstResume.job_description_id)
            }
          }
        }

        // Load job descriptions (same endpoint as practice section)
        const jdRes = await fetch('/api/job-descriptions')
        const jdData = await jdRes.json()
        if (jdData.success && jdData.data?.jobDescriptions) {
          setJobDescriptions(jdData.data.jobDescriptions)
        }

        // Load available voices (from interviewer personas)
        // For now, we'll use the default voice from user preferences
        // In a future enhancement, we can add a voice selector

      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleStartInterview = async () => {
    if (!selectedResumeId) {
      alert('Please select a resume')
      return
    }

    setCreating(true)

    try {
      const response = await fetch('/api/mock/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobDescriptionId: selectedJobId || null,
          durationMinutes: duration,
          voiceId: selectedVoiceId || undefined
        })
      })

      const data = await response.json()

      if (data.success) {
        // Navigate to interview page
        router.push(`/dashboard/mock/${data.data.session.id}`)
      } else {
        alert(data.error || 'Failed to create interview session')
        setCreating(false)
      }
    } catch (error) {
      console.error('Failed to start interview:', error)
      alert('An error occurred while starting the interview')
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Start Mock Interview
        </h1>
        <p className="text-gray-400">
          Practice with an AI interviewer and get detailed feedback on your answers
        </p>
      </div>

      {/* Setup Form */}
      <div className="bg-[#1E1E2E] rounded-xl p-6 space-y-6">

        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Resume *
          </label>
          {resumes.length === 0 ? (
            <div className="bg-[#2A2A3C] rounded-lg p-4 text-center">
              <p className="text-gray-400 mb-3">No resumes found</p>
              <button
                onClick={() => router.push('/dashboard/resume')}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                Create a resume first →
              </button>
            </div>
          ) : (
            <select
              value={selectedResumeId}
              onChange={(e) => {
                const resumeId = e.target.value
                setSelectedResumeId(resumeId)
                // Auto-select linked job description if the resume has one
                const selectedResume = resumes.find(r => r.id === resumeId)
                if (selectedResume?.job_description_id) {
                  setSelectedJobId(selectedResume.job_description_id)
                }
              }}
              className="w-full bg-[#2A2A3C] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                  {resume.job_description_id && ' (has linked job)'}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Job Description Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Target Job (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Questions will be tailored to this job if selected
          </p>
          {jobDescriptions.length === 0 ? (
            <div className="bg-[#2A2A3C] rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">
                No job descriptions yet. Questions will be general.
              </p>
            </div>
          ) : (
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-[#2A2A3C] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">General interview (no specific job)</option>
              {jobDescriptions.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title} {jd.company ? `at ${jd.company}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Interview Duration *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setDuration(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${duration === option.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-[#2A2A3C] hover:border-gray-600'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">{option.label}</span>
                </div>
                <p className="text-xs text-gray-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>What to expect:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>The AI interviewer will start with casual small talk</li>
                <li>You'll be asked {duration === 15 ? '3' : duration === 20 ? '4' : '5'} behavioral interview questions</li>
                <li>Answer naturally using your microphone</li>
                <li>Get instant feedback and a comprehensive report at the end</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-[#2A2A3C] hover:bg-[#3A3A4C] text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartInterview}
            disabled={!selectedResumeId || creating}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Interview...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Interview
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-[#1E1E2E] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Interview Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Speak Clearly</h4>
              <p className="text-sm text-gray-400">Find a quiet space and speak at a natural pace</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Use STAR Method</h4>
              <p className="text-sm text-gray-400">Structure answers: Situation, Task, Action, Result</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Take Your Time</h4>
              <p className="text-sm text-gray-400">Pause to think before answering - it's natural</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Listen Carefully</h4>
              <p className="text-sm text-gray-400">The AI will ask follow-ups - answer thoroughly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
