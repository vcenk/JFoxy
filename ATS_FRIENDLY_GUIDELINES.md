# ATS-Friendly Resume Template Guidelines

## What is ATS?
Applicant Tracking Systems (ATS) are software tools used by ~98% of Fortune 500 companies to parse, scan, and rank resumes. If your resume isn't ATS-friendly, it may never reach a human recruiter.

## Critical ATS Rules (Must Follow)

### 1. ✅ Use Standard HTML Tags (NO Tables or Complex Layouts)
```tsx
// ❌ BAD - Tables confuse ATS
<table>
  <tr>
    <td>Experience</td>
    <td>2020-2023</td>
  </tr>
</table>

// ✅ GOOD - Semantic HTML
<div>
  <h2>Experience</h2>
  <div>
    <h3>Job Title</h3>
    <p>Company Name</p>
    <p>2020 - 2023</p>
  </div>
</div>
```

### 2. ✅ Use Standard Section Headings
ATS looks for these exact keywords:
- "Work Experience" or "Experience" or "Professional Experience"
- "Education"
- "Skills" or "Technical Skills"
- "Summary" or "Professional Summary"
- "Certifications"
- "Projects"

```tsx
// ❌ BAD - Creative headings confuse ATS
<h2>Where I've Been</h2>
<h2>My Journey</h2>

// ✅ GOOD - Standard headings
<h2>Work Experience</h2>
<h2>Education</h2>
<h2>Skills</h2>
```

### 3. ✅ Use Standard Fonts
ATS can read these fonts reliably:
- Arial
- Calibri
- Georgia
- Helvetica
- Times New Roman
- Verdana

```css
/* ✅ GOOD */
font-family: 'Arial', sans-serif;
font-family: 'Calibri', sans-serif;
font-family: 'Georgia', serif;
```

### 4. ✅ NO Images for Text
```tsx
// ❌ BAD - ATS can't read images
<img src="/name-as-image.png" alt="John Doe" />

// ✅ GOOD - Use actual text
<h1>John Doe</h1>
```

### 5. ✅ NO Headers/Footers
```tsx
// ❌ BAD - ATS often ignores header/footer content
<header>John Doe | john@email.com</header>

// ✅ GOOD - Put all content in main body
<div>
  <h1>John Doe</h1>
  <p>john@email.com</p>
</div>
```

### 6. ✅ NO Special Characters for Bullets
```tsx
// ❌ BAD - Special characters may not parse
<p>★ Achievement</p>
<p>→ Achievement</p>

// ✅ GOOD - Use standard bullets or hyphens
<ul>
  <li>Achievement</li>
</ul>
// or
<p>- Achievement</p>
```

### 7. ✅ Use Simple Date Formats
```tsx
// ✅ GOOD formats ATS can parse
"January 2020 - Present"
"Jan 2020 - Dec 2023"
"2020 - 2023"
"01/2020 - 12/2023"

// ❌ BAD - Overly complex
"From winter of 2020 through autumn 2023"
```

### 8. ✅ NO Text in Images, Charts, or Graphics
```tsx
// ❌ BAD - Skills as visual bar charts
<div className="skill-bar" style={{width: '80%'}}></div>

// ✅ GOOD - Plain text skills
<ul>
  <li>JavaScript - Expert</li>
  <li>React - Advanced</li>
</ul>
```

### 9. ✅ Use Standard Contact Info Format
```tsx
// ✅ GOOD - Clear, parseable contact info
<div>
  <p>john.doe@email.com</p>
  <p>(555) 123-4567</p>
  <p>New York, NY</p>
  <p>linkedin.com/in/johndoe</p>
</div>
```

### 10. ✅ Single Column Layout (Most ATS-Friendly)
```tsx
// ✅ BEST - Single column
<div>
  <section>Header</section>
  <section>Summary</section>
  <section>Experience</section>
  <section>Education</section>
  <section>Skills</section>
</div>

// ⚠️ ACCEPTABLE - Two columns (if done correctly)
// Many modern ATS can handle 2 columns, but single column is safest
<div style={{display: 'flex'}}>
  <div style={{width: '65%'}}>Main content</div>
  <div style={{width: '35%'}}>Sidebar</div>
</div>
```

## ATS-Friendly Template Structure

