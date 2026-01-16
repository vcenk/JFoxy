import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react'
import { getBlogBySlug, blogPosts } from '@/components/landing/blog-data'
import ReactMarkdown from 'react-markdown'

// 1. Generate Static Params for SSG (Static Site Generation)
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

// 2. Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${post.title} | Job Foxy Blog`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
      tags: [post.tag, ...post.keywords],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    }
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // 3. JSON-LD Structured Data for Google - Enhanced BlogPosting
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://jobfoxy.com/blog/${post.slug}/opengraph-image`,
    author: {
      '@type': 'Organization',
      name: 'Job Foxy',
      url: 'https://jobfoxy.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Job Foxy',
      url: 'https://jobfoxy.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jobfoxy.com/logo.png',
      },
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jobfoxy.com/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    articleSection: post.tag,
    wordCount: post.content.split(/\s+/).length,
  }

  // Breadcrumb Schema for navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://jobfoxy.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://jobfoxy.com/#blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://jobfoxy.com/blog/${post.slug}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href="/#blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a1615] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Job Foxy Insights</span>
        </div>
      </nav>

      <main className="pb-24 pt-12 md:pt-20">
        <article className="max-w-3xl mx-auto px-6">
          
          {/* Header */}
          <header className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 mb-6 uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {post.tag}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1615] mb-8 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500 border-y border-gray-100 py-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1a1615] flex items-center justify-center text-white font-bold text-xs">
                  JF
                </div>
                <span className="font-semibold text-gray-900">{post.author}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="blog-content prose prose-lg md:prose-xl max-w-none text-gray-600 prose-headings:font-bold prose-headings:text-[#1a1615] prose-headings:tracking-tight prose-p:leading-8 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-li:marker:text-blue-500">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="hidden" {...props} />, // Hide h1 as it's already in header
                h2: ({node, ...props}) => (
                  <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-[#1a1615] tracking-tight relative group" {...props}>
                    {props.children}
                  </h2>
                ),
                h3: ({node, ...props}) => (
                  <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-[#1a1615]" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="mb-6 text-[18px] leading-[1.8] text-[#2d2d2d]" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="my-6 space-y-3" {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="my-6 space-y-3 list-decimal" {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-8 bg-gray-50/50 rounded-r-xl italic text-xl text-gray-700 font-medium leading-relaxed" {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong className="font-bold text-[#1a1615]" {...props} />
                ),
                a: ({node, ...props}) => (
                  <a className="text-blue-600 font-medium border-b-2 border-blue-100 hover:border-blue-600 transition-all no-underline" {...props} />
                ),
                code: ({node, ...props}) => (
                  <code className="bg-gray-100 text-[#d63384] px-1.5 py-0.5 rounded text-sm font-mono font-medium" {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Footer CTA */}
          <div className="mt-20">
            <div className="bg-[#1a1615] rounded-3xl p-8 md:p-12 text-center md:text-left relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Master these skills with Job Foxy
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl text-lg">
                  Don't just read about it. Practice your interview answers with our AI coach and get instant, personalized feedback.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#1a1615] rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    Start Practicing Free
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                  <Link
                    href="/#features"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </article>
      </main>
    </div>
  )
}
