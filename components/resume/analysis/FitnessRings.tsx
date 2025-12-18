// components/resume/analysis/FitnessRings.tsx
'use client'

import { motion } from 'framer-motion'

interface RingProps {
  score: number
  color: string
  label: string
  icon?: React.ReactNode
  delay?: number
}

const Ring = ({ score, color, label, icon, delay = 0 }: RingProps) => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress Circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, delay, ease: "easeOut" }}
            cx="64"
            cy="64"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Content */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-white">{score}%</span>
          {icon && <div className="text-white/60">{icon}</div>}
        </div>
      </div>
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
  )
}

interface FitnessRingsProps {
  atsScore: number
  matchScore: number
  skillsScore: number
}

export function FitnessRings({ atsScore, matchScore, skillsScore }: FitnessRingsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8">
      <Ring 
        score={atsScore} 
        color="#6C47FF" // Purple
        label="ATS Score" 
        delay={0.2}
      />
      <Ring 
        score={matchScore} 
        color="#3A8CFF" // Electric Blue
        label="Job Match" 
        delay={0.4}
      />
      <Ring 
        score={skillsScore} 
        color="#1BC5A0" // Teal/Green
        label="Skills Fit" 
        delay={0.6}
      />
    </div>
  )
}