```tsx
export function ATSFriendlyTemplate({ resumeData }) {
  return (
    <div className="max-w-[8.5in] mx-auto bg-white p-16">
      {/* 1. CONTACT HEADER */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {resumeData.contact.firstName} {resumeData.contact.lastName}
        </h1>
        <div className="text-sm">
          <p>{resumeData.contact.email} | {resumeData.contact.phone}</p>
          <p>{resumeData.contact.city}, {resumeData.contact.state}</p>
          {resumeData.contact.linkedin && <p>{resumeData.contact.linkedin}</p>}
        </div>
      </header>

      {/* 2. PROFESSIONAL SUMMARY */}
      {resumeData.summary?.content && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm">{resumeData.summary.content}</p>
        </section>
      )}

      {/* 3. WORK EXPERIENCE */}
      {resumeData.experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            WORK EXPERIENCE
          </h2>
          {resumeData.experience.map((job, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-bold text-base">{job.position}</h3>
              <p className="text-sm font-semibold">{job.company}</p>
              <p className="text-sm text-gray-600 mb-2">
                {job.startDate} - {job.endDate || 'Present'}
              </p>
              <ul className="list-disc ml-5 space-y-1">
                {job.highlights?.map((highlight, j) => (
                  <li key={j} className="text-sm">{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* 4. EDUCATION */}
      {resumeData.education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            EDUCATION
          </h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-base">{edu.degree}</h3>
              <p className="text-sm">{edu.institution}</p>
              <p className="text-sm text-gray-600">
                {edu.startDate} - {edu.endDate || 'Present'}
              </p>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* 5. SKILLS */}
      {(resumeData.skills?.technical?.length > 0 ||
        resumeData.skills?.soft?.length > 0) && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            SKILLS
          </h2>
          {resumeData.skills.technical?.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-bold">Technical:</p>
              <p className="text-sm">
                {resumeData.skills.technical.map(s => s.name).join(', ')}
              </p>
            </div>
          )}
          {resumeData.skills.soft?.length > 0 && (
            <div>
              <p className="text-sm font-bold">Soft Skills:</p>
              <p className="text-sm">
                {resumeData.skills.soft.join(', ')}
              </p>
            </div>
          )}
        </section>
      )}

      {/* 6. CERTIFICATIONS (if any) */}
      {resumeData.certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b-2 border-black pb-1 mb-3">
            CERTIFICATIONS
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            {resumeData.certifications.map((cert, i) => (
              <li key={i} className="text-sm">
                {cert.name} - {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
```

## ATS Testing Checklist

Before launching each template, verify:

- [ ] Uses semantic HTML (h1, h2, h3, p, ul, li)
- [ ] No tables for layout
- [ ] No text in images
- [ ] Standard section headings
- [ ] Standard fonts (Arial, Calibri, Georgia, etc.)
- [ ] Simple bullet points (•, -, or <li>)
- [ ] Clear date formats
- [ ] Contact info as plain text
- [ ] No headers/footers with critical info
- [ ] No special characters or symbols
- [ ] Single or simple two-column layout
- [ ] Test by copying/pasting to plain text (should be readable)

## ATS Score Factors

### High Score (90-100%)
- Single column layout
- Standard headings
- Semantic HTML
- Plain text formatting
- Standard fonts

### Medium Score (70-89%)
- Two column layout (done correctly)
- Some custom styling
- All text still parseable

### Low Score (<70%)
- Complex layouts
- Tables for structure
- Text in images
- Non-standard headings
- Heavy graphics

## Our Template Guarantee

Every template we build will:
1. ✅ Score 90%+ on ATS compatibility
2. ✅ Use semantic HTML only
3. ✅ Have standard section headings
4. ✅ Use ATS-friendly fonts
5. ✅ Be tested with real ATS software
6. ✅ Include an ATS score badge

## Implementation Notes

```tsx
// Each template will include metadata
export const MinimalTemplateConfig = {
  id: 'minimal',
  name: 'Minimal Professional',
  atsScore: 98,  // Out of 100
  atsFriendly: true,
  layout: 'single-column',
  bestFor: ['Corporate', 'Finance', 'Healthcare', 'Legal'],
  features: [
    'Maximum ATS compatibility',
    'Clean single-column layout',
    'Standard section headings',
    'Professional appearance'
  ]
}
```
