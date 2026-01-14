'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import {
  FileSearch,
  Mic,
  Target,
  ArrowRight
} from 'lucide-react'

const CARDS = [
  {
    id: 1,
    title: 'Resume Analysis',
    subtitle: 'Know what\'s missing',
    description: 'Upload your resume, paste any job description. See exactly which skills and keywords you need to add.',
    icon: FileSearch,
    gradient: 'from-blue-600 to-violet-600',
    bgColor: 'bg-blue-50',
    href: '/auth/register',
  },
  {
    id: 2,
    title: 'Mock Interviews',
    subtitle: 'Practice with AI',
    description: 'Realistic voice conversations with AI interviewers. Get scored on content, delivery, and confidence.',
    icon: Mic,
    gradient: 'from-rose-500 to-orange-500',
    bgColor: 'bg-rose-50',
    href: '/auth/register',
  },
  {
    id: 3,
    title: 'STAR Framework',
    subtitle: 'Structure your stories',
    description: 'Transform rambling answers into compelling narratives. Get component-by-component scoring and feedback.',
    icon: Target,
    gradient: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    href: '/auth/register',
  },
]

function StackedCard({
  card,
  index,
  totalCards,
  progress
}: {
  card: typeof CARDS[0]
  index: number
  totalCards: number
  progress: any
}) {
  // Calculate animation values based on scroll progress
  const cardStart = index / totalCards
  const cardEnd = (index + 1) / totalCards

  // Scale down as next card comes in
  const scale = useTransform(
    progress,
    [cardStart, cardEnd],
    [1, 0.9]
  )

  // Move up slightly as it scales
  const y = useTransform(
    progress,
    [cardStart, cardEnd],
    [0, -30]
  )

  // Reduce opacity slightly
  const opacity = useTransform(
    progress,
    [cardStart, cardEnd],
    [1, 0.6]
  )

  return (
    <motion.div
      style={{
        scale: index < totalCards - 1 ? scale : 1,
        y: index < totalCards - 1 ? y : 0,
        opacity: index < totalCards - 1 ? opacity : 1,
      }}
      className="sticky top-32 mb-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2">

            {/* Left: Content */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6`}>
                <card.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>

              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {card.subtitle}
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-[#0f0f0f] tracking-tight mb-4">
                {card.title}
              </h3>

              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                {card.description}
              </p>

              <Link
                href={card.href}
                className="inline-flex items-center gap-2 text-[#0f0f0f] font-semibold group"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Visual */}
            <div className={`${card.bgColor} p-10 md:p-14 flex items-center justify-center min-h-[300px] md:min-h-[400px]`}>
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-2xl`}>
                <card.icon className="w-16 h-16 md:w-20 md:h-20 text-white" strokeWidth={1} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <section ref={containerRef} className="relative bg-[#fafafa]" style={{ height: `${(CARDS.length + 1) * 100}vh` }}>

      {/* Header - Sticky at top */}
      <div className="sticky top-0 pt-24 pb-8 z-10 bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-transparent">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0f0f0f] tracking-tight"
          >
            Three steps to your dream job
          </motion.h2>
        </div>
      </div>

      {/* Stacked Cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        {CARDS.map((card, index) => (
          <StackedCard
            key={card.id}
            card={card}
            index={index}
            totalCards={CARDS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

    </section>
  )
}

export default ProductPreview
