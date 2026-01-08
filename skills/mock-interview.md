# Mock Interview Skills Agent

Use this agent for voice-only mock interview simulation features.

## Scope
- Mock interview creation and configuration
- Live voice interview with AI interviewer (OpenAI Realtime API)
- Real-time WebRTC voice streaming
- Native VAD (Voice Activity Detection) for hands-free conversation
- Dynamic question generation from resume + job
- Natural conversation flow management
- STAR framework answer analysis
- Comprehensive post-interview reports
- Interview session tracking
- Performance analytics

## Key Files

### Interview Pages
- `app/dashboard/mock/page.tsx` - Mock interviews list with stats
- `app/dashboard/mock/new/page.tsx` - Interview setup (resume, job, duration)
- `app/dashboard/mock/[id]/page.tsx` - Live voice interview room (WebRTC)
- `app/dashboard/mock/[id]/report/page.tsx` - Comprehensive interview report

### Components
- `components/mock/InterviewRoom.tsx` - Main interview room container
- `components/mock/InterviewerCard.tsx` - Interviewer persona display with audio visualization
- `components/mock/MicrophoneControl.tsx` - Always-on VAD microphone indicator
- `components/mock/AudioWaveform.tsx` - Audio visualization
- `components/mock/ConversationTranscript.tsx` - Live conversation display

### Real-time Voice System
- `lib/services/realtimeClient.ts` - OpenAI Realtime API types and utilities
- `lib/services/interviewInstructions.ts` - Dynamic prompt generation for AI interviewer
- `lib/hooks/useRealtimeInterview.ts` - WebRTC hook for real-time voice interviews

### API Routes
- `app/api/mock/realtime/session/route.ts` - Create ephemeral token for WebRTC connection
- `app/api/mock/[id]/tool-response/route.ts` - Handle function calls from Realtime API

### AI Engines
- `lib/engines/mockInterviewEngine.ts` - Question generation, answer analysis
- `lib/engines/mockReportEngine.ts` - Report generation

### Data and Templates
- `lib/data/interviewerPersonas.ts` - 11 AI interviewer personas with OpenAI voice IDs
- `lib/data/smallTalkTemplates.ts` - 10 opening conversation templates
- `lib/data/backchannelPhrases.ts` - 40+ natural verbal fillers
- `lib/data/companyIntroTemplates.ts` - Dynamic company introduction generation

### Types
- `lib/types/mock.ts` - Mock interview types (MockInterviewAttemptResponse with STAR scoring)

## API Endpoints

### Interview Management
- `GET /api/mock/list` - List all user interviews with statistics
- `POST /api/mock/create` - Create new interview (generates AI questions from resume + job)
- `GET /api/mock/[id]` - Get interview session details
- `POST /api/mock/[id]/complete` - Generate comprehensive interview report

### Realtime Voice Session
- `POST /api/mock/realtime/session` - Get ephemeral WebRTC token and session config
- `POST /api/mock/[id]/tool-response` - Process function calls (save_candidate_answer, advance_phase, end_interview)
- `POST /api/mock/[id]/analyze` - Analyze user's answer with STAR framework

## Database Schema

### Tables (from database/schemas/CurrentSQL_All.sql)

**mock_interviews** - Main session table
- id, user_id, resume_id, job_description_id
- persona_id, duration_minutes, focus, difficulty
- planned_questions (jsonb)
- verdict, overall_score, communication_score, structure_score, role_fit_score, technical_depth_score
- key_strengths, key_gaps, improvement_plan (jsonb), summary
- status (planned | in_progress | completed | abandoned)
- started_at, completed_at, created_at, updated_at

**mock_interview_exchanges** - Question/answer pairs
- id, mock_interview_id, exchange_order
- question_text, question_type, question_competency
- user_transcript, user_audio_url, answer_duration_seconds
- answer_score, star_completeness (jsonb)
- follow_up_needed, follow_up_question, follow_up_transcript, follow_up_score
- created_at

## Features

### Interview Configuration
- **Resume Selection** - Choose resume to base questions on
- **Job Description** - Link job posting for role-specific questions
- **Duration** - 15, 20, or 30 minutes
- **Interviewer Selection** - Auto-selected based on user preferences (gender, voice)
- **AI Question Generation** - GPT-4 generates 3-5 personalized questions from resume + job

### Interview State Machine
States managed by useRealtimeInterview hook:
- IDLE - Initial state, not connected
- CONNECTING - Establishing WebRTC connection
- READY - Connected, waiting for speech
- SPEAKING - AI interviewer is speaking
- LISTENING - User is speaking (VAD detected)
- THINKING - AI is processing response
- INTERRUPTED - User interrupted AI speech
- COMPLETED - Interview finished

### Interview Phases
The conversation is orchestrated through 6 phases:
1. **Welcome** - Greeting and introduction
2. **Small Talk** - Natural conversation opener (10 templates)
3. **Company Intro** - Dynamic company/role description from job posting
4. **Questions** - Main interview questions (3-5 questions)
5. **Wrap-up** - Candidate questions for interviewer
6. **Goodbye** - Warm goodbye and completion

