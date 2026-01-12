// lib/pdf/types.ts
// Type definitions for React-PDF rendering

import { ParsedResume } from '@/lib/types/resume'

// Simplified design settings using presets
export type MarginPreset = 'compact' | 'normal' | 'spacious'
export type FontSizePreset = 'small' | 'normal' | 'large'
export type SpacingPreset = 'compact' | 'normal' | 'relaxed'
export type HeadingStyle = 'bold' | 'caps' | 'underline'
export type PaperSize = 'a4' | 'letter'

// React-PDF fonts (built-in + custom registered)
export type FontFamily =
  // Built-in fonts
  | 'helvetica'
  | 'times'
  | 'courier'
  // Custom fonts (registered from /public/fonts/)
  | 'inter'
  | 'roboto'
  | 'open-sans'
  | 'lato'
  | 'merriweather'
  | 'source-sans'
  | 'oswald'
  | 'raleway'
  | 'eb-garamond'
  | 'playfair'

// Page number position options
export type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-right'

export type TemplateId =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'professional'
  | 'compact'
  | 'creative'
  | 'elegant'

export type SectionKey =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'languages'
  | 'volunteer'
  | 'publications'

// Color presets
export interface ColorPreset {
  id: string
  name: string
  primary: string
  accent: string
  text: string
  muted: string
  background: string
}

// Section display settings
export interface SectionDisplaySettings {
  enabled: boolean
  customTitle?: string
  columns?: 1 | 2 | 3 // For skills section
}

// Custom font sizes (overrides preset)
export interface CustomFontSizes {
  name: number   // Name/header (16-48pt)
  section: number // Section headings (10-18pt)
  body: number    // Body text (8-14pt)
}

// Custom margins (overrides preset, in points - 72pt = 1 inch)
export interface CustomMargins {
  top: number
  right: number
  bottom: number
  left: number
}

// Custom spacing (overrides preset, in points)
export interface CustomSpacing {
  section: number  // Space between sections (8-24pt)
  item: number     // Space between items within section (4-16pt)
}

// Header alignment
export type HeaderAlignment = 'left' | 'center'

// Simplified resume design (using presets)
export interface ResumeDesign {
  // Template
  templateId: TemplateId

  // Page
  paperSize: PaperSize
  margins: MarginPreset
  customMargins?: CustomMargins // Custom margins (overrides preset)

  // Typography
  fontFamily: FontFamily
  fontSize: FontSizePreset
  headingStyle: HeadingStyle
  customFontSizes?: CustomFontSizes // Custom font sizes (overrides preset)
  lineHeight?: number // Line spacing multiplier (1.0, 1.15, 1.3, 1.5, 2.0)
  headerAlignment?: HeaderAlignment // Header/name alignment

  // Colors
  colorPresetId: string
  customAccentColor?: string

  // Layout
  sectionSpacing: SpacingPreset
  customSpacing?: CustomSpacing // Custom spacing (overrides preset)

  // Date format
  dateFormat: 'MM/YYYY' | 'Month Year' | 'Mon YYYY' | 'YYYY'

  // Section configuration
  sectionOrder: SectionKey[]
  sectionSettings: Record<SectionKey, SectionDisplaySettings>

  // Page numbers
  showPageNumbers?: boolean
  pageNumberPosition?: PageNumberPosition
}

// Props for PDF templates
export interface TemplateProps {
  data: ParsedResume
  design: ResumeDesign
}

// Computed styles from design presets
export interface ComputedStyles {
  page: {
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
  }
  fonts: {
    name: number
    section: number
    body: number
    small: number
  }
  spacing: {
    section: number
    item: number
    bullet: number
  }
  colors: ColorPreset
}

// Default design settings
export const DEFAULT_DESIGN: ResumeDesign = {
  templateId: 'classic',
  paperSize: 'letter',
  margins: 'normal',
  fontFamily: 'helvetica',
  fontSize: 'normal',
  headingStyle: 'bold',
  lineHeight: 1.15,
  headerAlignment: 'center',
  colorPresetId: 'professional',
  sectionSpacing: 'normal',
  dateFormat: 'Month Year',
  sectionOrder: [
    'contact',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'languages',
    'volunteer',
    'publications',
  ],
  sectionSettings: {
    contact: { enabled: true },
    summary: { enabled: true },
    experience: { enabled: true },
    education: { enabled: true },
    skills: { enabled: true, columns: 2 },
    projects: { enabled: true },
    certifications: { enabled: true },
    awards: { enabled: true },
    languages: { enabled: true },
    volunteer: { enabled: true },
    publications: { enabled: true },
  },
}
