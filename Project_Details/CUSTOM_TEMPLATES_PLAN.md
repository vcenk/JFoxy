# Custom Resume Templates - Simple Implementation Plan

## Current Status
✅ Removed all JSON Resume theme packages and dependencies
✅ Cleaned up template UI to show only JobFoxy Classic
✅ Dev server running at http://localhost:3000

## Goal
Build 3-5 simple, professional React resume templates from scratch that:
- Work reliably (no external dependencies)
- Are easy to customize
- Look professional and modern
- Are ATS-friendly

## Simple Approach

### Template as React Component
Each template is just a React component that receives resume data:

```tsx
// components/resume/templates/MinimalTemplate.tsx
export function MinimalTemplate({ resumeData }: { resumeData: ParsedResume }) {
  return (
    <div className="max-w-[8.5in] mx-auto bg-white p-16">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {resumeData.contact.firstName} {resumeData.contact.lastName}
        </h1>
        <p className="text-lg text-gray-600">{resumeData.targetTitle}</p>
        <div className="text-sm text-gray-500 mt-2">
          {resumeData.contact.email} • {resumeData.contact.phone}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary?.content && (
        <div className="mb-6">
          <p className="text-gray-700">{resumeData.summary.content}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4">
            EXPERIENCE
          </h2>
          {resumeData.experience.map((job, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold">{job.position}</h3>
                <span className="text-gray-600">{job.startDate} - {job.endDate}</span>
              </div>
              <div className="text-gray-600">{job.company}</div>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {job.highlights?.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education, Skills, etc... */}
    </div>
  )
}
```

### Template Registry
Simple object mapping template IDs to components:

```tsx
// components/resume/templates/index.ts
import { MinimalTemplate } from './MinimalTemplate'
import { ModernTemplate } from './ModernTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'

export const TEMPLATES = {
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    component: MinimalTemplate,
    preview: '/previews/minimal.png'
  },
  'modern': {
    id: 'modern',
    name: 'Modern Pro',
    component: ModernTemplate,
    preview: '/previews/modern.png'
  },
  'professional': {
    id: 'professional',
    name: 'Professional',
    component: ProfessionalTemplate,
    preview: '/previews/professional.png'
  }
}
```

### Using Templates in Inspector
Update the Templates tab to show available templates:

```tsx
{inspectorTab === 'templates' && (
  <div className="grid grid-cols-2 gap-4">
    {Object.values(TEMPLATES).map(template => (
      <button
        key={template.id}
        onClick={() => setSelectedTemplate(template.id)}
        className={`p-4 rounded-xl border-2 ${
          selectedTemplate === template.id
            ? 'border-purple-500'
            : 'border-white/20'
        }`}
      >
        <img src={template.preview} alt={template.name} />
        <p className="mt-2 font-bold">{template.name}</p>
      </button>
    ))}
  </div>
)}
```

### Rendering in Canvas
Switch between templates easily:

```tsx
export function ResumeCanvas() {
  const { resumeData, selectedTemplate } = useResume()

  if (selectedTemplate && selectedTemplate !== 'classic') {
    const Template = TEMPLATES[selectedTemplate].component
    return <Template resumeData={resumeData} />
  }

  // Otherwise render JobFoxy Classic (current editable version)
  return <ResumePaper>...</ResumePaper>
}
```

## Template Designs to Build

### 1. Minimal Template
- Clean, lots of white space
- Simple typography
- Section headers with underline
- Perfect for conservative industries

### 2. Modern Pro Template
- Bold header with color accent
- Two-column layout
- Modern sans-serif fonts
- Sidebar for skills/education

### 3. Professional Template
- Traditional single-column
- Classic serif fonts
- Clean section dividers
- Great for corporate roles

### 4. Creative Template (Optional)
- Unique layout
- Color blocks
- Modern design elements
- For creative industries

### 5. Tech Template (Optional)
- Clean monospace accents
- GitHub/portfolio links prominent
- Skills-first layout
- For developers

## Implementation Steps

### Week 1: Foundation
1. Create template structure (`components/resume/templates/`)
2. Build template registry system
3. Create MinimalTemplate as proof of concept
4. Update ResumeCanvas to support template switching
5. Add template selection in Inspector

### Week 2: More Templates
1. Design and build ModernTemplate
2. Design and build ProfessionalTemplate
3. Generate preview images for each
4. Add template customization (colors, fonts)

### Week 3: Polish
1. Ensure PDF export works for all templates
2. Add template descriptions and categories
3. Build template preview modal
4. Test with real resume data

## Next Immediate Step

Would you like me to:
1. **Start building the first template** (Minimal) right now?
2. **Design the template system architecture** first?
3. **Create mockups** of what the templates should look like?

The fastest path is option 1 - I can build a working Minimal template in the next 10 minutes that you can see and test immediately.
