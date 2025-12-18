# 01 – Architecture Overview

## 1. High-Level Architecture

- **Frontend:** Next.js (App Router), React, Tailwind, ShadCN, Framer Motion.
- **Backend:** Next.js API routes or serverless functions.
- **AI Layer:** OpenAI LLM(s) for:
  - Resume and JD parsing
  - SWOT, STAR, Gap Defense
  - Interview question generation
  - Scoring, feedback, summaries
- **Voice Layer:** Deepgram:
  - TTS for AI interviewer voice
  - STT for user answers
- **Data Storage:** Supabase (Postgres + Auth + Storage).

---

## 2. Core Services (Logical)

- **User Service** – auth, profile, subscription state.
- **Resume Service** – resume CRUD, parsing, template config.
- **Job Description Service** – JD CRUD, parsing.
- **Analysis Service** – fit scoring, ATS-like checks, skills.
- **Coaching Service** – SWOT, STAR stories, intro pitch, gap defense.
- **Practice Service** – STAR practice sessions, scoring, summary.
- **Mock Interview Service** – scripted + dynamic interview flows.
- **Content Service** – video lesson metadata, questions library.
- **Export Service** – PDF/DOCX export for resumes, scripts, reports.

---

## 3. Bottom Tab Navigation (Global)

The bottom tab bar is always visible (except in full-screen modals):

Tabs:

1. `/home`  
2. `/resume`  
   - internal segmented: Builder / Analysis  
3. `/coaching`  
4. `/practice` (STAR Interview Practice)  
5. `/mock` (Mock Interview)  
6. `/account`  

---

## 4. Shared Design Tokens

- **Background**: Focus Flow gradient:
  - Deep Royal Blue → Teal / Cyan → Warm Lavender
- **Primary Accent**: Vivid Purple / Indigo `#6C47FF`
- **Neutral Surfaces**:
  - Glass: white with 60–80% opacity + 20–30px blur.
  - Cards: 8–12px radius, subtle drop shadow.
- **Typography**:
  - Heading: `SF Pro Display` / `Inter` (semibold).
  - Body: `Inter` (regular).

---

## 5. Layout Patterns

Across the app, we reuse a **Studio pattern**:

- Left (when used): Navigation / Outline (sections or tools).
- Center: Main content (resume, script, interview, dashboards).
- Right: Inspector / AI cards / templates / controls.

Coaching and Resume Editor share this pattern, to reduce cognitive load.

---

## 6. Audio + AI Flow (Practice / Mock)

1. TTS: Deepgram reads out the question.
2. Countdown: 5… 4… 3… 2… 1.
3. User speaks → audio recorded.
4. STT: Deepgram transcribes response.
5. LLM:
   - Evaluates STAR structure.
   - Checks alignment with JD and resume.
   - Scores answer on multiple KPIs.
6. Result:
   - For Practice: Detailed per-question feedback + session summary.
   - For Mock: Interview-style report + verdict + 7-day plan.

---

## 7. Roles

- **User (Candidate)** – full access to their content & tools according to plan.
- **Admin** – same as user + Admin Tab with:
  - System reports
  - Content management
  - User flags
