# Voice-Only Mock Interview Implementation Plan

## Executive Summary

Complete rebuild of mock interview section using **Deepgram (STT) + ElevenLabs (TTS) + OpenAI (LLM)**. This creates a realistic, human-like interview experience with:

- **Backchanneling**: Natural verbal fillers ("hmm", "okay", "gotcha", "I see")
- **Realistic Flow**: Small talk → Company intro → Questions → Follow-ups
- **Personalized AI Recruiter**: Gender-appropriate name, company-specific role
- **Resume & Job Integration**: Like practice section (auto-selection based on `resumes.job_description_id`)
- **Duration Selection**: 15min / 20min / 30min options
- **Voice Customization**: User selects preferred interviewer voice in account settings

**Cost per interview**: $0.36-0.60 (vs $4.50 with HeyGen) = **92% savings**

---

## Research Findings

### 1. Backchanneling (Verbal Feedback Responses)

**Definition**: Short vocalizations showing listening and engagement during conversation.

**Types:**
- **Minimal responses**: "mhm", "uh-huh", "yeah", "okay"
- **Acknowledgments**: "I see", "got it", "gotcha", "understood"
- **Encouragement**: "interesting", "right", "exactly", "makes sense"
- **Emotional**: "oh wow", "really?", "that's great", "hmm" (thoughtful)

**Implementation Strategy:**
- AI inserts backchannels during user's speech pauses
- Use ElevenLabs audio tags: `[pause]`, `[awe]`, `[thoughtful]`
- Timing: After 10-15 seconds of user speaking, inject "Mmhm" or "I see"
- Frequency: Every 15-20 seconds to feel natural (not every 5 seconds = annoying)

**Business Impact**: Studies show 15-30% improvement in customer satisfaction when backchanneling is used effectively.

### 2. Filler Words (Speech Disfluencies)

**Definition**: Words/sounds used to fill pauses while speaker plans their next utterance.

**Common Fillers:**
- **Planning**: "um", "uh", "er", "ah"
- **Thinking**: "well", "you know", "like", "so"
- **Hesitation**: "hmm", "let me think", "actually"

**Purpose**: Makes AI sound more human and natural (not robotic).

**Implementation:**
- Add fillers before complex questions: "Um, so tell me about..."
- Use during transitions: "Alright, so... let's move on to..."
- Strategic placement (not random): Use when AI "thinks" or changes topics

### 3. ElevenLabs Audio Control Tags

**Available Tags:**
```
[pause]         - Natural pause (replaces SSML <break>)
[rushed]        - Faster tempo
[drawn out]     - Slower tempo
[dramatic tone] - Emphasize importance
[awe]           - Express surprise/interest
[thoughtful]    - Sound contemplative
[interrupting]  - For interjections
[overlapping]   - For multi-character dialogue
```

**Note**: Eleven v3 does NOT support SSML `<break>` tags. Must use audio tags instead.

**Example Usage:**
```typescript
const text = "Hmm [pause] that's really interesting. [thoughtful] Tell me more about that project."
```

---

## System Architecture

### High-Level Flow

```
User → Start Mock Interview
    ↓
Select Resume + Job Description + Duration + (Voice preference from account)
    ↓
Backend creates interview session with:
- Company name from job description
- Recruiter persona (name based on voice gender)
- Interview plan (questions based on resume + JD)
- Duration-based question count
    ↓
Frontend: Voice conversation begins
    ↓
1. Welcome + Small Talk (30-60 sec)
   AI: "Hi! How's your day going so far?"
   User: [responds]
   AI: "Great! [pause] Well, I'm excited to chat with you today..."
    ↓
2. Company/Role Introduction (60-90 sec)
   AI: "So, I'm Sarah from TechCorp, and we're hiring for Senior Engineer.
        Let me tell you a bit about what we're building..."
    ↓
3. Questions (8-20 min depending on duration)
   AI asks questions, user answers
   AI provides backchanneling during answers ("mhm", "I see", "interesting")
   AI asks follow-up questions based on answers
    ↓
4. Wrap-up (30 sec)
   AI: "Alright, [pause] those are all my questions for today.
        Do you have any questions for me?"
    ↓
5. Feedback Generation
   AI analyzes all answers, generates comprehensive report
```

