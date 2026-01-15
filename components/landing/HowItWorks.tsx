'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Link as LinkIcon,
  BrainCircuit,
  Mic,
  FileText,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  Play,
  Zap,
  Award,
  BarChart3
} from 'lucide-react'

// Floating particles component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 opacity-40"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 10, 0],
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          delay: i * 0.3,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
)

// Main stats card with animation
const StatsCard = () => (
  <motion.div
    className="relative bg-gradient-to-br from-[#1a1615] to-[#2d2926] rounded-3xl p-6 sm:p-8 overflow-hidden"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Glow effect */}
    <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px]" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px]" />

    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <span className="text-emerald-400 text-sm font-semibold">Success Rate</span>
      </div>

      <div className="flex items-end gap-2 mb-6">
        <motion.span
          className="text-5xl sm:text-6xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          94
        </motion.span>
        <span className="text-2xl text-white/60 mb-2">%</span>
      </div>

      <p className="text-white/50 text-sm">of users report improved interview confidence</p>

      {/* Mini chart */}
      <div className="flex items-end gap-1.5 mt-6 h-16">
        {[40, 55, 45, 70, 60, 85, 75, 94].map((height, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-gradient-to-t from-violet-500 to-blue-400 rounded-t-sm"
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  </motion.div>
)

// Process step card with progress indicator
const ProcessCard = ({ step, index, isActive, progress }: {
  step: typeof STEPS[0],
  index: number,
  isActive: boolean,
  progress: number
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`relative rounded-2xl p-5 transition-all duration-500 ${
      isActive
        ? 'bg-white shadow-xl shadow-black/10 border-2 border-violet-200 scale-[1.02]'
        : 'bg-white/40 border border-gray-100'
    }`}
  >
    {/* Progress bar for active card */}
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-blue-500 rounded-b-2xl"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    )}

    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
        isActive
          ? `bg-gradient-to-br ${step.gradient} shadow-lg`
          : 'bg-gray-100'
      }`}>
        <step.icon className={`w-6 h-6 transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold transition-colors duration-500 ${isActive ? 'text-violet-600' : 'text-gray-400'}`}>
            STEP {index + 1}
          </span>
          {isActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
          )}
        </div>
        <h4 className={`font-bold mb-1 transition-colors duration-500 ${isActive ? 'text-[#1a1615]' : 'text-gray-500'}`}>
          {step.title}
        </h4>
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-500 leading-relaxed"
            >
              {step.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
)

// Interactive demo preview
const DemoPreview = ({ activeStep }: { activeStep: typeof STEPS[0] }) => (
  <motion.div
    key={activeStep.title}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden h-full min-h-[300px] sm:min-h-[400px]"
  >
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${activeStep.bgGradient} opacity-50`} />

    <div className="relative z-10 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeStep.gradient} flex items-center justify-center shadow-lg`}>
            <activeStep.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-[#1a1615]">{activeStep.title}</h4>
            <p className="text-xs text-gray-500">Live Preview</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Dynamic content based on active step */}
      <div className="flex-1 flex items-center justify-center">
        <activeStep.Visual />
      </div>
    </div>
  </motion.div>
)

// Enhanced visual components
const URLVisualEnhanced = () => (
  <div className="w-full max-w-sm">
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <LinkIcon className="w-5 h-5 text-gray-400" />
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>
      </div>
    </div>
    <div className="space-y-2">
      {['Company Culture', 'Required Skills', 'Experience Level'].map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.2 }}
          className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-medium text-gray-700">{item}</span>
          <motion.div
            className="ml-auto px-2 py-0.5 bg-emerald-50 rounded text-xs font-semibold text-emerald-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.2 }}
          >
            Detected
          </motion.div>
        </motion.div>
      ))}
    </div>
  </div>
)

