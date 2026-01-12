// lib/data/powerWords.ts
// Comprehensive Power Words Database for ATS-Optimized Resume Writing
// Based on TealHQ's 900+ resume synonyms and 195+ power words

/**
 * Power word synonyms for common resume words
 * Source: https://www.tealhq.com/resume-synonyms
 */
export const POWER_WORD_SYNONYMS: Record<string, string[]> = {
  // Achievement & Results
  'achieved': ['Accomplished', 'Attained', 'Realized', 'Delivered', 'Secured'],
  'improved': ['Enhanced', 'Optimized', 'Augmented', 'Elevated', 'Strengthened', 'Upgraded', 'Refined'],
  'increased': ['Amplified', 'Expanded', 'Boosted', 'Accelerated', 'Magnified', 'Escalated', 'Intensified'],
  'decreased': ['Reduced', 'Minimized', 'Streamlined', 'Curtailed', 'Condensed', 'Diminished'],
  'optimized': ['Elevated', 'Advanced', 'Upgraded', 'Refined', 'Perfected', 'Fine-tuned'],
  'maximized': ['Optimized', 'Streamlined', 'Capitalized', 'Leveraged', 'Exploited'],
  'grew': ['Expanded', 'Scaled', 'Multiplied', 'Developed', 'Built'],

  // Leadership & Management
  'managed': ['Orchestrated', 'Directed', 'Spearheaded', 'Supervised', 'Coordinated', 'Oversaw', 'Governed'],
  'led': ['Spearheaded', 'Directed', 'Guided', 'Championed', 'Pioneered', 'Steered'],
  'created': ['Pioneered', 'Established', 'Launched', 'Instituted', 'Originated', 'Founded', 'Conceived'],
  'organized': ['Orchestrated', 'Structured', 'Coordinated', 'Systematized', 'Arranged'],
  'oversaw': ['Supervised', 'Monitored', 'Managed', 'Directed', 'Administered'],

  // Technical & Development
  'developed': ['Engineered', 'Designed', 'Built', 'Created', 'Architected', 'Constructed', 'Programmed'],
  'built': ['Constructed', 'Developed', 'Created', 'Engineered', 'Assembled', 'Fabricated'],
  'programmed': ['Coded', 'Developed', 'Engineered', 'Scripted', 'Implemented'],
  'designed': ['Architected', 'Engineered', 'Conceptualized', 'Devised', 'Crafted', 'Formulated'],
  'implemented': ['Executed', 'Deployed', 'Installed', 'Integrated', 'Launched', 'Rolled out'],

  // Analysis & Strategy
  'analyzed': ['Evaluated', 'Assessed', 'Examined', 'Investigated', 'Reviewed', 'Studied'],
  'researched': ['Investigated', 'Explored', 'Examined', 'Studied', 'Analyzed'],
  'identified': ['Discovered', 'Detected', 'Pinpointed', 'Recognized', 'Uncovered'],
  'evaluated': ['Assessed', 'Appraised', 'Analyzed', 'Judged', 'Measured'],

  // Communication & Collaboration
  'presented': ['Delivered', 'Communicated', 'Showcased', 'Demonstrated', 'Exhibited'],
  'communicated': ['Conveyed', 'Articulated', 'Presented', 'Relayed', 'Expressed'],
  'collaborated': ['Partnered', 'Cooperated', 'Teamed', 'Allied', 'United'],
  'coordinated': ['Orchestrated', 'Organized', 'Synchronized', 'Aligned', 'Harmonized'],
  'negotiated': ['Brokered', 'Mediated', 'Bargained', 'Settled', 'Arranged'],

  // Customer & Service
  'helped': ['Enabled', 'Facilitated', 'Empowered', 'Supported', 'Aided'],
  'served': ['Assisted', 'Supported', 'Helped', 'Catered to', 'Attended'],
  'supported': ['Championed', 'Enabled', 'Facilitated', 'Bolstered', 'Strengthened'],

  // Financial & Business
  'saved': ['Conserved', 'Preserved', 'Reduced costs by', 'Cut expenses by'],
  'generated': ['Produced', 'Created', 'Yielded', 'Delivered', 'Secured'],
  'sold': ['Marketed', 'Promoted', 'Closed', 'Secured', 'Negotiated'],

  // Weak phrase alternatives
  'responsible for': ['Spearheaded', 'Led', 'Managed', 'Directed', 'Oversaw'],
  'assisted': ['Collaborated on', 'Contributed to', 'Partnered in', 'Supported', 'Enabled'],
  'assisted in': ['Collaborated on', 'Contributed to', 'Partnered in', 'Co-developed'],
  'assisted with': ['Collaborated on', 'Contributed to', 'Partnered with'],
  'provided': ['Delivered', 'Supplied', 'Furnished', 'Equipped', 'Offered'],
  'provided support': ['Enabled', 'Empowered', 'Facilitated', 'Bolstered'],
  'participated in': ['Contributed to', 'Engaged in', 'Collaborated on'],
  'worked on': ['Developed', 'Built', 'Created', 'Crafted', 'Engineered'],
  'worked with': ['Collaborated with', 'Partnered with', 'Teamed with'],
  'was responsible': ['Oversaw', 'Managed', 'Directed', 'Led'],
  'tasked with': ['Entrusted to', 'Charged with', 'Commissioned to'],
  'in charge of': ['Directed', 'Managed', 'Oversaw', 'Supervised'],
  'as required': ['strategically', 'proactively', 'as priorities demanded'],
  'as needed': ['strategically', 'proactively', 'on demand'],
}

