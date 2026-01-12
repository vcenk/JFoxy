// database/types/database.types.ts
// TypeScript types for database tables
// These match the SQL schemas in database/schemas/

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  is_admin?: boolean | null

  // Subscription
  subscription_status: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
  subscription_tier?: 'basic' | 'pro' | 'premium'
  subscription_price_id: string | null
  subscription_current_period_end: string | null
  stripe_customer_id: string | null

  // Usage
  ai_tokens_used_this_month: number
  practice_sessions_this_month: number
  mock_interviews_this_month: number
  resume_builds_this_month?: number
  job_analyses_this_month?: number
  audio_practice_sessions_this_month?: number
  monthly_video_credits?: number
  purchased_video_credits?: number

  preferences: Record<string, any> // Added for settings

  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  content: Record<string, any>
  raw_text: string | null
  is_active: boolean
  file_url: string | null
  ats_score: number | null
  last_analyzed_at: string | null
  analysis_results: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface JobDescription {
  id: string
  user_id: string
  title: string
  company: string | null
  description: string
  requirements: Record<string, any> | null
  parsed_skills: string[] | null
  competencies: string[] | null
  is_active: boolean
  source_url: string | null
  created_at: string
  updated_at: string
}

export interface PracticeSession {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  title: string
  question_category: string | null
  total_questions: number
  completed_questions: number
  average_score: number | null
  overall_feedback: Record<string, any> | null
  status: 'in_progress' | 'completed' | 'abandoned'
  started_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface PracticeQuestion {
  id: string
  session_id: string
  question_text: string
  question_category: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  expected_components: Record<string, any> | null
  order_index: number
  created_at: string
}

export interface PracticeAnswer {
  id: string
  question_id: string
  user_id: string
  transcript: string
  audio_url: string | null
  overall_score: number | null
  star_analysis: Record<string, any> | null
  clarity_score: number | null
  relevance_score: number | null
  impact_score: number | null
  strengths: string[] | null
  improvements: string[] | null
  summary: string | null
  duration_seconds: number | null
  created_at: string
}

export interface MockInterview {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  persona_id: string
  duration_minutes: number
  focus: string | null
  difficulty: 'easy' | 'standard' | 'hard' | null
  adaptive_mode?: string // Added
  planned_questions: Record<string, any> | null
  verdict: 'strong_hire' | 'hire' | 'borderline' | 'not_ready' | null
  overall_score: number | null
  communication_score: number | null
  structure_score: number | null
  role_fit_score: number | null
  technical_depth_score: number | null
  key_strengths: string[] | null
  key_gaps: string[] | null
  improvement_plan: Record<string, any> | null
  summary: string | null
  status: 'planned' | 'in_progress' | 'completed' | 'abandoned'
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface MockInterviewExchange {
  id: string
  mock_interview_id: string
  question_text: string
  question_type: string | null
  question_competency: string | null
  // user_transcript, user_audio_url, answer_score moved to attempts
  answer_duration_seconds: number | null // kept for aggregate or moved? Schema didn't drop it explicitly but logic suggests it's per attempt.
  star_completeness: Record<string, any> | null // kept as summary?
  follow_up_needed: boolean
  follow_up_question: string | null
  follow_up_transcript: string | null
  follow_up_score: number | null
  exchange_order: number
  final_attempt_id?: string // Added
  created_at: string
}

export interface MockInterviewAttempt {
  id: string
  exchange_id: string
  attempt_number: number
  user_audio_url: string | null
  user_transcript: string | null
  content_scores: Record<string, any> | null
  delivery_metrics: Record<string, any> | null
  overall_score: number | null
  feedback_text: string | null
  rewritten_answer: string | null
  coach_notes: Record<string, any> | null
  audio_expires_at: string | null
  audio_deleted_at: string | null
  created_at: string
}

export interface StarStory {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null // Added
  source_attempt_id: string | null // Added
  title: string
  category: string | null
  related_question: string | null
  situation: string
  task: string
  action: string
  result: string
  polished_answer: string | null // Added
  coach_notes: Record<string, any> | null // Added
  metrics: string[] | null
  skills_demonstrated: string[] | null
  is_favorite: boolean
  use_count: number
  created_at: string
  updated_at: string
}

export interface SwotAnalysis {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  strengths: Record<string, any>
  weaknesses: Record<string, any>
  opportunities: Record<string, any>
  threats: Record<string, any>
  is_active: boolean
  last_generated_at: string | null
  created_at: string
  updated_at: string
}

export interface GapDefense {
  id: string
  user_id: string
  swot_analysis_id: string | null
  gap_type: string
  gap_description: string
  pivot: string | null
  proof: string | null
  promise: string | null
  is_favorite: boolean
  use_count: number
  created_at: string
  updated_at: string
}

export interface IntroPitch {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  title: string
  pitch_text: string
  duration_seconds: number | null
  hook: string | null
  core_message: string | null
  call_to_action: string | null
  is_active: boolean
  practice_count: number
  created_at: string
  updated_at: string
}

export interface CoverLetter {
  id: string
  user_id: string
  resume_id: string | null
  job_description_id: string | null
  title: string
  content: string
  html_content: string | null
  company_name: string | null
  position_title: string | null
  tone: string | null
  created_at: string
  updated_at: string
}

export interface MarketData {
  id: string
  category: string
  job_title: string | null
  location: string | null
  industry: string | null
  data: Record<string, any>
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UsageTracking {
  id: string
  user_id: string
  resource_type: string
  resource_count: number
  estimated_cost_cents: number | null
  session_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}
