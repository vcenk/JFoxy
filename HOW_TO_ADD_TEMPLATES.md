# How to Add New Resume Templates

## Overview

This template system is designed to make adding hundreds of templates **EASY**. You don't need to write React components - just copy a template config and modify the values!

## Quick Start: Adding a New Template in 3 Steps

### Step 1: Create Template Config

Open `lib/templates/templateConfigs.ts` and add a new template configuration:

```typescript
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  // ... existing templates ...

  /**
   * YOUR NEW TEMPLATE
   * Description of what makes it unique
   */
  'your-template-id': {
    id: 'your-template-id',
    name: 'Your Template Name',
    description: 'A brief description of your template',
    category: 'modern', // or 'classic', 'minimal', 'creative', 'professional', 'bold'
    tags: ['tag1', 'tag2', 'tag3'],
    previewImage: '/templates/your-template.svg',
    isPremium: false, // Set to true for premium templates

    layout: {
      type: 'sidebar-left', // or 'single-column', 'two-column', 'sidebar-right'
      zones: [
        {
          id: 'sidebar',
          width: '35%',
          backgroundColor: '#8B5CF6', // Can use hex colors or CSS variables
          padding: '2rem',
          sections: ['contact', 'skills', 'education'],
        },
        {
          id: 'main',
          width: '65%',
          padding: '2rem',
          sections: ['targetTitle', 'summary', 'experience', 'projects'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#8B5CF6',
        accent: '#8B5CF6',
        background: '#FFFFFF',
        text: '#1F2937',
        heading: '#111827',
      },
      typography: {
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
        headingSize: {
          h1: '2rem',
          h2: '1.5rem',
          h3: '1.25rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.6,
        headingWeight: 700,
        bodyWeight: 400,
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      visual: {
        borderRadius: '0',
        dividerStyle: 'none',
        headerStyle: 'bold',
        bulletStyle: 'disc',
        iconStyle: 'solid',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: true,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },
}
```

### Step 2: Add to Theme Gallery

Open `lib/resumeThemes.ts` and add an entry:

```typescript
export const RESUME_THEMES: ResumeTheme[] = [
  // ... existing themes ...
  {
    id: 'your-template-id',
    name: 'Your Template Name',
    value: 'your-template-id',
    description: 'A brief description',
    category: 'modern',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    previewImage: '/templates/your-template.svg',
    color: '#8B5CF6', // Accent color for the gallery card
  },
]
```

### Step 3: Done!

That's it! No React code needed. The template renderer automatically picks up your config and renders it.

---

## Configuration Options Reference

### Layout Types

- **`single-column`** - Traditional single column (e.g., Classic Linear)
- **`two-column`** - Two equal columns (e.g., Grid Layout)
- **`sidebar-left`** - Sidebar on left (e.g., Modern Sidebar)
- **`sidebar-right`** - Sidebar on right (e.g., Two-Tone)
- **`three-column`** - Three columns (rare, for advanced layouts)
- **`grid`** - CSS Grid layout (future)

### Layout Zones

Each zone represents a section of the page:

```typescript
{
  id: 'sidebar',              // Unique zone ID
  width: '35%',               // CSS width
  backgroundColor: '#8B5CF6', // Optional background color
  padding: '2rem',            // CSS padding
  align: 'left',              // 'left', 'center', or 'right'
  sections: ['contact', 'skills'] // Which sections go in this zone
}
```

### Available Sections

These are the sections you can place in zones:

- **`contact`** - Contact information
- **`targetTitle`** - Job title/position
- **`summary`** - Professional summary
- **`experience`** - Work experience
- **`education`** - Education history
- **`skills`** - Skills (technical, soft, other)
- **`projects`** - Projects portfolio
- **`certifications`** - Certifications
- **`awards`** - Awards and honors
- **`volunteer`** - Volunteer work
- **`publications`** - Publications and research
- **`languages`** - Languages spoken

### Color Scheme

```typescript
colors: {
  primary: '#8B5CF6',    // Primary brand color
  secondary: '#06B6D4',  // Secondary color (optional)
  accent: '#8B5CF6',     // Accent color (highlights, buttons)
  background: '#FFFFFF', // Page background
  text: '#1F2937',       // Body text color
  heading: '#111827',    // Heading color
  muted: '#6B7280',      // Muted text (optional)
  border: '#E5E7EB',     // Border color (optional)
}
```

