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
    <div className={`relative overflow-hidden py-8 ${className}`}>
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none" />
      
      {/* First row - moves right */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex items-center gap-12"
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
            <div key={setIdx} className="flex items-center gap-12">
              {phrases.map((phrase, i) => (
                <span
                  key={i}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0f0f0f]/[0.4] tracking-tight whitespace-nowrap"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {phrase}
                  <span className="mx-8 text-violet-500">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Second row - moves left */}
      <div className="flex overflow-hidden mt-4">
        <motion.div
          className="flex items-center gap-12"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            x: {
              duration: baseVelocity * 1.2, // This will now take 60s (slower)
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-12">
              {[...phrases].reverse().map((phrase, i) => (
                <span
                  key={i}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f0f0f]/[0.3] tracking-tight whitespace-nowrap"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {phrase}
                  <span className="mx-8 text-blue-500">◆</span>
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