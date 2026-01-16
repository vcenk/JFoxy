// app/dashboard/linkedin/[resumeId]/page.tsx
// LinkedIn Profile Optimizer

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Linkedin, ArrowLeft, Loader2, Sparkles, Copy, Check, RefreshCw,
  User, FileText, Briefcase, Star, Lightbulb, ChevronDown, ChevronUp,
  ExternalLink, Award, Target, MessageSquare
} from 'lucide-react'
import { AlertModal } from '@/components/ui/AlertModal'
import {
  LinkedInProfileData,
  LinkedInHeadline,
  LinkedInAbout,
  LinkedInSkill,
  LinkedInFeaturedItem,
  LinkedInExperienceRewrite,
} from '@/lib/types/linkedin'

interface Props {
  params: { resumeId: string }
}

export default function LinkedInOptimizerPage({ params }: Props) {
  const router = useRouter()
  const { resumeId } = params

  // State
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [profileData, setProfileData] = useState<LinkedInProfileData | null>(null)
  const [resumeTitle, setResumeTitle] = useState('')
  const [tone, setTone] = useState<'professional' | 'creative' | 'executive'>('professional')
  const [targetRole, setTargetRole] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch existing data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get resume info
        const resumeRes = await fetch(`/api/resumes/${resumeId}`)
        const resumeData = await resumeRes.json()
        if (resumeData.success && resumeData.data) {
          setResumeTitle(resumeData.data.title || 'Resume')
        }

        // Get existing LinkedIn profile data
        const linkedinRes = await fetch(`/api/linkedin/generate?resumeId=${resumeId}`)
        const linkedinData = await linkedinRes.json()
        if (linkedinData.success && linkedinData.data) {
          setProfileData(linkedinData.data)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [resumeId])

  // Generate profile
  const handleGenerate = async (forceRegenerate = false) => {
    setGenerating(true)
    try {
      const response = await fetch('/api/linkedin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          targetRole: targetRole || undefined,
          tone,
          forceRegenerate,
        }),
      })
      const result = await response.json()
      if (result.success && result.data) {
        setProfileData(result.data)
      } else {
        throw new Error(result.error || 'Failed to generate')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setErrorMessage('Failed to generate LinkedIn profile. Please try again.')
      setShowErrorModal(true)
    } finally {
      setGenerating(false)
    }
  }

  // Copy to clipboard helper
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
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
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20">
                <Linkedin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white">LinkedIn Optimizer</h1>
                <p className="text-xs text-white/50">{resumeTitle}</p>
              </div>
            </div>
          </div>

          {profileData && (
            <button
              onClick={() => handleGenerate(true)}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              Regenerate All
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!profileData ? (
          // Initial state - prompt to generate
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-panel p-8 sm:p-12 text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 mb-6">
                <Linkedin className="w-12 h-12 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Optimize Your LinkedIn Profile</h2>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Transform your resume into a compelling LinkedIn profile that attracts recruiters and opportunities.
              </p>

              {/* Options */}
              <div className="space-y-6 mb-8">
                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-3">Profile Tone</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Corporate & polished' },
                      { id: 'creative', label: 'Creative', icon: Sparkles, desc: 'Personality-driven' },
                      { id: 'executive', label: 'Executive', icon: Award, desc: 'Leadership-focused' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTone(option.id as typeof tone)}
                        className={`
                          p-4 rounded-xl border transition-all text-left
                          ${tone === option.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'}
                        `}
                      >
                        <option.icon className={`w-5 h-5 mb-2 ${tone === option.id ? 'text-blue-400' : 'text-white/50'}`} />
                        <div className={`font-medium ${tone === option.id ? 'text-white' : 'text-white/80'}`}>
                          {option.label}
                        </div>
                        <div className="text-xs text-white/40">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Role (optional) */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Target Role (optional)</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Product Manager, Data Scientist"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleGenerate()}
                disabled={generating}
                className="glow-button px-8 py-4 rounded-xl font-bold text-white flex items-center gap-3 mx-auto"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate LinkedIn Profile
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          // Results view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Headline Section */}
            <HeadlineSection
              data={profileData.headline}
              onCopy={(text) => copyToClipboard(text, 'headline')}
              copied={copiedField === 'headline'}
            />

            {/* About Section */}
            <AboutSection
              data={profileData.about}
              onCopy={(text) => copyToClipboard(text, 'about')}
              copied={copiedField === 'about'}
            />

            {/* Skills Section */}
            <SkillsSection
              skills={profileData.skills}
              onCopy={(text) => copyToClipboard(text, 'skills')}
              copied={copiedField === 'skills'}
            />

            {/* Featured Section */}
            <FeaturedSection items={profileData.featured} />

            {/* Experience Rewrites */}
            <ExperienceSection experiences={profileData.experienceRewrites} />

            {/* Optimization Tips */}
            <TipsSection tips={profileData.optimizationTips} />
          </motion.div>
        )}
      </div>

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Generation Failed"
        message={errorMessage}
        variant="error"
        okText="OK"
      />
    </div>
  )
}

// --- Sub-Components ---

