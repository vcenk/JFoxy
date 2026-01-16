import { Metadata } from 'next'
import Link from 'next/link'
import {
  Mic,
  MessageSquare,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Play,
  Zap,
  Brain,
} from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  FAQSection,
  CTASection,
  BreadcrumbSchema,
} from '@/components/seo-pages'

export const metadata: Metadata = {
  title: 'AI Mock Interviews | Practice with Realistic Questions & Get Instant Feedback',
  description:
    'Practice interviews with AI-powered mock sessions. Get real-time feedback on your answers, STAR method structure, and personalized improvement suggestions.',
  keywords: [
    'AI mock interview',
    'interview practice',
    'mock interview online',
    'interview simulation',
    'AI interview coach',
    'virtual interview practice',
    'interview preparation',
    'behavioral interview practice',
  ],
  openGraph: {
    title: 'AI Mock Interviews | Job Foxy',
    description: 'Practice interviews with AI and get instant, personalized feedback.',
    type: 'website',
  },
}

const features = [
  { icon: MessageSquare, title: 'Realistic Questions', description: 'Industry-specific behavioral, situational, and competency-based questions used by top companies.' },
  { icon: BarChart3, title: 'Instant Feedback', description: 'Get detailed analysis of your answers including STAR structure, clarity, and impact.' },
  { icon: Clock, title: 'Practice Anytime', description: 'Available 24/7. Practice at 2 AM or during your lunch break—the AI is always ready.' },
  { icon: Target, title: 'Personalized Focus', description: 'Target specific roles, industries, or question types based on your interview goals.' },
  { icon: Sparkles, title: 'AI-Powered Insights', description: 'Advanced language analysis identifies patterns and suggests specific improvements.' },
  { icon: Brain, title: 'Progress Tracking', description: 'See your improvement over time with detailed metrics and performance trends.' },
]

const howItWorks = [
  { step: 1, title: 'Choose Your Focus', description: 'Select your target role, industry, and the type of questions you want to practice.' },
  { step: 2, title: 'Answer Questions', description: 'Respond to realistic interview questions just like in a real interview setting.' },
  { step: 3, title: 'Get Feedback', description: 'Receive instant, detailed feedback on your answers with specific improvement suggestions.' },
]

const benefits = [
  '40% improvement in interview performance after just 5 sessions',
  'Unlimited practice sessions to build confidence',
  'No scheduling hassles—practice whenever you want',
  'Objective feedback without social awkwardness',
  'STAR method coaching built into every session',
  'Industry-specific question banks for targeted prep',
]

const faqs = [
  { question: 'How does AI mock interview practice work?', answer: 'Our AI interviewer presents realistic questions based on your target role and industry. You type or speak your answers, and the AI analyzes your response for structure, clarity, specificity, and impact. You receive instant feedback with specific suggestions for improvement.' },
  { question: 'Is AI practice as effective as practicing with a real person?', answer: 'Studies show AI mock interviews are highly effective for skill building. They offer unlimited practice, consistent feedback, and no scheduling constraints. For best results, we recommend combining AI practice with occasional human practice sessions before your actual interview.' },
  { question: 'What types of interviews can I practice for?', answer: "We support behavioral interviews, situational interviews, competency-based interviews, and general professional interviews across all industries. Whether you're interviewing for tech, finance, healthcare, or any other field, we have relevant questions." },
  { question: 'How many practice sessions do I need?', answer: 'Most users see significant improvement after 5-10 practice sessions. We recommend practicing regularly in the weeks leading up to your interview, with more intensive sessions in the final days before the real thing.' },
  { question: 'Can the AI help me if I struggle with a specific type of question?', answer: 'Absolutely! The AI identifies patterns in your responses and provides targeted coaching. If you consistently struggle with "failure" questions or quantifying results, the system will offer specific techniques and examples to improve.' },
]

