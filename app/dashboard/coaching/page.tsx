// app/dashboard/coaching/page.tsx
// Interview coaching tools - SWOT, STAR, Gap Defense, Intro Pitch

'use client'

import { useState } from 'react'
import { Target, Star, Shield, Mic, Loader2 } from 'lucide-react'

type Tab = 'swot' | 'star' | 'gap' | 'intro'

export default function CoachingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('swot')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'swot' as Tab, name: 'SWOT Analysis', icon: Target, color: 'blue' },
    { id: 'star' as Tab, name: 'STAR Stories', icon: Star, color: 'yellow' },
    { id: 'gap' as Tab, name: 'Gap Defense', icon: Shield, color: 'green' },
    { id: 'intro' as Tab, name: 'Intro Pitch', icon: Mic, color: 'purple' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'swot':
        return <SwotTab loading={loading} setLoading={setLoading} />
      case 'star':
        return <StarTab loading={loading} setLoading={setLoading} />
      case 'gap':
        return <GapTab loading={loading} setLoading={setLoading} />
      case 'intro':
        return <IntroTab loading={loading} setLoading={setLoading} />
    }
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Interview Coaching</h1>
        <p className="text-white/70">
          AI-powered tools to prepare you for common interview challenges
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 p-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl
                transition-all duration-200 text-sm font-semibold
                ${
                  isActive
                    ? 'bg-purple-500/30 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {renderTabContent()}
    </div>
  )
}

import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'

// ... (rest of the imports)

// ... (CoachingPage component)

function SwotTab({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) {
  const [swot, setSwot] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      // 1. Get the user's most recent resume
      const resumeListResponse = await fetch('/api/resume/list')
      const resumeListData = await resumeListResponse.json()
      
      if (!resumeListData.success || resumeListData.resumes.length === 0) {
        alert('You must have at least one resume to generate a SWOT analysis.')
        setLoading(false)
        return
      }
      
      const latestResumeId = resumeListData.resumes[0].id

      // 2. Generate SWOT analysis using that resume
      const swotResponse = await fetch('/api/coaching/swot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: latestResumeId }),
      })

      const swotData = await swotResponse.json()

      if (swotResponse.ok) {
        setSwot(swotData)
      } else {
        throw new Error(swotData.error || 'Failed to generate SWOT analysis.')
      }
    } catch (error) {
      console.error('Error generating SWOT:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard title="SWOT Analysis">
      <GlassCardSection>
        <p className="text-white/70 mb-6">
          Understand your Strengths, Weaknesses, Opportunities, and Threats in the context of your target role.
        </p>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`
            flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all text-white
            ${loading 
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/20'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate SWOT Analysis</span>
          )}
        </button>
      </GlassCardSection>
      
      {swot && (
        <GlassCardSection>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-3">Strengths</h3>
              <ul className="space-y-2">
                {swot.strengths?.map((item: string, i: number) => (
                  <li key={i} className="text-white/80 list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-300 mb-3">Weaknesses</h3>
              <ul className="space-y-2">
                {swot.weaknesses?.map((item: string, i: number) => (
                  <li key={i} className="text-white/80 list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Opportunities</h3>
              <ul className="space-y-2">
                {swot.opportunities?.map((item: string, i: number) => (
                  <li key={i} className="text-white/80 list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-3">Threats</h3>
              <ul className="space-y-2">
                {swot.threats?.map((item: string, i: number) => (
                  <li key={i} className="text-white/80 list-disc list-inside">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCardSection>
      )}
    </GlassCard>
  )
}

function StarTab({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) {
  const [question, setQuestion] = useState('')
  const [story, setStory] = useState<any>(null)

  const handleGenerate = async () => {
    if (!question.trim()) {
      alert('Please enter a question')
      return
    }

    setLoading(true)
    try {
      // 1. Get the user's most recent resume
      const resumeListResponse = await fetch('/api/resume/list')
      const resumeListData = await resumeListResponse.json()
      
      if (!resumeListData.success || resumeListData.resumes.length === 0) {
        alert('You must have at least one resume to generate a STAR story.')
        setLoading(false)
        return
      }
      
      const latestResumeId = resumeListData.resumes[0].id

      // 2. Generate STAR story
      const starResponse = await fetch('/api/coaching/star', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: latestResumeId, question }),
      })

      const starData = await starResponse.json()

      if (starResponse.ok) {
        setStory(starData)
      } else {
        throw new Error(starData.error || 'Failed to generate STAR story.')
      }
    } catch (error) {
      console.error('Error generating STAR story:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard title="STAR Story Builder">
      <GlassCardSection>
        <p className="text-white/70 mb-6">
          Create structured answers for behavioral questions using the Situation-Task-Action-Result framework.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Interview Question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., Tell me about a time when you led a project..."
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-all"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !question.trim()}
          className={`
            flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all text-white
            ${loading || !question.trim()
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/20'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Building Story...</span>
            </>
          ) : (
            <span>Build STAR Story</span>
          )}
        </button>
      </GlassCardSection>

      {story && (
        <GlassCardSection title="Your Story">
          <div className="mt-4 space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Situation</h3>
              <p className="text-white/80">{story.situation}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Task</h3>
              <p className="text-white/80">{story.task}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Action</h3>
              <p className="text-white/80">{story.action}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">Result</h3>
              <p className="text-white/80">{story.result}</p>
            </div>
          </div>
        </GlassCardSection>
      )}
    </GlassCard>
  )
}