### Live Interview Room
- **Real-time Voice Conversation** - WebRTC streaming with less than 500ms latency
- **Native VAD** - OpenAI semantic VAD for hands-free recording
- **Barge-in Support** - Interrupt AI at any time
- **Audio Visualization** - Live audio levels for both user and AI
- **Conversation Transcript** - Real-time scrolling message history
- **Connection Status** - Live/Connecting/Disconnected indicator
- **Error Recovery** - Retry connection on failure

### AI Interviewer Personas
11 professional personas with OpenAI Realtime voice IDs in lib/data/interviewerPersonas.ts:
- **Female**: Sarah Mitchell (shimmer), Emily Johnson (coral), Jennifer Davis (ballad), Megan Parker (coral), Charlotte Williams (marin)
- **Male**: Michael Chen (ash), David Williams (verse), James Anderson (echo), Robert Thompson (sage), Alex Martinez (alloy), Oliver Bennett (cedar)
- Each with personality, style, warmth/strictness levels, backchannel frequency, and photo URL

### OpenAI Realtime Voice Options
Available voices mapped to personas:
- alloy - Youthful, energetic
- ash - Professional, measured
- ballad - Mature, authoritative
- coral - Warm, friendly
- echo - Direct, efficient
- sage - Mature, commanding
- shimmer - Polished, professional
- verse - Approachable, friendly
- marin - Refined, balanced (female)
- cedar - Refined, balanced (male)

### Natural Conversation Features
- **Small Talk** - 10 opening questions with sentiment-aware responses
- **Backchanneling** - Natural phrases based on persona backchannel_frequency
- **Dynamic Intros** - Company info extracted from job description
- **Personalized Closings** - Warm, human-like goodbye messages
- **Follow-up Handling** - Responds to candidate questions during wrap-up

### Answer Analysis (STAR Framework)
Each answer is analyzed with (see lib/types/mock.ts):
- **Score** - 0-10 rating (content + delivery breakdown)
- **STAR Checklist** - Situation, Task, Action, Result evaluation
- **Content Feedback** - Headline, strengths, improvements
- **Delivery Feedback** - WPM, filler count, pauses, clarity
- **Rewrite** - Polished answer with STAR version
- **Coach Notes** - Specific changes with reasons

### Post-Interview Report
- **Overall Score** - Average of all question scores
- **Summary** - High-level performance overview
- **Key Strengths** - Top 3 strong points
- **Areas for Improvement** - Top 3 development areas
- **Detailed Feedback** - Comprehensive AI analysis
- **Question Breakdown** - Individual scores and feedback per question
- **Recommendations** - Actionable next steps

## External Integrations

### OpenAI Realtime API (Primary Voice System)
- **WebRTC Streaming** - Direct browser-to-OpenAI voice connection
- **Ephemeral Tokens** - Secure client-side authentication (1 min expiry)
- **Semantic VAD** - Context-aware voice activity detection
- **Function Calling** - Phase transitions and answer saving
- **10 Voice Options** - Professional voices optimized for conversation
- **Low Latency** - Real-time conversation experience

### OpenAI (GPT-4)
- **Question Generation** - Personalized questions from resume + job description
- **Answer Analysis** - STAR framework evaluation
- **Report Generation** - Comprehensive feedback synthesis

### Deepgram (NOT used for Mock Interviews)
- Deepgram is used by the Practice section only
- See /skills/practice.md for Deepgram integration details

### ElevenLabs (Legacy - NOT used for Mock Interviews)
- ElevenLabs was previously used for TTS
- Now replaced by OpenAI Realtime API for lower latency
- Voice IDs in interviewerPersonas.ts are kept for backward compatibility

## Design Patterns
- **WebRTC Data Channel** - Events sent via RTCDataChannel (oai-events)
- **State Machine** - 8-state interview flow in useRealtimeInterview hook
- **Phase-based Orchestration** - 6-phase interview structure
- **Function Calling** - AI triggers backend actions via tools
- **Ephemeral Tokens** - Server generates, client uses for WebRTC auth
- **JSONB Conversation History** - Flexible schema for conversation tracking
- **Row Level Security** - Supabase RLS for multi-tenant data

## Common Tasks
- Add new interviewer personas (map OpenAI voices)
- Update interview instruction prompts
- Enhance STAR framework analysis
- Add new small talk templates
- Adjust VAD eagerness settings
- Update company intro extraction
- Add new interview difficulty levels
- Improve error recovery logic
- Improve answer scoring rubrics
- Implement interview replay

## Related Systems
- Practice sessions (separate feature using Deepgram - see /skills/practice.md)
- STAR stories from coaching tab
- Resume data for personalized questions
- Job descriptions for role-specific questions
- Usage tracking and credit system
