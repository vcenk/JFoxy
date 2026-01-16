import { Metadata } from 'next'
import { DollarSign } from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  BreadcrumbSchema,
  IndustryPageContent,
} from '@/components/seo-pages'
import { getIndustryData } from '@/lib/seo/industry-data'

const data = getIndustryData('finance')!

export const metadata: Metadata = {
  title: data.title,
  description: data.metaDescription,
  keywords: [
    'finance resume',
    'banking resume',
    'investment banking resume',
    'financial analyst resume',
    'CFA resume',
    'finance CV',
    'wealth management resume',
    'accounting resume',
  ],
  openGraph: {
    title: data.title,
    description: data.metaDescription,
    type: 'article',
  },
}

export default function FinanceResumePage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Resume', url: 'https://jobfoxy.com/resume' },
          { name: 'Finance', url: 'https://jobfoxy.com/resume/finance' },
        ]}
      />

      <SEOPageHero
        badge="Industry Guide"
        badgeIcon={DollarSign}
        title={data.title}
        titleGradient="Finance & Banking"
        description={data.description}
        primaryCTA={{ text: 'Build Finance Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Finance Examples', href: '/resume/examples' }}
        stats={data.stats.map((s) => ({ ...s, color: 'text-green-400' }))}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
          { name: 'Finance', href: '/resume/finance' },
        ]}
      />

      <IndustryPageContent data={data} />
    </SEOPageLayout>
  )
}
