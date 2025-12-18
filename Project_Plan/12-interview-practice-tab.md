# 12 – Interview Practice Tab (STAR Practice Lab)

## 1. Purpose

Let candidates **practice STAR answers out loud** to targeted questions, with:

- Deepgram voice reading questions.
- Two-phase flow: Focus → Debrief.
- Per-question scoring.
- Session summary.

---

## 2. Layout & Flow

Route: `/practice`

Screens:

1. Topic/Track Selection
2. Live Practice (Focus Stage)
3. Debrief (Per Question)
4. Session Summary (see `13-interview-practice-session-summary.md`)

---

## 3. Topic / Track Selection

Input:
- Selected Resume + JD.
- AI suggests 3–5 “Practice Tracks”:
  - Conflict Resolution
  - Leadership
  - Stakeholder Management
  - System Design (for tech roles)

UI:
- Center grid of large glass cards:
  - Title
  - “3 Questions”
  - Difficulty tag

User selects a track → question playlist generated.

---

## 4. Live Practice – Phase 1 (Focus Stage)

Screen layout:

- Background: soft gradient, minimal info.
- Top center:
  - Question text appears while AI speaks.
  - After AI finishes, text fades to 30–50% opacity (ghost).
- Center:
  - Waveform visualizer (blue when AI, green when user).
- Bottom:
  - Countdown overlay (5…4…3…) before recording.
  - Big circular mic state indicator:
    - “Listening…” / “Recording…”
  - Secondary “End Answer” button.

No transcript or scores shown on this screen.

---

## 5. Debrief – Phase 2 (Per Question Feedback)

After user finishes answer:

- Screen shifts to **Debrief Mode**.

Layout:

Left:
- Transcript of answer.
- Highlight colors:
  - Green text: strong impact phrases.
  - Yellow text: weak / vague / filler.

Right:
- KPI bars:
  - STAR completeness (S/T/A/R ticks).
  - Clarity.
  - Relevance.
  - Impact (metrics used).
- Short AI Summary:
  - "Good story, but missing a measurable result."

Actions:
- “Retry this Question”
- “Next Question”