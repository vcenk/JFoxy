// lib/config/constants.ts - Application constants

export const APP_NAME = 'Job Foxy'
export const APP_DESCRIPTION = 'AI-Powered Interview Preparation Platform'

// Subscription plans
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',              // $0/mo
  BASIC: 'basic',            // $14.90/mo
  PRO: 'pro',                // $24.90/mo
  INTERVIEW_READY: 'interview_ready' // $49.90/mo
} as const

export const TIER_LIMITS: Record<string, {
  resumes: number
  jobAnalyses: number
  coverLetters: number
  coachingAccess: 'preview' | 'full'
  starVoiceSessions: number
  mockInterviewMinutes: number
  exports: boolean
  aiImprovements: boolean
}> = {
  [SUBSCRIPTION_TIERS.FREE]: {
    resumes: 1,
    jobAnalyses: 1,
    coverLetters: 1,
    coachingAccess: 'preview', // Some areas blurred
    starVoiceSessions: 0,
    mockInterviewMinutes: 0,
    exports: true, // But no AI improvements
    aiImprovements: false,
  },
  [SUBSCRIPTION_TIERS.BASIC]: {
    resumes: 5,
    jobAnalyses: Infinity,
    coverLetters: Infinity,
    coachingAccess: 'full',
    starVoiceSessions: 0,
    mockInterviewMinutes: 0,
    exports: true,
    aiImprovements: true,
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    resumes: 5,
    jobAnalyses: Infinity,
    coverLetters: Infinity,
    coachingAccess: 'full',
    starVoiceSessions: 6, // 6 sessions/month, 5 questions each = 30 total
    mockInterviewMinutes: 0,
    exports: true,
    aiImprovements: true,
  },
  [SUBSCRIPTION_TIERS.INTERVIEW_READY]: {
    resumes: 5,
    jobAnalyses: Infinity,
    coverLetters: Infinity,
    coachingAccess: 'full',
    starVoiceSessions: 10, // 10 sessions/month = 50 questions
    mockInterviewMinutes: 150, // 150 minutes/month
    exports: true,
    aiImprovements: true,
  }
}

// Add-on packs (for Pro & Interview Ready tiers)
export const ADDON_PACKS = [
  { id: 'mock_15', name: '+15 min Mock Interview', minutes: 15, price: 6, type: 'mock_minutes' as const },
  { id: 'mock_30', name: '+30 min Mock Interview', minutes: 30, price: 10, type: 'mock_minutes' as const },
  { id: 'star_5', name: '+5 STAR Voice Sessions', sessions: 5, price: 5, type: 'star_sessions' as const },
]

// Backward compatibility alias (deprecated - use ADDON_PACKS)
export const CREDIT_PACKS = ADDON_PACKS

// Interview personas
export const INTERVIEW_PERSONAS = [
  {
    id: 'emma-hr',
    name: 'Emma',
    role: 'Senior Recruiter',
    description: 'Warm and encouraging, focuses on cultural fit',
    avatar: '/images/personas/emma.jpg',
  },
  {
    id: 'james-manager',
    name: 'James',
    role: 'Hiring Manager',
    description: 'Direct and results-oriented, asks behavioral questions',
    avatar: '/images/personas/james.jpg',
  },
  {
    id: 'sato-tech',
    name: 'Sato',
    role: 'Tech Lead',
    description: 'Analytical and detail-focused, technical deep-dives',
    avatar: '/images/personas/sato.jpg',
  },
] as const

// Question categories
export const QUESTION_CATEGORIES = {
  BEHAVIORAL: 'behavioral',
  TECHNICAL: 'technical',
  LEADERSHIP: 'leadership',
  CONFLICT: 'conflict',
  CULTURE_FIT: 'culture-fit',
} as const

// STAR components
export const STAR_COMPONENTS = {
  SITUATION: 'situation',
  TASK: 'task',
  ACTION: 'action',
  RESULT: 'result',
} as const

// File upload limits
export const FILE_LIMITS = {
  RESUME_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_RESUME_TYPES: ['.pdf', '.docx', '.doc'],
  AUDIO_MAX_DURATION: 300, // 5 minutes in seconds
}

// API Rate limits (requests per minute)
export const RATE_LIMITS = {
  RESUME_ANALYSIS: 5,
  MOCK_INTERVIEW: 3,
  PRACTICE_SESSION: 10,
  TTS: 20,
  STT: 20,
}

// UI Constants
export const UI = {
  NAVBAR_HEIGHT: 64,
  SIDEBAR_WIDTH: 280,
  MAX_CONTENT_WIDTH: 1200,
}
