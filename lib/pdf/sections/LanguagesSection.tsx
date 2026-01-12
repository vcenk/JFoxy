// lib/pdf/sections/LanguagesSection.tsx
// Languages section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { LanguageEntry } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'

interface LanguagesSectionProps {
  entries: LanguageEntry[]
  design: ResumeDesign
}

export function LanguagesSection({ entries, design }: LanguagesSectionProps) {
  const sectionSettings = design.sectionSettings.languages

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
    languagesInline: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    languageItem: {
      flexDirection: 'row',
    },
    language: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    fluency: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.muted,
    },
  })

  const title = sectionSettings?.customTitle || 'Languages'

  // Build language strings
  const languageStrings = enabledEntries.map((entry) => {
    if (entry.fluencyEnabled !== false && entry.fluency) {
      return `${entry.language} (${entry.fluency})`
    }
    return entry.language
  })

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.languagesInline}>
        {languageStrings.join(' • ')}
      </Text>
    </View>
  )
}
