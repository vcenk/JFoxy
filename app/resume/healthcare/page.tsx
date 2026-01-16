import { Metadata } from 'next'
import { Heart } from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  BreadcrumbSchema,
  IndustryPageContent,
} from '@/components/seo-pages'
import { getIndustryData } from '@/lib/seo/industry-data'

const data = getIndustryData('healthcare')!

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
  keywords: [
    'healthcare resume',
    'nursing resume',
    'RN resume',
    'medical resume',
    'nurse practitioner resume',
    'clinical resume',
    'hospital resume',
    'patient care resume',
  ],
  openGraph: {
    title: data.title,
    description: data.metaDescription,
    type: 'article',
  },
}

export default function HealthcareResumePage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Resume', url: 'https://jobfoxy.com/resume' },
          { name: 'Healthcare', url: 'https://jobfoxy.com/resume/healthcare' },
        ]}
      />

      <SEOPageHero
        badge="Industry Guide"
        badgeIcon={Heart}
        title={data.title}
        titleGradient="Healthcare"
        description={data.description}
        primaryCTA={{ text: 'Build Healthcare Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Healthcare Examples', href: '/resume/examples' }}
        stats={data.stats.map((s) => ({ ...s, color: 'text-red-400' }))}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
          { name: 'Healthcare', href: '/resume/healthcare' },
        ]}
      />

      <IndustryPageContent data={data} />
    </SEOPageLayout>
  )
}
