# Product Requirement Document (PRD): Voice AI Practice Section

## 1. Executive Summary
The "Practice Section" is a core feature of JobFoxy designed to help candidates master behavioral interviews using the STAR (Situation, Task, Action, Result) method. By leveraging Voice AI (Deepgram) and LLMs (OpenAI), the system simulates a real interview environment where users practice answering questions generated from their specific Resume and target Job Description.

## 2. Goals & Objectives
*   **Primary Goal:** Provide a realistic, voice-interactive interview practice environment.
*   **Secondary Goal:** Give actionable, data-driven feedback on user answers using the STAR framework.
*   **UX Goal:** Create a focused, low-latency, and visually engaging experience (Focus Mode).

## 3. User Stories
*   **As a user,** I want to select a specific Resume and Job Description so that the interview questions are relevant to my target role.
*   **As a user,** I want to hear the AI ask the question (Text-to-Speech) to simulate a real interviewer.
*   **As a user,** I want to answer verbally and have my speech transcribed (Speech-to-Text).
*   **As a user,** I need controls to Start, Pause, and Restart my answer if I stumble.
*   **As a user,** I want immediate feedback on my answer, specifically if I missed any part of the STAR method.
*   **As a user,** I want to see an "Ideal Answer" to understand how I could have improved.
*   **As a user,** I want to request more questions if I want to continue practicing.

## 4. Functional Requirements

### 4.1. Session Setup
*   **Inputs:**
    *   Select `Resume` (Current Resume).
    *   Select `Job Description` (Current Job Description used in this resume [id]).
    *   Select `Question Category` (Behavioral, Leadership, etc. - Optional, default to Mixed).
    *   Select `Question Count` (Default: 5).
*   **Action:** Generate a `Practice Session` and 5 initial STAR questions based on the inputs.
*   **Database:** Create entry in `practice_sessions` and `practice_questions`.

### 4.2. The Practice Loop (Interactive Session)
The core experience follows this loop for each question:

1.  **Question Presentation:**
    *   **Visual:** Display the question text clearly.
    *   **Audio:** AI reads the question aloud (TTS via Deepgram/OpenAI).
    *   **State:** `AI_SPEAKING`

2.  **User Preparation (Optional):**
    *   User can have a short "Think Time" timer (optional, e.g., 30s) or click "Ready to Answer".

3.  **Answering (Recording):**
    *   **Action:** User clicks "Start Recording" (or auto-start after prep).
    *   **Visual:** Audio waveform visualizer (active state).
    *   **Controls:**
        *   `Pause`: Pauses recording timer.
        *   `Resume`: Continues recording.
        *   `Restart`: Discards current audio and starts over.
        *   `Done/Submit`: Finishes recording and sends for analysis.
    *   **State:** `USER_RECORDING`

4.  **Analysis & Feedback:**
    *   **Process:**
        1.  Transcribe Audio (STT via Deepgram).
        2.  Score Answer (via `answerScoringEngine`).
        3.  Generate Ideal Answer (via `answerScoringEngine`).
    *   **Visual:** Loading/Processing animation.
    *   **Output (Feedback View):**
        *   **Transcript:** Display what the user said.
        *   **STAR Score:** Checkmarks/X for Situation, Task, Action, Result.
        *   **Feedback:** Strengths and Improvements.
        *   **Potential Answer:** A generated ideal response.
    *   **Controls:** "Next Question" or "Try Again".

### 4.3. Session Summary
*   At the end of 5 questions, show a session report.
*   **Metrics:** Overall Score, STAR Completion Rate, Clarity, Relevance.
*   **Action:** "Generate 5 More Questions" (appends to current session).

## 5. UI/UX Design Requirements

### 5.1. General Layout
*   **Focus Mode:** Minimal distractions. No sidebars during the active session.
*   **Dark/Light Mode:** consistent with system theme.

### 5.2. Key Components
*   **Audio Visualizer:** A dynamic waveform that reacts to the user's voice intensity.
*   **Control Bar:** Large, accessible buttons for Start/Stop/Pause.
*   **Feedback Card:** An expandable card that reveals the analysis after the answer. It should not clutter the screen while answering.
*   **Progress Indicator:** "Question 2 of 5".

## 6. Technical Specifications

### 6.1. Integrations
*   **Voice AI (Deepgram):**
    *   **STT (Speech-to-Text):** For high-speed transcription of user answers.
    *   **TTS (Text-to-Speech):** For reading questions (or use OpenAI TTS if preferred).
    *   **Settings:** Voice selection and language preferences managed in User Settings, but passed to the session context.
*   **OpenAI (LLM):**
    *   Question Generation (`gpt-4-turbo` or `gpt-3.5-turbo`).
    *   Answer Scoring & Feedback.
    *   Ideal Answer Generation.

### 6.2. Data Flow
1.  **Frontend:** `app/dashboard/practice/session/[id]`
2.  **API:** `POST /api/practice/questions` (Generate)
3.  **API:** `POST /api/practice/score` (Evaluate)
    *   Input: `audio_blob` or `transcript`, `question_id`, `job_description_id`.
    *   Process:
        *   Send Audio -> Deepgram (STT) -> Transcript.
        *   Send Transcript + Context -> OpenAI (Scoring Engine).
    *   Output: JSON Score + Feedback.

### 6.3. Database Schema (Existing)
*   `practice_sessions`: Tracks the overall session.
*   `practice_questions`: Stores generated questions.
*   `practice_answers`: Stores user transcripts, audio URLs (optional), and JSON analysis results.

## 7. Future Considerations (Post-MVP)
*   **Video Recording:** Analyze facial expressions and body language.
*   **Interruption Handling:** Allow users to interrupt the AI.
*   **Real-time Coaching:** AI hints during the answer (e.g., "Don't forget the Result!").

## 8. Immediate Action Plan
1.  **Refactor UI:** Update `app/dashboard/practice/session/[id]` to match the "Focus Mode" design.
2.  **Implement Voice Loop:** Connect Deepgram STT/TTS hooks.
3.  **Connect Scoring:** Ensure `answerScoringEngine` is triggered immediately after submission.
