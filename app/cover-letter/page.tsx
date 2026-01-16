import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lightbulb,
  Target,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  FAQSection,
  CTASection,
  BreadcrumbSchema,
} from '@/components/seo-pages'

export const metadata: Metadata = {
  title: 'How to Write a Cover Letter: Complete Guide with Examples & Templates',
  description:
    'Master cover letter writing with our comprehensive guide. Learn the perfect structure, see real examples, and use our AI cover letter generator to land more interviews.',
  keywords: [
    'cover letter',
    'cover letter examples',
    'how to write a cover letter',
    'cover letter template',
    'job application letter',
    'cover letter tips',
    'professional cover letter',
    'cover letter format',
  ],
  openGraph: {
    title: 'How to Write a Cover Letter | Job Foxy',
    description:
      'Complete guide to writing compelling cover letters with examples and templates.',
    type: 'article',
  },
}

const coverLetterStructure = [
  {
    section: 'Opening',
    percentage: '15%',
    description: 'Hook the reader with a compelling opening that shows enthusiasm and relevance.',
    tips: [
      'Mention the specific role and company',
      'Lead with your strongest qualification or achievement',
      'Avoid generic openings like "I am writing to apply..."',
    ],
    example: 'When I saw the Product Manager role at Acme Corp, I immediately thought of my experience scaling the checkout flow at TechStart, which increased conversion by 34%.',
  },
  {
    section: 'Body',
    percentage: '70%',
    description: 'Connect your experience to the job requirements with specific examples.',
    tips: [
      'Address 2-3 key requirements from the job description',
      'Use specific achievements with numbers',
      'Show you understand the company\'s challenges',
    ],
    example: 'In my current role at TechStart, I led cross-functional teams of 8+ members to ship products used by 500K+ users. My experience with agile methodologies and data-driven decision making aligns directly with your need for someone to drive product strategy.',
  },
  {
    section: 'Closing',
    percentage: '15%',
    description: 'End with a clear call to action and express genuine interest.',
    tips: [
      'Reiterate your interest in the specific role',
      'Include a clear call to action',
      'Thank them for their time',
    ],
    example: 'I would love the opportunity to discuss how my product leadership experience could benefit Acme Corp. I am available for an interview at your convenience and look forward to hearing from you.',
  },
]

const dosAndDonts = {
  dos: [
    'Customize for each application',
    'Address the hiring manager by name',
    'Keep it to one page (3-4 paragraphs)',
    'Match keywords from the job description',
    'Quantify your achievements',
    'Show enthusiasm for the specific company',
    'Proofread multiple times',
  ],
  donts: [
    'Use a generic template without customizing',
    'Repeat your resume word-for-word',
    'Write more than one page',
    'Use "To Whom It May Concern"',
    'Focus on what you want from the job',
    'Include salary expectations (unless asked)',
    'Forget to include your contact information',
  ],
}

const faqs = [
  {
    question: 'Do I really need a cover letter?',
    answer:
      'Yes, in most cases. Even when listed as "optional," submitting a well-written cover letter can set you apart from candidates who skip it. Studies show that 83% of hiring managers consider cover letters when making hiring decisions.',
  },
  {
    question: 'How long should a cover letter be?',
    answer:
      'A cover letter should be one page maximum, typically 3-4 paragraphs or 250-400 words. Hiring managers appreciate brevity—get to the point quickly and make every sentence count.',
  },
  {
    question: 'Should I address the cover letter to a specific person?',
    answer:
      'Yes, whenever possible. Research the hiring manager\'s name on LinkedIn or the company website. If you truly cannot find it, "Dear Hiring Manager" or "Dear [Department] Team" are acceptable alternatives.',
  },
  {
    question: 'What\'s the difference between a cover letter and a resume?',
    answer:
      'Your resume is a factual summary of your experience. Your cover letter tells a story—it explains WHY you\'re interested in this specific role and HOW your experience makes you the ideal candidate. Don\'t just repeat your resume.',
  },
  {
    question: 'Should I mention salary expectations in my cover letter?',
    answer:
      'Only if explicitly requested in the job posting. Otherwise, leave salary discussions for later in the interview process when you have more leverage and information about the role.',
  },
]

