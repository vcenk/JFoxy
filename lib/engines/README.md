# AI Engines Documentation

The "brains" of Joblander - AI-powered engines that process user data and generate insights.

## Overview

All engines use the OpenAI client (`lib/clients/openaiClient.ts`) to generate structured JSON responses. They are pure functions with no side effects - they take input, call OpenAI, and return typed results.

## Engine List

### 1. **resumeParsingEngine.ts**
Parse uploaded resume files into structured format.

**Functions:**
- `parseResume(resumeText)` → `ParsedResume | null`
- `extractResumeText(parsedResume)` → `string`

**Use Cases:**
- Convert uploaded PDF/DOCX to structured JSON
- Extract plain text for AI analysis

**Example:**
```typescript
import { parseResume } from '@/lib/engines/resumeParsingEngine'

const parsed = await parseResume(rawResumeText)
```

---

### 2. **resumeAnalysisEngine.ts**
Analyze resumes against ATS expectations and job descriptions.

**Functions:**
- `analyzeResumeATS(resumeText)` → `ResumeAnalysisResult | null`
- `analyzeResumeAgainstJob({ resumeText, jobText })` → `ResumeAnalysisResult | null`
- `generateResumeRewrite({ resumeText, jobText, focusArea })` → `{ rewritten: string } | null`

**Use Cases:**
- ATS compatibility checking
- Resume-JD matching scores
- Generate improvement suggestions

**Example:**
```typescript
import { analyzeResumeAgainstJob } from '@/lib/engines/resumeAnalysisEngine'

const analysis = await analyzeResumeAgainstJob({
  resumeText,
  jobText
})

console.log(analysis.jd_match_score) // 0-100
console.log(analysis.missing_skills) // ["AWS", "Docker"]
```

---

### 3. **swotEngine.ts**
Generate SWOT analyses for interview preparation.

**Functions:**
- `generateSwotAnalysis({ resumeText, jobText })` → `SwotAnalysis | null`
- `refineSwotItem({ item, category, context })` → `SwotItem | null`

**Use Cases:**
- Generate comprehensive SWOT
- Refine specific SWOT items

**Example:**
```typescript
import { generateSwotAnalysis } from '@/lib/engines/swotEngine'

const swot = await generateSwotAnalysis({ resumeText, jobText })

// swot.strengths → Array of strength items
// swot.weaknesses → Array of weakness items
```

---

### 4. **starBuilderEngine.ts**
Build STAR method stories from resume experience.

**Functions:**
- `generateStarStory({ question, resumeSummary, experienceSnippet })` → `StarStory | null`
- `refineStarStory({ story, focusArea })` → `StarStory | null`
- `generateStarStorySet({ resumeSummary, categories })` → `Record<string, StarStory> | null`

**Use Cases:**
- Generate STAR stories for questions
- Build story library for common categories
- Refine existing stories

**Example:**
```typescript
import { generateStarStory } from '@/lib/engines/starBuilderEngine'

const story = await generateStarStory({
  question: "Tell me about a time you led a team through a challenge",
  resumeSummary,
  experienceSnippet: "Engineering Manager at TechCorp..."
})

console.log(story.situation)
console.log(story.result) // With metrics
```

---

### 5. **gapDefenseEngine.ts**
Create defense scripts for resume gaps/weaknesses.

**Functions:**
- `generateGapDefense({ gapType, gapDescription, resumeContext, jobContext })` → `GapDefense | null`
- `refineGapDefense({ defense, focusPart })` → `GapDefense | null`

**Use Cases:**
- Address missing skills
- Defend employment gaps
- Handle industry switches

**Example:**
```typescript
import { generateGapDefense } from '@/lib/engines/gapDefenseEngine'

const defense = await generateGapDefense({
  gapType: 'missing_skill',
  gapDescription: 'No cloud experience',
  resumeContext
})

// defense.pivot → The reframe
// defense.proof → Parallel evidence
// defense.promise → Growth roadmap
```

---

### 6. **introPitchEngine.ts**
Generate "Tell me about yourself" pitches.

**Functions:**
- `generateIntroPitch({ resumeSummary, jobDescription, targetDuration, style })` → `IntroPitch | null`
- `refineIntroPitch({ pitch, feedback, targetDuration })` → `IntroPitch | null`

**Use Cases:**
- Create intro pitches (60/90/120 seconds)
- Different styles (professional/conversational/enthusiastic)

**Example:**
```typescript
import { generateIntroPitch } from '@/lib/engines/introPitchEngine'

const pitch = await generateIntroPitch({
  resumeSummary,
  jobDescription,
  targetDuration: 90,
  style: 'professional'
})

console.log(pitch.full_pitch)
console.log(pitch.estimated_duration_seconds) // ~90
```

---

### 7. **answerScoringEngine.ts**
Score practice answers using STAR framework.

**Functions:**
- `scoreAnswer({ question, transcript, resumeSummary, jobSummary })` → `AnswerScore | null`
- `generateAnswerImprovement({ question, transcript, score })` → `{ improved_answer, changes_made } | null`

**Use Cases:**
- Score practice session answers
- Generate improvement suggestions
- Provide detailed feedback

**Example:**
```typescript
import { scoreAnswer } from '@/lib/engines/answerScoringEngine'

const score = await scoreAnswer({
  question: "Tell me about a conflict...",
  transcript: userAnswer
})

console.log(score.overall_score) // 0-100
console.log(score.star.has_result) // true/false
console.log(score.areas_for_improvement) // ["Add metrics", ...]
```

