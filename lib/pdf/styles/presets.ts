// lib/pdf/styles/presets.ts
// Design presets for React-PDF rendering

import {
  MarginPreset,
  FontSizePreset,
  SpacingPreset,
  ColorPreset,
  PaperSize,
} from '../types'

// Margin presets (in points, 72pt = 1 inch)
export const MARGIN_PRESETS: Record<MarginPreset, { top: number; right: number; bottom: number; left: number }> = {
  compact: { top: 36, right: 36, bottom: 36, left: 36 }, // 0.5 inch
  normal: { top: 48, right: 48, bottom: 48, left: 48 },   // 0.67 inch
  spacious: { top: 60, right: 60, bottom: 60, left: 60 }, // 0.83 inch
}

// Font size presets (in points)
export const FONT_SIZE_PRESETS: Record<FontSizePreset, { name: number; section: number; body: number; small: number }> = {
  small: { name: 18, section: 11, body: 9, small: 8 },
  normal: { name: 22, section: 12, body: 10, small: 9 },
  large: { name: 26, section: 14, body: 11, small: 10 },
}

// Section spacing presets (in points)
export const SPACING_PRESETS: Record<SpacingPreset, { section: number; item: number; bullet: number }> = {
  compact: { section: 12, item: 6, bullet: 2 },
  normal: { section: 16, item: 8, bullet: 3 },
  relaxed: { section: 20, item: 10, bullet: 4 },
}

// Paper size dimensions (in points)
export const PAPER_SIZES: Record<PaperSize, { width: number; height: number }> = {
  letter: { width: 612, height: 792 },   // 8.5 x 11 inches
  a4: { width: 595.28, height: 841.89 }, // 210 x 297 mm
}

// Color presets
export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'professional',
    name: 'Professional',
    primary: '#1a1a2e',
    accent: '#4a5568',
    text: '#1a202c',
    muted: '#718096',
    background: '#ffffff',
  },
  {
    id: 'modern',
    name: 'Modern',
    primary: '#2d3748',
    accent: '#4299e1',
    text: '#1a202c',
    muted: '#718096',
    background: '#ffffff',
  },
  {
    id: 'bold',
    name: 'Bold',
    primary: '#1e40af',
    accent: '#3b82f6',
    text: '#1e293b',
    muted: '#64748b',
    background: '#ffffff',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primary: '#000000',
    accent: '#525252',
    text: '#171717',
    muted: '#737373',
    background: '#ffffff',
  },
  {
    id: 'creative',
    name: 'Creative',
    primary: '#7c3aed',
    accent: '#8b5cf6',
    text: '#1e1b4b',
    muted: '#6366f1',
    background: '#ffffff',
  },
  {
    id: 'warm',
    name: 'Warm',
    primary: '#9a3412',
    accent: '#ea580c',
    text: '#1c1917',
    muted: '#78716c',
    background: '#ffffff',
  },
]

// Get color preset by ID
export function getColorPreset(id: string): ColorPreset {
  return COLOR_PRESETS.find(p => p.id === id) || COLOR_PRESETS[0]
}

// Font family mappings for React-PDF
// Maps FontFamily type values to actual registered font names
export const FONT_FAMILY_MAP: Record<string, string> = {
  // Built-in fonts (no registration needed)
  helvetica: 'Helvetica',
  times: 'Times-Roman',
  courier: 'Courier',
  // Custom fonts (registered from /public/fonts/)
  inter: 'Inter',
  roboto: 'Roboto',
  'open-sans': 'Open Sans',
  lato: 'Lato',
  merriweather: 'Merriweather',
  'source-sans': 'Source Sans Pro',
  oswald: 'Oswald',
  raleway: 'Raleway',
  'eb-garamond': 'EB Garamond',
  playfair: 'Playfair Display',
}

// Get font family name for React-PDF
export function getFontFamily(family: string): string {
  return FONT_FAMILY_MAP[family] || 'Helvetica'
}
