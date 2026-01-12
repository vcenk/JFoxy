// contexts/ResumeContext.tsx
// Global state management for Resume Builder

'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { ParsedResume } from '@/lib/types/resume'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'
import { ResumeDesign, DEFAULT_DESIGN } from '@/lib/pdf/types'

type ResumeSection =
  | 'contact'
  | 'targetTitle'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'volunteer'
  | 'publications'
  | 'languages'

type InspectorTab = 'content' | 'designer' | 'templates'

type StudioMode = 'builder' | 'analysis'

interface SectionSettings {
  visible: boolean
  customTitle?: string
  listStyle?: 'disc' | 'circle' | 'square' | 'none'
  layout?: 'list' | 'grid' | 'columns'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
}

interface ResumeContextType {
  // Data
  resumeData: ParsedResume
  setResumeData: (data: ParsedResume) => void

  // Selection
  activeSection: ResumeSection
  setActiveSection: (section: ResumeSection) => void

  // Section Settings
  sectionSettings: Record<ResumeSection, SectionSettings>
  updateSectionSettings: (section: ResumeSection, settings: Partial<SectionSettings>) => void

  // Inspector
  inspectorTab: InspectorTab
  setInspectorTab: (tab: InspectorTab) => void

  // Mode
  studioMode: StudioMode
  setStudioMode: (mode: StudioMode) => void

  // Section Order
  sectionOrder: ResumeSection[]
  setSectionOrder: (order: ResumeSection[]) => void

  // Designer Settings
  designerSettings: {
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
    // Enhanced spacing controls
    sectionGap: number
    itemGap: number
    bulletSpacing: number
    paragraphSpacing: number
    // Header layout options
    headerLayout: 'left' | 'center' | 'split'
    contactLayout: 'inline' | 'stacked' | 'two-column'
    showContactIcons: boolean
    contactIconStyle: 'solid' | 'outline' | 'none'
    nameSubtitleGap: number
    // Color settings
    colorPreset: string | null
    secondaryColor: string
    headerBackgroundColor: string
    sidebarBackgroundColor: string
  }
  updateDesignerSettings: (settings: Partial<ResumeContextType['designerSettings']>) => void

  // Template
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void

  // JSON Resume Theme Integration
  selectedJsonResumeTheme: string | null
  setSelectedJsonResumeTheme: (theme: string | null) => void
  renderedThemeHtml: string | null
  setRenderedThemeHtml: (html: string | null) => void
  isThemeLoading: boolean
  setIsThemeLoading: (isLoading: boolean) => void

  // React-PDF Integration
  usePDFRenderer: boolean
  setUsePDFRenderer: (use: boolean) => void
  pdfDesign: ResumeDesign
  updatePdfDesign: (updates: Partial<ResumeDesign>) => void
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

const defaultResumeData: ParsedResume = {
  contact: {},
  experience: [],
  education: [],
  skills: {},
  summary: plainTextToJSON(''),
  projects: [],
  certifications: [],
  awards: [],
  volunteer: [],
  publications: [],
  languages: [],
}

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ParsedResume>(defaultResumeData)
  const [activeSection, setActiveSection] = useState<ResumeSection>('contact')
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('content')
  const [studioMode, setStudioMode] = useState<StudioMode>('builder')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic')

  // JSON Resume Theme states
  const [selectedJsonResumeTheme, setSelectedJsonResumeTheme] = useState<string | null>(null);
  const [renderedThemeHtml, setRenderedThemeHtml] = useState<string | null>(null);
  const [isThemeLoading, setIsThemeLoading] = useState<boolean>(false);

  // React-PDF state
  const [usePDFRenderer, setUsePDFRenderer] = useState<boolean>(true);
  const [pdfDesign, setPdfDesign] = useState<ResumeDesign>(DEFAULT_DESIGN);


  // Default all sections to visible
  const [sectionSettings, setSectionSettings] = useState<Record<ResumeSection, SectionSettings>>({
    contact: { visible: true },
    targetTitle: { visible: true },
    summary: { visible: true },
    experience: { visible: true },
    education: { visible: true },
    skills: { visible: true },
    projects: { visible: true },
    certifications: { visible: true },
    awards: { visible: true },
    volunteer: { visible: true },
    publications: { visible: true },
    languages: { visible: true },
  })

