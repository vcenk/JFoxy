# Cover Letter Skills Agent

Use this agent for cover letter generation features.

## Scope
- AI-powered cover letter generation
- Job description matching
- Multiple tone options
- Resume integration
- Customization and refinement
- Cover letter management

## Key Files

### Cover Letter Pages
- `app/dashboard/cover-letter/page.tsx` - Cover letter interface

### AI Engine
- `lib/engines/coverLetterEngine.ts` - AI generation and refinement engine

### Related Components
- `components/resume/analysis/CoverLetterView.tsx` - Cover letter view in resume analysis

## API Endpoints

### Cover Letter Management
- `POST /api/cover-letter/generate` - Generate new cover letter
- `POST /api/cover-letter/refine` - Refine/rewrite existing cover letter
- `GET /api/cover-letter/list` - List user's cover letters

## Database Schema

### Tables
- `cover_letters` (`database/schemas/08_cover_letters.sql`)
  - Cover letter content
  - Associated resume and job description
  - Tone and style settings

## Features

### Generation Options
- **Job Description Input** - Paste or upload job posting
- **Resume Integration** - Auto-pulls relevant experience from resume
- **Tone Selection**:
  - Professional
  - Enthusiastic
  - Conversational
- **Length Options**:
  - Brief
  - Standard
  - Detailed

### Cover Letter Structure
- **Opening Paragraph** - Compelling hook and position reference
- **Body Paragraphs** - Relevant skills and experience highlights
- **Closing Paragraph** - Call to action and next steps
- **Professional Formatting** - Industry-standard layout

### Customization
- Inline editing
- Section rewriting
- Tone adjustment
- Length modification
- Keyword optimization for ATS

### Integration with Resume Analysis
- Generate cover letter directly from resume analysis view
- Uses job description context from resume analysis
- Pulls key achievements and skills automatically

## Common Tasks
- Update generation prompts
- Add new tone options
- Improve job description parsing
- Enhance resume integration
- Add keyword optimization
- Improve formatting options
- Add version history

## Related Systems
- Resume system for candidate data
- OpenAI GPT-4 for generation
- Job description parsing
- Resume analysis context

## Design Patterns
- Template pattern for different styles
- Builder pattern for cover letter construction
- Strategy pattern for tone variations
- AI prompt engineering with structured output
