// lib/pdf/sections/EducationSection.tsx
// Education section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { EducationEntry } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'
import { formatDate } from '../utils/dateFormatter'

interface EducationSectionProps {
  entries: EducationEntry[]
  design: ResumeDesign
}

export function EducationSection({ entries, design }: EducationSectionProps) {
  const sectionSettings = design.sectionSettings.education

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
    degreeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    degree: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    field: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    institution: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
    },
    gpa: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      marginTop: 2,
    },
    date: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
  })

  const title = sectionSettings?.customTitle || 'Education'

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      {enabledEntries.map((entry) => {
        const dateStr = formatDate(entry.graduationDate, design.dateFormat)

        // Build degree string
        const degreeParts: string[] = []
        if (entry.degreeEnabled !== false && entry.degree) {
          degreeParts.push(entry.degree)
        }
        if (entry.fieldEnabled !== false && entry.field) {
          degreeParts.push(`in ${entry.field}`)
        }
        const degreeString = degreeParts.join(' ')

        return (
          <View key={entry.id} style={styles.entry} wrap={false}>
            <View style={styles.entryHeader}>
              <View style={styles.degreeRow}>
                {degreeString && (
                  <Text style={styles.degree}>{degreeString}</Text>
                )}
              </View>
              {entry.dateEnabled !== false && dateStr && (
                <Text style={styles.date}>{dateStr}</Text>
              )}
            </View>

            {entry.institutionEnabled !== false && entry.institution && (
              <Text style={styles.institution}>{entry.institution}</Text>
            )}

            {entry.gpaEnabled !== false && entry.gpa && (
              <Text style={styles.gpa}>GPA: {entry.gpa}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}
