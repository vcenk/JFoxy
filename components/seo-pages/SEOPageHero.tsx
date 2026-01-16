import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface Breadcrumb {
  name: string
  href: string
}

interface SEOPageHeroProps {
  badge?: string
  badgeIcon?: LucideIcon
  title: string
  titleGradient?: string
  description: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  stats?: Array<{
    value: string
    label: string
    color?: string
  }>
  breadcrumbs?: Breadcrumb[]
}

export function SEOPageHero({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleGradient,
  description,
  primaryCTA,
  secondaryCTA,
  stats,
  breadcrumbs,
}: SEOPageHeroProps) {
  return (
    <div className="border-b border-black/5 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-[#1a1615]">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-[#2563eb] transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="text-center mb-8">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              {BadgeIcon && <BadgeIcon className="w-4 h-4 text-blue-600" />}
              <span className="text-sm font-medium text-blue-700">{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1615] mb-6">
            {titleGradient ? (
              <>
                {title.split(titleGradient)[0]}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  {titleGradient}
                </span>
                {title.split(titleGradient)[1]}
              </>
            ) : (
              title
            )}
          </h1>

          {/* Description */}
          <p className="text-xl text-[#6b6b6b] max-w-3xl mx-auto mb-8">{description}</p>

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {primaryCTA && (
                <Link
                  href={primaryCTA.href}
                  className="px-8 py-4 bg-[#1a1615] hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  {primaryCTA.text}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-[#1a1615] font-semibold rounded-xl border border-gray-200 transition-all"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"
              >
                <div className={`text-3xl font-bold ${stat.color || 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-[#6b6b6b] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
