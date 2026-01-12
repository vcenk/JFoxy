// lib/utils/dataMigration.ts
// Utility to migrate legacy resume data to new granular toggle format

import { v4 as uuidv4 } from 'uuid'
import {
  ParsedResume,
  LegacyParsedResume,
  ExperienceEntry,
  EducationEntry,
  LanguageEntry,
  CertificationEntry,
  ProjectEntry,
  AwardEntry,
  VolunteerEntry,
  PublicationEntry,
  BulletItem,
  SkillCategory,
  ContactInfo,
  RichText,
} from '@/lib/types/resume'

// Generate a unique ID
function generateId(prefix: string, index: number): string {
  return `${prefix}-${index}-${uuidv4().slice(0, 8)}`
}

// Check if data is already in new format
function isNewFormat(data: any): data is ParsedResume {
  if (!data) return false

  // Check if experience entries have id field
  if (data.experience && data.experience.length > 0) {
    return typeof data.experience[0].id === 'string'
  }

  // Check if education entries have id field
  if (data.education && data.education.length > 0) {
    return typeof data.education[0].id === 'string'
  }

  // If no experience or education, check skills format
  if (data.skills?.technical) {
    if (Array.isArray(data.skills.technical) && data.skills.technical.length > 0) {
      return typeof data.skills.technical[0] === 'object' && 'id' in data.skills.technical[0]
    }
  }

  // Default to assuming it's new format if there's no data to check
  return true
}

// Migrate contact info
function migrateContact(contact: any): ContactInfo {
  if (!contact) {
    return {}
  }

  return {
    name: contact.name,
    nameEnabled: true,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    emailEnabled: true,
    phone: contact.phone,
    phoneEnabled: true,
    location: contact.location,
    locationEnabled: true,
    linkedin: contact.linkedin,
    linkedinEnabled: true,
    github: contact.github,
    githubEnabled: true,
    portfolio: contact.portfolio,
    portfolioEnabled: true,
  }
}

// Migrate a single bullet (RichText or string) to BulletItem
function migrateBullet(bullet: RichText | string, prefix: string, index: number): BulletItem {
  let content: RichText

  if (typeof bullet === 'string') {
    // Convert plain string to TipTap JSON format
    content = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: bullet ? [{ type: 'text', text: bullet }] : [],
        },
      ],
    }
  } else {
    content = bullet
  }

  return {
    id: generateId(`${prefix}-bullet`, index),
    enabled: true,
    content,
  }
}

// Migrate experience entries
function migrateExperience(experience: any[]): ExperienceEntry[] {
  if (!experience || !Array.isArray(experience)) {
    return []
  }

  return experience.map((exp, index) => ({
    id: generateId('exp', index),
    enabled: true,
    company: exp.company || '',
    companyEnabled: true,
    position: exp.position || '',
    positionEnabled: true,
    location: exp.location,
    locationEnabled: true,
    startDate: exp.startDate,
    endDate: exp.endDate,
    current: exp.current,
    dateEnabled: true,
    bullets: (exp.bullets || []).map((b: any, bi: number) =>
      migrateBullet(b, `exp-${index}`, bi)
    ),
  }))
}

// Migrate education entries
function migrateEducation(education: any[]): EducationEntry[] {
  if (!education || !Array.isArray(education)) {
    return []
  }

  return education.map((edu, index) => ({
    id: generateId('edu', index),
    enabled: true,
    institution: edu.institution || '',
    institutionEnabled: true,
    degree: edu.degree || '',
    degreeEnabled: true,
    field: edu.field,
    fieldEnabled: true,
    graduationDate: edu.graduationDate,
    dateEnabled: true,
    gpa: edu.gpa,
    gpaEnabled: true,
  }))
}

// Migrate skills from string array to SkillCategory array
function migrateSkills(skills: any): {
  technical?: SkillCategory[]
  soft?: SkillCategory[]
  other?: SkillCategory[]
} {
  if (!skills) {
    return {}
  }

  const migrateSkillArray = (arr: string[] | undefined, prefix: string): SkillCategory[] | undefined => {
    if (!arr || !Array.isArray(arr)) return undefined
    return arr.map((skill, index) => ({
      id: generateId(`skill-${prefix}`, index),
      enabled: true,
      name: typeof skill === 'string' ? skill : (skill as any).name || '',
    }))
  }

  return {
    technical: migrateSkillArray(skills.technical, 'tech'),
    soft: migrateSkillArray(skills.soft, 'soft'),
    other: migrateSkillArray(skills.other, 'other'),
  }
}