  const updateSectionSettings = useCallback((section: ResumeSection, settings: Partial<SectionSettings>) => {
    setSectionSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...settings },
    }))
  }, [])

  const [sectionOrder, setSectionOrder] = useState<ResumeSection[]>([
    'contact',
    'targetTitle',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'awards',
    'volunteer',
    'publications',
    'languages',
  ])

  const [designerSettings, setDesignerSettings] = useState({
    margins: 40,
    columns: 1 as 1 | 2,
    headerSpan: true,
    fontFamily: 'inter' as 'inter' | 'sf-pro' | 'roboto' | 'lato' | 'open-sans' | 'montserrat' | 'raleway' | 'poppins' | 'playfair' | 'merriweather' | 'georgia' | 'times',
    paperSize: 'letter' as 'letter' | 'a4',
    lineHeight: 1.5,
    accentColor: '#6C47FF',
    dateFormat: 'MM/YYYY' as 'MM/YYYY' | 'Month Year' | 'Mon YYYY' | 'YYYY-MM' | 'YYYY',
    dividerStyle: 'line' as 'line' | 'dots' | 'none',
    pageNumbers: {
      enabled: false,
      alignment: 'center' as 'left' | 'center' | 'right',
    },
    fontSizeName: 28,
    fontSizeHeadings: 14,
    fontSizeBody: 11,
    fontWeightName: '700' as '400' | '500' | '600' | '700',
    fontWeightHeadings: '600' as '400' | '500' | '600' | '700',
    fontStyleHeadings: 'normal' as 'italic' | 'normal',
    textDecorationHeadings: 'none' as 'underline' | 'none',
    textTransform: 'uppercase' as 'none' | 'uppercase' | 'capitalize',
    letterSpacing: 0.05,
    boldPosition: true,
    // Enhanced spacing controls - reduced for compact layout
    sectionGap: 12,
    itemGap: 6,
    bulletSpacing: 2,
    paragraphSpacing: 4,
    // Header layout options
    headerLayout: 'left' as 'left' | 'center' | 'split',
    contactLayout: 'inline' as 'inline' | 'stacked' | 'two-column',
    showContactIcons: false,
    contactIconStyle: 'solid' as 'solid' | 'outline' | 'none',
    nameSubtitleGap: 8,
    // Color settings
    colorPreset: null as string | null,
    secondaryColor: '#6C47FF',
    headerBackgroundColor: 'transparent',
    sidebarBackgroundColor: 'transparent',
  })

  const updateDesignerSettings = useCallback((settings: Partial<typeof designerSettings>) => {
    setDesignerSettings(prev => {
      const updated = { ...prev, ...settings }

      // Deep merge nested objects
      if (settings.pageNumbers) {
        updated.pageNumbers = { ...prev.pageNumbers, ...settings.pageNumbers }
      }

      return updated
    })
  }, [])

  const updatePdfDesign = useCallback((updates: Partial<ResumeDesign>) => {
    setPdfDesign(prev => ({
      ...prev,
      ...updates,
      sectionSettings: {
        ...prev.sectionSettings,
        ...updates.sectionSettings,
      },
    }))
  }, [])

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        activeSection,
        setActiveSection,
        sectionSettings,
        updateSectionSettings,
        inspectorTab,
        setInspectorTab,
        studioMode,
        setStudioMode,
        sectionOrder,
        setSectionOrder,
        designerSettings,
        updateDesignerSettings,
        selectedTemplate,
        setSelectedTemplate,
        selectedJsonResumeTheme,
        setSelectedJsonResumeTheme,
        renderedThemeHtml,
        setRenderedThemeHtml,
        isThemeLoading,
        setIsThemeLoading,
        usePDFRenderer,
        setUsePDFRenderer,
        pdfDesign,
        updatePdfDesign,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export const useResume = () => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider')
  }
  return context
}