### Typography

```typescript
typography: {
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  headingSize: {
    h1: '2rem',      // Main heading (name/title)
    h2: '1.5rem',    // Section headings
    h3: '1.25rem',   // Subsection headings
  },
  bodySize: '0.95rem',
  lineHeight: 1.6,
  letterSpacing: '0',          // Optional
  headingWeight: 700,
  bodyWeight: 400,
  headingTransform: 'none',    // 'none', 'uppercase', 'lowercase', 'capitalize'
}
```

### Spacing

```typescript
spacing: {
  sectionGap: '1.5rem',  // Space between sections
  itemGap: '1rem',       // Space between items within sections
  padding: {
    page: '2rem',        // Page padding (optional)
    section: '1rem',     // Section padding (optional)
    zone: '2rem',        // Zone padding (optional)
  },
  margin: {
    top: '2rem',         // Top margin (optional)
    bottom: '2rem',      // Bottom margin (optional)
    left: '2rem',        // Left margin (optional)
    right: '2rem',       // Right margin (optional)
  },
}
```

### Visual Style

```typescript
visual: {
  borderRadius: '8px',           // Border radius for elements
  dividerStyle: 'solid',         // 'none', 'solid', 'dashed', 'dotted'
  dividerColor: '#E5E7EB',       // Divider color
  dividerThickness: '1px',       // Divider thickness
  shadows: true,                 // Enable shadows
  headerStyle: 'bold',           // 'minimal', 'bold', 'underlined', 'boxed', 'filled'
  bulletStyle: 'disc',           // 'disc', 'circle', 'square', 'dash', 'arrow'
  iconStyle: 'solid',            // 'none', 'outline', 'solid', 'duotone'
}
```

### Behavior

```typescript
behavior: {
  sectionOrdering: 'draggable',  // 'fixed' or 'draggable'
  responsiveBreakpoint: 768,     // Width to switch to mobile (optional)
  printOptimized: true,          // Special print styling (optional)
  atsOptimized: true,            // ATS-friendly mode (optional)
}
```

### Customization

Control which settings users can customize:

```typescript
customizable: {
  colors: true,        // Can user change colors?
  fonts: true,         // Can user change fonts?
  spacing: true,       // Can user change spacing?
  sectionOrder: true,  // Can user reorder sections?
  layout: true,        // Can user change layout? (optional)
}
```

---

## Template Categories

Choose the right category for your template:

- **`modern`** - Contemporary, clean designs with modern aesthetics
- **`classic`** - Traditional, timeless designs
- **`minimal`** - Minimalist, typography-focused designs
- **`creative`** - Bold, artistic designs for creative fields
- **`professional`** - Corporate, business-oriented designs
- **`bold`** - Eye-catching, statement designs

---

## Examples: Creating Variations

### Example 1: Create a Blue Variant of Modern Sidebar

```typescript
'modern-sidebar-blue': {
  id: 'modern-sidebar-blue',
  name: 'Modern Sidebar Blue',
  // ... copy all settings from 'modern-sidebar' ...
  design: {
    colors: {
      primary: '#3B82F6',  // Change from purple to blue
      accent: '#3B82F6',
      // ... rest stays the same ...
    },
    // ... rest of design config ...
  },
}
```

### Example 2: Create a Compact Version

```typescript
'compact-modern': {
  id: 'compact-modern',
  name: 'Compact Modern',
  // ... copy settings ...
  design: {
    // ... other settings ...
    typography: {
      headingSize: {
        h1: '1.5rem',    // Smaller than normal
        h2: '1.25rem',
        h3: '1rem',
      },
      bodySize: '0.85rem',  // Smaller body text
      lineHeight: 1.4,      // Tighter line height
    },
    spacing: {
      sectionGap: '0.75rem',  // Less space
      itemGap: '0.5rem',
    },
  },
}
```

### Example 3: Create a Dark Mode Version