/**
 * Weak words and phrases to avoid in resumes
 * These will be highlighted with suggestions for stronger alternatives
 */
export const WEAK_WORDS = [
  // Common weak starters
  'responsible for',
  'duties included',
  'duties include',
  'worked on',
  'worked with',
  'helped with',
  'helped to',
  'assisted in',
  'assisted with',
  'was tasked with',
  'tasked with',
  'in charge of',

  // Weak verbs (when starting a bullet)
  'provided support',
  'provided assistance',
  'gave support',
  'participated in',
  'was involved in',
  'involved in',
  'took part in',

  // Vague quantifiers
  'various',
  'many',
  'several',
  'numerous',
  'some',
  'a lot of',
  'multiple',

  // Weak action words
  'did',
  'made',
  'got',
  'tried to',
  'attempted to',
  'sought to',
  'aimed to',
  'worked to',

  // Passive phrases
  'was responsible',
  'was assigned',
  'was given',
  'was part of',

  // Filler phrases
  'on a daily basis',
  'day-to-day',
  'etc.',
  'and so on',
  'as needed',
  'as required',
]

/**
 * Action verbs categorized by skill type
 * Source: https://www.tealhq.com/post/resume-power-words
 */
export const ACTION_VERBS = {
  // Leadership (20 words)
  leadership: [
    'Spearheaded', 'Championed', 'Led', 'Directed', 'Orchestrated',
    'Mentored', 'Coached', 'Cultivated', 'Empowered', 'Delegated',
    'Mobilized', 'Galvanized', 'Rallied', 'Unified', 'Aligned',
    'Inspired', 'Motivated', 'Guided', 'Pioneered', 'Steered',
  ],

  // Achievement (25 words)
  achievement: [
    'Achieved', 'Accomplished', 'Attained', 'Delivered', 'Exceeded',
    'Surpassed', 'Outperformed', 'Accelerated', 'Advanced', 'Amplified',
    'Boosted', 'Enhanced', 'Improved', 'Increased', 'Maximized',
    'Optimized', 'Strengthened', 'Transformed', 'Upgraded', 'Elevated',
    'Revolutionized', 'Modernized', 'Revitalized', 'Streamlined', 'Refined',
  ],

  // Technical (30 words)
  technical: [
    'Engineered', 'Architected', 'Developed', 'Programmed', 'Automated',
    'Integrated', 'Deployed', 'Configured', 'Debugged', 'Troubleshot',
    'Migrated', 'Refactored', 'Containerized', 'Orchestrated', 'Implemented',
    'Designed', 'Built', 'Coded', 'Scripted', 'Tested',
    'Validated', 'Compiled', 'Executed', 'Launched', 'Released',
    'Maintained', 'Upgraded', 'Patched', 'Secured', 'Encrypted',
  ],

  // Analytical (25 words)
  analytical: [
    'Analyzed', 'Evaluated', 'Assessed', 'Diagnosed', 'Investigated',
    'Researched', 'Examined', 'Reviewed', 'Audited', 'Inspected',
    'Forecasted', 'Projected', 'Modeled', 'Predicted', 'Quantified',
    'Measured', 'Calculated', 'Computed', 'Estimated', 'Determined',
    'Identified', 'Discovered', 'Uncovered', 'Detected', 'Pinpointed',
  ],

  // Communication (20 words)
  communication: [
    'Presented', 'Communicated', 'Articulated', 'Conveyed', 'Expressed',
    'Delivered', 'Briefed', 'Reported', 'Documented', 'Published',
    'Authored', 'Composed', 'Wrote', 'Drafted', 'Edited',
    'Negotiated', 'Persuaded', 'Influenced', 'Advocated', 'Consulted',
  ],

  // Collaboration (15 words)
  collaboration: [
    'Collaborated', 'Partnered', 'Cooperated', 'Coordinated', 'Facilitated',
    'Liaised', 'Interfaced', 'Engaged', 'Contributed', 'Participated',
    'Supported', 'Assisted', 'Aided', 'Helped', 'Enabled',
  ],

  // Management (20 words)
  management: [
    'Managed', 'Supervised', 'Oversaw', 'Directed', 'Administered',
    'Controlled', 'Regulated', 'Governed', 'Organized', 'Planned',
    'Scheduled', 'Coordinated', 'Allocated', 'Assigned', 'Distributed',
    'Prioritized', 'Delegated', 'Monitored', 'Tracked', 'Reviewed',
  ],

  // Innovation (15 words)
  innovation: [
    'Innovated', 'Invented', 'Created', 'Pioneered', 'Originated',
    'Conceived', 'Designed', 'Devised', 'Formulated', 'Established',
    'Launched', 'Introduced', 'Initiated', 'Founded', 'Instituted',
  ],

  // Problem-Solving (15 words)
  problemSolving: [
    'Resolved', 'Solved', 'Fixed', 'Troubleshot', 'Debugged',
    'Corrected', 'Rectified', 'Remedied', 'Addressed', 'Mitigated',
    'Eliminated', 'Prevented', 'Avoided', 'Reduced', 'Minimized',
  ],

  // Financial (20 words)
  financial: [
    'Generated', 'Produced', 'Yielded', 'Earned', 'Secured',
    'Captured', 'Obtained', 'Acquired', 'Procured', 'Negotiated',
    'Budgeted', 'Forecasted', 'Allocated', 'Invested', 'Monetized',
    'Capitalized', 'Profited', 'Saved', 'Reduced costs', 'Cut expenses',
  ],
}

