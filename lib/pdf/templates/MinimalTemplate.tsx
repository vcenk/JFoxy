// lib/pdf/templates/MinimalTemplate.tsx
// Minimal clean resume template

import React from 'react'
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { TemplateProps } from '../types'
import { PAPER_SIZES, computeStyles, getFontFamily } from '../styles'
import { registerFonts } from '../fonts/register'
import { extractPlainText, isEmptyContent } from '../utils/richTextToPlain'
import { formatDateRange, formatDate } from '../utils/dateFormatter'
import { PageNumber } from '../sections/PageNumber'

// Register fonts
registerFonts()

/**
 * Minimal Template
 * Clean, typography-focused design with lots of whitespace
 * Best for: Creative roles, design positions, senior executives
 */
export function MinimalTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15
  const headerAlignment = design.headerAlignment || 'left'
  const isCenter = headerAlignment === 'center'

  const styles = StyleSheet.create({
    page: {
      paddingTop: computed.page.paddingTop + 20,
      paddingRight: computed.page.paddingRight + 10,
      paddingBottom: computed.page.paddingBottom,
      paddingLeft: computed.page.paddingLeft + 10,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
    },
    // Header styles
    header: {
      flexDirection: 'column',
      marginBottom: 24,
      borderBottomWidth: 0.5,
      borderBottomColor: computed.colors.muted,
      paddingBottom: 20,
      alignItems: isCenter ? 'center' : 'flex-start',
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name + 4,
      fontWeight: 400,
      color: computed.colors.primary,
      letterSpacing: 2,
      marginBottom: 10,
      textAlign: isCenter ? 'center' : 'left',
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      color: computed.colors.muted,
      letterSpacing: 1,
      marginBottom: 12,
      textAlign: isCenter ? 'center' : 'left',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
      justifyContent: isCenter ? 'center' : 'flex-start',
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    contactSeparator: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      marginHorizontal: 8,
    },
    contactLink: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      textDecoration: 'none',
    },
    // Section styles
    section: {
      marginBottom: computed.spacing.section + 4,
    },
    sectionHeader: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 400,
      color: computed.colors.muted,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 12,
    },
    // Entry styles
    entry: {
      marginBottom: computed.spacing.item + 2,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    entryTitle: {
      fontFamily,
      fontSize: computed.fonts.body + 1,
      fontWeight: 700,
      color: computed.colors.text,
    },
    entrySubtitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      marginBottom: 2,
    },
    entryMeta: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      fontStyle: 'italic',
    },
    entryDate: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    // Content styles
    text: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
    bulletList: {
      marginTop: 6,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    bulletMarker: {
      width: 12,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
    // Skills inline
    skillsText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
  })

  const contact = data.contact
  const displayName = contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(' ')

  // Build contact items
  const contactItems: React.ReactNode[] = []
  const addContactItem = (content: React.ReactNode, key: string) => {
    if (contactItems.length > 0) {
      contactItems.push(
        <Text key={`sep-${key}`} style={styles.contactSeparator}>|</Text>
      )
    }
    contactItems.push(content)
  }

  if (contact.location && contact.locationEnabled !== false) {
    addContactItem(<Text key="loc" style={styles.contactItem}>{contact.location}</Text>, 'loc')
  }
  if (contact.email && contact.emailEnabled !== false) {
    addContactItem(
      <Link key="email" src={`mailto:${contact.email}`} style={styles.contactLink}>{contact.email}</Link>,
      'email'
    )
  }
  if (contact.phone && contact.phoneEnabled !== false) {
    addContactItem(<Text key="phone" style={styles.contactItem}>{contact.phone}</Text>, 'phone')
  }
  if (contact.linkedin && contact.linkedinEnabled !== false) {
    const cleanUsername = contact.linkedin
      .replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
      .replace(/\/$/, '')
    addContactItem(
      <Link key="linkedin" src={`https://linkedin.com/in/${cleanUsername}`} style={styles.contactLink}>
        linkedin.com/in/{cleanUsername}
      </Link>,
      'linkedin'
    )
  }

  // Get all skills as a single string
  const allSkills: string[] = []
  if (data.skills.technical) {
    allSkills.push(...data.skills.technical.filter(s => s.enabled !== false).map(s => s.name))
  } else if (data.skills.technicalLegacy) {
    allSkills.push(...data.skills.technicalLegacy)
  }
  if (data.skills.soft) {
    allSkills.push(...data.skills.soft.filter(s => s.enabled !== false).map(s => s.name))
  } else if (data.skills.softLegacy) {
    allSkills.push(...data.skills.softLegacy)
  }

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {displayName && contact.nameEnabled !== false && (
            <Text style={styles.name}>{displayName}</Text>
          )}
          {data.targetTitle && (
            <Text style={styles.targetTitle}>{data.targetTitle}</Text>
          )}
          {contactItems.length > 0 && (
            <View style={styles.contactRow}>{contactItems}</View>
          )}
        </View>

        {/* Summary */}
        {!isEmptyContent(data.summary) && data.summaryEnabled !== false && design.sectionSettings.summary?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.summary?.customTitle || 'Profile'}
            </Text>
            <Text style={styles.text}>{extractPlainText(data.summary).trim()}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.filter(e => e.enabled !== false).length > 0 && design.sectionSettings.experience?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.experience?.customTitle || 'Experience'}
            </Text>
            {data.experience.filter(e => e.enabled !== false).map((exp) => (
              <View key={exp.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.position}</Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, design.dateFormat)}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}</Text>
                <View style={styles.bulletList}>
                  {exp.bullets.filter(b => b.enabled !== false).map((bullet) => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>-</Text>
                        <Text style={styles.bulletText}>{text}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.filter(e => e.enabled !== false).length > 0 && design.sectionSettings.education?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.education?.customTitle || 'Education'}
            </Text>
            {data.education.filter(e => e.enabled !== false).map((edu) => (
              <View key={edu.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution}</Text>
                  <Text style={styles.entryDate}>{formatDate(edu.graduationDate, design.dateFormat)}</Text>
                </View>
                <Text style={styles.entryMeta}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {allSkills.length > 0 && design.sectionSettings.skills?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.skills?.customTitle || 'Skills'}
            </Text>
            <Text style={styles.skillsText}>{allSkills.join('  |  ')}</Text>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.filter(p => p.enabled !== false).length > 0 && design.sectionSettings.projects?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.projects?.customTitle || 'Projects'}
            </Text>
            {data.projects.filter(p => p.enabled !== false).map((project) => (
              <View key={project.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{project.name}</Text>
                </View>
                {project.description && !isEmptyContent(project.description) && (
                  <Text style={styles.text}>{extractPlainText(project.description).trim()}</Text>
                )}
                {project.bullets && project.bullets.filter(b => b.enabled !== false).length > 0 && (
                  <View style={styles.bulletList}>
                    {project.bullets.filter(b => b.enabled !== false).map((bullet) => {
                      const text = extractPlainText(bullet.content).trim()
                      if (!text) return null
                      return (
                        <View key={bullet.id} style={styles.bulletItem}>
                          <Text style={styles.bulletMarker}>-</Text>
                          <Text style={styles.bulletText}>{text}</Text>
                        </View>
                      )
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.filter(c => c.enabled !== false).length > 0 && design.sectionSettings.certifications?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.certifications?.customTitle || 'Certifications'}
            </Text>
            {data.certifications.filter(c => c.enabled !== false).map((cert) => (
              <View key={cert.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{cert.name}</Text>
                  {cert.date && (
                    <Text style={styles.entryDate}>{formatDate(cert.date, design.dateFormat)}</Text>
                  )}
                </View>
                {cert.issuer && <Text style={styles.entryMeta}>{cert.issuer}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Awards */}
        {data.awards && data.awards.filter(a => a.enabled !== false).length > 0 && design.sectionSettings.awards?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.awards?.customTitle || 'Awards'}
            </Text>
            {data.awards.filter(a => a.enabled !== false).map((award) => (
              <View key={award.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{award.title}</Text>
                  {award.date && (
                    <Text style={styles.entryDate}>{formatDate(award.date, design.dateFormat)}</Text>
                  )}
                </View>
                {award.issuer && <Text style={styles.entryMeta}>{award.issuer}</Text>}
                {award.description && <Text style={styles.text}>{award.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.filter(l => l.enabled !== false).length > 0 && design.sectionSettings.languages?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.languages?.customTitle || 'Languages'}
            </Text>
            <Text style={styles.skillsText}>
              {data.languages.filter(l => l.enabled !== false).map(l =>
                `${l.language}${l.fluency ? ` (${l.fluency})` : ''}`
              ).join('  |  ')}
            </Text>
          </View>
        )}

        {/* Volunteer */}
        {data.volunteer && data.volunteer.filter(v => v.enabled !== false).length > 0 && design.sectionSettings.volunteer?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.volunteer?.customTitle || 'Volunteer'}
            </Text>
            {data.volunteer.filter(v => v.enabled !== false).map((vol) => (
              <View key={vol.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{vol.role}</Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)}
                  </Text>
                </View>
                {vol.organization && <Text style={styles.entrySubtitle}>{vol.organization}</Text>}
                {vol.description && !isEmptyContent(vol.description) && (
                  <Text style={styles.text}>{extractPlainText(vol.description).trim()}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {data.publications && data.publications.filter(p => p.enabled !== false).length > 0 && design.sectionSettings.publications?.enabled !== false && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>
              {design.sectionSettings.publications?.customTitle || 'Publications'}
            </Text>
            {data.publications.filter(p => p.enabled !== false).map((pub) => (
              <View key={pub.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{pub.title}</Text>
                  {pub.date && (
                    <Text style={styles.entryDate}>{formatDate(pub.date, design.dateFormat)}</Text>
                  )}
                </View>
                {pub.publisher && <Text style={styles.entryMeta}>{pub.publisher}</Text>}
                {pub.description && <Text style={styles.text}>{pub.description}</Text>}
              </View>
            ))}
          </View>
        )}

        <PageNumber design={design} />
      </Page>
    </Document>
  )
}

export default MinimalTemplate
