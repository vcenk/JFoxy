'use client'

import { motion } from 'framer-motion'

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#fafafa]" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e5e5 1px, transparent 1px),
            linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />
      
      {/* Gradient mesh / blobs */}
      <div className="absolute inset-0">
        {/* Top-left blob - Blue/Purple */}
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.4) 0%, rgba(196, 181, 253, 0.2) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Top-right blob - Cyan/Teal */}
        <motion.div
          className="absolute -top-[10%] -right-[15%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(153, 246, 228, 0.35) 0%, rgba(147, 197, 253, 0.15) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        
        {/* Center blob - Purple/Pink */}
        <motion.div
          className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(251, 207, 232, 0.3) 0%, rgba(196, 181, 253, 0.15) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
        
        {/* Bottom blob - Orange/Yellow */}
        <motion.div
          className="absolute -bottom-[20%] left-[30%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(254, 215, 170, 0.3) 0%, rgba(253, 186, 116, 0.1) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        
        {/* Accent blob - Green */}
        <motion.div
          className="absolute bottom-[20%] -right-[10%] w-[35%] h-[35%] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(167, 243, 208, 0.25) 0%, rgba(153, 246, 228, 0.1) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, 25, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
      </div>
      
      {/* Noise texture overlay for subtle grain effect */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}

export default Background
