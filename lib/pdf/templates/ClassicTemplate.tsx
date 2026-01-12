// lib/pdf/templates/ClassicTemplate.tsx
// Classic single-column resume template

import React from 'react'
import { Document, Page, StyleSheet } from '@react-pdf/renderer'
import { TemplateProps } from '../types'
import { PAPER_SIZES, computeStyles, getFontFamily } from '../styles'
import { registerFonts } from '../fonts/register'

// Import section components
import { HeaderSection } from '../sections/HeaderSection'
import { SummarySection } from '../sections/SummarySection'
import { ExperienceSection } from '../sections/ExperienceSection'
import { EducationSection } from '../sections/EducationSection'
import { SkillsSection } from '../sections/SkillsSection'
import { ProjectsSection } from '../sections/ProjectsSection'
import { CertificationsSection } from '../sections/CertificationsSection'
import { AwardsSection } from '../sections/AwardsSection'
import { LanguagesSection } from '../sections/LanguagesSection'
import { VolunteerSection } from '../sections/VolunteerSection'
import { PublicationsSection } from '../sections/PublicationsSection'
import { PageNumber } from '../sections/PageNumber'

// Register fonts
registerFonts()

/**
 * Classic Template
 * Traditional single-column layout with clean typography
 * Best for: Traditional industries, academic positions, senior roles
 */
export function ClassicTemplate({ data, design }: TemplateProps) {
  const computed = computeStyles(design)
  const paperSize = PAPER_SIZES[design.paperSize]
  const fontFamily = getFontFamily(design.fontFamily)
  const lineHeight = design.lineHeight || 1.15

  const pageStyles = StyleSheet.create({
    page: {
      paddingTop: computed.page.paddingTop,
      paddingRight: computed.page.paddingRight,
      paddingBottom: computed.page.paddingBottom,
      paddingLeft: computed.page.paddingLeft,
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      backgroundColor: computed.colors.background,
      lineHeight,
    },
  })

  // Map section keys to components
  const sectionComponents: Record<string, React.ReactNode> = {
    contact: (
      <HeaderSection
        key="contact"
        data={data.contact}
        targetTitle={data.targetTitle}
        design={design}
      />
    ),
    summary: (
      <SummarySection
        key="summary"
        summary={data.summary}
        enabled={data.summaryEnabled !== false}
        design={design}
      />
    ),
    experience: (
      <ExperienceSection key="experience" entries={data.experience} design={design} />
    ),
    education: (
      <EducationSection key="education" entries={data.education} design={design} />
    ),
    skills: (
      <SkillsSection key="skills" skills={data.skills} design={design} />
    ),
    projects: (
      <ProjectsSection key="projects" entries={data.projects || []} design={design} />
    ),
    certifications: (
      <CertificationsSection key="certifications" entries={data.certifications || []} design={design} />
    ),
    awards: (
      <AwardsSection key="awards" entries={data.awards || []} design={design} />
    ),
    languages: (
      <LanguagesSection key="languages" entries={data.languages || []} design={design} />
    ),
    volunteer: (
      <VolunteerSection key="volunteer" entries={data.volunteer || []} design={design} />
    ),
    publications: (
      <PublicationsSection key="publications" entries={data.publications || []} design={design} />
    ),
  }

  // Render sections in order (deduplicate to prevent any issues)
  const renderSections = () => {
    const uniqueOrder = Array.from(new Set(design.sectionOrder))
    return uniqueOrder
      .filter((key) => {
        const settings = design.sectionSettings[key]
        return settings?.enabled !== false
      })
      .map((key) => sectionComponents[key])
  }

  return (
    <Document title="Resume" author="JobFoxy">
      <Page size={[paperSize.width, paperSize.height]} style={pageStyles.page}>
        {renderSections()}
        <PageNumber design={design} />
      </Page>
    </Document>
  )
}

export default ClassicTemplate
