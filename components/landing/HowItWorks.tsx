'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Link as LinkIcon, BrainCircuit, Mic, FileText, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    title: "Paste Job URL",
    description: "Simply paste the link to the job posting you are targeting. Our AI scrapes the description to understand the role's requirements.",
    icon: LinkIcon,
  },
  {
    title: "AI Analysis",
    description: "We analyze the keywords, required skills, and company culture to generate a tailored interview script just for you.",
    icon: BrainCircuit,
  },
  {
    title: "Voice Practice",
    description: "Answer the generated questions out loud. Our AI listens to your voice, pacing, and tone in real-time.",
    icon: Mic,
  },
  {
    title: "Get Feedback",
    description: "Receive an instant score with actionable feedback on how to improve your answer using the STAR method.",
    icon: FileText,
  },
]

// Animated Connector Component (The Stylish Arrow)
const Connector = () => {
  return (
    <div className="hidden lg:flex absolute top-1/2 -right-8 w-16 h-full items-center justify-center z-20 -translate-y-1/2 pointer-events-none transform translate-x-2">
      <div className="relative w-full h-[2px] bg-blue-100 rounded-full overflow-hidden">
        {/* Moving Blue Beam */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/2 bg-blue-500 rounded-full"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Arrow Head */}
      <div className="absolute right-0 p-1.5 bg-white border border-blue-100 rounded-full shadow-sm text-blue-500 z-10">
         <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  )
}

const StepCard = ({ step, index, total }: { step: any, index: number, total: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="relative flex-1 group"
    >
      {/* The Card Content */}
      <div className="relative h-full flex flex-col items-center text-center p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300 z-10">
        
        {/* Step Number Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-xs font-bold text-blue-600 z-20 shadow-md group-hover:scale-110 transition-transform">
          {index + 1}
        </div>

        {/* Icon Container */}
        <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mt-2 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
          <step.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
        </div>

        <h3 className="text-xl font-bold text-[#1a1615] mb-3">
          {step.title}
        </h3>
        <p className="text-[#6b6b6b] text-sm leading-relaxed max-w-[250px]">
          {step.description}
        </p>
      </div>

      {/* RENDER CONNECTOR (If not the last item) */}
      {index < total - 1 && <Connector />}
      
    </motion.div>
  );
};

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-transparent relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3 h-3" />
            Simple Process
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1615] mb-6 tracking-tight">
            From Application to <span className="text-blue-600">Offer Letter</span>
          </h2>
          <p className="text-lg text-[#6b6b6b] max-w-2xl mx-auto">
            Our AI analyzes your target job and coaches you through the process in four automated steps.
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* We use flex on desktop to allow the connectors to sit nicely between items */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
            {STEPS.map((step, index) => (
              <StepCard 
                key={step.title} 
                step={step} 
                index={index} 
                total={STEPS.length} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};