// lib/pdf/sections/ProjectsSection.tsx
// Projects section for PDF resume

import React from 'react'
import { View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { ProjectEntry } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'
import { extractPlainText } from '../utils/richTextToPlain'

interface ProjectsSectionProps {
  entries: ProjectEntry[]
  design: ResumeDesign
}

export function ProjectsSection({ entries, design }: ProjectsSectionProps) {
  const sectionSettings = design.sectionSettings.projects

  // Filter enabled entries
  const enabledEntries = entries.filter((e) => e.enabled !== false)

  // Don't render if section disabled or no entries
  if (sectionSettings?.enabled === false || enabledEntries.length === 0) {
    return null
  }

  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)

  const styles = StyleSheet.create({
    container: {
      marginBottom: computed.spacing.section,
    },
    header: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 8,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 1,
      }),
      ...(design.headingStyle === 'underline' && {
        borderBottomWidth: 1,
        borderBottomColor: computed.colors.accent,
        paddingBottom: 3,
      }),
    },
    entry: {
      marginBottom: computed.spacing.item,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    link: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.accent,
      textDecoration: 'none',
    },
    description: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      marginBottom: 4,
      lineHeight: 1.4,
    },
    technologies: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      marginTop: 2,
    },
    bulletList: {
      marginTop: 4,
      paddingLeft: 2,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: computed.spacing.bullet,
    },
    bulletMarker: {
      width: 10,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    bulletText: {
      flex: 1,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },
  })

  const title = sectionSettings?.customTitle || 'Projects'

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {enabledEntries.map((entry) => {
        const enabledBullets = entry.bullets?.filter((b) => b.enabled !== false) || []

        return (
          <View key={entry.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              {entry.nameEnabled !== false && (
                <Text style={styles.name}>{entry.name}</Text>
              )}
              {entry.linkEnabled !== false && entry.link && (
                <Link src={entry.link} style={styles.link}>
                  {entry.link.replace(/^https?:\/\//, '')}
                </Link>
              )}
            </View>

            {entry.descriptionEnabled !== false && entry.description && (
              <Text style={styles.description}>{entry.description}</Text>
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

            {entry.technologiesEnabled !== false && entry.technologies && entry.technologies.length > 0 && (
              <Text style={styles.technologies}>
                Technologies: {entry.technologies.join(', ')}
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )
}
