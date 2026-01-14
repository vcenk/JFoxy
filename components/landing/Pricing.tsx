'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { fadeInUp, staggerContainer, scaleIn } from './animations'

// Pricing tiers configuration
export const pricingPlans = [
  {
    name: 'Free',
    monthlyPrice: '$0',
    annualPrice: '$0',
    period: '',
    description: 'See how JobFoxy can help you.',
    features: [
      '1 resume',
      '1 job analysis',
      '1 cover letter',
      'Export to PDF/DOCX',
      'Preview coaching tools'
    ],
    cta: 'Try Free',
    ctaLink: '/auth/register',
    popular: false,
    highlighted: false,
  },
  {
    name: 'Basic',
    monthlyPrice: '$14.90',
    annualPrice: '$12.90',
    period: '/mo',
    description: 'Get interview-ready applications.',
    features: [
      '5 resumes',
      'Unlimited job analyses',
      'Unlimited cover letters',
      'AI-powered improvements',
      'Full coaching suite',
      'Unlimited exports'
    ],
    cta: 'Start Basic',
    ctaLink: '/auth/register?plan=basic',
    popular: false,
    highlighted: false,
  },
  {
    name: 'Pro',
    monthlyPrice: '$24.90',
    annualPrice: '$19.90',
    period: '/mo',
    description: 'Practice with voice feedback.',
    features: [
      'Everything in Basic',
      '6 voice practice sessions/mo',
      'AI feedback on your answers',
      'Performance scoring',
      'Personalized coaching'
    ],
    cta: 'Start Pro',
    ctaLink: '/auth/register?plan=pro',
    popular: true,
    highlighted: true,
  },
  {
    name: 'Interview Ready',
    monthlyPrice: '$49.90',
    annualPrice: '$39.90',
    period: '/mo',
    description: 'Realistic AI mock interviews.',
    features: [
      'Everything in Pro',
      '150 min mock interviews/mo',
      '10 voice sessions/mo',
      'Multiple interview styles',
      'Detailed feedback reports'
    ],
    cta: 'Start Interview Ready',
    ctaLink: '/auth/register?plan=interview-ready',
    popular: false,
    highlighted: false,
  },
]

interface PricingProps {
  plans?: typeof pricingPlans
  title?: string
  subtitle?: string
}

export function Pricing({
  plans = pricingPlans,
  title = 'Simple, Transparent Pricing',
  subtitle = "Start free, upgrade when you're ready to accelerate your job search"
}: PricingProps) {
  // 2. STATE FOR TOGGLE
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly')

  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1615] mb-6 tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            {title}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-[#6b6b6b] max-w-2xl mx-auto mb-8"
          >
            {subtitle}
          </motion.p>

          {/* Billing Toggle */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            <div className="bg-white rounded-full p-1.5 flex items-center gap-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-[#1a1615] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  billingCycle === 'annually'
                    ? 'bg-[#1a1615] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Annually
                <span className="ml-1.5 text-xs text-green-600 font-bold">Save 20%</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ y: -8 }}
              className="relative h-full"
            >
              <div 
                className={`h-full rounded-[32px] p-8 transition-all duration-300 flex flex-col
                  ${plan.highlighted 
                    ? 'bg-[#e8e6e4] border-4 border-[#8AB6F9] shadow-xl relative overflow-hidden' 
                    : 'bg-white shadow-sm border border-transparent'
                  }
                `}
              >

                {/* Header */}
                <div className="mb-8 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-[#1a1615]">{plan.name}</h3>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] text-[10px] font-bold uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                  </div>
                  
                  {/* 4. DYNAMIC PRICE DISPLAY */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={billingCycle} // Animation key triggers re-render animation
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-5xl font-bold text-[#1a1615] tracking-tight"
                      >
                        {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-lg text-[#6b6b6b]">{plan.period}</span>
                  </div>
                  
                  {/* Annual billing subtitle */}
                  <div className="h-6">
                    {billingCycle === 'annually' && plan.annualPrice !== '$0' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-[#6b6b6b] font-medium"
                      >
                        Billed ${(parseFloat(plan.annualPrice.replace('$', '')) * 12).toFixed(0)} yearly
                      </motion.p>
                    )}
                  </div>
                  
                  <p className="text-[#6b6b6b] text-base leading-relaxed mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 flex-shrink-0 text-[#1a1615] mt-0.5" strokeWidth={1.5} />
                      <span className="text-[#453f3d] text-[15px] leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={plan.ctaLink} className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-full font-bold text-[15px] transition-all
                      ${plan.highlighted
                        ? 'bg-[#1a1615] text-white hover:bg-black shadow-lg'
                        : 'bg-[#f4f1ee] text-[#1a1615] hover:bg-[#e9e6e3]'
                      }
                    `}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing