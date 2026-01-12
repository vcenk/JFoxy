// lib/pdf/sections/ExperienceSection.tsx
// Work experience section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ExperienceEntry } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'
import { extractPlainText } from '../utils/richTextToPlain'
import { formatDateRange } from '../utils/dateFormatter'

interface ExperienceSectionProps {
  entries: ExperienceEntry[]
  design: ResumeDesign
}

export function ExperienceSection({ entries, design }: ExperienceSectionProps) {
  const sectionSettings = design.sectionSettings.experience

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
    titleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
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

  const title = sectionSettings?.customTitle || 'Experience'

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {enabledEntries.map((entry) => {
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
