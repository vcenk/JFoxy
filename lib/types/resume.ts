// lib/types/resume.ts
import { JSONContent } from '@tiptap/core'

// Type alias for rich text fields (stored as Tiptap JSON)
export type RichText = JSONContent

// Bullet item with toggle support
export interface BulletItem {
  id: string
  enabled: boolean
  content: RichText
}

// Contact information with field-level toggles
export interface ContactInfo {
  name?: string
  nameEnabled?: boolean
  firstName?: string
  lastName?: string
  email?: string
  emailEnabled?: boolean
  phone?: string
  phoneEnabled?: boolean
  location?: string
  locationEnabled?: boolean
  linkedin?: string
  linkedinEnabled?: boolean
  github?: string
  githubEnabled?: boolean
  portfolio?: string
  portfolioEnabled?: boolean
}

// Experience entry with granular toggles
export interface ExperienceEntry {
  id: string
  enabled: boolean
  company: string
  companyEnabled?: boolean
  position: string
  positionEnabled?: boolean
  location?: string
  locationEnabled?: boolean
  startDate?: string
  endDate?: string
  current?: boolean
  dateEnabled?: boolean
  bullets: BulletItem[]
}

// Education entry with granular toggles
export interface EducationEntry {
  id: string
  enabled: boolean
  institution: string
  institutionEnabled?: boolean
  degree: string
  degreeEnabled?: boolean
  field?: string
  fieldEnabled?: boolean
  graduationDate?: string
  dateEnabled?: boolean
  gpa?: string
  gpaEnabled?: boolean
}

// Skills with category-level toggles
export interface SkillCategory {
  id: string
  enabled: boolean
  name: string
}

export interface SkillsData {
  technical?: SkillCategory[]
  soft?: SkillCategory[]
  other?: SkillCategory[]
  // Legacy support for string arrays
  technicalLegacy?: string[]
  softLegacy?: string[]
  otherLegacy?: string[]
}

// Language entry with toggles
export interface LanguageEntry {
  id: string
  enabled: boolean
  language: string
  fluency?: string
  fluencyEnabled?: boolean
}

// Certification entry with toggles
export interface CertificationEntry {
  id: string
  enabled: boolean
  name: string
  nameEnabled?: boolean
  issuer?: string
  issuerEnabled?: boolean
  date?: string
  dateEnabled?: boolean
}

// Project entry with toggles
export interface ProjectEntry {
  id: string
  enabled: boolean
  name: string
  nameEnabled?: boolean
  description: string
  descriptionEnabled?: boolean
  technologies?: string[]
  technologiesEnabled?: boolean
  link?: string
  linkEnabled?: boolean
  bullets?: BulletItem[]
}

// Award entry with toggles
export interface AwardEntry {
  id: string
  enabled: boolean
  title: string
  titleEnabled?: boolean
  date?: string
  dateEnabled?: boolean
  issuer?: string
  issuerEnabled?: boolean
  description?: string
  descriptionEnabled?: boolean
}

// Volunteer entry with toggles
export interface VolunteerEntry {
  id: string
  enabled: boolean
  organization: string
  organizationEnabled?: boolean
  role: string
  roleEnabled?: boolean
  startDate?: string
  endDate?: string
  current?: boolean
  dateEnabled?: boolean
  description?: string
  descriptionEnabled?: boolean
  bullets?: BulletItem[]
}

// Publication entry with toggles
export interface PublicationEntry {
  id: string
  enabled: boolean
  title: string
  titleEnabled?: boolean
  publisher?: string
  publisherEnabled?: boolean
  date?: string
  dateEnabled?: boolean
  link?: string
  linkEnabled?: boolean
  description?: string
  descriptionEnabled?: boolean
}

// Main ParsedResume type with granular toggle support
export interface ParsedResume {
  contact: ContactInfo
  targetTitle?: string
  targetTitleEnabled?: boolean
  summary?: RichText
  summaryEnabled?: boolean
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillsData
  languages?: LanguageEntry[]
  certifications?: CertificationEntry[]
  projects?: ProjectEntry[]
  awards?: AwardEntry[]
  volunteer?: VolunteerEntry[]
  publications?: PublicationEntry[]
}

// Legacy ParsedResume type for backward compatibility during migration
export interface LegacyParsedResume {
  contact: {
    name?: string
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  targetTitle?: string
  summary?: RichText
  experience: Array<{
    company: string
    position: string
    location?: string
    startDate?: string
    endDate?: string
    current?: boolean
    bullets: RichText[]
  }>
  education: Array<{
    institution: string
    degree: string
    field?: string
    graduationDate?: string
    gpa?: string
  }>
  skills: {
    technical?: string[]
    soft?: string[]
    other?: string[]
  }
  languages?: Array<{
    language: string
    fluency?: string
  }>
  certifications?: Array<{
    name: string
    issuer?: string
    date?: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies?: string[]
    link?: string
  }>
  awards?: Array<{
    title: string
    date?: string
    issuer?: string
    description?: string
  }>
  volunteer?: Array<{
    organization: string
    role: string
    startDate?: string
    endDate?: string
    current?: boolean
    description?: string
  }>
  publications?: Array<{
    title: string
    publisher?: string
    date?: string
    link?: string
    description?: string
  }>
}