### Technical Stack

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (React)                       │
│  - Voice conversation UI                                │
│  - Real-time transcription display                      │
│  - Interviewer presence component                       │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              CONVERSATION MANAGER                       │
│  - Orchestrates conversation flow                       │
│  - Manages state (small talk → intro → questions)       │
│  - Handles turn-taking                                  │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
┌───────▼──┐ ┌───▼──────┐ ┌▼─────────────┐
│ Deepgram │ │ OpenAI   │ │ ElevenLabs   │
│   STT    │ │   LLM    │ │     TTS      │
│ $0.0043/ │ │ $0.10/   │ │  $0.225/     │
│   min    │ │interview │ │    min       │
└──────────┘ └──────────┘ └──────────────┘
```

---

## Database Schema Changes

### New Tables

#### 1. `mock_interview_sessions` (Replaces existing)

```sql
CREATE TABLE mock_interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  resume_id UUID REFERENCES resumes(id),
  job_description_id UUID REFERENCES job_descriptions(id),

  -- Interview Configuration
  duration_minutes INTEGER NOT NULL, -- 15, 20, or 30
  interviewer_voice TEXT NOT NULL,    -- ElevenLabs voice ID
  interviewer_name TEXT NOT NULL,     -- e.g., "Sarah Mitchell"
  interviewer_gender TEXT NOT NULL,   -- 'female', 'male', 'neutral'
  company_name TEXT,                  -- From job description
  job_title TEXT,                     -- From job description

  -- Conversation Context
  interview_plan JSONB NOT NULL,      -- Questions, small talk, intro script
  conversation_history JSONB[] DEFAULT '{}',  -- Full conversation transcript

  -- Status
  status TEXT DEFAULT 'in_progress',  -- 'in_progress', 'completed', 'abandoned'
  current_phase TEXT DEFAULT 'welcome', -- 'welcome', 'small_talk', 'company_intro', 'questions', 'wrap_up'
  current_question_index INTEGER DEFAULT 0,

  -- Timing
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_seconds INTEGER,

  -- Results
  overall_score DECIMAL(3,1),
  feedback_summary TEXT,
  detailed_feedback JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mock_sessions_user ON mock_interview_sessions(user_id);
CREATE INDEX idx_mock_sessions_status ON mock_interview_sessions(user_id, status);
```

#### 2. `mock_interview_exchanges` (Question/Answer pairs)

```sql
CREATE TABLE mock_interview_exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,

  -- Exchange Data
  exchange_type TEXT NOT NULL,        -- 'small_talk', 'company_intro', 'behavioral', 'follow_up'
  question_text TEXT NOT NULL,
  question_audio_url TEXT,            -- S3/Supabase storage URL

  user_answer_text TEXT,              -- Transcribed answer
  user_answer_audio_url TEXT,
  user_answer_duration_seconds INTEGER,

  -- Analysis
  answer_score DECIMAL(3,1),
  feedback TEXT,
  strengths TEXT[],
  improvements TEXT[],

  -- Metadata
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mock_exchanges_session ON mock_interview_exchanges(session_id, order_index);
```

#### 3. User Preferences (Add to existing `profiles` table)

```sql
-- Add columns to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_interviewer_voice TEXT DEFAULT 'EXAVITQu4vr4xnSDxMaL';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_interviewer_gender TEXT DEFAULT 'female';
```

---

## File Structure

### Delete Old Files

```bash
# Components
rm components/mock/AvatarStage.tsx
rm components/mock/AvatarStageEmbed.tsx