// Migrate language entries
function migrateLanguages(languages: any[]): LanguageEntry[] | undefined {
  if (!languages || !Array.isArray(languages)) {
    return undefined
  }

  return languages.map((lang, index) => ({
    id: generateId('lang', index),
    enabled: true,
    language: lang.language || '',
    fluency: lang.fluency,
    fluencyEnabled: true,
  }))
}

// Migrate certification entries
function migrateCertifications(certifications: any[]): CertificationEntry[] | undefined {
  if (!certifications || !Array.isArray(certifications)) {
    return undefined
  }

  return certifications.map((cert, index) => ({
    id: generateId('cert', index),
    enabled: true,
    name: cert.name || '',
    nameEnabled: true,
    issuer: cert.issuer,
    issuerEnabled: true,
    date: cert.date,
    dateEnabled: true,
  }))
}

// Migrate project entries
function migrateProjects(projects: any[]): ProjectEntry[] | undefined {
  if (!projects || !Array.isArray(projects)) {
    return undefined
  }

  return projects.map((proj, index) => ({
    id: generateId('proj', index),
    enabled: true,
    name: proj.name || '',
    nameEnabled: true,
    description: proj.description || '',
    descriptionEnabled: true,
    technologies: proj.technologies,
    technologiesEnabled: true,
    link: proj.link,
    linkEnabled: true,
    bullets: proj.bullets?.map((b: any, bi: number) =>
      migrateBullet(b, `proj-${index}`, bi)
    ),
  }))
}

// Migrate award entries
function migrateAwards(awards: any[]): AwardEntry[] | undefined {
  if (!awards || !Array.isArray(awards)) {
    return undefined
  }

  return awards.map((award, index) => ({
    id: generateId('award', index),
    enabled: true,
    title: award.title || '',
    titleEnabled: true,
    date: award.date,
    dateEnabled: true,
    issuer: award.issuer,
    issuerEnabled: true,
    description: award.description,
    descriptionEnabled: true,
  }))
}

// Migrate volunteer entries
function migrateVolunteer(volunteer: any[]): VolunteerEntry[] | undefined {
  if (!volunteer || !Array.isArray(volunteer)) {
    return undefined
  }

  return volunteer.map((vol, index) => ({
    id: generateId('vol', index),
    enabled: true,
    organization: vol.organization || '',
    organizationEnabled: true,
    role: vol.role || '',
    roleEnabled: true,
    startDate: vol.startDate,
    endDate: vol.endDate,
    current: vol.current,
    dateEnabled: true,
    description: vol.description,
    descriptionEnabled: true,
    bullets: vol.bullets?.map((b: any, bi: number) =>
      migrateBullet(b, `vol-${index}`, bi)
    ),
  }))
}

// Migrate publication entries
function migratePublications(publications: any[]): PublicationEntry[] | undefined {
  if (!publications || !Array.isArray(publications)) {
    return undefined
  }

  return publications.map((pub, index) => ({
    id: generateId('pub', index),
    enabled: true,
    title: pub.title || '',
    titleEnabled: true,
    publisher: pub.publisher,
    publisherEnabled: true,
    date: pub.date,
    dateEnabled: true,
    link: pub.link,
    linkEnabled: true,
    description: pub.description,
    descriptionEnabled: true,
  }))
}

/**
 * Main migration function
 * Converts legacy resume data format to new format with granular toggles
 * If data is already in new format, returns it as-is
 */
export function migrateResumeData(data: any): ParsedResume {
  // Return as-is if already in new format
  if (isNewFormat(data)) {
    return data as ParsedResume
  }

  const legacy = data as LegacyParsedResume

  return {
    contact: migrateContact(legacy.contact),
    targetTitle: legacy.targetTitle,
    targetTitleEnabled: true,
    summary: legacy.summary,
    summaryEnabled: true,
    experience: migrateExperience(legacy.experience),
    education: migrateEducation(legacy.education),
    skills: migrateSkills(legacy.skills),
    languages: migrateLanguages(legacy.languages || []),
    certifications: migrateCertifications(legacy.certifications || []),
    projects: migrateProjects(legacy.projects || []),
    awards: migrateAwards(legacy.awards || []),
    volunteer: migrateVolunteer(legacy.volunteer || []),
    publications: migratePublications(legacy.publications || []),
  }
}

