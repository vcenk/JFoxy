'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Mic,
  Target,
  Users,
  Zap,
  Brain,
  Sparkles,
  FileText,
  Briefcase,
  ChevronRight,
  CheckCircle,
  Plus,
  Star,
  Loader2,
  Code,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface PracticeTrack {
  id: string
  title: string
  description: string
  questionCount: number
  icon: React.ElementType
  color: string
}

interface Resume {
  id: string
  title: string
  content: any
  updated_at: string
  job_description_id?: string | null
}

interface JobDescription {
  id: string
  title: string
  company_name?: string
  description: string
}

const tracks: PracticeTrack[] = [
  {
    id: 'behavioral',
    title: 'Behavioral & Soft Skills',
    description: 'Perfect your storytelling and prove you\'re a great culture fit with core questions.',
    questionCount: 5,
    icon: Users,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'leadership',
    title: 'Leadership & Strategy',
    description: 'Show you can manage teams, drive initiatives, and make high-level decisions.',
    questionCount: 5,
    icon: Target,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'technical',
    title: 'Technical & Role-Specific',
    description: 'Demonstrate your engineering vision and architectural skills with whiteboard-style problems.',
    questionCount: 5,
    icon: Brain,
    color: 'from-green-500 to-emerald-500'
  }
]

export default function NewPracticeSessionPage() {
  const router = useRouter()

  // Selection State
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'random'>('medium')
  const [isStarting, setIsStarting] = useState(false)

  // Data state
  const [resumes, setResumes] = useState<Resume[]>([])
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New Job Description Input
  const [showNewJobInput, setShowNewJobInput] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newJobCompany, setNewJobCompany] = useState('')
  const [newJobDescription, setNewJobDescription] = useState('')

  // Load Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Resumes
        const resumeRes = await fetch('/api/resumes')
        const resumeData = await resumeRes.json()
        if (resumeData.success && resumeData.data?.resumes) {
          const loadedResumes = resumeData.data.resumes
          setResumes(loadedResumes)
          // Auto-select first resume and its linked job if available
          if (loadedResumes.length > 0) {
            const firstResume = loadedResumes[0]
            setSelectedResumeId(firstResume.id)
            if (firstResume.job_description_id) {
              setSelectedJobDescriptionId(firstResume.job_description_id)
            }
          }
        }

        // Fetch Job Descriptions
        const jdRes = await fetch('/api/job-descriptions')
        const jdData = await jdRes.json()
        if (jdData.success && jdData.data?.jobDescriptions) {
          setJobDescriptions(jdData.data.jobDescriptions)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load initial data. Please refresh.')
      } finally {
        setLoadingResumes(false)
        setLoadingJobs(false)
      }
    }
    fetchData()
  }, [])

  // Smart Recommendation Logic
  const recommendedTrackId = useMemo(() => {
    const selectedJob = jobDescriptions.find(job => job.id === selectedJobDescriptionId)
    if (!selectedJob) return null
    const jobText = `${selectedJob.title} ${selectedJob.description}`.toLowerCase()

    if (jobText.match(/manager|lead|director|vp|head|chief/)) return 'leadership'
    if (jobText.match(/engineer|developer|architect|backend|frontend|api|software|technical|code/)) return 'technical'
    return 'behavioral'
  }, [jobDescriptions, selectedJobDescriptionId])

  const handleStartSession = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume')
      return
    }
    if (!selectedTrack) {
      setError('Please select a practice track')
      return
    }

    setIsStarting(true)

    try {
      const response = await fetch('/api/practice/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedTrack,
          difficulty: selectedDifficulty,
          questionCount: tracks.find(t => t.id === selectedTrack)?.questionCount || 5,
          resumeId: selectedResumeId,
          jobDescriptionId: selectedJobDescriptionId || undefined,
        }),
      })

      const data = await response.json()
      if (data.success && data.data?.session) {
        router.push(`/dashboard/practice/session/${data.data.session.id}`)
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
      if (data.success && data.data?.jobDescription) {
        setJobDescriptions([{
          id: data.data.jobDescription.id,
          title: data.data.jobDescription.title,
          company_name: data.data.jobDescription.company,
          description: data.data.jobDescription.description
        }, ...jobDescriptions])
        setSelectedJobDescriptionId(data.data.jobDescription.id)
        setShowNewJobInput(false)
        setNewJobTitle('')
        setNewJobCompany('')
        setNewJobDescription('')
      } else {
        setError(data.error || 'Failed to create job description')
      }
    } catch (err) {
      console.error('Failed to create job description:', err)
      setError('Failed to create job description')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-[1800px] mx-auto overflow-hidden">

      {/* Header Section */}
      <div className="flex flex-col px-4 pt-1 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/practice"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Practice Command Center</h1>
              <p className="text-white/40 text-xs mt-0.5">Initialize your custom-tailored AI interview session</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Configuration (8 columns) */}
          <div className="lg:col-span-8 space-y-8">

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
                <button onClick={() => setError(null)} className="ml-auto text-xs hover:underline">Dismiss</button>
              </motion.div>
            )}

            {/* Step 1: Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Resume Selection */}
              <section className="glass-panel p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">1</div>
                  <h3 className="text-lg font-bold text-white">Select Resume</h3>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {loadingResumes ? (
                    [1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />)
                  ) : resumes.map(resume => (
                    <button
                      key={resume.id}
                      onClick={() => {
                        setSelectedResumeId(resume.id)
                        if (resume.job_description_id) setSelectedJobDescriptionId(resume.job_description_id)
                      }}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group ${selectedResumeId === resume.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                      <div className={`p-2.5 rounded-lg ${selectedResumeId === resume.id ? 'bg-cyan-500 text-white' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${selectedResumeId === resume.id ? 'text-white' : 'text-white/70'}`}>{resume.title}</p>
                        <p className="text-xs text-white/40">Updated {new Date(resume.updated_at).toLocaleDateString()}</p>
                      </div>
                      {selectedResumeId === resume.id && <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Job Selection */}
              <section className="glass-panel p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-sm">2</div>
                    <h3 className="text-lg font-bold text-white">Target Job</h3>
                  </div>
                  {!showNewJobInput && (
                    <button onClick={() => setShowNewJobInput(true)} className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white/60 transition-all flex items-center gap-2">
                      <Plus className="w-3.5 h-3.5" /> Add New
                    </button>
                  )}
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {/* Industry General Option */}
                  <button
                    onClick={() => setSelectedJobDescriptionId(null)}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group ${selectedJobDescriptionId === null
                      ? 'bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/10'
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                  >
                    <div className={`p-2.5 rounded-lg ${selectedJobDescriptionId === null ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${selectedJobDescriptionId === null ? 'text-white' : 'text-white/70'}`}>Industry General</p>
                      <p className="text-xs text-white/40">Focus on core role competencies</p>
                    </div>
                    {selectedJobDescriptionId === null && <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />}
                  </button>

                  {jobDescriptions.map(job => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJobDescriptionId(job.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 group ${selectedJobDescriptionId === job.id
                        ? 'bg-pink-500/10 border-pink-500/50 shadow-lg shadow-pink-500/10'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                      <div className={`p-2.5 rounded-lg ${selectedJobDescriptionId === job.id ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${selectedJobDescriptionId === job.id ? 'text-white' : 'text-white/70'}`}>{job.title}</p>
                        <p className="text-xs text-white/40">{job.company_name || 'Generic'}</p>
                      </div>
                      {selectedJobDescriptionId === job.id && <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </section>

            </div>

            {/* Step 2: Choose Track */}
            <section className="glass-panel p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">3</div>
                <h3 className="text-lg font-bold text-white">Practice Track</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tracks.map((track) => {
                  const isRecommended = recommendedTrackId === track.id
                  const isSelected = selectedTrack === track.id

                  return (
                    <button
                      key={track.id}
                      onClick={() => setSelectedTrack(track.id)}
                      className={`relative group p-6 rounded-2xl border transition-all text-left flex flex-col gap-4 ${isSelected
                        ? `bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10`
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                          <Sparkles className="w-3 h-3" /> RECOMMENDED
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/40 group-hover:bg-white/10'
                        }`}>
                        <track.icon className="w-6 h-6" />
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold mb-1.5 ${isSelected ? 'text-white' : 'text-white/70'}`}>{track.title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed font-medium">{track.description}</p>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">{track.questionCount} Questions</span>
                        {isSelected && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 4: Choose Difficulty */}
            <section className="glass-panel p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">4</div>
                <h3 className="text-lg font-bold text-white">Difficulty Level</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'easy', label: 'Easy', description: 'Warm-up questions', color: 'from-emerald-500 to-green-500', icon: '🌱' },
                  { id: 'medium', label: 'Standard', description: 'Balanced challenge', color: 'from-blue-500 to-cyan-500', icon: '⚡' },
                  { id: 'hard', label: 'Challenge', description: 'Push your limits', color: 'from-orange-500 to-red-500', icon: '🔥' },
                  { id: 'random', label: 'Random', description: 'Mix of all levels', color: 'from-purple-500 to-pink-500', icon: '🎲' }
                ].map((diff) => {
                  const isSelected = selectedDifficulty === diff.id || (diff.id === 'random' && selectedDifficulty === 'random')
                  return (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id as 'easy' | 'medium' | 'hard' | 'random')}
                      className={`p-4 rounded-xl border transition-all text-center ${isSelected
                        ? `bg-gradient-to-br ${diff.color} border-white/20 shadow-lg`
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                        }`}
                    >
                      <span className="text-2xl mb-2 block">{diff.icon}</span>
                      <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-white/70'}`}>{diff.label}</p>
                      <p className="text-[10px] text-white/50 mt-1">{diff.description}</p>
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-white/30 mt-4 text-center">
                Tip: The system will adapt difficulty based on your performance during the session.
              </p>
            </section>
          </div>

          {/* Sidebar: Summary & Start (4 columns) */}
          <div className="lg:col-span-4">
            <div className="sticky top-0 space-y-6">

              {/* Session Recap Card */}
              <div className="glass-panel p-8 border-t-4 border-t-cyan-500 bg-gradient-to-b from-cyan-500/5 to-transparent">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Session Setup
                </h3>

                <div className="space-y-6 mb-10">
                  <div className="flex flex-col gap-1 py-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Selected Profile</span>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-white font-medium truncate">
                        {resumes.find(r => r.id === selectedResumeId)?.title || 'No Resume Selected'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 py-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Interview Focus</span>
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white font-medium capitalize">
                        {tracks.find(t => t.id === selectedTrack)?.title || 'Select a Track'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 py-1">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Target Role</span>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-white font-medium truncate">
                        {jobDescriptions.find(j => j.id === selectedJobDescriptionId)?.title || 'General Practice'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartSession}
                  disabled={!selectedResumeId || !selectedTrack || isStarting}
                  className={`w-full py-5 rounded-2xl text-lg font-bold transition-all shadow-xl flex items-center justify-center gap-3 group
                      ${!selectedResumeId || !selectedTrack || isStarting
                      ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/20'}
                    `}
                >
                  {isStarting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Initialize Interview
                      <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-white/20 mt-6 font-bold uppercase tracking-tighter">
                  AI will generate role-specific challenges
                </p>
              </div>

              {/* Info Card */}
              <div className="glass-panel p-6 bg-white/5 border-dashed border-white/10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">AI Tailoring Active</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Our LLM engine parses your specific experiences to ask deep questions that uncover your true strengths.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* New Job Modal */}
      <AnimatePresence>
        {showNewJobInput && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel p-8 max-w-lg w-full border-t-4 border-t-pink-500"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Target a New Role</h2>
              <p className="text-white/40 text-sm mb-8">Add the job description to get hyper-relevant interview questions.</p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Job Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Company</label>
                  <input
                    type="text"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    placeholder="e.g. Google, Stripe, or Stealth Startup"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-white/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1">Description</label>
                  <textarea
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    placeholder="Paste the full JD requirements here..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-white/10 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-10">
                <button
                  onClick={() => setShowNewJobInput(false)}
                  className="py-4 rounded-xl font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewJob}
                  className="py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20 text-sm"
                >
                  Save Job Role
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}