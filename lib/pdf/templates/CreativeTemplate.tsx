// lib/pdf/templates/CreativeTemplate.tsx
// Creative template: Bold header, accent boxes, modern styling

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
 * Creative Template
 * Bold header with accent color, modern card-style sections.
 * Best for: Creative industries, startups, tech, design roles.
 */
export function CreativeTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15

  // Page margins for bleed calculations
  const pageMargin = {
    top: computed.page.paddingTop,
    right: computed.page.paddingRight,
    bottom: computed.page.paddingBottom,
    left: computed.page.paddingLeft,
  }

  const styles = StyleSheet.create({
    page: {
      paddingTop: pageMargin.top,
      paddingRight: pageMargin.right,
      paddingBottom: pageMargin.bottom,
      paddingLeft: pageMargin.left,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
    },

    // Bold full-width header
    headerContainer: {
      marginTop: -pageMargin.top,
      marginLeft: -pageMargin.left,
      marginRight: -pageMargin.right,
      backgroundColor: computed.colors.primary,
      paddingTop: pageMargin.top + 10,
      paddingBottom: 20,
      paddingHorizontal: pageMargin.left,
      marginBottom: computed.spacing.section,
    },
    headerContent: {
      alignItems: 'center',
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name + 4,
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: 10,
      letterSpacing: 1,
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section + 2,
      color: 'rgba(255,255,255,0.85)',
      marginBottom: 14,
      fontWeight: 500,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 8,
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: 'rgba(255,255,255,0.9)',
      marginHorizontal: 8,
      marginBottom: 2,
    },
    contactLink: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: 'rgba(255,255,255,0.9)',
      textDecoration: 'none',
      marginHorizontal: 8,
      marginBottom: 2,
    },

    // Accent bar for sections
    sectionContainer: {
      marginBottom: computed.spacing.section,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionAccent: {
      width: 4,
      height: 18,
      backgroundColor: computed.colors.accent,
      marginRight: 10,
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 2,
      }),
    },

    // Summary box
    summaryBox: {
      backgroundColor: `${computed.colors.accent}15`,
      padding: 12,
      borderRadius: 4,
      borderLeftWidth: 3,
      borderLeftColor: computed.colors.accent,
    },
    summaryText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },

    // Entry card style
    entry: {
      marginBottom: computed.spacing.item,
      paddingBottom: computed.spacing.item,
      borderBottomWidth: 1,
      borderBottomColor: `${computed.colors.muted}40`,
    },
    entryLast: {
      borderBottomWidth: 0,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    entryTitleContainer: {
      flex: 1,
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
      fontWeight: 500,
    },
    entryLocation: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    entryDateBadge: {
      backgroundColor: computed.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 3,
    },
    entryDateText: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: '#ffffff',
      fontWeight: 500,
    },

    // Bullets
    bulletList: {
      marginTop: 6,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: computed.spacing.bullet + 1,
    },
    bulletMarker: {
      width: 16,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.accent,
      fontWeight: 700,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },

    // Skills grid
    skillsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillTag: {
      backgroundColor: `${computed.colors.accent}20`,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: computed.colors.accent,
    },
    skillTagText: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.primary,
    },

    // Two column layout for smaller sections
    twoColumnContainer: {
      flexDirection: 'row',
      gap: 20,
    },
    column: {
      flex: 1,
    },

    // Simple list items
    listItem: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    listMarker: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.accent,
      marginRight: 6,
    },
    listText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    listSubtext: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
  })

  // Helper to clean URLs
  const cleanLinkedIn = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
  const cleanGitHub = (value: string) =>
    value.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '')
  const cleanUrl = (value: string) =>
    value.replace(/^https?:\/\//, '').replace(/\/$/, '')

  // Section header component
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )

  // Header
  const RenderHeader = () => {
    const c = data.contact || {}
    const displayName = c.name || [c.firstName, c.lastName].filter(Boolean).join(' ')

    const contactItems: React.ReactNode[] = []

    if (c.email && c.emailEnabled !== false) {
      contactItems.push(
        <Link key="email" src={`mailto:${c.email}`} style={styles.contactLink}>{c.email}</Link>
      )
    }
    if (c.phone && c.phoneEnabled !== false) {
      contactItems.push(<Text key="phone" style={styles.contactItem}>{c.phone}</Text>)
    }
    if (c.location && c.locationEnabled !== false) {
      contactItems.push(<Text key="location" style={styles.contactItem}>{c.location}</Text>)
    }
    if (c.linkedin && c.linkedinEnabled !== false) {
      const username = cleanLinkedIn(c.linkedin)
      contactItems.push(
        <Link key="linkedin" src={`https://linkedin.com/in/${username}`} style={styles.contactLink}>
          linkedin.com/in/{username}
        </Link>
      )
    }
    if (c.github && c.githubEnabled !== false) {
      const username = cleanGitHub(c.github)
      contactItems.push(
        <Link key="github" src={`https://github.com/${username}`} style={styles.contactLink}>
          github.com/{username}
        </Link>
      )
    }
    if (c.portfolio && c.portfolioEnabled !== false) {
      const clean = cleanUrl(c.portfolio)
      contactItems.push(
        <Link key="portfolio" src={`https://${clean}`} style={styles.contactLink}>{clean}</Link>
      )
    }

    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          {displayName && c.nameEnabled !== false && (
            <Text style={styles.name}>{displayName}</Text>
          )}
          {data.targetTitle && <Text style={styles.targetTitle}>{data.targetTitle}</Text>}
          {contactItems.length > 0 && <View style={styles.contactRow}>{contactItems}</View>}
        </View>
      </View>
    )
  }

  // Summary
  const RenderSummary = () => {
    if (design.sectionSettings.summary?.enabled === false) return null
    if (isEmptyContent(data.summary) || data.summaryEnabled === false) return null

    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.summary?.customTitle || 'About Me'} />
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{extractPlainText(data.summary).trim()}</Text>
        </View>
      </View>
    )
  }

  // Experience
  const RenderExperience = () => {
    if (design.sectionSettings.experience?.enabled === false) return null
    const entries = (data.experience || []).filter(e => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.experience?.customTitle || 'Experience'} />
        {entries.map((entry, idx) => {
          const bullets = entry.bullets.filter(b => b.enabled !== false)
          const dateRange = formatDateRange(entry.startDate, entry.endDate, entry.current, design.dateFormat)
          const isLast = idx === entries.length - 1

          return (
            <View key={entry.id} style={[styles.entry, isLast ? styles.entryLast : {}]} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  {entry.positionEnabled !== false && (
                    <Text style={styles.entryTitle}>{entry.position}</Text>
                  )}
                  {entry.companyEnabled !== false && entry.company && (
                    <Text style={styles.entrySubtitle}>{entry.company}</Text>
                  )}
                  {entry.locationEnabled !== false && entry.location && (
                    <Text style={styles.entryLocation}>{entry.location}</Text>
                  )}
                </View>
                {entry.dateEnabled !== false && dateRange && (
                  <View style={styles.entryDateBadge}>
                    <Text style={styles.entryDateText}>{dateRange}</Text>
                  </View>
                )}
              </View>
              {bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {bullets.map(bullet => {
                    const text = extractPlainText(bullet.content).trim()
                    if (!text) return null
                    return (
                      <View key={bullet.id} style={styles.bulletItem}>
                        <Text style={styles.bulletMarker}>▸</Text>
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.education?.customTitle || 'Education'} />
        {entries.map((edu, idx) => {
          const isLast = idx === entries.length - 1
          return (
            <View key={edu.id} style={[styles.entry, isLast ? styles.entryLast : {}]} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  <Text style={styles.entryTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                  <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                </View>
                {edu.graduationDate && (
                  <View style={styles.entryDateBadge}>
                    <Text style={styles.entryDateText}>{formatDate(edu.graduationDate, design.dateFormat)}</Text>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  // Skills - Tag style
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.skills?.customTitle || 'Skills'} />
        <View style={styles.skillsGrid}>
          {allSkills.map((skill, i) => (
            <View key={i} style={styles.skillTag}>
              <Text style={styles.skillTagText}>{skill}</Text>
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.projects?.customTitle || 'Projects'} />
        {entries.map((project, idx) => {
          const bullets = (project.bullets || []).filter(b => b.enabled !== false)
          const isLast = idx === entries.length - 1
          return (
            <View key={project.id} style={[styles.entry, isLast ? styles.entryLast : {}]} wrap={false}>
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
                        <Text style={styles.bulletMarker}>▸</Text>
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.certifications?.customTitle || 'Certifications'} />
        {entries.map(cert => (
          <View key={cert.id} style={styles.listItem}>
            <Text style={styles.listMarker}>●</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>
                {cert.name}{cert.issuer ? ` - ${cert.issuer}` : ''}
              </Text>
              {cert.date && (
                <Text style={styles.listSubtext}>{formatDate(cert.date, design.dateFormat)}</Text>
              )}
            </View>
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.awards?.customTitle || 'Awards'} />
        {entries.map(award => (
          <View key={award.id} style={styles.listItem}>
            <Text style={styles.listMarker}>★</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>
                {award.title}{award.issuer ? ` - ${award.issuer}` : ''}
              </Text>
              {award.description && <Text style={styles.listSubtext}>{award.description}</Text>}
            </View>
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.languages?.customTitle || 'Languages'} />
        <View style={styles.skillsGrid}>
          {entries.map(lang => (
            <View key={lang.id} style={styles.skillTag}>
              <Text style={styles.skillTagText}>
                {lang.language}{lang.fluency ? ` (${lang.fluency})` : ''}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  // Volunteer
  const RenderVolunteer = () => {
    if (design.sectionSettings.volunteer?.enabled === false) return null
    const entries = (data.volunteer || []).filter(v => v.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.volunteer?.customTitle || 'Volunteer'} />
        {entries.map((vol, idx) => {
          const dateRange = formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)
          const isLast = idx === entries.length - 1
          return (
            <View key={vol.id} style={[styles.entry, isLast ? styles.entryLast : {}]} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleContainer}>
                  <Text style={styles.entryTitle}>{vol.role}</Text>
                  {vol.organization && <Text style={styles.entrySubtitle}>{vol.organization}</Text>}
                </View>
                {dateRange && (
                  <View style={styles.entryDateBadge}>
                    <Text style={styles.entryDateText}>{dateRange}</Text>
                  </View>
                )}
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
      <View style={styles.sectionContainer}>
        <SectionHeader title={design.sectionSettings.publications?.customTitle || 'Publications'} />
        {entries.map(pub => (
          <View key={pub.id} style={styles.listItem}>
            <Text style={styles.listMarker}>◆</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.listText}>
                {pub.title}{pub.publisher ? ` - ${pub.publisher}` : ''}
              </Text>
              {pub.date && (
                <Text style={styles.listSubtext}>{formatDate(pub.date, design.dateFormat)}</Text>
              )}
              {pub.description && <Text style={styles.listSubtext}>{pub.description}</Text>}
            </View>
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

export default CreativeTemplate
