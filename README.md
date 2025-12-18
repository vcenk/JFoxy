# Joblander - AI-Powered Interview Preparation Platform

A comprehensive interview preparation platform featuring AI-powered coaching, resume analysis, mock interviews, and market insights.

## Features

- 🎯 **Resume Builder & Analysis** - Create ATS-optimized resumes with AI feedback
- 🎓 **Career Coaching** - SWOT analysis, STAR builder, Gap Defense strategies
- 🎤 **Interview Practice** - Practice behavioral questions with AI scoring
- 🤖 **Mock Interviews** - Full interview simulation with AI personas
- 📊 **Market Insights** - Salary data, skills radar, job trends
- 💼 **Cover Letter Generator** - AI-powered cover letters matching your resume

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4
- **Voice:** Deepgram (TTS & STT)
- **Payments:** Stripe

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Deepgram API key
- Stripe account (for billing)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Joblander
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys and configuration.

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
/app              - Next.js App Router pages and API routes
/components       - Reusable UI components
/lib              - Backend logic and AI engines
/database         - Database schemas and migrations
/hooks            - Custom React hooks
/contexts         - React contexts
/types            - TypeScript type definitions
/styles           - Global styles and themes
/public           - Static assets
```

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## License

MIT License - see LICENSE file for details



 You're absolutely correct on all points. Here's the final approved structure with your corrections:

  C:\Users\User\Desktop\AI_APP_Projects\Joblander\
  │
  ├── README.md
  ├── package.json
  ├── tsconfig.json
  ├── next.config.js
  ├── tailwind.config.ts
  ├── middleware.ts                       # [MOVED] Root-level for Next.js auth protection
  ├── .env.local
  ├── .env.example
  ├── .gitignore
  │
  ├── /app/                               # [RENAMED] Standard Next.js App Router
  │   ├── layout.tsx                      # Root layout with light theme
  │   ├── page.tsx                        # Landing page
  │   │
  │   ├── /api/                           # [MOVED] API Routes (Next.js serverless endpoints)
  │   │   ├── /auth/
  │   │   │   ├── /login/route.ts
  │   │   │   ├── /register/route.ts
  │   │   │   └── /logout/route.ts
  │   │   ├── /resume/
  │   │   │   ├── /parse/route.ts
  │   │   │   ├── /analyze/route.ts
  │   │   │   ├── /rewrite/route.ts
  │   │   │   └── /[id]/route.ts
  │   │   ├── /coaching/
  │   │   │   ├── /swot/route.ts
  │   │   │   ├── /gap-defense/route.ts
  │   │   │   ├── /star/route.ts
  │   │   │   └── /intro-pitch/route.ts
  │   │   ├── /practice/
  │   │   │   ├── /questions/route.ts
  │   │   │   ├── /score/route.ts
  │   │   │   └── /summary/route.ts
  │   │   ├── /mock/
  │   │   │   ├── /plan/route.ts
  │   │   │   ├── /followup/route.ts
  │   │   │   └── /report/route.ts
  │   │   ├── /market-insights/           # [ADDED] Market data endpoints
  │   │   │   ├── /salary/route.ts
  │   │   │   ├── /skills/route.ts
  │   │   │   └── /trends/route.ts
  │   │   ├── /audio/
  │   │   │   ├── /tts/route.ts          # Deepgram Text-to-Speech
  │   │   │   └── /stt/route.ts          # Deepgram Speech-to-Text
  │   │   ├── /billing/
  │   │   │   ├── /create-checkout-session/route.ts
  │   │   │   ├── /create-portal-session/route.ts
  │   │   │   └── /webhook/route.ts
  │   │   └── /cover-letter/
  │   │       └── /generate/route.ts
  │   │
  │   ├── /auth/                          # [ADDED] Authentication pages
  │   │   ├── /login/page.tsx
  │   │   ├── /register/page.tsx
  │   │   └── /forgot-password/page.tsx
  │   │
  │   ├── /dashboard/                     # Main dashboard (Home Tab)
  │   │   ├── layout.tsx
  │   │   └── page.tsx
  │   │
  │   ├── /resume/                        # Resume Tab
  │   │   ├── page.tsx                    # Resume overview/selector
  │   │   ├── /builder/page.tsx
  │   │   ├── /editor/page.tsx
  │   │   └── /analysis/page.tsx
  │   │
  │   ├── /coaching/                      # Coaching Tab
  │   │   ├── page.tsx                    # Coaching overview
  │   │   ├── /swot/page.tsx
  │   │   ├── /gap-defense/page.tsx
  │   │   ├── /star-builder/page.tsx
  │   │   ├── /intro-pitch/page.tsx
  │   │   └── /library/page.tsx           # Video lessons library
  │   │
  │   ├── /practice/                      # Interview Practice Tab
  │   │   ├── page.tsx                    # Practice session selector
  │   │   ├── /session/page.tsx
  │   │   └── /summary/[id]/page.tsx
  │   │
  │   ├── /mock/                          # Mock Interview Tab ("The Arena")
  │   │   ├── page.tsx                    # Setup/configuration
  │   │   ├── /interview/page.tsx         # Live interview room
  │   │   └── /report/[id]/page.tsx       # Post-interview report
  │   │
  │   ├── /market-insights/               # [ADDED] Market Insights Tab ("Intel")
  │   │   ├── page.tsx                    # Market overview dashboard
  │   │   ├── /salary-ticker/page.tsx
  │   │   ├── /skills-radar/page.tsx
  │   │   └── /job-trends/page.tsx
  │   │
  │   ├── /cover-letter/                  # Cover Letter
  │   │   └── page.tsx
  │   │
  │   └── /account/                       # Account & Settings
  │       ├── page.tsx                    # Account overview
  │       ├── /billing/page.tsx
  │       └── /settings/page.tsx
  │
  ├── /components/                        # UI Components
  │   ├── /ui/                           # Base UI components (Shadcn/Tailwind)
  │   │   ├── button.tsx
  │   │   ├── card.tsx
  │   │   ├── input.tsx
  │   │   ├── textarea.tsx
  │   │   ├── select.tsx
  │   │   ├── modal.tsx
  │   │   ├── dialog.tsx
  │   │   ├── toast.tsx
  │   │   ├── tabs.tsx
  │   │   ├── badge.tsx
  │   │   └── progress.tsx
  │   │
  │   ├── /layout/                       # Layout components
  │   │   ├── Header.tsx
  │   │   ├── Sidebar.tsx
  │   │   ├── TabNavigation.tsx
  │   │   ├── Footer.tsx
  │   │   └── DashboardLayout.tsx
  │   │
  │   ├── /resume/                       # Resume-specific components
  │   │   ├── ResumeEditor.tsx
  │   │   ├── ResumePreviewer.tsx
  │   │   ├── AnalysisDashboard.tsx
  │   │   ├── ATSScoreDisplay.tsx
  │   │   └── ResumeTemplateSelector.tsx
  │   │
  │   ├── /coaching/                     # Coaching components
  │   │   ├── SwotGrid.tsx
  │   │   ├── GapDefenseStack.tsx
  │   │   ├── StarBuilder.tsx
  │   │   ├── IntroPitchEditor.tsx
  │   │   └── VideoPlayer.tsx
  │   │
  │   ├── /practice/                     # Interview Practice components
  │   │   ├── QuestionCard.tsx
  │   │   ├── AudioRecorder.tsx
  │   │   ├── TranscriptDisplay.tsx
  │   │   ├── ScoreDisplay.tsx
  │   │   ├── FeedbackPanel.tsx
  │   │   └── SessionSummary.tsx
  │   │
  │   ├── /mock/                         # Mock Interview components
  │   │   ├── PersonaSelector.tsx
  │   │   ├── InterviewRoom.tsx
  │   │   ├── AvatarDisplay.tsx
  │   │   ├── WaveformVisualizer.tsx
  │   │   ├── MicControl.tsx
  │   │   └── VerdictDisplay.tsx
  │   │
  │   ├── /market/                       # [ADDED] Market Insights components
  │   │   ├── SalaryChart.tsx
  │   │   ├── SkillsRadar.tsx
  │   │   ├── JobTrendsTicker.tsx
  │   │   └── MarketDataCard.tsx
  │   │
  │   └── /shared/                       # Shared cross-feature components
  │       ├── LoadingSpinner.tsx
  │       ├── ErrorBoundary.tsx
  │       ├── UpgradePrompt.tsx
  │       ├── EmptyState.tsx
  │       └── FeatureLock.tsx
  │
  ├── /lib/                              # [RENAMED] Shared backend logic
  │   ├── /clients/                      # API clients
  │   │   ├── openaiClient.ts           # OpenAI wrapper
  │   │   ├── deepgramClient.ts         # Deepgram wrapper
  │   │   ├── stripeClient.ts           # Stripe wrapper
  │   │   └── supabaseClient.ts         # Supabase wrapper
  │   │
  │   ├── /engines/                      # AI Processing Engines ("The Brains")
  │   │   ├── resumeParsingEngine.ts
  │   │   ├── resumeAnalysisEngine.ts
  │   │   ├── resumeRewriteEngine.ts
  │   │   ├── swotEngine.ts
  │   │   ├── starBuilderEngine.ts
  │   │   ├── gapDefenseEngine.ts
  │   │   ├── introPitchEngine.ts
  │   │   ├── answerScoringEngine.ts
  │   │   ├── mockInterviewEngine.ts     # Handles Hybrid Flow
  │   │   ├── practiceSummaryEngine.ts
  │   │   ├── mockReportEngine.ts
  │   │   ├── coverLetterEngine.ts
  │   │   └── marketInsightsEngine.ts    # [ADDED]
  │   │
  │   ├── /config/                       # Configuration files
  │   │   ├── deepgram.ts
  │   │   ├── openai.ts
  │   │   ├── stripe.ts
  │   │   ├── interviewPersonas.ts
  │   │   ├── constants.ts
  │   │   └── env.ts
  │   │
  │   ├── /utils/                        # Utility functions
  │   │   ├── validation.ts
  │   │   ├── formatting.ts
  │   │   ├── errors.ts
  │   │   ├── helpers.ts
  │   │   └── logger.ts
  │   │
  │   └── auth.ts                        # Auth utilities
  │
  ├── /hooks/                            # Custom React hooks
  │   ├── useAuth.ts
  │   ├── useUser.ts
  │   ├── useUserPlan.ts
  │   ├── useResume.ts
  │   ├── useAudioRecorder.ts
  │   ├── useDeepgram.ts
  │   ├── useMockInterview.ts
  │   └── useMarketData.ts              # [ADDED]
  │
  ├── /contexts/                         # React contexts
  │   ├── AuthContext.tsx
  │   ├── ResumeContext.tsx
  │   ├── ThemeContext.tsx
  │   └── InterviewContext.tsx
  │
  ├── /types/                            # Global TypeScript types
  │   ├── index.ts
  │   ├── resume.ts
  │   ├── interview.ts
  │   ├── coaching.ts
  │   ├── user.ts
  │   ├── api.ts
  │   └── market.ts                     # [ADDED]
  │
  ├── /database/                         # Database files
  │   ├── /schemas/                      # Supabase schemas
  │   │   ├── profiles.sql
  │   │   ├── resumes.sql
  │   │   ├── job_descriptions.sql
  │   │   ├── practice_sessions.sql
  │   │   ├── mock_interviews.sql
  │   │   ├── star_stories.sql
  │   │   ├── swot_analyses.sql
  │   │   ├── gap_defenses.sql
  │   │   ├── cover_letters.sql
  │   │   └── market_data.sql           # [ADDED]
  │   │
  │   ├── /migrations/                   # Migration scripts
  │   │   ├── 001_initial_schema.sql
  │   │   ├── 002_add_billing_fields.sql
  │   │   ├── 003_add_market_insights.sql
  │   │   └── ...
  │   │
  │   ├── /seeds/                        # Seed data
  │   │   ├── personas.sql
  │   │   ├── sample_questions.sql
  │   │   ├── video_lessons.sql
  │   │   └── market_seed_data.sql      # [ADDED]
  │   │
  │   └── /types/                        # Database TypeScript types
  │       └── database.types.ts
  │
  ├── /styles/                           # Global styles
  │   ├── globals.css
  │   ├── themes.css                     # Light theme variables
  │   └── animations.css
  │
  ├── /public/                           # Static assets
  │   ├── /images/
  │   │   ├── /personas/                 # [RENAMED] Emma, James, Sato avatars
  │   │   ├── /icons/
  │   │   └── logo.svg
  │   ├── /audio/
  │   │   ├── /fillers/                  # "Thinking" sounds
  │   │   └── /notifications/
  │   └── /fonts/
  │
  └── /docs/                             # Documentation
      ├── API.md
      ├── ARCHITECTURE.md
      ├── DEPLOYMENT.md
      └── DEVELOPMENT.md

  ---