```typescript
'modern-sidebar-dark': {
  id: 'modern-sidebar-dark',
  name: 'Modern Sidebar Dark',
  // ... copy settings ...
  design: {
    colors: {
      primary: '#8B5CF6',
      accent: '#8B5CF6',
      background: '#1F2937',     // Dark background
      text: '#F9FAFB',           // Light text
      heading: '#FFFFFF',        // White headings
    },
    // ... rest stays the same ...
  },
}
```

---

## Tips for Creating Great Templates

### 1. Start by Copying

Don't start from scratch! Copy an existing template that's similar to what you want and modify it.

### 2. Test with Real Data

Make sure to test your template with:
- Short content (minimal experience)
- Long content (10+ years of experience)
- Different section combinations

### 3. Consider ATS Compatibility

If `atsOptimized: true`, ensure:
- Single column or simple two-column layout
- No complex graphics or overlapping elements
- Standard fonts (Arial, Helvetica, Times New Roman)
- Clear section headings

### 4. Use Semantic Colors

Instead of random colors, choose colors that make sense:
- **Finance/Legal:** Navy blue, dark gray
- **Tech/Startup:** Purple, teal, green
- **Creative:** Bold colors (pink, orange, yellow)
- **Healthcare:** Blue, green
- **Education:** Blue, burgundy

### 5. Typography Pairing

Good font combinations:
- **Modern:** Inter + Inter
- **Professional:** Roboto + Open Sans
- **Creative:** Playfair Display + Raleway
- **Classic:** Georgia + Arial
- **Tech:** JetBrains Mono + Inter

---

## How to Add Hundreds of Templates

### Strategy 1: Color Variations

For each base template, create 5-7 color variations:
- Default
- Blue
- Green
- Purple
- Orange
- Dark Mode
- Monochrome

**Result:** 1 template → 7 variations

### Strategy 2: Layout Variations

For each design, create different layouts:
- Single column
- Two column
- Sidebar left
- Sidebar right

**Result:** 1 design → 4 layouts → 28 variations (with colors)

### Strategy 3: Industry-Specific

Create templates optimized for industries:
- Tech/Engineering
- Finance/Banking
- Healthcare/Medical
- Creative/Design
- Education/Academia
- Legal/Government
- Consulting/Business
- Marketing/Sales
- Retail/Hospitality

**Result:** 9 industries × 4 layouts × 3 colors = 108 templates!

### Strategy 4: Experience Level

Tailor templates for experience levels:
- Entry Level (emphasis on education, skills)
- Mid-Level (balanced)
- Senior (emphasis on achievements)
- Executive (leadership focus)

### Strategy 5: Use Case

- One-page resume
- Two-page CV
- Academic CV (publications-heavy)
- Creative portfolio
- Federal resume
- International CV

---

## File Structure

```
lib/
  types/
    template.ts                  # Type definitions
  templates/
    templateConfigs.ts           # All template configurations

components/
  resume/
    templates/
      TemplateRenderer.tsx       # Universal renderer (no need to touch)
      shared/
        TemplateLayout.tsx       # Layout components (no need to touch)

lib/
  resumeThemes.ts                # Template gallery entries
```

---

## FAQ

**Q: Do I need to write React components for each template?**
A: No! Just add a config object. The renderer handles everything.

**Q: Can I preview templates before adding them?**
A: Yes! Just add the config and it will immediately appear in your dev environment.

**Q: What if I want a custom layout not supported?**
A: You can request new layout types or create custom components, but 90% of templates can be done with config alone.

**Q: Can users customize these templates?**
A: Yes! Set `customizable.colors`, `customizable.fonts`, etc. to control what users can change.

**Q: How do I mark a template as premium?**
A: Set `isPremium: true` in the config.

**Q: Can I delete the old JSON Resume templates?**
A: Yes! They're already removed. This new system replaces them entirely.

---

## Next Steps

1. **Add 10 more templates** by copying and modifying existing configs
2. **Create color variations** of popular templates
3. **Add industry-specific templates** based on your target users
4. **Test with real user data** to ensure all templates render well
5. **Create preview images** for better gallery presentation

---

**Remember:** With this system, you can add 100+ templates in an afternoon just by copy-pasting and changing colors, fonts, and layouts. No coding required!
