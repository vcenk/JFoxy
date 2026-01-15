import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Cookie, Settings, BarChart3, Shield, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cookie Policy | Job Foxy',
  description: 'How Job Foxy uses cookies to improve your experience.',
}

export default function CookiePolicy() {
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold uppercase tracking-wider">
                Last Updated: January 14, 2025
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1615] mb-4 tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
              This policy explains how Job Foxy uses cookies and similar technologies to enhance your experience.
            </p>
          </header>

          {/* Content */}
          <div className="space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">1</span>
                What Are Cookies?
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <p className="text-gray-600 leading-relaxed">
                  Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help us remember your preferences, understand how you use our platform, and improve your overall experience.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">2</span>
                Types of Cookies We Use
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: 'Essential Cookies',
                    description: 'Required for basic site functionality. These keep you logged in, secure your session, and enable core features like resume saving and interview sessions.',
                    color: 'emerald',
                    required: true,
                  },
                  {
                    icon: BarChart3,
                    title: 'Analytics Cookies',
                    description: 'Help us understand how visitors interact with Job Foxy. We use this data to improve our features and user experience. Data is aggregated and anonymized.',
                    color: 'blue',
                    required: false,
                  },
                  {
                    icon: Settings,
                    title: 'Functional Cookies',
                    description: 'Remember your preferences like theme settings, language, and dashboard layout. These make your experience more personalized.',
                    color: 'violet',
                    required: false,
                  },
                ].map((cookie) => (
                  <div
                    key={cookie.title}
                    className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${cookie.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <cookie.icon className={`w-6 h-6 text-${cookie.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[#1a1615]">{cookie.title}</h3>
                          {cookie.required && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{cookie.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">3</span>
                Third-Party Cookies
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We use trusted third-party services that may set their own cookies:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Supabase', purpose: 'Authentication & data storage' },
                    { name: 'Stripe', purpose: 'Secure payment processing' },
                    { name: 'Vercel Analytics', purpose: 'Performance monitoring' },
                    { name: 'OpenAI', purpose: 'AI-powered features' },
                  ].map((service) => (
                    <div key={service.name} className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-[#1a1615] mb-1">{service.name}</h4>
                      <p className="text-sm text-gray-500">{service.purpose}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-sm">
                  Each provider maintains their own cookie policies. We encourage you to review their respective privacy policies for more information.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">4</span>
                Managing Your Preferences
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  You have control over how cookies are used on your device:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Browser Settings',
                      desc: 'Most browsers allow you to block or delete cookies through their settings menu. Note that blocking essential cookies may prevent Job Foxy from functioning properly.',
                    },
                    {
                      title: 'Account Settings',
                      desc: 'Logged-in users can manage certain preferences directly from their Account page.',
                    },
                    {
                      title: 'Opt-Out Links',
                      desc: 'For analytics cookies, you can opt out through Google Analytics Opt-out Browser Add-on or similar tools.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-[#1a1615] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">5</span>
                Cookie Retention
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 pr-4 font-semibold text-[#1a1615]">Cookie Type</th>
                        <th className="text-left py-3 font-semibold text-[#1a1615]">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-50">
                        <td className="py-3 pr-4">Session Cookies</td>
                        <td className="py-3">Deleted when you close your browser</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-3 pr-4">Authentication</td>
                        <td className="py-3">7-30 days (based on "Remember me" setting)</td>
                      </tr>
                      <tr className="border-b border-gray-50">
                        <td className="py-3 pr-4">Preferences</td>
                        <td className="py-3">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Analytics</td>
                        <td className="py-3">Up to 2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">6</span>
                Questions?
              </h2>
              <div className="bg-gradient-to-br from-[#1a1615] to-[#2d2926] rounded-2xl p-6 sm:p-8 text-white">
                <p className="text-white/80 mb-4">
                  If you have any questions about our use of cookies or other technologies, please contact us:
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
            <Link href="/privacy" className="text-gray-500 hover:text-[#1a1615] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-[#1a1615] transition-colors">
              Terms of Service
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
