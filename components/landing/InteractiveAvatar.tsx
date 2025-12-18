'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Phone, Video, MoreHorizontal, User } from 'lucide-react'
import heroAvatar from '../assets/hero_avatar.png'

export function InteractiveAvatar() {
  const [isTalking, setIsTalking] = useState(true)
  
  // Simulate natural conversation rhythm (pause/talk)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTalking(prev => !prev)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-[420px] mx-auto perspective-1000">
      {/* Floating Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/80 backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] border border-white/40"
      >
        {/* Header / Status Bar */}
        <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Live Session</span>
          </div>
          <div className="flex gap-1">
             <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center backdrop-blur-md">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
             </div>
          </div>
        </div>

        {/* Main Avatar Display */}
        <div className="relative h-[480px] w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-blue-500/10" />
          
          {/* The Avatar Image */}
          <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full shadow-2xl p-1 bg-white">
            <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-200">
               {/* REPLACE THE SRC BELOW WITH YOUR OWN IMAGE. 
                  Unsplash placeholder used here. 
               */}
             <img 
                    src={heroAvatar.src} 
                    alt="AI Coach" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Speaking Ripple Effect */}
            <AnimatePresence>
              {isTalking && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-violet-500/30"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Name & Status */}
          <div className="mt-8 text-center z-10">
            <h3 className="text-2xl font-bold text-gray-900">Sarah (AI Coach)</h3>
            <p className="text-violet-600 font-medium text-sm mt-1">
              {isTalking ? "Speaking..." : "Listening..."}
            </p>
          </div>

          {/* Audio Waveform Visualizer */}
          <div className="h-12 flex items-center justify-center gap-1.5 mt-6 z-10">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-1.5 rounded-full ${isTalking ? 'bg-gray-800' : 'bg-gray-300'}`}
                animate={isTalking ? {
                  height: [12, Math.random() * 32 + 12, 12],
                } : { height: 8 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/40 backdrop-blur-md border-t border-white/50 z-20">
          <div className="flex items-center justify-center gap-6">
             <button className="p-4 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:scale-105 transition-transform">
                <MicOff className="w-5 h-5" />
             </button>
             
             <button className="p-5 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30 hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 fill-current rotate-[135deg]" />
             </button>

             <button className="p-4 rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
             </button>
          </div>
        </div>
      </motion.div>

      {/* Floating Dialogue Bubble (Simulated Transcript) */}
      <motion.div
         className="absolute -right-8 top-24 max-w-[200px] bg-white rounded-2xl p-4 shadow-xl border border-gray-100 z-30 hidden sm:block"
         initial={{ opacity: 0, scale: 0.8, x: -20 }}
         animate={{ opacity: 1, scale: 1, x: 0 }}
         transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs text-gray-600 leading-relaxed font-medium">
          "That's a great example using the STAR method. Let's refine the 'Result' part to be more metric-driven."
        </p>
        <div className="absolute -left-2 top-6 w-4 h-4 bg-white transform rotate-45 border-l border-b border-gray-100" />
      </motion.div>
    </div>
  )
}