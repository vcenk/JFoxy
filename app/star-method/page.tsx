import { Metadata } from 'next'
import Link from 'next/link'
import { Star, CheckCircle, ArrowRight, Lightbulb, Target, Zap, MessageSquare } from 'lucide-react'
import {
  SEOPageLayout,
  SEOPageHero,
  FAQSection,
  CTASection,
  BreadcrumbSchema,
} from '@/components/seo-pages'

export const metadata: Metadata = {
  title: 'STAR Method Interview Guide: Master Behavioral Questions with Examples',
  description:
    'Learn the STAR method (Situation, Task, Action, Result) with 10+ real examples. Master behavioral interview questions and structure winning answers.',
  keywords: [
    'STAR method',
    'STAR interview technique',
    'behavioral interview',
    'STAR examples',
    'interview answers',
    'behavioral questions',
    'STAR format',
    'interview preparation',
  ],
  openGraph: {
    title: 'STAR Method Interview Guide | Job Foxy',
    description:
      'Master the STAR method with real examples and practice tips.',
    type: 'article',
  },
}

const starComponents = [
  {
    letter: 'S',
    title: 'Situation',
    description: 'Set the scene. Describe the context and background of your example.',
    tips: ['Be specific about when and where', 'Keep it concise (2-3 sentences)', 'Choose relevant scenarios'],
    example: 'At my previous company, our team was facing a critical product launch deadline with only 3 weeks left and a 40% backlog of features.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    letter: 'T',
    title: 'Task',
    description: 'Explain your specific responsibility or the challenge you faced.',
    tips: ['Focus on YOUR role', 'Clarify what was expected of you', 'Show the stakes involved'],
    example: 'As the project lead, I was responsible for prioritizing features and ensuring we met the deadline without sacrificing quality.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    letter: 'A',
    title: 'Action',
    description: 'Detail the specific steps YOU took to address the situation.',
    tips: ['Use "I" not "we"', 'Be specific about your actions', 'This is the longest part (50-60%)'],
    example: 'I organized daily standups, created a priority matrix, negotiated scope with stakeholders, and personally mentored two junior developers to accelerate their output.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    letter: 'R',
    title: 'Result',
    description: 'Share the outcome, ideally with quantifiable metrics.',
    tips: ['Include numbers when possible', 'Mention what you learned', 'Connect to the job you want'],
    example: 'We launched on time with 95% of planned features. The product exceeded first-quarter targets by 23%, and I was promoted to senior lead.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
  },
]

const exampleQuestions = [
  {
    question: 'Tell me about a time you showed leadership.',
    category: 'Leadership',
  },
  {
    question: 'Describe a time you failed.',
    category: 'Resilience',
  },
  {
    question: 'Give an example of handling a difficult coworker.',
    category: 'Conflict Resolution',
  },
  {
    question: 'Tell me about meeting a tight deadline.',
    category: 'Time Management',
  },
  {
    question: 'Describe adapting to a major change.',
    category: 'Adaptability',
  },
  {
    question: 'Share a goal you set and achieved.',
    category: 'Goal Setting',
  },
]

const faqs = [
  {
    question: 'When should I use the STAR method?',
    answer:
      'Use STAR for any behavioral interview question that starts with "Tell me about a time..." or "Describe a situation where..." These questions are designed to understand how you\'ve handled real situations in the past.',
  },
  {
    question: 'How long should a STAR answer be?',
    answer:
      'Aim for 1.5-2 minutes per answer. The Situation and Task should be brief (20-30 seconds combined), Action should be the longest part (60-90 seconds), and Result should be concise but impactful (20-30 seconds).',
  },
  {
    question: 'What if I don\'t have a perfect example?',
    answer:
      'Use the best example you have and focus on the actions you took and lessons learned. You can also use examples from school projects, volunteer work, or personal challenges. The key is demonstrating your problem-solving approach.',
  },
  {
    question: 'How many STAR stories should I prepare?',
    answer:
      'Prepare 8-12 diverse stories that cover different competencies: leadership, teamwork, problem-solving, conflict resolution, failure/learning, innovation, and communication. Many stories can be adapted for different questions.',
  },
  {
    question: 'Can I use the same story for multiple questions?',
    answer:
      'Yes, but adapt the focus based on the question. A story about leading a project could emphasize leadership for one question, problem-solving for another, or teamwork for a third. Just highlight different aspects.',
  },
]