const AnalysisVisualEnhanced = () => (
  <div className="w-full max-w-sm">
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Keywords Match', value: '87%', color: 'from-emerald-400 to-emerald-600' },
        { label: 'Skills Gap', value: '2', color: 'from-amber-400 to-orange-500' },
        { label: 'Experience Fit', value: '95%', color: 'from-blue-400 to-violet-500' },
        { label: 'Culture Match', value: 'High', color: 'from-pink-400 to-rose-500' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
          <div className="flex items-end gap-1">
            <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100 flex items-center gap-3"
    >
      <Sparkles className="w-5 h-5 text-violet-500" />
      <span className="text-sm font-medium text-violet-700">AI recommendations ready</span>
    </motion.div>
  </div>
)

const VoiceVisualEnhanced = () => (
  <div className="w-full max-w-sm">
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Mic className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <p className="font-semibold text-gray-800">Recording...</p>
          <p className="text-xs text-gray-500">Speak your answer</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1 h-12">
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-rose-500 to-orange-400 rounded-full"
            animate={{ height: [8, Math.random() * 40 + 8, 8] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-50 rounded-xl p-4"
    >
      <p className="text-sm text-gray-600 italic">"Tell me about a time you led a challenging project..."</p>
    </motion.div>
  </div>
)

const InsightsVisualEnhanced = () => (
  <div className="w-full max-w-sm">
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-gray-800">Your Score</span>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.3 }}
          className="px-3 py-1 bg-emerald-50 rounded-full"
        >
          <span className="text-sm font-bold text-emerald-600">Excellent</span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <motion.div
          className="relative w-28 h-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#f3f4f6" strokeWidth="8" />
            <motion.circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={301.59}
              initial={{ strokeDashoffset: 301.59 }}
              animate={{ strokeDashoffset: 301.59 * 0.08 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-3xl font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              92
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Content', score: 95 },
          { label: 'Structure', score: 88 },
          { label: 'Delivery', score: 90 },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">{item.label}</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 w-8">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const STEPS = [
  {
    title: "Paste Job URL",
    description: "Simply paste the link to any job posting. Our AI instantly decodes what the hiring manager is really looking for.",
    icon: LinkIcon,
    gradient: "from-blue-500 to-violet-600",
    bgGradient: "from-blue-50 to-violet-50",
    Visual: URLVisualEnhanced
  },
  {
    title: "Smart Analysis",
    description: "Get instant keyword matching, skills gap analysis, and personalized recommendations to optimize your application.",
    icon: BrainCircuit,
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    Visual: AnalysisVisualEnhanced
  },
  {
    title: "Voice Practice",
    description: "Practice answering real interview questions out loud. Our AI evaluates your clarity, structure, and confidence.",
    icon: Mic,
    gradient: "from-rose-500 to-orange-500",
    bgGradient: "from-rose-50 to-orange-50",
    Visual: VoiceVisualEnhanced
  },
  {
    title: "Get Insights",
    description: "Receive detailed feedback with specific improvements. Know exactly what to say and how to say it better.",
    icon: BarChart3,
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50",
    Visual: InsightsVisualEnhanced
  },
]

const CYCLE_DURATION = 5000 // 5 seconds per step

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const activeStep = STEPS[activeIndex]

  // Auto-cycle through steps
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (CYCLE_DURATION / 50)) // Update every 50ms
      })
    }, 50)

    const cycleInterval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % STEPS.length)
      setProgress(0)
    }, CYCLE_DURATION)

    return () => {
      clearInterval(progressInterval)
      clearInterval(cycleInterval)
    }
  }, [])

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#f8f9fb] to-white relative overflow-hidden">
      <FloatingParticles />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 mb-6"
          >
            <Zap className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1615] tracking-tight mb-4"
          >
            From Application to{' '}
            <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Offer
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto"
          >
            A simple, guided path to mastering your interview preparation
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left column - Stats card (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block lg:col-span-3"
          >
            <StatsCard />
          </motion.div>

          {/* Center column - Interactive preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 order-2 lg:order-none"
          >
            <AnimatePresence mode="wait">
              <DemoPreview activeStep={activeStep} />
            </AnimatePresence>
          </motion.div>

          {/* Right column - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-4 order-1 lg:order-none"
          >
            <div className="space-y-3">
              {STEPS.map((step, index) => (
                <ProcessCard
                  key={step.title}
                  step={step}
                  index={index}
                  isActive={activeIndex === index}
                  progress={activeIndex === index ? progress : 0}
                />
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <Link
                href="/auth/register"
                className="group flex items-center justify-center gap-2 w-full py-4 bg-[#1a1615] text-white font-semibold rounded-xl hover:bg-black transition-colors"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

        </div>

        {/* Mobile stats - shown below on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:hidden mt-8"
        >
          <StatsCard />
        </motion.div>

      </div>
    </section>
  )
}

export default HowItWorks
