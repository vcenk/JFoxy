// app/dashboard/resume/page.tsx
// Resume Library - Dashboard of all user resumes

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ResumeUploadModal } from '@/components/resume/ResumeUploadModal'
import { LinkedInImportModal } from '@/components/resume/LinkedInImportModal'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  Plus,
  Upload,
  FileText,
  Clock,
  Trash2,
  Copy,
  Loader2,
  Star,
  Linkedin,
  Search,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  Pencil,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface Resume {
  id: string
  title: string
  content: any
  is_base_version: boolean
  source_resume_id: string | null
  job_description_id: string | null
  job_description?: {
    id: string
    title: string
    company: string | null
  } | null
  ats_score: number | null
  jd_match_score: number | null
  updated_at: string
  created_at: string
}

export default function ResumeLibraryPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resume/list')
      const data = await response.json()
      if (data.success) {
        setResumes(data.resumes)
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = async () => {
    try {
      const response = await fetch('/api/resume/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Resume ${new Date().toLocaleDateString()}`,
          is_base_version: true,
        }),
      })

      const data = await response.json()
      if (data.success && data.resume?.id) {
        router.push(`/dashboard/resume/${data.resume.id}`)
      }
    } catch (error) {
      console.error('Failed to create resume:', error)
    }
  }

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resume/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete resume:', error)
    }
  }

  const handleDuplicateResume = async (id: string) => {
    try {
      const response = await fetch('/api/resume/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: id }),
      })

      const data = await response.json()
      if (data.success) {
        fetchResumes()
      }
    } catch (error) {
      console.error('Failed to duplicate resume:', error)
    }
  }

  const filteredResumes = resumes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Resume Library</h1>
        <p className="text-white/60 text-lg">Manage and optimize your resumes</p>
      </div>

      {/* Hero Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create New Resume */}
        <button
          onClick={handleCreateNew}
          className="glass-panel p-8 hover:scale-[1.02] transition-all text-left group"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">New Resume</h3>
          <p className="text-white/60 text-sm">Start from scratch with a blank template</p>
        </button>

        {/* Import Resume */}
        <button
          onClick={() => setShowImportModal(true)}
          className="glass-panel p-8 hover:scale-[1.02] transition-all text-left group"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Import Resume</h3>
          <p className="text-white/60 text-sm">Upload and parse an existing resume</p>
        </button>

        {/* LinkedIn Import */}
        <button
          onClick={() => setShowLinkedInModal(true)}
          className="glass-panel p-8 hover:scale-[1.02] transition-all text-left group"
        >
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Linkedin className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Import from LinkedIn</h3>
          <p className="text-white/60 text-sm">Auto-fill from your LinkedIn profile data</p>
        </button>
      </div>

      {/* Resumes Section */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Your Resumes</h2>
          
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Resumes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500 w-64 transition-all"
              />
              <Search className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Toggles */}
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/70 transition-colors">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/70 transition-colors">
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Resumes Table */}
        <div className="glass-panel overflow-hidden rounded-xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider border-b border-white/10">
                  <th className="px-6 py-4 font-semibold">Resume</th>
                  <th className="px-6 py-4 font-semibold w-32">ATS Score</th>
                  <th className="px-6 py-4 font-semibold">Matched Job</th>
                  <th className="px-6 py-4 font-semibold w-32">Match Score</th>
                  <th className="px-6 py-4 font-semibold w-40">Created</th>
                  <th className="px-6 py-4 font-semibold w-40">Last Edited</th>
                  <th className="px-4 py-4 font-semibold w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredResumes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/40">
                      No resumes found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredResumes.map((resume) => (
                    <tr 
                      key={resume.id} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Resume Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {resume.is_base_version && (
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                          )}
                          <button 
                            onClick={() => router.push(`/dashboard/resume/${resume.id}`)}
                            className="text-white font-medium hover:text-purple-400 transition-colors flex items-center gap-1 group/link"
                          >
                            {resume.title}
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </td>

                      {/* ATS Score */}
                      <td className="px-6 py-4">
                        <ScoreBadge score={resume.ats_score} size="md" />
                      </td>

                      {/* Matched Job */}
                      <td className="px-6 py-4">
                        {resume.job_description ? (
                          <div className="text-sm">
                            <div className="text-white font-medium">{resume.job_description.title}</div>
                            {resume.job_description.company && (
                              <div className="text-white/60 text-xs">{resume.job_description.company}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/40 text-sm italic">—</span>
                        )}
                      </td>

                      {/* Match Score */}
                      <td className="px-6 py-4">
                        <ScoreBadge score={resume.jd_match_score} size="md" />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(resume.created_at).toLocaleDateString()}
                      </td>

                      {/* Last Edited */}
                      <td className="px-6 py-4 text-white/60 text-sm">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-center relative">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors outline-none">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              className="min-w-[160px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-200"
                              sideOffset={5}
                              align="end"
                            >
                              <DropdownMenu.Item
                                className="group flex items-center px-2 py-2 text-sm text-white/80 outline-none cursor-pointer hover:bg-white/10 hover:text-white rounded-md transition-colors"
                                onClick={() => router.push(`/dashboard/resume/${resume.id}`)}
                              >
                                <Pencil className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                                Edit
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                className="group flex items-center px-2 py-2 text-sm text-white/80 outline-none cursor-pointer hover:bg-white/10 hover:text-white rounded-md transition-colors"
                                onClick={() => handleDuplicateResume(resume.id)}
                              >
                                <Copy className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                                Duplicate
                              </DropdownMenu.Item>
                              
                              <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                              
                              <DropdownMenu.Item
                                className="group flex items-center px-2 py-2 text-sm text-red-400 outline-none cursor-pointer hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
                                onClick={() => handleDeleteResume(resume.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <ResumeUploadModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUploadSuccess={(resumeId) => router.push(`/dashboard/resume/${resumeId}`)}
      />

      {/* LinkedIn Import Modal */}
      <LinkedInImportModal
        isOpen={showLinkedInModal}
        onClose={() => setShowLinkedInModal(false)}
        onImportSuccess={(resumeId) => router.push(`/dashboard/resume/${resumeId}`)}
      />
    </div>
  )
}

