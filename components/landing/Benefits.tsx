'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, BarChart3, Shield, Star, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { fadeInUp, staggerContainer } from './animations'

export function Benefits() {
  const benefits = [
    {
      icon: MessageSquare,
      title: 'Speak Confidently',
      description: 'Practice natural, conversational answers that showcase your authentic personality.'
    },
    {
      icon: BarChart3,
      title: 'Explain Business Impact',
      description: 'Learn to quantify achievements with metrics that resonate with hiring managers.'
    },
    {
      icon: Shield,
      title: 'Reduce Anxiety',
      description: 'Practice realistic interviews in a safe environment until confidence becomes default.'
    },
  ]

  return (
    <section id="benefits" className="py-24 px-6 lg:px-8 bg-[#f4f7fa] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT COLUMN - Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex flex-col gap-10 relative z-10"
          >
            {/* Headlines Group */}
            <motion.div variants={fadeInUp}>
              <div className="text-xs font-bold text-[#8a6c58] tracking-widest uppercase mb-4">
                Why EchoMind?
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1615] mb-6 tracking-tight leading-[1.1]">
                Transform how you <br/>
                perform under pressure
              </h2>
              
              <p className="text-lg text-[#6b6b6b] leading-relaxed max-w-lg">
                Don't let nerves ruin your preparation. Our AI coach helps you structure your thoughts, refine your delivery, and land the job.
              </p>
            </motion.div>

            {/* Benefits List - Dreelio Style: Clean White Cards */}
            <div className="flex flex-col gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp} 
                  whileHover={{ y: -4 }}
                  className="group flex gap-5 p-6 rounded-[24px] bg-white border border-transparent hover:border-[#e8e6e4] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#f4f1ee] flex items-center justify-center group-hover:bg-[#1a1615] transition-colors duration-300">
                    <benefit.icon className="h-5 w-5 text-[#1a1615] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a1615] text-lg mb-2">{benefit.title}</h3>
                    <p className="text-[#6b6b6b] text-[15px] leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA BUTTON */}
            <motion.div variants={fadeInUp}>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 text-[#1a1615] font-bold text-lg hover:gap-4 transition-all group"
              >
                <span>Start your transformation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN - Visual (Solid White Dashboard Card) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="relative lg:sticky lg:top-32"
          >
            {/* Soft Gradient Blob Background (Matches Dreelio) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E0E7FF] to-[#FAE8FF] rounded-[48px] transform rotate-2 scale-105" />

            {/* Main White Card */}
            <div className="relative bg-white rounded-[40px] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-[#1a1615] text-xl">Session Analysis</h3>
                <span className="px-3 py-1 bg-[#dcfce7] text-[#166534] text-xs font-bold uppercase tracking-wider rounded-full">
                  Live
                </span>
              </div>

              {/* Session Quality Score */}
              <div className="mb-10">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-semibold text-[#6b6b6b]">Overall Quality</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1a1615]">8.5</span>
                    <span className="text-lg text-[#9ca3af]">/10</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-[#f4f1ee] rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1a1615] rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-[#f4f1ee] mb-10" />

              {/* Detailed Metrics */}
              <div className="space-y-6">
                {['Confidence', 'Clarity', 'Structure', 'Pacing'].map((metric, i) => (
                  <div key={metric}>
                    <div className="flex justify-between text-sm font-bold text-[#1a1615] mb-2">
                      <span>{metric}</span>
                      <span>{75 + i * 5}%</span>
                    </div>
                    <div className="w-full bg-[#f4f1ee] rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${i === 3 ? 'bg-[#16a34a]' : 'bg-[#4b5563]'}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${75 + i * 5}%` }}
                        transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Floating "Streak" Card */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-[#1a1615] rounded-[24px] p-5 shadow-2xl flex items-center gap-4 text-white max-w-[240px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#fbbf24]" />
                </div>
                <div>
                  <div className="font-bold text-sm">5-Day Streak! 🔥</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">Top 10% this week</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Benefits