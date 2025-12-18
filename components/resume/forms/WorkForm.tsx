// components/resume/forms/WorkForm.tsx
'use client'

import { useState } from 'react'
import { useResume } from '@/contexts/ResumeContext'
import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react'
import { jsonToPlainText, plainTextToJSON, ensureJSONContent } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'

export const WorkForm = ({ triggerSave }: { triggerSave: (dataOverride?: any) => void }) => {
  const { resumeData, setResumeData } = useResume()
  const [improvingBullet, setImprovingBullet] = useState<string | null>(null)

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          bullets: [plainTextToJSON('')],
        },
      ],
    })
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...resumeData.experience]
    updated[index] = { ...updated[index], [field]: value }
    setResumeData({ ...resumeData, experience: updated })
  }

  const removeExperience = (index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((_, i) => i !== index),
    })
  }

  const addBullet = (expIndex: number) => {
    const updated = [...resumeData.experience]
    updated[expIndex].bullets.push(plainTextToJSON(''))
    setResumeData({ ...resumeData, experience: updated })
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: JSONContent) => {
    const updated = [...resumeData.experience]
    updated[expIndex].bullets[bulletIndex] = value
    setResumeData({ ...resumeData, experience: updated })
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...resumeData.experience]
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    setResumeData({ ...resumeData, experience: updated })
  }

  const handleImproveBullet = async (expIndex: number, bulletIndex: number) => {
    const bulletId = `${expIndex}-${bulletIndex}`
    setImprovingBullet(bulletId)

    try {
      // Extract plain text from JSON bullet
      const bulletJSON = resumeData.experience[expIndex].bullets[bulletIndex]
      const plainText = jsonToPlainText(bulletJSON)

      const response = await fetch('/api/resume/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'bullet',
          content: plainText,
          context: {
            position: resumeData.experience[expIndex].position,
            company: resumeData.experience[expIndex].company,
          },
        }),
      })

      const data = await response.json()
      if (data.success && data.rewritten) {
        // Convert AI response back to JSON
        const newBulletJSON = plainTextToJSON(data.rewritten)

        const updatedExperience = [...resumeData.experience]
        updatedExperience[expIndex].bullets[bulletIndex] = newBulletJSON
        const newContent = { ...resumeData, experience: updatedExperience }
        setResumeData(newContent) // Update local state for UI
        triggerSave(newContent)   // Save the new state directly
      }
    } catch (error) {
      console.error('Failed to improve bullet:', error)
    } finally {
      setImprovingBullet(null)
    }
  }

  return (
    <GlassCard title="Work Experience">
      <div className="space-y-6">
        {resumeData.experience.map((exp, expIndex) => (
          <div key={expIndex} className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Position {expIndex + 1}</h4>
              <button
                onClick={() => removeExperience(expIndex)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => updateExperience(expIndex, 'company', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={e => updateExperience(expIndex, 'position', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Job Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate || ''}
                    onChange={e => updateExperience(expIndex, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Jan 2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate || ''}
                    onChange={e => updateExperience(expIndex, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    placeholder="Dec 2023"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-white/10 rounded-xl hover:bg-white/15 transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={e => updateExperience(expIndex, 'current', e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-sm text-white">Current</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Key Achievements
                </label>
                <div className="space-y-3">
                  {exp.bullets.map((bullet, bulletIndex) => {
                    const isImproving = improvingBullet === `${expIndex}-${bulletIndex}`

                    return (
                      <div key={bulletIndex} className="flex items-start space-x-2">
                        <div className="flex-1">
                          <RichTextEditor
                            content={ensureJSONContent(bullet)}
                            onChange={(json) => updateBullet(expIndex, bulletIndex, json)}
                            disabled={isImproving}
                            placeholder="Led a team of 5 engineers to deliver..."
                            minHeight="60px"
                          />
                          {isImproving && (
                            <div className="flex items-center justify-center py-1">
                              <Loader2 className="w-4 h-4 text-purple-400 animate-spin mr-2" />
                              <span className="text-xs text-purple-200">Improving...</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          {/* UPDATED BULLET BUTTON */}
                          <button
                            onClick={() => handleImproveBullet(expIndex, bulletIndex)}
                            disabled={isImproving}
                            title="Improve with AI"
                            className={`
                              p-2 rounded-lg transition-all
                              ${isImproving 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-white/10 text-white hover:bg-purple-500 hover:text-white'}
                            `}
                          >
                             {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          </button>

                          {exp.bullets.length > 1 && (
                            <button
                              onClick={() => removeBullet(expIndex, bulletIndex)}
                              disabled={isImproving}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button
                  onClick={() => addBullet(expIndex)}
                  className="mt-3 w-full py-2 bg-white/10 hover:bg-white/15 rounded-xl text-white text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bullet Point</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl text-purple-200 font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
      </div>
    </GlassCard>
  )
}