# JobFoxy Skills Agents

This directory contains specialized skills agents for different sections of the JobFoxy application. Each skill agent provides context-aware assistance for specific features and functionalities.

## What are Skills Agents?

Skills agents are specialized AI assistants that have deep knowledge about specific parts of your application. They help with:
- Code development and debugging
- Feature implementation
- Bug fixes
- Architecture decisions

## Available Skills Agents

### 1. Authentication (`authentication.md`)
**Use for:** User authentication, registration, password reset, landing page, public pages

**Key areas:**
- Login/registration flows
- Password recovery
- Landing page features
- Middleware auth protection

### 2. Dashboard (`dashboard.md`)
**Use for:** Main dashboard, home page, readiness score, activity feed, statistics

**Key areas:**
- Dashboard layout
- Readiness score calculation
- Activity tracking
- Quick access features

### 3. Resume System (`resume.md`)
**Use for:** Resume builder, analysis, templates, examples, parsing, optimization

**Key areas:**
- WYSIWYG resume builder with templates
- Power words detection (900+ synonyms)
- ATS keyword optimization (10+ industries)
- Resume analysis and scoring
- PDF/DOCX parsing and export
- LinkedIn import
- TipTap rich text editing

### 4. Career Coaching (`coaching.md`)
**Use for:** SWOT analysis, STAR builder, gap defense, intro pitch

**Key areas:**
- SWOT analysis generation
- STAR story creation
- Interview gap strategies
- Elevator pitch generation

### 5. Interview Practice (`practice.md`)
**Use for:** Practice sessions, question library, audio recording, AI scoring

**Key areas:**
- Practice session management
- Question categorization
- Audio transcription (Deepgram)
- AI answer scoring with STAR framework
- Leaderboard functionality

### 6. Mock Interviews (`mock-interview.md`)
**Use for:** Full mock interview simulations with AI voice interviewer

**Key areas:**
- Live voice interview room
- ElevenLabs TTS integration
- Deepgram STT transcription
- 11 AI interviewer personas
- 6-phase conversation flow
- STAR framework analysis
- Comprehensive reports

### 7. Cover Letter (`cover-letter.md`)
**Use for:** AI-powered cover letter generation and customization

**Key areas:**
- Cover letter generation
- Job description matching
- Tone customization
- Resume integration

### 8. Account & Settings (`account.md`)
**Use for:** User account, subscription, billing, preferences

**Key areas:**
- Profile management
- Subscription management (Stripe)
- User preferences
- Market insights

### 9. Admin Dashboard (`admin.md`)
**Use for:** Platform analytics, resume examples management, plans management

**Key areas:**
- Resume examples generation
- Subscription plans management
- Credit packs administration

### 10. API & Utilities (`api-utilities.md`)
**Use for:** API development, AI engines, integrations, utilities, database

**Key areas:**
- API route development
- AI engine development
- External service integrations (OpenAI, Deepgram, ElevenLabs, Stripe)
- Database schemas and migrations
- Helper functions and utilities
- Type definitions

## Quick Reference Guide

| Working on... | Use this skill |
|---------------|----------------|
| Authentication/landing | `authentication.md` |
| Dashboard features | `dashboard.md` |
| Resume-related features | `resume.md` |
| Coaching tools | `coaching.md` |
| Practice sessions | `practice.md` |
| Mock interviews | `mock-interview.md` |
| Cover letters | `cover-letter.md` |
| Account/billing | `account.md` |
| Admin features | `admin.md` |
| APIs/engines/utils | `api-utilities.md` |

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- TipTap (rich text editor)

### Backend
- Next.js API Routes
- Supabase (PostgreSQL with RLS)

### AI & Services
- OpenAI GPT-4 (text generation)
- Deepgram (speech-to-text)
- ElevenLabs (text-to-speech)
- Stripe (payments)

## Database Schemas

Located in `database/schemas/`:
- `00_init.sql` - Initial setup
- `01_profiles.sql` - User profiles
- `02_resumes.sql` - Resume storage
- `03_job_descriptions.sql` - Job postings
- `04_practice_sessions.sql` - Practice data
- `05_mock_interviews.sql` - Mock interview data
- `06_coaching_star_stories.sql` - STAR stories
- `07_coaching_swot_and_gaps.sql` - SWOT and gaps
- `08_cover_letters.sql` - Cover letters
- `09_market_data.sql` - Market insights
- `10_usage_tracking.sql` - Usage metrics
- `11_resume_library.sql` - Resume examples

## API Structure

All API routes in `app/api/`:
```
/api
  /resume - Resume operations
  /practice - Practice sessions
  /mock - Mock interviews
  /coaching - Coaching tools
  /cover-letter - Cover letter generation
  /billing - Stripe integration
  /admin - Admin operations
  /audio - Speech services (TTS/STT)
  /deepgram - Deepgram voice services
  /elevenlabs - ElevenLabs voice services
  /dashboard - Dashboard stats
  /job-description - Job description management
  /public - Public APIs
```

## Important Conventions

### Rich Text Format
Resume text fields (summary, bullets) use TipTap JSONContent format. Use `lib/utils/richTextHelpers.ts` for conversions.

### AI Engine Pattern
All engines return `result | null` - handle null as error case in API routes.

### Supabase Clients
- `supabase` - Client-side with anon key
- `supabaseAdmin` - Service role for admin operations
- `createServerClient` - Server-side with SSR cookies

---

**Last Updated:** 2025-01-07

**Total Skills:** 10
