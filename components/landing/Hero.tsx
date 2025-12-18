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
  stats?: Array<{
    number: string
    label: string
  }>
}

const defaultStats = [
  { number: '10k+', label: 'Job Seekers' },
  { number: '95%', label: 'Success Rate' },
  { number: '50k+', label: 'Sessions' },
]

export function Hero({
  badge = 'AI-Powered Interview Coaching',
  headline = {
    line1: 'Ace your next interview',
    line2: 'with AI coaching'
  },
  subheadline = 'Master behavioral interviews with AI-powered voice coaching, STAR framework feedback, and role-specific practice.',
  stats = defaultStats
}: HeroProps) {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#fafafa]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left relative z-20"
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
              className="text-4xl sm:text-5xl lg:text-[4rem] font-semibold mb-6 leading-[1.05]"

              style={{ letterSpacing: '-0.04em' }}
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
              className="text-[17px] text-[#606060] mb-8 max-w-md leading-[1.5]"

            >
              {subheadline}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                <Link
                  href="/auth/register"
                  className="relative flex items-center justify-center gap-3 px-10 py-5 bg-[#0f0f0f] text-white rounded-xl font-bold text-lg overflow-hidden"
                >
                   <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                  <span>Try Job Foxy Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#features"
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0f0f0f] rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-transparent hover:border-black/[0.05]"
                >
                  View Features
                </a>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-8 sm:gap-12 pt-8 border-t border-gray-100"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-[#0f0f0f] tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-sm text-[#606060] font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - NEW Interactive Avatar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative z-10"
          >
             {/* Decorative blob behind the avatar */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-200/40 to-blue-200/40 rounded-full blur-[80px] pointer-events-none" />
            
            <InteractiveAvatar />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero