# 06 – Resume Analysis

## 1. Purpose

Analyze the current resume against:

- Generic ATS expectations.
- The selected Job Description.
- Skills & keyword match.
- Structural and clarity issues.

Also hosts:

- Resume Analysis Dashboard
- Resume Wizard (rewrite)
- Cover Letter Wizard (matching set)

---

## 2. Layout (Inside Resume Tab, “Analysis” Segment)

Studio-like layout:

Top:
[ Resume: Dropdown ] [ Job: Dropdown ]

Left Sidebar:

Dashboard

Resume Wizard

Cover Letter Wizard

Center:

Content area for selected tool

Right:

Context / insights (optional per view)

yaml
Copy code

---

## 3. Sidebar Items

### 3.1 Dashboard

Main analytics overview:

- KPIs:
  - ATS keyword match %
  - JD alignment %
  - Skill coverage breakdown
  - Section health (e.g., “Experience strong, Summary thin”)
- Visualization:
  - Three ring chart (ATS, JD Match, Skills Fit).
  - Insight cards:
    - "Add X, Y skills mentioned in JD."
    - "Your resume has long paragraphs – convert to bullets."

### 3.2 Resume Wizard

- Uses STAR & JD context to:
  - Rewrite summary.
  - Rewrite experience bullets.
- UI pattern:
  - Left: resume section preview.
  - Right: AI variations (cards).
  - Click "Apply" to overwrite.

### 3.3 Cover Letter Wizard

- Template-based cover letter composer:
  - Left: document canvas (matching resume style).
  - Right: AI controls:
    - Job context (JD snippet).
    - Tone slider (reserved ↔ confident).
    - Snippet suggestions.

- Auto-matches fonts, colors, and header layout with the chosen resume template.

---

## 4. Data Flow

Inputs:
- Parsed resume (sections, skills, metrics).
- Parsed JD (required skills, responsibilities).
- User’s prior SWOT/STAR (optional).

Outputs:
- Analysis object saved as `resume_analysis` record:
  - ats_score
  - jd_match_score
  - skill_gaps[]
  - recommendations[]