// app/dashboard/cover-letter/page.tsx
// Cover letter generation page

'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'  // store/authStore.ts
import { Mail, FileText, Download, Plus, Loader2, Eye } from 'lucide-react'

interface CoverLetter {
  id: string
  company_name: string
  job_title: string
  opening_paragraph: string
  body_paragraphs: string[]
  closing_paragraph: string
  tone: string
  created_at: string
}

export default function CoverLetterPage() {
  const { user } = useAuthStore()
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCoverLetter, setShowNewCoverLetter] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null)

  useEffect(() => {
    if (user) {
      fetchCoverLetters()
    }
  }, [user])

  const fetchCoverLetters = async () => {
    try {
      // TODO: Implement fetch from Supabase
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cover letters:', error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letters</h1>
        <p className="text-gray-600">
          Generate tailored cover letters for your job applications
        </p>
      </div>

      {/* New cover letter button */}
      <div className="mb-8">
        <button
          onClick={() => setShowNewCoverLetter(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Generate New Cover Letter</span>
        </button>
      </div>

      {/* Cover letters list */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cover letters...</p>
        </div>
      ) : coverLetters.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No cover letters yet
          </h3>
          <p className="text-gray-600">Generate your first cover letter to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{letter.company_name}</h3>
                    <p className="text-xs text-gray-500">{letter.job_title}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {letter.opening_paragraph}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Tone: {letter.tone}</span>
                <span>{new Date(letter.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedLetter(letter)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  View
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Export
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New cover letter modal */}
      {showNewCoverLetter && (
        <NewCoverLetterModal onClose={() => setShowNewCoverLetter(false)} />
      )}

      {/* View letter modal */}
      {selectedLetter && (
        <ViewLetterModal
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
        />
      )}
    </div>
  )
}

function NewCoverLetterModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [tone, setTone] = useState('professional')

  const handleGenerate = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call
      alert('Cover letter generation will be implemented')
      onClose()
    } catch (error) {
      console.error('Error generating cover letter:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Generate Cover Letter
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="confident">Confident</option>
              <option value="humble">Humble</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Generate'
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function ViewLetterModal({ letter, onClose }: { letter: CoverLetter; onClose: () => void }) {
  const fullText = `${letter.opening_paragraph}\n\n${letter.body_paragraphs.join('\n\n')}\n\n${letter.closing_paragraph}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{letter.company_name}</h2>
            <p className="text-sm text-gray-500">{letter.job_title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
            {fullText}
          </pre>
        </div>
      </div>
    </div>
  )
}
