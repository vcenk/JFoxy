// lib/utils/resumeNormalizer.ts
// Normalizes parsed resume data to ensure all entries have IDs and enabled flags

import {
  ParsedResume,
  ExperienceEntry,
  EducationEntry,
  SkillsData,
  SkillCategory,
  LanguageEntry,
  CertificationEntry,
  ProjectEntry,
  AwardEntry,
  VolunteerEntry,
  PublicationEntry,
  BulletItem
} from '@/lib/types/resume'
import { plainTextToJSON } from './richTextHelpers'

/**
 * Generate a unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Normalize a bullet item - handle string, JSONContent, and BulletItem formats
 */
function normalizeBullet(bullet: any, index: number): BulletItem {
  // Handle string bullets
  if (typeof bullet === 'string') {
    return {
      id: generateId('bullet'),
      enabled: true,
      content: plainTextToJSON(bullet),
    }
  }

  // Handle JSONContent format (from parsing engine)
  // JSONContent has { type: "doc", content: [...] }
  if (bullet && bullet.type === 'doc') {
    return {
      id: generateId('bullet'),
      enabled: true,
      content: bullet, // The whole object is the JSONContent
    }
  }

  // Handle BulletItem format (already normalized)
  // BulletItem has { id, enabled, content }
  if (bullet && bullet.content) {
    // Check if content is JSONContent or needs conversion
    const content = bullet.content.type === 'doc'
      ? bullet.content
      : plainTextToJSON(typeof bullet.content === 'string' ? bullet.content : '')

    return {
      id: bullet.id || generateId('bullet'),
      enabled: bullet.enabled !== false,
      content,
    }
  }

  // Fallback - create empty bullet
  return {
    id: generateId('bullet'),
    enabled: true,
    content: plainTextToJSON(''),
  }
}

/**
 * Normalize experience entries
 */
function normalizeExperience(experience: any[]): ExperienceEntry[] {
  if (!Array.isArray(experience)) return []

  return experience.map((exp, index) => ({
    id: exp.id || generateId('exp'),
    enabled: exp.enabled !== false,
    company: exp.company || '',
    companyEnabled: exp.companyEnabled !== false,
    position: exp.position || '',
    positionEnabled: exp.positionEnabled !== false,
    location: exp.location || '',
    locationEnabled: exp.locationEnabled !== false,
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    current: exp.current || false,
    dateEnabled: exp.dateEnabled !== false,
    bullets: Array.isArray(exp.bullets)
      ? exp.bullets.map(normalizeBullet)
      : [],
  }))
}

/**
 * Normalize education entries
 */
function normalizeEducation(education: any[]): EducationEntry[] {
  if (!Array.isArray(education)) return []

  return education.map((edu, index) => ({
    id: edu.id || generateId('edu'),
    enabled: edu.enabled !== false,
    institution: edu.institution || '',
    institutionEnabled: edu.institutionEnabled !== false,
    degree: edu.degree || '',
    degreeEnabled: edu.degreeEnabled !== false,
    field: edu.field || '',
    fieldEnabled: edu.fieldEnabled !== false,
    graduationDate: edu.graduationDate || '',
    dateEnabled: edu.dateEnabled !== false,
    gpa: edu.gpa || '',
    gpaEnabled: edu.gpaEnabled !== false,
  }))
}

/**
 * Normalize skills - convert string arrays to SkillCategory arrays
 */
function normalizeSkills(skills: any): SkillsData {
  if (!skills) return { technical: [], soft: [], other: [] }

  const normalizeSkillArray = (arr: any[]): SkillCategory[] => {
    if (!Array.isArray(arr)) return []

    return arr.map((skill, index) => {
      if (typeof skill === 'string') {
        return {
          id: generateId('skill'),
          enabled: true,
          name: skill,
        }
      }
      // Already an object
      return {
        id: skill.id || generateId('skill'),
        enabled: skill.enabled !== false,
        name: skill.name || '',
      }
    })
  }

  return {
    technical: normalizeSkillArray(skills.technical),
    soft: normalizeSkillArray(skills.soft),
    other: normalizeSkillArray(skills.other),
    // Keep legacy arrays if they exist (for backwards compatibility)
    technicalLegacy: undefined,
    softLegacy: undefined,
    otherLegacy: undefined,
  }
}

/**
 * Normalize language entries
 */
function normalizeLanguages(languages: any[]): LanguageEntry[] {
  if (!Array.isArray(languages)) return []

  return languages.map((lang, index) => ({
    id: lang.id || generateId('lang'),
    enabled: lang.enabled !== false,
    language: lang.language || '',
    fluency: lang.fluency || '',
    fluencyEnabled: lang.fluencyEnabled !== false,
  }))
}

/**
 * Normalize certification entries
 */
function normalizeCertifications(certs: any[]): CertificationEntry[] {
  if (!Array.isArray(certs)) return []

  return certs.map((cert, index) => ({
    id: cert.id || generateId('cert'),
    enabled: cert.enabled !== false,
    name: cert.name || '',
    nameEnabled: cert.nameEnabled !== false,
    issuer: cert.issuer || '',
    issuerEnabled: cert.issuerEnabled !== false,
    date: cert.date || '',
    dateEnabled: cert.dateEnabled !== false,
  }))
}

/**
 * Normalize project entries
 */
