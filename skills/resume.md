# Resume System Skills Agent

Use this agent for all resume-related features including builder, analysis, templates, optimization, and examples.

## Scope
- Resume builder with live WYSIWYG editor
- Resume library and management (grid/list view)
- Resume analysis and optimization (ATS, JD matching, power words)
- AI-powered optimization engine
- Professional resume templates (Classic, Modern, Minimal)
- React-PDF generation with custom fonts
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
  - `PDFPreview.tsx` - React-PDF preview component with zoom controls
- `contexts/ResumeContext.tsx` - Resume state management (section order, designer settings, templates)

### PDF Generation System (React-PDF)
- `lib/pdf/types.ts` - TypeScript types for PDF rendering
  - `ResumeDesign` - Design settings interface
  - `FontFamily` - Available fonts (helvetica, times, courier, inter, roboto, open-sans, lato, merriweather, source-sans)
  - `CustomMargins`, `CustomSpacing`, `CustomFontSizes` - Numeric overrides
  - `PageNumberPosition` - Page number placement options
- `lib/pdf/styles/index.ts` - Style computation and utilities
  - `computeStyles()` - Converts design settings to computed styles
  - `createPageStyles()`, `createTypographyStyles()`, etc.
- `lib/pdf/styles/presets.ts` - Design presets
  - `MARGIN_PRESETS` - Compact, Normal, Spacious margins
  - `FONT_SIZE_PRESETS` - Small, Normal, Large font sizes
  - `SPACING_PRESETS` - Compact, Normal, Relaxed spacing
  - `COLOR_PRESETS` - Professional, Modern, Bold, Minimal, Creative, Warm
  - `FONT_FAMILY_MAP` - Maps font IDs to React-PDF font names
- `lib/pdf/fonts/register.ts` - Custom font registration
  - Registers TTF fonts from `/public/fonts/`
  - Supports: Inter, Roboto, Open Sans, Lato, Merriweather, Source Sans Pro

### PDF Templates
- `lib/pdf/templates/index.ts` - Template registry and factory
- `lib/pdf/templates/ClassicTemplate.tsx` - Traditional single-column layout
- `lib/pdf/templates/ModernTemplate.tsx` - Two-column with sidebar
- `lib/pdf/templates/MinimalTemplate.tsx` - Clean typography-focused design

### PDF Sections (React-PDF Components)
- `lib/pdf/sections/*` - Reusable PDF section components
  - `HeaderSection.tsx` - Name, title, contact info
  - `SummarySection.tsx` - Professional summary
  - `ExperienceSection.tsx` - Work experience with bullets
  - `EducationSection.tsx` - Education entries
  - `SkillsSection.tsx` - Skills grid/list
  - `ProjectsSection.tsx` - Projects
  - `CertificationsSection.tsx` - Certifications
  - `AwardsSection.tsx` - Awards & honors
  - `LanguagesSection.tsx` - Languages
  - `VolunteerSection.tsx` - Volunteer experience
  - `PublicationsSection.tsx` - Publications
  - `PageNumber.tsx` - Fixed page number component

### PDF Utilities
- `lib/pdf/utils/richTextToPlain.ts` - Convert TipTap JSON to plain text
- `lib/pdf/utils/dateFormatter.ts` - Format dates for PDF
- `lib/pdf/utils/designerAdapter.ts` - Convert legacy settings to new format

### PDF Design Panel
- `components/resume/design/PDFDesignPanel.tsx` - Word-style design controls
  - Typography: Font family, sizes (name/section/body), heading style, alignment, date format
  - Page Layout: Paper size, margins (numeric), spacing (numeric), line height (numeric), page numbers
  - Colors: Theme presets, custom accent color
  - Sections: Enable/disable, custom titles, skill columns

### Custom Fonts (TTF Files)
- `/public/fonts/Inter/` - Inter Regular, Medium, SemiBold, Bold
- `/public/fonts/Roboto/` - Roboto Regular, Medium, Bold
- `/public/fonts/OpenSans/` - Open Sans Regular, SemiBold, Bold
- `/public/fonts/Lato/` - Lato Regular, Bold
- `/public/fonts/Merriweather/` - Merriweather Regular, Bold
- `/public/fonts/SourceSansPro/` - Source Sans Pro Regular, SemiBold, Bold

### Resume Sections (Canvas Renderers)
- `components/resume/sections/*` - Section rendering components for canvas
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
- `lib/data/colorPresets.ts` - Color theme definitions

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
- `lib/types/designer.ts` - Designer settings types
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

### Resume AI Content Generation
- `POST /api/resume/generate-bullets` - Generate bullet points
- `POST /api/resume/generate-summary` - Generate professional summary
- `POST /api/resume/optimize-bullet` - Optimize individual bullet
- `POST /api/resume/suggest-skills` - Suggest skills for role

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

### PDF Design Settings (ResumeDesign)
Available in `lib/pdf/types.ts`:
- **Fonts**: helvetica, times, courier (built-in) + inter, roboto, open-sans, lato, merriweather, source-sans (custom)
- **Paper sizes**: letter, a4
- **Margins**: Preset (compact/normal/spacious) or custom numeric (24-72pt)
- **Spacing**: Preset (compact/normal/relaxed) or custom numeric (section: 8-28pt, item: 4-16pt)
- **Line height**: 1.0 to 2.0 (default 1.15)
- **Font sizes**: Preset (small/normal/large) or custom numeric
- **Date formats**: MM/YYYY, Month Year, Mon YYYY, YYYY
- **Page numbers**: Optional, position (bottom-center, bottom-right)
- **Section customization**: visibility, custom titles, skill columns

### PDF Re-rendering
The PDFViewer uses a `key` prop that changes when design settings change. If adding new design fields, update the `pdfKey` in `components/resume/studio/PDFPreview.tsx`.

## Common Tasks
- Add new resume templates (create in `lib/pdf/templates/`)
- Add new fonts (download TTF to `/public/fonts/`, register in `lib/pdf/fonts/register.ts`)
- Update resume analysis algorithms
- Improve power words detection
- Add new ATS keywords for industries
- Create new resume sections
- Update resume builder UI
- Generate new resume examples
- Improve PDF export quality
- Update LinkedIn parser
- Enhance AI optimization engine

## Related Systems
- React-PDF (@react-pdf/renderer) for PDF generation
- OpenAI GPT-4 for AI analysis and optimization
- DOCX generation (docx library)
- Document parsing (unpdf, mammoth)
- TipTap for rich text editing
- Supabase for storage and RLS

## Design Patterns
- Context API for resume state management (ResumeContext)
- Component composition for sections
- Factory pattern for template rendering (`getTemplateComponent()`)
- Strategy pattern for different parsers
- Real-time sync with database via useAutoSave hook
- Preset + custom override pattern for design settings
