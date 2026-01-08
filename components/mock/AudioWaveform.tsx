// components/mock/AudioWaveform.tsx
// Animated audio waveform visualization

'use client'

import { useEffect, useRef } from 'react'

interface AudioWaveformProps {
    isActive: boolean
    audioLevel?: number
    color?: 'purple' | 'blue' | 'white' | 'green' | 'orange'
    barCount?: number
    className?: string
}

export default function AudioWaveform({
    isActive,
    audioLevel = 0,
    color = 'purple',
    barCount = 24,
    className = ''
}: AudioWaveformProps) {
    const barsRef = useRef<HTMLDivElement[]>([])

    const colorClasses = {
        purple: 'bg-purple-500',
        blue: 'bg-blue-500',
        white: 'bg-white/80',
        green: 'bg-green-500',
        orange: 'bg-orange-500'
    }

    useEffect(() => {
        if (!isActive) return

        let animationId: number
        const animate = () => {
            barsRef.current.forEach((bar, i) => {
                if (bar) {
                    // Create organic wave pattern
                    const time = Date.now() / 1000
                    const wave = Math.sin(time * 3 + i * 0.4) * 0.3
                    const noise = Math.random() * 0.2
                    const level = audioLevel > 0 ? audioLevel : 0.3 + wave + noise
                    const height = Math.max(8, Math.min(100, level * 100))
                    bar.style.height = `${height}%`
                }
            })
            animationId = requestAnimationFrame(animate)
        }

        animate()
        return () => cancelAnimationFrame(animationId)
    }, [isActive, audioLevel])

    return (
        <div className={`flex items-center justify-center gap-[2px] h-12 ${className}`}>
            {Array.from({ length: barCount }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => { if (el) barsRef.current[i] = el }}
                    className={`
            w-1 rounded-full transition-all duration-75
            ${colorClasses[color]}
            ${isActive ? 'opacity-100' : 'opacity-30'}
          `}
                    style={{
                        height: isActive ? '30%' : '8%',
                        transitionDelay: `${i * 10}ms`
                    }}
                />
            ))}
        </div>
    )
}
