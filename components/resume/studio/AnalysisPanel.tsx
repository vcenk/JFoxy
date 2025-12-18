'use client'

import { X, CheckCircle, AlertCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react'

interface ResumeAnalysisResult {
  ats_score: number
  jd_match_score: number | null
  skill_matches: string[]
  missing_skills: string[]
  section_feedback: Array<{
    section: string
    feedback: string
    score: number
  }>
  bullet_suggestions: string[]
  overall_summary: string
  strengths: string[]
  weaknesses: string[]
}

interface AnalysisPanelProps {
  results: ResumeAnalysisResult
  onClose: () => void
}

export function AnalysisPanel({ results, onClose }: AnalysisPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-black/90 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">AI Analysis</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-sm text-white/60 mb-1">ATS Score</div>
            <div className={`text-3xl font-bold ${getScoreColor(results.ats_score)}`}>
              {results.ats_score}%
            </div>
          </div>
          {results.jd_match_score !== null && (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-1">Job Match</div>
              <div className={`text-3xl font-bold ${getScoreColor(results.jd_match_score)}`}>
                {results.jd_match_score}%
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Executive Summary</h3>
          <p className="text-white/80 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/10">
            {results.overall_summary}
          </p>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> Strengths
            </h4>
            <ul className="space-y-2">
              {results.strengths.map((item, i) => (
                <li key={i} className="text-sm text-white/70 flex items-start">
                  <span className="mr-2">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" /> Improvements
            </h4>
            <ul className="space-y-2">
              {results.weaknesses.map((item, i) => (
                <li key={i} className="text-sm text-white/70 flex items-start">
                  <span className="mr-2">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
             <Target className="w-4 h-4 mr-2 text-blue-400" /> Skills Gap
          </h3>
          <div className="space-y-4">
            {results.missing_skills.length > 0 && (
              <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <div className="text-sm text-red-300 font-medium mb-2">Missing Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {results.missing_skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-red-500/20 rounded text-xs text-red-200 border border-red-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
              <div className="text-sm text-green-300 font-medium mb-2">Matched Skills</div>
              <div className="flex flex-wrap gap-2">
                {results.skill_matches.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-200 border border-green-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div>
           <h3 className="text-lg font-semibold text-white mb-4">Detailed Feedback</h3>
           <div className="space-y-3">
             {results.section_feedback.map((item, i) => (
               <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                 <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                   <span className="font-medium text-white">{item.section}</span>
                   <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}/100</span>
                 </div>
                 <div className="p-4 text-sm text-white/70">
                   {item.feedback}
                 </div>
               </div>
             ))}
           </div>
        </div>

         {/* Suggestions */}
         {results.bullet_suggestions.length > 0 && (
           <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" /> Suggested Edits
              </h3>
              <ul className="space-y-3">
                {results.bullet_suggestions.map((suggestion, i) => (
                  <li key={i} className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-sm text-yellow-200/80">
                    {suggestion}
                  </li>
                ))}
              </ul>
           </div>
         )}
      </div>
    </div>
  )
}
