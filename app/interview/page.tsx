import { Metadata } from 'next'
import Link from 'next/link'
import {
  Mic,
  Star,
  Brain,
  Target,
  Users,
  Code,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
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
  title: 'Interview Preparation Resources | Mock Interviews, STAR Method & Coaching',
  description:
    'Master your next interview with AI mock interviews, STAR method guides, and expert coaching tips. Practice with real questions and get instant feedback.',
  keywords: [
    'interview preparation',
    'mock interview',
    'STAR method',
    'behavioral interview',
    'interview coaching',
    'job interview tips',
    'interview practice',
    'AI interview',
  ],
  openGraph: {
    title: 'Interview Preparation Resources | Job Foxy',
    description:
      'Master your next interview with AI mock interviews, STAR method guides, and expert coaching.',
    type: 'website',
  },
}

const interviewTools = [
  {
    title: 'AI Mock Interviews',
    description: 'Practice with realistic AI-powered interviews and get instant feedback.',
    href: '/mock-interviews',
    icon: Mic,
    badge: 'Popular',
    badgeColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'STAR Method Guide',
    description: 'Master behavioral questions with the proven STAR technique.',
    href: '/star-method',
    icon: Star,
  },
  {
    title: 'Interview Coaching',
    description: 'AI-powered coaching for gap analysis, SWOT, and intro pitch.',
    href: '/auth/register',
    icon: Brain,
  },
  {
    title: 'Practice Sessions',
    description: 'Targeted practice on specific question types and industries.',
    href: '/auth/register',
    icon: Target,
  },
]

const interviewTypes = [
  {
    title: 'Behavioral Interviews',
    description:
      'Questions about past experiences using the STAR method. Common in most industries.',
    icon: Users,
    examples: ['Tell me about a time you led a team', 'Describe a conflict you resolved'],
  },
  {
    title: 'Technical Interviews',
    description: 'Skill-based questions testing your expertise. Common in tech and engineering.',
    icon: Code,
    examples: ['Explain your debugging process', 'Walk me through this code'],
  },
  {
    title: 'Situational Interviews',
    description: 'Hypothetical scenarios testing your problem-solving and judgment.',
    icon: MessageSquare,
    examples: ['What would you do if...', 'How would you handle...'],
  },
  {
    title: 'Case Interviews',
    description: 'Business problem-solving scenarios. Common in consulting and strategy roles.',
    icon: TrendingUp,
    examples: ['How would you increase revenue?', 'Estimate the market size for...'],
  },
]

const faqs = [
  {
    question: 'How do I prepare for a behavioral interview?',
    answer:
      "Use the STAR method (Situation, Task, Action, Result) to structure your answers. Prepare 8-10 stories from your experience that demonstrate key competencies like leadership, problem-solving, and teamwork. Practice delivering these stories concisely in 2-3 minutes each.",
  },
  {
    question: 'What are the most common interview questions?',
    answer:
      'The most common questions include: Tell me about yourself, Why do you want this job?, What are your strengths and weaknesses?, Tell me about a challenge you overcame, and Where do you see yourself in 5 years? Our mock interview tool covers all of these and more.',
  },
  {
    question: 'How can AI mock interviews help me prepare?',
    answer:
      'AI mock interviews provide realistic practice without the pressure of a real interview. You can practice unlimited times, get instant feedback on your answers, identify areas for improvement, and build confidence. Studies show candidates who practice with AI perform 40% better.',
  },
  {
    question: 'What should I research before an interview?',
    answer:
      "Research the company's mission, values, recent news, products/services, and culture. Understand the job description thoroughly. Look up your interviewers on LinkedIn. Prepare thoughtful questions to ask. This preparation shows genuine interest and helps you give relevant answers.",
  },
  {
    question: 'How do I handle interview anxiety?',
    answer:
      "Practice is the best antidote to anxiety. Use breathing techniques before the interview. Arrive early to settle in. Remember that the interviewer wants you to succeed. Reframe nervousness as excitement. Our coaching tools include specific techniques for managing interview anxiety.",
  },
]

export default function InterviewPage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Interview', url: 'https://jobfoxy.com/interview' },
        ]}
      />

      <SEOPageHero
        badge="Interview Preparation"
        badgeIcon={Mic}
        title="Master Your Next Interview"
        description="From AI-powered mock interviews to expert coaching, get all the tools and techniques you need to ace any interview."
        primaryCTA={{ text: 'Start Practicing', href: '/auth/register' }}
        secondaryCTA={{ text: 'Learn STAR Method', href: '/star-method' }}
        stats={[
          { value: '40%', label: 'Better Performance', color: 'text-emerald-600' },
          { value: '1000+', label: 'Practice Questions', color: 'text-purple-600' },
          { value: '10+', label: 'Interview Types', color: 'text-blue-600' },
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Interview', href: '/interview' },
        ]}
      />

      {/* Interview Tools Section */}
      <FeatureGrid
        title="Interview Preparation Tools"
        subtitle="Everything you need to walk into your interview with confidence"
        features={interviewTools}
        columns={4}
      />

      {/* Interview Types Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">Types of Interviews</h2>
            <p className="text-lg text-[#6b6b6b] max-w-2xl mx-auto">
              Different roles require different interview styles. Learn what to expect and how to
              prepare.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {interviewTypes.map((type, index) => {
              const Icon = type.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-colors shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#1a1615] mb-2">{type.title}</h3>
                      <p className="text-[#6b6b6b] mb-4">{type.description}</p>
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-[#1a1615]">
                          Example questions:
                        </span>
                        <ul className="space-y-1">
                          {type.examples.map((example, i) => (
                            <li
                              key={i}
                              className="text-sm text-[#6b6b6b] flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-blue-600" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Tips Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1615] mb-6">
                Interview Success Starts with Preparation
              </h2>
              <p className="text-lg text-[#6b6b6b] mb-6">
                The most successful candidates aren't necessarily the most qualified—they're the
                most prepared. Our tools help you practice until your best answers become second
                nature.
              </p>
              <ul className="space-y-4">
                {[
                  'Practice answers until they feel natural, not rehearsed',
                  'Get feedback on your delivery, not just your content',
                  'Build confidence through repeated exposure',
                  'Learn to handle unexpected questions with grace',
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a1615]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-[#1a1615]">The Job Foxy Advantage</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'AI Mock Interviews', detail: 'Practice 24/7' },
                  { label: 'Instant Feedback', detail: 'Improve in real-time' },
                  { label: 'STAR Method Coaching', detail: 'Structure perfect answers' },
                  { label: 'Industry-Specific Prep', detail: 'Tailored questions' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white/80 rounded-lg"
                  >
                    <span className="font-medium text-[#1a1615]">{item.label}</span>
                    <span className="text-sm text-blue-600">{item.detail}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/register"
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1615] hover:bg-black text-white font-semibold rounded-xl transition-colors"
              >
                Start Free Practice
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Interview Preparation FAQ"
        subtitle="Common questions about interview preparation"
        faqs={faqs}
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Ace Your Next Interview?"
        description="Join thousands of job seekers who've landed their dream jobs after practicing with Job Foxy."
        primaryCTA={{ text: 'Start Practicing Free', href: '/auth/register' }}
        secondaryCTA={{ text: 'Learn STAR Method', href: '/star-method' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
