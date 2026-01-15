import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Trash2, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Job Foxy',
  description: 'How Job Foxy collects, uses, and protects your personal data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a1615] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-10 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                Last Updated: January 14, 2025
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1615] mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
              At Job Foxy, your privacy is our priority. This policy explains how we collect, use, and protect your personal information.
            </p>
          </header>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
            {[
              { icon: Eye, label: 'What We Collect', href: '#collect' },
              { icon: Lock, label: 'How We Protect', href: '#security' },
              { icon: Trash2, label: 'Your Rights', href: '#rights' },
              { icon: Mail, label: 'Contact Us', href: '#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-10">

            {/* Section 1 */}
            <section id="collect" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                Information We Collect
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-[#1a1615] mb-2">Account Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    When you create an account, we collect your name, email address, and password. If you sign up via Google or LinkedIn, we receive basic profile information from those services.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1615] mb-2">Resume & Career Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To provide our services, we process resumes you upload, job descriptions you analyze, and cover letters you generate. This data is used solely to deliver personalized feedback and recommendations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1615] mb-2">Voice & Interview Data</h3>
                  <p className="text-gray-600 leading-relaxed">
                    During mock interviews and voice practice sessions, we process audio recordings to provide real-time feedback on your responses. Audio data is transcribed and analyzed using AI, then deleted after processing unless you choose to save it.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1615] mb-2">Payment Information</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Payments are processed securely through Stripe. We never store your full credit card number on our servers—only a secure token for subscription management.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                How We Use Your Data
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <ul className="space-y-4">
                  {[
                    'Analyze your resume against job descriptions to identify skill gaps and keyword matches',
                    'Power AI mock interviews with realistic questions tailored to your target roles',
                    'Score and provide feedback on your interview responses using the STAR framework',
                    'Generate personalized cover letters based on your resume and job requirements',
                    'Send you important account updates and optional career tips (you can opt out anytime)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
                AI & Third-Party Services
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Job Foxy uses OpenAI's language models to power our AI coaching features. When you use our services, relevant data is sent to OpenAI for processing. OpenAI does not use your data to train their models.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We also use Supabase for secure data storage, Stripe for payment processing, and Deepgram for speech-to-text transcription. Each provider maintains their own privacy practices aligned with industry standards.
                </p>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> We never sell your personal data to third parties for marketing purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
                Data Security
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Encryption at Rest', desc: 'All stored data is encrypted using AES-256' },
                    { title: 'Encryption in Transit', desc: 'All connections use TLS 1.2 or higher' },
                    { title: 'Secure Authentication', desc: 'Passwords hashed with bcrypt, optional 2FA' },
                    { title: 'Regular Audits', desc: 'Continuous security monitoring and updates' },
                  ].map((item) => (
                    <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-[#1a1615] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="rights" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">5</span>
                Your Privacy Rights
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">You have the right to:</p>
                <ul className="space-y-3">
                  {[
                    'Access all personal data we hold about you',
                    'Correct any inaccurate information in your profile',
                    'Export your data in a portable format',
                    'Delete your account and all associated data',
                    'Opt out of marketing communications at any time',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 text-xs font-bold">✓</span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600 leading-relaxed pt-2">
                  You can manage most of these settings directly from your Account page. For complete data deletion, contact us at the email below.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="contact" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">6</span>
                Contact Us
              </h2>
              <div className="bg-gradient-to-br from-[#1a1615] to-[#2d2926] rounded-2xl p-6 sm:p-8 text-white">
                <p className="text-white/80 mb-4">
                  If you have any questions about this Privacy Policy or how we handle your data, please reach out:
                </p>
                <a
                  href="mailto:support@jobfoxy.com"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#1a1615] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@jobfoxy.com
                </a>
              </div>
            </section>

          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-[#1a1615] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-[#1a1615] transition-colors">
              Cookie Policy
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
