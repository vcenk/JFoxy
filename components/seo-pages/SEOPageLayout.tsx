import { ReactNode } from 'react'
import { Navbar, Footer } from '@/components/landing'

interface SEOPageLayoutProps {
  children: ReactNode
}

export function SEOPageLayout({ children }: SEOPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <Navbar />
      <main className="pt-24 sm:pt-32">{children}</main>
      <Footer />
    </div>
  )
}
