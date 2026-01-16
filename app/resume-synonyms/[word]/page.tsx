// app/resume-synonyms/[word]/page.tsx
// Individual word synonym pages with SEO optimization

import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POWER_WORD_SYNONYMS } from '@/lib/data/powerWords'
import { ArrowLeft, Check, X, Lightbulb, TrendingUp } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { Navbar, Footer } from '@/components/landing'

interface PageProps {
  params: Promise<{ word: string }> | { word: string }
}

// Generate static params for all weak words (for static generation)
export async function generateStaticParams() {
  const weakWords = Object.keys(POWER_WORD_SYNONYMS)
  return weakWords.map((word) => ({
    word: word.toLowerCase().replace(/\s+/g, '-'),
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params
  const wordSlug = resolvedParams.word
  const originalWord = wordSlug.replace(/-/g, ' ')

  // Find the matching weak word (case insensitive)
  const weakWordKey = Object.keys(POWER_WORD_SYNONYMS).find(
    (key) => key.toLowerCase() === originalWord.toLowerCase()
  )

  if (!weakWordKey) {
    return {
      title: 'Word Not Found',
    }
  }

  const synonyms = POWER_WORD_SYNONYMS[weakWordKey]
  const firstFewSynonyms = synonyms.slice(0, 5).join(', ')

  return {
    title: `"${weakWordKey}" Resume Synonyms | ${synonyms.length} Powerful Alternatives`,
    description: `Replace "${weakWordKey}" with stronger resume action verbs. Discover ${synonyms.length} powerful alternatives: ${firstFewSynonyms}, and more. Improve your ATS score.`,
    keywords: [
      `${weakWordKey} synonyms`,
      `${weakWordKey} resume`,
      'resume power words',
      'action verbs',
      'ATS optimization',
      ...synonyms.slice(0, 10),
    ],
    openGraph: {
      title: `"${weakWordKey}" Resume Synonyms | ${synonyms.length} Alternatives`,
      description: `Replace "${weakWordKey}" with powerful alternatives: ${firstFewSynonyms}`,
      type: 'article',
    },
  }
}

export default async function WordSynonymPage({ params }: PageProps) {
  const resolvedParams = params instanceof Promise ? await params : params
  const wordSlug = resolvedParams.word
  const originalWord = wordSlug.replace(/-/g, ' ')

  // Find the matching weak word (case insensitive)
  const weakWordKey = Object.keys(POWER_WORD_SYNONYMS).find(
    (key) => key.toLowerCase() === originalWord.toLowerCase()
  )

  if (!weakWordKey) {
    notFound()
  }

  const synonyms = POWER_WORD_SYNONYMS[weakWordKey]

  // Generate usage examples
  const examples = getExamplesForWord(weakWordKey)

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Navbar />

      {/* Header */}
      <div className="border-b border-gray-100 bg-white pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/resume-synonyms"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all synonyms
          </Link>

          <div className="text-center">
            <div className="inline-block bg-red-50 border border-red-100 rounded-2xl px-6 py-3 mb-4">
              <span className="text-red-600 text-sm font-medium uppercase tracking-wide">
                Weak Phrase
              </span>
              <h1 className="text-4xl font-bold text-[#1a1615] mt-2">&ldquo;{weakWordKey}&rdquo;</h1>
            </div>
            <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto mt-4">
              Replace this weak phrase with {synonyms.length} powerful alternatives to strengthen
              your resume and improve ATS performance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why This Is Weak */}
        <div className="mb-12 bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-[#1a1615] mb-3">
                Why &ldquo;{weakWordKey}&rdquo; Weakens Your Resume
              </h2>
              <div className="text-[#6b6b6b] space-y-2 text-sm">
                {getWeaknessExplanation(weakWordKey)}
              </div>
            </div>
          </div>
        </div>

        {/* Power Word Alternatives */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-[#1a1615]">
              {synonyms.length} Powerful Alternatives
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {synonyms.map((synonym) => (
              <CopyButton key={synonym} text={synonym} />
            ))}
          </div>
        </div>

        {/* Before & After Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1a1615] mb-6">Before & After Examples</h2>
          <div className="space-y-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                {/* Before */}
                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                      Weak Example
                    </span>
                  </div>
                  <p className="text-[#1a1615] italic">&ldquo;{example.before}&rdquo;</p>
                </div>

                {/* After */}
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                      Strong Example
                    </span>
                  </div>
                  <p className="text-[#1a1615] font-medium">&ldquo;{example.after}&rdquo;</p>
                  <p className="text-sm text-[#6b6b6b] mt-2">
                    <strong>Why it&apos;s better:</strong> {example.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips for Using Alternatives */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#1a1615] mb-4">Tips for Using These Power Words</h2>
          <ul className="space-y-3 text-[#6b6b6b] text-sm">
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1a1615]">Choose the most accurate verb:</strong> Pick the
                synonym that best describes what you actually did. &ldquo;Spearheaded&rdquo; is different from
                &ldquo;Coordinated.&rdquo;
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1a1615]">Add quantifiable results:</strong> Strong verbs are
                even better with numbers. &ldquo;Increased sales by 40%&rdquo; beats just &ldquo;Increased sales.&rdquo;
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1a1615]">Match the job description:</strong> If the posting
                uses &ldquo;orchestrated,&rdquo; use that instead of &ldquo;managed&rdquo; to pass ATS keyword filters.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1a1615]">Vary your language:</strong> Don&apos;t use the same power
                word throughout your resume. Mix it up to keep recruiters engaged.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1a1615] mb-3">
            Automatically Find Weak Words in Your Resume
          </h2>
          <p className="text-[#6b6b6b] mb-6 max-w-2xl mx-auto">
            Our AI-powered analyzer scans your entire resume for weak phrases and suggests the best
            power word replacements.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-[#1a1615] text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-colors shadow-lg"
          >
            Analyze My Resume Free
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// Helper function to generate examples for each weak word
function getExamplesForWord(weakWord: string): Array<{ before: string; after: string; why: string }> {
  const exampleMap: Record<string, Array<{ before: string; after: string; why: string }>> = {
    improved: [
      {
        before: `Improved customer service processes`,
        after: `Enhanced customer service workflows, reducing response time by 35% and improving satisfaction scores from 3.2 to 4.7/5`,
        why: `"Enhanced" is more sophisticated, and adding specific metrics shows measurable impact`,
      },
      {
        before: `Improved team productivity`,
        after: `Optimized team workflows by implementing Agile methodologies, boosting productivity by 28% (measured by sprint velocity)`,
        why: `"Optimized" implies strategic thinking, and mentioning the methodology adds credibility`,
      },
    ],
    increased: [
      {
        before: `Increased sales revenue`,
        after: `Amplified regional sales revenue by 42% ($1.8M) through strategic partnership development and targeted marketing campaigns`,
        why: `"Amplified" is more powerful, and specific numbers + strategy show real business impact`,
      },
      {
        before: `Increased user engagement`,
        after: `Boosted monthly active users by 65% (120K to 198K) by redesigning onboarding flow and implementing personalization features`,
        why: `"Boosted" is energetic, exact numbers prove results, and explaining how shows competence`,
      },
    ],
    managed: [
      {
        before: `Managed a team of developers`,
        after: `Orchestrated cross-functional engineering team of 12 developers across 3 time zones, delivering 5 major product releases on schedule`,
        why: `"Orchestrated" implies complex coordination, and results show successful leadership`,
      },
      {
        before: `Managed customer accounts`,
        after: `Stewarded portfolio of 45 enterprise accounts worth $3.2M annually, achieving 98% retention rate and 22% upsell growth`,
        why: `"Stewarded" shows care and responsibility, metrics prove effectiveness`,
      },
    ],
    'responsible for': [
      {
        before: `Responsible for social media marketing`,
        after: `Spearheaded social media strategy across 4 platforms, growing follower base from 5K to 85K in 18 months`,
        why: `Eliminates passive voice, "Spearheaded" shows initiative, numbers prove success`,
      },
      {
        before: `Responsible for inventory management`,
        after: `Orchestrated just-in-time inventory system, reducing holding costs by $240K annually while maintaining 99.2% stock availability`,
        why: `Active voice, specific system mentioned, dual metrics show balanced optimization`,
      },
    ],
    'helped with': [
      {
        before: `Helped with the product launch`,
        after: `Co-led go-to-market strategy for $5M product launch, exceeding first-quarter targets by 38%`,
        why: `"Co-led" shows ownership, avoiding vague "helped," metrics prove contribution`,
      },
      {
        before: `Helped with training new employees`,
        after: `Designed and facilitated comprehensive onboarding program for 50+ new hires, reducing time-to-productivity from 8 to 5 weeks`,
        why: `Specific action verbs, quantified impact on business efficiency`,
      },
    ],
    'worked on': [
      {
        before: `Worked on database optimization`,
        after: `Engineered database indexing solution that accelerated query performance by 10x, supporting 2M+ daily transactions`,
        why: `"Engineered" shows technical expertise, specific results demonstrate impact`,
      },
      {
        before: `Worked on marketing campaigns`,
        after: `Executed integrated marketing campaigns across email, social, and PPC channels, generating 1,200 qualified leads at $45 CPA`,
        why: `"Executed" is decisive, multichannel approach + metrics show scope and efficiency`,
      },
    ],
    reduced: [
      {
        before: `Reduced customer complaints`,
        after: `Minimized customer complaint rate by 58% through implementation of proactive service monitoring and rapid response protocols`,
        why: `"Minimized" is sophisticated, percentage + methodology shows systematic approach`,
      },
      {
        before: `Reduced operating costs`,
        after: `Slashed operational expenses by $420K annually (18% reduction) by renegotiating vendor contracts and eliminating redundancies`,
        why: `"Slashed" implies aggressive action, dual metrics ($ and %) + methods show strategic thinking`,
      },
    ],
    created: [
      {
        before: `Created training materials`,
        after: `Architected comprehensive training curriculum adopted by 200+ employees, reducing onboarding time by 40% and improving job proficiency scores`,
        why: `"Architected" implies thoughtful design, scale + dual metrics show organization-wide impact`,
      },
      {
        before: `Created marketing content`,
        after: `Produced 50+ pieces of high-performing content that generated 2.3M organic impressions and 15K conversions over 6 months`,
        why: `"Produced" emphasizes output, specific content strategy + metrics prove ROI`,
      },
    ],
    developed: [
      {
        before: `Developed new features`,
        after: `Engineered 12 customer-requested features using React and Node.js, increasing user retention by 32% and reducing churn from 8% to 5.4%`,
        why: `"Engineered" shows technical skill, technologies + user metrics demonstrate business value`,
      },
      {
        before: `Developed training program`,
        after: `Pioneered leadership development program that trained 75 managers, resulting in 45% improvement in team engagement scores`,
        why: `"Pioneered" suggests innovation, scale + measurable outcome show program effectiveness`,
      },
    ],
    led: [
      {
        before: `Led weekly team meetings`,
        after: `Facilitated strategic planning sessions with C-suite executives, driving alignment on $10M initiatives across 5 departments`,
        why: `"Facilitated" shows skill beyond basic leading, level of stakeholders + scope demonstrate seniority`,
      },
      {
        before: `Led project team`,
        after: `Championed cross-functional team of 8 specialists through 9-month infrastructure migration, completing 2 weeks ahead of schedule with zero downtime`,
        why: `"Championed" shows strong leadership, team composition + specific results prove project management excellence`,
      },
    ],
  }

  // Return examples for this word, or generate generic ones
  if (exampleMap[weakWord]) {
    return exampleMap[weakWord]
  }

  // Generic fallback examples
  const synonyms = POWER_WORD_SYNONYMS[weakWord]
  return [
    {
      before: `${weakWord} team projects and initiatives`,
      after: `${synonyms[0]} cross-functional projects worth $500K, delivering results 20% ahead of schedule`,
      why: `Using "${synonyms[0]}" shows stronger action, and adding specific scope + metrics demonstrates measurable impact`,
    },
    {
      before: `${weakWord} various business processes`,
      after: `${synonyms[1]} operational workflows, reducing cycle time by 35% and improving team efficiency`,
      why: `"${synonyms[1]}" is more specific and professional, backed by quantifiable improvements`,
    },
  ]
}

// Helper function to explain why each word is weak
function getWeaknessExplanation(weakWord: string): React.ReactNode {
  const explanations: Record<string, React.ReactNode> = {
    improved: (
      <>
        <p>
          <strong>&ldquo;Improved&rdquo;</strong> is vague and doesn&apos;t specify what you actually did or how much
          better things got.
        </p>
        <p>
          <strong>ATS Impact:</strong> Generic verbs like &ldquo;improved&rdquo; don&apos;t differentiate your resume.
          More specific synonyms like &ldquo;Enhanced,&rdquo; &ldquo;Optimized,&rdquo; or &ldquo;Elevated&rdquo; signal precision and
          expertise.
        </p>
      </>
    ),
    increased: (
      <>
        <p>
          <strong>&ldquo;Increased&rdquo;</strong> is overused and passive. It doesn&apos;t show HOW you created the
          increase.
        </p>
        <p>
          <strong>ATS Impact:</strong> Stronger verbs like &ldquo;Amplified,&rdquo; &ldquo;Accelerated,&rdquo; or &ldquo;Boosted&rdquo;
          demonstrate active contribution and energy.
        </p>
      </>
    ),
    managed: (
      <>
        <p>
          <strong>&ldquo;Managed&rdquo;</strong> is the most common word on resumes - which makes it invisible to
          recruiters.
        </p>
        <p>
          <strong>ATS Impact:</strong> Words like &ldquo;Orchestrated,&rdquo; &ldquo;Spearheaded,&rdquo; or &ldquo;Directed&rdquo; show
          leadership complexity beyond basic management.
        </p>
      </>
    ),
    'responsible for': (
      <>
        <p>
          <strong>&ldquo;Responsible for&rdquo;</strong> is passive voice and describes duties, not achievements.
          It&apos;s a job description phrase, not a resume phrase.
        </p>
        <p>
          <strong>ATS Impact:</strong> This phrase gets flagged as weak by ATS systems. Starting with
          action verbs like &ldquo;Led,&rdquo; &ldquo;Drove,&rdquo; or &ldquo;Executed&rdquo; dramatically improves scoring.
        </p>
      </>
    ),
    'helped with': (
      <>
        <p>
          <strong>&ldquo;Helped with&rdquo;</strong> minimizes your contribution and sounds like you played a
          minor role.
        </p>
        <p>
          <strong>ATS Impact:</strong> Recruiters skip vague phrases. Using &ldquo;Collaborated on,&rdquo;
          &ldquo;Contributed to,&rdquo; or &ldquo;Partnered in&rdquo; shows active participation.
        </p>
      </>
    ),
    'worked on': (
      <>
        <p>
          <strong>&ldquo;Worked on&rdquo;</strong> is lazy writing that tells nothing about what you actually did
          or achieved.
        </p>
        <p>
          <strong>ATS Impact:</strong> Specific action verbs like &ldquo;Developed,&rdquo; &ldquo;Executed,&rdquo; or
          &ldquo;Implemented&rdquo; pass ATS filters and catch recruiter attention.
        </p>
      </>
    ),
  }

  // Return specific explanation or generic one
  return (
    explanations[weakWord] || (
      <>
        <p>
          <strong>&ldquo;{weakWord}&rdquo;</strong> is a weak or overused phrase that doesn&apos;t effectively
          communicate your impact and achievements.
        </p>
        <p>
          <strong>ATS Impact:</strong> Using stronger, more specific action verbs helps your resume
          score higher in Applicant Tracking Systems and stand out to recruiters.
        </p>
      </>
    )
  )
}