function HeadlineSection({
  data,
  onCopy,
  copied,
}: {
  data: LinkedInHeadline
  onCopy: (text: string) => void
  copied: boolean
}) {
  const [showAlternates, setShowAlternates] = useState(false)

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-bold text-white">Headline</h3>
        </div>
        <button
          onClick={() => onCopy(data.primary)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
        <p className="text-white text-lg font-medium">{data.primary}</p>
        <p className="text-white/40 text-xs mt-2">{data.primary.length}/220 characters</p>
      </div>

      {data.alternates && data.alternates.length > 0 && (
        <>
          <button
            onClick={() => setShowAlternates(!showAlternates)}
            className="flex items-center gap-2 mt-4 text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            {showAlternates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showAlternates ? 'Hide' : 'Show'} {data.alternates.length} alternatives
          </button>

          <AnimatePresence>
            {showAlternates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 mt-4">
                  {data.alternates.map((alt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-black/20 rounded-lg p-3 border border-white/5"
                    >
                      <p className="text-white/80 text-sm flex-1">{alt}</p>
                      <button
                        onClick={() => onCopy(alt)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white/50" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function AboutSection({
  data,
  onCopy,
  copied,
}: {
  data: LinkedInAbout
  onCopy: (text: string) => void
  copied: boolean
}) {
  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-bold text-white">About Section</h3>
        </div>
        <button
          onClick={() => onCopy(data.text)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Hook highlight */}
      <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <p className="text-xs font-medium text-purple-400 mb-1">Opening Hook</p>
        <p className="text-white/90">{data.hook}</p>
      </div>

      {/* Full text */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/5">
        <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{data.text}</p>
        <p className="text-white/40 text-xs mt-3">{data.text.length}/2,000 characters</p>
      </div>

      {/* Key strengths */}
      <div className="mt-4">
        <p className="text-xs font-medium text-white/50 mb-2">Key Strengths Mentioned</p>
        <div className="flex flex-wrap gap-2">
          {data.keyStrengths.map((strength, i) => (
            <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70">
              {strength}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillsSection({
  skills,
  onCopy,
  copied,
}: {
  skills: LinkedInSkill[]
  onCopy: (text: string) => void
  copied: boolean
}) {
  const featuredSkills = skills.filter(s => s.priority === 'featured')
  const standardSkills = skills.filter(s => s.priority === 'standard')
  const allSkillNames = skills.map(s => s.name).join(', ')

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Star className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="font-bold text-white">Skills</h3>
        </div>
        <button
          onClick={() => onCopy(allSkillNames)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>

      {/* Featured Skills */}
      {featuredSkills.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-green-400 mb-3 flex items-center gap-2">
            <Star className="w-3 h-3" /> Featured Skills (Pin these at top)
          </p>
          <div className="flex flex-wrap gap-2">
            {featuredSkills.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-300 font-medium"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Standard Skills by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['technical', 'business', 'soft', 'industry', 'tools'].map((category) => {
          const categorySkills = standardSkills.filter(s => s.category === category)
          if (categorySkills.length === 0) return null
          return (
            <div key={category} className="bg-black/20 rounded-lg p-4">
              <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FeaturedSection({ items }: { items: LinkedInFeaturedItem[] }) {
  if (!items || items.length === 0) return null

  const typeIcons = {
    accomplishment: Award,
    project: Briefcase,
    publication: FileText,
    certification: Star,
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Award className="w-5 h-5 text-amber-400" />
        </div>
        <h3 className="font-bold text-white">Featured Section</h3>
      </div>

      <p className="text-white/50 text-sm mb-4">
        Add these to your Featured section to showcase your best work
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => {
          const Icon = typeIcons[item.type] || Award
          return (
            <div
              key={i}
              className="bg-black/20 rounded-xl p-4 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                  {item.type}
                </span>
              </div>
              <h4 className="font-medium text-white mb-2">{item.title}</h4>
              <p className="text-sm text-white/60 mb-3">{item.description}</p>
              {item.suggestedMedia && (
                <p className="text-xs text-white/40 italic">
                  Suggested media: {item.suggestedMedia}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ExperienceSection({ experiences }: { experiences: LinkedInExperienceRewrite[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!experiences || experiences.length === 0) return null

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <Briefcase className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="font-bold text-white">Experience Optimization</h3>
      </div>

      <p className="text-white/50 text-sm mb-4">
        Optimized bullet points for each position
      </p>

      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="text-left">
                <h4 className="font-medium text-white">{exp.title}</h4>
                <p className="text-sm text-white/50">{exp.company}</p>
              </div>
              {expandedIndex === i ? (
                <ChevronUp className="w-5 h-5 text-white/50" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/50" />
              )}
            </button>

            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 border-t border-white/5 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-cyan-400 mb-2">Optimized Bullets</p>
                      <ul className="space-y-2">
                        {exp.optimizedBullets.map((bullet, j) => (
                          <li key={j} className="flex gap-2 text-sm text-white/80">
                            <span className="text-cyan-400">•</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/40 mb-2">What was improved</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.improvements.map((imp, j) => (
                          <span key={j} className="px-2 py-1 bg-green-500/10 rounded text-xs text-green-400">
                            {imp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

function TipsSection({ tips }: { tips: string[] }) {
  if (!tips || tips.length === 0) return null

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-yellow-500/20">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <h3 className="font-bold text-white">Optimization Tips</h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 bg-black/20 rounded-lg border border-white/5"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-yellow-400">{i + 1}</span>
            </div>
            <p className="text-sm text-white/70">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
