import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  Layout,
  Sparkles,
  Wand2,
  Code,
  DollarSign,
  Heart,
  Megaphone,
  ArrowRight,
  CheckCircle,
  Target,
} from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  FeatureGrid,
  FAQSection,
  CTASection,
  BreadcrumbSchema,
} from '@/components/seo-pages'

export const metadata: Metadata = {
  title: 'Resume Resources & Tools | Free Templates, Examples & AI Builder',
  description:
    'Everything you need to create a winning resume. Browse professional templates, real examples, power words, and use our AI resume builder to land your dream job.',
  keywords: [
    'resume builder',
    'resume templates',
    'resume examples',
    'ATS resume',
    'professional resume',
    'resume writing',
    'CV builder',
    'job application',
  ],
  openGraph: {
    title: 'Resume Resources & Tools | Job Foxy',
    description:
      'Everything you need to create a winning resume. Templates, examples, power words, and AI resume builder.',
    type: 'website',
  },
}

const resumeTools = [
  {
    title: 'Resume Templates',
    description: 'Professional, ATS-optimized templates designed to get past automated screening.',
    href: '/resume/templates',
    icon: Layout,
    badge: 'Popular',
    badgeColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Resume Examples',
    description: 'Real resume examples from professionals in various industries and roles.',
    href: '/resume/examples',
    icon: FileText,
  },
  {
    title: 'Power Words & Synonyms',
    description: '900+ action verbs and synonyms to make your resume stand out.',
    href: '/resume-synonyms',
    icon: Sparkles,
  },
  {
    title: 'AI Resume Builder',
    description: 'Create a tailored, ATS-optimized resume in minutes with AI assistance.',
    href: '/auth/register',
    icon: Wand2,
    badge: 'Free',
    badgeColor: 'bg-purple-50 text-purple-600',
  },
]

const industryGuides = [
  {
    title: 'Tech & Software',
    description: 'Resume tips for developers, engineers, and IT professionals.',
    href: '/resume/tech',
    icon: Code,
  },
  {
    title: 'Finance & Banking',
    description: 'Resume strategies for finance, accounting, and banking roles.',
    href: '/resume/finance',
    icon: DollarSign,
  },
  {
    title: 'Healthcare',
    description: 'Resume guidance for medical, nursing, and healthcare careers.',
    href: '/resume/healthcare',
    icon: Heart,
  },
  {
    title: 'Marketing',
    description: 'Resume tips for marketing, advertising, and communications.',
    href: '/resume/marketing',
    icon: Megaphone,
  },
]

const faqs = [
  {
    question: 'What makes a resume ATS-friendly?',
    answer:
      'An ATS-friendly resume uses standard formatting, clear section headings, relevant keywords from the job description, and avoids complex graphics or tables that automated systems cannot parse. Our templates are specifically designed to pass ATS screening.',
  },
  {
    question: 'How long should my resume be?',
    answer:
      'For most professionals, a one-page resume is ideal if you have less than 10 years of experience. For senior professionals with extensive experience, two pages are acceptable. Focus on relevance over length.',
  },
  {
    question: 'Should I customize my resume for each job application?',
    answer:
      'Yes, tailoring your resume to each job description significantly increases your chances of getting interviews. Focus on matching keywords and highlighting relevant experience for each specific role.',
  },
  {
    question: 'What are the most important resume sections?',
    answer:
      'The essential sections are: Contact Information, Professional Summary, Work Experience, Skills, and Education. Depending on your field, you may also include Certifications, Projects, or Publications.',
  },
  {
    question: 'How often should I update my resume?',
    answer:
      'Update your resume every 3-6 months or whenever you achieve something significant like a promotion, new certification, or major project completion. Keep it current even when not actively job searching.',
  },
]

export default function ResumePage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Resume', url: 'https://jobfoxy.com/resume' },
        ]}
      />

      <SEOPageHero
        badge="Resume Resources"
        badgeIcon={FileText}
        title="Everything You Need for the Perfect Resume"
        description="From professional templates to AI-powered writing assistance, we have all the tools to help you create a resume that gets interviews."
        primaryCTA={{ text: 'Build Your Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'Browse Templates', href: '/resume/templates' }}
        stats={[
          { value: '50+', label: 'Resume Templates', color: 'text-purple-600' },
          { value: '900+', label: 'Power Words', color: 'text-emerald-600' },
          { value: '100+', label: 'Resume Examples', color: 'text-blue-600' },
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
        ]}
      />

      {/* Resume Tools Section */}
      <FeatureGrid
        title="Resume Tools & Resources"
        subtitle="Everything you need to create a professional, ATS-optimized resume"
        features={resumeTools}
        columns={4}
      />

      {/* Why Resume Matters Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1615] mb-6">
                Your Resume is Your First Impression
              </h2>
              <p className="text-lg text-[#6b6b6b] mb-6">
                Recruiters spend an average of just 7 seconds scanning a resume. In that brief
                moment, your resume needs to communicate your value, match the job requirements, and
                stand out from hundreds of other applicants.
              </p>
              <ul className="space-y-4">
                {[
                  '75% of resumes are rejected by ATS before a human sees them',
                  'Tailored resumes are 40% more likely to get interviews',
                  'Strong action verbs increase perceived competence by 30%',
                ].map((stat, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a1615]">{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-[#1a1615]">Resume Success Formula</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'ATS-Optimized Format', value: 'Pass automated screening' },
                  { label: 'Relevant Keywords', value: 'Match job description' },
                  { label: 'Quantified Achievements', value: 'Show measurable impact' },
                  { label: 'Professional Design', value: 'Make a great impression' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium text-[#1a1615]">{item.label}</span>
                    <span className="text-sm text-[#6b6b6b]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Guides Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">Industry-Specific Resume Guides</h2>
            <p className="text-lg text-[#6b6b6b] max-w-2xl mx-auto">
              Every industry has different expectations. Get tailored advice for your field.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryGuides.map((guide, index) => {
              const Icon = guide.icon
              return (
                <Link
                  key={index}
                  href={guide.href}
                  className="group bg-white hover:bg-gray-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1615] mb-2">{guide.title}</h3>
                  <p className="text-sm text-[#6b6b6b] mb-4">{guide.description}</p>
                  <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                    <span>Read guide</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Resume FAQ"
        subtitle="Common questions about creating effective resumes"
        faqs={faqs}
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Your Perfect Resume?"
        description="Join thousands of job seekers who've landed interviews with Job Foxy's AI-powered resume builder."
        primaryCTA={{ text: 'Start Building Free', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Templates', href: '/resume/templates' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
