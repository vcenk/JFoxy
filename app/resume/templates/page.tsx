'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Star,
  Sparkles,
  ChevronRight,
  Zap,
  Eye,
  Download,
  TrendingUp,
  CheckCircle,
  Grid3x3,
  List,
  SlidersHorizontal,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar, Footer } from '@/components/landing'
import {
  ALL_TEMPLATES,
  CATEGORY_INFO,
  type TemplateCategory,
  type TemplateMetadata,
  type IndustryFocus,
} from '@/lib/templates/templateLibrary'

export default function ResumeTemplatesPage() {
  const router = useRouter()

  // State
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [showFreeOnly, setShowFreeOnly] = useState(false)
  const [minATSScore, setMinATSScore] = useState(0)
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryFocus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popularity' | 'ats-score' | 'name'>('popularity')

  const IMPLEMENTED_TEMPLATES = useMemo(() => {
    return ALL_TEMPLATES.filter(t => t.id === 'modern-1')
  }, [])

  const categories: Array<{ id: TemplateCategory | 'all'; name: string; count: number; description: string }> = useMemo(() => {
    const categoryCounts: Record<string, number> = {}
    IMPLEMENTED_TEMPLATES.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1
    })

    return [
      { id: 'all', name: 'All Templates', count: IMPLEMENTED_TEMPLATES.length, description: 'Browse all available templates' },
      ...Object.entries(CATEGORY_INFO).map(([id, info]) => ({
        id: id as TemplateCategory,
        name: info.name,
        count: categoryCounts[id] || 0,
        description: info.description,
      })).filter(cat => cat.count > 0),
    ]
  }, [IMPLEMENTED_TEMPLATES])

  const industries: IndustryFocus[] = ['tech', 'business', 'creative', 'healthcare', 'education', 'finance', 'engineering', 'sales', 'marketing', 'legal']

  const filteredTemplates = useMemo(() => {
    let templates = IMPLEMENTED_TEMPLATES

    if (selectedCategory !== 'all') {
      templates = templates.filter(t => t.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (showPremiumOnly) {
      templates = templates.filter(t => t.isPremium)
    }
    if (showFreeOnly) {
      templates = templates.filter(t => !t.isPremium)
    }

    if (minATSScore > 0) {
      templates = templates.filter(t => t.atsScore >= minATSScore)
    }

    if (selectedIndustry !== 'all') {
      templates = templates.filter(t => t.industryFocus?.includes(selectedIndustry))
    }

    templates = [...templates].sort((a, b) => {
      if (sortBy === 'popularity') {
        return (a.popularityRank || 999) - (b.popularityRank || 999)
      } else if (sortBy === 'ats-score') {
        return b.atsScore - a.atsScore
      } else {
        return a.name.localeCompare(b.name)
      }
    })

    return templates
  }, [selectedCategory, searchQuery, showPremiumOnly, showFreeOnly, minATSScore, selectedIndustry, sortBy, IMPLEMENTED_TEMPLATES])

  const topTemplates = useMemo(() => {
    return IMPLEMENTED_TEMPLATES.slice(0, 6)
  }, [IMPLEMENTED_TEMPLATES])

  const handleSelectTemplate = (template: TemplateMetadata) => {
    router.push(`/dashboard/resume/new?template=${template.id}`)
  }

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Navbar />
      <main className="pt-24 sm:pt-32">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-gray-100 bg-white/50">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                {IMPLEMENTED_TEMPLATES.length} Professional Template{IMPLEMENTED_TEMPLATES.length !== 1 ? 's' : ''}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a1615] mb-3">
                Resume Templates
              </h1>
              <p className="text-lg text-[#6b6b6b] max-w-3xl mx-auto mb-6">
                Choose from our collection of professionally designed, ATS-friendly resume templates.
                All fully customizable to match your style.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Top Templates */}
        {topTemplates.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-[#1a1615]">Most Popular</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {topTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-blue-200 transition-all group"
                  >
                    <div className="aspect-[8.5/11] rounded-lg bg-gray-50 border border-gray-100 mb-3 relative overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundColor: template.colorScheme.primary + '10' }}>
                        <div className="absolute top-2 left-2 right-2 h-1 rounded" style={{ backgroundColor: template.colorScheme.primary }}></div>
                        <div className="absolute top-6 left-2 right-2 space-y-1">
                          <div className="h-0.5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-0.5 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1a1615] group-hover:text-blue-600 transition-colors">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <div className="inline-flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span className="text-xs text-amber-600 font-medium">PRO</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-5 py-3 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-[#1a1615] text-white shadow-lg'
                      : 'bg-white border border-gray-200 text-[#6b6b6b] hover:border-blue-200 hover:text-[#1a1615]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">({category.count})</span>
                  </div>
                </button>
              ))}
            </div>
            {selectedCategory !== 'all' && (
              <p className="text-sm text-[#6b6b6b] mt-3 ml-1">
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            )}
          </motion.div>

          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-[#1a1615]">Filters</h3>
                <span className="text-sm text-[#6b6b6b]">({filteredTemplates.length} results)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#6b6b6b]'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-[#6b6b6b]'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300"
                />
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value as IndustryFocus | 'all')}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry.charAt(0).toUpperCase() + industry.slice(1)}</option>
                ))}
              </select>

              <select
                value={minATSScore}
                onChange={(e) => setMinATSScore(parseInt(e.target.value))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="0">All ATS Scores</option>
                <option value="90">ATS Score 90+</option>
                <option value="95">ATS Score 95+</option>
                <option value="98">ATS Score 98+</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popularity' | 'ats-score' | 'name')}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1a1615] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="popularity">Most Popular</option>
                <option value="ats-score">Highest ATS Score</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showFreeOnly
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-50 text-[#6b6b6b] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {showFreeOnly && <CheckCircle className="w-3 h-3 inline mr-1" />}
                Free Only
              </button>
              <button
                onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showPremiumOnly
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-gray-50 text-[#6b6b6b] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {showPremiumOnly && <CheckCircle className="w-3 h-3 inline mr-1" />}
                <Star className="w-3 h-3 inline mr-1" />
                Premium Only
              </button>
            </div>
          </motion.div>

          {/* Templates Grid */}
          <AnimatePresence mode="wait">
            {filteredTemplates.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm"
              >
                <div className="text-gray-300 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1615] mb-2">No templates found</h3>
                <p className="text-[#6b6b6b] mb-4">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setShowFreeOnly(false)
                    setShowPremiumOnly(false)
                    setMinATSScore(0)
                    setSelectedIndustry('all')
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className={viewMode === 'grid' ? 'group' : 'bg-white border border-gray-100 rounded-xl p-4 flex gap-4 shadow-sm'}
                  >
                    {viewMode === 'grid' ? (
                      <div className="bg-white border border-gray-100 rounded-xl p-5 h-full flex flex-col hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer shadow-sm relative">
                        {template.isPremium && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              PRO
                            </div>
                          </div>
                        )}

                        <div
                          className="relative w-full aspect-[8.5/11] rounded-lg mb-4 overflow-hidden border-2 border-gray-100 group-hover:border-blue-300 transition-colors cursor-pointer"
                          onClick={() => handleSelectTemplate(template)}
                          style={{ backgroundColor: template.colorScheme.background }}
                        >
                          <div className="absolute inset-0 p-3" style={{ backgroundColor: template.colorScheme.primary + '08' }}>
                            <div className="h-2 rounded mb-2" style={{ backgroundColor: template.colorScheme.primary, width: '60%' }}></div>
                            <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colorScheme.text + '40', width: '40%' }}></div>
                            <div className="h-1 rounded mb-4" style={{ backgroundColor: template.colorScheme.text + '40', width: '35%' }}></div>
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-1 rounded" style={{ backgroundColor: template.colorScheme.text + '30', width: `${100 - i * 10}%` }}></div>
                              ))}
                            </div>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1615]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <button className="px-4 py-2 bg-white text-[#1a1615] rounded-lg font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                              <Eye className="w-3 h-3" />
                              Use Template
                            </button>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#1a1615] mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {template.name}
                          </h3>
                          <p className="text-xs text-[#6b6b6b] mb-3 line-clamp-2">
                            {template.description}
                          </p>

                          <div className="flex items-center gap-3 mb-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-500" />
                              <span className="text-[#1a1615]">ATS {template.atsScore}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[#6b6b6b] capitalize">{template.layoutType.replace('-', ' ')}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {template.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-[#6b6b6b]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectTemplate(template)}
                          className="w-full px-4 py-2.5 bg-[#1a1615] rounded-lg hover:bg-black transition-all text-white font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-3 h-3" />
                          Use Template
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-24 aspect-[8.5/11] rounded border border-gray-200 flex-shrink-0" style={{ backgroundColor: template.colorScheme.primary + '20' }}></div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-[#1a1615]">{template.name}</h3>
                            {template.isPremium && (
                              <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#6b6b6b] mb-3">{template.description}</p>
                          <div className="flex items-center gap-4 text-xs text-[#6b6b6b] mb-3">
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-emerald-500" />
                              ATS {template.atsScore}
                            </span>
                            <span className="capitalize">{template.layoutType.replace('-', ' ')}</span>
                            <span className="capitalize">{template.category}</span>
                          </div>
                          <button
                            onClick={() => handleSelectTemplate(template)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium inline-flex items-center gap-2"
                          >
                            Use Template
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-100 rounded-2xl p-12 shadow-sm"
          >
            <h2 className="text-3xl font-bold text-[#1a1615] mb-8 text-center">
              Why Our Templates?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1615] mb-2">ATS-Optimized</h3>
                <p className="text-[#6b6b6b]">
                  All templates are tested and optimized for Applicant Tracking Systems
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1615] mb-2">Fully Customizable</h3>
                <p className="text-[#6b6b6b]">
                  Customize colors, fonts, spacing, and sections to match your brand
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1615] mb-2">Export to PDF</h3>
                <p className="text-[#6b6b6b]">
                  Download your resume as a professional PDF ready to send
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
