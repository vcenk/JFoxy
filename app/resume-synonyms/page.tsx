// app/resume-synonyms/page.tsx
// Browse all resume power words and synonyms - SEO optimized

import { Metadata } from 'next'
import Link from 'next/link'
import { POWER_WORD_SYNONYMS, ACTION_VERBS } from '@/lib/data/powerWords'
import { ArrowRight, Search, Sparkles, TrendingUp, Target } from 'lucide-react'
import { Navbar, Footer } from '@/components/landing'

export const metadata: Metadata = {
  title: 'Resume Power Words & Synonyms | 900+ Action Verbs for ATS Optimization',
  description:
    'Discover 900+ powerful resume synonyms and action verbs to replace weak phrases. Improve your ATS score with stronger alternatives for "managed," "responsible for," and more.',
  keywords: [
    'resume synonyms',
    'power words',
    'action verbs',
    'resume writing',
    'ATS optimization',
    'resume keywords',
    'strong verbs',
    'resume improvement',
  ],
  openGraph: {
    title: 'Resume Power Words & Synonyms | 900+ Action Verbs',
    description:
      'Replace weak resume phrases with powerful synonyms. Browse 900+ action verbs organized by category.',
    type: 'website',
  },
}

export default function ResumeSynonymsPage() {
  // Get all weak words (keys from POWER_WORD_SYNONYMS)
  const weakWords = Object.keys(POWER_WORD_SYNONYMS).sort()

  // Organize ACTION_VERBS by category
  const categories = Object.entries(ACTION_VERBS)

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-100 bg-white pt-24 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1615] mb-4">
              Resume Power Words & Synonyms
            </h1>
            <p className="text-xl text-[#6b6b6b] max-w-3xl mx-auto">
              Transform your resume with 900+ powerful action verbs and synonyms. Replace weak
              phrases to boost your ATS score and stand out to recruiters.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">900+</div>
              <div className="text-sm text-[#6b6b6b] mt-1">Power Word Synonyms</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">10</div>
              <div className="text-sm text-[#6b6b6b] mt-1">Categories</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">195+</div>
              <div className="text-sm text-[#6b6b6b] mt-1">Action Verbs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why This Matters Section */}
        <div className="mb-12 bg-blue-50 border border-blue-100 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-3">
                Why Power Words Matter for Your Resume
              </h2>
              <div className="text-[#6b6b6b] space-y-2">
                <p>
                  <strong className="text-[#1a1615]">ATS Systems scan for action verbs:</strong>{' '}
                  Applicant Tracking Systems prioritize resumes with strong, specific action verbs
                  over generic phrases like "responsible for" or "helped with."
                </p>
                <p>
                  <strong className="text-[#1a1615]">Recruiters prefer impact:</strong> Power words
                  demonstrate leadership, achievement, and results - exactly what hiring managers
                  are looking for.
                </p>
                <p>
                  <strong className="text-[#1a1615]">Stand out from competition:</strong> Most
                  candidates use weak, passive language. Strong synonyms make your accomplishments
                  memorable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Verbs by Category */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-[#1a1615]">Power Words by Category</h2>
          </div>
          <p className="text-[#6b6b6b] mb-8">
            Browse 195+ action verbs organized by type. Click any category to see recommended verbs
            for your resume.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map(([category, verbs]) => (
              <div
                key={category}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-purple-200 transition-all shadow-sm"
              >
                <h3 className="text-xl font-bold text-[#1a1615] mb-2 capitalize">
                  {category.replace(/_/g, ' ')}
                </h3>
                <p className="text-sm text-[#6b6b6b] mb-4">{verbs.length} powerful verbs</p>
                <div className="flex flex-wrap gap-2">
                  {verbs.slice(0, 8).map((verb) => (
                    <span
                      key={verb}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-lg border border-purple-100"
                    >
                      {verb}
                    </span>
                  ))}
                  {verbs.length > 8 && (
                    <span className="px-3 py-1 text-[#6b6b6b] text-sm">+{verbs.length - 8} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Weak Words to Replace */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-amber-600" />
            <h2 className="text-3xl font-bold text-[#1a1615]">Weak Words to Replace</h2>
          </div>
          <p className="text-[#6b6b6b] mb-8">
            Click any weak word below to see powerful alternatives and usage examples.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {weakWords.map((word) => (
              <Link
                key={word}
                href={`/resume-synonyms/${word.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 rounded-xl p-4 transition-all"
              >
                <div className="text-sm text-red-700 group-hover:text-red-800 font-medium mb-1">
                  {word}
                </div>
                <div className="flex items-center text-xs text-[#6b6b6b] group-hover:text-[#1a1615]">
                  <span>See alternatives</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1a1615] mb-4">How to Use Power Words Effectively</h2>
          <div className="grid md:grid-cols-2 gap-6 text-[#6b6b6b]">
            <div>
              <h3 className="text-lg font-semibold text-[#1a1615] mb-2">Do:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Start each bullet point with a strong action verb
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Use specific verbs that match your actual role and responsibilities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Vary your word choice throughout the resume
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Combine power words with quantifiable results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  Match verbs to the job description when possible
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1a1615] mb-2">Don&apos;t:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Use the same action verb repeatedly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Choose fancy words that don&apos;t match your experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Start with weak phrases like "responsible for" or "duties included"
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Use passive voice or vague language
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  Forget to back up action words with measurable results
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#1a1615] mb-3">Ready to Optimize Your Resume?</h2>
            <p className="text-[#6b6b6b] mb-6 max-w-2xl mx-auto">
              Use our AI-powered resume builder to automatically detect weak words and get
              personalized power word suggestions.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-[#1a1615] text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-colors shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Analyze My Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
