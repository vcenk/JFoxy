# LinkedIn Profile Optimizer Skills Agent

Use this agent for all LinkedIn profile optimization features including profile generation, headline optimization, about section writing, and skills recommendations.

## Scope
- LinkedIn profile generation from resume
- Headline optimization with alternatives
- About section writing with hooks and CTAs
- Skills recommendations (featured and standard)
- Featured section suggestions
- Experience bullet point rewrites
- Profile optimization tips
- Multiple tone options (professional, creative, executive)
- Target role customization

## Subscription Requirements
- **Free tier**: No access (shows upgrade prompt)
- **Basic tier and above**: Full access to LinkedIn Profile Optimizer

## Key Files

### LinkedIn Optimizer Page
- `app/dashboard/linkedin/[resumeId]/page.tsx` - Main LinkedIn optimizer page
  - Resume-to-LinkedIn profile transformation
  - Tone selection (professional, creative, executive)
  - Target role input
  - Copy-to-clipboard functionality
  - Expandable sections for alternatives and experience rewrites

### LinkedIn Engine
- `lib/engines/linkedinEngine.ts` - Core AI generation engine
  - `generateLinkedInProfile()` - Generate full profile optimization
  - `regenerateLinkedInSection()` - Regenerate specific sections with feedback
  - Tone-specific guidelines for content generation
  - Structured JSON output for all profile sections

### Type Definitions
- `lib/types/linkedin.ts` - TypeScript types
  - `LinkedInHeadline` - Primary headline + alternates
  - `LinkedInAbout` - About text, hook, key strengths, CTA
  - `LinkedInSkill` - Name, category, priority (featured/standard)
  - `LinkedInFeaturedItem` - Type, title, description, suggested media
  - `LinkedInExperienceRewrite` - Original vs optimized bullets with improvements
  - `LinkedInProfileData` - Complete profile data structure
  - `LinkedInGenerateRequest/Response` - API request/response types

### UI Components (within page)
- `HeadlineSection` - Headline display with copy and alternates
- `AboutSection` - About section with hook highlight and key strengths
- `SkillsSection` - Skills grid by category with featured skills
- `FeaturedSection` - Featured items suggestions
- `ExperienceSection` - Expandable experience rewrites
- `TipsSection` - Profile optimization tips list

## API Endpoints

### LinkedIn Profile Generation
- `POST /api/linkedin/generate` - Generate LinkedIn profile from resume
  - Required: `resumeId`
  - Optional: `targetRole`, `tone`, `forceRegenerate`
  - Optional (for section regeneration): `regenerateSection`, `currentContent`, `feedback`
- `GET /api/linkedin/generate?resumeId=xxx` - Get existing LinkedIn profile data

## Database Schema

### Tables
- `linkedin_profiles` - Stores generated LinkedIn profiles
  - `id` - Profile ID
  - `user_id` - Owner user ID
  - `resume_id` - Source resume ID
  - `target_role` - Target role/industry
  - `tone` - Selected tone
  - `profile_data` - JSONB containing full profile data
  - `created_at` - Timestamp

## Important Conventions

### Profile Tones
Three tone options available:
- `professional` - Corporate & polished, focuses on achievements and impact
- `creative` - Personality-driven, engaging while maintaining professionalism
- `executive` - Leadership-focused, strategic language demonstrating vision

### Profile Sections Generated
1. **Headline** - Max 220 characters, format: Title | Value Proposition | Key Skills
2. **About** - Max 2000 characters, includes hook, key strengths, and CTA
3. **Skills** - 15-20 skills categorized (technical, business, soft, industry, tools)
4. **Featured** - 3-4 items (accomplishments, projects, publications, certifications)
5. **Experience Rewrites** - Optimized bullets with action verbs and metrics
6. **Optimization Tips** - 5-7 actionable profile improvement tips

### Skill Categories
- `technical` - Technical/hard skills
- `business` - Business and management skills
- `soft` - Soft skills and interpersonal abilities
- `industry` - Industry-specific knowledge
- `tools` - Software and tools proficiency

### Skill Priorities
- `featured` - Top 3 skills to pin at the top of LinkedIn profile
- `standard` - Regular skills to add to profile

## Common Tasks
- Generate LinkedIn profile from existing resume
- Regenerate specific sections with user feedback
- Customize profile for different target roles
- Switch between professional/creative/executive tones
- Copy optimized content to clipboard
- Add new tone options
- Update headline character limits
- Improve AI prompt engineering
- Add new featured item types

## Related Systems
- Resume system (source data for LinkedIn profile)
- OpenAI GPT-4 for AI generation
- Supabase for profile storage
- AlertModal for error handling

## Design Patterns
- AI-powered content generation with structured JSON output
- Caching of generated profiles to avoid regeneration
- Copy-to-clipboard with visual feedback
- Expandable/collapsible sections for long content
- Tone-specific prompt engineering
