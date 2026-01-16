import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface Feature {
  title: string
  description: string
  href: string
  icon: LucideIcon
  badge?: string
  badgeColor?: string
}

interface FeatureGridProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
}

export function FeatureGrid({ title, subtitle, features, columns = 3 }: FeatureGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                href={feature.href}
                className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300"
              >
                {feature.badge && (
                  <span
                    className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${
                      feature.badgeColor || 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {feature.badge}
                  </span>
                )}

                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-white/60 mb-4">{feature.description}</p>

                <div className="flex items-center gap-2 text-purple-400 font-medium">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
