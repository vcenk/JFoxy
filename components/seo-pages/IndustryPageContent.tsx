'use client'

import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
} from 'lucide-react'
import { FAQSection, CTASection } from '@/components/seo-pages'
import type { IndustryData } from '@/lib/seo/industry-data'

interface IndustryPageContentProps {
  data: IndustryData
}

export function IndustryPageContent({ data }: IndustryPageContentProps) {
  return (
    <>
      {/* Key Skills Section */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Essential Skills</h2>
            <p className="text-lg text-white/60">
              Key skills that employers look for in {data.slug} resumes
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.keySkills.map((category, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{category.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Titles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-8 h-8 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Top Job Titles</h2>
              </div>
              <p className="text-white/60 mb-8">
                Popular roles in the {data.slug} industry that you can target with your resume.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {data.topJobTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-white">Salary Ranges</h2>
              </div>
              <div className="space-y-4">
                {[
                  { level: 'Entry Level', range: data.salaryRange.entry },
                  { level: 'Mid Level', range: data.salaryRange.mid },
                  { level: 'Senior Level', range: data.salaryRange.senior },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <span className="text-white/80">{item.level}</span>
                    <span className="text-green-400 font-semibold">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Tips Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Resume Tips for {data.slug.charAt(0).toUpperCase() + data.slug.slice(1)}</h2>
            <p className="text-lg text-white/60">
              Industry-specific advice to make your resume stand out
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.resumeTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-purple-400">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                <p className="text-white/60">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS Keywords Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">ATS Keywords to Include</h2>
            <p className="text-lg text-white/60">
              These keywords help your resume pass automated screening systems
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {data.atsKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/50 text-center mt-6">
              Incorporate these keywords naturally throughout your resume where applicable
            </p>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Common Mistakes to Avoid</h2>
            <p className="text-lg text-white/60">
              Don&apos;t let these errors hurt your chances
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
            <ul className="space-y-4">
              {data.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/80">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title={`${data.slug.charAt(0).toUpperCase() + data.slug.slice(1)} Resume FAQ`}
        subtitle="Common questions about writing resumes for this industry"
        faqs={data.faqs}
      />

      {/* Related Resources */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">More Resume Resources</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Resume Templates',
                description: 'ATS-optimized templates designed for your industry.',
                href: '/resume/templates',
              },
              {
                title: 'Resume Examples',
                description: 'Real resume examples from professionals in your field.',
                href: '/resume/examples',
              },
              {
                title: 'Power Words',
                description: '900+ action verbs to make your resume more impactful.',
                href: '/resume-synonyms',
              },
            ].map((resource, index) => (
              <Link
                key={index}
                href={resource.href}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl p-6 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-white/60 mb-4">{resource.description}</p>
                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Build Your Resume?"
        description={`Use our AI-powered resume builder to create a perfect ${data.slug} resume in minutes.`}
        primaryCTA={{ text: 'Build Your Resume', href: '/auth/register' }}
        secondaryCTA={{ text: 'View Templates', href: '/resume/templates' }}
        variant="gradient"
      />
    </>
  )
}
