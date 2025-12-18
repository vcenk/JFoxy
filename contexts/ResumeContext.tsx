// contexts/ResumeContext.tsx
// Global state management for Resume Builder

'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { ParsedResume } from '@/lib/types/resume'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'

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
    fontFamily: 'inter' | 'sf-pro'
    paperSize: 'letter' | 'a4'
    lineHeight: number
    accentColor: string
    dateFormat: 'MM/YYYY' | 'Month Year'
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
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

const defaultResumeData: ParsedResume = {
  contact: {},
  experience: [],
  education: [],
  skills: {},
  summary: plainTextToJSON(''),
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

  const updateSectionSettings = (section: ResumeSection, settings: Partial<SectionSettings>) => {
    setSectionSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...settings },
    }))
  }

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
    fontFamily: 'inter' as 'inter' | 'sf-pro',
    paperSize: 'letter' as 'letter' | 'a4',
    lineHeight: 1.5,
    accentColor: '#6C47FF',
    dateFormat: 'MM/YYYY' as 'MM/YYYY' | 'Month Year',
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
  })

  const updateDesignerSettings = (settings: Partial<typeof designerSettings>) => {
    setDesignerSettings(prev => ({ ...prev, ...settings }))
  }

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
