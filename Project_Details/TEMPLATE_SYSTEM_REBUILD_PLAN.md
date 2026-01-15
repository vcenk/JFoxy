# Resume Template System Rebuild Plan
**JobFoxy Resume Builder - Native React Template System**

---

## Executive Summary

This document outlines the complete rebuild of JobFoxy's resume template system. The current implementation relies on 9 broken JSON Resume themes that cause build failures and are incompatible with Next.js. We will replace these with 5-7 custom native React templates that are fully integrated with our existing component registry, designer settings, and data model.

**Key Goals:**
- Remove all broken JSON Resume dependencies (9 packages)
- Build 5-7 production-ready native React templates
- Full integration with existing designer settings (45+ options)
- Maintain rich text formatting (Tiptap JSONContent)
- Enable drag & drop section reordering within templates
- Professional, ATS-friendly designs inspired by TealHQ and modern resume builders

---

## Current State Analysis

### What's Broken ❌

**1. JSON Resume Theme Build Failure**
```
Module not found: Package path . is not exported from package @rbardini/html
Import trace: app/api/resume/render-theme/route.ts
```
- Root cause: `jsonresume-theme-even@0.26.1` → `@rbardini/html` package export restrictions
- Next.js webpack cannot resolve dynamic `require()` at build time
- Affects ALL 9 JSON Resume themes

**2. Broken Templates (9 total):**
- `jsonresume-theme-even` ❌
- `jsonresume-theme-flat` ❌
- `jsonresume-theme-elegant` ❌
- `jsonresume-theme-modern` ❌
- `jsonresume-theme-stackoverflow` ❌
- `jsonresume-theme-class` ❌
- `jsonresume-theme-eloquent` ❌
- `jsonresume-theme-kendall` ❌
- `jsonresume-theme-spartacus` ❌

**3. Data Mapping Bugs in `lib/utils/resumeMapper.ts`:**
```typescript
// Line 90-91: skills.languages doesn't exist in ParsedResume type
if (skills.languages && skills.languages.length > 0) {
  mappedSkills.push({ name: 'Languages', keywords: skills.languages })
}

// Line 100: certifications are objects, not strings
if (skills.certifications && skills.certifications.length > 0) {
  mappedSkills.push({ name: 'Certifications', keywords: skills.certifications })
}
```

**4. Rich Text Data Loss:**
- Tiptap JSONContent → Plain text conversion
- All formatting (bold, italic, links, bullets) is stripped
- Irreversible loss of user's styling work

### What Works ✅

**1. JobFoxy Classic (Default Builder):**
- Dynamic section rendering via `SECTION_REGISTRY`
- Fully integrated with designer settings
- Drag & drop section reordering (newly added)
- Zoom controls (50%-200%)
- Rich text formatting preserved

**2. ModernTemplate.tsx:**
- Native React component
- Sidebar + main column layout (35/65 split)
- Uses `SECTION_REGISTRY` for dynamic rendering
- **Limitations:** Only uses `accentColor` from designer settings (ignores 44 other settings)

**3. Core Infrastructure:**
- `contexts/ResumeContext.tsx` - Central state management
- `lib/sectionRegistry.ts` - Dynamic component lookup
- `components/resume/sections/` - 11 section components
- `components/resume/renderers/` - Base rendering components
- Framer Motion Reorder - Drag & drop functionality

---

## Proposed Architecture

### Template Component Interface

```typescript
// lib/types/template.ts

import { ParsedResume } from './resume'
import { DesignerSettings } from './designer'
import { SectionSettings, ResumeSectionKey } from './section'

export interface TemplateProps {
  resumeData: ParsedResume
  designerSettings: DesignerSettings
  sectionSettings: Record<ResumeSectionKey, SectionSettings>
  sectionOrder: ResumeSectionKey[]
  activeSection?: ResumeSectionKey
  onSectionClick?: (section: ResumeSectionKey) => void
}

export interface TemplateMetadata {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'minimal' | 'creative'
  features: string[]
  previewImage: string
  color: string
  layoutType: 'single-column' | 'two-column' | 'sidebar' | 'grid'
  recommendedFor: string[] // e.g., ['Tech', 'Creative', 'Executive']
}

export interface TemplateComponent extends React.FC<TemplateProps> {
  metadata: TemplateMetadata
}
```

### Template Registry Pattern

```typescript
// lib/templateRegistry.ts

import { TemplateComponent } from '@/lib/types/template'
import { ModernSidebar } from '@/components/resume/templates/ModernSidebar'
import { ClassicLinear } from '@/components/resume/templates/ClassicLinear'
import { MinimalClean } from '@/components/resume/templates/MinimalClean'
import { CreativeColored } from '@/components/resume/templates/CreativeColored'
import { TwoColumnHybrid } from '@/components/resume/templates/TwoColumnHybrid'
import { ExecutiveProfessional } from '@/components/resume/templates/ExecutiveProfessional'
import { TechModern } from '@/components/resume/templates/TechModern'

export const TEMPLATE_REGISTRY: Record<string, TemplateComponent> = {
  'modern-sidebar': ModernSidebar,
  'classic-linear': ClassicLinear,
  'minimal-clean': MinimalClean,
  'creative-colored': CreativeColored,
  'two-column-hybrid': TwoColumnHybrid,
  'executive-professional': ExecutiveProfessional,
  'tech-modern': TechModern,
}

export function getTemplate(templateId: string): TemplateComponent {
  const template = TEMPLATE_REGISTRY[templateId]
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }
  return template
}

export function getAllTemplates(): TemplateComponent[] {
  return Object.values(TEMPLATE_REGISTRY)
}
```

### Designer Settings Integration

Each template must respect ALL 45 designer settings:

```typescript
export interface DesignerSettings {
  // Colors (5)
  primaryColor: string
  accentColor: string
  textColor: string
  headingColor: string
  backgroundColor: string

  // Typography (8)
  fontFamily: string
  headingFontFamily: string
  fontSize: number
  headingSize: number
  lineHeight: number
  letterSpacing: number
  fontWeight: number
  headingWeight: number

  // Spacing (6)
  sectionSpacing: number
  itemSpacing: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number

  // Layout (4)
  columns: 1 | 2
  pageSize: 'letter' | 'a4'
  orientation: 'portrait' | 'landscape'
  alignment: 'left' | 'center' | 'right'

  // Borders & Dividers (5)
  showDividers: boolean
  dividerStyle: 'solid' | 'dashed' | 'dotted' | 'none'
  dividerColor: string
  dividerThickness: number
  borderRadius: number

  // Advanced (17)
  headerStyle: 'minimal' | 'bold' | 'underlined' | 'boxed'
  bulletStyle: 'disc' | 'circle' | 'square' | 'dash'
  dateFormat: 'MM/YYYY' | 'Month YYYY' | 'Full'
  showIcons: boolean
  iconStyle: 'outline' | 'solid'
  compactMode: boolean
  photoShape: 'circle' | 'square' | 'rounded'
  photoSize: number
  photoPosition: 'left' | 'right' | 'center'
  // ... and more
}
```

### Section Rendering Strategy

```typescript
// components/resume/templates/shared/TemplateSection.tsx

interface TemplateSectionProps {
  sectionId: ResumeSectionKey
  designerSettings: DesignerSettings
  sectionSettings: SectionSettings
  isActive?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}

export const TemplateSection: React.FC<TemplateSectionProps> = ({
  sectionId,
  designerSettings,
  sectionSettings,
  isActive,
  onClick,
  className,
  style,
}) => {
  const SectionComponent = SECTION_REGISTRY[sectionId]
  if (!SectionComponent) return null

  // Apply designer settings to section wrapper
  const sectionStyle: React.CSSProperties = {
    marginBottom: `${designerSettings.sectionSpacing}px`,
    fontFamily: designerSettings.fontFamily,
    fontSize: `${designerSettings.fontSize}px`,
    lineHeight: designerSettings.lineHeight,
    color: designerSettings.textColor,
    ...style,
  }

  return (
    <div
      className={className}
      style={sectionStyle}
      data-section-id={sectionId}
      onClick={onClick}
    >
      <SectionComponent isActive={isActive} onClick={() => {}} />
    </div>
  )
}
```

