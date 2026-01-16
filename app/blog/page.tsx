import { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Clock, Calendar, ArrowRight, Tag } from 'lucide-react'
import { blogPosts } from '@/components/landing/blog-data'
import { SEOPageLayout, SEOPageHero, CTASection, BreadcrumbSchema } from '@/components/seo-pages'

export const metadata: Metadata = {
  title: 'Career Advice Blog | Interview Tips, Resume Writing & Job Search Strategies',
  description:
    'Expert career advice and job search strategies. Learn interview techniques, resume optimization, salary negotiation, and more from the Job Foxy team.',
  keywords: [
    'career advice',
    'interview tips',
    'resume tips',
    'job search',
    'career blog',
    'STAR method',
    'salary negotiation',
    'job application',
  ],
  openGraph: {
    title: 'Career Advice Blog | Job Foxy',
    description:
      'Expert career advice and job search strategies from the Job Foxy team.',
    type: 'website',
  },
}

// Get unique tags from blog posts
const allTags = Array.from(new Set(blogPosts.map((post) => post.tag)))

// Sort posts by date (newest first)
const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
)

const featuredPost = sortedPosts[0]
const remainingPosts = sortedPosts.slice(1)

export default function BlogPage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Blog', url: 'https://jobfoxy.com/blog' },
        ]}
      />

      <SEOPageHero
        badge="Career Blog"
        badgeIcon={BookOpen}
        title="Expert Career Advice & Job Search Tips"
        description="Practical insights on interviews, resumes, and career growth. Written by professionals, backed by data."
        primaryCTA={{ text: 'Start Interview Practice', href: '/auth/register' }}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      {/* Category Tags */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[#6b6b6b]">Browse by topic:</span>
            {allTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-[#1a1615] cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-6">
            Featured Article
          </h2>
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 hover:border-blue-200 rounded-2xl p-8 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {featuredPost.tag}
                  </span>
                  <span className="text-sm text-[#6b6b6b]">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#1a1615] mb-4 group-hover:text-blue-600 transition-colors">
                  {featuredPost.title}
                </h3>
                <p className="text-lg text-[#6b6b6b] mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-[#6b6b6b]">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.publishedAt}
                  </span>
                  <span>By {featuredPost.author}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-medium">
                <span>Read article</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1a1615] mb-8">All Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white hover:bg-gray-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {post.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#1a1615] mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-[#6b6b6b] mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-[#6b6b6b]">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                  <span>{post.publishedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Topics We Cover */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">Topics We Cover</h2>
            <p className="text-lg text-[#6b6b6b] max-w-2xl mx-auto">
              Comprehensive guides and tips for every stage of your job search journey.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Interview Preparation',
                description: 'Master behavioral questions, technical interviews, and more.',
                links: ['/star-method', '/mock-interviews', '/interview'],
              },
              {
                title: 'Resume Writing',
                description: 'Create ATS-optimized resumes that get you noticed.',
                links: ['/resume', '/resume/templates', '/resume-synonyms'],
              },
              {
                title: 'Career Growth',
                description: 'Salary negotiation, career planning, and professional development.',
                links: ['/blog/ultimate-guide-salary-negotiation'],
              },
            ].map((topic, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[#1a1615] mb-3">{topic.title}</h3>
                <p className="text-[#6b6b6b] mb-4">{topic.description}</p>
                <div className="flex flex-wrap gap-2">
                  {topic.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {link.split('/').pop()?.replace(/-/g, ' ') || 'View'} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Put These Tips into Practice?"
        description="Start preparing for your next interview with Job Foxy's AI-powered mock interviews and coaching tools."
        primaryCTA={{ text: 'Start Practicing Free', href: '/auth/register' }}
        secondaryCTA={{ text: 'Explore Interview Tools', href: '/interview' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