/**
 * Impact metrics templates for quantifying achievements
 */
export const IMPACT_METRICS = {
  // Percentage-based
  percentage: [
    'Increased [metric] by [X]%',
    'Reduced [metric] by [X]%',
    'Improved [metric] by [X]%',
    'Grew [metric] by [X]%',
    'Decreased [metric] by [X]%',
  ],

  // Dollar-based
  financial: [
    'Generated $[X] in [timeframe]',
    'Saved $[X] annually',
    'Increased revenue by $[X]',
    'Reduced costs by $[X]',
    'Managed $[X] budget',
  ],

  // Time-based
  time: [
    'Reduced processing time from [X] to [Y]',
    'Completed [X] ahead of schedule',
    'Accelerated delivery by [X] days/weeks',
    'Decreased turnaround time by [X]%',
  ],

  // Scale/Volume
  scale: [
    'Managed team of [X] people',
    'Served [X]+ clients/customers',
    'Processed [X]+ transactions',
    'Handled [X] cases/projects',
    'Oversaw [X] direct reports',
  ],

  // Performance
  performance: [
    'Exceeded targets by [X]%',
    'Ranked #[X] out of [Y]',
    'Achieved [X]% customer satisfaction',
    'Maintained [X]% uptime/accuracy',
    'Scored [X]% on [metric]',
  ],
}

/**
 * Industry-specific power words
 */