function normalizeProjects(projects: any[]): ProjectEntry[] {
  if (!Array.isArray(projects)) return []

  return projects.map((proj, index) => ({
    id: proj.id || generateId('proj'),
    enabled: proj.enabled !== false,
    name: proj.name || '',
    nameEnabled: proj.nameEnabled !== false,
    description: proj.description || '',
    descriptionEnabled: proj.descriptionEnabled !== false,
    technologies: proj.technologies || [],
    technologiesEnabled: proj.technologiesEnabled !== false,
    link: proj.link || '',
    linkEnabled: proj.linkEnabled !== false,
    bullets: Array.isArray(proj.bullets)
      ? proj.bullets.map(normalizeBullet)
      : [],
  }))
}

/**
 * Normalize award entries
 */
function normalizeAwards(awards: any[]): AwardEntry[] {
  if (!Array.isArray(awards)) return []

  return awards.map((award, index) => ({
    id: award.id || generateId('award'),
    enabled: award.enabled !== false,
    title: award.title || '',
    titleEnabled: award.titleEnabled !== false,
    date: award.date || '',
    dateEnabled: award.dateEnabled !== false,
    issuer: award.issuer || '',
    issuerEnabled: award.issuerEnabled !== false,
    description: award.description || '',
    descriptionEnabled: award.descriptionEnabled !== false,
  }))
}

/**
 * Normalize volunteer entries
 */
function normalizeVolunteer(volunteer: any[]): VolunteerEntry[] {
  if (!Array.isArray(volunteer)) return []

  return volunteer.map((vol, index) => ({
    id: vol.id || generateId('vol'),
    enabled: vol.enabled !== false,
    organization: vol.organization || '',
    organizationEnabled: vol.organizationEnabled !== false,
    role: vol.role || '',
    roleEnabled: vol.roleEnabled !== false,
    startDate: vol.startDate || '',
    endDate: vol.endDate || '',
    current: vol.current || false,
    dateEnabled: vol.dateEnabled !== false,
    description: vol.description || '',
    descriptionEnabled: vol.descriptionEnabled !== false,
    bullets: Array.isArray(vol.bullets)
      ? vol.bullets.map(normalizeBullet)
      : [],
  }))
}

/**
 * Normalize publication entries
 */
function normalizePublications(pubs: any[]): PublicationEntry[] {
  if (!Array.isArray(pubs)) return []

  return pubs.map((pub, index) => ({
    id: pub.id || generateId('pub'),
    enabled: pub.enabled !== false,
    title: pub.title || '',
    titleEnabled: pub.titleEnabled !== false,
    publisher: pub.publisher || '',
    publisherEnabled: pub.publisherEnabled !== false,
    date: pub.date || '',
    dateEnabled: pub.dateEnabled !== false,
    link: pub.link || '',
    linkEnabled: pub.linkEnabled !== false,
    description: pub.description || '',
    descriptionEnabled: pub.descriptionEnabled !== false,
  }))
}

/**
 * Normalize a parsed resume to ensure all entries have IDs and enabled flags
 * This handles data from the parsing engine which may have simple formats
 */
export function normalizeResume(parsed: any): ParsedResume {
  if (!parsed) {
    return getEmptyResume()
  }

  return {
    contact: {
      name: parsed.contact?.name || '',
      nameEnabled: parsed.contact?.nameEnabled !== false,
      firstName: parsed.contact?.firstName || '',
      lastName: parsed.contact?.lastName || '',
      email: parsed.contact?.email || '',
      emailEnabled: parsed.contact?.emailEnabled !== false,
      phone: parsed.contact?.phone || '',
      phoneEnabled: parsed.contact?.phoneEnabled !== false,
      location: parsed.contact?.location || '',
      locationEnabled: parsed.contact?.locationEnabled !== false,
      linkedin: parsed.contact?.linkedin || '',
      linkedinEnabled: parsed.contact?.linkedinEnabled !== false,
      github: parsed.contact?.github || '',
      githubEnabled: parsed.contact?.githubEnabled !== false,
      portfolio: parsed.contact?.portfolio || '',
      portfolioEnabled: parsed.contact?.portfolioEnabled !== false,
    },
    targetTitle: parsed.targetTitle || '',
    targetTitleEnabled: parsed.targetTitleEnabled !== false,
    summary: parsed.summary || undefined,
    summaryEnabled: parsed.summaryEnabled !== false,
    experience: normalizeExperience(parsed.experience || []),
    education: normalizeEducation(parsed.education || []),
    skills: normalizeSkills(parsed.skills),
    languages: normalizeLanguages(parsed.languages || []),
    certifications: normalizeCertifications(parsed.certifications || []),
    projects: normalizeProjects(parsed.projects || []),
    awards: normalizeAwards(parsed.awards || []),
    volunteer: normalizeVolunteer(parsed.volunteer || []),
    publications: normalizePublications(parsed.publications || []),
  }
}

/**
 * Get an empty resume with proper structure
 */
export function getEmptyResume(): ParsedResume {
  return {
    contact: {
      name: '',
      nameEnabled: true,
      email: '',
      emailEnabled: true,
      phone: '',
      phoneEnabled: true,
      location: '',
      locationEnabled: true,
      linkedin: '',
      linkedinEnabled: true,
      github: '',
      githubEnabled: true,
      portfolio: '',
      portfolioEnabled: true,
    },
    targetTitle: '',
    targetTitleEnabled: true,
    summary: undefined,
    summaryEnabled: true,
    experience: [],
    education: [],
    skills: { technical: [], soft: [], other: [] },
    languages: [],
    certifications: [],
    projects: [],
    awards: [],
    volunteer: [],
    publications: [],
  }
}