---

## Template Specifications

### Template 1: Modern Sidebar ⭐ (Enhanced Version of Current ModernTemplate)

**Layout:**
- Left sidebar (35% width) with accent color background
- Main content area (65% width)
- Fixed header section at top

**Sidebar Sections:**
- Contact (with photo)
- Skills (visual skill bars)
- Education
- Languages (proficiency levels)
- Certifications (icons + text)

**Main Sections:**
- Target Title (large, bold)
- Summary (rich text)
- Experience (timeline style)
- Projects (grid cards)
- Volunteer, Publications

**Design Features:**
- Customizable sidebar width (30-40%)
- Accent color gradient option
- Icon support for contact info
- Progress bars for skills
- Timeline dots for experience
- Rich text formatting preserved

**Designer Settings Integration:**
- Uses: accentColor, backgroundColor, fontFamily, fontSize, headingSize, sectionSpacing, showIcons, photoShape, photoSize

**Recommended For:** Tech, Marketing, Creative roles

---

### Template 2: Classic Linear

**Layout:**
- Single column, traditional format
- Full-width header with contact info
- Sections stacked vertically

**Section Order:**
- Contact (horizontal layout)
- Target Title
- Summary
- Experience
- Education
- Skills (comma-separated or grid)
- Certifications, Awards, Volunteer

**Design Features:**
- Clean, professional typography
- Subtle section dividers
- Consistent spacing
- Conservative color scheme
- Minimal icons (optional)

**Designer Settings Integration:**
- Uses: primaryColor, textColor, headingColor, fontFamily, fontSize, lineHeight, sectionSpacing, showDividers, dividerStyle, headerStyle

**Recommended For:** Finance, Legal, Government, Traditional Corporate

---

### Template 3: Minimal Clean

**Layout:**
- Single column with generous white space
- Typography-focused design
- No colors (except optional accent)

**Design Philosophy:**
- Emphasis on readability
- Large, clear headings
- Generous margins
- Subtle dividers
- No icons or graphics

**Section Styling:**
- Section titles: uppercase, bold, small caps option
- Content: clean, readable font
- Dates: right-aligned or inline
- Lists: simple bullets or dashes

**Designer Settings Integration:**
- Uses: fontFamily, headingFontFamily, fontSize, headingSize, lineHeight, letterSpacing, marginTop, marginBottom, sectionSpacing, alignment

**Recommended For:** Academia, Research, Writing, Design portfolios

---

### Template 4: Creative Colored

**Layout:**
- Two-column hybrid
- Bold header with photo
- Colorful section headers

**Design Features:**
- Vibrant accent colors
- Geometric shapes and patterns
- Color-coded sections
- Icon integration
- Photo prominent in header
- Visual skill representations

**Section Styling:**
- Section headers: colored backgrounds or borders
- Content: clean, modern font
- Skills: circular progress indicators
- Timeline: colored dots and lines
- Contact: icon + text combinations

**Designer Settings Integration:**
- Uses: primaryColor, accentColor, headingColor, backgroundColor, showIcons, iconStyle, photoShape, photoPosition, borderRadius, headerStyle

**Recommended For:** Design, Marketing, Creative, Startups

---

### Template 5: Two-Column Hybrid

**Layout:**
- Flexible two-column layout
- Sections can span 1 or 2 columns
- Responsive column widths

**Column Distribution:**
- **Left Column (40%):** Contact, Skills, Education, Languages
- **Right Column (60%):** Experience, Projects
- **Full Width:** Target Title, Summary

**Design Features:**
- Column width customizable (30/70, 40/60, 50/50)
- Sections can be moved between columns via drag & drop
- Grid-based layout system
- Modern, balanced design

