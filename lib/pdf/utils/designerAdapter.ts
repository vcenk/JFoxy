// lib/pdf/utils/designerAdapter.ts
// Adapter to convert old designer settings to new ResumeDesign format

import { DesignerSettings } from '@/lib/types/designer'
import {
  ResumeDesign,
  DEFAULT_DESIGN,
  MarginPreset,
  FontSizePreset,
  SpacingPreset,
  HeadingStyle,
  FontFamily,
  SectionKey,
} from '../types'

/**
 * Convert old DesignerSettings to new ResumeDesign format
 */
export function convertToResumeDesign(
  settings: Partial<DesignerSettings>,
  sectionSettings?: Record<string, { visible?: boolean; customTitle?: string }>
): ResumeDesign {
  // Convert margins to preset
  const marginsToPreset = (margins: number): MarginPreset => {
    if (margins <= 36) return 'compact'
    if (margins >= 60) return 'spacious'
    return 'normal'
  }

  // Convert font sizes to preset
  const fontSizeToPreset = (bodySize: number): FontSizePreset => {
    if (bodySize <= 9) return 'small'
    if (bodySize >= 12) return 'large'
    return 'normal'
  }

  // Convert section gap to preset
  const spacingToPreset = (gap?: number): SpacingPreset => {
    if (!gap) return 'normal'
    if (gap <= 12) return 'compact'
    if (gap >= 20) return 'relaxed'
    return 'normal'
  }

  // Convert heading style
  const getHeadingStyle = (settings: Partial<DesignerSettings>): HeadingStyle => {
    if (settings.textTransform === 'uppercase') return 'caps'
    if (settings.textDecorationHeadings === 'underline') return 'underline'
    return 'bold'
  }

  // Convert font family to available PDF fonts
  const convertFontFamily = (font?: string): FontFamily => {
    // Valid FontFamily values
    const validFonts: FontFamily[] = [
      'helvetica', 'times', 'courier',
      'inter', 'roboto', 'open-sans', 'lato', 'merriweather', 'source-sans'
    ]

    if (!font) return 'helvetica'
    if (validFonts.includes(font as FontFamily)) return font as FontFamily

    // Map legacy font names to closest available font
    const fontMapping: Record<string, FontFamily> = {
      'georgia': 'merriweather',
      'playfair': 'merriweather',
      'garamond': 'merriweather',
      'cambria': 'merriweather',
      'palatino': 'merriweather',
      'montserrat': 'inter',
      'poppins': 'inter',
      'nunito': 'lato',
      'raleway': 'inter',
    }

    return fontMapping[font] || 'helvetica'
  }

  // Build section settings
  const pdfSectionSettings: ResumeDesign['sectionSettings'] = { ...DEFAULT_DESIGN.sectionSettings }

  if (sectionSettings) {
    Object.entries(sectionSettings).forEach(([key, value]) => {
      if (key in pdfSectionSettings) {
        const sectionKey = key as SectionKey
        pdfSectionSettings[sectionKey] = {
          ...pdfSectionSettings[sectionKey],
          enabled: value.visible !== false,
          customTitle: value.customTitle,
        }
      }
    })
  }

  return {
    templateId: DEFAULT_DESIGN.templateId,
    paperSize: settings.paperSize || 'letter',
    margins: marginsToPreset(settings.margins || 48),
    fontFamily: convertFontFamily(settings.fontFamily),
    fontSize: fontSizeToPreset(settings.fontSizeBody || 11),
    headingStyle: getHeadingStyle(settings),
    colorPresetId: settings.colorPreset || 'professional',
    customAccentColor: settings.accentColor,
    sectionSpacing: spacingToPreset(settings.sectionGap),
    dateFormat: settings.dateFormat?.replace('YYYY-MM', 'MM/YYYY') as any || 'Month Year',
    sectionOrder: DEFAULT_DESIGN.sectionOrder,
    sectionSettings: pdfSectionSettings,
  }
}

/**
 * Convert new ResumeDesign to old DesignerSettings format
 * (for backwards compatibility)
 */
export function convertToDesignerSettings(design: ResumeDesign): Partial<DesignerSettings> {
  const { MARGIN_PRESETS, FONT_SIZE_PRESETS, SPACING_PRESETS } = require('../styles/presets')

  const margins = MARGIN_PRESETS[design.margins]
  const fonts = FONT_SIZE_PRESETS[design.fontSize]
  const spacing = SPACING_PRESETS[design.sectionSpacing]

  return {
    margins: margins.top,
    paperSize: design.paperSize,
    fontFamily: design.fontFamily as any,
    fontSizeBody: fonts.body,
    fontSizeHeadings: fonts.section,
    fontSizeName: fonts.name,
    sectionGap: spacing.section,
    itemGap: spacing.item,
    bulletSpacing: spacing.bullet,
    accentColor: design.customAccentColor || '#6366f1',
    colorPreset: design.colorPresetId,
    textTransform: design.headingStyle === 'caps' ? 'uppercase' : 'none',
    textDecorationHeadings: design.headingStyle === 'underline' ? 'underline' : 'none',
    dateFormat: design.dateFormat as any,
  }
}
