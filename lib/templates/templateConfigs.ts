// lib/templates/templateConfigs.ts
// Template configurations for the 9 implemented React-PDF templates

import { TemplateConfig } from '@/lib/types/template'

/**
 * TEMPLATE LIBRARY
 * Only includes templates that have actual React-PDF implementations
 * in lib/pdf/templates/
 */

export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  /**
   * 1. CLASSIC
   * Traditional single-column layout with clean typography
   */
  'classic': {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column layout with clean typography. Timeless and professional.',
    category: 'classic',
    tags: ['traditional', 'single-column', 'professional', 'ats-friendly'],
    previewImage: '/templates/classic.svg',
    isPremium: false,

    layout: {
      type: 'single-column',
      zones: [
        {
          id: 'header',
          width: '100%',
          padding: '0 0 1.5rem 0',
          sections: ['contact'],
        },
        {
          id: 'main',
          width: '100%',
          sections: ['targetTitle', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'volunteer', 'publications', 'languages'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#1F2937',
        text: '#374151',
        heading: '#111827',
        background: '#FFFFFF',
        border: '#E5E7EB',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '2.25rem',
          h2: '1.25rem',
          h3: '1.125rem',
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
        dividerStyle: 'solid',
        dividerColor: '#E5E7EB',
        dividerThickness: '1px',
        headerStyle: 'bold',
        bulletStyle: 'disc',
        iconStyle: 'none',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: true,
      printOptimized: true,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },

  /**
   * 2. MODERN (Left Sidebar)
   * Two-column layout with left sidebar for skills and contact
   */
  'modern': {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with left sidebar for skills and contact. Clean and contemporary.',
    category: 'modern',
    tags: ['sidebar-left', 'two-column', 'modern', 'skills-focused'],
    previewImage: '/templates/modern.svg',
    isPremium: false,

    layout: {
      type: 'sidebar-left',
      zones: [
        {
          id: 'sidebar',
          width: '35%',
          backgroundColor: 'var(--accent-color)',
          padding: '2rem',
          sections: ['contact', 'skills', 'education', 'languages', 'certifications'],
        },
        {
          id: 'main',
          width: '65%',
          padding: '2rem',
          sections: ['targetTitle', 'summary', 'experience', 'projects', 'volunteer', 'publications', 'awards'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#1F2937',
        accent: '#374151',
        background: '#FFFFFF',
        text: '#374151',
        heading: '#111827',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '2rem',
          h2: '1.25rem',
          h3: '1rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.5,
        headingWeight: 700,
        bodyWeight: 400,
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      visual: {
        dividerStyle: 'none',
        headerStyle: 'bold',
        bulletStyle: 'disc',
        iconStyle: 'none',
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

  /**
   * 3. MINIMAL
   * Clean, typography-focused design with minimal styling
   */
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, typography-focused design with minimal styling. Lets your content shine.',
    category: 'minimal',
    tags: ['minimal', 'clean', 'typography', 'ats-friendly'],
    previewImage: '/templates/minimal.svg',
    isPremium: false,

    layout: {
      type: 'single-column',
      zones: [
        {
          id: 'main',
          width: '100%',
          padding: '2.5rem',
          sections: ['contact', 'targetTitle', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'languages', 'volunteer', 'publications'],
        },
      ],
    },

    design: {
      colors: {
        text: '#333333',
        heading: '#111111',
        background: '#FFFFFF',
        muted: '#666666',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '2rem',
          h2: '1.125rem',
          h3: '1rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.6,
        headingWeight: 700,
        bodyWeight: 400,
        headingTransform: 'uppercase',
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      visual: {
        dividerStyle: 'solid',
        dividerColor: '#E5E7EB',
        dividerThickness: '1px',
        headerStyle: 'underlined',
        bulletStyle: 'disc',
        iconStyle: 'none',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: true,
      printOptimized: true,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },

  /**
   * 4. EXECUTIVE
   * Bold header with right sidebar. Premium look for leaders.
   */
  'executive': {
    id: 'executive',
    name: 'Executive',
    description: 'Bold header with right sidebar. Premium look for senior professionals and leaders.',
    category: 'professional',
    tags: ['executive', 'sidebar-right', 'bold', 'premium'],
    previewImage: '/templates/executive.svg',
    isPremium: false,

    layout: {
      type: 'sidebar-right',
      zones: [
        {
          id: 'main',
          width: '65%',
          padding: '2rem',
          sections: ['summary', 'experience', 'projects', 'volunteer', 'publications'],
        },
        {
          id: 'sidebar',
          width: '35%',
          padding: '2rem',
          sections: ['skills', 'education', 'certifications', 'awards', 'languages'],
        },
      ],
      headerSections: ['contact', 'targetTitle'],
    },

    design: {
      colors: {
        primary: '#0F172A',
        accent: '#0F172A',
        background: '#FFFFFF',
        text: '#334155',
        heading: '#0F172A',
      },
      typography: {
        headingFont: 'Merriweather, serif',
        bodyFont: 'Open Sans, sans-serif',
        headingSize: {
          h1: '2.25rem',
          h2: '1.25rem',
          h3: '1.125rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.7,
        headingWeight: 700,
        bodyWeight: 400,
        headingTransform: 'uppercase',
      },
      spacing: {
        sectionGap: '2rem',
        itemGap: '1.25rem',
      },
      visual: {
        dividerStyle: 'solid',
        dividerColor: '#0F172A',
        dividerThickness: '2px',
        headerStyle: 'bold',
        bulletStyle: 'square',
        iconStyle: 'none',
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

  /**
   * 6. PROFESSIONAL
   * Clean layout with accent lines. ATS-optimized design.
   */
  'professional': {
    id: 'professional',
    name: 'Professional',
    description: 'Clean layout with accent lines. ATS-optimized for maximum compatibility.',
    category: 'professional',
    tags: ['professional', 'single-column', 'ats-friendly', 'clean'],
    previewImage: '/templates/professional.svg',
    isPremium: false,

    layout: {
      type: 'single-column',
      zones: [
        {
          id: 'header',
          width: '100%',
          padding: '0 0 1.5rem 0',
          sections: ['contact', 'targetTitle'],
        },
        {
          id: 'main',
          width: '100%',
          sections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'languages', 'volunteer', 'publications'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#2563EB',
        accent: '#2563EB',
        background: '#FFFFFF',
        text: '#374151',
        heading: '#111827',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '2rem',
          h2: '1.25rem',
          h3: '1rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.6,
        headingWeight: 700,
        bodyWeight: 400,
        headingTransform: 'uppercase',
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      visual: {
        dividerStyle: 'solid',
        dividerColor: '#E5E7EB',
        dividerThickness: '1px',
        headerStyle: 'underlined',
        bulletStyle: 'disc',
        iconStyle: 'none',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: true,
      printOptimized: true,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },

  /**
   * 7. COMPACT
   * Dense two-column layout to fit more content on one page.
   */
  'compact': {
    id: 'compact',
    name: 'Compact',
    description: 'Dense two-column layout to fit more content on one page. Perfect for experienced professionals.',
    category: 'modern',
    tags: ['compact', 'two-column', 'dense', 'one-page'],
    previewImage: '/templates/compact.svg',
    isPremium: false,

    layout: {
      type: 'two-column',
      zones: [
        {
          id: 'column-1',
          width: '65%',
          padding: '1.5rem',
          sections: ['summary', 'experience', 'projects', 'volunteer', 'publications'],
        },
        {
          id: 'column-2',
          width: '35%',
          padding: '1.5rem',
          sections: ['skills', 'education', 'certifications', 'awards', 'languages'],
        },
      ],
      headerSections: ['contact', 'targetTitle'],
    },

    design: {
      colors: {
        primary: '#1F2937',
        text: '#374151',
        heading: '#111827',
        background: '#FFFFFF',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '1.75rem',
          h2: '1rem',
          h3: '0.9rem',
        },
        bodySize: '0.85rem',
        lineHeight: 1.4,
        headingWeight: 700,
        bodyWeight: 400,
      },
      spacing: {
        sectionGap: '0.75rem',
        itemGap: '0.5rem',
      },
      visual: {
        dividerStyle: 'none',
        headerStyle: 'bold',
        bulletStyle: 'disc',
        iconStyle: 'none',
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

  /**
   * 8. CREATIVE
   * Bold header with accent boxes and modern card styling.
   */
  'creative': {
    id: 'creative',
    name: 'Creative',
    description: 'Bold header with accent boxes and modern card styling. Stand out from the crowd.',
    category: 'creative',
    tags: ['creative', 'bold', 'modern', 'colorful'],
    previewImage: '/templates/creative.svg',
    isPremium: false,

    layout: {
      type: 'single-column',
      zones: [
        {
          id: 'header',
          width: '100%',
          backgroundColor: 'var(--primary-color)',
          padding: '2rem',
          sections: ['contact', 'targetTitle'],
        },
        {
          id: 'main',
          width: '100%',
          padding: '2rem',
          sections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'languages', 'volunteer', 'publications'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#2563EB',
        accent: '#2563EB',
        background: '#FFFFFF',
        text: '#374151',
        heading: '#111827',
      },
      typography: {
        headingFont: 'Helvetica, sans-serif',
        bodyFont: 'Helvetica, sans-serif',
        headingSize: {
          h1: '2.25rem',
          h2: '1.25rem',
          h3: '1rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.6,
        headingWeight: 700,
        bodyWeight: 400,
        headingTransform: 'uppercase',
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      visual: {
        borderRadius: '4px',
        headerStyle: 'filled',
        bulletStyle: 'arrow',
        iconStyle: 'none',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: false,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },

  /**
   * 9. ELEGANT
   * Sophisticated design with refined typography and elegant dividers.
   */
  'elegant': {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with refined typography and elegant dividers. Classic and refined.',
    category: 'professional',
    tags: ['elegant', 'sophisticated', 'serif', 'refined'],
    previewImage: '/templates/elegant.svg',
    isPremium: false,

    layout: {
      type: 'single-column',
      zones: [
        {
          id: 'header',
          width: '100%',
          padding: '2rem',
          sections: ['contact', 'targetTitle'],
        },
        {
          id: 'main',
          width: '100%',
          padding: '2rem',
          sections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'awards', 'languages', 'volunteer', 'publications'],
        },
      ],
    },

    design: {
      colors: {
        primary: '#1F2937',
        text: '#374151',
        heading: '#111827',
        background: '#FFFFFF',
        border: '#D1D5DB',
      },
      typography: {
        headingFont: 'Georgia, serif',
        bodyFont: 'Georgia, serif',
        headingSize: {
          h1: '2.25rem',
          h2: '1.375rem',
          h3: '1.125rem',
        },
        bodySize: '0.95rem',
        lineHeight: 1.7,
        letterSpacing: '0.02em',
        headingWeight: 400,
        bodyWeight: 400,
        headingTransform: 'uppercase',
      },
      spacing: {
        sectionGap: '2rem',
        itemGap: '1.25rem',
      },
      visual: {
        dividerStyle: 'solid',
        dividerColor: '#D1D5DB',
        dividerThickness: '1px',
        headerStyle: 'underlined',
        bulletStyle: 'dash',
        iconStyle: 'none',
      },
    },

    behavior: {
      sectionOrdering: 'draggable',
      atsOptimized: true,
      printOptimized: true,
    },

    customizable: {
      colors: true,
      fonts: true,
      spacing: true,
      sectionOrder: true,
    },
  },
}

/**
 * Helper function to get template config
 */
export function getTemplateConfig(templateId: string): TemplateConfig | undefined {
  return TEMPLATE_CONFIGS[templateId]
}

/**
 * Helper function to get all template configs
 */
export function getAllTemplateConfigs(): TemplateConfig[] {
  return Object.values(TEMPLATE_CONFIGS)
}

/**
 * Helper function to get templates by category
 */
export function getTemplatesByCategory(category: TemplateConfig['category']): TemplateConfig[] {
  return getAllTemplateConfigs().filter(config => config.category === category)
}

/**
 * Helper function to get free templates
 */
export function getFreeTemplates(): TemplateConfig[] {
  return getAllTemplateConfigs().filter(config => !config.isPremium)
}

/**
 * Helper function to get premium templates
 */
export function getPremiumTemplates(): TemplateConfig[] {
  return getAllTemplateConfigs().filter(config => config.isPremium)
}

/**
 * Helper function to get ATS-optimized templates
 */
export function getATSTemplates(): TemplateConfig[] {
  return getAllTemplateConfigs().filter(config =>
    config.behavior?.atsOptimized === true
  )
}

/**
 * Helper function to get highly ATS-optimized templates (single-column only)
 */
export function getATSFriendlyTemplates(): TemplateConfig[] {
  return getAllTemplateConfigs().filter(config =>
    config.behavior?.atsOptimized === true &&
    config.layout.type === 'single-column'
  )
}