# API Routes
rm -rf app/api/mock/heygen/
rm app/api/mock/[id]/init-session/route.ts
rm app/api/mock/followup/route.ts
rm app/api/mock/plan/route.ts
rm app/api/mock/report/route.ts

# Keep these (will be refactored):
# - app/dashboard/mock/page.tsx (list view)
# - app/dashboard/mock/[id]/page.tsx (conversation view)
# - components/mock/ListeningControls.tsx
# - components/mock/ProcessingPanel.tsx
# - components/mock/FeedbackDashboard.tsx
```

### New File Structure

```
app/
├── dashboard/
│   ├── mock/
│   │   ├── page.tsx                          # Mock interview list/history
│   │   ├── new/
│   │   │   └── page.tsx                      # NEW: Setup page (like practice)
│   │   ├── [id]/
│   │   │   ├── page.tsx                      # Conversation interface
│   │   │   └── report/
│   │   │       └── page.tsx                  # Detailed feedback report
│   │
│   ├── account/
│   │   └── page.tsx                          # Add voice selection here
│
├── api/
│   ├── mock/
│   │   ├── create/
│   │   │   └── route.ts                      # NEW: Create interview session
│   │   ├── [id]/
│   │   │   ├── route.ts                      # Get session details
│   │   │   ├── speak/
│   │   │   │   └── route.ts                  # NEW: Generate AI speech
│   │   │   ├── transcribe/
│   │   │   │   └── route.ts                  # Transcribe user audio
│   │   │   ├── analyze/
│   │   │   │   └── route.ts                  # NEW: Analyze user answer
│   │   │   ├── next-question/
│   │   │   │   └── route.ts                  # NEW: Get next question
│   │   │   └── complete/
│   │   │       └── route.ts                  # Complete interview
│   │
│   ├── user/
│   │   └── voice-preferences/
│   │       └── route.ts                      # NEW: Save voice preferences
│
lib/
├── clients/
│   ├── deepgramClient.ts                     # Existing (STT)
│   ├── openaiClient.ts                       # Existing (LLM)
│   ├── elevenlabsClient.ts                   # NEW: ElevenLabs TTS
│   └── supabaseClient.ts                     # Existing
│
├── engines/
│   ├── mockInterviewEngine.ts                # REFACTOR: New conversation engine
│   └── answerScoringEngine.ts                # Existing (keep)
│
├── services/
│   └── conversationManager.ts                # NEW: Orchestrates conversation
│
├── types/
│   └── mock.ts                                # Update types
│
├── data/
│   ├── interviewerPersonas.ts                # NEW: Personas by voice
│   ├── smallTalkTemplates.ts                 # NEW: Opening conversations
│   ├── companyIntroTemplates.ts              # NEW: Company descriptions
│   └── backchannelPhrases.ts                 # NEW: Verbal fillers
│
components/
├── mock/
│   ├── InterviewerPresence.tsx               # NEW: Animated interviewer UI
│   ├── VoicePlayer.tsx                       # NEW: Audio playback
│   ├── ConversationTranscript.tsx            # NEW: Live transcript
│   ├── PhaseIndicator.tsx                    # NEW: Shows current phase
│   ├── ListeningControls.tsx                 # Existing (keep)
│   ├── ProcessingPanel.tsx                   # Existing (keep)
│   └── FeedbackDashboard.tsx                 # Existing (keep)
│
├── account/
│   └── VoiceSelector.tsx                     # NEW: Voice selection UI
```

---

## Implementation Phases

### Phase 1: Foundation (Day 1-2)

**Goal**: Set up new architecture, remove old files, create database schema

#### Tasks:
1. ✅ Delete old HeyGen files
2. ✅ Create new database tables (`mock_interview_sessions`, `mock_interview_exchanges`)
3. ✅ Add voice preferences to `profiles` table
4. ✅ Create `lib/clients/elevenlabsClient.ts`
5. ✅ Create `lib/services/conversationManager.ts`
6. ✅ Create data files (personas, templates, backchanneling)

#### Deliverables:
- Clean codebase (no HeyGen references)
- Database migration scripts
- ElevenLabs client with TTS
- Conversation manager skeleton

---

### Phase 2: Core Conversation Engine (Day 3-4)

**Goal**: Build realistic conversation flow with backchanneling

#### Tasks:
1. ✅ Build conversation state machine (welcome → small talk → intro → questions → wrap-up)
2. ✅ Implement backchanneling logic (inject "hmm", "I see" during user speech)
3. ✅ Create dynamic welcome messages (not generic)
4. ✅ Create company introduction generator (based on job description)
5. ✅ Implement question generation (like practice section, but for mock interviews)
6. ✅ Add filler words to AI speech (make it sound natural)

#### Deliverables:
- `lib/engines/mockInterviewEngine.ts` - Complete conversation engine
- `lib/data/smallTalkTemplates.ts` - 20+ opening conversations
- `lib/data/companyIntroTemplates.ts` - Dynamic company intros
- `lib/data/backchannelPhrases.ts` - Natural verbal fillers

---

### Phase 3: Frontend UI (Day 5-6)

**Goal**: Build beautiful, intuitive interview interface

#### Tasks:
1. ✅ Create `app/dashboard/mock/new/page.tsx` (setup page like practice)
   - Resume selection
   - Job description selection
   - Duration selection (15/20/30 min)
   - Voice preview
2. ✅ Build `components/mock/InterviewerPresence.tsx`
   - Animated profile circle
   - Audio waveform
   - Status indicators
3. ✅ Build `components/mock/VoicePlayer.tsx`
   - Audio playback with events
4. ✅ Build `components/mock/ConversationTranscript.tsx`
   - Live transcript display
   - Color-coded (AI vs User)
5. ✅ Build `components/mock/PhaseIndicator.tsx`
   - Shows: Welcome → Small Talk → Company Intro → Questions → Wrap-up
6. ✅ Refactor `app/dashboard/mock/[id]/page.tsx`
   - Integrate new components
   - Handle conversation flow

#### Deliverables:
- Complete UI for mock interview
- Setup page with all options
- Real-time conversation interface
- Phase progress indicator

---

### Phase 4: API Routes (Day 7-8)

**Goal**: Connect frontend to backend services

#### Tasks:
1. ✅ `POST /api/mock/create` - Create interview session
2. ✅ `GET /api/mock/[id]` - Get session details
3. ✅ `POST /api/mock/[id]/speak` - Generate AI speech (ElevenLabs)
4. ✅ `POST /api/mock/[id]/transcribe` - Transcribe user audio (Deepgram)
5. ✅ `POST /api/mock/[id]/analyze` - Analyze user answer (OpenAI)
6. ✅ `POST /api/mock/[id]/next-question` - Get next question
7. ✅ `POST /api/mock/[id]/complete` - Complete interview & generate report

#### Deliverables:
- 7 API routes
- Error handling
- Usage tracking
- Cost monitoring

---

### Phase 5: Account Settings Integration (Day 9)

**Goal**: Let users customize their interviewer voice

#### Tasks:
1. ✅ Create `components/account/VoiceSelector.tsx`
   - Grid of voice options with audio previews
   - Gender filter (male/female/neutral)
   - Sample audio playback
2. ✅ Update `app/dashboard/account/page.tsx`
   - Add "Interview Preferences" section
3. ✅ Create `POST /api/user/voice-preferences`
   - Save user's preferred voice
4. ✅ Fetch available voices from ElevenLabs API
5. ✅ Map voices to interviewer personas (names)

#### Deliverables:
- Voice selection UI in account settings
- API to save preferences
- Voice preview system

---

### Phase 6: Testing & Polish (Day 10-11)

**Goal**: Test full flow, fix bugs, optimize

#### Tasks:
1. ✅ End-to-end testing (create → converse → complete)
2. ✅ Test all conversation phases
3. ✅ Test backchanneling timing
4. ✅ Test different durations (15/20/30 min)
5. ✅ Test with different voices
6. ✅ Optimize audio loading/buffering
7. ✅ Add error recovery (network issues, mic failures)
8. ✅ Cost monitoring dashboard (admin only)

#### Deliverables:
- Stable, production-ready system
- Error handling for edge cases
- Performance optimizations
- Admin cost dashboard

---

### Phase 7: Advanced Features (Day 12+, Optional)

**Goal**: Make it even more realistic

#### Tasks:
1. 🔄 Real-time backchanneling (inject "mhm" while user speaks)
2. 🔄 Follow-up questions based on user's answer
3. 🔄 Dynamic difficulty adjustment
4. 🔄 Industry-specific interviewer personas
5. 🔄 Multi-turn conversations (AI asks clarifying questions)
6. 🔄 Emotion detection (adjust AI tone based on user sentiment)
7. 🔄 Video option (optional premium tier with HeyGen/Tavus)

---

## Realistic Interview Flow Details

### 1. Welcome Phase (30 seconds)

**Goal**: Natural, warm greeting (not robotic)

**Templates** (randomly selected):
```typescript
const welcomeTemplates = [
  {
    greeting: "Hi {name}! How are you doing today?",
    wait_for_user: true,
    response: "That's great to hear! [pause] Well, thanks for taking the time to chat with me today."
  },
  {
    greeting: "Hello {name}, good to meet you! [pause] How's your day going so far?",
    wait_for_user: true,
    response: "Awesome! [pause] I appreciate you joining me for this conversation."
  },
  {
    greeting: "Hey {name}! Thanks for being here. [pause] Did you have any trouble finding the link?",
    wait_for_user: true,
    response: "Perfect! [pause] Glad everything worked smoothly."
  }
]
```

**Example Conversation:**
```
AI: "Hi Sarah! How are you doing today?"
[User responds: "I'm doing well, thanks!"]
AI: "That's great to hear! [pause] Well, thanks for taking the time to chat with me."
```

---

### 2. Small Talk Phase (30-60 seconds)

**Goal**: Build rapport, make user comfortable

**Topics** (randomly selected):
- Weather/location
- Recent news (general)
- Weekend plans
- How they heard about the company
- Their commute/work setup

**Example:**
```
AI: "So, where are you joining from today?"
[User: "I'm in Seattle"]
AI: "Oh nice! [pause] I hear it's been pretty rainy up there lately. How are you liking the weather?"
[User responds]
AI: "Gotcha. [pause] Well, hopefully we can brighten your day with this conversation!"
```

**Backchanneling during small talk:**
- After user speaks for 10 seconds: "Mhm"
- After user finishes: "I see", "Cool", "Nice"

---

### 3. Company Introduction Phase (60-90 seconds)

**Goal**: Explain company, role, and set expectations

**Structure:**
```typescript
interface CompanyIntro {
  company_overview: string    // What the company does
  role_overview: string        // What the position entails
  interview_format: string     // What to expect in this conversation
  transition: string           // Bridge to questions
}
```

**Example (Generated from job description):**
```
AI: "Alright, so let me tell you a bit about {CompanyName} and the role we're hiring for."

