// lib/data/colorPresets.ts
// Professional color preset library for resume templates

export interface ColorPreset {
  id: string
  name: string
  accentColor: string
  secondaryColor: string
  category: 'professional' | 'modern' | 'creative' | 'minimal'
}

export const COLOR_PRESETS: ColorPreset[] = [
  // Professional Blues
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    accentColor: '#2563EB',
    secondaryColor: '#1E40AF',
    category: 'professional',
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    accentColor: '#1E3A5F',
    secondaryColor: '#0F2942',
    category: 'professional',
  },
  {
    id: 'trustworthy-teal',
    name: 'Trustworthy Teal',
    accentColor: '#0D9488',
    secondaryColor: '#0F766E',
    category: 'professional',
  },

  // Modern Purples
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    accentColor: '#7C3AED',
    secondaryColor: '#5B21B6',
    category: 'modern',
  },
  {
    id: 'jobfoxy-violet',
    name: 'JobFoxy Violet',
    accentColor: '#6C47FF',
    secondaryColor: '#5236CC',
    category: 'modern',
  },
  {
    id: 'elegant-indigo',
    name: 'Elegant Indigo',
    accentColor: '#4F46E5',
    secondaryColor: '#3730A3',
    category: 'modern',
  },

  // Greens
  {
    id: 'elegant-green',
    name: 'Elegant Green',
    accentColor: '#059669',
    secondaryColor: '#047857',
    category: 'professional',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    accentColor: '#166534',
    secondaryColor: '#14532D',
    category: 'professional',
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    accentColor: '#10B981',
    secondaryColor: '#059669',
    category: 'modern',
  },

  // Neutrals
  {
    id: 'classic-gray',
    name: 'Classic Gray',
    accentColor: '#374151',
    secondaryColor: '#1F2937',
    category: 'minimal',
  },
  {
    id: 'slate-professional',
    name: 'Slate Professional',
    accentColor: '#475569',
    secondaryColor: '#334155',
    category: 'minimal',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    accentColor: '#27272A',
    secondaryColor: '#18181B',
    category: 'minimal',
  },

  // Warm Colors
  {
    id: 'warm-orange',
    name: 'Warm Orange',
    accentColor: '#EA580C',
    secondaryColor: '#C2410C',
    category: 'creative',
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    accentColor: '#C2410C',
    secondaryColor: '#9A3412',
    category: 'creative',
  },
  {
    id: 'amber-gold',
    name: 'Amber Gold',
    accentColor: '#D97706',
    secondaryColor: '#B45309',
    category: 'creative',
  },

  // Reds
  {
    id: 'bold-red',
    name: 'Bold Red',
    accentColor: '#DC2626',
    secondaryColor: '#B91C1C',
    category: 'creative',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    accentColor: '#881337',
    secondaryColor: '#701A28',
    category: 'professional',
  },
  {
    id: 'rose-professional',
    name: 'Rose Professional',
    accentColor: '#BE123C',
    secondaryColor: '#9F1239',
    category: 'creative',
  },

  // Cool Colors
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    accentColor: '#0284C7',
    secondaryColor: '#0369A1',
    category: 'modern',
  },
  {
    id: 'cyan-tech',
    name: 'Cyan Tech',
    accentColor: '#0891B2',
    secondaryColor: '#0E7490',
    category: 'modern',
  },
]

// Get preset by ID
export function getColorPreset(id: string): ColorPreset | undefined {
  return COLOR_PRESETS.find(preset => preset.id === id)
}

// Get presets by category
export function getPresetsByCategory(category: ColorPreset['category']): ColorPreset[] {
  return COLOR_PRESETS.filter(preset => preset.category === category)
}

// Group presets by category
export function getGroupedPresets(): Record<ColorPreset['category'], ColorPreset[]> {
  return {
    professional: getPresetsByCategory('professional'),
    modern: getPresetsByCategory('modern'),
    creative: getPresetsByCategory('creative'),
    minimal: getPresetsByCategory('minimal'),
  }
}
