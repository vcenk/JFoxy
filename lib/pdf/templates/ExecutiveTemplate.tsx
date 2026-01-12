// lib/pdf/templates/ExecutiveTemplate.tsx
// Executive template: Bold header, Right Sidebar, Professional layout

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
 * Executive Template
 * Two-column layout with right sidebar and bold full-width header.
 * Best for: Senior roles, Managers, Executives who want to highlight expertise.
 */
export function ExecutiveTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15

  // Theme colors
  const headerBg = computed.colors.primary
  const headerText = '#ffffff'

  // Page margins
  const pageMargin = {
    top: computed.page.paddingTop,
    right: computed.page.paddingRight,
    bottom: computed.page.paddingBottom,
    left: computed.page.paddingLeft,
  }

  const styles = StyleSheet.create({
    page: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
      // Apply consistent padding on all pages
      paddingTop: pageMargin.top,
      paddingRight: pageMargin.right,
      paddingBottom: pageMargin.bottom,
      paddingLeft: pageMargin.left,
    },

    // Header - uses negative margins to extend full width
    headerPanel: {
      backgroundColor: headerBg,
      // Negative margins to extend beyond page padding
      marginTop: -pageMargin.top,
      marginLeft: -pageMargin.left,
      marginRight: -pageMargin.right,
      // Internal padding
      paddingTop: pageMargin.top,
      paddingLeft: pageMargin.left,
      paddingRight: pageMargin.right,
      paddingBottom: 20,
      marginBottom: computed.spacing.section,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerContent: {
      flex: 1,
      paddingRight: 20,
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name,
      fontWeight: 700,
      color: headerText,
      marginBottom: 10,
      letterSpacing: 0.5,
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      color: 'rgba(255,255,255,0.9)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 14,
    },

    // Contact Info (Right side of header)
    contactPanel: {
      width: '35%',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 3,
      textAlign: 'right',
    },
    contactLink: {
      textDecoration: 'none',
      color: 'rgba(255,255,255,0.9)',
    },

    // Main Content Layout - two columns
    contentContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    leftColumn: {
      flex: 1,
      paddingRight: 20,
    },
    rightColumn: {
      width: '28%',
      paddingLeft: 12,
      borderLeftWidth: 1,
      borderLeftColor: computed.colors.muted,
    },

    // Section Styling for main column
    section: {
      marginBottom: computed.spacing.section,
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: computed.colors.muted,
      marginBottom: 8,
      paddingBottom: 3,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },

    // Sidebar section styling
    sidebarSection: {
      marginBottom: computed.spacing.section,
    },
    sidebarTitle: {
      fontFamily,
      fontSize: computed.fonts.section - 1,
      fontWeight: 700,
      color: computed.colors.primary,
      borderBottomWidth: 1,
      borderBottomColor: computed.colors.accent,
      marginBottom: 6,
      paddingBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Sidebar Items
    skillCategory: {
      marginBottom: 6,
    },
    skillCategoryTitle: {
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: computed.colors.text,
      marginBottom: 2,
    },
    skillList: {
      fontSize: computed.fonts.small,
      color: computed.colors.text,
      lineHeight: 1.4,
    },

    // Summary
    summaryText: {
      fontSize: computed.fonts.body,
      lineHeight,
      textAlign: 'justify',
    },

    // Education & other sidebar entries
    sidebarEntry: {
      marginBottom: 8,
    },
    sidebarEntryTitle: {
      fontSize: computed.fonts.body - 1,
      fontWeight: 700,
      color: computed.colors.text,
    },
    sidebarEntrySubtitle: {
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    sidebarEntryDate: {
      fontSize: computed.fonts.small - 1,
      color: computed.colors.muted,
      fontStyle: 'italic',
    },

    // Experience entries
    entry: {
      marginBottom: computed.spacing.item,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    titleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flex: 1,
    },
    position: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    company: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    location: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
    },
    dateRange: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    bulletList: {
      marginTop: 4,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: computed.spacing.bullet,
    },
    bulletMarker: {
      width: 10,
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
  })

  // Contact Info Component
  const ContactInfo = () => {
    const c = data.contact || {}

    // Helper to clean URL and extract username/path (handles with or without protocol)
    const cleanLinkedIn = (value: string) => {
      return value
        .replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
        .replace(/\/$/, '')
    }
    const cleanGitHub = (value: string) => {
      return value
        .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
        .replace(/\/$/, '')
    }
    const cleanUrl = (value: string) => {
      return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }

    return (
      <View style={styles.contactPanel}>
        {c.email && c.emailEnabled !== false && (
          <Link src={`mailto:${c.email}`} style={[styles.contactItem, styles.contactLink]}>
            {c.email}
          </Link>
        )}
        {c.phone && c.phoneEnabled !== false && (
          <Text style={styles.contactItem}>{c.phone}</Text>
        )}
        {c.location && c.locationEnabled !== false && (
          <Text style={styles.contactItem}>{c.location}</Text>
        )}
        {c.linkedin && c.linkedinEnabled !== false && (() => {
          const username = cleanLinkedIn(c.linkedin)
          const url = `https://linkedin.com/in/${username}`
          return (
            <Link src={url} style={[styles.contactItem, styles.contactLink]}>
              linkedin.com/in/{username}
            </Link>
          )
        })()}
        {c.github && c.githubEnabled !== false && (() => {
          const username = cleanGitHub(c.github)
          const url = `https://github.com/${username}`
          return (
            <Link src={url} style={[styles.contactItem, styles.contactLink]}>
              github.com/{username}
            </Link>
          )
        })()}
        {c.portfolio && c.portfolioEnabled !== false && (() => {
          const url = c.portfolio.startsWith('http') ? c.portfolio : `https://${c.portfolio}`
          return (
            <Link src={url} style={[styles.contactItem, styles.contactLink]}>
              {cleanUrl(c.portfolio)}
            </Link>
          )
        })()}
      </View>
    )
  }

  // Skills Section
  const RenderSkills = () => {
    if (design.sectionSettings.skills?.enabled === false) return null

    const categories: { name: string; skills: string[] }[] = []

    if (data.skills.technical?.length) {
      const skills = data.skills.technical.filter((s) => s.enabled !== false).map((s) => s.name)
      if (skills.length) categories.push({ name: 'Technical', skills })
    } else if (data.skills.technicalLegacy?.length) {
      categories.push({ name: 'Technical', skills: data.skills.technicalLegacy })
    }

    if (data.skills.soft?.length) {
      const skills = data.skills.soft.filter((s) => s.enabled !== false).map((s) => s.name)
      if (skills.length) categories.push({ name: 'Soft Skills', skills })
    } else if (data.skills.softLegacy?.length) {
      categories.push({ name: 'Soft Skills', skills: data.skills.softLegacy })
    }

    if (categories.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.skills?.customTitle || 'Skills'}
        </Text>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.skillCategory}>
            <Text style={styles.skillCategoryTitle}>{cat.name}</Text>
            <Text style={styles.skillList}>{cat.skills.join(', ')}</Text>
          </View>
        ))}
      </View>
    )
  }

  // Education Section
  const RenderEducation = () => {
    if (design.sectionSettings.education?.enabled === false) return null
    const entries = (data.education || []).filter((e) => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.education?.customTitle || 'Education'}
        </Text>
        {entries.map((edu) => (
          <View key={edu.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{edu.institution}</Text>
            <Text style={styles.sidebarEntrySubtitle}>
              {edu.degree}
              {edu.field ? ` in ${edu.field}` : ''}
            </Text>
            {edu.graduationDate && (
              <Text style={styles.sidebarEntryDate}>
                {formatDate(edu.graduationDate, design.dateFormat)}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Certifications Section
  const RenderCertifications = () => {
    if (design.sectionSettings.certifications?.enabled === false) return null
    const entries = (data.certifications || []).filter((c) => c.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.certifications?.customTitle || 'Certifications'}
        </Text>
        {entries.map((cert) => (
          <View key={cert.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{cert.name}</Text>
            {cert.issuer && <Text style={styles.sidebarEntrySubtitle}>{cert.issuer}</Text>}
            {cert.date && (
              <Text style={styles.sidebarEntryDate}>
                {formatDate(cert.date, design.dateFormat)}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Awards Section
  const RenderAwards = () => {
    if (design.sectionSettings.awards?.enabled === false) return null
    const entries = (data.awards || []).filter((a) => a.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.awards?.customTitle || 'Awards'}
        </Text>
        {entries.map((award) => (
          <View key={award.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{award.title}</Text>
            {award.issuer && <Text style={styles.sidebarEntrySubtitle}>{award.issuer}</Text>}
            {award.date && (
              <Text style={styles.sidebarEntryDate}>
                {formatDate(award.date, design.dateFormat)}
              </Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Languages Section
  const RenderLanguages = () => {
    if (design.sectionSettings.languages?.enabled === false) return null
    const entries = (data.languages || []).filter((l) => l.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.sidebarSection}>
        <Text style={styles.sidebarTitle}>
          {design.sectionSettings.languages?.customTitle || 'Languages'}
        </Text>
        {entries.map((lang) => (
          <View key={lang.id} style={styles.sidebarEntry}>
            <Text style={styles.sidebarEntryTitle}>{lang.language}</Text>
            {lang.fluency && <Text style={styles.sidebarEntrySubtitle}>{lang.fluency}</Text>}
          </View>
        ))}
      </View>
    )
  }

  // Experience Section (inline for consistent styling)
  const RenderExperience = () => {
    if (design.sectionSettings.experience?.enabled === false) return null
    const entries = (data.experience || []).filter((e) => e.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.experience?.customTitle || 'Experience'}
        </Text>
        {entries.map((entry) => {
          const enabledBullets = entry.bullets.filter((b) => b.enabled !== false)
          const dateRange = formatDateRange(
            entry.startDate,
            entry.endDate,
            entry.current,
            design.dateFormat
          )

          return (
            <View key={entry.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.titleRow}>
                  {entry.positionEnabled !== false && (
                    <Text style={styles.position}>{entry.position}</Text>
                  )}
                  {entry.companyEnabled !== false && entry.company && (
                    <>
                      <Text style={styles.company}> at </Text>
                      <Text style={styles.company}>{entry.company}</Text>
                    </>
                  )}
                  {entry.locationEnabled !== false && entry.location && (
                    <Text style={styles.location}> | {entry.location}</Text>
                  )}
                </View>
                {entry.dateEnabled !== false && dateRange && (
                  <Text style={styles.dateRange}>{dateRange}</Text>
                )}
              </View>

              {enabledBullets.length > 0 && (
                <View style={styles.bulletList}>
                  {enabledBullets.map((bullet) => {
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

  // Projects Section
  const RenderProjects = () => {
    if (design.sectionSettings.projects?.enabled === false) return null
    const entries = (data.projects || []).filter((p) => p.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.projects?.customTitle || 'Projects'}
        </Text>
        {entries.map((project) => {
          const enabledBullets = (project.bullets || []).filter((b) => b.enabled !== false)

          return (
            <View key={project.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.position}>{project.name}</Text>
              </View>
              {project.description && !isEmptyContent(project.description) && (
                <Text style={styles.bulletText}>
                  {extractPlainText(project.description).trim()}
                </Text>
              )}
              {enabledBullets.length > 0 && (
                <View style={styles.bulletList}>
                  {enabledBullets.map((bullet) => {
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

  // Volunteer Section
  const RenderVolunteer = () => {
    if (design.sectionSettings.volunteer?.enabled === false) return null
    const entries = (data.volunteer || []).filter((v) => v.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.volunteer?.customTitle || 'Volunteer'}
        </Text>
        {entries.map((vol) => {
          const dateRange = formatDateRange(
            vol.startDate,
            vol.endDate,
            vol.current,
            design.dateFormat
          )

          return (
            <View key={vol.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.position}>{vol.role}</Text>
                  {vol.organization && (
                    <>
                      <Text style={styles.company}> at </Text>
                      <Text style={styles.company}>{vol.organization}</Text>
                    </>
                  )}
                </View>
                {dateRange && <Text style={styles.dateRange}>{dateRange}</Text>}
              </View>
              {vol.description && !isEmptyContent(vol.description) && (
                <Text style={styles.bulletText}>
                  {extractPlainText(vol.description).trim()}
                </Text>
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // Publications Section
  const RenderPublications = () => {
    if (design.sectionSettings.publications?.enabled === false) return null
    const entries = (data.publications || []).filter((p) => p.enabled !== false)
    if (entries.length === 0) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {design.sectionSettings.publications?.customTitle || 'Publications'}
        </Text>
        {entries.map((pub) => (
          <View key={pub.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={styles.titleRow}>
                <Text style={styles.position}>{pub.title}</Text>
                {pub.publisher && (
                  <>
                    <Text style={styles.company}> - </Text>
                    <Text style={styles.company}>{pub.publisher}</Text>
                  </>
                )}
              </View>
              {pub.date && (
                <Text style={styles.dateRange}>{formatDate(pub.date, design.dateFormat)}</Text>
              )}
            </View>
            {pub.description && (
              <Text style={styles.bulletText}>{pub.description}</Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={styles.page}>
        {/* Header (Full Width with Background) */}
        <View style={styles.headerPanel} fixed={false}>
          <View style={styles.headerContent}>
            {data.contact?.nameEnabled !== false && (
              <Text style={styles.name}>{data.contact?.name || 'Your Name'}</Text>
            )}
            {data.targetTitle && <Text style={styles.targetTitle}>{data.targetTitle}</Text>}
          </View>
          <ContactInfo />
        </View>

        {/* Two Column Layout */}
        <View style={styles.contentContainer}>
          {/* Main Column (Left) */}
          <View style={styles.leftColumn}>
            {/* Summary */}
            {!isEmptyContent(data.summary) &&
              data.summaryEnabled !== false &&
              design.sectionSettings.summary?.enabled !== false && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {design.sectionSettings.summary?.customTitle || 'Professional Summary'}
                  </Text>
                  <Text style={styles.summaryText}>{extractPlainText(data.summary).trim()}</Text>
                </View>
              )}

            <RenderExperience />
            <RenderProjects />
            <RenderVolunteer />
            <RenderPublications />
          </View>

          {/* Sidebar Column (Right) */}
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

export default ExecutiveTemplate