---

### 8. **mockInterviewEngine.ts**
Generate mock interview question plans and follow-ups.

**Functions:**
- `generateInterviewPlan({ resumeSummary, jobSummary, personaId, durationMinutes, focus, difficulty })` → `InterviewPlan | null`
- `generateFollowUp({ question, transcript, evaluation })` → `string | null`

**Use Cases:**
- Create structured interview plans
- Generate dynamic follow-up questions
- Adapt to answer quality

**Example:**
```typescript
import { generateInterviewPlan, generateFollowUp } from '@/lib/engines/mockInterviewEngine'

const plan = await generateInterviewPlan({
  resumeSummary,
  personaId: 'james-manager',
  durationMinutes: 15,
  focus: 'behavioral'
})

// plan.questions → Structured question list

// Later, after answer:
const followUp = await generateFollowUp({
  question: plan.questions[0].text,
  transcript: userAnswer,
  evaluation: { star_completeness: { has_result: false } }
})

// followUp → "What was the specific outcome?" or null
```

---

### 9. **practiceSummaryEngine.ts**
Generate summaries for practice sessions.

**Functions:**
- `generatePracticeSummary({ scores, questionCategories, strengths, improvements })` → `PracticeSummary | null`

**Use Cases:**
- Summarize practice session performance
- Identify trends
- Create improvement plans

**Example:**
```typescript
import { generatePracticeSummary } from '@/lib/engines/practiceSummaryEngine'

const summary = await generatePracticeSummary({
  scores: [75, 82, 68],
  questionCategories: ['leadership', 'conflict'],
  strengths: [["Good STAR"], ["Clear actions"]],
  improvements: [["Need metrics"], ["Too verbose"]]
})

console.log(summary.overall_performance) // "Good"
console.log(summary.improvement_plan) // Focused action plan
```

---

### 10. **mockReportEngine.ts**
Generate comprehensive mock interview reports.

**Functions:**
- `generateMockReport({ exchanges, resumeSummary, jobSummary, personaId, durationMinutes })` → `MockInterviewReport | null`

**Use Cases:**
- Create post-interview reports
- Assign verdicts (strong_hire / hire / borderline / not_ready)
- Generate 7-day improvement plans

**Example:**
```typescript
import { generateMockReport } from '@/lib/engines/mockReportEngine'

const report = await generateMockReport({
  exchanges: [
    { question, answer, score: 75, star_completeness: {...} }
  ],
  resumeSummary,
  personaId: 'james-manager',
  durationMinutes: 15
})

console.log(report.verdict) // 'hire'
console.log(report.improvement_plan.day_1) // ["Do X", "Practice Y"]
```

---

### 11. **coverLetterEngine.ts**
Generate tailored cover letters.

**Functions:**
- `generateCoverLetter({ resumeText, jobDescription, companyName, positionTitle, tone })` → `CoverLetter | null`
- `refineCoverLetter({ currentLetter, feedback, targetLength })` → `CoverLetter | null`

**Use Cases:**
- Generate personalized cover letters
- Match resume to job description
- Refine existing drafts

**Example:**
```typescript
import { generateCoverLetter } from '@/lib/engines/coverLetterEngine'

const letter = await generateCoverLetter({
  resumeText,
  jobDescription,
  companyName: 'TechCorp',
  positionTitle: 'Senior PM',
  tone: 'professional'
})

console.log(letter.content) // Plain text
console.log(letter.html_content) // HTML formatted
```

---

## Common Patterns

### Error Handling
All engines return `null` on error and log to console:

```typescript
const result = await someEngine(...)
if (!result) {
  // Handle error: show user-friendly message
  return { error: 'AI processing failed. Please try again.' }
}
// Use result
```

### Temperature Settings
- **Parsing/Analysis**: 0.1-0.3 (factual, consistent)
- **Generation/Creative**: 0.4-0.5 (varied, natural)

### Token Limits
- **Parsing**: 2000 tokens
- **Analysis**: 1500 tokens
- **Generation**: 800-2000 tokens (varies by complexity)

## Usage in API Routes

API routes should be thin wrappers around engines:

```typescript
// app/api/resume/analyze/route.ts
import { analyzeResumeAgainstJob } from '@/lib/engines/resumeAnalysisEngine'

export async function POST(req: Request) {
  const { resumeText, jobText } = await req.json()

  // Call engine
  const analysis = await analyzeResumeAgainstJob({ resumeText, jobText })

  if (!analysis) {
    return Response.json({ error: 'Analysis failed' }, { status: 500 })
  }

  return Response.json(analysis)
}
```

## Testing

Test engines with real data:

```typescript
// test/engines/resumeAnalysis.test.ts
import { analyzeResumeATS } from '@/lib/engines/resumeAnalysisEngine'

test('analyzes resume for ATS', async () => {
  const result = await analyzeResumeATS(sampleResume)
  expect(result).not.toBeNull()
  expect(result.ats_score).toBeGreaterThan(0)
})
```

## Cost Optimization

- Cache analysis results in database
- Use cheaper model (gpt-4-turbo-preview) for most operations
- Reserve expensive model (gpt-4) only for critical tasks
- Implement rate limiting per user tier
