# Resume System Skills Agent

Use this agent for all resume-related features including builder, analysis, templates, optimization, and examples.

## Scope
- Resume builder with live WYSIWYG editor
- Resume library and management (grid/list view)
- Resume analysis and optimization (ATS, JD matching, power words)
- AI-powered optimization engine
- Professional resume templates
- Resume examples generation (by job title and industry)
- Resume parsing (PDF, Word, LinkedIn)
- Cover letter generation from resume
- Resume export to PDF and DOCX
- Base/Tailored resume architecture

## Key Files

### Resume Builder & Library
- `app/dashboard/resume/page.tsx` - Resume library with grid/list view toggle
- `app/dashboard/resume/[id]/page.tsx` - Resume editor with live preview
- `components/resume/studio/*` - Core builder components
  - `ResumeCanvas.tsx` - Main canvas with live editing
  - `ResumePaper.tsx` - Paper layout component
  - `Inspector.tsx` - Section inspector/editor
  - `SectionNavigator.tsx` - Navigation between sections
  - `ZoomControls.tsx` - Canvas zoom controls
  - `AnalysisPanel.tsx` - Integrated analysis panel
  - `TemplatePreviewModal.tsx` - Template preview/switcher
- `contexts/ResumeContext.tsx` - Resume state management (section order, designer settings, templates)

### Resume Forms (Section Editors)
- `components/resume/forms/*` - All section editing forms
  - `ContactForm.tsx` - Contact information
  - `SummaryForm.tsx` - Professional summary
  - `WorkForm.tsx` - Work experience
  - `EducationForm.tsx` - Education
  - `SkillsForm.tsx` - Skills (technical, soft, other)
  - `ProjectForm.tsx` - Projects
  - `CertificationForm.tsx` - Certifications
  - `AwardForm.tsx` - Awards & honors
  - `VolunteerForm.tsx` - Volunteer experience
  - `PublicationForm.tsx` - Publications
  - `LanguageForm.tsx` - Languages
  - `TargetTitleForm.tsx` - Target job title

### Resume Sections (Renderers)
- `components/resume/sections/*` - Section rendering components
  - `ContactSection.tsx`, `SummarySection.tsx`, `ExperienceSection.tsx`
  - `EducationSection.tsx`, `SkillsSection.tsx`, `ProjectsSection.tsx`
  - `CertificationsSection.tsx`, `AwardsSection.tsx`, `VolunteerSection.tsx`
  - `PublicationsSection.tsx`, `LanguagesSection.tsx`, `TargetTitleSection.tsx`
- `components/resume/renderers/*` - Shared rendering utilities
  - `BaseSection.tsx` - Base section renderer
  - `ListStyles.tsx` - Bullet list styling
  - `DateFormatter.tsx` - Date formatting
  - `SectionDivider.tsx` - Section dividers

### Resume Analysis
- `components/resume/analysis/*` - Analysis dashboard components
  - `AnalysisDashboard.tsx` - Main analysis dashboard
  - `JobAnalysisView.tsx` - Job-specific analysis view
  - `CoverLetterView.tsx` - Cover letter generator
  - `ATSHealthCheck.tsx` - ATS compatibility check
  - `ATSKeywordOptimization.tsx` - Keyword optimization
  - `PowerWordsSuggestions.tsx` - Power word suggestions
  - `QuantificationScore.tsx` - Quantification analysis
  - `KeywordCoverage.tsx` - Keyword coverage chart
  - `HeroScoresSection.tsx` - Score overview cards
  - `QuickWinsSection.tsx` - Quick improvement suggestions
  - `SectionFeedback.tsx` - Section-by-section feedback
  - `BulletImprovements.tsx` - Bullet point improvements
  - `StrengthsWeaknesses.tsx` - SWOT-style analysis
  - `JDRequirementMatch.tsx` - Job requirement matching
  - `OptimizeConfirmModal.tsx` - AI optimization confirmation
  - `FitnessRings.tsx` - Visual score rings
  - `InsightCard.tsx` - Analysis insight cards
  - `AIWizard.tsx` - AI analysis wizard
  - `RadarChart.tsx` - Skills radar visualization
- `lib/engines/resumeAnalysisEngine.ts` - Core AI analysis engine
- `lib/engines/resumeOptimizationEngine.ts` - AI optimization engine

### Resume Data & Intelligence
- `lib/data/powerWords.ts` - 900+ power word synonyms
- `lib/data/atsKeywords.ts` - ATS keywords for 10+ industries
- `lib/data/jobTitleTaxonomy.ts` - 200+ job titles with metadata

### Resume Templates
- `lib/resumeThemes.ts` - Template definitions
- `components/resume/templates/*` - Template implementations
  - `TemplateRenderer.tsx` - Main template renderer
  - `MinimalTemplate.tsx` - Minimal template
  - `shared/TemplateLayout.tsx` - Shared layout utilities
- `components/resume/studio/templates/ModernTemplate.tsx` - Modern template

