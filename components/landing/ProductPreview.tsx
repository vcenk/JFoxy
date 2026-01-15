'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import {
  FileSearch,
  Mic,
  Target,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Star
} from 'lucide-react'

// Animated Visual Components for each step
const ResumeAnalysisVisual = () => (
  <div className="relative w-full max-w-[320px]">
    {/* Resume Document */}
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
          <div className="h-2 w-16 bg-gray-100 rounded-full mt-1.5" />
        </div>
      </div>

      {/* Scanning line animation */}
      <div className="relative space-y-2 mb-4">
        <motion.div
          className="absolute left-0 right-0 h-6 bg-gradient-to-b from-blue-500/20 to-transparent rounded"
          animate={{ top: [0, 60, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-2 w-full bg-gray-100 rounded-full" />
        <div className="h-2 w-[85%] bg-gray-100 rounded-full" />
        <div className="h-2 w-[90%] bg-gray-100 rounded-full" />
        <div className="h-2 w-[75%] bg-gray-100 rounded-full" />
      </div>

      {/* Keywords found */}
      <div className="flex flex-wrap gap-2">
        {['React', 'TypeScript', 'Leadership'].map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>

    {/* Floating match score */}
    <motion.div
      className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-2xl px-4 py-3 shadow-xl"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.6, type: "spring" }}
    >
      <div className="text-[10px] font-medium opacity-80">Match Score</div>
      <div className="text-2xl font-bold">87%</div>
    </motion.div>
  </div>
)

const STARFrameworkVisual = () => (
  <div className="relative w-full max-w-[320px]">
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* STAR Progress */}
      <div className="space-y-3">
        {[
          { letter: 'S', label: 'Situation', color: 'from-amber-400 to-orange-500', delay: 0.3 },
          { letter: 'T', label: 'Task', color: 'from-orange-400 to-rose-500', delay: 0.5 },
          { letter: 'A', label: 'Action', color: 'from-rose-400 to-pink-500', delay: 0.7 },
          { letter: 'R', label: 'Result', color: 'from-pink-400 to-violet-500', delay: 0.9 },
        ].map((item, i) => (
          <motion.div
            key={item.letter}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay }}
            className="flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold shadow-lg`}>
              {item.letter}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-700">{item.label}</div>
              <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${85 + i * 3}%` }}
                  transition={{ delay: item.delay + 0.3, duration: 0.8 }}
                />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.delay + 0.5 }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Floating feedback */}
    <motion.div
      className="absolute -bottom-3 -left-3 bg-white rounded-xl px-3 py-2 shadow-xl border border-gray-100 flex items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <Sparkles className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-semibold text-gray-700">Great structure!</span>
    </motion.div>
  </div>
)

const MockInterviewVisual = () => (
  <div className="relative w-full max-w-[320px]">
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Interview header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-500">LIVE SESSION</span>
        </div>
        <span className="text-xs font-medium text-gray-400">12:34</span>
      </div>

      {/* Avatar and waveform */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          {/* Speaking indicator */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-rose-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Audio waveform */}
        <div className="flex-1 flex items-center justify-center gap-1 h-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-gradient-to-t from-rose-500 to-orange-400 rounded-full"
              animate={{
                height: [8, Math.random() * 32 + 12, 8]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.08,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Question bubble */}
      <motion.div
        className="bg-gray-50 rounded-xl p-3 border border-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-sm text-gray-600 leading-relaxed">
          "Tell me about a time you led a challenging project..."
        </p>
      </motion.div>
    </motion.div>

    {/* Floating score */}
    <motion.div
      className="absolute -top-3 -right-3 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-xl px-3 py-2 shadow-xl flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
    >
      <Star className="w-4 h-4 fill-current" />
      <span className="text-sm font-bold">9.2</span>
    </motion.div>
  </div>
)

const CARDS = [
  {
    id: 1,
    step: '01',
    title: 'Resume Analysis',
    subtitle: 'Step 1 — Analyze',
    description: 'Upload your resume, paste any job description. See exactly which skills and keywords you need to add.',
    icon: FileSearch,
    gradient: 'from-blue-600 to-violet-600',
    bgColor: 'bg-gradient-to-br from-blue-50 via-violet-50/50 to-indigo-50',
    Visual: ResumeAnalysisVisual,
    href: '/auth/register',
  },
  {
    id: 2,
    step: '02',
    title: 'STAR Framework',
    subtitle: 'Step 2 — Structure',
    description: 'Transform rambling answers into compelling narratives. Get component-by-component scoring and feedback.',
    icon: Target,
    gradient: 'from-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-50 via-orange-50/50 to-rose-50',
    Visual: STARFrameworkVisual,
    href: '/auth/register',
  },
  {
    id: 3,
    step: '03',
    title: 'Mock Interviews',
    subtitle: 'Step 3 — Practice',
    description: 'Realistic voice conversations with AI interviewers. Get scored on content, delivery, and confidence.',
    icon: Mic,
    gradient: 'from-rose-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-rose-50 via-pink-50/50 to-orange-50',
    Visual: MockInterviewVisual,
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
        <motion.div
          className="bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100/80 overflow-hidden"
          whileHover={{ boxShadow: "0 25px 60px -12px rgba(0,0,0,0.2)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid md:grid-cols-2">

            {/* Left: Content */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6`}>
                <card.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>

              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {card.subtitle}
              </p>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f0f0f] tracking-tight mb-4">
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
            <div className={`${card.bgColor} p-6 sm:p-8 md:p-10 lg:p-14 flex items-center justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] relative overflow-hidden`}>
              {/* Large step number background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className={`text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-black bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent opacity-[0.07]`}>
                  {card.step}
                </span>
              </div>
              {/* Animated Visual Component */}
              <div className="relative z-10">
                <card.Visual />
              </div>
            </div>

          </div>
        </motion.div>
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
    <section ref={containerRef} className="relative bg-[#fafafa]" style={{ height: `${(CARDS.length + 0.5) * 100}vh` }}>

      {/* Header - Sticky at top */}
      <div className="sticky top-0 pt-24 pb-8 z-10 bg-gradient-to-b from-[#fafafa] via-[#fafafa] to-transparent">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f0f0f] tracking-tight"
          >
            Get Hired in{' '}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              3 Steps
            </span>
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
