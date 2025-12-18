'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import { getBlogBySlug } from '@/components/landing/blog-data'
import ReactMarkdown from 'react-markdown'

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#9cc1e7]/20 to-[#84b9ef]/20 text-[#84b9ef] border border-[#84b9ef]/20 mb-6">
            {post.tag}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1615] mb-6 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-[#453f3d] mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#606060] border-t border-b border-gray-200 py-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.publishedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1a1615] prose-p:text-[#453f3d] prose-p:leading-relaxed prose-a:text-[#84b9ef] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a1615] prose-ul:text-[#453f3d] prose-ol:text-[#453f3d] prose-li:my-1">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl border border-violet-100">
          <h3 className="text-2xl font-bold text-[#1a1615] mb-4">
            Ready to practice what you've learned?
          </h3>
          <p className="text-[#453f3d] mb-6">
            Start using EchoMind AI to prepare for your next interview with personalized coaching and instant feedback.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0f0f0f] text-white rounded-lg font-semibold hover:bg-[#1a1615] transition-colors"
          >
            Try EchoMind Free
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </article>
    </div>
  )
}
