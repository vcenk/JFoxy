import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, UserCheck, CreditCard, AlertTriangle, Ban, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Job Foxy',
  description: 'The rules and regulations for using Job Foxy.',
}

export default function TermsOfService() {
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                Last Updated: January 14, 2025
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1615] mb-4 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
              Welcome to Job Foxy. By using our platform, you agree to comply with these terms and conditions.
            </p>
          </header>

          {/* Agreement Notice */}
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">By using Job Foxy, you agree to these terms</h3>
              <p className="text-blue-700 text-sm">
                Please read carefully. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">1</span>
                Account Registration
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  To access Job Foxy's features, you must create an account with a valid email address. You are responsible for:
                </p>
                <ul className="space-y-3">
                  {[
                    'Maintaining the confidentiality of your login credentials',
                    'All activities that occur under your account',
                    'Notifying us immediately of any unauthorized use',
                    'Providing accurate and up-to-date information',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">2</span>
                Permitted Use
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Job Foxy grants you a personal, non-exclusive, non-transferable license to use our AI-powered interview preparation tools for your individual career development. Our services include:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {[
                    'Resume analysis & optimization',
                    'AI mock interviews',
                    'STAR framework practice',
                    'Cover letter generation',
                    'Job description analysis',
                    'Interview coaching tools',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">3</span>
                Prohibited Activities
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <p className="text-gray-600 leading-relaxed mb-4">You agree NOT to:</p>
                <div className="space-y-3">
                  {[
                    { text: 'Resell, redistribute, or commercialize any part of our service', icon: Ban },
                    { text: 'Use automated scripts or bots to access our platform', icon: Ban },
                    { text: 'Attempt to reverse engineer our AI systems', icon: Ban },
                    { text: 'Upload malicious content or violate intellectual property rights', icon: Ban },
                    { text: 'Share your account credentials with others', icon: Ban },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <item.icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">4</span>
                AI Disclaimer
              </h2>
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="space-y-3">
                    <p className="text-amber-900 leading-relaxed">
                      <strong>Important:</strong> Job Foxy's AI provides feedback based on patterns and data analysis. While our tools are designed to be helpful:
                    </p>
                    <ul className="space-y-2 text-amber-800 text-sm">
                      <li>• We do not guarantee specific employment outcomes</li>
                      <li>• AI feedback should complement, not replace, human judgment</li>
                      <li>• Results may vary based on individual circumstances</li>
                      <li>• Our service is a preparation tool, not professional career advice</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">5</span>
                Payments & Subscriptions
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <CreditCard className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#1a1615] mb-1">Subscription Billing</h4>
                    <p className="text-gray-600 text-sm">
                      Paid plans are billed in advance on a monthly or annual basis. Your subscription will automatically renew unless cancelled before the renewal date.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Cancellation:</strong> You can cancel your subscription anytime from your Account settings. Access continues until the end of your current billing period.</p>
                  <p><strong>Refunds:</strong> We offer a 7-day money-back guarantee for first-time subscribers. After this period, refunds are provided at our discretion.</p>
                  <p><strong>Price Changes:</strong> We may adjust pricing with 30 days notice. Existing subscribers will be notified before any changes affect their plan.</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">6</span>
                Termination
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate your account if you violate these terms, including but not limited to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Misuse of our AI systems</li>
                  <li>• Fraudulent payment activity</li>
                  <li>• Harassment of other users or staff</li>
                  <li>• Any illegal activities conducted through our platform</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  You may also delete your account at any time from your Account settings.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">7</span>
                Limitation of Liability
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, Job Foxy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or employment opportunities, resulting from your use or inability to use the service.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-bold text-[#1a1615] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">8</span>
                Questions?
              </h2>
              <div className="bg-gradient-to-br from-[#1a1615] to-[#2d2926] rounded-2xl p-6 sm:p-8 text-white">
                <p className="text-white/80 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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
            <Link href="/cookies" className="text-gray-500 hover:text-[#1a1615] transition-colors">
              Cookie Policy
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
