# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JobFoxy (internal name: Joblander) is an AI-powered interview preparation platform built with Next.js 14 App Router. It features resume building/analysis, mock interviews with AI personas, interview practice with STAR scoring, and career coaching tools.

## Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **AI**: OpenAI GPT-4 for all AI features
- **Voice**: Deepgram (STT) and ElevenLabs (TTS) for mock interviews
- **Payments**: Stripe for billing
- **Rich Text**: TipTap for resume bullet editing

### Key Directories

**`/lib/engines/`** - AI processing engines ("the brains")
- Pure functions that call OpenAI and return typed results
- All engines return `null` on error (handle gracefully in API routes)
- Examples: `resumeAnalysisEngine.ts`, `mockInterviewEngine.ts`, `answerScoringEngine.ts`

**`/lib/clients/`** - API client wrappers
- `supabaseClient.ts` - Client-side (anon key)
- `supabaseServerClient.ts` - Server-side with SSR
- `supabaseClient.ts:supabaseAdmin` - Service role (admin operations only)
- `openaiClient.ts`, `deepgramClient.ts`, `elevenlabsClient.ts`, `stripeClient.ts`

**`/lib/data/`** - Static data and configurations
- `interviewerPersonas.ts` - AI interviewer personas with ElevenLabs voice IDs
- `atsKeywords.ts`, `powerWords.ts` - Resume optimization data

**`/contexts/`** - React contexts
- `ResumeContext.tsx` - Resume builder state (section order, designer settings, template selection)

**`/lib/types/`** - TypeScript type definitions
- `resume.ts` - `ParsedResume` type with TipTap JSONContent for rich text fields
- `mock.ts` - Mock interview response types with STAR scoring

### Data Flow Patterns

**Resume Builder**:
- `ResumeContext` provides global state for the studio
- Resume data uses TipTap JSONContent format for rich text (summary, bullets)
- Section forms in `/components/resume/forms/` edit context state
- Canvas renders via `/components/resume/studio/ResumeCanvas.tsx`

**Mock Interviews**:
- Personas from `/lib/data/interviewerPersonas.ts` map to ElevenLabs voices
- Interview flow: STT (Deepgram) → AI response (mockInterviewEngine) → TTS (ElevenLabs)
- Scoring uses STAR framework with content/delivery breakdown

**API Routes**:
- Thin wrappers around engines: validate input → call engine → return JSON
- All in `/app/api/` following Next.js App Router conventions

### Authentication

Supabase Auth with middleware protection in `/middleware.ts`:
- Protected routes: `/dashboard/*`, `/resume/*`, `/practice/*`, `/mock/*`, etc.
- Auth pages redirect to dashboard if already logged in

### Database

- Supabase PostgreSQL with RLS policies
- Schemas in `/database/schemas/` (run in SQL Editor)
- Types should match `/database/types/database.types.ts`
- All tables have `created_at`/`updated_at` auto-timestamps

## Important Conventions

- Resume text fields (summary, bullets) use TipTap JSONContent, not plain strings
- Engine functions are pure and side-effect free
- API routes should not contain business logic - delegate to engines
- Use `supabaseAdmin` only for operations requiring service role
- Interviewer voice IDs are ElevenLabs voice IDs, not arbitrary strings
