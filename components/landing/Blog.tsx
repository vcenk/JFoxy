'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { blogPosts } from './blog-data'
import { fadeInUp, staggerContainer, scaleIn } from './animations'

interface BlogProps {
  title?: string
  subtitle?: string
}

export function Blog({
  title = 'Interview Mastery Insights',
  subtitle = 'Expert tips, strategies, and insider knowledge to help you ace every interview'
}: BlogProps) {
  return (
    <section id="blog" className="py-24 px-6 lg:px-8 bg-white/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-[#1a1615] mb-6 tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-[#453f3d] max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((article, index) => (
            <Link key={article.slug} href={`/blog/${article.slug}`}>
              <motion.article
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 border border-[#1a1615]/5 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-[#9cc1e7]/20 to-[#84b9ef]/20 text-[#84b9ef] border border-[#84b9ef]/20">
                    {article.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#1a1615] mb-3 tracking-tight group-hover:text-[#84b9ef] transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm text-[#453f3d] leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#453f3d]">{article.readTime}</span>
                  <motion.span
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#84b9ef] opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 4 }}
                  >
                    Read article
                    <ChevronRight className="h-4 w-4" />
                  </motion.span>
                </div>
              </motion.article>
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

export default Blog
