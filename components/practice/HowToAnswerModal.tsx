// components/practice/HowToAnswerModal.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, X, Target, Zap, CheckCircle, TrendingUp, FileText } from 'lucide-react'
import { getStarGuidance, DEFAULT_TIPS } from '@/lib/constants/starGuidance'

interface HowToAnswerModalProps {
  isOpen: boolean
  onClose: () => void
  questionCategory: string
  tips?: string[]
  questionText: string
}

export function HowToAnswerModal({
  isOpen,
  onClose,
  questionCategory,
  tips,
  questionText
}: HowToAnswerModalProps) {
  const guidance = getStarGuidance(questionCategory)
  const displayTips = tips && tips.length > 0 ? tips : DEFAULT_TIPS

  // STAR letter styling
  const starLetters = [
    { letter: 'S', label: 'Situation', content: guidance.situation, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
    { letter: 'T', label: 'Task', content: guidance.task, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    { letter: 'A', label: 'Action', content: guidance.action, color: 'from-orange-500 to-amber-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    { letter: 'R', label: 'Result', content: guidance.result, color: 'from-emerald-500 to-green-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 p-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">How to Answer This Question</h2>
                  <p className="text-xs text-white/50">{guidance.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

              {/* Category Description */}
              <p className="text-white/70 text-sm leading-relaxed">
                {guidance.description}
              </p>

              {/* STAR Method Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">STAR Method</h3>
                </div>

                <div className="space-y-2">
                  {starLetters.map((item) => (
                    <div
                      key={item.letter}
                      className={`flex gap-3 p-3 rounded-xl ${item.bgColor} border ${item.borderColor}`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                        <span className="text-white font-bold text-sm">{item.letter}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm mb-0.5">{item.label}</p>
                        <p className="text-white/60 text-xs leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question-Specific Tips */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tips for This Question</h3>
                </div>

                <div className="space-y-2">
                  {displayTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                    >
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Answer Structure */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Example Answer</h3>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                    {guidance.exampleAnswer}
                  </p>
                </div>

                <p className="text-white/40 text-xs text-center italic">
                  This is a sample structure. Tailor your answer to your own experiences.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Got It - I'm Ready
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
