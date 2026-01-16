// lib/types/linkedin.ts

export interface LinkedInHeadline {
  primary: string           // Main recommended headline
  alternates: string[]      // 2-3 alternative options
}

export interface LinkedInAbout {
  text: string              // Full about section text
  hook: string              // Attention-grabbing opening line
  keyStrengths: string[]    // 3-4 key strengths mentioned
  callToAction: string      // Closing CTA
}

export interface LinkedInSkill {
  name: string
  category: 'technical' | 'business' | 'soft' | 'industry' | 'tools'
  priority: 'featured' | 'standard'  // Featured = top 3 skills
}

export interface LinkedInFeaturedItem {
  type: 'accomplishment' | 'project' | 'publication' | 'certification'
  title: string
  description: string
  suggestedMedia?: string   // Suggestion for what to add as media
}

export interface LinkedInExperienceRewrite {
  company: string
  title: string
  originalBullets: string[]
  optimizedBullets: string[]
  improvements: string[]    // What was improved
}

export interface LinkedInProfileData {
  headline: LinkedInHeadline
  about: LinkedInAbout
  skills: LinkedInSkill[]
  featured: LinkedInFeaturedItem[]
  experienceRewrites: LinkedInExperienceRewrite[]
  additionalSections?: {
    volunteering?: string[]
    courses?: string[]
    certifications?: string[]
  }
  optimizationTips: string[]  // General tips for profile improvement
}

export interface LinkedInGenerateRequest {
  resumeId: string
  targetRole?: string       // Optional target role/industry focus
  tone?: 'professional' | 'creative' | 'executive'
}

export interface LinkedInGenerateResponse {
  success: boolean
  data?: LinkedInProfileData
  error?: string
}
