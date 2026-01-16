import { Metadata } from 'next'
import { Megaphone } from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  BreadcrumbSchema,
  IndustryPageContent,
} from '@/components/seo-pages'
import { getIndustryData } from '@/lib/seo/industry-data'

const data = getIndustryData('marketing')!

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
  keywords: [
    'marketing resume',
    'digital marketing resume',
    'content marketing resume',
    'social media manager resume',
    'marketing manager resume',
    'SEO resume',
    'brand manager resume',
    'advertising resume',
  ],
  openGraph: {
    title: data.title,
    description: data.metaDescription,
    type: 'article',
  },
}

export default function MarketingResumePage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Resume', url: 'https://jobfoxy.com/resume' },
          { name: 'Marketing', url: 'https://jobfoxy.com/resume/marketing' },
        ]}
      />

      <SEOPageHero
        badge="Industry Guide"
        badgeIcon={Megaphone}
        title={data.title}
        titleGradient="Marketing"
        description={data.description}
        primaryCTA={{ text: 'Build Marketing Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Marketing Examples', href: '/resume/examples' }}
        stats={data.stats.map((s) => ({ ...s, color: 'text-orange-400' }))}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
          { name: 'Marketing', href: '/resume/marketing' },
        ]}
      />

      <IndustryPageContent data={data} />
    </SEOPageLayout>
  )
}
