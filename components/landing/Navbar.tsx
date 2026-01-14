'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import JobFoxyLogo from '@/components/assets/JobFoxy.svg'

interface NavItem {
  name: string
  href: string
}

interface NavbarProps {
  navItems?: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { name: 'Features', href: '#features' },
  { name: 'Benefits', href: '#benefits' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Blog', href: '#blog' },
]

// Smooth scroll handler
const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith('#')) {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  }
}

export function Navbar({ navItems = defaultNavItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'h-24 px-4' : 'h-32 px-10'

        }`}
      >
        <div
          className={`transition-all duration-500 ease-out ${
            isScrolled
              ? 'max-w-5xl mx-auto bg-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.06] rounded-full'
              : 'max-w-full mx-auto bg-transparent'
          }`}
        >
          <div className={`flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'h-24 px-5 pl-7' : 'h-32 px-10 sm:px-12 lg:px-20'

          }`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2"
              >
                {/* Logo Icon */}
                <div className={`relative transition-all duration-500 ${
                  isScrolled ? 'w-36 h-36' : 'w-48 h-48'
                }`}>
                  <Image
                    src={JobFoxyLogo}
                    alt="Job Foxy Logo"
                    fill
                    className="object-contain"
                  />
                </div>

              </motion.div>
            </Link>

            {/* Desktop Nav Links - Center */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="px-5 py-2.5 text-[#1a1a1a] hover:text-[#0f0f0f] text-[20px] font-medium rounded-full hover:bg-black/[0.04] transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Button - Right */}
            <div className="hidden lg:flex items-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/auth/register"
                  className={`inline-flex items-center justify-center bg-[#0f0f0f] text-white font-semibold hover:bg-[#262626] transition-all ${
                    isScrolled 
                      ? 'px-5 py-2.5 text-[16px] rounded-full' 
                      : 'px-6 py-3 text-[18px] rounded-full'
                  }`}
                >
                  Try Job Foxy free
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#0f0f0f]" />
              ) : (
                <Menu className="h-6 w-6 text-[#0f0f0f]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.06] overflow-hidden"
            >
              <div className="flex flex-col p-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      handleSmoothScroll(e, item.href)
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-3.5 text-[#1a1a1a] hover:text-[#0f0f0f] text-[16px] font-medium rounded-xl hover:bg-black/[0.04] transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="mt-3 pt-3 border-t border-black/[0.06]">
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-3.5 text-center bg-[#0f0f0f] text-white text-[16px] font-semibold rounded-xl hover:bg-[#262626] transition-colors"
                  >
                    Try Job Foxy free
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
