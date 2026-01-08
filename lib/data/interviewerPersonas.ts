// lib/data/interviewerPersonas.ts
// Interviewer Personas with voice mappings for ElevenLabs and OpenAI Realtime API

import { OpenAIVoice } from '@/lib/services/realtimeClient'

export interface InterviewerPersona {
  voice_id: string // ElevenLabs voice ID (legacy, used by Practice section)
  openai_voice: OpenAIVoice // OpenAI Realtime voice (used by Mock Interview)
  name: string
  gender: 'female' | 'male' | 'neutral'
  default_title: string
  personality: string
  age_range: string
  best_for: string[]
  voice_characteristics: string
  photoUrl: string // Interviewer headshot image path
  // Interview behavior settings
  style: 'friendly' | 'professional' | 'direct' | 'warm'
  warmth: number // 1-10
  strictness: number // 1-10
  backchannel_frequency: 'low' | 'medium' | 'high'
}

// ============================================================================
// FEMALE PERSONAS
// ============================================================================

export const FEMALE_PERSONAS: InterviewerPersona[] = [
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Professional, clear
    openai_voice: 'shimmer', // Polished, professional female
    name: 'Sarah Mitchell',
    gender: 'female',
    default_title: 'Senior Recruiter',
    personality: 'Professional, warm, encouraging',
    age_range: '30-40',
    best_for: ['corporate', 'tech', 'consulting', 'finance'],
    voice_characteristics: 'Clear, articulate, confident',
    photoUrl: '/images/interviewers/sarah_mitchell.jpg',
    style: 'professional',
    warmth: 7,
    strictness: 5,
    backchannel_frequency: 'medium'
  },
  {
    voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel - Friendly, engaging
    openai_voice: 'coral', // Warm, friendly female
    name: 'Emily Johnson',
    gender: 'female',
    default_title: 'Talent Acquisition Manager',
    personality: 'Friendly, conversational, empathetic',
    age_range: '25-35',
    best_for: ['startups', 'creative', 'marketing', 'design'],
    voice_characteristics: 'Warm, engaging, approachable',
    photoUrl: '/images/interviewers/emily_johnson.jpg',
    style: 'friendly',
    warmth: 9,
    strictness: 3,
    backchannel_frequency: 'high'
  },
  {
    voice_id: 'ThT5KcBeYPX3keUQqHPh', // Dorothy - Mature, experienced
    openai_voice: 'ballad', // Mature, authoritative female
    name: 'Jennifer Davis',
    gender: 'female',
    default_title: 'VP of People',
    personality: 'Experienced, authoritative, insightful',
    age_range: '40-50',
    best_for: ['executive', 'leadership', 'c-suite', 'board'],
    voice_characteristics: 'Mature, confident, commanding',
    photoUrl: '/images/interviewers/jennifer_davis.jpg',
    style: 'direct',
    warmth: 5,
    strictness: 8,
    backchannel_frequency: 'low'
  },
  {
    voice_id: 'MF3mGyEYCl7XYWbV9V6O', // Elli - Youthful, energetic
    openai_voice: 'coral', // Youthful, energetic
    name: 'Megan Parker',
    gender: 'female',
    default_title: 'HR Coordinator',
    personality: 'Energetic, enthusiastic, supportive',
    age_range: '22-30',
    best_for: ['entry-level', 'internships', 'junior roles'],
    voice_characteristics: 'Young, energetic, enthusiastic',
    photoUrl: '/images/interviewers/megan_parker.jpg',
    style: 'friendly',
    warmth: 9,
    strictness: 2,
    backchannel_frequency: 'high'
  },
  {
    voice_id: 'jsCqWAovK2LkecY7zXl4', // Freya - British, sophisticated
    openai_voice: 'marin', // Refined, balanced (OpenAI recommended)
    name: 'Charlotte Williams',
    gender: 'female',
    default_title: 'Global Talent Director',
    personality: 'Sophisticated, polished, worldly',
    age_range: '35-45',
    best_for: ['international', 'consulting', 'luxury brands'],
    voice_characteristics: 'British accent, refined, articulate',
    photoUrl: '/images/interviewers/charlotte_williams.jpg',
    style: 'professional',
    warmth: 6,
    strictness: 6,
    backchannel_frequency: 'medium'
  }
]

// ============================================================================
// MALE PERSONAS
// ============================================================================

