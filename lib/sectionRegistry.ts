// lib/sectionRegistry.ts
// Central registry for all resume section components

import { ComponentType } from 'react'

export type ResumeSectionKey =
  | 'contact'
  | 'targetTitle'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'volunteer'
  | 'publications'
  | 'languages'

export interface SectionComponentProps {
  isActive: boolean
  onClick: () => void
}

// Lazy-loaded section components will be registered here
export const SECTION_REGISTRY: Record<
  ResumeSectionKey,
  ComponentType<SectionComponentProps>
> = {} as any // Will be populated by section components

// Helper to register a section component
export function registerSection(
  key: ResumeSectionKey,
  component: ComponentType<SectionComponentProps>
) {
  SECTION_REGISTRY[key] = component
}

// Default section order
export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  'contact',
  'targetTitle',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'volunteer',
  'publications',
  'languages',
]

// Section metadata
export const SECTION_METADATA: Record<
  ResumeSectionKey,
  {
    title: string
    description: string
    icon: string
    category: 'header' | 'main' | 'sidebar'
  }
> = {
  contact: {
    title: 'Contact Information',
    description: 'Your name, email, phone, and links',
    icon: 'User',
    category: 'header',
  },
  targetTitle: {
    title: 'Target Title',
    description: 'Job title you are applying for',
    icon: 'Target',
    category: 'header',
  },
  summary: {
    title: 'Professional Summary',
    description: 'Brief overview of your professional background',
    icon: 'FileText',
    category: 'main',
  },
  experience: {
    title: 'Work Experience',
    description: 'Your professional work history',
    icon: 'Briefcase',
    category: 'main',
  },
  education: {
    title: 'Education',
    description: 'Your academic background',
    icon: 'GraduationCap',
    category: 'sidebar',
  },
  skills: {
    title: 'Skills',
    description: 'Technical skills, tools, and technologies',
    icon: 'Wrench',
    category: 'sidebar',
  },
  projects: {
    title: 'Projects',
    description: 'Notable projects you have worked on',
    icon: 'Code',
    category: 'sidebar',
  },
  certifications: {
    title: 'Certifications',
    description: 'Professional certifications and credentials',
    icon: 'Award',
    category: 'sidebar',
  },
  awards: {
    title: 'Awards & Honors',
    description: 'Recognition and achievements',
    icon: 'Trophy',
    category: 'sidebar',
  },
  volunteer: {
    title: 'Volunteer Experience',
    description: 'Community and volunteer work',
    icon: 'Heart',
    category: 'sidebar',
  },
  publications: {
    title: 'Publications',
    description: 'Research papers and articles',
    icon: 'BookOpen',
    category: 'sidebar',
  },
  languages: {
    title: 'Languages',
    description: 'Languages you speak',
    icon: 'Globe',
    category: 'sidebar',
  },
}
