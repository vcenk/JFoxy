// lib/config/constants.ts - Application constants

export const APP_NAME = 'Job Foxy'
export const APP_DESCRIPTION = 'AI-Powered Interview Preparation Platform'

// Subscription plans
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
} as const

export const PLAN_LIMITS = {
  free: {
    resumeAnalyses: 3,
    practiceSessionsPerMonth: 5,
    mockInterviewsPerMonth: 1,
    starStories: 10,
    coverLetters: 2,
  },
  pro: {
    resumeAnalyses: Infinity,
    practiceSessionsPerMonth: Infinity,
    mockInterviewsPerMonth: Infinity,
    starStories: Infinity,
    coverLetters: Infinity,
  },
}

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