**Designer Settings Integration:**
- Uses: columns, primaryColor, accentColor, fontFamily, fontSize, sectionSpacing, itemSpacing, alignment

**Recommended For:** Management, Consulting, Sales, Business Development

---

### Template 6: Executive Professional (Optional)

**Layout:**
- Single column with horizontal header
- Executive summary prominent
- Achievements-focused

**Design Features:**
- Sophisticated typography
- Subtle use of color
- Emphasis on metrics and achievements
- Professional photo in header
- Company logos (if available)

**Recommended For:** C-Suite, Senior Management, Executive roles

---

### Template 7: Tech Modern (Optional)

**Layout:**
- Grid-based layout
- Code-style monospace elements
- Tech stack visualization

**Design Features:**
- Monospace font for code/tech sections
- Tech stack icons/badges
- GitHub-style contributions chart
- Project cards with tech tags
- Dark mode option

**Recommended For:** Software Engineers, DevOps, Data Scientists

---

## Migration Strategy

### Phase 1: Cleanup (Remove Broken Code)

**Step 1.1: Remove JSON Resume Dependencies**

```bash
npm uninstall jsonresume-theme-even jsonresume-theme-flat jsonresume-theme-elegant jsonresume-theme-modern jsonresume-theme-stackoverflow jsonresume-theme-class jsonresume-theme-eloquent jsonresume-theme-kendall jsonresume-theme-spartacus
```

**Step 1.2: Delete Broken Files**

```bash
# Remove API route
rm app/api/resume/render-theme/route.ts

# Remove unused mapper (we'll rewrite it)
rm lib/utils/resumeMapper.ts
```

**Step 1.3: Update lib/resumeThemes.ts**

Remove all JSON Resume theme entries, keep only:
- `jobfoxy` (default builder)
- Placeholder entries for new native templates

```typescript
// lib/resumeThemes.ts

export const RESUME_THEMES: ResumeTheme[] = [
  {
    id: 'jobfoxy',
    name: 'JobFoxy Classic',
    value: null, // null = default builder
    description: 'Classic JobFoxy resume builder with full customization',
    category: 'classic',
    features: ['Fully Customizable', 'ATS-Friendly', 'Drag & Drop'],
    previewImage: '/templates/jobfoxy-classic.svg',
    color: '#8B5CF6',
  },
  // New native templates will be added here
]
```

**Step 1.4: Verify Build**

```bash
npm run build
```

Build should succeed after removing broken dependencies.

---

### Phase 2: Foundation (Shared Infrastructure)

**Step 2.1: Create Template Types**

File: `lib/types/template.ts`
- Define `TemplateProps` interface
- Define `TemplateMetadata` interface
- Define `TemplateComponent` type

**Step 2.2: Create Template Registry**

File: `lib/templateRegistry.ts`
- Create `TEMPLATE_REGISTRY` object
- Implement `getTemplate()` function
- Implement `getAllTemplates()` function

**Step 2.3: Create Shared Components**

File: `components/resume/templates/shared/TemplateSection.tsx`
- Wrapper component that applies designer settings
- Integrates with `SECTION_REGISTRY`
- Handles section visibility and content checking

File: `components/resume/templates/shared/TemplateWrapper.tsx`
- Page wrapper (ResumePaper equivalent)
- Applies page-level designer settings (margins, background, page size)

File: `components/resume/templates/shared/utils.ts`
- `getSectionComponent()` - Get component from registry
- `filterVisibleSections()` - Filter by visibility and content
- `applySectionStyles()` - Generate CSS from designer settings
- `formatDate()` - Consistent date formatting
- `renderRichText()` - Convert Tiptap JSON to JSX

**Step 2.4: Update ResumeCanvas**

File: `components/resume/studio/ResumeCanvas.tsx`

Add template selection logic:

```typescript
// Get selected template
const selectedTemplateId = designerSettings.template || 'jobfoxy'

if (selectedTemplateId !== 'jobfoxy') {
  // Render native template
  const TemplateComponent = getTemplate(selectedTemplateId)

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto p-8 flex items-start justify-center bg-gray-900/50 relative">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <TemplateComponent
            resumeData={resumeData}
            designerSettings={designerSettings}
            sectionSettings={sectionSettings}
            sectionOrder={sectionOrder}
            activeSection={activeSection}
            onSectionClick={setActiveSection}
          />
        </div>
      </div>
      <ZoomControls zoom={zoom} onZoomChange={setZoom} />
    </>
  )
}

// Fallback to JobFoxy Classic builder
// ... existing code ...
```

---

### Phase 3: Template Implementation (Iterative)

For each template, follow this workflow:

**Step 3.1: Create Template Component**

File: `components/resume/templates/{TemplateName}.tsx`

```typescript
import { TemplateProps, TemplateComponent, TemplateMetadata } from '@/lib/types/template'
import { TemplateSection } from './shared/TemplateSection'
import { TemplateWrapper } from './shared/TemplateWrapper'

export const ModernSidebar: TemplateComponent = ({
  resumeData,
  designerSettings,
  sectionSettings,
  sectionOrder,
  activeSection,
  onSectionClick,
}) => {
  // Filter visible sections
  const visibleSections = filterVisibleSections(sectionOrder, sectionSettings, resumeData)

  // Categorize sections
  const sidebarSections = visibleSections.filter(id =>
    ['contact', 'skills', 'education', 'languages', 'certifications'].includes(id)
  )
  const mainSections = visibleSections.filter(id =>
    !sidebarSections.includes(id)
  )

  return (
    <TemplateWrapper designerSettings={designerSettings}>
      <div className="flex min-h-full">
        {/* Sidebar */}
        <div
          className="w-[35%]"
          style={{ backgroundColor: designerSettings.accentColor }}
        >
          {sidebarSections.map(sectionId => (
            <TemplateSection
              key={sectionId}
              sectionId={sectionId}
              designerSettings={designerSettings}
              sectionSettings={sectionSettings[sectionId]}
              isActive={activeSection === sectionId}
              onClick={() => onSectionClick?.(sectionId)}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {mainSections.map(sectionId => (
            <TemplateSection
              key={sectionId}
              sectionId={sectionId}
              designerSettings={designerSettings}
              sectionSettings={sectionSettings[sectionId]}
              isActive={activeSection === sectionId}
              onClick={() => onSectionClick?.(sectionId)}
            />
          ))}
        </div>
      </div>
    </TemplateWrapper>
  )
}

// Attach metadata
ModernSidebar.metadata = {
  id: 'modern-sidebar',
  name: 'Modern Sidebar',
  description: 'Two-column layout with accent sidebar and main content area',
  category: 'modern',
  features: ['Sidebar Layout', 'Visual Skills', 'Icon Support'],
  previewImage: '/templates/modern-sidebar.svg',
  color: '#8B5CF6',
  layoutType: 'sidebar',
  recommendedFor: ['Tech', 'Marketing', 'Creative'],
}
```

**Step 3.2: Create Template Preview Image**

File: `public/templates/{template-id}.svg`

Create SVG mockup (400x566px, letter ratio) showing template layout.

**Step 3.3: Register Template**

Add to `lib/templateRegistry.ts`:

```typescript
import { ModernSidebar } from '@/components/resume/templates/ModernSidebar'

export const TEMPLATE_REGISTRY: Record<string, TemplateComponent> = {
  'modern-sidebar': ModernSidebar,
  // ... more templates
}
```

**Step 3.4: Add to Theme List**

Update `lib/resumeThemes.ts`:

```typescript
export const RESUME_THEMES: ResumeTheme[] = [
  // ... existing
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    value: 'modern-sidebar',
    description: 'Two-column layout with accent sidebar',
    category: 'modern',
    features: ['Sidebar Layout', 'Visual Skills', 'Icon Support'],
    previewImage: '/templates/modern-sidebar.svg',
    color: '#8B5CF6',
  },
]
```

**Step 3.5: Test Template**

1. Run dev server: `npm run dev`
2. Navigate to Resume Builder
3. Select new template from gallery
4. Verify all sections render correctly
5. Test drag & drop section reordering
6. Test zoom controls
7. Test designer settings (colors, fonts, spacing)
8. Test with empty resume data
9. Test with full resume data

---

### Phase 4: Enhanced Features

**Step 4.1: PDF Export Support**

Install `@react-pdf/renderer`:

```bash
npm install @react-pdf/renderer
```

Create PDF versions of each template:

File: `components/resume/templates/pdf/{TemplateName}PDF.tsx`

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  sidebar: { width: '35%', backgroundColor: '#8B5CF6' },
  // ... more styles
})

export const ModernSidebarPDF = ({ resumeData, designerSettings }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.sidebar}>
          {/* Sidebar sections */}
        </View>
        <View style={{ flex: 1 }}>
          {/* Main sections */}
        </View>
      </View>
    </Page>
  </Document>
)
```

**Step 4.2: Template Customization Panel**

File: `components/resume/studio/TemplateCustomizer.tsx`

Template-specific settings that appear when template is selected:

```typescript
// For ModernSidebar:
- Sidebar width slider (30-40%)
- Sidebar position (left/right)
- Gradient toggle
- Icon style (outline/solid)
```

**Step 4.3: Template Preview in Gallery**

Enhance `components/ui/ThemePreview.tsx`:
- Real-time preview using user's actual data
- Hover to see enlarged preview
- Quick-switch templates without leaving builder

**Step 4.4: ATS Optimization Mode**

Add toggle in designer settings:

```typescript
atsMode: boolean // Default: true
```

When enabled:
- Disable images/photos
- Disable complex graphics
- Use simple fonts
- Remove colored backgrounds
- Ensure proper heading hierarchy
- Use standard section titles

---

## Implementation Phases

### Sprint 1: Foundation & Cleanup (Week 1)

**Goals:**
- Remove all broken JSON Resume dependencies
- Create template type system
- Create shared template components
- Update ResumeCanvas to support template rendering

**Deliverables:**
- ✅ Clean build (no errors)
- ✅ Template types defined
- ✅ Template registry created
- ✅ Shared components ready
- ✅ ResumeCanvas updated

**Testing:**
- Verify build succeeds
- Verify existing JobFoxy Classic still works
- No regressions in drag & drop or zoom

---

### Sprint 2: Template 1 - Modern Sidebar (Week 2)

**Goals:**
- Implement enhanced version of ModernTemplate
- Full designer settings integration
- Create template preview image
- Test thoroughly

**Deliverables:**
- ✅ ModernSidebar component complete
- ✅ Preview image created
- ✅ Registered in template system
- ✅ All designer settings working
- ✅ Drag & drop sections working

**Testing:**
- Test with empty resume
- Test with full resume data
- Test all designer settings
- Test section reordering
- Visual regression testing

---

### Sprint 3: Templates 2 & 3 - Classic Linear + Minimal Clean (Week 3)

**Goals:**
- Implement two single-column templates
- Create preview images
- Test with various content types

**Deliverables:**
- ✅ ClassicLinear component complete
- ✅ MinimalClean component complete
- ✅ Preview images created
- ✅ Both templates registered
- ✅ Designer settings working

**Testing:**
- Compare rendering across all 3 templates
- Test template switching (no data loss)
- Test with rich text content
- Test with different fonts

---

### Sprint 4: Templates 4 & 5 - Creative Colored + Two-Column Hybrid (Week 4)

**Goals:**
- Implement colorful template
- Implement flexible two-column layout
- Add icon support
- Add photo positioning

**Deliverables:**
- ✅ CreativeColored component complete
- ✅ TwoColumnHybrid component complete
- ✅ Icon integration working
- ✅ Photo positioning options
- ✅ Preview images created

**Testing:**
- Test with/without photos
- Test with/without icons
- Test color customization
- Test column width adjustment

---

### Sprint 5: PDF Export & Polish (Week 5)

**Goals:**
- Add PDF export for all templates
- Create template customization panel
- Add ATS optimization mode
- Performance optimization

**Deliverables:**
- ✅ PDF export working for all templates
- ✅ Template customization panel
- ✅ ATS mode implemented
- ✅ Performance optimized (lazy loading, code splitting)
- ✅ Documentation complete

**Testing:**
- Test PDF export quality
- Test PDF file size
- Test ATS mode output
- Load testing with large resumes

---

### Sprint 6: Optional Advanced Templates (Week 6)

**Goals:**
- Implement ExecutiveProfessional template
- Implement TechModern template
- Add advanced features (charts, graphs)

**Deliverables:**
- ✅ 2 additional templates (total 7)
- ✅ Advanced visualizations (skill charts, etc.)
- ✅ Dark mode support

---

## Technical Requirements

### Dependencies to Add

```bash
npm install @react-pdf/renderer lucide-react
```

### File Structure

```
components/
  resume/
    templates/
      ModernSidebar.tsx          # Template 1
      ClassicLinear.tsx          # Template 2
      MinimalClean.tsx           # Template 3
      CreativeColored.tsx        # Template 4
      TwoColumnHybrid.tsx        # Template 5
      ExecutiveProfessional.tsx  # Template 6 (optional)
      TechModern.tsx             # Template 7 (optional)

      shared/
        TemplateSection.tsx      # Section wrapper with settings
        TemplateWrapper.tsx      # Page wrapper
        utils.ts                 # Helper functions

      pdf/
        ModernSidebarPDF.tsx     # PDF version of each template
        ClassicLinearPDF.tsx
        # ... etc

lib/
  types/
    template.ts                  # Template type definitions

  templateRegistry.ts            # Template registry
  resumeThemes.ts                # Updated theme list

public/
  templates/
    modern-sidebar.svg           # Preview images
    classic-linear.svg
    # ... etc
```

### Code Quality Standards

1. **TypeScript Strict Mode:** All templates must pass `strict: true`
2. **Component Props:** Fully typed, no `any` types
3. **Accessibility:** Proper semantic HTML, ARIA labels where needed
4. **Performance:** Lazy load templates, memoize expensive computations
5. **Testing:** Unit tests for shared utils, visual regression tests for templates
6. **Documentation:** JSDoc comments for all exported functions/components

---

## Testing Strategy

### Unit Tests

File: `components/resume/templates/__tests__/shared.test.ts`

```typescript
import { filterVisibleSections, applySectionStyles } from '../shared/utils'

describe('Template Utils', () => {
  test('filterVisibleSections returns only visible sections with content', () => {
    // ... test logic
  })

  test('applySectionStyles applies designer settings correctly', () => {
    // ... test logic
  })
})
```

### Visual Regression Tests

Use Playwright or Storybook:

```typescript
// components/resume/templates/__tests__/visual.spec.ts
import { test, expect } from '@playwright/test'

test('ModernSidebar renders correctly', async ({ page }) => {
  await page.goto('/resume/123?template=modern-sidebar')
  await expect(page).toHaveScreenshot('modern-sidebar.png')
})
```

### Integration Tests

```typescript
test('Template switching preserves data', async () => {
  // 1. Load resume with Template A
  // 2. Switch to Template B
  // 3. Verify all data is still present
  // 4. Switch back to Template A
  // 5. Verify data is identical
})
```

### Manual Testing Checklist

For each template:
- [ ] Renders with empty resume data (no errors)
- [ ] Renders with full resume data
- [ ] All sections appear when visible
- [ ] Sections hide when marked invisible
- [ ] Rich text formatting preserved (bold, italic, links, bullets)
- [ ] Drag & drop section reordering works
- [ ] Zoom controls work (50%-200%)
- [ ] All 45 designer settings apply correctly
- [ ] Template switches without data loss
- [ ] PDF export works
- [ ] ATS mode simplifies layout appropriately
- [ ] Responsive (looks good at different zoom levels)
- [ ] Accessible (keyboard navigation, screen readers)

---

## Success Metrics

### Technical Metrics

1. **Build Success Rate:** 100% (no build failures)
2. **Template Coverage:** 5-7 production-ready templates
3. **Designer Settings Coverage:** 100% of 45 settings integrated
4. **PDF Export Quality:** <2MB file size, professional appearance
5. **Performance:** Template render time <200ms
6. **Test Coverage:** >80% for shared utils

### User Experience Metrics

1. **Template Variety:** Cover 5+ use cases (tech, creative, traditional, etc.)
2. **ATS Compatibility:** All templates pass ATS scanners
3. **Customization Options:** Users can customize colors, fonts, spacing for all templates
4. **Data Preservation:** 100% of user data preserved when switching templates
5. **Rich Text Support:** Full Tiptap formatting preserved

### Business Metrics

1. **User Satisfaction:** Positive feedback on template quality
2. **Template Usage:** Distribution of template selection (identify favorites)
3. **Conversion:** Increased upgrade rate for premium templates (future)

---

## Risk Mitigation

### Risk 1: Timeline Overrun

**Mitigation:**
- Prioritize core templates (1-5) over optional templates (6-7)
- Use Sprint 1 to de-risk shared infrastructure
- Build simplest template first (ClassicLinear) to validate approach

### Risk 2: Designer Settings Complexity

**Mitigation:**
- Create comprehensive shared utilities in Sprint 1
- Test designer settings integration early with Template 1
- Document settings-to-CSS mapping clearly

### Risk 3: PDF Export Quality Issues

**Mitigation:**
- Research @react-pdf/renderer limitations early
- Create PDF prototypes before Sprint 5
- Consider fallback to HTML-to-PDF if needed (Puppeteer)

### Risk 4: Performance Degradation

**Mitigation:**
- Lazy load templates (React.lazy)
- Memoize expensive computations (useMemo, React.memo)
- Code-split templates into separate bundles
- Monitor bundle size with each template addition

### Risk 5: ATS Compatibility

**Mitigation:**
- Research ATS best practices (Jobscan, Resume Worded)
- Test templates with ATS scanners
- Implement strict ATS mode that simplifies layouts

---

## Next Steps (Immediate Actions)

### Developer Tasks:

1. **Review this plan** - Confirm approach, timelines, templates
2. **Prioritize templates** - Choose 5-7 to implement (must-haves vs nice-to-haves)
3. **Set up Sprint 1** - Schedule cleanup and foundation work
4. **Create design mockups** - Visual designs for each template (Figma/Sketch)
5. **Assign resources** - Determine if this is solo or team effort

### Questions to Answer:

1. Do we want 5, 7, or more templates?
2. Should we include Executive/Tech templates or focus on core 5?
3. What's the timeline? (Suggested: 5-6 weeks for 5 templates)
4. Do we need design mockups before implementation?
5. Should PDF export be in scope for MVP or later?

---

## Conclusion

This plan provides a complete roadmap to rebuild JobFoxy's resume template system from the ground up. By migrating from broken JSON Resume themes to native React components, we gain:

✅ **Full Control:** Every pixel, every setting, fully customizable
✅ **Zero Build Errors:** Native React eliminates dependency hell
✅ **Rich Text Support:** Preserve Tiptap formatting throughout
✅ **Designer Integration:** All 45 settings work across all templates
✅ **Professional Quality:** Templates that rival Canva, Resume.io, TealHQ
✅ **Maintainability:** Clean, typed, testable codebase
✅ **Extensibility:** Easy to add new templates in the future

The phased approach allows for iterative development, testing, and user feedback. Each sprint delivers working functionality, reducing risk and enabling early validation.

**Estimated Timeline:** 5-6 weeks for core 5 templates + infrastructure
**Estimated Effort:** 1 senior React developer, full-time

---

**Document Version:** 1.0
**Last Updated:** 2025-12-27
**Author:** Claude Code Assistant
**Status:** Ready for Review & Approval
