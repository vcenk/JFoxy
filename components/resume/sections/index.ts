// components/resume/sections/index.ts
// Export all resume section components

export { ContactSection } from './ContactSection'
export { TargetTitleSection } from './TargetTitleSection'
export { SummarySection } from './SummarySection'
export { ExperienceSection } from './ExperienceSection'
export { EducationSection } from './EducationSection'
export { SkillsSection } from './SkillsSection'
export { ProjectsSection } from './ProjectsSection'
export { CertificationsSection } from './CertificationsSection'
export { AwardsSection } from './AwardsSection'
export { VolunteerSection } from './VolunteerSection'
export { PublicationsSection } from './PublicationsSection'
export { LanguagesSection } from './LanguagesSection'

// Register all sections in the central registry
import { registerSection } from '@/lib/sectionRegistry'
import { ContactSection } from './ContactSection'
import { TargetTitleSection } from './TargetTitleSection'
import { SummarySection } from './SummarySection'
import { ExperienceSection } from './ExperienceSection'
import { EducationSection } from './EducationSection'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { CertificationsSection } from './CertificationsSection'
import { AwardsSection } from './AwardsSection'
import { VolunteerSection } from './VolunteerSection'
import { PublicationsSection } from './PublicationsSection'
import { LanguagesSection } from './LanguagesSection'

registerSection('contact', ContactSection)
registerSection('targetTitle', TargetTitleSection)
registerSection('summary', SummarySection)
registerSection('experience', ExperienceSection)
registerSection('education', EducationSection)
registerSection('skills', SkillsSection)
registerSection('projects', ProjectsSection)
registerSection('certifications', CertificationsSection)
registerSection('awards', AwardsSection)
registerSection('volunteer', VolunteerSection)
registerSection('publications', PublicationsSection)
registerSection('languages', LanguagesSection)
