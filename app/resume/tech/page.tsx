import { Metadata } from 'next'
import { Code } from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  BreadcrumbSchema,
  IndustryPageContent,
} from '@/components/seo-pages'
import { getIndustryData } from '@/lib/seo/industry-data'

const data = getIndustryData('tech')!

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
  keywords: [
    'tech resume',
    'software engineer resume',
    'developer resume',
    'IT resume',
    'programming resume',
    'tech industry CV',
    'software developer resume',
    'coding resume',
  ],
  openGraph: {
    title: data.title,
    description: data.metaDescription,
    type: 'article',
  },
}

export default function TechResumePage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Resume', url: 'https://jobfoxy.com/resume' },
          { name: 'Tech', url: 'https://jobfoxy.com/resume/tech' },
        ]}
      />

      <SEOPageHero
        badge="Industry Guide"
        badgeIcon={Code}
        title={data.title}
        titleGradient="Tech & Software"
        description={data.description}
        primaryCTA={{ text: 'Build Tech Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Tech Examples', href: '/resume/examples' }}
        stats={data.stats.map((s) => ({ ...s, color: 'text-blue-400' }))}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
          { name: 'Tech', href: '/resume/tech' },
        ]}
      />

      <IndustryPageContent data={data} />
    </SEOPageLayout>
  )
}