export const INDUSTRY_POWER_WORDS = {
  technology: [
    'Engineered', 'Architected', 'Developed', 'Deployed', 'Automated',
    'Optimized', 'Scaled', 'Integrated', 'Migrated', 'Refactored',
    'Containerized', 'Orchestrated', 'Debugged', 'Troubleshot',
  ],

  finance: [
    'Forecasted', 'Budgeted', 'Analyzed', 'Audited', 'Reconciled',
    'Allocated', 'Projected', 'Modeled', 'Evaluated', 'Assessed',
    'Capitalized', 'Monetized', 'Invested', 'Generated',
  ],

  marketing: [
    'Launched', 'Promoted', 'Branded', 'Positioned', 'Targeted',
    'Optimized', 'Converted', 'Engaged', 'Influenced', 'Amplified',
    'Segmented', 'Personalized', 'Monetized', 'Scaled',
  ],

  sales: [
    'Closed', 'Prospected', 'Negotiated', 'Exceeded', 'Generated',
    'Captured', 'Converted', 'Retained', 'Expanded', 'Upsold',
    'Cross-sold', 'Secured', 'Achieved', 'Surpassed',
  ],

  healthcare: [
    'Diagnosed', 'Treated', 'Administered', 'Monitored', 'Assessed',
    'Evaluated', 'Implemented', 'Coordinated', 'Educated', 'Counseled',
    'Documented', 'Collaborated', 'Advocated', 'Improved',
  ],

  education: [
    'Educated', 'Taught', 'Instructed', 'Mentored', 'Coached',
    'Trained', 'Developed', 'Designed', 'Facilitated', 'Assessed',
    'Evaluated', 'Guided', 'Motivated', 'Inspired',
  ],

  operations: [
    'Streamlined', 'Optimized', 'Improved', 'Standardized', 'Automated',
    'Coordinated', 'Managed', 'Supervised', 'Monitored', 'Controlled',
    'Scheduled', 'Allocated', 'Distributed', 'Tracked',
  ],

  creative: [
    'Designed', 'Created', 'Conceptualized', 'Developed', 'Produced',
    'Directed', 'Illustrated', 'Composed', 'Crafted', 'Styled',
    'Branded', 'Visualized', 'Executed', 'Delivered',
  ],
}

/**
 * Helper function to get power word alternatives
 */
export function getPowerWordAlternatives(weakWord: string): string[] {
  const normalized = weakWord.toLowerCase().trim()
  return POWER_WORD_SYNONYMS[normalized] || []
}

/**
 * Helper function to check if a word is weak
 */
export function isWeakWord(word: string): boolean {
  const normalized = word.toLowerCase().trim()
  return WEAK_WORDS.some(weak => normalized.includes(weak))
}

/**
 * Get power words for a specific category
 */
export function getPowerWordsByCategory(category: keyof typeof ACTION_VERBS): string[] {
  return ACTION_VERBS[category] || []
}

/**
 * Get power words for an industry
 */
export function getPowerWordsByIndustry(industry: keyof typeof INDUSTRY_POWER_WORDS): string[] {
  return INDUSTRY_POWER_WORDS[industry] || []
}

/**
 * Analyze text for weak words and suggest improvements
 */
export function analyzeTextForPowerWords(text: string): {
  weakWords: string[]
  suggestions: Array<{ weak: string; alternatives: string[] }>
  score: number
} {
  const weakWordsFound: string[] = []
  const suggestions: Array<{ weak: string; alternatives: string[] }> = []

  WEAK_WORDS.forEach(weak => {
    if (text.toLowerCase().includes(weak)) {
      weakWordsFound.push(weak)

      // Find the key in synonyms
      const baseWord = weak.replace(/\s+(for|with|on|to|included)$/i, '').trim()
      const alternatives = getPowerWordAlternatives(baseWord)

      if (alternatives.length > 0) {
        suggestions.push({ weak, alternatives })
      }
    }
  })

  // Score: 100 - (10 points per weak word found)
  const score = Math.max(0, 100 - (weakWordsFound.length * 10))

  return {
    weakWords: weakWordsFound,
    suggestions,
    score,
  }
}

/**
 * Check if text contains quantified achievements
 */
export function hasQuantifiedAchievements(text: string): boolean {
  // Check for numbers, percentages, dollar signs
  const patterns = [
    /\d+%/,  // Percentages: "25%"
    /\$\d+/,  // Dollar amounts: "$100K"
    /\d+[KkMm]/,  // Abbreviated numbers: "10K", "5M"
    /\b\d+\+\b/,  // "500+ clients"
    /\b\d+x\b/,  // "3x increase"
    /\#\d+/,  // Rankings: "#1"
  ]

  return patterns.some(pattern => pattern.test(text))
}
