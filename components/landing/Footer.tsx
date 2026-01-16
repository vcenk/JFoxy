'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Send, CheckCircle2, Facebook, Instagram, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface FooterProps {
  brandDescription?: string
  productLinks?: Array<{ name: string; href: string }>
  legalLinks?: Array<{ name: string; href: string }>
  socialLinks?: Array<{ name: string; href: string; icon: React.ComponentType<any> }>
  copyright?: string
}

const defaultProductLinks = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Blog', href: '#blog' },
  { name: 'Login', href: '/auth/login' },
]

const defaultLegalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Cookie Policy', href: '/cookies' },
]

const defaultSocialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/jobfoxy/', icon: Linkedin },
  { name: 'Twitter', href: 'https://x.com/JobFoxy', icon: Twitter },
  { name: 'Instagram', href: 'https://www.instagram.com/job.foxy/', icon: Instagram },
]

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.alreadySubscribed ? 'You\'re already subscribed!' : 'Thanks for subscribing!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again.')
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 3000)
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-[#1a1615] text-sm mb-2">Stay updated</h3>
      <p className="text-xs text-[#6b6b6b] mb-4">Get the latest interview tips and feature updates.</p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium py-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            disabled={status === 'loading'}
            className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 w-full outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="bg-[#1a1615] text-white p-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-500 text-xs mt-2">{message}</p>
      )}
    </div>
  )
}

export function Footer({
  brandDescription = 'AI-powered interview preparation that helps you land your dream job with confidence.',
  productLinks = defaultProductLinks,
  legalLinks = defaultLegalLinks,
  socialLinks = defaultSocialLinks,
  copyright = `© ${new Date().getFullYear()} Job Foxy AI. All rights reserved.`
}: FooterProps) {
  return (
    // CHANGED: Matched background to #f4f7fa for consistency
    <footer className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 bg-[#f4f7fa] border-t border-black/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          
          {/* 1. BRAND COLUMN */}
          <div className="xl:col-span-1 lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#1a1615] flex items-center justify-center">
                 <svg className="w-5 h-5 text-white" viewBox="0 0 32 32" fill="none">
                    <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" fill="currentColor"/>
                    <path d="M12 12c0-2.21 1.79-4 4-4s4 1.79 4 4v8c0 2.21-1.79 4-4 4s-4-1.79-4-4v-8z" fill="currentColor" fillOpacity="0.5"/>
                 </svg>
              </div>
              <span className="text-xl font-bold text-[#1a1615] tracking-tight">Job Foxy</span>
            </Link>
            
            <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6 max-w-xs">
              {brandDescription}
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ y: -3 }}
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1a1615] hover:border-gray-300 transition-all shadow-sm"
                  aria-label={link.name}
                >
                  <link.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* 2. LINKS COLUMNS */}
          <div className="grid grid-cols-2 gap-8 xl:col-span-2 lg:col-span-2">
            <div>
              <h3 className="font-bold text-[#1a1615] text-sm mb-4">Product</h3>
              <ul className="space-y-3">
                {productLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-[#6b6b6b] hover:text-[#2563eb] text-sm transition-colors font-medium"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#1a1615] text-sm mb-4">Legal</h3>
              <ul className="space-y-3">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-[#6b6b6b] hover:text-[#2563eb] text-sm transition-colors font-medium"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. NEWSLETTER & STATUS (New) */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <NewsletterForm />

            {/* System Status Indicator */}
            <div className="mt-6 flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-medium text-emerald-700">All systems operational</span>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-sm text-[#9ca3af] font-medium">
            {copyright}
          </p>
          <div className="flex items-center gap-6">
             <span className="text-xs font-bold text-gray-300 uppercase tracking-widest select-none">
                INTERVIEW INTELLIGENCE
             </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer