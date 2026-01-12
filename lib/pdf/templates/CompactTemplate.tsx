// lib/pdf/templates/CompactTemplate.tsx
// Compact template: Dense two-column layout to maximize content on one page

import React from 'react'
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { TemplateProps } from '../types'
import { PAPER_SIZES, computeStyles, getFontFamily } from '../styles'
import { registerFonts } from '../fonts/register'
import { extractPlainText, isEmptyContent } from '../utils/richTextToPlain'
import { formatDateRange, formatDate } from '../utils/dateFormatter'
import { PageNumber } from '../sections/PageNumber'

registerFonts()

/**
 * Compact Template
 * Dense two-column layout designed to fit maximum content on one page.
 * Best for: Experienced professionals with lots of content, career changers.
 */
export function CompactTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.1 // Tighter line height for compact
  const headerAlignment = design.headerAlignment || 'center'

  // Use smaller spacing for compact layout
  const compactSpacing = {
    section: Math.max(8, computed.spacing.section - 4),
    item: Math.max(4, computed.spacing.item - 2),
    bullet: Math.max(1, computed.spacing.bullet - 1),
  }

  const styles = StyleSheet.create({
    page: {
      paddingTop: computed.page.paddingTop,
      paddingRight: computed.page.paddingRight,
      paddingBottom: computed.page.paddingBottom,
      paddingLeft: computed.page.paddingLeft,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
    },

    // Header - full width, compact
    header: {
      marginBottom: compactSpacing.section,
      alignItems: headerAlignment === 'left' ? 'flex-start' : 'center',
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: computed.colors.primary,
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name - 2, // Slightly smaller for compact
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 8,
      textAlign: headerAlignment,
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section - 1,
      color: computed.colors.muted,
      marginBottom: 10,
      textAlign: headerAlignment,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: headerAlignment === 'left' ? 'flex-start' : 'center',
      marginTop: 6,
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: computed.colors.text,
    },
    contactLink: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: computed.colors.accent,
      textDecoration: 'none',
    },
    contactSeparator: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: computed.colors.muted,
      marginHorizontal: 4,
    },

    // Two column layout
    columnsContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    leftColumn: {
      width: '65%',
      paddingRight: 12,
    },
    rightColumn: {
      width: '35%',
      paddingLeft: 12,
      borderLeftWidth: 1,
      borderLeftColor: computed.colors.muted,
    },

    // Section styling
    section: {
      marginBottom: compactSpacing.section,
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section - 1,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 4,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: computed.fonts.section - 2,
      }),
      ...(design.headingStyle === 'underline' && {
        borderBottomWidth: 1,
        borderBottomColor: computed.colors.accent,
        paddingBottom: 2,
      }),
    },
    sidebarTitle: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Summary - compact
    summaryText: {
      fontFamily,
      fontSize: computed.fonts.body - 1,
      color: computed.colors.text,
      lineHeight: 1.2,
    },

    // Entry styling
    entry: {
      marginBottom: compactSpacing.item,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 1,
    },
    entryTitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    entrySubtitle: {
      fontFamily,
      fontSize: computed.fonts.body - 1,
      color: computed.colors.muted,
    },
    entryDate: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: computed.colors.muted,
    },

    // Bullets - compact
    bulletList: {
      marginTop: 2,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: compactSpacing.bullet,
    },
    bulletMarker: {
      width: 8,
      fontFamily,
      fontSize: computed.fonts.body - 1,
      color: computed.colors.accent,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body - 1,
      color: computed.colors.text,
      lineHeight: 1.25,
    },

    // Sidebar items
    sidebarSection: {
      marginBottom: compactSpacing.section,
    },
    sidebarEntry: {
      marginBottom: 4,
    },
    sidebarEntryTitle: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: computed.colors.text,
    },
    sidebarEntrySubtitle: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: computed.colors.muted,
    },
    skillItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.text,
      marginBottom: 1,
    },
    languageItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.text,
      marginBottom: 2,
    },
  })

  // Helper to clean URLs
  const cleanLinkedIn = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
  const cleanGitHub = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '')
  const cleanUrl = (value: string) =>
    value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Header
  const RenderHeader = () => {
    const c = data.contact || {}
    const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ')

    const contactItems: React.ReactNode[] = []
    const addContact = (node: React.ReactNode, key: string) => {
      if (contactItems.length > 0) {
        contactItems.push(<Text key={`sep-${key}`} style={styles.contactSeparator}>•</Text>)
      }
      contactItems.push(node)
    }

    if (c.email && c.emailEnabled !== false) {
      addContact(
        <Link key="email" src={`mailto:${c.email}`} style={styles.contactLink}>{c.email}</Link>,
        'email'
      )
    }
    if (c.phone && c.phoneEnabled !== false) {
      addContact(<Text key="phone" style={styles.contactItem}>{c.phone}</Text>, 'phone')
    }
    if (c.location && c.locationEnabled !== false) {
      addContact(<Text key="location" style={styles.contactItem}>{c.location}</Text>, 'location')
    }
    if (c.linkedin && c.linkedinEnabled !== false) {
      const username = cleanLinkedIn(c.linkedin)
      addContact(
        <Link key="linkedin" src={`https://linkedin.com/in/${username}`} style={styles.contactLink}>
          linkedin.com/in/{username}
        </Link>,
        'linkedin'
      )
    }
    if (c.github && c.githubEnabled !== false) {
      const username = cleanGitHub(c.github)
      addContact(
        <Link key="github" src={`https://github.com/${username}`} style={styles.contactLink}>
          github.com/{username}
        </Link>,
        'github'
      )
    }
    if (c.portfolio && c.portfolioEnabled !== false) {
      const clean = cleanUrl(c.portfolio)
      addContact(
        <Link key="portfolio" src={`https://${clean}`} style={styles.contactLink}>{clean}</Link>,
        'portfolio'
      )
    }

    return (
      <View style={styles.header}>
        {displayName && c.nameEnabled !== false && (
          <Text style={styles.name}>{displayName}</Text>
        )}
        {data.targetTitle && <Text style={styles.targetTitle}>{data.targetTitle}</Text>}
        {contactItems.length > 0 && <View style={styles.contactRow}>{contactItems}</View>}
      </View>
    )
  }

  // Summary
  const RenderSummary = () => {
    if (design.sectionSettings.summary?.enabled === false) return null
    if (isEmptyContent(data.summary) || data.summaryEnabled === false) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.summary?.customTitle || 'Summary'}
        </Text>
        <Text style={styles.summaryText}>{extractPlainText(data.summary).trim()}</Text>
      </View>
    )
  }

  // Experience
  const RenderExperience = () => {
    if (design.sectionSettings.experience?.enabled === false) return null
    const entries = (data.experience || []).filter(e => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.experience?.customTitle || 'Experience'}
        </Text>
        {entries.map(entry => {
          const bullets = entry.bullets.filter(b => b.enabled !== false)
          const dateRange = formatDateRange(entry.startDate, entry.endDate, entry.current, design.dateFormat)

          return (
            <View key={entry.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={{ flex: 1 }}>
                  {entry.positionEnabled !== false && (
                    <Text style={styles.entryTitle}>{entry.position}</Text>
                  )}
                  {entry.companyEnabled !== false && entry.company && (
                    <Text style={styles.entrySubtitle}>
                      {entry.company}
                      {entry.locationEnabled !== false && entry.location ? ` • ${entry.location}` : ''}
                    </Text>
                  )}
                </View>
                {entry.dateEnabled !== false && dateRange && (
                  <Text style={styles.entryDate}>{dateRange}</Text>
                )}
              </View>
              {bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {bullets.map(bullet => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.bulletText}>{text}</Text>
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // Projects
  const RenderProjects = () => {
    if (design.sectionSettings.projects?.enabled === false) return null
    const entries = (data.projects || []).filter(p => p.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.projects?.customTitle || 'Projects'}
        </Text>
        {entries.map(project => {
          const bullets = (project.bullets || []).filter(b => b.enabled !== false)
          return (
            <View key={project.id} style={styles.entry} wrap={false}>
              <Text style={styles.entryTitle}>{project.name}</Text>
              {project.description && !isEmptyContent(project.description) && (
                <Text style={styles.bulletText}>{extractPlainText(project.description).trim()}</Text>
              )}
              {bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {bullets.map(bullet => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>•</Text>
                        <Text style={styles.bulletText}>{text}</Text>
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // Volunteer
  const RenderVolunteer = () => {
    if (design.sectionSettings.volunteer?.enabled === false) return null
    const entries = (data.volunteer || []).filter(v => v.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.volunteer?.customTitle || 'Volunteer'}
        </Text>
        {entries.map(vol => {
          const dateRange = formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)
          return (
            <View key={vol.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle}>{vol.role}</Text>
                  {vol.organization && <Text style={styles.entrySubtitle}>{vol.organization}</Text>}
                </View>
                {dateRange && <Text style={styles.entryDate}>{dateRange}</Text>}
              </View>
              {vol.description && !isEmptyContent(vol.description) && (
                <Text style={styles.bulletText}>{extractPlainText(vol.description).trim()}</Text>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // Publications
  const RenderPublications = () => {
    if (design.sectionSettings.publications?.enabled === false) return null
    const entries = (data.publications || []).filter(p => p.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.publications?.customTitle || 'Publications'}
        </Text>
        {entries.map(pub => (
          <View key={pub.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryTitle}>{pub.title}</Text>
                {pub.publisher && <Text style={styles.entrySubtitle}>{pub.publisher}</Text>}
              </View>
              {pub.date && <Text style={styles.entryDate}>{formatDate(pub.date, design.dateFormat)}</Text>}
            </View>
            {pub.description && <Text style={styles.bulletText}>{pub.description}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Sidebar: Skills
  const RenderSkills = () => {
    if (design.sectionSettings.skills?.enabled === false) return null

    const allSkills: string[] = []
    if (data.skills.technical?.length) {
      allSkills.push(...data.skills.technical.filter(s => s.enabled !== false).map(s => s.name))
    } else if (data.skills.technicalLegacy?.length) {
      allSkills.push(...data.skills.technicalLegacy)
    }
    if (data.skills.soft?.length) {
      allSkills.push(...data.skills.soft.filter(s => s.enabled !== false).map(s => s.name))
    } else if (data.skills.softLegacy?.length) {
      allSkills.push(...data.skills.softLegacy)
    }

    if (allSkills.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.skills?.customTitle || 'Skills'}
        </Text>
        {allSkills.map((skill, i) => (
          <Text key={i} style={styles.skillItem}>• {skill}</Text>
        ))}
      </View>
    )
  }

  // Sidebar: Education
  const RenderEducation = () => {
    if (design.sectionSettings.education?.enabled === false) return null
    const entries = (data.education || []).filter(e => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.education?.customTitle || 'Education'}
        </Text>
        {entries.map(edu => (
          <View key={edu.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{edu.degree}</Text>
            <Text style={styles.sidebarEntrySubtitle}>{edu.field}</Text>
            <Text style={styles.sidebarEntrySubtitle}>{edu.institution}</Text>
            {edu.graduationDate && (
              <Text style={styles.sidebarEntrySubtitle}>
                {formatDate(edu.graduationDate, design.dateFormat)}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Sidebar: Certifications
  const RenderCertifications = () => {
    if (design.sectionSettings.certifications?.enabled === false) return null
    const entries = (data.certifications || []).filter(c => c.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.certifications?.customTitle || 'Certifications'}
        </Text>
        {entries.map(cert => (
          <View key={cert.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{cert.name}</Text>
            {cert.issuer && <Text style={styles.sidebarEntrySubtitle}>{cert.issuer}</Text>}
            {cert.date && (
              <Text style={styles.sidebarEntrySubtitle}>
                {formatDate(cert.date, design.dateFormat)}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Sidebar: Awards
  const RenderAwards = () => {
    if (design.sectionSettings.awards?.enabled === false) return null
    const entries = (data.awards || []).filter(a => a.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.awards?.customTitle || 'Awards'}
        </Text>
        {entries.map(award => (
          <View key={award.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{award.title}</Text>
            {award.issuer && <Text style={styles.sidebarEntrySubtitle}>{award.issuer}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Sidebar: Languages
  const RenderLanguages = () => {
    if (design.sectionSettings.languages?.enabled === false) return null
    const entries = (data.languages || []).filter(l => l.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.languages?.customTitle || 'Languages'}
        </Text>
        {entries.map(lang => (
          <Text key={lang.id} style={styles.languageItem}>
            {lang.language}{lang.fluency ? ` - ${lang.fluency}` : ''}
          </Text>
        ))}
      </View>
    )
  }

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={styles.page}>
        <RenderHeader />

        <View style={styles.columnsContainer}>
          {/* Left Column - Main Content */}
          <View style={styles.leftColumn}>
            <RenderSummary />
            <RenderExperience />
            <RenderProjects />
            <RenderVolunteer />
            <RenderPublications />
          </View>

          {/* Right Column - Sidebar */}
          <View style={styles.rightColumn}>
            <RenderSkills />
            <RenderEducation />
            <RenderCertifications />
            <RenderAwards />
            <RenderLanguages />
          </View>
        </View>

        <PageNumber design={design} />
      </Page>
    </Document>
  )
}

export default CompactTemplate