/**
 * Create an empty resume with proper IDs
 */
export function createEmptyResume(): ParsedResume {
  return {
    contact: {
      nameEnabled: true,
      emailEnabled: true,
      phoneEnabled: true,
      locationEnabled: true,
      linkedinEnabled: true,
      githubEnabled: true,
      portfolioEnabled: true,
    },
    targetTitle: '',
    targetTitleEnabled: true,
    summary: undefined,
    summaryEnabled: true,
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      other: [],
    },
    languages: [],
    certifications: [],
    projects: [],
    awards: [],
    volunteer: [],
    publications: [],
  }
}

/**
 * Add a new experience entry with proper ID
 */
export function createExperienceEntry(index?: number): ExperienceEntry {
  return {
    id: generateId('exp', index ?? Date.now()),
    enabled: true,
    company: '',
    companyEnabled: true,
    position: '',
    positionEnabled: true,
    location: '',
    locationEnabled: true,
    startDate: '',
    endDate: '',
    current: false,
    dateEnabled: true,
    bullets: [],
  }
}

/**
 * Add a new bullet to an experience
 */
export function createBulletItem(prefix: string, index?: number): BulletItem {
  return {
    id: generateId(`${prefix}-bullet`, index ?? Date.now()),
    enabled: true,
    content: {
      type: 'doc',
      content: [{ type: 'paragraph', content: [] }],
    },
  }
}

/**
 * Add a new education entry with proper ID
 */
export function createEducationEntry(index?: number): EducationEntry {
  return {
    id: generateId('edu', index ?? Date.now()),
    enabled: true,
    institution: '',
    institutionEnabled: true,
    degree: '',
    degreeEnabled: true,
    field: '',
    fieldEnabled: true,
    graduationDate: '',
    dateEnabled: true,
    gpa: '',
    gpaEnabled: true,
  }
}

/**
 * Add a new skill entry
 */
export function createSkillEntry(category: 'technical' | 'soft' | 'other', name: string = ''): SkillCategory {
  return {
    id: generateId(`skill-${category}`, Date.now()),
    enabled: true,
    name,
  }
}

/**
 * Add a new project entry
 */
export function createProjectEntry(index?: number): ProjectEntry {
  return {
    id: generateId('proj', index ?? Date.now()),
    enabled: true,
    name: '',
    nameEnabled: true,
    description: '',
    descriptionEnabled: true,
    technologies: [],
    technologiesEnabled: true,
    link: '',
    linkEnabled: true,
    bullets: [],
  }
}

/**
 * Add a new certification entry
 */
export function createCertificationEntry(index?: number): CertificationEntry {
  return {
    id: generateId('cert', index ?? Date.now()),
    enabled: true,
    name: '',
    nameEnabled: true,
    issuer: '',
    issuerEnabled: true,
    date: '',
    dateEnabled: true,
  }
}

/**
 * Add a new award entry
 */
export function createAwardEntry(index?: number): AwardEntry {
  return {
    id: generateId('award', index ?? Date.now()),
    enabled: true,
    title: '',
    titleEnabled: true,
    date: '',
    dateEnabled: true,
    issuer: '',
    issuerEnabled: true,
    description: '',
    descriptionEnabled: true,
  }
}

/**
 * Add a new volunteer entry
 */
export function createVolunteerEntry(index?: number): VolunteerEntry {
  return {
    id: generateId('vol', index ?? Date.now()),
    enabled: true,
    organization: '',
    organizationEnabled: true,
    role: '',
    roleEnabled: true,
    startDate: '',
    endDate: '',
    current: false,
    dateEnabled: true,
    description: '',
    descriptionEnabled: true,
    bullets: [],
  }
}

/**
 * Add a new publication entry
 */
export function createPublicationEntry(index?: number): PublicationEntry {
  return {
    id: generateId('pub', index ?? Date.now()),
    enabled: true,
    title: '',
    titleEnabled: true,
    publisher: '',
    publisherEnabled: true,
    date: '',
    dateEnabled: true,
    link: '',
    linkEnabled: true,
    description: '',
    descriptionEnabled: true,
  }
}

/**
 * Add a new language entry
 */
export function createLanguageEntry(index?: number): LanguageEntry {
  return {
    id: generateId('lang', index ?? Date.now()),
    enabled: true,
    language: '',
    fluency: '',
    fluencyEnabled: true,
  }
}
