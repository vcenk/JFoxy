'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { fadeInUp, staggerContainer } from './animations'
import { InteractiveAvatar } from './InteractiveAvatar' // Import the new component

interface HeroProps {
  badge?: string
  headline?: {
    line1: string
    line2: string
  }
  subheadline?: string
}

export function Hero({
  badge = 'AI-Powered Interview Intelligence',
  headline = {
    line1: 'Stop Guessing.',
    line2: 'Master Your Interview with Clarity.'
  },
  subheadline = 'Go beyond generic advice. Get specific resume gap analysis, smart job description breakdowns, and AI-led mock interviews with actionable feedback.',
}: HeroProps) {
  return (
    <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center md:text-left relative z-20"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-block mb-8">
              <motion.div
                whileHover={{ scale: 1.12 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50/50 border border-violet-100 text-sm font-medium text-violet-700"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-100">
                  <Sparkles className="h-3 w-3 text-violet-600" />
                </span>
                {badge}
              </motion.div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-[4rem] font-bold mb-6 leading-[1.1] text-gray-900"
              style={{ letterSpacing: '-0.02em' }}
            >
              {headline.line1}
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {headline.line2}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-[18px] text-gray-600 mb-8 max-w-xl leading-relaxed mx-auto md:mx-0"
            >
              {subheadline}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <Link
                  href="/auth/register"
                  className="relative flex items-center justify-center gap-2 px-8 py-4 bg-[#0f0f0f] text-white rounded-xl font-bold text-lg overflow-hidden w-full sm:w-auto"
                >
                   <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  <span>Start Improving Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('how-it-works')
                    if (element) {
                      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100
                      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
                    }
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#0f0f0f] rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border border-gray-200 hover:border-gray-300 w-full sm:w-auto"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - NEW Interactive Avatar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative z-10"
          >
             {/* Decorative blob behind the avatar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-tr from-violet-200/40 to-blue-200/40 rounded-full blur-[80px] pointer-events-none" />

            <InteractiveAvatar />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero