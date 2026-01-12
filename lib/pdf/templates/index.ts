// lib/pdf/templates/index.ts
// Export all PDF templates

import { TemplateId, TemplateProps } from '../types'
import { ClassicTemplate } from './ClassicTemplate'
import { ModernTemplate } from './ModernTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { ProfessionalTemplate } from './ProfessionalTemplate'
import { CompactTemplate } from './CompactTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { ElegantTemplate } from './ElegantTemplate'

// Template registry
export const TEMPLATES: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
  professional: ProfessionalTemplate,
  compact: CompactTemplate,
  creative: CreativeTemplate,
  elegant: ElegantTemplate,
}

// Get template component by ID
export function getTemplateComponent(templateId: TemplateId): React.ComponentType<TemplateProps> {
  return TEMPLATES[templateId] || ClassicTemplate
}

// Template metadata for UI
export const TEMPLATE_METADATA: Record<TemplateId, { name: string; description: string; category: string }> = {
  classic: {
    name: 'Classic',
    description: 'Traditional single-column layout with clean typography.',
    category: 'Traditional',
  },
  modern: {
    name: 'Modern',
    description: 'Two-column layout with left sidebar for skills and contact.',
    category: 'Modern',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean, typography-focused design with minimal styling.',
    category: 'Traditional',
  },
  executive: {
    name: 'Executive',
    description: 'Bold header with right sidebar. Premium look for leaders.',
    category: 'Executive',
  },
  professional: {
    name: 'Professional',
    description: 'Clean layout with accent lines. ATS-optimized design.',
    category: 'Traditional',
  },
  compact: {
    name: 'Compact',
    description: 'Dense two-column layout to fit more content on one page.',
    category: 'Modern',
  },
  creative: {
    name: 'Creative',
    description: 'Bold header with accent boxes and modern card styling.',
    category: 'Creative',
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated design with refined typography and elegant dividers.',
    category: 'Executive',
  },
}

// Export all templates
export { ClassicTemplate } from './ClassicTemplate'
export { ModernTemplate } from './ModernTemplate'
export { MinimalTemplate } from './MinimalTemplate'
export { ExecutiveTemplate } from './ExecutiveTemplate'
export { ProfessionalTemplate } from './ProfessionalTemplate'
export { CompactTemplate } from './CompactTemplate'
export { CreativeTemplate } from './CreativeTemplate'
export { ElegantTemplate } from './ElegantTemplate'
