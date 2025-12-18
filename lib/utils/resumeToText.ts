// lib/utils/resumeToText.ts
// Convert structured resume data to plain text for AI analysis

import { ParsedResume } from '@/lib/types/resume'
import { JSONContent } from '@tiptap/core'

/**
 * Convert TipTap rich text JSON to plain text
 */
function richTextToPlainText(content: JSONContent | string | undefined): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  let text = ''

  if (content.type === 'text') {
    return content.text || ''
  }

  if (content.content && Array.isArray(content.content) && content.content.length > 0) {
    content.content.forEach(node => {
      text += richTextToPlainText(node)
      if (node.type === 'paragraph' || node.type === 'heading') {
        text += '\n'
      }
    })
  }

  return text
}

/**
 * Convert ParsedResume to plain text for AI analysis
 */
export function resumeToPlainText(resume: ParsedResume): string {
  const sections: string[] = []

  // Contact Section
  if (resume.contact) {
    const contactParts = []
    if (resume.contact.firstName && resume.contact.lastName) {
      contactParts.push(`${resume.contact.firstName} ${resume.contact.lastName}`)
    }
    if (resume.contact.email) contactParts.push(resume.contact.email)
    if (resume.contact.phone) contactParts.push(resume.contact.phone)
    if (resume.contact.location) contactParts.push(resume.contact.location)
    if (resume.contact.linkedin) contactParts.push(resume.contact.linkedin)
    if (resume.contact.github) contactParts.push(resume.contact.github)
    if (resume.contact.portfolio) contactParts.push(resume.contact.portfolio)

    if (contactParts.length > 0) {
      sections.push(contactParts.join(' | '))
    }
  }

  // Summary
  if (resume.summary) {
    sections.push('\nPROFESSIONAL SUMMARY')
    sections.push(richTextToPlainText(resume.summary))
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    sections.push('\nEXPERIENCE')
    resume.experience.forEach(exp => {
      sections.push(`\n${exp.position} at ${exp.company}`)
      if (exp.location) sections.push(exp.location)
      const dateRange = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`
      sections.push(dateRange)
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(bullet => {
          sections.push(`• ${richTextToPlainText(bullet)}`)
        })
      }
    })
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    sections.push('\n\nEDUCATION')
    resume.education.forEach(edu => {
      sections.push(`\n${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`)
      sections.push(edu.institution)
      if (edu.graduationDate) sections.push(edu.graduationDate)
      if (edu.gpa) sections.push(`GPA: ${edu.gpa}`)
    })
  }

  // Skills
  if (resume.skills) {
    sections.push('\n\nSKILLS')
    if (resume.skills.technical && resume.skills.technical.length > 0) {
      sections.push(`Technical: ${resume.skills.technical.join(', ')}`)
    }
    if (resume.skills.languages && resume.skills.languages.length > 0) {
      sections.push(`Languages: ${resume.skills.languages.join(', ')}`)
    }
    if (resume.skills.tools && resume.skills.tools.length > 0) {
      sections.push(`Tools: ${resume.skills.tools.join(', ')}`)
    }
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    sections.push('\n\nPROJECTS')
    resume.projects.forEach(proj => {
      sections.push(`\n${proj.name}`)
      sections.push(proj.description)
      if (proj.technologies && proj.technologies.length > 0) {
        sections.push(`Technologies: ${proj.technologies.join(', ')}`)
      }
      if (proj.link) sections.push(proj.link)
    })
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    sections.push('\n\nCERTIFICATIONS')
    resume.certifications.forEach(cert => {
      let certLine = cert.name
      if (cert.issuer) certLine += ` - ${cert.issuer}`
      if (cert.date) certLine += ` (${cert.date})`
      sections.push(certLine)
    })
  }

  // Awards
  if (resume.awards && resume.awards.length > 0) {
    sections.push('\n\nAWARDS')
    resume.awards.forEach(award => {
      sections.push(`${award.title}${award.date ? ` (${award.date})` : ''}`)
      if (award.issuer) sections.push(award.issuer)
      if (award.description) sections.push(award.description)
    })
  }

  // Volunteer
  if (resume.volunteer && resume.volunteer.length > 0) {
    sections.push('\n\nVOLUNTEER EXPERIENCE')
    resume.volunteer.forEach(vol => {
      sections.push(`\n${vol.role} at ${vol.organization}`)
      const dateRange = `${vol.startDate || ''} - ${vol.current ? 'Present' : vol.endDate || ''}`
      sections.push(dateRange)
      if (vol.description) sections.push(richTextToPlainText(vol.description))
    })
  }

  // Publications
  if (resume.publications && resume.publications.length > 0) {
    sections.push('\n\nPUBLICATIONS')
    resume.publications.forEach(pub => {
      let pubLine = pub.title
      if (pub.publisher) pubLine += ` - ${pub.publisher}`
      if (pub.date) pubLine += ` (${pub.date})`
      sections.push(pubLine)
      if (pub.description) sections.push(pub.description)
      if (pub.link) sections.push(pub.link)
    })
  }

  // Languages
  if (resume.languages && resume.languages.length > 0) {
    sections.push('\n\nLANGUAGES')
    resume.languages.forEach(lang => {
      sections.push(`${lang.language}${lang.fluency ? ` - ${lang.fluency}` : ''}`)
    })
  }

  return sections.filter(s => s.trim()).join('\n')
}
