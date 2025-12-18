# 14 – Mock Interview Tab

## 1. Purpose

Simulate a **full interview** with:

- HR / Recruiter persona
- Hiring Manager persona
- Technical Lead persona

Using:

- Deepgram TTS for AI.
- Deepgram STT for user responses.
- Hybrid engine:
  - Structured core questions.
  - Dynamic follow-ups.

---

## 2. Layout & Flow

Route: `/mock`

Screens:

1. Pre-Interview Settings (Guided configuration)
2. Live Interview Room
3. Mock Interview Report

---

## 3. Pre-Interview Settings (Guided)

Based on our earlier decision, use **AI-Guided, Editable Controls**:

Panel includes:

- Suggested Config (top):
  - “Recommended: Hiring Manager (James), 15 min, Mixed Behavioral + Leadership.”

Editable controls:
- Interviewer Persona:
  - Emma – Recruiter
  - James – Hiring Manager
  - Sato – Technical Lead
- Duration:
  - 10 / 15 / 25 minutes.
- Focus:
  - Behavioral heavy
  - Technical heavy
  - Mixed
- Difficulty:
  - Easy / Standard / Hard

Start button:
- “Start Mock Interview”

---

## 4. Live Interview Room

Layout:

Center “Glass Monolith”:

- Top:
  - Avatar area:
    - For MVP: static persona photo.
    - Future Pro: live avatar video.
- Middle:
  - Waveform visualizer:
    - Blue: AI speaking.
    - Green: User speaking.
- Bottom:
  - Name & role: “Emma – Senior Recruiter”.

Question Text:
- Appears at top, full opacity while AI speaks.
- Fades to 30–50% opacity during user answer.

Mic Control:
- Floating circular mic button at bottom center:
  - Listens / Recording state.
- Optional:
  - Manual “End Answer” button, or auto with silence.

---

## 5. Engine Logic (Summary)

- Hybrid Structured + Dynamic:

  - Core skeleton:
    - Intro.
    - 2–3 Behavioral questions.
    - 1–2 Technical (if relevant).
    - Wrap-up question.

  - Dynamic follow-ups:
    - If answer missing Result → “What was the outcome?”
    - If answer vague → “What was your role?”
    - If good → “Great, let’s move on.”

- Ending criteria:
  - STAR completeness OR
  - Time limit OR
  - Follow-up limit per question (max 1–2).

---

## 6. Mock Interview Report

After interview ends:

- Verdict Badge:
  - “Strong Hire”
  - “Hire”
  - “Borderline”
  - “No Hire” (soft phrasing: “Not Ready Yet”)

KPIs:
- Communication
- Structure (STAR)
- Role Fit
- Technical depth (if relevant)

7-Day Plan:
- Day 1: Fix STAR results.
- Day 3: Practice conflict questions.
- Day 5: Run another Mock with Tech persona.

Export:
- PDF “Interview Report”:
  - Summary.
  - Key strengths.
  - Key gaps.
  - Recommended practice items.