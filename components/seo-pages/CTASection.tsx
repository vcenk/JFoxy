import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTASectionProps {
  title: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  variant?: 'default' | 'gradient'
}

export function CTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'default',
}: CTASectionProps) {
  const bgClass =
    variant === 'gradient'
      ? 'bg-gradient-to-r from-purple-900/50 to-violet-900/50'
      : 'bg-white/5'

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`${bgClass} border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">{description}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                {primaryCTA.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
