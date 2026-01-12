// components/resume/editor/ContentEditor.tsx
// Main TealHQ-style checklist content editor

'use client'

import React from 'react'
import { ParsedResume } from '@/lib/types/resume'
import {
  ContactEditor,
  SummaryEditor,
  ExperienceEditor,
  EducationEditor,
  SkillsEditor,
  ProjectsEditor,
  CertificationsEditor,
  AwardsEditor,
  VolunteerEditor,
  PublicationsEditor,
  LanguagesEditor,
} from './sections'

interface ContentEditorProps {
  resumeData: ParsedResume
  onChange: (data: ParsedResume) => void
  sectionSettings?: Record<string, { visible?: boolean }>
  onSectionSettingsChange?: (section: string, settings: { visible?: boolean }) => void
  activeSection?: string | null
  onAIGenerateSummary?: () => void
  onAIRewriteSummary?: () => void
  onAIShortenSummary?: () => void
  onAIGenerateBullets?: (experienceId: string) => void
  onAISuggestSkills?: () => void
}

// Section type for filtering
type SectionType =
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

export const ContentEditor: React.FC<ContentEditorProps> = ({
  resumeData,
  onChange,
  sectionSettings = {},
  onSectionSettingsChange,
  activeSection,
  onAIGenerateSummary,
  onAIRewriteSummary,
  onAIShortenSummary,
  onAIGenerateBullets,
  onAISuggestSkills,
}) => {
  const updateResumeData = <K extends keyof ParsedResume>(
    key: K,
    value: ParsedResume[K]
  ) => {
    onChange({ ...resumeData, [key]: value })
  }

  const getSectionEnabled = (section: string) => {
    return sectionSettings[section]?.visible !== false
  }

  const setSectionEnabled = (section: string, visible: boolean) => {
    onSectionSettingsChange?.(section, { visible })
  }

  // Scroll to section ref
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement>> = {}

  // Helper to check if a section should be shown based on activeSection filter
  const shouldShowSection = (sectionId: SectionType) => {
    // If no section is selected, show all
    if (!activeSection) return true
    // Otherwise, only show the selected section
    return activeSection === sectionId
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Contact Information */}
      {shouldShowSection('contact') && (
        <div ref={sectionRefs.contact} id="section-contact">
          <ContactEditor
            contact={resumeData.contact}
            onChange={(contact) => updateResumeData('contact', contact)}
          />
        </div>
      )}

      {/* Target Title */}
      {shouldShowSection('targetTitle') && (
        <div ref={sectionRefs.targetTitle} id="section-targetTitle" className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg font-semibold text-white">Target Position</span>
          </div>
          <input
            type="text"
            value={resumeData.targetTitle || ''}
            onChange={(e) => updateResumeData('targetTitle', e.target.value)}
            placeholder="e.g., Senior Software Engineer, Product Manager..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-white/50 mt-2">
            This helps tailor your resume to specific job applications
          </p>
        </div>
      )}

      {/* Professional Summary */}
      {shouldShowSection('summary') && (
        <div ref={sectionRefs.summary} id="section-summary">
          <SummaryEditor
            summary={resumeData.summary}
            onChange={(summary) => updateResumeData('summary', summary)}
            targetTitle={resumeData.targetTitle}
            enabled={resumeData.summaryEnabled !== false}
            onEnabledChange={(enabled) => onChange({ ...resumeData, summaryEnabled: enabled })}
            onGenerate={onAIGenerateSummary}
            onRewrite={onAIRewriteSummary}
            onShorten={onAIShortenSummary}
          />
        </div>
      )}

      {/* Work Experience */}
      {shouldShowSection('experience') && (
        <div ref={sectionRefs.experience} id="section-experience">
          <ExperienceEditor
            experiences={resumeData.experience}
            onChange={(experience) => updateResumeData('experience', experience)}
            sectionEnabled={getSectionEnabled('experience')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('experience', enabled)}
            onGenerateBullets={onAIGenerateBullets}
          />
        </div>
      )}

      {/* Education */}
      {shouldShowSection('education') && (
        <div ref={sectionRefs.education} id="section-education">
          <EducationEditor
            education={resumeData.education}
            onChange={(education) => updateResumeData('education', education)}
            sectionEnabled={getSectionEnabled('education')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('education', enabled)}
          />
        </div>
      )}

      {/* Skills */}
      {shouldShowSection('skills') && (
        <div ref={sectionRefs.skills} id="section-skills">
          <SkillsEditor
            skills={resumeData.skills}
            onChange={(skills) => updateResumeData('skills', skills)}
            sectionEnabled={getSectionEnabled('skills')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('skills', enabled)}
            onSuggestSkills={onAISuggestSkills}
          />
        </div>
      )}

      {/* Projects */}
      {shouldShowSection('projects') && (
        <div ref={sectionRefs.projects} id="section-projects">
          <ProjectsEditor
            projects={resumeData.projects || []}
            onChange={(projects) => updateResumeData('projects', projects)}
            sectionEnabled={getSectionEnabled('projects')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('projects', enabled)}
          />
        </div>
      )}

      {/* Certifications */}
      {shouldShowSection('certifications') && (
        <div ref={sectionRefs.certifications} id="section-certifications">
          <CertificationsEditor
            certifications={resumeData.certifications || []}
            onChange={(certifications) => updateResumeData('certifications', certifications)}
            sectionEnabled={getSectionEnabled('certifications')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('certifications', enabled)}
          />
        </div>
      )}

      {/* Awards */}
      {shouldShowSection('awards') && (
        <div ref={sectionRefs.awards} id="section-awards">
          <AwardsEditor
            awards={resumeData.awards || []}
            onChange={(awards) => updateResumeData('awards', awards)}
            sectionEnabled={getSectionEnabled('awards')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('awards', enabled)}
          />
        </div>
      )}

      {/* Volunteer */}
      {shouldShowSection('volunteer') && (
        <div ref={sectionRefs.volunteer} id="section-volunteer">
          <VolunteerEditor
            volunteer={resumeData.volunteer || []}
            onChange={(volunteer) => updateResumeData('volunteer', volunteer)}
            sectionEnabled={getSectionEnabled('volunteer')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('volunteer', enabled)}
          />
        </div>
      )}

      {/* Publications */}
      {shouldShowSection('publications') && (
        <div ref={sectionRefs.publications} id="section-publications">
          <PublicationsEditor
            publications={resumeData.publications || []}
            onChange={(publications) => updateResumeData('publications', publications)}
            sectionEnabled={getSectionEnabled('publications')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('publications', enabled)}
          />
        </div>
      )}

      {/* Languages */}
      {shouldShowSection('languages') && (
        <div ref={sectionRefs.languages} id="section-languages">
          <LanguagesEditor
            languages={resumeData.languages || []}
            onChange={(languages) => updateResumeData('languages', languages)}
            sectionEnabled={getSectionEnabled('languages')}
            onSectionEnabledChange={(enabled) => setSectionEnabled('languages', enabled)}
          />
        </div>
      )}
    </div>
  )
}
