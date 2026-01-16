// app/dashboard/resume/page.tsx
// Resume Library - Dashboard of all user resumes

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ResumeUploadModal } from '@/components/resume/ResumeUploadModal'
import { LinkedInImportModal } from '@/components/resume/LinkedInImportModal'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { UpgradeModal } from '@/components/ui/UpgradeModal'
import { AlertModal } from '@/components/ui/AlertModal'
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

type ViewMode = 'grid' | 'list'

export default function ResumeLibraryPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [renamingResume, setRenamingResume] = useState<Resume | null>(null)
  const [newResumeTitle, setNewResumeTitle] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

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

      // Check for usage limit
      if (response.status === 403) {
        const data = await response.json()
        if (data.code === 'LIMIT_REACHED') {
          setShowUpgradeModal(true)
          return
        }
      }

      const data = await response.json()
      if (data.success && data.resume?.id) {
        router.push(`/dashboard/resume/${data.resume.id}`)
      }
    } catch (error) {
      console.error('Failed to create resume:', error)
    }
  }

  const handleDeleteResume = (id: string) => {
    setResumeToDelete(id)
    setShowDeleteModal(true)
  }

  const confirmDeleteResume = async () => {
    if (!resumeToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/resume/${resumeToDelete}`, { method: 'DELETE' })
      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== resumeToDelete))
      }
    } catch (error) {
      console.error('Failed to delete resume:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setResumeToDelete(null)
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

  const handleRenameResume = async () => {
    if (!renamingResume || !newResumeTitle.trim()) return

    try {
      const response = await fetch(`/api/resume/${renamingResume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newResumeTitle.trim() }),
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setResumes(resumes.map(r =>
          r.id === renamingResume.id ? { ...r, title: newResumeTitle.trim() } : r
        ))
        setRenamingResume(null)
        setNewResumeTitle('')
      }
    } catch (error) {
      console.error('Failed to rename resume:', error)
    }
  }

  const openRenameModal = (resume: Resume) => {
    setRenamingResume(resume)
    setNewResumeTitle(resume.title)
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
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-white/10 hover:bg-white/5 text-white/70'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-white/10 hover:bg-white/5 text-white/70'
                }`}
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Resumes Display */}
        {filteredResumes.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-xl border border-white/10">
            <p className="text-white/40">No resumes found matching your search.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="glass-panel p-6 rounded-xl border border-white/10 hover:scale-[1.02] transition-all group cursor-pointer"
                onClick={() => router.push(`/dashboard/resume/${resume.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    {resume.is_base_version && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/20" />
                    )}
                  </div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors outline-none"
                      >
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
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/resume/${resume.id}`)
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                          Edit
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="group flex items-center px-2 py-2 text-sm text-white/80 outline-none cursor-pointer hover:bg-white/10 hover:text-white rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            openRenameModal(resume)
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                          Rename
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="group flex items-center px-2 py-2 text-sm text-white/80 outline-none cursor-pointer hover:bg-white/10 hover:text-white rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicateResume(resume.id)
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                          Duplicate
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                        <DropdownMenu.Item
                          className="group flex items-center px-2 py-2 text-sm text-red-400 outline-none cursor-pointer hover:bg-red-500/10 hover:text-red-300 rounded-md transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteResume(resume.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {resume.title}
                </h3>

                {/* Scores */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">ATS Score</span>
                    <ScoreBadge score={resume.ats_score} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Match Score</span>
                    <ScoreBadge score={resume.jd_match_score} size="sm" />
                  </div>
                </div>

                {/* Job Info */}
                {resume.job_description && (
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-xs text-white/50 mb-1">Matched Job</div>
                    <div className="text-sm text-white font-medium">{resume.job_description.title}</div>
                    {resume.job_description.company && (
                      <div className="text-xs text-white/60">{resume.job_description.company}</div>
                    )}
                  </div>
                )}

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-white/50 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View (Table) */
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
                  {filteredResumes.map((resume) => (
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
                                onClick={() => openRenameModal(resume)}
                              >
                                <FileText className="w-4 h-4 mr-2 text-white/50 group-hover:text-white" />
                                Rename
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {renamingResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Rename Resume</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Resume Title</label>
                <input
                  type="text"
                  value={newResumeTitle}
                  onChange={(e) => setNewResumeTitle(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter new title..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameResume()
                    } else if (e.key === 'Escape') {
                      setRenamingResume(null)
                      setNewResumeTitle('')
                    }
                  }}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    setRenamingResume(null)
                    setNewResumeTitle('')
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameResume}
                  disabled={!newResumeTitle.trim()}
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Resume Builds"
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setResumeToDelete(null)
        }}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        variant="error"
        confirmText="Delete"
        onConfirm={confirmDeleteResume}
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  )
}

