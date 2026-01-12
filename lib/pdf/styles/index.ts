// lib/pdf/styles/index.ts
// Shared style utilities for React-PDF

import { StyleSheet } from '@react-pdf/renderer'
import { ResumeDesign, ComputedStyles, HeadingStyle } from '../types'
import {
  MARGIN_PRESETS,
  FONT_SIZE_PRESETS,
  SPACING_PRESETS,
  getColorPreset,
  getFontFamily,
} from './presets'

// Compute styles from design settings
export function computeStyles(design: ResumeDesign): ComputedStyles {
  // Use custom margins if provided, otherwise use preset (with fallback to 'normal')
  const presetMargins = MARGIN_PRESETS[design.margins] || MARGIN_PRESETS.normal
  const margins = design.customMargins || presetMargins

  // Use preset fonts with fallback to 'normal'
  const presetFonts = FONT_SIZE_PRESETS[design.fontSize] || FONT_SIZE_PRESETS.normal

  // Use custom font sizes if provided, otherwise use preset with small derived
  const fonts = design.customFontSizes
    ? {
        ...design.customFontSizes,
        small: Math.max(7, design.customFontSizes.body - 1), // Derive small from body
      }
    : presetFonts

  // Use custom spacing if provided, otherwise use preset (with fallback to 'normal')
  const presetSpacing = SPACING_PRESETS[design.sectionSpacing] || SPACING_PRESETS.normal
  const spacing = design.customSpacing
    ? {
        section: design.customSpacing.section,
        item: design.customSpacing.item,
        bullet: Math.max(1, Math.round(design.customSpacing.item / 2)), // Derive bullet from item
      }
    : presetSpacing

  const colors = design.customAccentColor
    ? { ...getColorPreset(design.colorPresetId), accent: design.customAccentColor }
    : getColorPreset(design.colorPresetId)

  return {
    page: {
      paddingTop: margins.top,
      paddingRight: margins.right,
      paddingBottom: margins.bottom,
      paddingLeft: margins.left,
    },
    fonts,
    spacing,
    colors,
  }
}

// Create base page styles
export function createPageStyles(design: ResumeDesign) {
  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15 // Default line height

  return StyleSheet.create({
    page: {
      ...computed.page,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
    },
  })
}

// Create section header styles
export function createSectionHeaderStyles(design: ResumeDesign) {
  const computed = computeStyles(design)

  const baseStyle = {
    fontSize: computed.fonts.section,
    fontWeight: 700 as const,
    color: computed.colors.primary,
    marginBottom: 6,
    paddingBottom: 3,
  }

  // Apply heading style variations
  const headingVariations: Record<HeadingStyle, object> = {
    bold: {},
    caps: {
      textTransform: 'uppercase' as const,
      letterSpacing: 1,
      fontSize: computed.fonts.section - 1,
    },
    underline: {
      borderBottomWidth: 1,
      borderBottomColor: computed.colors.accent,
    },
  }

  return StyleSheet.create({
    header: {
      ...baseStyle,
      ...headingVariations[design.headingStyle],
    },
  })
}

// Create typography styles
export function createTypographyStyles(design: ResumeDesign) {
  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15

  return StyleSheet.create({
    name: {
      fontFamily,
      fontSize: computed.fonts.name,
      fontWeight: 700,
      color: computed.colors.primary,
    },
    sectionTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 6,
    },
    bodyText: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight,
    },
    smallText: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
    },
    boldText: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
    },
    link: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.accent,
      textDecoration: 'none',
    },
  })
}

// Create spacing styles
export function createSpacingStyles(design: ResumeDesign) {
  const computed = computeStyles(design)

  return StyleSheet.create({
    section: {
      marginBottom: computed.spacing.section,
    },
    item: {
      marginBottom: computed.spacing.item,
    },
    bullet: {
      marginBottom: computed.spacing.bullet,
    },
  })
}

// Common layout styles
export const layoutStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: {
    flexDirection: 'column',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  center: {
    alignItems: 'center',
  },
  flexGrow: {
    flexGrow: 1,
  },
})

// Bullet point styles
export const bulletStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  marker: {
    width: 10,
    marginRight: 4,
  },
  content: {
    flex: 1,
  },
})

export * from './presets'
