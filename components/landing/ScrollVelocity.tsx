'use client'

import { motion } from 'framer-motion'

interface ScrollVelocityProps {
  children?: string[]
  baseVelocity?: number
  className?: string
}

const defaultPhrases = [
  'STAR Framework',
  'Voice Coaching',
  'Mock Interviews', 
  'Resume Analysis',
  'AI Feedback',
  'Confidence Builder',
  'Career Growth',
  'Interview Prep',
]

export function ScrollVelocity({
  children = defaultPhrases, 
  // CHANGED: Increased from 20 to 50. 
  // Since this controls 'duration', Higher Number = Slower Speed.
  baseVelocity = 100,
  className = ''
}: ScrollVelocityProps) {
  const phrases = children.length > 0 ? children : defaultPhrases
  
  return (
    <div className={`relative overflow-hidden py-3 ${className}`}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />

      {/* Single row - moves right */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex items-center gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: baseVelocity,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-8">
              {phrases.map((phrase, i) => (
                <span
                  key={i}
                  className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0f0f0f]/60 tracking-tight whitespace-nowrap"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {phrase}
                  <span className="mx-5 text-violet-500">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default ScrollVelocity