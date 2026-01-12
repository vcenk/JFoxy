// lib/data/backchannelPhrases.ts
// Natural Backchanneling Phrases for Active Listening

export interface BackchannelPhrase {
  text: string
  type: 'acknowledgment' | 'encouragement' | 'thinking' | 'understanding' | 'surprise' | 'agreement'
  duration_estimate: number  // milliseconds
  appropriate_after: number  // seconds of user speaking
}

// ============================================================================
// BACKCHANNELING PHRASES
// ============================================================================

export const BACKCHANNEL_PHRASES: BackchannelPhrase[] = [
  // === ACKNOWLEDGMENTS (showing you're listening) ===
  {
    text: 'Mhm',
    type: 'acknowledgment',
    duration_estimate: 500,
    appropriate_after: 10
  },
  {
    text: 'Uh-huh',
    type: 'acknowledgment',
    duration_estimate: 600,
    appropriate_after: 10
  },
  {
    text: 'Mm-hmm',
    type: 'acknowledgment',
    duration_estimate: 600,
    appropriate_after: 12
  },
  {
    text: 'Yeah',
    type: 'acknowledgment',
    duration_estimate: 500,
    appropriate_after: 15
  },

  // === UNDERSTANDING (showing comprehension) ===
  {
    text: 'I see',
    type: 'understanding',
    duration_estimate: 800,
    appropriate_after: 15
  },
  {
    text: 'Got it',
    type: 'understanding',
    duration_estimate: 800,
    appropriate_after: 18
  },
  {
    text: 'Gotcha',
    type: 'understanding',
    duration_estimate: 800,
    appropriate_after: 18
  },
  {
    text: 'Okay',
    type: 'understanding',
    duration_estimate: 700,
    appropriate_after: 15
  },
  {
    text: 'Right',
    type: 'understanding',
    duration_estimate: 600,
    appropriate_after: 16
  },
  {
    text: 'Understood',
    type: 'understanding',
    duration_estimate: 900,
    appropriate_after: 20
  },
  {
    text: 'I understand',
    type: 'understanding',
    duration_estimate: 1000,
    appropriate_after: 20
  },
  {
    text: 'Makes sense',
    type: 'understanding',
    duration_estimate: 1000,
    appropriate_after: 18
  },
  {
    text: 'That makes sense',
    type: 'understanding',
    duration_estimate: 1200,
    appropriate_after: 20
  },

  // === ENCOURAGEMENT (showing interest, engagement) ===
  {
    text: 'Interesting',
    type: 'encouragement',
    duration_estimate: 1200,
    appropriate_after: 20
  },
  {
    text: 'Oh, interesting',
    type: 'encouragement',
    duration_estimate: 1500,
    appropriate_after: 22
  },
  {
    text: 'That\'s interesting',
    type: 'encouragement',
    duration_estimate: 1500,
    appropriate_after: 25
  },
  {
    text: 'Great',
    type: 'encouragement',
    duration_estimate: 700,
    appropriate_after: 18
  },
  {
    text: 'Nice',
    type: 'encouragement',
    duration_estimate: 600,
    appropriate_after: 18
  },
  {
    text: 'Good point',
    type: 'encouragement',
    duration_estimate: 1000,
    appropriate_after: 20
  },
  {
    text: 'That\'s a good point',
    type: 'encouragement',
    duration_estimate: 1500,
    appropriate_after: 25
  },
  {
    text: 'Absolutely',
    type: 'encouragement',
    duration_estimate: 1000,
    appropriate_after: 18
  },
  {
    text: 'Exactly',
    type: 'encouragement',
    duration_estimate: 900,
    appropriate_after: 16
  },

  // === THINKING (showing contemplation) ===
  {
    text: 'Hmm',
    type: 'thinking',
    duration_estimate: 800,
    appropriate_after: 20
  },
  {
    text: 'Hmm',
    type: 'thinking',
    duration_estimate: 1500,
    appropriate_after: 25
  },
  {
    text: 'I see what you mean',
    type: 'thinking',
    duration_estimate: 1500,
    appropriate_after: 20
  },

  // === SURPRISE/INTEREST (showing engagement) ===
  {
    text: 'Oh wow',
    type: 'surprise',
    duration_estimate: 1000,
    appropriate_after: 20
  },
  {
    text: 'Really?',
    type: 'surprise',
    duration_estimate: 900,
    appropriate_after: 18
  },
  {
    text: 'Oh, really?',
    type: 'surprise',
    duration_estimate: 1200,
    appropriate_after: 20
  },
  {
    text: 'That\'s impressive',
    type: 'surprise',
    duration_estimate: 1500,
    appropriate_after: 25
  },
  {
    text: 'Wow',
    type: 'surprise',
    duration_estimate: 700,
    appropriate_after: 18
  },

  // === AGREEMENT (showing alignment) ===
  {
    text: 'True',
    type: 'agreement',
    duration_estimate: 600,
    appropriate_after: 16
  },
  {
    text: 'That\'s true',
    type: 'agreement',
    duration_estimate: 1000,
    appropriate_after: 18
  },
  {
    text: 'Fair point',
    type: 'agreement',
    duration_estimate: 1000,
    appropriate_after: 18
  },
  {
    text: 'I agree',
    type: 'agreement',
    duration_estimate: 900,
    appropriate_after: 18
  },
  {
    text: 'Definitely',
    type: 'agreement',
    duration_estimate: 1000,
    appropriate_after: 18
  }
]

