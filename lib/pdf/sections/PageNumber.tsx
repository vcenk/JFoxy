// lib/pdf/sections/PageNumber.tsx
// Page number component for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'

interface PageNumberProps {
  design: ResumeDesign
}

/**
 * Page number component that renders on every page
 * Uses the fixed prop to appear on all pages
 */
export function PageNumber({ design }: PageNumberProps) {
  // Early return if page numbers disabled
  if (design.showPageNumbers !== true) return null

  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const position = design.pageNumberPosition || 'bottom-center'

  // Calculate positioning based on selected position
  const isTop = position === 'top-right'
  const isCenter = position === 'bottom-center'

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      // Vertical positioning
      top: isTop ? 15 : undefined,
      bottom: isTop ? undefined : 15,
      // Horizontal positioning - use both left and right for centering
      left: 0,
      right: 0,
      // Alignment
      alignItems: isCenter ? 'center' : 'flex-end',
      paddingHorizontal: 40,
    },
    text: {
      fontFamily,
      fontSize: 9,
      color: computed.colors.muted || '#888888',
    },
  })

  return (
    <View style={styles.container} fixed>
      <Text
        style={styles.text}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  )
}

export default PageNumber