### Resume Examples
- `app/resume/examples/page.tsx` - Public examples gallery
- `app/resume/templates/page.tsx` - Public templates page
- `app/dashboard/admin/examples/page.tsx` - Admin examples management
- `lib/engines/resumeExampleGenerator.ts` - AI example generator

### Resume Parsing & Utilities
- `lib/engines/resumeParsingEngine.ts` - PDF/Word/text parsing
- `lib/linkedinParser.ts` - LinkedIn profile import
- `lib/utils/resumeMapper.ts` - Data transformation utilities
- `lib/utils/resumeToText.ts` - Plain text conversion
- `lib/utils/docxExport.ts` - DOCX export functionality
- `lib/utils/richTextHelpers.ts` - TipTap rich text utilities
- `lib/types/resume.ts` - TypeScript type definitions (ParsedResume with RichText)
- `lib/types/analysis.ts` - Analysis type definitions
- `components/resume/LinkedInImportModal.tsx` - LinkedIn import UI
- `components/resume/ResumeUploadModal.tsx` - Resume upload UI
- `lib/sectionRegistry.ts` - Section configuration registry

### UI Components
- `components/ui/ExportDropdown.tsx` - PDF/DOCX export dropdown
- `components/ui/RichTextEditor.tsx` - TipTap rich text editor
- `components/ui/RichTextDisplay.tsx` - Rich text display component

## API Endpoints

### Resume Management
- `POST /api/resume/create` - Create new resume
- `GET /api/resume/[id]` - Get resume by ID
- `PUT /api/resume/[id]` - Update resume
- `DELETE /api/resume/[id]` - Delete resume
- `GET /api/resume/list` - List all user resumes
- `POST /api/resume/duplicate` - Clone existing resume

### Resume Analysis & Optimization
- `POST /api/resume/analyze` - Analyze resume (ATS, JD matching, power words)
- `POST /api/resume/optimize` - Optimize resume with power words
- `POST /api/resume/optimize-ai` - AI-powered optimization
- `POST /api/resume/rewrite` - Rewrite sections with AI

### Resume Parsing & Import
- `POST /api/resume/parse` - Parse PDF/Word documents
- `POST /api/resume/linkedin-import` - Import from LinkedIn

### Resume Examples (Public & Admin)
- `GET /api/resume/examples` - Get public resume examples
- `POST /api/admin/generate-examples` - Generate single example (admin)
- `POST /api/admin/generate-examples/batch` - Batch generate (admin)
- `GET /api/admin/examples` - List all examples (admin)
- `GET /api/admin/examples/[id]` - Get/update/delete example (admin)

## Database Schema

### Main Tables
- `resumes` - Resume storage (`database/schemas/02_resumes.sql`)
  - Structured JSONB content
  - Raw text for AI analysis
  - ATS scores and analysis results
  - Base/Tailored architecture support
  - Job description linking
- `resume_examples` - Public resume examples library (`database/schemas/11_resume_library.sql`)

### Key Fields
- `resumes.content` - JSONB structured resume data
- `resumes.raw_text` - Plain text for AI analysis
- `resumes.ats_score` - ATS compatibility (0-100)
- `resumes.jd_match_score` - Job match score (0-100)
- `resumes.analysis_results` - Full analysis JSONB
- `resumes.is_base_version` - Base vs tailored flag
- `resumes.source_resume_id` - Parent resume reference
- `resumes.job_description_id` - Linked job description

## Important Conventions

### Rich Text Format
Resume text fields (summary, bullets) use TipTap JSONContent format, NOT plain strings:
- `lib/types/resume.ts` defines `RichText = JSONContent`
- Use `lib/utils/richTextHelpers.ts` for conversion:
  - `plainTextToJSON()` - Convert string to JSONContent
  - `jsonToPlainText()` - Convert JSONContent to string

### Designer Settings (ResumeContext)
Available in `contexts/ResumeContext.tsx`:
- Font: inter, sf-pro, roboto, lato, open-sans, montserrat, raleway, poppins, playfair, merriweather, georgia, times
- Paper: letter, a4
- Date formats: MM/YYYY, Month Year, Mon YYYY, YYYY-MM, YYYY
- Section customization: visibility, custom titles, layout, list styles
- Typography: font sizes (name, headings, body), weights, styles, letter spacing

## Common Tasks
- Add new resume templates
- Update resume analysis algorithms
- Improve power words detection
- Add new ATS keywords for industries
- Create new resume sections
- Update resume builder UI
- Generate new resume examples
- Improve PDF/DOCX export quality
- Update LinkedIn parser
- Enhance AI optimization engine

## Related Systems
- OpenAI GPT-4 for AI analysis and optimization
- PDF generation (jsPDF)
- DOCX generation (docx library)
- Document parsing (unpdf, mammoth)
- TipTap for rich text editing
- Supabase for storage and RLS

## Design Patterns
- Context API for resume state management (ResumeContext)
- Component composition for sections
- Factory pattern for template rendering
- Strategy pattern for different parsers
- Real-time sync with database via useAutoSave hook
