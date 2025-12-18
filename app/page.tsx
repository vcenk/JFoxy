// app/page.tsx - Landing page
'use client'

import {
  Background,
  Navbar,
  Hero,
  ScrollVelocity,
  Features,
  Benefits,
  HowItWorks,
  Pricing,
  Blog,
  FinalCTA,
  Footer
} from '@/components/landing'  // components/landing/index.ts

export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <Background />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Scroll Velocity Text Animation */}
      <ScrollVelocity />

      {/* Features Section - 2×2 Grid */}
      <Features />

      {/* Benefits Section */}
      <Benefits />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <Pricing />

      {/* Blog Section */}
      <Blog />

      {/* Final CTA Section */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  )
}
