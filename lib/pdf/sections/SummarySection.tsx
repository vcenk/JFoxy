// lib/pdf/sections/SummarySection.tsx
// Professional summary section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { RichText } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'
import { extractPlainText, isEmptyContent } from '../utils/richTextToPlain'

interface SummarySectionProps {
  summary?: RichText
  enabled?: boolean
  design: ResumeDesign
}

export function SummarySection({ summary, enabled = true, design }: SummarySectionProps) {
  // Don't render if disabled or empty
  if (!enabled || isEmptyContent(summary)) {
    return null
  }

  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const sectionSettings = design.sectionSettings.summary

  const styles = StyleSheet.create({
    container: {
      marginBottom: computed.spacing.section,
    },
    header: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 6,
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
    text: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.5,
    },
  })

  const title = sectionSettings?.customTitle || 'Professional Summary'
  const summaryText = extractPlainText(summary).trim()

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.text}>{summaryText}</Text>
    </View>
  )
}
