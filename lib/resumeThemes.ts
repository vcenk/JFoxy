// lib/resumeThemes.ts
// JSON Resume theme library with metadata and previews

export interface ResumeTheme {
  id: string
  name: string
  value: string | null // null for JobFoxy default
  description: string
  category: 'modern' | 'classic' | 'minimal' | 'creative'
  features: string[]
  previewImage: string // Path to preview image or placeholder
  color: string // Accent color for theme card
  npm?: string // npm package name
}

export const RESUME_THEMES: ResumeTheme[] = [
  {
    id: 'jobfoxy',
    name: 'JobFoxy Default',
    value: null,
    description: 'Our custom builder with full design control',
    category: 'modern',
    features: ['Live editing', 'Custom sections', 'Full customization', 'Multi-column'],
    previewImage: '/themes/jobfoxy-preview.svg',
    color: '#6C47FF',
  },
  {
    id: 'even',
    name: 'Even',
    value: 'even',
    description: 'Clean, multi-column layout with excellent readability',
    category: 'modern',
    features: ['Two columns', 'Icon support', 'Professional', 'ATS-friendly'],
    previewImage: '/themes/even-preview.svg',
    color: '#3B82F6',
    npm: 'jsonresume-theme-even',
  },
  {
    id: 'flat',
    name: 'Flat',
    value: 'flat',
    description: 'Minimalist design with flat colors and clean typography',
    category: 'minimal',
    features: ['Single column', 'Minimalist', 'Print-optimized', 'Clean'],
    previewImage: '/themes/flat-preview.svg',
    color: '#10B981',
    npm: 'jsonresume-theme-flat',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    value: 'elegant',
    description: 'Sophisticated and professional with elegant typography',
    category: 'classic',
    features: ['Serif fonts', 'Elegant', 'Traditional', 'Timeless'],
    previewImage: '/themes/elegant-preview.svg',
    color: '#8B5CF6',
    npm: 'jsonresume-theme-elegant',
  },
  {
    id: 'modern',
    name: 'Modern',
    value: 'modern',
    description: 'Timeline-based layout with modern aesthetics',
    category: 'modern',
    features: ['Timeline view', 'Modern', 'Visual', 'Engaging'],
    previewImage: '/themes/modern-preview.svg',
    color: '#F59E0B',
    npm: 'jsonresume-theme-modern',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    value: 'stackoverflow',
    description: 'Developer-focused theme inspired by Stack Overflow',
    category: 'modern',
    features: ['Tech-focused', 'Icons', 'Links', 'Developer-friendly'],
    previewImage: '/themes/stackoverflow-preview.svg',
    color: '#F48024',
    npm: 'jsonresume-theme-stackoverflow',
  },
  {
    id: 'class',
    name: 'Class',
    value: 'class',
    description: 'Self-contained modern theme that works offline',
    category: 'modern',
    features: ['Offline support', 'Modern', 'Self-contained', 'Responsive'],
    previewImage: '/themes/class-preview.svg',
    color: '#EC4899',
    npm: 'jsonresume-theme-class',
  },
  {
    id: 'eloquent',
    name: 'Eloquent',
    value: 'eloquent',
    description: 'Mobile-first Bootstrap-based theme',
    category: 'modern',
    features: ['Mobile-first', 'Bootstrap', 'Responsive', 'Clean'],
    previewImage: '/themes/eloquent-preview.svg',
    color: '#06B6D4',
    npm: 'jsonresume-theme-eloquent',
  },
  {
    id: 'kendall',
    name: 'Kendall',
    value: 'kendall',
    description: 'Simple and elegant with great typography',
    category: 'minimal',
    features: ['Simple', 'Typography', 'Minimal', 'Professional'],
    previewImage: '/themes/kendall-preview.svg',
    color: '#64748B',
    npm: 'jsonresume-theme-kendall',
  },
  {
    id: 'spartacus',
    name: 'Spartacus',
    value: 'spartacus',
    description: 'Bold and powerful design for strong profiles',
    category: 'creative',
    features: ['Bold', 'Powerful', 'Eye-catching', 'Strong'],
    previewImage: '/themes/spartacus-preview.svg',
    color: '#EF4444',
    npm: 'jsonresume-theme-spartacus',
  },
]

// Get theme by value
export function getThemeByValue(value: string | null): ResumeTheme | undefined {
  return RESUME_THEMES.find(theme => theme.value === value)
}

// Get themes by category
export function getThemesByCategory(category: ResumeTheme['category']): ResumeTheme[] {
  return RESUME_THEMES.filter(theme => theme.category === category)
}

// Get default theme
export function getDefaultTheme(): ResumeTheme {
  return RESUME_THEMES[0] // JobFoxy Default
}
