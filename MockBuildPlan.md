# Mock Interview Build Plan

## Phase 1: Database Schema Updates
- [ ] **Create Migration SQL**: `database/migrations/update_mock_interview_schema.sql`
    - Create `mock_interview_attempts` table (handling attempts, scores, audio, rewrite, feedback).
    - Update `mock_interview_exchanges` table (add `final_attempt_id`, clean up redundant columns).
    - Update `star_stories` table (add fields for "Answer Library" features: `polished_answer`, `coach_notes`, `source_attempt_id`, `job_description_id`).
    - Update `mock_interviews` table (adjust for new lifecycle/status).
- [ ] **Update TypeScript Types**: `database/types/database.types.ts` (Manual update to reflect schema changes if generation isn't available).

## Phase 2: Backend Implementation
- [ ] **Mock Interview Engine**: `lib/engines/mockInterviewEngine.ts`
    - Implement `MockInterviewAttemptResponse` interface (JSON contract).
    - Create logic for `generateQuestionPlan` (Competency-balanced).
    - Create logic for `processAttempt` (OpenAI interaction, streaming/scoring).
    - Create logic for `generateFollowUp`.
- [ ] **API Routes**:
    - `POST /api/mock/init`: Create session, select questions.
    - `POST /api/mock/[id]/next-question`: Retrieve next question logic (cached/generated).
    - `POST /api/mock/attempts/submit`: Handle answer submission, STT verification (if proxy), OpenAI call.
    - `POST /api/mock/attempts/retry`: Create new attempt for existing exchange.
    - `POST /api/mock/[id]/finish`: Summarize session.
    - `GET /api/mock/token`: (Optional) Get ephemeral Deepgram token if using Client-side streaming.

## Phase 3: Frontend Implementation
- [ ] **Components**: `components/mock/`
    - `AvatarStage.tsx`: Handle HeyGen video/fallback loop.
    - `ListeningControls.tsx`: Mic visualizer, "Finish Answer" button (VAD logic).
    - `ProcessingPanel.tsx`: Skeleton loading state.
    - `FeedbackDashboard.tsx`: Main feedback view (Tabs for Content/Delivery).
    - `RewritePanel.tsx`: Before/After comparison view.
- [ ] **Page Logic**: `app/dashboard/mock/[id]/page.tsx`
    - Implement the View State Machine (`INTRO_LOADING`, `ASKING`, `LISTENING`, `PROCESSING`, `FEEDBACK`).
    - Manage WebSocket/Data connections.
    - Handle transitions and error states.

## Phase 4: Integration & Polish
- [ ] **Services**:
    - `lib/clients/deepgramClient.ts`: Ensure streaming support or token generation.
    - `lib/clients/heyGenClient.ts`: Implement avatar session management and "speak" calls.
- [ ] **Testing**:
    - Verify database writes.
    - Verify OpenAI JSON output parsing.
    - Test UI state transitions.
