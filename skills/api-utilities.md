# API & Utilities Skills Agent

Use this agent for API development, utilities, engines, and infrastructure.

## Scope
- API route development
- AI engines and processors
- Client integrations (OpenAI, Deepgram, ElevenLabs, Stripe)
- Database utilities
- Helper functions
- Configuration management
- Data processing
- Audio services
- Type definitions

## Key Files

### API Clients
- `lib/clients/openaiClient.ts` - OpenAI GPT-4 API wrapper
- `lib/clients/deepgramClient.ts` - Deepgram speech services
- `lib/clients/elevenlabsClient.ts` - ElevenLabs TTS services
- `lib/clients/stripeClient.ts` - Stripe payments
- `lib/clients/supabaseClient.ts` - Supabase (client-side + admin)
- `lib/clients/supabaseServerClient.ts` - Supabase (server-side with SSR)
- `lib/clients/supabaseBrowserClient.ts` - Supabase (browser client)

### AI Processing Engines
All engines in `lib/engines/`:
- `resumeParsingEngine.ts` - PDF/Word document parsing
- `resumeAnalysisEngine.ts` - Resume evaluation and scoring
- `resumeOptimizationEngine.ts` - AI-powered resume optimization
- `resumeExampleGenerator.ts` - Resume example generation
- `answerScoringEngine.ts` - Practice answer scoring with STAR
- `starBuilderEngine.ts` - STAR story creation
- `swotEngine.ts` - SWOT analysis generation
- `gapDefenseEngine.ts` - Gap defense strategies
- `introPitchEngine.ts` - Elevator pitch generation
- `mockInterviewEngine.ts` - Mock interview question/analysis
- `mockReportEngine.ts` - Interview report generation
- `coverLetterEngine.ts` - Cover letter generation
- `practiceSummaryEngine.ts` - Practice session reports

### Utilities
- `lib/utils/apiHelpers.ts` - API utility functions
- `lib/utils/resumeMapper.ts` - Resume data transformation
- `lib/utils/resumeToText.ts` - Resume to plain text conversion
- `lib/utils/richTextHelpers.ts` - TipTap rich text utilities
- `lib/utils/deepgramHelpers.ts` - Deepgram integration helpers
- `lib/utils/subscriptionLimits.ts` - Credit and limit management
- `lib/utils/docxExport.ts` - DOCX export functionality
- `lib/utils/jsonResumeSchema.ts` - JSON Resume schema utilities

### Configuration
- `lib/config/env.ts` - Environment variable management
- `lib/config/constants.ts` - App-wide constants
- `next.config.js` - Next.js configuration
- `middleware.ts` - Auth middleware

### Data & Taxonomies
- `lib/data/powerWords.ts` - 900+ power word synonyms
- `lib/data/atsKeywords.ts` - ATS keywords for 10+ industries
- `lib/data/jobTitleTaxonomy.ts` - 200+ job titles with metadata
- `lib/data/interviewerPersonas.ts` - 11 AI interviewer personas
- `lib/data/smallTalkTemplates.ts` - Conversation templates
- `lib/data/backchannelPhrases.ts` - Natural verbal fillers
- `lib/data/companyIntroTemplates.ts` - Company intro generation

### Type Definitions
- `lib/types/resume.ts` - Resume types (ParsedResume, RichText)
- `lib/types/mock.ts` - Mock interview types
- `lib/types/template.ts` - Template types
- `lib/types/section.ts` - Section types
- `lib/types/designer.ts` - Designer settings types
- `lib/types/analysis.ts` - Analysis result types
- `database/types/database.types.ts` - Database types

### Templates & Themes
- `lib/resumeThemes.ts` - Resume template definitions
- `lib/templates/templateConfigs.ts` - Template configurations
- `lib/templates/templateLibrary.ts` - Template library
- `lib/sectionRegistry.ts` - Section configuration registry

### Services
- `lib/services/conversationManager.ts` - Mock interview conversation orchestration

### Hooks
- `hooks/useAutoSave.ts` - Auto-save functionality
- `lib/hooks/useVoiceActivityDetection.ts` - VAD for voice recording

### Audio Services API
- `app/api/audio/tts/route.ts` - Text-to-speech
- `app/api/audio/stt/route.ts` - Speech-to-text
- `app/api/deepgram/voices/route.ts` - Available Deepgram voices
- `app/api/deepgram/preview/route.ts` - Voice preview
- `app/api/elevenlabs/voices/route.ts` - Available ElevenLabs voices
- `app/api/elevenlabs/preview/route.ts` - Voice preview

### Database
- `database/schemas/*.sql` - All database schemas (01-11)
- `database/migrations/*.sql` - Database migrations

## External Service Integrations

### OpenAI
- GPT-4 for text generation
- Structured JSON output for all engines
- Temperature: 0.1-0.3 for analysis, 0.4-0.5 for generation

### Deepgram
- **Nova-3** model for speech-to-text
- Real-time transcription
- Metrics: WPM, filler words, pauses

### ElevenLabs
- Text-to-speech for AI interviewer
- 11 voice IDs mapped to interviewer personas
- Audio tags for natural rhythm

### Stripe
- Subscription management
- Checkout sessions
- Customer portal
- Webhook handling

### Supabase
- PostgreSQL database
- Row Level Security (RLS)
- Auth (handled separately)
- Storage for files

## Design Patterns

### Engine Patterns
- Pure functions returning typed results or `null` on error
- Structured JSON output from OpenAI
- Temperature settings by use case
- Token limit management

### API Patterns
- Thin wrappers around engines
- Request validation
- Error response standardization
- Rate limiting considerations

### Database Patterns
- Row Level Security for multi-tenant data
- JSONB for flexible schemas
- Indexed foreign keys
- Auto-timestamps (created_at, updated_at)

## Common Tasks

### API Development
- Create new API endpoints
- Update existing routes
- Implement error handling
- Add request validation

### Engine Development
- Create new AI engines
- Update prompt templates
- Improve AI responses
- Optimize token usage

### Utility Development
- Create helper functions
- Add data transformation utilities
- Build parsing utilities

### Database Operations
- Write new schemas
- Create migrations
- Add indexes for performance
- Implement RLS policies

## Important Conventions

### Rich Text Format
Resume text fields use TipTap JSONContent:
```typescript
import { JSONContent } from '@tiptap/core'
export type RichText = JSONContent
```

Use `lib/utils/richTextHelpers.ts` for conversion between plain text and JSONContent.

### Supabase Client Usage
- `supabase` (from supabaseClient.ts) - Client-side with anon key
- `supabaseAdmin` (from supabaseClient.ts) - Server-side with service role (admin operations only)
- `createServerClient` (from supabaseServerClient.ts) - SSR with cookies

### Engine Return Pattern
All engines return `result | null`:
```typescript
const result = await someEngine(...)
if (!result) {
  return Response.json({ error: 'Processing failed' }, { status: 500 })
}
```
