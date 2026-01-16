'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Play,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Sparkles,
  ListFilter,
  Grid3x3,
  List,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllIndustries, type Industry, type ExperienceLevel } from '@/lib/data/jobTitleTaxonomy'
import ResumePreviewModal from '@/components/admin/ResumePreviewModal'
import { AlertModal } from '@/components/ui/AlertModal'
import type { ParsedResume } from '@/lib/types/resume'

interface ResumeExample {
  id: string
  slug: string
  job_title: string
  industry: Industry
  experience_level: ExperienceLevel
  content: ParsedResume
  ats_score: number
  quality_score: number
  is_published: boolean
  generation_cost: number
  generation_time_ms: number
  created_at: string
  created_by: string
  meta_title: string
  meta_description: string
}

interface GenerationStats {
  totalExamples: number
  publishedCount: number
  pendingReview: number
  avgQualityScore: number
  avgATSScore: number
  totalCost: string
  costPerExample: string
}

export default function AdminExamplesPage() {
  const { user, profile } = useAuthStore()
  const router = useRouter()

  const [examples, setExamples] = useState<ResumeExample[]>([])
  const [stats, setStats] = useState<GenerationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIndustry, setFilterIndustry] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')

  // Preview modal
  const [previewExample, setPreviewExample] = useState<ResumeExample | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [exampleToDelete, setExampleToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Info modal for placeholders
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalContent, setInfoModalContent] = useState({ title: '', message: '' })

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    const supabase = (await import('@/lib/clients/supabaseBrowserClient')).createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No session token available')
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    }
  }

  useEffect(() => {
    if (profile && !profile.is_admin) {
      router.push('/dashboard')
      return
    }

    if (user && profile?.is_admin) {
      fetchData()
    }
  }, [user, profile, router])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const headers = await getAuthHeaders()

      // Fetch statistics
      const statsResponse = await fetch('/api/admin/generate-examples', { headers })
      const statsData = await statsResponse.json()

      if (statsResponse.status === 403) {
        setError('Access denied. Admin only.')
        setTimeout(() => router.push('/dashboard'), 2000)
        return
      }

      if (statsData.statistics) {
        setStats(statsData.statistics)
      }

      // Fetch all examples from database
      const examplesResponse = await fetch('/api/admin/examples', { headers })
      const examplesData = await examplesResponse.json()

      if (examplesData.success && examplesData.examples) {
        setExamples(examplesData.examples)
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError('Failed to load resume examples')
    } finally {
      setLoading(false)
    }
  }

  const generateSingleExample = async () => {
    // This would open a modal or form to select job title and level
    setInfoModalContent({
      title: 'Coming Soon',
      message: 'Single example generation form will be available in a future update.'
    })
    setShowInfoModal(true)
  }

  const generateBatch = async () => {
    // This would open a batch generation interface
    setInfoModalContent({
      title: 'Coming Soon',
      message: 'Batch generation interface will be available in a future update.'
    })
    setShowInfoModal(true)
  }

  const togglePublish = async (exampleId: string, currentStatus: boolean) => {
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/examples/${exampleId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ is_published: !currentStatus }),
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err)
    }
  }

  const deleteExample = (exampleId: string) => {
    setExampleToDelete(exampleId)
    setShowDeleteModal(true)
  }

  const confirmDeleteExample = async () => {
    if (!exampleToDelete) return

    setIsDeleting(true)
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/admin/examples/${exampleToDelete}`, {
        method: 'DELETE',
        headers,
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (err) {
      console.error('Failed to delete example:', err)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setExampleToDelete(null)
    }
  }

  const openPreview = (example: ResumeExample) => {
    setPreviewExample(example)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setPreviewExample(null)
  }

  // Filter examples
  const filteredExamples = examples.filter((example) => {
    const matchesSearch =
      searchQuery === '' ||
      example.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.slug.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesIndustry = filterIndustry === 'all' || example.industry === filterIndustry
    const matchesLevel = filterLevel === 'all' || example.experience_level === filterLevel
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && example.is_published) ||
      (filterStatus === 'draft' && !example.is_published)

    return matchesSearch && matchesIndustry && matchesLevel && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading resume examples...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-panel p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    )
  }

  const industries = getAllIndustries()
  const experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive']

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-10 h-10 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Resume Examples Library
              </span>
            </h1>
            <p className="text-white/60 text-lg">
              Manage AI-generated resume examples for SEO
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={generateSingleExample}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all text-white font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Generate Example
            </button>
            <button
              onClick={generateBatch}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-white font-medium"
            >
              <Play className="w-4 h-4" />
              Batch Generate
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Total Examples</h3>
            <p className="text-4xl font-bold text-white">{stats.totalExamples}</p>
          </motion.div>

          {/* Published */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Published</h3>
            <p className="text-4xl font-bold text-white">{stats.publishedCount}</p>
            <p className="text-xs text-white/40 mt-1">
              {stats.pendingReview} pending review
            </p>
          </motion.div>

          {/* Quality Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Avg Quality</h3>
            <p className="text-4xl font-bold text-white">{stats.avgQualityScore}</p>
            <p className="text-xs text-white/40 mt-1">
              ATS: {stats.avgATSScore}
            </p>
          </motion.div>

          {/* Total Cost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-white/60 text-sm font-medium mb-1">Total Cost</h3>
            <p className="text-4xl font-bold text-white">${stats.totalCost}</p>
            <p className="text-xs text-white/40 mt-1">
              ${stats.costPerExample} avg per example
            </p>
          </motion.div>
        </div>
      )}

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-purple-400" />
            Filters
            <span className="text-sm font-normal text-white/60 ml-2">
              ({filteredExamples.length} results)
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Industry Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Examples Table/Grid */}
      {viewMode === 'table' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">Industry</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/60">Level</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">Quality</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">ATS</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">Cost</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExamples.map((example) => (
                  <tr
                    key={example.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{example.job_title}</p>
                        <p className="text-xs text-white/40">{example.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white/80 text-sm capitalize">
                        {example.industry.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 capitalize">
                        {example.experience_level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${
                        example.quality_score >= 85 ? 'text-green-400' :
                        example.quality_score >= 70 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {example.quality_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-white/80">{example.ats_score}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-white/60 text-sm">${example.generation_cost.toFixed(3)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => togglePublish(example.id, example.is_published)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 mx-auto ${
                          example.is_published
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {example.is_published ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openPreview(example)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/resume/${example.id}`)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-white/60" />
                        </button>
                        <button
                          onClick={() => deleteExample(example.id)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredExamples.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No examples found matching your filters</p>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExamples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1">{example.job_title}</h3>
                  <p className="text-xs text-white/40">{example.slug}</p>
                </div>
                <button
                  onClick={() => togglePublish(example.id, example.is_published)}
                  className={`p-2 rounded-lg ${
                    example.is_published ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}
                >
                  {example.is_published ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Industry</span>
                  <span className="text-white text-sm capitalize">{example.industry.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Level</span>
                  <span className="text-white text-sm capitalize">{example.experience_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Quality</span>
                  <span className={`font-bold ${
                    example.quality_score >= 85 ? 'text-green-400' :
                    example.quality_score >= 70 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {example.quality_score}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">ATS Score</span>
                  <span className="text-white">{example.ats_score}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => openPreview(example)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => router.push(`/dashboard/resume/${example.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors text-purple-300 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </motion.div>
          ))}

          {filteredExamples.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No examples found matching your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <ResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        example={previewExample}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setExampleToDelete(null)
        }}
        title="Delete Example"
        message="Are you sure you want to delete this example? This action cannot be undone."
        variant="error"
        confirmText="Delete"
        onConfirm={confirmDeleteExample}
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Info Modal for Placeholders */}
      <AlertModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalContent.title}
        message={infoModalContent.message}
        variant="info"
        okText="Got it"
      />
    </div>
  )
}
