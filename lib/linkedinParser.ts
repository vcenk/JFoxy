// lib/linkedinParser.ts
// Parse LinkedIn profile data and convert to resume format

import { ParsedResume } from '@/lib/types/resume'
import { plainTextToJSON } from './utils/richTextHelpers'

interface LinkedInProfile {
  basics?: {
    name?: string
    label?: string
    email?: string
    phone?: string
    url?: string
    summary?: string
    location?: {
      city?: string
      countryCode?: string
      region?: string
    }
    profiles?: Array<{
      network?: string
      username?: string
      url?: string
    }>
  }
  work?: Array<{
    name?: string
    position?: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights?: string[]
  }>
  education?: Array<{
    institution?: string
    area?: string
    studyType?: string
    startDate?: string
    endDate?: string
    gpa?: string
  }>
  skills?: Array<{
    name?: string
    level?: string
    keywords?: string[]
  }>
  projects?: Array<{
    name?: string
    description?: string
    keywords?: string[]
    url?: string
  }>
  certificates?: Array<{
    name?: string
    issuer?: string
    date?: string
  }>
  awards?: Array<{
    title?: string
    date?: string
    awarder?: string
    summary?: string
  }>
  volunteer?: Array<{
    organization?: string
    position?: string
    startDate?: string
    endDate?: string
    summary?: string
  }>
  publications?: Array<{
    name?: string
    publisher?: string
    releaseDate?: string
    url?: string
  }>
  languages?: Array<{
    language?: string
    fluency?: string
  }>
}

/**
 * Parse LinkedIn profile JSON and convert to resume format
 */
export function parseLinkedInProfile(linkedinData: LinkedInProfile): ParsedResume {
  const resume: ParsedResume = {
    contact: {},
    experience: [],
    education: [],
    skills: {},
    summary: plainTextToJSON(''),
  }

  // Parse contact information
  if (linkedinData.basics) {
    const { basics } = linkedinData
    resume.contact = {
      name: basics.name || '',
      email: basics.email || '',
      phone: basics.phone || '',
      location: basics.location
        ? `${basics.location.city || ''}${basics.location.city && basics.location.region ? ', ' : ''}${basics.location.region || ''}`
        : '',
    }

    // Extract LinkedIn, GitHub, Portfolio from profiles
    if (basics.profiles && Array.isArray(basics.profiles)) {
      basics.profiles.forEach(profile => {
        const network = profile.network?.toLowerCase()
        if (network === 'linkedin') {
          resume.contact.linkedin = profile.url || ''
        } else if (network === 'github') {
          resume.contact.github = profile.url || ''
        } else if (network === 'portfolio' || network === 'website') {
          resume.contact.portfolio = profile.url || ''
        }
      })
    }

    // Parse summary
    if (basics.summary) {
      resume.summary = plainTextToJSON(basics.summary)
    }

    // Target title from label
    if (basics.label) {
      resume.targetTitle = basics.label
    }
  }

  // Parse work experience
  if (linkedinData.work && Array.isArray(linkedinData.work)) {
    resume.experience = linkedinData.work.map(job => ({
      company: job.name || '',
      position: job.position || '',
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      current: !job.endDate,
      bullets: job.highlights
        ? job.highlights.map(h => plainTextToJSON(h))
        : job.summary
        ? [plainTextToJSON(job.summary)]
        : [],
    }))
  }

  // Parse education
  if (linkedinData.education && Array.isArray(linkedinData.education)) {
    resume.education = linkedinData.education.map(edu => ({
      institution: edu.institution || '',
      degree: edu.studyType || '',
      field: edu.area || '',
      graduationDate: edu.endDate || '',
      gpa: edu.gpa || '',
    }))
  }

  // Parse skills
  if (linkedinData.skills && Array.isArray(linkedinData.skills)) {
    const technical: string[] = []
    const tools: string[] = []

    linkedinData.skills.forEach(skill => {
      if (skill.name) {
        // Simple heuristic: if skill has keywords, it might be technical
        if (skill.keywords && skill.keywords.length > 0) {
          technical.push(skill.name)
        } else {
          tools.push(skill.name)
        }
      }
    })

    resume.skills = {
      technical,
      tools: tools.length > 0 ? tools : undefined,
    }
  }

  // Parse projects
  if (linkedinData.projects && Array.isArray(linkedinData.projects)) {
    resume.projects = linkedinData.projects.map(project => ({
      name: project.name || '',
      description: plainTextToJSON(project.description || ''),
      technologies: project.keywords || [],
      link: project.url || '',
    }))
  }

  // Parse certifications
  if (linkedinData.certificates && Array.isArray(linkedinData.certificates)) {
    resume.certifications = linkedinData.certificates.map(cert => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
    }))
  }

  // Parse awards
  if (linkedinData.awards && Array.isArray(linkedinData.awards)) {
    resume.awards = linkedinData.awards.map(award => ({
      title: award.title || '',
      date: award.date || '',
      issuer: award.awarder || '',
      description: award.summary || '',
    }))
  }

  // Parse volunteer experience
  if (linkedinData.volunteer && Array.isArray(linkedinData.volunteer)) {
    resume.volunteer = linkedinData.volunteer.map(vol => ({
      organization: vol.organization || '',
      role: vol.position || '',
      startDate: vol.startDate || '',
      endDate: vol.endDate || '',
      current: !vol.endDate,
      description: plainTextToJSON(vol.summary || ''),
    }))
  }

  // Parse publications
  if (linkedinData.publications && Array.isArray(linkedinData.publications)) {
    resume.publications = linkedinData.publications.map(pub => ({
      title: pub.name || '',
      publisher: pub.publisher || '',
      date: pub.releaseDate || '',
      link: pub.url || '',
    }))
  }

  // Parse languages
  if (linkedinData.languages && Array.isArray(linkedinData.languages)) {
    resume.languages = linkedinData.languages.map(lang => ({
      language: lang.language || '',
      fluency: lang.fluency || '',
    }))
  }

  return resume
}

/**
 * Validate if the data looks like valid LinkedIn JSON Resume format
 */
export function isValidLinkedInProfile(data: any): boolean {
  if (!data || typeof data !== 'object') return false

  // Check for at least one of the expected top-level properties
  const hasValidStructure =
    data.basics ||
    data.work ||
    data.education ||
    data.skills ||
    data.projects

  return hasValidStructure
}
