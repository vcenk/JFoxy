// lib/pdf/templates/ElegantTemplate.tsx
// Elegant template: Sophisticated design with refined typography

import React from 'react'
import { Document, Page, View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { TemplateProps, SectionKey } from '../types'
import { PAPER_SIZES, computeStyles, getFontFamily } from '../styles'
import { registerFonts } from '../fonts/register'
import { extractPlainText, isEmptyContent } from '../utils/richTextToPlain'
import { formatDateRange, formatDate } from '../utils/dateFormatter'
import { PageNumber } from '../sections/PageNumber'

registerFonts()

/**
 * Elegant Template
 * Sophisticated single-column layout with refined typography and elegant dividers.
 * Best for: Executive roles, consulting, finance, law, academia.
 */
export function ElegantTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.25
  const headerAlignment = design.headerAlignment || 'center'

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

    // Elegant header with decorative elements
    header: {
      alignItems: headerAlignment === 'left' ? 'flex-start' : 'center',
      marginBottom: computed.spacing.section,
      paddingBottom: 16,
    },
    headerDecoration: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    headerLine: {
      width: 40,
      height: 1,
      backgroundColor: computed.colors.accent,
    },
    headerDiamond: {
      width: 8,
      height: 8,
      backgroundColor: computed.colors.accent,
      marginHorizontal: 12,
      transform: 'rotate(45deg)',
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name + 2,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 10,
      textAlign: headerAlignment,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      color: computed.colors.muted,
      marginBottom: 14,
      textAlign: headerAlignment,
      fontStyle: 'italic',
      letterSpacing: 1,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: headerAlignment === 'left' ? 'flex-start' : 'center',
      marginTop: 8,
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.text,
    },
    contactLink: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.accent,
      textDecoration: 'none',
    },
    contactSeparator: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      marginHorizontal: 10,
    },
    headerBottomLine: {
      width: '100%',
      height: 1,
      backgroundColor: computed.colors.muted,
      marginTop: 12,
    },

    // Section styling
    section: {
      marginBottom: computed.spacing.section,
    },
    sectionHeader: {
      marginBottom: 10,
    },
    sectionTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      letterSpacing: 1,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 2,
      }),
    },
    sectionTitleLine: {
      flex: 1,
      height: 1,
      backgroundColor: computed.colors.muted,
      marginLeft: 16,
    },
    sectionUnderline: {
      width: 60,
      height: 2,
      backgroundColor: computed.colors.accent,
      marginTop: 4,
      ...(design.headingStyle !== 'underline' && { display: 'none' }),
    },

    // Summary with elegant styling
    summaryText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.5,
      textAlign: 'justify',
      fontStyle: 'italic',
    },

    // Entry styling
    entry: {
      marginBottom: computed.spacing.item + 2,
    },
    entryHeader: {
      marginBottom: 4,
    },
    entryTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
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
      color: computed.colors.accent,
      marginTop: 1,
    },
    entryMeta: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      fontStyle: 'italic',
      marginTop: 1,
    },
    entryDate: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      fontStyle: 'italic',
    },

    // Bullet styling - elegant dashes
    bulletList: {
      marginTop: 6,
      paddingLeft: 4,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: computed.spacing.bullet + 1,
    },
    bulletMarker: {
      width: 14,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.accent,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },

    // Skills - inline elegant style
    skillsContainer: {
      marginTop: 4,
    },
    skillCategory: {
      marginBottom: 6,
    },
    skillCategoryTitle: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: computed.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 3,
    },
    skillsList: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },

    // Simple entry (certifications, awards, etc.)
    simpleEntry: {
      marginBottom: computed.spacing.bullet + 2,
      paddingLeft: 4,
    },
    simpleEntryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    simpleEntryTitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    simpleEntrySubtitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
      fontStyle: 'italic',
    },
    simpleEntryDescription: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.text,
      marginTop: 2,
      paddingLeft: 12,
    },

    // Languages inline
    languagesText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
  })

  // Helper to clean URLs
  const cleanLinkedIn = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
  const cleanGitHub = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '')
  const cleanUrl = (value: string) =>
    value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Section Header
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionTitleLine} />
      </View>
      {design.headingStyle === 'underline' && <View style={styles.sectionUnderline} />}
    </View>
  )

  // Header
  const RenderHeader = () => {
    const c = data.contact || {}
    const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ')

    const contactItems: React.ReactNode[] = []
    const addContact = (node: React.ReactNode, key: string) => {
      if (contactItems.length > 0) {
        contactItems.push(<Text key={`sep-${key}`} style={styles.contactSeparator}>|</Text>)
      }
      contactItems.push(node)
    }

    if (c.location && c.locationEnabled !== false) {
      addContact(<Text key="location" style={styles.contactItem}>{c.location}</Text>, 'location')
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
        <View style={styles.headerDecoration}>
          <View style={styles.headerLine} />
          <View style={styles.headerDiamond} />
          <View style={styles.headerLine} />
        </View>
        {displayName && c.nameEnabled !== false && (
          <Text style={styles.name}>{displayName}</Text>
        )}
        {data.targetTitle && <Text style={styles.targetTitle}>{data.targetTitle}</Text>}
        {contactItems.length > 0 && <View style={styles.contactRow}>{contactItems}</View>}
        <View style={styles.headerBottomLine} />
      </View>
    )
  }

  // Summary
  const RenderSummary = () => {
    if (design.sectionSettings.summary?.enabled === false) return null
    if (isEmptyContent(data.summary) || data.summaryEnabled === false) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.summary?.customTitle || 'Profile'} />
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
        <SectionHeader title={design.sectionSettings.experience?.customTitle || 'Professional Experience'} />
        {entries.map(entry => {
          const bullets = entry.bullets.filter(b => b.enabled !== false)
          const dateRange = formatDateRange(entry.startDate, entry.endDate, entry.current, design.dateFormat)

          return (
            <View key={entry.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleRow}>
                  <View style={{ flex: 1 }}>
                    {entry.positionEnabled !== false && (
                      <Text style={styles.entryTitle}>{entry.position}</Text>
                    )}
                    {entry.companyEnabled !== false && entry.company && (
                      <Text style={styles.entrySubtitle}>{entry.company}</Text>
                    )}
                    {entry.locationEnabled !== false && entry.location && (
                      <Text style={styles.entryMeta}>{entry.location}</Text>
                    )}
                  </View>
                  {entry.dateEnabled !== false && dateRange && (
                    <Text style={styles.entryDate}>{dateRange}</Text>
                  )}
                </View>
              </View>
              {bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {bullets.map(bullet => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>—</Text>
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

  // Education
  const RenderEducation = () => {
    if (design.sectionSettings.education?.enabled === false) return null
    const entries = (data.education || []).filter(e => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.education?.customTitle || 'Education'} />
        {entries.map(edu => (
          <View key={edu.id} style={styles.entry} wrap={false}>
            <View style={styles.entryTitleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.entryTitle}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </Text>
                <Text style={styles.entrySubtitle}>{edu.institution}</Text>
              </View>
              {edu.graduationDate && (
                <Text style={styles.entryDate}>{formatDate(edu.graduationDate, design.dateFormat)}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    )
  }

  // Skills
  const RenderSkills = () => {
    if (design.sectionSettings.skills?.enabled === false) return null

    const categories: { name: string; skills: string[] }[] = []
    if (data.skills.technical?.length) {
      const skills = data.skills.technical.filter(s => s.enabled !== false).map(s => s.name)
      if (skills.length) categories.push({ name: 'Technical', skills })
    } else if (data.skills.technicalLegacy?.length) {
      categories.push({ name: 'Technical', skills: data.skills.technicalLegacy })
    }
    if (data.skills.soft?.length) {
      const skills = data.skills.soft.filter(s => s.enabled !== false).map(s => s.name)
      if (skills.length) categories.push({ name: 'Professional', skills })
    } else if (data.skills.softLegacy?.length) {
      categories.push({ name: 'Professional', skills: data.skills.softLegacy })
    }

    if (categories.length === 0) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.skills?.customTitle || 'Expertise'} />
        <View style={styles.skillsContainer}>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.skillCategory}>
              <Text style={styles.skillCategoryTitle}>{cat.name}</Text>
              <Text style={styles.skillsList}>{cat.skills.join('  ·  ')}</Text>
            </View>
          ))}
        </View>
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
        <SectionHeader title={design.sectionSettings.projects?.customTitle || 'Notable Projects'} />
        {entries.map(project => {
          const bullets = (project.bullets || []).filter(b => b.enabled !== false)
          return (
            <View key={project.id} style={styles.entry} wrap={false}>
              <Text style={styles.entryTitle}>{project.name}</Text>
              {project.description && !isEmptyContent(project.description) && (
                <Text style={[styles.bulletText, { marginTop: 2 }]}>
                  {extractPlainText(project.description).trim()}
                </Text>
              )}
              {bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {bullets.map(bullet => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>—</Text>
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

  // Certifications
  const RenderCertifications = () => {
    if (design.sectionSettings.certifications?.enabled === false) return null
    const entries = (data.certifications || []).filter(c => c.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.certifications?.customTitle || 'Certifications'} />
        {entries.map(cert => (
          <View key={cert.id} style={styles.simpleEntry}>
            <View style={styles.simpleEntryRow}>
              <Text style={styles.simpleEntryTitle}>{cert.name}</Text>
              {cert.date && <Text style={styles.entryDate}>{formatDate(cert.date, design.dateFormat)}</Text>}
            </View>
            {cert.issuer && <Text style={styles.simpleEntrySubtitle}>{cert.issuer}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Awards
  const RenderAwards = () => {
    if (design.sectionSettings.awards?.enabled === false) return null
    const entries = (data.awards || []).filter(a => a.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.awards?.customTitle || 'Honors & Awards'} />
        {entries.map(award => (
          <View key={award.id} style={styles.simpleEntry}>
            <View style={styles.simpleEntryRow}>
              <Text style={styles.simpleEntryTitle}>{award.title}</Text>
              {award.date && <Text style={styles.entryDate}>{formatDate(award.date, design.dateFormat)}</Text>}
            </View>
            {award.issuer && <Text style={styles.simpleEntrySubtitle}>{award.issuer}</Text>}
            {award.description && <Text style={styles.simpleEntryDescription}>{award.description}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Languages
  const RenderLanguages = () => {
    if (design.sectionSettings.languages?.enabled === false) return null
    const entries = (data.languages || []).filter(l => l.enabled !== false)
    if (entries.length === 0) return null

    const languageText = entries
      .map(l => `${l.language}${l.fluency ? ` (${l.fluency})` : ''}`)
      .join('  ·  ')

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.languages?.customTitle || 'Languages'} />
        <Text style={styles.languagesText}>{languageText}</Text>
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
        <SectionHeader title={design.sectionSettings.volunteer?.customTitle || 'Community Involvement'} />
        {entries.map(vol => {
          const dateRange = formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)
          return (
            <View key={vol.id} style={styles.entry} wrap={false}>
              <View style={styles.entryTitleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryTitle}>{vol.role}</Text>
                  {vol.organization && <Text style={styles.entrySubtitle}>{vol.organization}</Text>}
                </View>
                {dateRange && <Text style={styles.entryDate}>{dateRange}</Text>}
              </View>
              {vol.description && !isEmptyContent(vol.description) && (
                <Text style={[styles.bulletText, { marginTop: 4 }]}>
                  {extractPlainText(vol.description).trim()}
                </Text>
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
        <SectionHeader title={design.sectionSettings.publications?.customTitle || 'Publications'} />
        {entries.map(pub => (
          <View key={pub.id} style={styles.simpleEntry}>
            <View style={styles.simpleEntryRow}>
              <Text style={styles.simpleEntryTitle}>{pub.title}</Text>
              {pub.date && <Text style={styles.entryDate}>{formatDate(pub.date, design.dateFormat)}</Text>}
            </View>
            {pub.publisher && <Text style={styles.simpleEntrySubtitle}>{pub.publisher}</Text>}
            {pub.description && <Text style={styles.simpleEntryDescription}>{pub.description}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Section renderer map
  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    contact: RenderHeader,
    summary: RenderSummary,
    experience: RenderExperience,
    education: RenderEducation,
    skills: RenderSkills,
    projects: RenderProjects,
    certifications: RenderCertifications,
    awards: RenderAwards,
    languages: RenderLanguages,
    volunteer: RenderVolunteer,
    publications: RenderPublications,
  }

  // Deduplicate section order to prevent any issues
  const uniqueOrder = Array.from(new Set(design.sectionOrder))

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={styles.page}>
        {uniqueOrder
          .filter(key => design.sectionSettings[key]?.enabled !== false)
          .map(key => (
            <React.Fragment key={key}>{sectionRenderers[key]()}</React.Fragment>
          ))}
        <PageNumber design={design} />
      </Page>
    </Document>
  )
}

export default ElegantTemplate