export const MALE_PERSONAS: InterviewerPersona[] = [
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam - Clear, direct
    openai_voice: 'ash', // Professional, measured male
    name: 'Michael Chen',
    gender: 'male',
    default_title: 'Senior Recruiter',
    personality: 'Direct, clear, analytical',
    age_range: '30-40',
    best_for: ['tech', 'engineering', 'data science', 'analytics'],
    voice_characteristics: 'Clear, confident, articulate',
    photoUrl: '/images/interviewers/michael_chen.jpg',
    style: 'direct',
    warmth: 5,
    strictness: 7,
    backchannel_frequency: 'low'
  },
  {
    voice_id: 'yoZ06aMxZJJ28mfd3POQ', // Sam - Casual, friendly
    openai_voice: 'verse', // Approachable, friendly male
    name: 'David Williams',
    gender: 'male',
    default_title: 'Hiring Manager',
    personality: 'Casual, relaxed, collaborative',
    age_range: '35-45',
    best_for: ['startups', 'product', 'creative', 'remote companies'],
    voice_characteristics: 'Casual, approachable, friendly',
    photoUrl: '/images/interviewers/david_williams.jpg',
    style: 'friendly',
    warmth: 8,
    strictness: 3,
    backchannel_frequency: 'high'
  },
  {
    voice_id: '29vD33N1CtxCmqQRPOHJ', // Drew - Professional, deep
    openai_voice: 'echo', // Direct, efficient male
    name: 'James Anderson',
    gender: 'male',
    default_title: 'Director of Engineering',
    personality: 'Technical, thorough, thoughtful',
    age_range: '40-50',
    best_for: ['engineering', 'architecture', 'technical leadership'],
    voice_characteristics: 'Deep, authoritative, technical',
    photoUrl: '/images/interviewers/james_anderson.jpg',
    style: 'direct',
    warmth: 4,
    strictness: 8,
    backchannel_frequency: 'low'
  },
  {
    voice_id: 'VR6AewLTigWG4xSOukaG', // Arnold - Mature, commanding
    openai_voice: 'sage', // Mature, commanding male
    name: 'Robert Thompson',
    gender: 'male',
    default_title: 'Chief People Officer',
    personality: 'Commanding, strategic, experienced',
    age_range: '45-55',
    best_for: ['executive', 'c-suite', 'board', 'senior leadership'],
    voice_characteristics: 'Mature, commanding, strategic',
    photoUrl: '/images/interviewers/robert_thompson.jpg',
    style: 'professional',
    warmth: 4,
    strictness: 9,
    backchannel_frequency: 'low'
  },
  {
    voice_id: 'TxGEqnHWrfWFTfGW9XjX', // Josh - Energetic, young
    openai_voice: 'alloy', // Youthful, energetic male
    name: 'Alex Martinez',
    gender: 'male',
    default_title: 'Talent Scout',
    personality: 'Energetic, modern, tech-savvy',
    age_range: '25-35',
    best_for: ['tech startups', 'gaming', 'social media', 'web3'],
    voice_characteristics: 'Young, energetic, modern',
    photoUrl: '/images/interviewers/alex_martinez.jpg',
    style: 'friendly',
    warmth: 8,
    strictness: 3,
    backchannel_frequency: 'high'
  },
  {
    voice_id: 'IKne3meq5aSn9XLyUdCD', // Charlie - British, charming
    openai_voice: 'cedar', // Refined, balanced (OpenAI recommended)
    name: 'Oliver Bennett',
    gender: 'male',
    default_title: 'Global Recruitment Lead',
    personality: 'Charming, sophisticated, worldly',
    age_range: '35-45',
    best_for: ['consulting', 'finance', 'international roles'],
    voice_characteristics: 'British accent, charming, polished',
    photoUrl: '/images/interviewers/oliver_bennett.jpg',
    style: 'professional',
    warmth: 6,
    strictness: 6,
    backchannel_frequency: 'medium'
  }
]

// ============================================================================
// ALL PERSONAS
// ============================================================================

export const ALL_PERSONAS = [...FEMALE_PERSONAS, ...MALE_PERSONAS]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get persona by voice ID
 */
export function getPersonaByVoiceId(voiceId: string): InterviewerPersona | undefined {
  return ALL_PERSONAS.find(p => p.voice_id === voiceId)
}

/**
 * Get personas by gender
 */
export function getPersonasByGender(gender: 'female' | 'male' | 'any'): InterviewerPersona[] {
  if (gender === 'any') {
    return ALL_PERSONAS
  }
  return ALL_PERSONAS.filter(p => p.gender === gender)
}

/**
 * Get persona by name
 */
export function getPersonaByName(name: string): InterviewerPersona | undefined {
  return ALL_PERSONAS.find(p => p.name.toLowerCase() === name.toLowerCase())
}

/**
 * Get recommended persona for job type
 */