export default function StarMethodPage() {
  // HowTo Schema for SEO
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Use the STAR Method for Interview Answers',
    description: 'Learn to structure compelling interview answers using the STAR method (Situation, Task, Action, Result).',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Describe the Situation',
        text: 'Set the scene by describing the context and background of your example. Be specific about when and where this happened.',
      },
      {
        '@type': 'HowToStep',
        name: 'Explain the Task',
        text: 'Clarify your specific responsibility or the challenge you faced. Focus on YOUR role and what was expected of you.',
      },
      {
        '@type': 'HowToStep',
        name: 'Detail Your Actions',
        text: 'Describe the specific steps YOU took to address the situation. Use "I" not "we" and be specific about your actions.',
      },
      {
        '@type': 'HowToStep',
        name: 'Share the Result',
        text: 'Explain the outcome, ideally with quantifiable metrics. Mention what you learned and how it connects to the job.',
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
          { name: 'Interview', url: 'https://jobfoxy.com/interview' },
          { name: 'STAR Method', url: 'https://jobfoxy.com/star-method' },
        ]}
      />

      <SEOPageHero
        badge="Interview Guide"
        badgeIcon={Star}
        title="Master the STAR Method"
        titleGradient="STAR Method"
        description="The proven framework for answering behavioral interview questions. Structure compelling stories that showcase your skills and experience."
        primaryCTA={{ text: 'Practice with AI', href: '/auth/register' }}
        secondaryCTA={{ text: 'See Examples', href: '#examples' }}
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Interview', href: '/interview' },
          { name: 'STAR Method', href: '/star-method' },
        ]}
      />

      {/* What is STAR Section */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What is the STAR Method?</h2>
            <p className="text-lg text-white/60">
              STAR is an acronym that helps you structure clear, compelling answers to behavioral
              interview questions. Each letter represents a component of your story.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            {starComponents.map((component) => (
              <div
                key={component.letter}
                className={`w-16 h-16 ${component.bgColor} ${component.borderColor} border-2 rounded-2xl flex items-center justify-center`}
              >
                <span className={`text-2xl font-bold ${component.color}`}>{component.letter}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Why STAR Works</h3>
                <p className="text-white/70">
                  Hiring managers use behavioral questions because past behavior predicts future
                  performance. The STAR method ensures your answers are structured, specific, and
                  demonstrate your capabilities with concrete evidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAR Components Deep Dive */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Breaking Down Each Component
          </h2>

          <div className="space-y-8">
            {starComponents.map((component, index) => (
              <div
                key={component.letter}
                className={`${component.bgColor} border ${component.borderColor} rounded-2xl p-8`}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`text-4xl font-bold ${component.color}`}>
                        {component.letter}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{component.title}</h3>
                    </div>
                    <p className="text-white/70 mb-4">{component.description}</p>
                    <ul className="space-y-2">
                      {component.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className={`w-4 h-4 ${component.color} flex-shrink-0 mt-1`} />
                          <span className="text-sm text-white/60">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-black/20 rounded-xl p-6">
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                        Example
                      </h4>
                      <p className="text-white italic">&ldquo;{component.example}&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Questions Section */}
      <section id="examples" className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Common Behavioral Questions
            </h2>
            <p className="text-lg text-white/60">
              These questions require STAR-structured answers. Practice these to be prepared.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exampleQuestions.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors"
              >
                <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full mb-3">
                  {item.category}
                </span>
                <p className="text-white font-medium">&ldquo;{item.question}&rdquo;</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/blog/perfect-star-answers-behavioral-questions"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              See 10 complete STAR answer examples
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Pro Tips for STAR Answers</h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                icon: Target,
                title: 'Be Specific',
                description: 'Vague answers are forgettable. Include specific numbers, dates, and details that make your story memorable.',
              },
              {
                icon: Zap,
                title: 'Keep It Concise',
                description: 'Aim for 1.5-2 minutes per answer. Practice until you can deliver your stories naturally without rambling.',
              },
              {
                icon: MessageSquare,
                title: 'Use "I" Not "We"',
                description: 'Interviewers want to know what YOU did. Focus on your individual contributions, not team achievements.',
              },
              {
                icon: Star,
                title: 'End Strong',
                description: 'Your Result should include measurable outcomes AND what you learned. Connect it to the role you want.',
              },
            ].map((tip, index) => {
              const Icon = tip.icon
              return (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-white/60">{tip.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="STAR Method FAQ"
        subtitle="Common questions about using the STAR method"
        faqs={faqs}
      />

      {/* CTA Section */}
      <CTASection
        title="Practice STAR Answers with AI Feedback"
        description="Our AI interview coach gives you real-time feedback on your STAR structure, helping you refine your delivery and content."
        primaryCTA={{ text: 'Start Free Practice', href: '/auth/register' }}
        secondaryCTA={{ text: 'Try Mock Interviews', href: '/mock-interviews' }}
        variant="gradient"
      />
    </SEOPageLayout>
  )
}
