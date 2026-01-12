// lib/types/designer.ts
// Designer settings types

export interface DesignerSettings {
  margins: number
  columns: 1 | 2
  headerSpan: boolean
  fontFamily: 'inter' | 'sf-pro' | 'roboto' | 'lato' | 'open-sans' | 'montserrat' | 'raleway' | 'poppins' | 'playfair' | 'merriweather' | 'georgia' | 'times'
  paperSize: 'letter' | 'a4'
  lineHeight: number
  accentColor: string
  dateFormat: 'MM/YYYY' | 'Month Year' | 'Mon YYYY' | 'YYYY-MM' | 'YYYY'
  dividerStyle: 'line' | 'dots' | 'none'
  pageNumbers: {
    enabled: boolean
    alignment: 'left' | 'center' | 'right'
  }
  // Font sizes in points (pt)
  fontSizeName: number
  fontSizeHeadings: number
  fontSizeBody: number
  fontWeightName: '400' | '500' | '600' | '700'
  fontWeightHeadings: '400' | '500' | '600' | '700'
  fontStyleHeadings: 'italic' | 'normal'
  textDecorationHeadings: 'underline' | 'none'
  textTransform: 'none' | 'uppercase' | 'capitalize'
  letterSpacing: number
  boldPosition: boolean
  // Enhanced spacing controls (optional for backward compatibility)
  sectionGap?: number
  itemGap?: number
  bulletSpacing?: number
  paragraphSpacing?: number
  // Header layout options
  headerLayout?: 'left' | 'center' | 'split'
  contactLayout?: 'inline' | 'stacked' | 'two-column'
  showContactIcons?: boolean
  contactIconStyle?: 'solid' | 'outline' | 'none'
  nameSubtitleGap?: number
  // Color settings
  colorPreset?: string | null
  secondaryColor?: string
  headerBackgroundColor?: string
  sidebarBackgroundColor?: string
}
