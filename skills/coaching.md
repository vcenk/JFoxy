# Career Coaching Skills Agent

Use this agent for all career coaching tools and features.

## Scope
- SWOT Analysis generation
- STAR story builder
- Gap defense strategies
- Intro pitch generator
- Coaching dashboard

## Key Files

### Coaching Pages
- `app/dashboard/coaching/page.tsx` - Coaching dashboard with all tools

### AI Engines
- `lib/engines/swotEngine.ts` - SWOT analysis AI generation
- `lib/engines/starBuilderEngine.ts` - STAR story creation
- `lib/engines/gapDefenseEngine.ts` - Gap analysis and defense strategies
- `lib/engines/introPitchEngine.ts` - Elevator pitch generation

## API Endpoints

### SWOT Analysis
- `POST /api/coaching/swot` - Generate SWOT analysis from resume + job

### STAR Stories
- `POST /api/coaching/star` - Generate STAR stories
- `POST /api/coaching/star/predict` - Predict relevant stories for interview questions

### Gap Defense
- `POST /api/coaching/gap-defense` - Generate gap defense strategies
- `POST /api/coaching/gap-defense/analyze` - Analyze interview gaps from resume

### Intro Pitch
- `POST /api/coaching/intro-pitch` - Generate elevator pitch

## Database Schema

### Tables
- `star_stories` (`database/schemas/06_coaching_star_stories.sql`)
  - User's STAR method stories
  - Linked to resume experiences

- `swot_analyses` (`database/schemas/07_coaching_swot_and_gaps.sql`)
  - SWOT analysis results
  - Strengths, Weaknesses, Opportunities, Threats

- `gap_defenses` (`database/schemas/07_coaching_swot_and_gaps.sql`)
  - Gap defense strategies
  - Talking points for difficult questions

## Coaching Tools

### 1. SWOT Analysis
- **Strengths** assessment from resume
- **Weaknesses** identification
- **Opportunities** analysis based on job market
- **Threats** evaluation (competition, skill gaps)
- Structured framework for career self-assessment

### 2. STAR Builder
- Build STAR method stories:
  - **S**ituation - Context and background
  - **T**ask - Your responsibility
  - **A**ction - What you did
  - **R**esult - Outcomes and impact
- Create narratives for behavioral questions
- Store multiple stories per category
- Reuse across mock interviews and practice

### 3. Gap Defense Strategy
- Identify potential interview gaps/weaknesses
- Develop strategies using 3P framework:
  - **Pivot** - Reframe the weakness
  - **Proof** - Show parallel evidence
  - **Promise** - Growth roadmap
- Address missing skills, employment gaps, career changes

### 4. Intro Pitch Generator
- Create "Tell me about yourself" pitches
- Duration options: 60, 90, 120 seconds
- Style options: professional, conversational, enthusiastic
- Customizable by job/industry

## Common Tasks
- Update SWOT analysis prompts
- Improve STAR story generation
- Add new gap defense scenarios
- Enhance intro pitch templates
- Improve AI response quality
- Add coaching progress tracking
- Integrate coaching with practice/mock

## Related Systems
- OpenAI GPT-4 for content generation
- Resume data for personalization
- Job descriptions for context
- Practice/mock interview systems (reuse STAR stories)

## Design Patterns
- AI prompt engineering with structured output
- Template-based generation
- Context-aware responses (resume + job)
- State management for coaching data
