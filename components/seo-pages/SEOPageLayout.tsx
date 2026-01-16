import { ReactNode } from 'react'
import { Navbar, Footer } from '@/components/landing'

interface SEOPageLayoutProps {
  children: ReactNode
}

export function SEOPageLayout({ children }: SEOPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