export function getRecommendedPersona(jobTitle?: string, companyType?: string): InterviewerPersona {
  const jobLower = jobTitle?.toLowerCase() || ''
  const companyLower = companyType?.toLowerCase() || ''

  // Executive/Leadership roles
  if (jobLower.match(/ceo|cto|vp|director|chief|head of|executive/)) {
    return FEMALE_PERSONAS.find(p => p.name === 'Jennifer Davis') || MALE_PERSONAS.find(p => p.name === 'Robert Thompson') || FEMALE_PERSONAS[0]
  }

  // Engineering/Technical roles
  if (jobLower.match(/engineer|developer|architect|backend|frontend|full stack|devops|sre/)) {
    return MALE_PERSONAS.find(p => p.name === 'Michael Chen') || MALE_PERSONAS.find(p => p.name === 'James Anderson') || MALE_PERSONAS[0]
  }

  // Design/Creative roles
  if (jobLower.match(/designer|creative|artist|ux|ui|brand/)) {
    return FEMALE_PERSONAS.find(p => p.name === 'Emily Johnson') || FEMALE_PERSONAS[1]
  }

  // Startups
  if (companyLower.match(/startup|early stage|series a|series b|seed/)) {
    return MALE_PERSONAS.find(p => p.name === 'David Williams') || FEMALE_PERSONAS.find(p => p.name === 'Emily Johnson') || FEMALE_PERSONAS[1]
  }

  // Consulting/Finance
  if (jobLower.match(/consultant|analyst|advisor|finance|banking|investment/) || companyLower.match(/consulting|mckinsey|bcg|bain/)) {
    return FEMALE_PERSONAS.find(p => p.name === 'Charlotte Williams') || MALE_PERSONAS.find(p => p.name === 'Oliver Bennett') || FEMALE_PERSONAS[0]
  }

  // Entry-level positions
  if (jobLower.match(/junior|entry|intern|associate|coordinator/)) {
    return FEMALE_PERSONAS.find(p => p.name === 'Megan Parker') || MALE_PERSONAS.find(p => p.name === 'Alex Martinez') || FEMALE_PERSONAS[3]
  }

  // Default: professional mid-career recruiter
  return FEMALE_PERSONAS[0] // Sarah Mitchell
}

/**
 * Adjust persona title based on job context
 */
export function getPersonaTitle(persona: InterviewerPersona, jobTitle?: string, companyName?: string): string {
  if (!jobTitle) {
    return persona.default_title
  }

  const jobLower = jobTitle.toLowerCase()

  // Engineering roles
  if (jobLower.match(/engineer|developer|architect/)) {
    return 'Engineering Manager'
  }

  // Product roles
  if (jobLower.match(/product|pm|product manager/)) {
    return 'Product Hiring Lead'
  }

  // Design roles
  if (jobLower.match(/designer|ux|ui/)) {
    return 'Design Lead'
  }

  // Data roles
  if (jobLower.match(/data|analyst|scientist/)) {
    return 'Data Team Lead'
  }

  // Marketing roles
  if (jobLower.match(/marketing|growth|content/)) {
    return 'Marketing Recruiter'
  }

  // Sales roles
  if (jobLower.match(/sales|account|business development/)) {
    return 'Sales Talent Partner'
  }

  // Operations roles
  if (jobLower.match(/operations|ops|logistics/)) {
    return 'Operations Hiring Manager'
  }

  // Leadership roles
  if (jobLower.match(/director|vp|chief|head of/)) {
    return 'Executive Recruiter'
  }

  // Default
  return persona.default_title
}

/**
 * Get full interviewer introduction
 */
export function getInterviewerIntroduction(
  persona: InterviewerPersona,
  companyName?: string,
  jobTitle?: string
): string {
  const title = getPersonaTitle(persona, jobTitle, companyName)
  const company = companyName || 'our company'

  return `I'm ${persona.name}, ${title} at ${company}.`
}

/**
 * Get persona description for UI
 */
export function getPersonaDescription(persona: InterviewerPersona): string {
  return `${persona.name} is ${persona.personality.toLowerCase()}, with a ${persona.voice_characteristics.toLowerCase()} voice. Best for ${persona.best_for.slice(0, 2).join(' and ')} roles.`
}

/**
 * Get default persona (fallback)
 */
export function getDefaultPersona(): InterviewerPersona {
  return FEMALE_PERSONAS[0] // Sarah Mitchell - Professional default
}

/**
 * Validate voice ID exists
 */
export function isValidVoiceId(voiceId: string): boolean {
  return ALL_PERSONAS.some(p => p.voice_id === voiceId)
}

/**
 * Get random persona (for testing/demo)
 */
export function getRandomPersona(gender?: 'female' | 'male'): InterviewerPersona {
  const personas = gender ? getPersonasByGender(gender) : ALL_PERSONAS
  return personas[Math.floor(Math.random() * personas.length)]
}