export default function MockInterviewsPage() {
  return (
    <SEOPageLayout>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://jobfoxy.com' },
          { name: 'Interview', url: 'https://jobfoxy.com/interview' },
          { name: 'Mock Interviews', url: 'https://jobfoxy.com/mock-interviews' },
        ]}
      />

      <SEOPageHero
        badge="AI-Powered Practice"
        badgeIcon={Mic}
        title="Practice Interviews with AI Feedback"
        titleGradient="AI Feedback"
        description="Get unlimited mock interview practice with instant, personalized feedback. Build confidence and master your interview skills before the real thing."
        primaryCTA={{ text: 'Start Free Practice', href: '/auth/register' }}
        secondaryCTA={{ text: 'See How It Works', href: '#how-it-works' }}
        stats={[
          { value: '40%', label: 'Better Performance', color: 'text-emerald-600' },
          { value: '24/7', label: 'Always Available', color: 'text-purple-600' },
          { value: '1000+', label: 'Questions', color: 'text-blue-600' },
        ]}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Interview', href: '/interview' },
          { name: 'Mock Interviews', href: '/mock-interviews' },
        ]}
      />

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">How It Works</h2>
            <p className="text-lg text-[#6b6b6b]">Three simple steps to interview mastery</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1a1615] mb-3">{item.title}</h3>
                <p className="text-[#6b6b6b]">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1615] hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Your First Practice Session
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1615] mb-4">Powerful Features</h2>
            <p className="text-lg text-[#6b6b6b]">Everything you need for effective interview preparation</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 transition-colors shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1615] mb-2">{feature.title}</h3>
                  <p className="text-[#6b6b6b]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1615] mb-6">Why Practice with AI?</h2>
              <p className="text-lg text-[#6b6b6b] mb-8">
                Traditional interview practice has limitations. Friends go easy on you, coaches are
                expensive, and you can only schedule so many sessions. AI practice removes all
                these barriers.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-[#1a1615]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-[#1a1615]">Real Results</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#1a1615]">Interview Confidence</span>
                    <span className="text-emerald-600 font-semibold">+45%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#1a1615]">Answer Structure</span>
                    <span className="text-purple-600 font-semibold">+60%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#1a1615]">Callback Rate</span>
                    <span className="text-blue-600 font-semibold">+35%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#6b6b6b] mt-6">
                Based on user-reported improvements after 10+ practice sessions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a1615] text-center mb-12">
            AI Practice vs. Traditional Methods
          </h2>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-[#1a1615]">
              <div>Feature</div>
              <div className="text-center">AI Practice</div>
              <div className="text-center">Human Coach</div>
              <div className="text-center">Friends</div>
            </div>
            {[
              { feature: 'Available 24/7', ai: true, coach: false, friends: false },
              { feature: 'Unlimited Sessions', ai: true, coach: false, friends: false },
              { feature: 'Consistent Feedback', ai: true, coach: true, friends: false },
              { feature: 'Industry-Specific', ai: true, coach: true, friends: false },
              { feature: 'Objective Analysis', ai: true, coach: true, friends: false },
              { feature: 'Progress Tracking', ai: true, coach: true, friends: false },
              { feature: 'Cost Effective', ai: true, coach: false, friends: true },
            ].map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-4 border-b border-gray-50 last:border-0"
              >
                <div className="text-[#1a1615]">{row.feature}</div>
                <div className="text-center">
                  {row.ai ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>
                <div className="text-center">
                  {row.coach ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>
                <div className="text-center">
                  {row.friends ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection
        title="Mock Interview FAQ"
        subtitle="Common questions about AI mock interview practice"
        faqs={faqs}
      />

      <CTASection
        title="Ready to Master Your Interview?"
        description="Join thousands of job seekers who've improved their interview skills with Job Foxy's AI mock interviews."
        primaryCTA={{ text: 'Start Free Practice', href: '/auth/register' }}
        secondaryCTA={{ text: 'Learn STAR Method', href: '/star-method' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
