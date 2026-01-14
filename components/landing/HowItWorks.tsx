'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link as LinkIcon, BrainCircuit, Mic, FileText, CheckCircle2 } from 'lucide-react'

// --- ANIMATED VISUALS ---

const URLVisual = () => (
  <div className="w-full max-w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-hidden">
    <div className="flex gap-1.5 mb-3">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
    </div>
    <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2 mb-4">
      <LinkIcon className="w-3 h-3 text-gray-400" />
      <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden relative">
         <motion.div 
           className="absolute top-0 left-0 bottom-0 bg-blue-500 rounded-full"
           initial={{ width: 0 }}
           whileInView={{ width: "100%" }}
           transition={{ duration: 1.5, ease: "easeInOut" }}
         />
      </div>
    </div>
    <div className="space-y-2">
       <div className="h-2 w-full bg-gray-100 rounded-full" />
       <div className="h-2 w-[80%] bg-gray-100 rounded-full" />
       <div className="h-2 w-[90%] bg-gray-100 rounded-full" />
    </div>
  </div>
)

const AnalysisVisual = () => (
  <div className="w-full max-w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-4 relative">
     <motion.div 
        className="absolute top-1/2 left-0 right-0 h-[2px] bg-emerald-400/50 blur-[2px]"
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
     />
     <div className="space-y-3">
        <div className="flex justify-between">
           <div className="h-2 w-20 bg-gray-200 rounded-full" />
           <div className="h-2 w-8 bg-emerald-100 rounded-full" />
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full" />
        <div className="h-2 w-full bg-gray-100 rounded-full" />
        <div className="flex gap-2 mt-2">
           <span className="px-2 py-1 bg-blue-50 text-[8px] text-blue-600 rounded">Leadership</span>
           <span className="px-2 py-1 bg-purple-50 text-[8px] text-purple-600 rounded">Strategy</span>
        </div>
     </div>
  </div>
)

const AudioVisual = () => (
  <div className="w-full max-w-[280px] h-[140px] bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-1">
     {[...Array(8)].map((_, i) => (
        <motion.div 
          key={i}
          className="w-3 bg-orange-400 rounded-full"
          animate={{ height: [20, Math.random() * 60 + 20, 20] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
        />
     ))}
  </div>
)

const ReportVisual = () => (
  <div className="w-full max-w-[280px] bg-white rounded-xl shadow-sm border border-gray-100 p-4">
     <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-gray-400">SCORE</span>
        <span className="text-xl font-bold text-violet-600">92/100</span>
     </div>
     <div className="space-y-3">
        <div className="flex items-center gap-3">
           <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
           </div>
           <div className="h-2 w-32 bg-gray-100 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
           <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-green-600" />
           </div>
           <div className="h-2 w-24 bg-gray-100 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
           <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
           </div>
           <div className="h-2 w-28 bg-gray-100 rounded-full" />
        </div>
     </div>
  </div>
)

const STEPS = [
  {
    title: "1. Paste Job URL",
    description: "Simply paste the link to the job posting. We don't just read it—we decode what the hiring manager is actually looking for.",
    icon: LinkIcon,
    color: "bg-blue-500",
    lightColor: "bg-blue-50 text-blue-600",
    Visual: URLVisual
  },
  {
    title: "2. Smart Breakdown",
    description: "Our AI analyzes keywords, skills, and culture fit to generate a tailored interview script and gap analysis for your resume.",
    icon: BrainCircuit,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 text-emerald-600",
    Visual: AnalysisVisual
  },
  {
    title: "3. Voice Practice",
    description: "Answer realistic questions out loud. The AI listens to your clarity, structure (STAR method), and confidence in real-time.",
    icon: Mic,
    color: "bg-orange-500",
    lightColor: "bg-orange-50 text-orange-600",
    Visual: AudioVisual
  },
  {
    title: "4. Actionable Insights",
    description: "No generic scores. Get specific feedback on what you said, what you missed, and exactly how to say it better next time.",
    icon: FileText,
    color: "bg-violet-500",
    lightColor: "bg-violet-50 text-violet-600",
    Visual: ReportVisual
  },
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Create a height value for the progress line
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"])

  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider mb-4"
          >
            Workflow
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#1a1615] tracking-tight mb-4"
          >
            From Application to Offer
          </motion.h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A simple, guided path to mastering your interview preparation.
          </p>
        </div>

        {/* --- VERTICAL SCROLL TIMELINE --- */}
        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          
          {/* The Central Line Background */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-100 -translate-x-1/2" />
          
          {/* The Moving Progress Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[28px] md:left-1/2 top-0 w-[2px] bg-[#1a1615] -translate-x-1/2 origin-top z-10"
          />

          <div className="space-y-24 md:space-y-32">
            {STEPS.map((step, index) => (
              <StepItem key={index} step={step} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function StepItem({ step, index }: { step: any, index: number }) {
  const isEven = index % 2 === 0
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative flex items-center md:justify-between ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-0`}
    >
      {/* 1. CONTENT SIDE (Desktop) */}
      <div className={`hidden md:block w-[42%] ${isEven ? 'text-right' : 'text-left'}`}>
        <h3 className="text-2xl font-bold text-[#1a1615] mb-3">{step.title}</h3>
        <p className="text-gray-500 leading-relaxed">{step.description}</p>
      </div>

      {/* 2. CENTER ICON (Timeline Node) */}
      <div className="relative z-20 flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-white border-4 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center">
           <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${step.lightColor}`}>
              <step.icon className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* 3. MOBILE CONTENT (Shows on right for all) */}
      <div className="block md:hidden w-[calc(100%-70px)] pt-2 pb-8">
        <h3 className="text-xl font-bold text-[#1a1615] mb-2">{step.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
        <div className="mt-6">
           <step.Visual />
        </div>
      </div>

      {/* 4. OPPOSITE SIDE (Animated Visual for Desktop) */}
      <div className={`hidden md:flex w-[42%] ${isEven ? 'justify-start' : 'justify-end'}`}>
         <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
         >
            <step.Visual />
         </motion.div>
      </div>

    </motion.div>
  )
}