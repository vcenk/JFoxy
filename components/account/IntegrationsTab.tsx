'use client'

import { useState, useEffect } from 'react'
import { Mic, Play, Loader2, CheckCircle, Save, Pause, Globe, Sparkles, Lock, User, Video, Volume2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AlertModal } from '@/components/ui/AlertModal'
import { SUBSCRIPTION_TIERS, TIER_LIMITS } from '@/lib/config/constants'
import { ALL_PERSONAS, InterviewerPersona } from '@/lib/data/interviewerPersonas'

interface IntegrationsTabProps {
  prefs: any
  onSave: (prefs: any) => void
  saving: boolean
  success: boolean
  profile: any // Pass profile from AccountPage
}

export function IntegrationsTab({ prefs, onSave, saving, success, profile }: IntegrationsTabProps) {
  const [deepgram, setDeepgram] = useState({
    language: prefs.deepgram?.language || 'en',
    gender: prefs.deepgram?.gender || 'female',
    style: prefs.deepgram?.style || 'professional',
  })
  // Mock interview persona selection (uses OpenAI Realtime voices)
  const [mockInterview, setMockInterview] = useState({
    persona_name: prefs.mockInterview?.persona_name || 'Sarah Mitchell',
  })

  const [languages, setLanguages] = useState<any[]>([])
  const [styles, setStyles] = useState<any[]>([])
  const [genders, setGenders] = useState<any[]>([])
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all')
  const [loadingData, setLoadingData] = useState(true)
  const [playingPreview, setPlayingPreview] = useState(false)

  // Alert modal state
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertModalContent, setAlertModalContent] = useState({ title: '', message: '', variant: 'error' as 'error' | 'warning' | 'info' })

  // Access user's tier from profile
  const userTier = profile?.subscription_tier || SUBSCRIPTION_TIERS.FREE
  const isPro = userTier === SUBSCRIPTION_TIERS.PRO || userTier === SUBSCRIPTION_TIERS.INTERVIEW_READY
  const isInterviewReady = userTier === SUBSCRIPTION_TIERS.INTERVIEW_READY

  // Determine access based on tier
  const canAccessAllLanguages = isPro
  const canAccessAllGenders = isPro
  const canAccessProStyles = isPro // Professional, Conversational, Calm
  const canAccessPremiumStyles = isInterviewReady // All 6

  // Get personas based on gender filter
  const filteredPersonas = genderFilter === 'all'
    ? ALL_PERSONAS
    : ALL_PERSONAS.filter(p => p.gender === genderFilter)

  // Get selected persona
  const selectedPersona = ALL_PERSONAS.find(p => p.name === mockInterview.persona_name) || ALL_PERSONAS[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const voiceRes = await fetch('/api/deepgram/voices')

        if (voiceRes.ok) {
          const data = await voiceRes.json()
          // Filter to only English variants
          const englishLanguages = data.languages.filter((l: any) => l.code.startsWith('en'))
          setLanguages(englishLanguages)

          // Filter styles based on tier access
          let availableStyles = data.styles;
          if (!canAccessPremiumStyles) {
            // Filter out 'premium' styles if not premium tier
            availableStyles = availableStyles.filter((s:any) => s.tier !== 'premium');
          }
          if (!canAccessProStyles) {
             // Filter to only 'basic' styles if not pro or premium
             availableStyles = availableStyles.filter((s:any) => s.tier === 'basic'); // Assuming deepgram styles have a 'tier'
          }
          setStyles(availableStyles)
          setGenders(data.genders) // All genders are fetched
        }
      } catch (error) {
        console.error('Failed to load integration data', error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [canAccessAllLanguages, canAccessAllGenders, canAccessProStyles, canAccessPremiumStyles])

  const handlePlayPreview = async () => {
    // Only play preview if selected options are allowed for the user's tier
    if (!canAccessAllLanguages && deepgram.language !== 'en') return;
    if (!canAccessAllGenders && deepgram.gender !== 'female') return;
    if (!canAccessProStyles && deepgram.style !== 'professional') return;
    if (!canAccessPremiumStyles && styles.find(s => s.id === deepgram.style)?.tier === 'premium') return;

    try {
      setPlayingPreview(true)
      const response = await fetch('/api/deepgram/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: deepgram.language,
          gender: deepgram.gender,
          style: deepgram.style,
        }),
      })

      if (!response.ok) throw new Error('Preview failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.onended = () => setPlayingPreview(false)
      await audio.play()
    } catch (error) {
      console.error('Voice preview error:', error)
      setAlertModalContent({
        title: 'Preview Failed',
        message: 'Failed to play voice preview. Please try again.',
        variant: 'error'
      })
      setShowAlertModal(true)
      setPlayingPreview(false)
    }
  }

  const handleSave = async () => {
    // Before saving, ensure the selected options are valid for the user's tier
    const currentPrefs = deepgram;

    // Validate tier access (skip validation if using defaults)
    const isUsingDefaults = currentPrefs.language === 'en' && currentPrefs.gender === 'female' && currentPrefs.style === 'professional';

    if (!isUsingDefaults) {
      if (!canAccessAllLanguages && currentPrefs.language !== 'en') {
        setAlertModalContent({
          title: 'Upgrade Required',
          message: 'Premium languages require a Pro subscription. Please upgrade to access this feature.',
          variant: 'warning'
        })
        setShowAlertModal(true)
        return;
      }
      if (!canAccessAllGenders && currentPrefs.gender !== 'female') {
        setAlertModalContent({
          title: 'Upgrade Required',
          message: 'Premium voice genders require a Pro subscription. Please upgrade to access this feature.',
          variant: 'warning'
        })
        setShowAlertModal(true)
        return;
      }
      if (!canAccessProStyles && currentPrefs.style !== 'professional') {
        setAlertModalContent({
          title: 'Upgrade Required',
          message: 'Premium voice styles require a Pro subscription. Please upgrade to access this feature.',
          variant: 'warning'
        })
        setShowAlertModal(true)
        return;
      }

      const styleObj = styles.find(s => s.id === currentPrefs.style);
      if (!canAccessPremiumStyles && styleObj?.tier === 'premium') {
        setAlertModalContent({
          title: 'Upgrade Required',
          message: 'This voice style requires an Interview Ready subscription. Please upgrade to access this feature.',
          variant: 'warning'
        })
        setShowAlertModal(true)
        return;
      }
    }

    // Save voice preferences
    try {
      const supabase = (await import('@/lib/clients/supabaseBrowserClient')).createClient()
      const user = useAuthStore.getState().user

      // Update preferences (include deepgram for practice sessions and mockInterview for mock interviews)
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: { deepgram, mockInterview }
        })
        .eq('id', user?.id)

      if (error) throw error

      // Call parent onSave for UI updates
      onSave({ deepgram, mockInterview })
    } catch (error) {
      console.error('Error saving integration settings:', error)
      setAlertModalContent({
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
        variant: 'error'
      })
      setShowAlertModal(true)
    }
  }

  const selectedLanguage = languages.find(l => l.code === deepgram.language)
  const selectedGender = genders.find(g => g.id === deepgram.gender)
  const selectedStyle = styles.find(s => s.id === deepgram.style)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Voice Configuration - Practice Sessions */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl border border-purple-700/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30">
                <Mic className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Practice Session Voice</h2>
                <p className="text-xs text-purple-400/70 mt-0.5">Used for rapid Q&A practice sessions (not mock interviews)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-300">English Accents</span>
            </div>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Language Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language
                  {!canAccessAllLanguages && <Lock className="w-3 h-3 text-purple-400 ml-2" />}
                </label>
                <select
                  value={deepgram.language}
                  onChange={(e) => setDeepgram({ ...deepgram, language: e.target.value })}
                  disabled={!canAccessAllLanguages}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code} disabled={!canAccessAllLanguages && l.code !== 'en'}>
                      {l.name} {l.code !== 'en' && !canAccessAllLanguages && '(Pro Feature)'}
                    </option>
                  ))}
                </select>
                {!canAccessAllLanguages && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                    <span className="text-xs text-purple-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Upgrade to Pro
                    </span>
                  </div>
                )}
                {selectedLanguage && (
                  <p className="text-xs text-gray-400 mt-2">Region: {selectedLanguage.region}</p>
                )}
              </div>

              {/* Gender Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Voice Gender
                  {!canAccessAllGenders && <Lock className="w-3 h-3 text-purple-400 ml-2" />}
                </label>
                <select
                  value={deepgram.gender}
                  onChange={(e) => setDeepgram({ ...deepgram, gender: e.target.value })}
                  disabled={!canAccessAllGenders}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {genders.map(g => (
                    <option key={g.id} value={g.id} disabled={!canAccessAllGenders && g.id !== 'female'}>
                      {g.name} {g.id !== 'female' && !canAccessAllGenders && '(Pro Feature)'}
                    </option>
                  ))}
                </select>
                {!canAccessAllGenders && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                    <span className="text-xs text-purple-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Upgrade to Pro
                    </span>
                  </div>
                )}
              </div>

              {/* Style Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Voice Style
                  {!canAccessProStyles && <Lock className="w-3 h-3 text-purple-400 ml-2" />}
                </label>
                <select
                  value={deepgram.style}
                  onChange={(e) => setDeepgram({ ...deepgram, style: e.target.value })}
                  disabled={!canAccessProStyles} // Basic can only use 'professional'
                  className="w-full px-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {styles.map(s => (
                    <option key={s.id} value={s.id} disabled={!canAccessPremiumStyles && s.tier === 'premium'}>
                      {s.name} {s.tier === 'premium' && !canAccessPremiumStyles && '(Premium)'}
                    </option>
                  ))}
                </select>
                {!canAccessProStyles && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
                    <span className="text-xs text-purple-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Upgrade to Pro
                    </span>
                  </div>
                )}
                {selectedStyle && (
                  <p className="text-xs text-gray-400 mt-2">{selectedStyle.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Voice Preview Card */}
          <div className="mt-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Voice Preview</h3>
                <p className="text-sm text-gray-400">
                  {selectedLanguage?.name} • {selectedGender?.name} • {selectedStyle?.name}
                </p>
              </div>
              <button
                onClick={handlePlayPreview}
                disabled={playingPreview || loadingData || (!canAccessProStyles && deepgram.style !== 'professional') || (!canAccessAllGenders && deepgram.gender !== 'female') || (!canAccessAllLanguages && deepgram.language !== 'en')}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-900/30"
              >
                {playingPreview ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Preview Voice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Interview Persona Selection - OpenAI Realtime */}
      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-700/30 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Mock Interview Persona</h2>
                <p className="text-sm text-indigo-300">Powered by OpenAI Realtime Voice</p>
                <p className="text-xs text-indigo-400/70 mt-0.5">Select your AI interviewer for real-time voice interviews</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300">11 Professional Personas</span>
            </div>
          </div>

          <div>
            {/* Gender Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-indigo-200 mb-3">Filter by Gender</label>
              <div className="flex gap-3">
                {[
                  { label: 'All', value: 'all' as const },
                  { label: 'Female', value: 'female' as const },
                  { label: 'Male', value: 'male' as const }
                ].map(({ label, value }) => {
                  const count = value === 'all'
                    ? ALL_PERSONAS.length
                    : ALL_PERSONAS.filter(p => p.gender === value).length

                  return (
                    <button
                      key={value}
                      onClick={() => setGenderFilter(value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        genderFilter === value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Persona Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredPersonas.map(persona => (
                <button
                  key={persona.name}
                  onClick={() => setMockInterview({ persona_name: persona.name })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mockInterview.persona_name === persona.name
                      ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                      : 'border-gray-700 bg-gray-800/50 hover:border-indigo-600/50 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Persona Photo */}
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
                        persona.gender === 'female' ? 'bg-pink-500/20' : 'bg-blue-500/20'
                      }`}>
                        {persona.photoUrl ? (
                          <img
                            src={persona.photoUrl}
                            alt={persona.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to icon if image fails
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <User className={`w-6 h-6 ${persona.gender === 'female' ? 'text-pink-400' : 'text-blue-400'} ${persona.photoUrl ? 'hidden' : ''}`} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{persona.name}</h4>
                        <p className="text-xs text-gray-400">{persona.default_title}</p>
                      </div>
                    </div>
                    {mockInterview.persona_name === persona.name && (
                      <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{persona.personality}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {persona.best_for.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="capitalize">{persona.style}</span>
                    <span>•</span>
                    <span>Warmth: {persona.warmth}/10</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Persona Card */}
            <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-indigo-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center ${
                    selectedPersona.gender === 'female' ? 'bg-pink-500/20' : 'bg-blue-500/20'
                  }`}>
                    {selectedPersona.photoUrl ? (
                      <img
                        src={selectedPersona.photoUrl}
                        alt={selectedPersona.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className={`w-7 h-7 ${selectedPersona.gender === 'female' ? 'text-pink-400' : 'text-blue-400'}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{selectedPersona.name}</h3>
                    <p className="text-sm text-gray-400">
                      {selectedPersona.default_title} • {selectedPersona.voice_characteristics}
                    </p>
                    <p className="text-xs text-indigo-400 mt-1">
                      Voice: {selectedPersona.openai_voice} • {selectedPersona.age_range} years
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <span>Style:</span>
                    <span className="capitalize text-indigo-300">{selectedPersona.style}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Warmth: {selectedPersona.warmth}/10</span>
                    <span>Strictness: {selectedPersona.strictness}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`
            px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg text-lg
            ${success ? 'bg-green-500 text-white shadow-green-900/50' : 'bg-white text-gray-900 hover:bg-gray-100 shadow-gray-900/50'}
            ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          {success ? (
            <>
              <CheckCircle className="w-6 h-6" /> Saved Successfully!
            </>
          ) : (
            <>
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Save Configuration
            </>
          )}
        </button>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertModalContent.title}
        message={alertModalContent.message}
        variant={alertModalContent.variant}
        okText="OK"
      />
    </div>
  )
}