// ============================================================================
// RESPONSE CLOSERS (after user finishes answer)
// ============================================================================

export const RESPONSE_CLOSERS: string[] = [
  'Interesting! [pause]',
  'Great! [pause]',
  'Got it. [pause]',
  'I see. [pause]',
  'That makes sense. [pause]',
  'Understood. [pause]',
  'Good to know. [pause]',
  'Thanks for sharing that. [pause]',
  'I appreciate that answer. [pause]',
  'Alright. [pause]',
  'Okay, great. [pause]',
  'Perfect. [pause]',
  'That\'s helpful. [pause]',
  'Good example. [pause]',
  'Nice. [pause]'
]

// ============================================================================
// TRANSITION PHRASES (moving to next question)
// ============================================================================

export const TRANSITION_PHRASES: string[] = [
  'Alright, [pause] let\'s move on to the next question.',
  'Okay, [pause] let\'s talk about something else.',
  'Great. [pause] I have another question for you.',
  'Got it. [pause] Let me ask you about something different.',
  'Understood. [pause] Moving on.',
  'Perfect. [pause] Next question.',
  'Thanks. [pause] Let\'s shift gears.',
  'Interesting. [pause] I want to ask you about something else now.',
  'Good. [pause] Let\'s explore another area.',
  'Alright, [pause] so next up...'
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get random backchannel phrase by type
 */
export function getBackchannelByType(type: BackchannelPhrase['type']): BackchannelPhrase {
  const phrases = BACKCHANNEL_PHRASES.filter(p => p.type === type)
  return phrases[Math.floor(Math.random() * phrases.length)]
}

/**
 * Get random backchannel (any type)
 */
export function getRandomBackchannel(): BackchannelPhrase {
  return BACKCHANNEL_PHRASES[Math.floor(Math.random() * BACKCHANNEL_PHRASES.length)]
}

/**
 * Get weighted random backchannel (common ones more likely)
 * Acknowledgments are most common (60%)
 * Understanding (25%)
 * Encouragement (10%)
 * Others (5%)
 */
export function getWeightedBackchannel(): BackchannelPhrase {
  const random = Math.random()

  if (random < 0.60) {
    // 60% chance: acknowledgment (Mhm, Uh-huh, Yeah)
    return getBackchannelByType('acknowledgment')
  } else if (random < 0.85) {
    // 25% chance: understanding (I see, Got it, Makes sense)
    return getBackchannelByType('understanding')
  } else if (random < 0.95) {
    // 10% chance: encouragement (Interesting, Great, Nice)
    return getBackchannelByType('encouragement')
  } else {
    // 5% chance: thinking, surprise, or agreement
    const types: BackchannelPhrase['type'][] = ['thinking', 'surprise', 'agreement']
    const type = types[Math.floor(Math.random() * types.length)]
    return getBackchannelByType(type)
  }
}

/**
 * Get appropriate backchannel based on time elapsed
 * Returns backchannel phrase appropriate for how long user has been speaking
 */
export function getBackchannelForDuration(secondsElapsed: number): BackchannelPhrase | null {
  // First 10 seconds: no backchanneling (let user get started)
  if (secondsElapsed < 10) {
    return null
  }

  // 10-15 seconds: acknowledgments only (Mhm, Uh-huh)
  if (secondsElapsed < 15) {
    return getBackchannelByType('acknowledgment')
  }

  // 15-25 seconds: acknowledgments or understanding
  if (secondsElapsed < 25) {
    const types: BackchannelPhrase['type'][] = ['acknowledgment', 'understanding']
    const type = types[Math.floor(Math.random() * types.length)]
    return getBackchannelByType(type)
  }

  // 25+ seconds: weighted random (any type appropriate)
  return getWeightedBackchannel()
}

/**
 * Get response closer (after user finishes answer)
 */
export function getResponseCloser(): string {
  return RESPONSE_CLOSERS[Math.floor(Math.random() * RESPONSE_CLOSERS.length)]
}

/**
 * Get transition phrase (moving to next question)
 */
export function getTransitionPhrase(): string {
  return TRANSITION_PHRASES[Math.floor(Math.random() * TRANSITION_PHRASES.length)]
}

/**
 * Calculate backchanneling schedule
 * Returns array of timestamps (in seconds) when to inject backchannels
 */
export function calculateBackchannelSchedule(expectedDurationSeconds: number): number[] {
  const schedule: number[] = []
  let current = 12 // Start after 12 seconds

  while (current < expectedDurationSeconds - 5) { // Stop 5 seconds before end
    schedule.push(current)
    current += 15 + Math.random() * 10 // 15-25 second intervals
  }

  return schedule
}

/**
 * Get all backchannel types
 */
export function getAllBackchannelTypes(): BackchannelPhrase['type'][] {
  return ['acknowledgment', 'encouragement', 'thinking', 'understanding', 'surprise', 'agreement']
}

/**
 * Get short backchannels (< 1 second duration)
 * Best for frequent use
 */
export function getShortBackchannels(): BackchannelPhrase[] {
  return BACKCHANNEL_PHRASES.filter(p => p.duration_estimate < 1000)
}

/**
 * Get long backchannels (>= 1 second duration)
 * Best for occasional use
 */
export function getLongBackchannels(): BackchannelPhrase[] {
  return BACKCHANNEL_PHRASES.filter(p => p.duration_estimate >= 1000)
}

/**
 * Should backchannel now?
 * Returns true if enough time has passed since last backchannel
 */
export function shouldBackchannelNow(
  secondsSinceLastBackchannel: number,
  secondsUserSpeaking: number
): boolean {
  // Don't backchannel in first 10 seconds
  if (secondsUserSpeaking < 10) {
    return false
  }

  // After first backchannel, wait at least 12 seconds before next one
  if (secondsSinceLastBackchannel < 12) {
    return false
  }

  // Ideal range: 15-20 seconds between backchannels
  if (secondsSinceLastBackchannel >= 15 && secondsSinceLastBackchannel <= 20) {
    return Math.random() < 0.7 // 70% chance
  }

  // After 20 seconds, definitely backchannel
  if (secondsSinceLastBackchannel > 20) {
    return true
  }

  return false
}

/**
 * Get backchannel statistics (for debugging)
 */
export function getBackchannelStats(): {
  total: number
  byType: Record<string, number>
  avgDuration: number
} {
  const stats: {
    total: number
    byType: Record<string, number>
    avgDuration: number
  } = {
    total: BACKCHANNEL_PHRASES.length,
    byType: {},
    avgDuration: 0
  }

  BACKCHANNEL_PHRASES.forEach(phrase => {
    stats.byType[phrase.type] = (stats.byType[phrase.type] || 0) + 1
  })

  stats.avgDuration = BACKCHANNEL_PHRASES.reduce((sum, p) => sum + p.duration_estimate, 0) / BACKCHANNEL_PHRASES.length

  return stats
}
