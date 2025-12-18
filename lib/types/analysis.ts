// lib/types/analysis.ts

export interface ATSWarning {
  category: 'formatting' | 'keywords' | 'structure' | 'content' | 'contact'
  severity: 'critical' | 'warning' | 'info'
  issue: string
  recommendation: string
}

export interface ResumeAnalysisResult {
  // Score metrics (0-100)
  ats_score: number
  jd_match_score: number
  skills_fit_score: number

  // NEW: Detailed coaching explanations
  ats_score_explanation?: string              // Detailed ATS score coaching
  job_match_explanation?: string              // Detailed job match coaching
  skills_fit_explanation?: string             // Detailed skills assessment
  keyword_strategy?: string                   // Keyword analysis and strategy
  ats_health_check?: string                   // ATS readiness assessment
  skills_breakdown_coaching?: {               // Per-category skills coaching
    technical?: string
    tools?: string
    domain?: string
    communication?: string
    soft_skills?: string
  }
  strength_highlights?: string[]              // Detailed strength explanations
  coaching_summary?: string                   // Comprehensive coaching summary
  bullet_improvements?: Array<{               // Before/After bullet examples
    before: string
    after: string
    reason: string
  }>

  // Keyword extraction and matching
  resume_keywords: string[]        // All keywords found in resume
  jd_keywords: string[]            // All keywords found in job description
  matched_keywords: string[]       // Keywords present in both
  missing_keywords: string[]       // Important JD keywords missing from resume

  // ATS-specific checks
  ats_warnings: ATSWarning[]       // Severity-based warnings with recommendations
  ats_good_practices: string[]     // What candidate is doing right

  // Skills analysis
  skill_matches: string[]
  missing_skills: string[]

  // Legacy keyword analysis (keeping for backward compatibility)
  keyword_analysis: {
    missing: string[]
    present: string[]
  }

  // Formatting and structure
  formatting_issues: string[]
  skills_radar_data: Array<{ subject: string; A: number; fullMark: number }>

  // Section-specific feedback
  section_feedback: Array<{
    section: string
    feedback: string
    score: number
  }>

  // Actionable suggestions
  bullet_suggestions: string[]

  // Overall assessment
  overall_summary: string
  strengths: string[]
  weaknesses: string[]
}
