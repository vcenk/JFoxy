// app/page.tsx - Landing page
'use client'

import {
  Background,
  Navbar,
  Hero,
  ScrollVelocity,
  Features,
  ProductPreview,
  Benefits,
  HowItWorks,
  Pricing,
  Blog,
  FinalCTA,
  Footer,
  BrandSignature
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

      {/* Features Section */}
      <Features />

      {/* Product Preview Section */}
      <ProductPreview />

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

      {/* Brand Signature */}
      <BrandSignature />
    </div>
  )
}
