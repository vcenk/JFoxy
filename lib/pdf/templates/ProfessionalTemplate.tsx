// lib/pdf/templates/ProfessionalTemplate.tsx
// Professional template: Clean, ATS-friendly single-column with accent lines

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
 * Professional Template
 * Clean single-column layout with accent lines and professional typography.
 * Best for: Corporate roles, traditional industries, ATS optimization.
 */
export function ProfessionalTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15
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

    // Header
    header: {
      marginBottom: computed.spacing.section,
      alignItems: headerAlignment === 'left' ? 'flex-start' : 'center',
      borderBottomWidth: 2,
      borderBottomColor: computed.colors.primary,
      paddingBottom: 12,
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 8,
      textAlign: headerAlignment,
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      color: computed.colors.muted,
      marginBottom: 12,
      textAlign: headerAlignment,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: headerAlignment === 'left' ? 'flex-start' : 'center',
      gap: 4,
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
      marginHorizontal: 6,
    },

    // Sections
    section: {
      marginBottom: computed.spacing.section,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontSize: computed.fonts.section - 1,
      }),
    },
    sectionLine: {
      flex: 1,
      height: 1,
      backgroundColor: computed.colors.muted,
      marginLeft: 12,
      ...(design.headingStyle === 'underline' && {
        backgroundColor: computed.colors.accent,
        height: 2,
      }),
    },

    // Summary
    summaryText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
      textAlign: 'justify',
    },

    // Entry (Experience, Education, etc.)
    entry: {
      marginBottom: computed.spacing.item,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    entryTitleRow: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    entryTitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    entrySubtitle: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    entryLocation: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
    },
    entryDate: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      textAlign: 'right',
    },

    // Bullets
    bulletList: {
      marginTop: 4,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: computed.spacing.bullet,
    },
    bulletMarker: {
      width: 12,
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

    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillCategory: {
      marginBottom: 6,
    },
    skillCategoryTitle: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: computed.colors.text,
      marginBottom: 2,
    },
    skillsList: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },

    // Simple entries (Certifications, Awards, Languages)
    simpleEntry: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: computed.spacing.bullet,
    },
    simpleEntryLeft: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  // Helper to clean URLs
  const cleanLinkedIn = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
  const cleanGitHub = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '')
  const cleanUrl = (value: string) =>
    value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Render Header
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
        {displayName && c.nameEnabled !== false && (
          <Text style={styles.name}>{displayName}</Text>
        )}
        {data.targetTitle && <Text style={styles.targetTitle}>{data.targetTitle}</Text>}
        {contactItems.length > 0 && <View style={styles.contactRow}>{contactItems}</View>}
      </View>
    )
  }

  // Section Header with line
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  )

  // Summary
  const RenderSummary = () => {
    if (design.sectionSettings.summary?.enabled === false) return null
    if (isEmptyContent(data.summary) || data.summaryEnabled === false) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.summary?.customTitle || 'Professional Summary'} />
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
                  {entry.positionEnabled !== false && <Text style={styles.entryTitle}>{entry.position}</Text>}
                  {entry.companyEnabled !== false && entry.company && (
                    <Text style={styles.entrySubtitle}> | {entry.company}</Text>
                  )}
                  {entry.locationEnabled !== false && entry.location && (
                    <Text style={styles.entryLocation}> | {entry.location}</Text>
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
            <View style={styles.entryHeader}>
              <View style={styles.entryTitleRow}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                {edu.field && <Text style={styles.entrySubtitle}> in {edu.field}</Text>}
                <Text style={styles.entrySubtitle}> | {edu.institution}</Text>
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
      if (skills.length) categories.push({ name: 'Technical Skills', skills })
    } else if (data.skills.technicalLegacy?.length) {
      categories.push({ name: 'Technical Skills', skills: data.skills.technicalLegacy })
    }
    if (data.skills.soft?.length) {
      const skills = data.skills.soft.filter(s => s.enabled !== false).map(s => s.name)
      if (skills.length) categories.push({ name: 'Soft Skills', skills })
    } else if (data.skills.softLegacy?.length) {
      categories.push({ name: 'Soft Skills', skills: data.skills.softLegacy })
    }

    if (categories.length === 0) return null

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.skills?.customTitle || 'Skills'} />
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.skillCategory}>
            <Text style={styles.skillCategoryTitle}>{cat.name}:</Text>
            <Text style={styles.skillsList}>{cat.skills.join(' • ')}</Text>
          </View>
        ))}
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
        <SectionHeader title={design.sectionSettings.projects?.customTitle || 'Projects'} />
        {entries.map(project => {
          const bullets = (project.bullets || []).filter(b => b.enabled !== false)
          return (
            <View key={project.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{project.name}</Text>
              </View>
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
            <View style={styles.simpleEntryLeft}>
              {cert.nameEnabled !== false && <Text style={styles.entryTitle}>{cert.name}</Text>}
              {cert.issuerEnabled !== false && cert.issuer && (
                <Text style={styles.entrySubtitle}> - {cert.issuer}</Text>
              )}
            </View>
            {cert.dateEnabled !== false && cert.date && (
              <Text style={styles.entryDate}>{formatDate(cert.date, design.dateFormat)}</Text>
            )}
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
        <SectionHeader title={design.sectionSettings.awards?.customTitle || 'Awards & Honors'} />
        {entries.map(award => (
          <View key={award.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={styles.simpleEntryLeft}>
                <Text style={styles.entryTitle}>{award.title}</Text>
                {award.issuer && <Text style={styles.entrySubtitle}> - {award.issuer}</Text>}
              </View>
              {award.date && <Text style={styles.entryDate}>{formatDate(award.date, design.dateFormat)}</Text>}
            </View>
            {award.description && <Text style={styles.bulletText}>{award.description}</Text>}
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

    return (
      <View style={styles.section}>
        <SectionHeader title={design.sectionSettings.languages?.customTitle || 'Languages'} />
        <Text style={styles.skillsList}>
          {entries.map(l => `${l.language}${l.fluency ? ` (${l.fluency})` : ''}`).join(' • ')}
        </Text>
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
        <SectionHeader title={design.sectionSettings.volunteer?.customTitle || 'Volunteer Experience'} />
        {entries.map(vol => {
          const dateRange = formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)
          return (
            <View key={vol.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleRow}>
                  <Text style={styles.entryTitle}>{vol.role}</Text>
                  {vol.organization && <Text style={styles.entrySubtitle}> | {vol.organization}</Text>}
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
        <SectionHeader title={design.sectionSettings.publications?.customTitle || 'Publications'} />
        {entries.map(pub => (
          <View key={pub.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={styles.simpleEntryLeft}>
                <Text style={styles.entryTitle}>{pub.title}</Text>
                {pub.publisher && <Text style={styles.entrySubtitle}> - {pub.publisher}</Text>}
              </View>
              {pub.date && <Text style={styles.entryDate}>{formatDate(pub.date, design.dateFormat)}</Text>}
            </View>
            {pub.description && <Text style={styles.bulletText}>{pub.description}</Text>}
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

export default ProfessionalTemplate
