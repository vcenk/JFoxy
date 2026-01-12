// lib/utils/bulletAnalyzer.ts
// Real-time bullet point analysis without API calls

import {
  analyzeTextForPowerWords,
  hasQuantifiedAchievements,
  getPowerWordAlternatives,
  WEAK_WORDS,
  ACTION_VERBS,
  IMPACT_METRICS,
} from '@/lib/data/powerWords'

export interface BulletAnalysis {
  score: number
  weakWords: string[]
  suggestions: Array<{ weak: string; alternatives: string[] }>
  hasMetrics: boolean
  startsWithActionVerb: boolean
  tips: string[]
  strength: 'weak' | 'moderate' | 'strong'
}

/**
 * Analyze a single bullet point for quality
 * Returns instant feedback without API calls
 */
export function analyzeBullet(text: string): BulletAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      weakWords: [],
      suggestions: [],
      hasMetrics: false,
      startsWithActionVerb: false,
      tips: ['Start writing to see analysis'],
      strength: 'weak',
    }
  }

  const powerAnalysis = analyzeTextForPowerWords(text)
  const hasMetrics = hasQuantifiedAchievements(text)

  // Check if bullet starts with an action verb
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase() || ''
  const allActionVerbs = Object.values(ACTION_VERBS).flat().map(v => v.toLowerCase())
  const startsWithActionVerb = allActionVerbs.includes(firstWord)

  // Calculate score
  let score = 50 // Base score

  // Bonus for action verb start
  if (startsWithActionVerb) score += 15

  // Bonus for metrics
  if (hasMetrics) score += 20

  // Penalty for weak words
  score -= powerAnalysis.weakWords.length * 10

  // Bonus for length (not too short, not too long)
  const wordCount = text.trim().split(/\s+/).length
  if (wordCount >= 8 && wordCount <= 25) score += 10
  else if (wordCount < 5) score -= 10

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score))

  // Generate tips
  const tips: string[] = []

  if (!startsWithActionVerb) {
    const suggestedVerbs = ACTION_VERBS.achievement.slice(0, 3).join(', ')
    tips.push(`Start with an action verb (e.g., ${suggestedVerbs})`)
  }

  if (!hasMetrics) {
    tips.push('Add a number, percentage, or dollar amount to quantify impact')
  }

  if (powerAnalysis.weakWords.length > 0) {
    tips.push(`Replace weak phrases: "${powerAnalysis.weakWords[0]}"`)
  }

  if (wordCount < 5) {
    tips.push('Add more detail to demonstrate impact')
  }

  if (wordCount > 30) {
    tips.push('Consider splitting into multiple bullets for readability')
  }

  // Determine strength
  let strength: 'weak' | 'moderate' | 'strong' = 'weak'
  if (score >= 80) strength = 'strong'
  else if (score >= 50) strength = 'moderate'

  return {
    score,
    weakWords: powerAnalysis.weakWords,
    suggestions: powerAnalysis.suggestions,
    hasMetrics,
    startsWithActionVerb,
    tips,
    strength,
  }
}

/**
 * Get color class based on score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500'
  if (score >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

/**
 * Get background color class based on score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/20'
  if (score >= 50) return 'bg-yellow-500/20'
  return 'bg-red-500/20'
}

/**
 * Find weak words in text with their positions
 */
export function findWeakWordsWithPositions(text: string): Array<{
  word: string
  start: number
  end: number
  alternatives: string[]
}> {
  const results: Array<{
    word: string
    start: number
    end: number
    alternatives: string[]
  }> = []

  const lowerText = text.toLowerCase()

  WEAK_WORDS.forEach(weakWord => {
    let startIndex = 0
    let index: number

    while ((index = lowerText.indexOf(weakWord.toLowerCase(), startIndex)) !== -1) {
      // Get alternatives for this weak word
      const baseWord = weakWord.replace(/\s+(for|with|on|to|included)$/i, '').trim()
      const alternatives = getPowerWordAlternatives(baseWord)

      results.push({
        word: weakWord,
        start: index,
        end: index + weakWord.length,
        alternatives: alternatives.length > 0 ? alternatives : ['Consider rephrasing'],
      })

      startIndex = index + 1
    }
  })

  // Sort by position
  results.sort((a, b) => a.start - b.start)

  return results
}

/**
 * Get suggested action verbs by category
 */
export function getSuggestedActionVerbs(category?: keyof typeof ACTION_VERBS): string[] {
  if (category && ACTION_VERBS[category]) {
    return ACTION_VERBS[category]
  }
  // Return top verbs from each category
  return Object.values(ACTION_VERBS).flatMap(verbs => verbs.slice(0, 3))
}

/**
 * Get impact metric templates
 */
export function getImpactMetricTemplates(): typeof IMPACT_METRICS {
  return IMPACT_METRICS
}

/**
 * Analyze multiple bullets and return aggregate stats
 */
export function analyzeAllBullets(bullets: string[]): {
  averageScore: number
  totalWeakWords: number
  bulletsWithMetrics: number
  bulletsWithActionVerbs: number
  overallStrength: 'weak' | 'moderate' | 'strong'
  topTips: string[]
} {
  if (bullets.length === 0) {
    return {
      averageScore: 0,
      totalWeakWords: 0,
      bulletsWithMetrics: 0,
      bulletsWithActionVerbs: 0,
      overallStrength: 'weak',
      topTips: ['Add bullet points to see analysis'],
    }
  }

  const analyses = bullets.map(b => analyzeBullet(b))

  const averageScore = Math.round(
    analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length
  )

  const totalWeakWords = analyses.reduce((sum, a) => sum + a.weakWords.length, 0)
  const bulletsWithMetrics = analyses.filter(a => a.hasMetrics).length
  const bulletsWithActionVerbs = analyses.filter(a => a.startsWithActionVerb).length

  // Collect all unique tips
  const allTips = Array.from(new Set(analyses.flatMap(a => a.tips)))

  // Determine overall strength
  let overallStrength: 'weak' | 'moderate' | 'strong' = 'weak'
  if (averageScore >= 80) overallStrength = 'strong'
  else if (averageScore >= 50) overallStrength = 'moderate'

  return {
    averageScore,
    totalWeakWords,
    bulletsWithMetrics,
    bulletsWithActionVerbs,
    overallStrength,
    topTips: allTips.slice(0, 5),
  }
}
