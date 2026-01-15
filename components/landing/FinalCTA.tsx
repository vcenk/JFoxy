'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

// 1. Simple, bulletproof animation
const simpleFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

interface FinalCTAProps {
  headline?: {
    line1: string
    line2: string
  }
  subheadline?: string
  ctaText?: string
  ctaLink?: string
}

export function FinalCTA({
  headline = {
    line1: 'Stop Guessing.',
    line2: 'Get Hired.'
  },
  subheadline = 'Stop guessing what hiring managers want. Get instant feedback on your answers and walk into your next interview with confidence.',
  ctaText = 'Start Practicing Free',
  ctaLink = '/auth/register',
}: FinalCTAProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7fa]">
      <div className="max-w-5xl mx-auto">
        
        {/* Floating Card Container */}
        <div className="relative rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] bg-[#1a1615] px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24 text-center overflow-hidden shadow-2xl">
          
          {/* Background Glows (Fixed Z-Index) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[400px] bg-blue-600/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-0 right-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-violet-600/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] pointer-events-none z-0" />

          {/* Content Container (High Z-Index to ensure visibility) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-20 max-w-2xl mx-auto"
          >
            
            {/* Top Badge */}
            <motion.div variants={simpleFade} className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Join 10,000+ hired candidates</span>
              </div>
            </motion.div>

            {/* Headlines */}
            <motion.h2 variants={simpleFade} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              {headline.line1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                {headline.line2}
              </span>
            </motion.h2>

            <motion.p variants={simpleFade} className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 max-w-lg mx-auto px-2 sm:px-0">
              {subheadline}
            </motion.p>

            {/* CTA Button Area */}
            <motion.div variants={simpleFade} className="flex flex-col items-center gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={ctaLink}
                  className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-white text-[#1a1615] rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                >
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-500">
                 <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required
                 </span>
                 <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Free forever plan
                 </span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA