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
    line1: 'Ready to land your',
    line2: 'dream job?'
  },
  subheadline = 'Stop guessing what hiring managers want. Get instant feedback on your answers and walk into your next interview with confidence.',
  ctaText = 'Start Practicing Free',
  ctaLink = '/auth/register',
}: FinalCTAProps) {
  return (
    <section className="py-24 px-6 lg:px-8 bg-[#f4f7fa]">
      <div className="max-w-5xl mx-auto">
        
        {/* Floating Card Container */}
        <div className="relative rounded-[48px] bg-[#1a1615] px-6 py-20 md:py-24 text-center overflow-hidden shadow-2xl">
          
          {/* Background Glows (Fixed Z-Index) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

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
            <motion.h2 variants={simpleFade} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              {headline.line1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                {headline.line2}
              </span>
            </motion.h2>

            <motion.p variants={simpleFade} className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
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
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a1615] rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
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