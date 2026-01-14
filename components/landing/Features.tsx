'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Search,
  FileText,
  Mic,
  Zap,
  CheckCircle2,
  BrainCircuit,
  Sparkles
} from 'lucide-react'

const FEATURES = [
  {
    id: 1,
    title: "Gap Analysis",
    icon: Search,
    color: "bg-violet-500",
    iconColor: "text-violet-500",
    position: "top-[8%] left-[15%] md:top-[12%] md:left-[18%]",
  },
  {
    id: 2,
    title: "Mock Interviews",
    icon: Mic,
    color: "bg-rose-500",
    iconColor: "text-rose-500",
    position: "top-[5%] right-[10%] md:top-[8%] md:right-[15%]",
  },
  {
    id: 3,
    title: "STAR Framework",
    icon: Zap,
    color: "bg-amber-500",
    iconColor: "text-amber-500",
    position: "top-[32%] left-[3%] md:top-[35%] md:left-[8%]",
  },
  {
    id: 4,
    title: "Voice Coach",
    icon: BrainCircuit,
    color: "bg-emerald-500",
    iconColor: "text-emerald-500",
    position: "top-[30%] right-[2%] md:top-[32%] md:right-[6%]",
  },
  {
    id: 5,
    title: "Resume Builder",
    icon: FileText,
    color: "bg-blue-500",
    iconColor: "text-blue-500",
    position: "bottom-[28%] left-[8%] md:bottom-[25%] md:left-[12%]",
  },
  {
    id: 6,
    title: "ATS Optimizer",
    icon: CheckCircle2,
    color: "bg-cyan-500",
    iconColor: "text-cyan-500",
    position: "bottom-[30%] right-[5%] md:bottom-[28%] md:right-[10%]",
  },
  {
    id: 7,
    title: "Cover Letters",
    icon: FileText,
    color: "bg-pink-500",
    iconColor: "text-pink-500",
    position: "bottom-[8%] left-[20%] md:bottom-[10%] md:left-[25%]",
  },
  {
    id: 8,
    title: "Job Insights",
    icon: Search,
    color: "bg-indigo-500",
    iconColor: "text-indigo-500",
    position: "bottom-[5%] right-[18%] md:bottom-[8%] md:right-[22%]",
  },
]

const floatAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
}

const hoverFloat = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  }
}

export function Features() {
  return (
    <section id="features" className="relative py-32 md:py-40 lg:py-48 bg-[#fafafa] overflow-hidden">

      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-[120px]" />
      </div>

      {/* Floating Feature Pills */}
      {FEATURES.map((feature, index) => (
        <motion.div
          key={feature.id}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={floatAnimation}
          transition={{ delay: index * 0.1 }}
          className={`absolute ${feature.position} z-10 hidden sm:block`}
        >
          <motion.div
            animate={hoverFloat}
            transition={{ delay: index * 0.2 }}
            className="group cursor-pointer"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-lg shadow-black/[0.08] border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className={`w-10 h-10 ${feature.color} rounded-full flex items-center justify-center`}>
                <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-[15px] font-semibold text-gray-800 pr-2">
                {feature.title}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Center Content */}
      <div className="relative z-20 max-w-3xl mx-auto px-4 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 mb-8"
        >
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700 uppercase tracking-wider">Features</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0f0f0f] tracking-tight leading-[1.1] mb-6"
        >
          More than a
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            resume tool
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          A complete toolkit to analyze your resume, practice interviews, and land offers faster.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-[#0f0f0f] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
          >
            Get Started Free
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 bg-white text-[#0f0f0f] font-semibold rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Mobile: Show features as simple list */}
        <div className="sm:hidden mt-16 grid grid-cols-2 gap-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-gray-100"
            >
              <div className={`w-8 h-8 ${feature.color} rounded-full flex items-center justify-center`}>
                <feature.icon className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium text-gray-700 truncate">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Features
