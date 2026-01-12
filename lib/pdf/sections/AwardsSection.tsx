// lib/pdf/sections/AwardsSection.tsx
// Awards section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { AwardEntry } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'
import { formatDate } from '../utils/dateFormatter'

interface AwardsSectionProps {
  entries: AwardEntry[]
  design: ResumeDesign
}

export function AwardsSection({ entries, design }: AwardsSectionProps) {
  const sectionSettings = design.sectionSettings.awards

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
    title: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    issuer: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
    },
    date: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    description: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      marginTop: 2,
      lineHeight: 1.4,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  const title = sectionSettings?.customTitle || 'Awards'

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {enabledEntries.map((entry) => {
        const dateStr = formatDate(entry.date, design.dateFormat)

        return (
          <View key={entry.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={styles.row}>
                {entry.titleEnabled !== false && (
                  <Text style={styles.title}>{entry.title}</Text>
                )}
                {entry.issuerEnabled !== false && entry.issuer && (
                  <Text style={styles.issuer}> - {entry.issuer}</Text>
                )}
              </View>
              {entry.dateEnabled !== false && dateStr && (
                <Text style={styles.date}>{dateStr}</Text>
              )}
            </View>

            {entry.descriptionEnabled !== false && entry.description && (
              <Text style={styles.description}>{entry.description}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}