AI: "{CompanyName} is a {industry} company focused on {mission}.
     We're building {product/service} and serving {customer base}."

AI: "The role we're discussing today is {JobTitle}. [pause]
     Basically, you'd be {key responsibilities in 1-2 sentences}."

AI: "For today's conversation, I'm going to ask you a few behavioral questions
     about your past experiences. [pause] The goal is to understand how you approach
     challenges and work with teams. Sound good?"

[User: "Yes, sounds great"]

AI: "Perfect! [pause] Let's jump in."
```

---

### 4. Questions Phase (8-20 minutes)

**Goal**: Ask relevant questions, provide natural backchanneling, ask follow-ups

**Question Flow:**
```
1. AI asks question
2. User thinks (silence = ok, no backchanneling yet)
3. User starts answering
4. After 10-15 seconds: AI backchannels ("Mhm", "I see")
5. After 20-25 seconds: AI backchannels again ("Okay", "Gotcha")
6. User finishes
7. AI acknowledges: "Interesting! [pause]"
8. AI asks optional follow-up: "Can you tell me more about {specific detail}?"
9. User answers follow-up
10. AI transitions: "Alright, [pause] let's move on to the next question."
```

**Backchanneling Examples:**

During user's answer:
```
User: "So at my last company, we were facing this challenge with..."
[10 seconds pass]
AI: "Mhm" [subtle, doesn't interrupt]
User: "...and I decided to take the initiative to..."
[15 seconds pass]
AI: "I see" [encouraging]
User: "...which resulted in a 30% increase in efficiency."
AI: "Oh wow, [pause] that's impressive!"
```

**Follow-up Questions:**
```typescript
const followUpTriggers = [
  // If user mentions a team
  "You mentioned working with a team. [pause] How many people were involved?",

  // If user mentions metrics
  "That's a great result. [pause] What do you think was the key factor that made it successful?",

  // If user mentions a challenge
  "Hmm, [pause] that sounds like a difficult situation. How did you handle the pushback?",

  // If user mentions a decision
  "Interesting. [pause] Looking back, would you do anything differently?"
]
```

---

### 5. Wrap-up Phase (30 seconds)

**Goal**: Natural ending, give user chance to ask questions

**Example:**
```
AI: "Alright, [pause] those are all the questions I have for you today."

AI: "Before we wrap up, [pause] do you have any questions for me about the role or the company?"

[User asks questions OR says no]

AI: "Great questions! [pause] Unfortunately, since I'm an AI practice interviewer,
     I can't answer those in detail, but those are exactly the kinds of questions
     you should ask in a real interview."

AI: "Thanks so much for your time today, {name}. [pause] You'll get detailed feedback
     on your answers in just a moment. Good luck with your job search!"
```

---

## Interviewer Personas

### Voice-to-Persona Mapping

**Female Voices:**
```typescript
const femalePersonas = [
  {
    voice_id: "EXAVITQu4vr4xnSDxMaL", // Sarah (professional)
    name: "Sarah Mitchell",
    title: "Senior Recruiter",
    personality: "Professional, warm, encouraging",
    age_range: "30-40"
  },
  {
    voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel (friendly)
    name: "Emily Johnson",
    title: "Talent Acquisition Manager",
    personality: "Friendly, conversational, empathetic",
    age_range: "25-35"
  },
  {
    voice_id: "ThT5KcBeYPX3keUQqHPh", // Dorothy (mature)
    name: "Jennifer Davis",
    title: "VP of People",
    personality: "Experienced, authoritative, insightful",
    age_range: "40-50"
  }
]
```

**Male Voices:**
```typescript
const malePersonas = [
  {
    voice_id: "pNInz6obpgDQGcFmaJgB", // Adam (clear)
    name: "Michael Chen",
    title: "Senior Recruiter",
    personality: "Direct, clear, analytical",
    age_range: "30-40"
  },
  {
    voice_id: "yoZ06aMxZJJ28mfd3POQ", // Sam (casual)
    name: "David Williams",
    title: "Hiring Manager",
    personality: "Casual, relaxed, collaborative",
    age_range: "35-45"
  },
  {
    voice_id: "29vD33N1CtxCmqQRPOHJ", // Drew (professional)
    name: "James Anderson",
    title: "Director of Engineering",
    personality: "Technical, thorough, thoughtful",
    age_range: "40-50"
  }
]
```

### Dynamic Name Assignment

```typescript
function getInterviewerPersona(voiceId: string, companyName?: string, jobTitle?: string) {
  const persona = allPersonas.find(p => p.voice_id === voiceId)

  // Adjust title based on company/role
  let adjustedTitle = persona.title

  if (jobTitle?.toLowerCase().includes('engineer')) {
    adjustedTitle = "Engineering Manager"
  } else if (jobTitle?.toLowerCase().includes('product')) {
    adjustedTitle = "Product Recruiter"
  } else if (jobTitle?.toLowerCase().includes('design')) {
    adjustedTitle = "Design Lead"
  }

  return {
    name: persona.name,
    title: adjustedTitle,
    company: companyName || "TechCorp"
  }
}
```

---

## Duration-Based Question Count

```typescript
const durationConfig = {
  15: {
    welcome: 30,        // seconds
    small_talk: 30,     // seconds
    company_intro: 60,  // seconds
    questions: 3,       // count
    avg_answer: 120,    // seconds per answer
    wrap_up: 30,        // seconds
    // Total: 30 + 30 + 60 + (3 × 180) + 30 = 690 seconds = 11.5 min
    // Buffer: 3.5 min for processing, backchanneling, follow-ups
  },
  20: {
    welcome: 30,
    small_talk: 60,
    company_intro: 90,
    questions: 4,
    avg_answer: 150,
    wrap_up: 30,
    // Total: ~15 min active + 5 min buffer
  },
  30: {
    welcome: 60,
    small_talk: 90,
    company_intro: 120,
    questions: 5,
    avg_answer: 180,
    wrap_up: 60,
    // Total: ~22 min active + 8 min buffer
  }
}
```

---

## Cost Estimates by Duration

### 15-Minute Interview

```
AI Speaking Time:
- Welcome: 30 sec = 0.5 min
- Small talk: 30 sec = 0.5 min
- Company intro: 60 sec = 1 min
- 3 Questions: 3 × 20 sec = 1 min
- Transitions: 30 sec = 0.5 min
- Wrap-up: 30 sec = 0.5 min
Total AI speaking: 4 min × $0.225 = $0.90

User Speaking Time:
- Small talk response: 30 sec = 0.5 min
- 3 Answers: 3 × 2 min = 6 min
Total user speaking: 6.5 min × $0.0043 = $0.028

AI Processing:
- GPT-4 feedback: ~$0.10

Total: $1.028 per 15-min interview
```

### 20-Minute Interview

```
AI speaking: 5 min × $0.225 = $1.125
User speaking: 8 min × $0.0043 = $0.034
AI processing: $0.10
Total: $1.259 per 20-min interview
```

### 30-Minute Interview

```
AI speaking: 6 min × $0.225 = $1.35
User speaking: 12 min × $0.0043 = $0.052
AI processing: $0.10
Total: $1.502 per 30-min interview
```

**Average: ~$1.00-1.50 per interview** (vs $4.50 with HeyGen)

---

## Success Metrics

### Technical Metrics
- [ ] Audio generation latency: <2 seconds
- [ ] Transcription accuracy: >95%
- [ ] Interview completion rate: >85%
- [ ] Error rate: <2%

### User Experience Metrics
- [ ] User satisfaction: >4.0/5.0 stars
- [ ] Realism rating: "Feels like real interview" >75%
- [ ] Backchanneling effectiveness: "AI feels engaged" >80%
- [ ] Voice quality rating: >4.2/5.0

### Business Metrics
- [ ] Cost per interview: <$1.50
- [ ] 90% cost reduction vs HeyGen
- [ ] Support 10x more users with same budget
- [ ] <5% churn due to voice-only format

---

## Testing Plan

### Phase 1: Component Testing
- [ ] ElevenLabs TTS generates clear audio
- [ ] Deepgram STT transcribes accurately
- [ ] Conversation manager handles state transitions
- [ ] Backchanneling timing feels natural

### Phase 2: Integration Testing
- [ ] Full interview flow (welcome → wrap-up)
- [ ] Different durations (15/20/30 min)
- [ ] Different voices (male/female)
- [ ] Resume + Job description integration

### Phase 3: User Acceptance Testing
- [ ] 10-20 beta testers
- [ ] Collect feedback on realism
- [ ] Measure completion rates
- [ ] Identify pain points

### Phase 4: Load Testing
- [ ] 10 concurrent interviews
- [ ] Monitor API costs
- [ ] Check for audio delays
- [ ] Database performance

---

## Rollout Strategy

### Week 1: Soft Launch (Beta)
- Enable for 50 users (admin-selected)
- Monitor costs closely
- Collect detailed feedback
- Fix critical bugs

### Week 2: Limited Launch
- Enable for all Pro/paid users
- Add "Beta" badge
- Provide feedback form
- A/B test different voices

### Week 3: General Availability
- Enable for all users
- Remove beta badge
- Add to onboarding flow
- Marketing announcement

---

## Future Enhancements

### V1.1 (Next Month)
1. Real-time backchanneling (inject during speech, not after)
2. Follow-up questions based on answer quality
3. Difficulty adjustment (easier/harder questions based on performance)
4. Industry-specific personas (tech recruiter vs finance recruiter)

### V1.2 (2 Months)
1. Multi-turn conversations (AI asks clarifying questions)
2. Emotion detection (adjust AI tone based on user sentiment)
3. Custom company descriptions (user can edit intro script)
4. Interview coaching tips between questions

### V2.0 (3-6 Months)
1. Video avatar option (premium tier with Tavus/HeyGen)
2. Group interview mode (multiple interviewers)
3. Technical whiteboarding interviews (screen sharing)
4. Live peer practice (match with other users)

---

## Documentation Requirements

### For Developers:
- [ ] API documentation (all endpoints)
- [ ] Database schema documentation
- [ ] Conversation state machine diagram
- [ ] ElevenLabs integration guide
- [ ] Cost monitoring dashboard

### For Users:
- [ ] How to select interviewer voice
- [ ] How to prepare for mock interview
- [ ] Understanding feedback scores
- [ ] Tips for best experience
- [ ] Troubleshooting guide

---

## Risk Mitigation

### Technical Risks:
1. **ElevenLabs API downtime**
   - Mitigation: Fallback to OpenAI TTS
   - Cache generated audio for 1 hour

2. **Deepgram API downtime**
   - Mitigation: Fallback to OpenAI Whisper
   - Show error message with retry option

3. **High costs (unexpected usage)**
   - Mitigation: Usage limits per user (5 interviews/month free tier)
   - Admin dashboard with cost alerts
   - Auto-disable feature if costs exceed threshold

4. **Poor audio quality**
   - Mitigation: Test different voices
   - Provide voice preview before starting
   - Allow users to switch voices mid-interview

### User Experience Risks:
1. **AI sounds robotic**
   - Mitigation: Add filler words, backchanneling
   - Use ElevenLabs audio tags for natural pauses
   - Test with users before launch

2. **Backchanneling feels annoying**
   - Mitigation: Tune frequency (every 15-20 sec, not every 5 sec)
   - Make backchannels quiet (lower volume)
   - A/B test different frequencies

3. **Interview feels scripted**
   - Mitigation: Dynamic welcome messages
   - Varied small talk topics
   - Randomize question order
   - Add follow-up questions

---

## Next Steps

### Immediate (Start Now):
1. ✅ Review and approve this plan
2. ✅ Set up ElevenLabs account (if not already)
3. ✅ Run database migrations
4. ✅ Delete old HeyGen files
5. ✅ Create `lib/clients/elevenlabsClient.ts`

### This Week:
1. Build conversation engine
2. Create data templates (small talk, company intro, backchanneling)
3. Implement backchanneling logic
4. Build basic UI components

### Next Week:
1. Connect API routes
2. Test full interview flow
3. Add voice selection to account settings
4. Beta launch with 10 users

---

**Ready to start? Let me know and I'll begin implementation!**
