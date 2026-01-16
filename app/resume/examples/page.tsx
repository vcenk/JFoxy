'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  Loader2,
  Search,
  Filter,
  Star,
  TrendingUp,
  Eye,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllIndustries, type Industry, type ExperienceLevel } from '@/lib/data/jobTitleTaxonomy'
import type { ParsedResume } from '@/lib/types/resume'
import { Navbar, Footer } from '@/components/landing'

interface ResumeExample {
  id: string
  slug: string
  job_title: string
  industry: Industry
  experience_level: ExperienceLevel
  content: ParsedResume
  ats_score: number
  quality_score: number
  meta_title: string
  meta_description: string
  view_count: number
}

export default function ResumeExamplesLibraryPage() {
  const router = useRouter()
  const [examples, setExamples] = useState<ResumeExample[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterIndustry, setFilterIndustry] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')

  useEffect(() => {
    fetchExamples()
  }, [filterIndustry, filterLevel, searchQuery])

  const fetchExamples = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        ...(filterIndustry !== 'all' && { industry: filterIndustry }),
        ...(filterLevel !== 'all' && { experienceLevel: filterLevel }),
        ...(searchQuery && { search: searchQuery }),
        limit: '50',
      })

      const response = await fetch(`/api/resume/examples?${params}`)
      const data = await response.json()

      if (data.success && data.examples) {
        setExamples(data.examples)
      } else {
        setError('Failed to load resume examples')
      }
    } catch (err) {
      console.error('Failed to fetch examples:', err)
      setError('Failed to load resume examples')
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = (exampleId: string) => {
    // Redirect to resume builder with this example as template
    router.push(`/dashboard/resume/new?template=${exampleId}`)
  }

  const industries = getAllIndustries()
  const experienceLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive']

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Navbar />

      {/* Header Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 pt-24 sm:pt-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 mb-6">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold text-[#1a1615] mb-4">
              Professional Resume Examples
            </h1>
            <p className="text-xl text-[#6b6b6b] max-w-3xl mx-auto">
              Browse our collection of high-quality, ATS-optimized resume templates.
              Find the perfect example for your industry and experience level.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-bold text-[#1a1615]">
              Filter Examples
              <span className="text-sm font-normal text-[#6b6b6b] ml-2">
                ({examples.length} results)
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
              />
            </div>

            {/* Industry Filter */}
            <div className="relative">
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 appearance-none cursor-pointer"
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
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 appearance-none cursor-pointer"
              >
                <option value="all">All Experience Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-[#6b6b6b]">Loading resume examples...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Examples Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <motion.div
                key={example.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group shadow-sm"
                onClick={() => handleUseTemplate(example.id)}
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <FileText className="w-8 h-8 text-purple-600" />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50">
                        <Star className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-600">
                          {example.quality_score}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1615] mb-1 group-hover:text-purple-600 transition-colors">
                    {example.job_title}
                  </h3>
                  <p className="text-sm text-[#6b6b6b] line-clamp-2">
                    {example.meta_description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 capitalize">
                    {example.industry.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 capitalize">
                    {example.experience_level}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                    ATS: {example.ats_score}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-[#6b6b6b] mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{example.view_count || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleUseTemplate(example.id)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1615] hover:bg-black rounded-lg transition-all text-white font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Use This Template
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}

            {examples.length === 0 && !loading && (
              <div className="col-span-full text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1a1615] mb-2">No examples found</h3>
                <p className="text-[#6b6b6b]">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-[#1a1615] mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-[#6b6b6b] text-lg mb-8 max-w-2xl mx-auto">
            Create a custom resume from scratch or upload your existing one to get started.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-[#1a1615] hover:bg-black rounded-lg transition-all text-white font-medium shadow-lg"
            >
              Create New Resume
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-[#1a1615] font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
