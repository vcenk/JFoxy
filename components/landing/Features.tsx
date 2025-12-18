'use client'

import { motion } from 'framer-motion'
import { Mic, ArrowRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'
import { fadeInUp, staggerContainer } from './animations'

export function Features() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8 bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto">
        
        {/* --- MAIN TITLE SECTION START --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="px-3 py-1 bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
              Powerful Features
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1615] mb-6 tracking-tight leading-[1.1]"
          >
            Everything you need to <br/>
            <span className="text-[#2563eb]">ace your interviews</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-lg text-[#6b6b6b] max-w-2xl mx-auto"
          >
            Four powerful tools that transform how you prepare, practice, and perform.
          </motion.p>
        </motion.div>
        {/* --- MAIN TITLE SECTION END --- */}


        {/* 2×2 Grid of Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* CARD 1 - Voice Mock Interviews */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.1)] transition-all duration-500 overflow-hidden border border-transparent hover:border-blue-100"
          >
            <div className="mb-8 relative h-56 rounded-[24px] bg-[#eff6ff] overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
               
               {/* Floating Player UI */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="relative bg-white rounded-[24px] p-5 shadow-lg max-w-[280px] w-full border border-blue-50"
               >
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-gray-800">Recording...</span>
                     </div>
                     <span className="text-xs font-mono text-gray-400">00:42</span>
                  </div>
                  
                  {/* Rich Waveform */}
                  <div className="flex items-center justify-center gap-1 h-10 mb-4 px-2">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-blue-500 rounded-full"
                        animate={{ height: [12, Math.random() * 32 + 8, 12] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>

                  {/* Transcript Bubble */}
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                       <Mic className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="text-[11px] leading-snug text-gray-600 bg-gray-50 rounded-tr-xl rounded-br-xl rounded-bl-xl p-2.5 w-full">
                       "I handled the conflict by scheduling a 1-on-1 meeting..."
                    </div>
                  </div>
               </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-[#1a1615] mb-3">Voice Mock Interviews</h3>
            <p className="text-[#6b6b6b] mb-8 leading-relaxed">
              Realistic, AI-led interviews where you answer aloud and get scored on delivery and confidence.
            </p>

            <div className="flex items-center text-blue-600 font-bold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
              Start Speaking <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>


          {/* CARD 2 - Resume Match */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)] transition-all duration-500 overflow-hidden border border-transparent hover:border-emerald-100"
          >
            <div className="mb-8 relative h-56 rounded-[24px] bg-[#ecfdf5] overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

               {/* Floating Analysis Card */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="relative bg-white rounded-[24px] p-5 shadow-lg max-w-[280px] w-full border border-emerald-50"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Manager</span>
                        <span className="text-xs font-bold text-gray-900">Google</span>
                     </div>
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">92% Match</span>
                  </div>
                  
                  <div className="flex gap-4 mb-4">
                     <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                           <circle cx="28" cy="28" r="24" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="150" strokeDashoffset="12" />
                        </svg>
                        <span className="absolute text-sm font-bold text-[#1a1615]">High</span>
                     </div>
                     <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                           <span className="text-gray-500">Hard Skills</span>
                           <span className="font-bold text-gray-900">8/10</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                           <div className="bg-emerald-500 h-full w-[80%] rounded-full" />
                        </div>
                        <div className="flex gap-1 flex-wrap mt-1">
                           {['React', 'Strategy', 'Agile'].map(s => (
                              <span key={s} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md">{s}</span>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-[#1a1615] mb-3">Resume & Job Match</h3>
            <p className="text-[#6b6b6b] mb-8 leading-relaxed">
              Upload your resume and job description to see match score, missing skills, and instant fixes.
            </p>

            <div className="flex items-center text-emerald-600 font-bold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
              Analyze Resume <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>


          {/* CARD 3 - STAR Coaching */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.1)] transition-all duration-500 overflow-hidden border border-transparent hover:border-orange-100"
          >
            <div className="mb-8 relative h-56 rounded-[24px] bg-[#fff7ed] overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

               {/* Chat/Feedback UI */}
               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 className="bg-white rounded-[24px] p-5 shadow-lg max-w-[280px] w-full border border-orange-50 flex flex-col gap-3"
               >
                  {/* User Message */}
                  <div className="flex gap-2 justify-end">
                     <div className="bg-orange-50 text-orange-900 text-[10px] p-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                        ...so I decided to organize a daily standup.
                     </div>
                     <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                  </div>

                  {/* AI Feedback */}
                  <div className="flex gap-2">
                     <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3 h-3 text-orange-600" />
                     </div>
                     <div className="bg-gray-50 border border-orange-100 p-2.5 rounded-2xl rounded-tl-sm w-full">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-bold text-orange-600">Action Identified</span>
                           <CheckCircle2 className="w-3 h-3 text-orange-500" />
                        </div>
                        <p className="text-[10px] text-gray-500 leading-snug">
                           Great specific action! Now, share the <span className="font-bold text-gray-700">Result</span>. What happened next?
                        </p>
                     </div>
                  </div>
               </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-[#1a1615] mb-3">STAR Method Coach</h3>
            <p className="text-[#6b6b6b] mb-8 leading-relaxed">
              Guided practice that detects if your answer follows the STAR structure for maximum impact.
            </p>

            <div className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
              Build Stories <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>


          {/* CARD 4 - Analytics */}
          <motion.div
            variants={fadeInUp}
            className="group relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(168,85,247,0.1)] transition-all duration-500 overflow-hidden border border-transparent hover:border-purple-100"
          >
            <div className="mb-8 relative h-56 rounded-[24px] bg-[#f3e8ff] overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />

               {/* Graph UI */}
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="relative bg-white rounded-[24px] p-5 shadow-lg max-w-[280px] w-full border border-purple-50"
               >
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Confidence Score</div>
                        <div className="text-2xl font-bold text-purple-600">8.5<span className="text-sm text-gray-400">/10</span></div>
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> +15%
                     </div>
                  </div>
                  
                  {/* Bars */}
                  <div className="flex items-end justify-between gap-2 h-16 border-b border-gray-100 pb-2 mb-2">
                     {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="w-full bg-purple-50 rounded-t-sm relative group-hover:bg-purple-100 transition-colors">
                           <motion.div 
                             initial={{ height: 0 }}
                             whileInView={{ height: `${h}%` }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className="absolute bottom-0 left-0 right-0 bg-purple-500 rounded-t-sm opacity-80"
                           />
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                     <span>Mon</span>
                     <span>Wed</span>
                     <span>Fri</span>
                     <span>Sun</span>
                  </div>
               </motion.div>
            </div>

            <h3 className="text-2xl font-bold text-[#1a1615] mb-3">Progress Analytics</h3>
            <p className="text-[#6b6b6b] mb-8 leading-relaxed">
              Track how your answers, clarity, and confidence scores improve over time with detailed charts.
            </p>

            <div className="flex items-center text-purple-600 font-bold text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
              View Stats <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}