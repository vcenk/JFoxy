// lib/pdf/templates/ModernTemplate.tsx
// Modern two-column resume template with sidebar

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
 * Modern Template
 * Two-column layout with left sidebar for contact/skills
 * Best for: Tech, design, modern industries
 */
export function ModernTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15

  const sidebarWidth = 180
  const sidebarPadding = 16
  const pageMargin = computed.page.paddingTop

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
      // Apply consistent padding on Page for all pages
      paddingTop: pageMargin,
      paddingBottom: pageMargin,
    },
    sidebar: {
      width: sidebarWidth,
      backgroundColor: computed.colors.primary,
      paddingHorizontal: sidebarPadding,
      paddingBottom: sidebarPadding,
      color: '#ffffff',
      // Extend sidebar to top edge using negative margin
      marginTop: -pageMargin,
      paddingTop: pageMargin,
    },
    main: {
      flex: 1,
      paddingRight: pageMargin,
      paddingLeft: 24,
    },
    // Sidebar styles
    sidebarName: {
      fontFamily,
      fontSize: computed.fonts.name - 4,
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: 10,
    },
    sidebarTitle: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 16,
    },
    sidebarSection: {
      marginBottom: 16,
    },
    sidebarHeader: {
      fontFamily,
      fontSize: computed.fonts.small,
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sidebarText: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 4,
      lineHeight,
    },
    sidebarLink: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: 'rgba(255,255,255,0.9)',
      textDecoration: 'none',
      marginBottom: 4,
    },
    skillItem: {
      fontFamily,
      fontSize: computed.fonts.small - 1,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: 3,
    },
    // Main content styles
    mainHeader: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 10,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: computed.colors.accent,
    },
    mainSection: {
      marginBottom: computed.spacing.section,
    },
    entry: {
      marginBottom: computed.spacing.item,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
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
      color: computed.colors.muted,
    },
    entryDate: {
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
      width: 8,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.accent,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
    summaryText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
  })

  // Render sidebar
  const renderSidebar = () => {
    const contact = data.contact

    // Get all skills
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
      <View style={styles.sidebar}>
        {/* Name */}
        {contact.name && contact.nameEnabled !== false && (
          <Text style={styles.sidebarName}>{contact.name}</Text>
        )}
        {data.targetTitle && (
          <Text style={styles.sidebarTitle}>{data.targetTitle}</Text>
        )}

        {/* Contact Section */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarHeader}>{design.sectionSettings.contact?.customTitle || 'Contact'}</Text>
          {contact.location && contact.locationEnabled !== false && (
            <Text style={styles.sidebarText}>{contact.location}</Text>
          )}
          {contact.email && contact.emailEnabled !== false && (
            <Link src={`mailto:${contact.email}`} style={styles.sidebarLink}>
              {contact.email}
            </Link>
          )}
          {contact.phone && contact.phoneEnabled !== false && (
            <Text style={styles.sidebarText}>{contact.phone}</Text>
          )}
          {contact.linkedin && contact.linkedinEnabled !== false && (() => {
            const cleanUsername = contact.linkedin
              .replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
              .replace(/\/$/, '')
            return (
              <Link src={`https://linkedin.com/in/${cleanUsername}`} style={styles.sidebarLink}>
                linkedin.com/in/{cleanUsername}
              </Link>
            )
          })()}
          {contact.github && contact.githubEnabled !== false && (() => {
            const cleanUsername = contact.github
              .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
              .replace(/\/$/, '')
            return (
              <Link src={`https://github.com/${cleanUsername}`} style={styles.sidebarLink}>
                github.com/{cleanUsername}
              </Link>
            )
          })()}
        </View>

        {/* Skills Section */}
        {allSkills.length > 0 && design.sectionSettings.skills?.enabled !== false && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeader}>{design.sectionSettings.skills?.customTitle || 'Skills'}</Text>
            {allSkills.slice(0, 15).map((skill, i) => (
              <Text key={i} style={styles.skillItem}>• {skill}</Text>
            ))}
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && design.sectionSettings.languages?.enabled !== false && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeader}>Languages</Text>
            {data.languages.filter(l => l.enabled !== false).map((lang) => (
              <Text key={lang.id} style={styles.skillItem}>
                {lang.language}{lang.fluency ? ` - ${lang.fluency}` : ''}
              </Text>
            ))}
          </View>
        )}
      </View>
    )
  }

  // Render main content
  const renderMain = () => {
    return (
      <View style={styles.main}>
        {/* Summary */}
        {!isEmptyContent(data.summary) && data.summaryEnabled !== false && design.sectionSettings.summary?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.summary?.customTitle || 'Summary'}
            </Text>
            <Text style={styles.summaryText}>
              {extractPlainText(data.summary).trim()}
            </Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.filter(e => e.enabled !== false).length > 0 && design.sectionSettings.experience?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.experience?.customTitle || 'Experience'}
            </Text>
            {data.experience.filter(e => e.enabled !== false).map((exp) => (
              <View key={exp.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{exp.position}</Text>
                    <Text style={styles.entrySubtitle}>{exp.company}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, design.dateFormat)}
                  </Text>
                </View>
                <View style={styles.bulletList}>
                  {exp.bullets.filter(b => b.enabled !== false).map((bullet) => {
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
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.filter(e => e.enabled !== false).length > 0 && design.sectionSettings.education?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.education?.customTitle || 'Education'}
            </Text>
            {data.education.filter(e => e.enabled !== false).map((edu) => (
              <View key={edu.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{edu.degree} in {edu.field}</Text>
                    <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDate(edu.graduationDate, design.dateFormat)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.filter(p => p.enabled !== false).length > 0 && design.sectionSettings.projects?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.projects?.customTitle || 'Projects'}
            </Text>
            {data.projects.filter(p => p.enabled !== false).map((project) => (
              <View key={project.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{project.name}</Text>
                </View>
                {project.description && !isEmptyContent(project.description) && (
                  <Text style={styles.summaryText}>{extractPlainText(project.description).trim()}</Text>
                )}
                {project.bullets && project.bullets.filter(b => b.enabled !== false).length > 0 && (
                  <View style={styles.bulletList}>
                    {project.bullets.filter(b => b.enabled !== false).map((bullet) => {
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
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.filter(c => c.enabled !== false).length > 0 && design.sectionSettings.certifications?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.certifications?.customTitle || 'Certifications'}
            </Text>
            {data.certifications.filter(c => c.enabled !== false).map((cert) => (
              <View key={cert.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{cert.name}</Text>
                    {cert.issuer && <Text style={styles.entrySubtitle}>{cert.issuer}</Text>}
                  </View>
                  {cert.date && (
                    <Text style={styles.entryDate}>{formatDate(cert.date, design.dateFormat)}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Awards */}
        {data.awards && data.awards.filter(a => a.enabled !== false).length > 0 && design.sectionSettings.awards?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.awards?.customTitle || 'Awards'}
            </Text>
            {data.awards.filter(a => a.enabled !== false).map((award) => (
              <View key={award.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{award.title}</Text>
                    {award.issuer && <Text style={styles.entrySubtitle}>{award.issuer}</Text>}
                  </View>
                  {award.date && (
                    <Text style={styles.entryDate}>{formatDate(award.date, design.dateFormat)}</Text>
                  )}
                </View>
                {award.description && (
                  <Text style={styles.summaryText}>{award.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Volunteer */}
        {data.volunteer && data.volunteer.filter(v => v.enabled !== false).length > 0 && design.sectionSettings.volunteer?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.volunteer?.customTitle || 'Volunteer'}
            </Text>
            {data.volunteer.filter(v => v.enabled !== false).map((vol) => (
              <View key={vol.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{vol.role}</Text>
                    {vol.organization && <Text style={styles.entrySubtitle}>{vol.organization}</Text>}
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDateRange(vol.startDate, vol.endDate, vol.current, design.dateFormat)}
                  </Text>
                </View>
                {vol.description && !isEmptyContent(vol.description) && (
                  <Text style={styles.summaryText}>{extractPlainText(vol.description).trim()}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {data.publications && data.publications.filter(p => p.enabled !== false).length > 0 && design.sectionSettings.publications?.enabled !== false && (
          <View style={styles.mainSection}>
            <Text style={styles.mainHeader}>
              {design.sectionSettings.publications?.customTitle || 'Publications'}
            </Text>
            {data.publications.filter(p => p.enabled !== false).map((pub) => (
              <View key={pub.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{pub.title}</Text>
                    {pub.publisher && <Text style={styles.entrySubtitle}>{pub.publisher}</Text>}
                  </View>
                  {pub.date && (
                    <Text style={styles.entryDate}>{formatDate(pub.date, design.dateFormat)}</Text>
                  )}
                </View>
                {pub.description && (
                  <Text style={styles.summaryText}>{pub.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={styles.page}>
        {renderSidebar()}
        {renderMain()}
        <PageNumber design={design} />
      </Page>
    </Document>
  )
}

export default ModernTemplate