function GapTab({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) {
  const [gapType, setGapType] = useState('employment_gap')
  const [gapDescription, setGapDescription] = useState('')
  const [defense, setDefense] = useState<any>(null)

  const handleGenerate = async () => {
    if (!gapDescription.trim()) {
      alert('Please describe your gap or weakness.')
      return
    }
    setLoading(true)
    try {
      // 1. Get user's most recent resume
      const resumeListResponse = await fetch('/api/resume/list')
      const resumeListData = await resumeListResponse.json()
      if (!resumeListData.success || resumeListData.resumes.length === 0) {
        alert('You must have at least one resume to generate a gap defense.')
        setLoading(false)
        return
      }
      const latestResumeId = resumeListData.resumes[0].id

      // 2. Generate gap defense
      const defenseResponse = await fetch('/api/coaching/gap-defense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: latestResumeId, gapType, gapDescription }),
      })

      const defenseData = await defenseResponse.json()
      if (defenseResponse.ok) {
        setDefense(defenseData)
      } else {
        throw new Error(defenseData.error || 'Failed to generate gap defense.')
      }
    } catch (error) {
      console.error('Error generating gap defense:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const gapTypes = [
    { id: 'employment_gap', name: 'Employment Gap' },
    { id: 'short_tenure', name: 'Short Tenure / Job Hopping' },
    { id: 'missing_skill', name: 'Missing a Required Skill' },
    { id: 'industry_switch', name: 'Switching Industries' },
    { id: 'other', name: 'Other Weakness' },
  ]

  return (
    <GlassCard title="Gap Defense (3-P Framework)">
      <GlassCardSection>
        <p className="text-white/70 mb-6">
          Address resume gaps or weaknesses with the "Pivot, Proof, and Promise" framework.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Type of Gap / Weakness
            </label>
            <select
              value={gapType}
              onChange={(e) => setGapType(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {gapTypes.map(type => (
                <option key={type.id} value={type.id} className="bg-gray-800">{type.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Briefly Describe the Gap
            </label>
            <textarea
              value={gapDescription}
              onChange={(e) => setGapDescription(e.target.value)}
              placeholder="E.g., I took a 2-year break to care for a family member."
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !gapDescription.trim()}
          className={`
            flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all text-white
            ${loading || !gapDescription.trim()
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/20'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Defense...</span>
            </>
          ) : (
            <span>Generate Defense</span>
          )}
        </button>
      </GlassCardSection>

      {defense && (
        <GlassCardSection title="Your Defense Script">
          <div className="mt-4 space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">1. The Pivot (Reframe)</h3>
              <p className="text-white/80">{defense.pivot}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">2. The Proof (Evidence)</h3>
              <p className="text-white/80">{defense.proof}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">3. The Promise (Growth)</h3>
              <p className="text-white/80">{defense.promise}</p>
            </div>
          </div>
        </GlassCardSection>
      )}
    </GlassCard>
  )
}

function IntroTab({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) {
  const [duration, setDuration] = useState(90)
  const [style, setStyle] = useState('professional')
  const [pitch, setPitch] = useState<any>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      // 1. Get user's most recent resume
      const resumeListResponse = await fetch('/api/resume/list')
      const resumeListData = await resumeListResponse.json()
      if (!resumeListData.success || resumeListData.resumes.length === 0) {
        alert('You must have at least one resume to generate an intro pitch.')
        setLoading(false)
        return
      }
      const latestResumeId = resumeListData.resumes[0].id

      // 2. Generate intro pitch
      const pitchResponse = await fetch('/api/coaching/intro-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: latestResumeId,
          targetDuration: duration,
          style: style,
        }),
      })

      const pitchData = await pitchResponse.json()
      if (pitchResponse.ok) {
        setPitch(pitchData)
      } else {
        throw new Error(pitchData.error || 'Failed to generate intro pitch.')
      }
    } catch (error) {
      console.error('Error generating intro pitch:', error)
      alert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard title="Intro Pitch Generator">
      <GlassCardSection>
        <p className="text-white/70 mb-6">
          Perfect your "Tell me about yourself" answer with a structured, AI-generated pitch.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={60} className="bg-gray-800">60 seconds</option>
              <option value={90} className="bg-gray-800">90 seconds</option>
              <option value={120} className="bg-gray-800">120 seconds</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="professional" className="bg-gray-800">Professional</option>
              <option value="conversational" className="bg-gray-800">Conversational</option>
              <option value="enthusiastic" className="bg-gray-800">Enthusiastic</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`
            flex items-center space-x-2 px-6 py-3 font-medium rounded-lg transition-all text-white
            ${loading
              ? 'bg-purple-500/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-lg shadow-purple-500/20'}
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Pitch...</span>
            </>
          ) : (
            <span>Generate Pitch</span>
          )}
        </button>
      </GlassCardSection>

      {pitch && (
        <GlassCardSection title="Your Generated Pitch">
          <div className="mt-4 space-y-4 bg-black/20 p-6 rounded-lg">
            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{pitch.pitch_text}</p>
          </div>
          <div className="mt-6 space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Hook</h3>
              <p className="text-white/80">{pitch.hook}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Core Message</h3>
              <p className="text-white/80">{pitch.core_message}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Call to Action</h3>
              <p className="text-white/80">{pitch.call_to_action}</p>
            </div>
          </div>
        </GlassCardSection>
      )}
    </GlassCard>
  )
}
