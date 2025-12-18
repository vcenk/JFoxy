'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Mic, Target, Users, Zap, Brain, Sparkles, FileText, Briefcase, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PracticeTrack {
  id: string
  title: string
  description: string
  questionCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  icon: React.ElementType
  color: string
}

interface Resume {
  id: string
  title: string
  content: any
}

interface JobDescription {
  id: string
  title: string
  company?: string
  description: string
}

const tracks: PracticeTrack[] = [
  {
    id: 'behavioral',
    title: 'Behavioral & Soft Skills',
    description: 'Master standard questions about your past experiences and teamwork.',
    questionCount: 3,
    difficulty: 'Medium',
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'leadership',
    title: 'Leadership & Strategy',
    description: 'Demonstrate your ability to lead teams and drive strategic initiatives.',
    questionCount: 3,
    difficulty: 'Hard',
    icon: Target,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'conflict',
    title: 'Conflict Resolution',
    description: 'Show how you handle disagreements and difficult situations professionally.',
    questionCount: 3,
    difficulty: 'Medium',
    icon: Zap,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Technical architecture and scalability discussions for engineering roles.',
    questionCount: 3,
    difficulty: 'Hard',
    icon: Brain,
    color: 'from-green-500 to-emerald-500'
  }
]

export default function NewPracticeSessionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'resume' | 'job' | 'track'>('resume')
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  // Data state
  const [resumes, setResumes] = useState<Resume[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Job description input for new JD
  const [showNewJobInput, setShowNewJobInput] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newJobCompany, setNewJobCompany] = useState('')
  const [newJobDescription, setNewJobDescription] = useState('')

  // Load resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('/api/resumes')
        const data = await response.json()
        if (data.success && data.resumes) {
          setResumes(data.resumes)
        }
      } catch (err) {
        console.error('Failed to load resumes:', err)
        setError('Failed to load resumes')
      } finally {
        setLoadingResumes(false)
      }
    }
    fetchResumes()
  }, [])

  // Load job descriptions when moving to job step
  useEffect(() => {
    if (step === 'job') {
      const fetchJobDescriptions = async () => {
        setLoadingJobs(true)
        try {
          const response = await fetch('/api/job-descriptions')
          const data = await response.json()
          if (data.success && data.jobDescriptions) {
            setJobDescriptions(data.jobDescriptions)
          }
        } catch (err) {
          console.error('Failed to load job descriptions:', err)
        } finally {
          setLoadingJobs(false)
        }
      }
      fetchJobDescriptions()
    }
  }, [step])

  const handleStartSession = async (trackId: string) => {
    if (!selectedResumeId) {
      setError('Please select a resume first')
      return
    }

    setSelectedTrack(trackId)
    setIsStarting(true)

    try {
      // Create practice session with questions
      const response = await fetch('/api/practice/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: trackId,
          difficulty: tracks.find(t => t.id === trackId)?.difficulty.toLowerCase() || 'medium',
          questionCount: tracks.find(t => t.id === trackId)?.questionCount || 3,
          resumeId: selectedResumeId,
          jobDescriptionId: selectedJobDescriptionId || undefined,
        }),
      })

      const data = await response.json()

      if (data.success && data.session) {
        router.push(`/dashboard/practice/session/${data.session.id}`)
      } else {
        setError(data.error || 'Failed to create practice session')
        setIsStarting(false)
      }
    } catch (err) {
      console.error('Failed to start session:', err)
      setError('Failed to start practice session')
      setIsStarting(false)
    }
  }

  const handleCreateNewJob = async () => {
    if (!newJobTitle.trim() || !newJobDescription.trim()) {
      setError('Please provide job title and description')
      return
    }

    try {
      const response = await fetch('/api/job-description/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle.trim(),
          company: newJobCompany.trim() || null,
          description: newJobDescription.trim(),
        }),
      })

      const data = await response.json()

      if (data.success && data.jobDescription) {
        setJobDescriptions([data.jobDescription, ...jobDescriptions])
        setSelectedJobDescriptionId(data.jobDescription.id)
        setShowNewJobInput(false)
        setNewJobTitle('')
        setNewJobCompany('')
        setNewJobDescription('')
        setStep('track')
      } else {
        setError(data.error || 'Failed to create job description')
      }
    } catch (err) {
      console.error('Failed to create job description:', err)
      setError('Failed to create job description')
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/practice"
          className="inline-flex items-center text-sm text-white/60 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Practice
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          {step === 'resume' && 'Select Your Resume'}
          {step === 'job' && 'Choose Job Description'}
          {step === 'track' && 'Select Practice Track'}
        </h1>
        <p className="text-white/60 max-w-2xl">
          {step === 'resume' && 'Choose the resume you want to practice with. This helps us personalize questions for you.'}
          {step === 'job' && 'Select or add a job description to tailor practice questions to your target role.'}
          {step === 'track' && 'Choose a focused track to sharpen specific interview skills. Our AI will guide you through a session.'}
        </p>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mt-6">
          <div className={`flex items-center gap-2 ${step === 'resume' ? 'text-purple-400' : 'text-white/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'resume' ? 'bg-purple-500' : selectedResumeId ? 'bg-green-500' : 'bg-white/10'}`}>
              {selectedResumeId ? '✓' : '1'}
            </div>
            <span className="text-sm font-medium">Resume</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/20" />
          <div className={`flex items-center gap-2 ${step === 'job' ? 'text-purple-400' : 'text-white/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'job' ? 'bg-purple-500' : selectedJobDescriptionId ? 'bg-green-500' : 'bg-white/10'}`}>
              {selectedJobDescriptionId ? '✓' : '2'}
            </div>
            <span className="text-sm font-medium">Job</span>
          </div>
          <ChevronRight className="w-4 h-4 text-white/20" />
          <div className={`flex items-center gap-2 ${step === 'track' ? 'text-purple-400' : 'text-white/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === 'track' ? 'bg-purple-500' : 'bg-white/10'}`}>
              3
            </div>
            <span className="text-sm font-medium">Track</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
          {error}
        </div>
      )}

      {/* Step 1: Resume Selection */}
      {step === 'resume' && (
        <div className="max-w-3xl">
          {loadingResumes ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="glass-panel p-8 text-center">
              <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Resumes Found</h3>
              <p className="text-white/60 mb-6">You need to create a resume first before starting practice.</p>
              <Link
                href="/dashboard/resume-builder"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Create Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setSelectedResumeId(resume.id)
                    setStep('job')
                  }}
                  className={`
                    glass-panel p-6 cursor-pointer group transition-all duration-300
                    ${selectedResumeId === resume.id ? 'ring-2 ring-purple-500 bg-white/10' : 'hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-1">{resume.title}</h3>
                        <p className="text-sm text-white/60">
                          {resume.content?.basics?.headline || 'No headline'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Job Description Selection */}
      {step === 'job' && (
        <div className="max-w-3xl">
          {loadingJobs ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Skip Option */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedJobDescriptionId(null)
                  setStep('track')
                }}
                className="glass-panel p-6 cursor-pointer hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Skip Job Description</h3>
                    <p className="text-sm text-white/60">Practice with general questions</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </div>
              </motion.div>

              {/* Create New Job Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6"
              >
                <button
                  onClick={() => setShowNewJobInput(!showNewJobInput)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">Add New Job Description</h3>
                      <p className="text-sm text-white/60">Create a custom job posting to practice for</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-white/40 transition-transform ${showNewJobInput ? 'rotate-90' : ''}`} />
                </button>

                {showNewJobInput && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Job Title*</label>
                      <input
                        type="text"
                        value={newJobTitle}
                        onChange={(e) => setNewJobTitle(e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Company (Optional)</label>
                      <input
                        type="text"
                        value={newJobCompany}
                        onChange={(e) => setNewJobCompany(e.target.value)}
                        placeholder="e.g., TechCorp"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Job Description*</label>
                      <textarea
                        value={newJobDescription}
                        onChange={(e) => setNewJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        rows={6}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCreateNewJob}
                        className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
                      >
                        Create & Continue
                      </button>
                      <button
                        onClick={() => setShowNewJobInput(false)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Existing Job Descriptions */}
              {jobDescriptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Your Job Descriptions</h3>
                  {jobDescriptions.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedJobDescriptionId(job.id)
                        setStep('track')
                      }}
                      className={`
                        glass-panel p-6 cursor-pointer group transition-all duration-300
                        ${selectedJobDescriptionId === job.id ? 'ring-2 ring-purple-500 bg-white/10' : 'hover:bg-white/5'}
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white mb-1">{job.title}</h3>
                            {job.company && (
                              <p className="text-sm text-white/60 mb-2">{job.company}</p>
                            )}
                            <p className="text-sm text-white/40 line-clamp-2">
                              {job.description.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={() => setStep('resume')}
                className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                ← Back to Resume Selection
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Track Selection */}
      {step === 'track' && (
        <div className="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isStarting && handleStartSession(track.id)}
                className={`
                  relative overflow-hidden rounded-2xl p-6 cursor-pointer group
                  bg-white/5 backdrop-blur-xl border border-white/10
                  hover:bg-white/10 hover:border-white/20 transition-all duration-300
                  ${selectedTrack === track.id ? 'ring-2 ring-purple-500' : ''}
                `}
              >
                {/* Background Gradient */}
                <div className={`
                  absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${track.color}
                  opacity-10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity
                `} />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`
                      p-3 rounded-xl bg-gradient-to-br ${track.color}
                      text-white shadow-lg
                    `}>
                      <track.icon className="w-6 h-6" />
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium border
                      ${track.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/20 text-green-300' : ''}
                      ${track.difficulty === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' : ''}
                      ${track.difficulty === 'Hard' ? 'bg-red-500/10 border-red-500/20 text-red-300' : ''}
                    `}>
                      {track.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{track.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {track.description}
                  </p>

                  <div className="flex items-center text-white/40 text-sm">
                    <Mic className="w-4 h-4 mr-2" />
                    <span>{track.questionCount} Questions</span>
                  </div>
                </div>

                {/* Loading Overlay */}
                {selectedTrack === track.id && isStarting && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                      <span className="text-white text-sm font-medium">Preparing Session...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Back Button */}
          <button
            onClick={() => setStep('job')}
            className="mt-6 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            ← Back to Job Selection
          </button>
        </div>
      )}
    </div>
  )
}
