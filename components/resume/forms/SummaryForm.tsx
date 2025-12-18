// components/resume/forms/SummaryForm.tsx
'use client'

import { useState } from 'react'
import { useResume } from '@/contexts/ResumeContext'
import { GlassCard, GlassCardSection } from '@/components/ui/glass-card'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { Loader2, Sparkles } from 'lucide-react'
import { jsonToPlainText, plainTextToJSON, ensureJSONContent } from '@/lib/utils/richTextHelpers'
import { JSONContent } from '@tiptap/core'

export const SummaryForm = ({ triggerSave }: { triggerSave: (dataOverride?: any) => void }) => {
  const { resumeData, setResumeData } = useResume()
  const [generating, setGenerating] = useState(false)

  const updateSummary = (value: JSONContent) => {
    setResumeData({ ...resumeData, summary: value })
  }

  const handleGenerate = async () => {
    if (generating) return // Prevent double clicks
    setGenerating(true)

    try {
      // Extract plain text from JSON for AI
      const plainText = resumeData.summary
        ? jsonToPlainText(resumeData.summary)
        : ''

      const response = await fetch('/api/resume/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'summary',
          content: plainText,
          resumeContext: resumeData,
        }),
      })

      const data = await response.json()
      if (data.success && data.rewritten) {
        // Convert AI response back to JSON
        const newSummary = plainTextToJSON(data.rewritten)
        const newContent = { ...resumeData, summary: newSummary }
        setResumeData(newContent) // Update local state for UI
        triggerSave(newContent)   // Save the new state directly
      }
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <GlassCard title="Professional Summary">
      <GlassCardSection>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white/80">Summary</label>
              
              {/* UPDATED BUTTON WITH ANIMATION */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${generating 
                    ? 'bg-purple-500/20 text-purple-200 cursor-not-allowed border border-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/20'}
                `}
              >
                {generating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            <RichTextEditor
              content={ensureJSONContent(resumeData.summary)}
              onChange={updateSummary}
              placeholder="Experienced software engineer with 5+ years..."
              disabled={generating}
              minHeight="120px"
            />

            {generating && (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center space-y-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin mr-2" />
                  <span className="text-xs text-purple-200 font-medium">Refining your summary...</span>
                </div>
              </div>
            )}

            <p className="text-xs text-white/50 mt-2">
              Use the toolbar to format text. {generating && 'AI generation will replace current content.'}
            </p>
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <p className="text-sm text-purple-200">
              💡 <strong>Tip:</strong> A strong summary highlights your key achievements and value
              proposition in 3-4 sentences.
            </p>
          </div>
        </div>
      </GlassCardSection>
    </GlassCard>
  )
}