export default function CoverLetterPage() {
  // HowTo Schema for SEO
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Write a Cover Letter',
    description: 'Learn to write compelling cover letters that get interviews.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Research the Company',
        text: 'Learn about the company culture, recent news, and the specific role requirements.',
      },
      {
        '@type': 'HowToStep',
        name: 'Write a Compelling Opening',
        text: 'Hook the reader with enthusiasm and your strongest relevant qualification.',
      },
      {
        '@type': 'HowToStep',
        name: 'Connect Your Experience',
        text: 'Address 2-3 key job requirements with specific examples and achievements.',
      },
      {
        '@type': 'HowToStep',
        name: 'Close with a Call to Action',
        text: 'Express genuine interest and provide clear next steps.',
      },
      {
        '@type': 'HowToStep',
        name: 'Proofread and Polish',
        text: 'Review for errors, ensure proper formatting, and keep it to one page.',
      },
    ],
  }

  return (
    <SEOPageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Cover Letter', url: 'https://jobfoxy.com/cover-letter' },
        ]}
      />

      <SEOPageHero
        badge="Writing Guide"
        badgeIcon={FileText}
        title="How to Write a Winning Cover Letter"
        titleGradient="Winning Cover Letter"
        description="Learn the structure, see real examples, and use our AI assistant to craft cover letters that get interviews."
        primaryCTA={{ text: 'Try AI Cover Letter', href: '/auth/register' }}
        secondaryCTA={{ text: 'See Examples', href: '#structure' }}
        stats={[
          { value: '83%', label: 'Hiring Managers Read Them', color: 'text-emerald-600' },
          { value: '250-400', label: 'Ideal Word Count', color: 'text-purple-600' },
          { value: '1 Page', label: 'Maximum Length', color: 'text-blue-600' },
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Cover Letter', href: '/cover-letter' },
        ]}
      />

      {/* Why Cover Letters Matter */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-[#1a1615] mb-4">
                  Why Cover Letters Still Matter
                </h2>
                <p className="text-[#6b6b6b] mb-4">
                  In a world of online applications and ATS systems, cover letters remain one of the
                  few opportunities to show your personality, explain career transitions, and
                  demonstrate genuine interest in a specific role.
                </p>
                <p className="text-[#6b6b6b]">
                  A well-crafted cover letter can be the difference between your resume being
                  skimmed and being seriously considered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Letter Structure */}
      <section id="structure" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">The Perfect Structure</h2>
            <p className="text-lg text-[#6b6b6b]">
              Every great cover letter follows this proven framework
            </p>
          </div>

          <div className="space-y-8">
            {coverLetterStructure.map((section, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-purple-200 transition-colors shadow-sm"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-purple-600">
                        {section.percentage}
                      </span>
                      <h3 className="text-2xl font-bold text-[#1a1615]">{section.section}</h3>
                    </div>
                    <p className="text-[#6b6b6b] mb-4">{section.description}</p>
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                          <span className="text-sm text-[#6b6b6b]">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 h-full">
                      <h4 className="text-sm font-semibold text-[#6b6b6b] uppercase tracking-wider mb-3">
                        Example
                      </h4>
                      <p className="text-[#1a1615] italic leading-relaxed">
                        &ldquo;{section.example}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a1615] text-center mb-12">
            Cover Letter Do&apos;s and Don&apos;ts
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-[#1a1615]">Do</h3>
              </div>
              <ul className="space-y-4">
                {dosAndDonts.dos.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a1615]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-[#1a1615]">Don&apos;t</h3>
              </div>
              <ul className="space-y-4">
                {dosAndDonts.donts.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a1615]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Cover Letter Tool */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">
              Write Cover Letters Faster with AI
            </h2>
            <p className="text-lg text-[#6b6b6b] mb-8 max-w-2xl mx-auto">
              Our AI cover letter tool analyzes the job description, matches it with your
              experience, and generates a personalized cover letter in seconds. Then customize it
              to make it your own.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1615] text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-lg"
              >
                Try AI Cover Letter Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-[#1a1615] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Build Your Resume First
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1a1615] mb-8">Related Resources</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'Resume Builder',
                description: 'Create an ATS-optimized resume to pair with your cover letter.',
                href: '/resume',
              },
              {
                icon: Target,
                title: 'Interview Prep',
                description: 'Prepare for the interview once your application gets noticed.',
                href: '/interview',
              },
              {
                icon: BookOpen,
                title: 'Career Blog',
                description: 'More tips on job applications, interviews, and career growth.',
                href: '/blog',
              },
            ].map((resource, index) => {
              const Icon = resource.icon
              return (
                <Link
                  key={index}
                  href={resource.href}
                  className="group bg-white hover:bg-gray-50 border border-gray-100 hover:border-purple-200 rounded-xl p-6 transition-all shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1615] mb-2 group-hover:text-purple-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-[#6b6b6b]">{resource.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Cover Letter FAQ"
        subtitle="Common questions about cover letter writing"
        faqs={faqs}
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Write Your Cover Letter?"
        description="Use our AI-powered cover letter generator to create a compelling letter in minutes."
        primaryCTA={{ text: 'Generate Cover Letter', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Resume Templates', href: '/resume/templates' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
