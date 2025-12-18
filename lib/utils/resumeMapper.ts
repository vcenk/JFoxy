// lib/utils/resumeMapper.ts

import { ParsedResume } from '@/lib/types/resume';
import { jsonToPlainText } from './richTextHelpers';
import { Resume, Basics, Work, Education, Skill, Language, Volunteer, Project, Award, Publication, Reference, Profile, Certificate, Interest } from './jsonResumeSchema';

/**
 * Converts JobFoxy's ParsedResume format to the JSON Resume Schema format.
 * @param jobFoxyResume The resume data in JobFoxy's ParsedResume format.
 * @returns The resume data in JSON Resume Schema format.
 */
export function mapJobFoxyToJSONResume(jobFoxyResume: ParsedResume): Resume {
  const jsonResume: Resume = {
    basics: mapBasics(jobFoxyResume.contact, jobFoxyResume.summary),
    work: mapExperience(jobFoxyResume.experience),
    education: mapEducation(jobFoxyResume.education),
    skills: mapSkills(jobFoxyResume.skills),
    languages: mapLanguages(jobFoxyResume.languages),
    volunteer: mapVolunteer(jobFoxyResume.volunteer),
    projects: mapProjects(jobFoxyResume.projects),
    awards: mapAwards(jobFoxyResume.awards),
    publications: mapPublications(jobFoxyResume.publications),
    references: [], // JobFoxy ParsedResume does not have direct references
    interests: [], // JobFoxy ParsedResume does not have direct interests
  };

  // Filter out empty arrays for a cleaner JSON Resume output
  for (const key in jsonResume) {
    if (Array.isArray(jsonResume[key as keyof Resume]) && (jsonResume[key as keyof Resume] as Array<any>).length === 0) {
      // @ts-ignore
      delete jsonResume[key as keyof Resume];
    }
  }

  return jsonResume;
}

function mapBasics(contact: ParsedResume['contact'], summary: ParsedResume['summary']): Basics {
  const profiles: Profile[] = [];
  if (contact.linkedin) {
    profiles.push({ network: 'LinkedIn', username: contact.linkedin.split('/').pop(), url: contact.linkedin });
  }
  if (contact.github) {
    profiles.push({ network: 'GitHub', username: contact.github.split('/').pop(), url: contact.github });
  }
  if (contact.portfolio) {
    profiles.push({ network: 'Portfolio', username: contact.name, url: contact.portfolio });
  }

  return {
    name: contact.name || '',
    email: contact.email,
    phone: contact.phone,
    summary: summary ? jsonToPlainText(summary) : undefined,
    location: contact.location ? { city: contact.location.split(',')[0]?.trim(), countryCode: '', address: '', postalCode: '', region: contact.location.split(',')[1]?.trim() } : undefined,
    url: contact.portfolio, // Use portfolio as main URL for now
    profiles: profiles.length > 0 ? profiles : undefined,
  };
}

function mapExperience(experience: ParsedResume['experience']): Work[] {
  return experience.map(exp => ({
    name: exp.company || '',
    position: exp.position || '',
    startDate: exp.startDate ? formatDate(exp.startDate) : undefined,
    endDate: exp.endDate && !exp.current ? formatDate(exp.endDate) : undefined,
    summary: exp.bullets.map(jsonToPlainText).join('\n'), // Combine rich text bullets into a single summary string
    location: exp.location,
    url: undefined, // JobFoxy ParsedResume does not have a direct URL for work experience
    highlights: exp.bullets.map(jsonToPlainText),
  }));
}

function mapEducation(education: ParsedResume['education']): Education[] {
  return education.map(edu => ({
    institution: edu.institution || '',
    area: edu.field,
    studyType: edu.degree,
    startDate: edu.graduationDate ? formatDate(edu.graduationDate) : undefined, // Assuming graduationDate can also serve as end date
    endDate: edu.graduationDate ? formatDate(edu.graduationDate) : undefined,
    score: edu.gpa,
  }));
}

function mapSkills(skills: ParsedResume['skills']): Skill[] {
  const mappedSkills: Skill[] = [];
  if (skills.technical && skills.technical.length > 0) {
    mappedSkills.push({ name: 'Technical Skills', level: '', keywords: skills.technical });
  }
  if (skills.languages && skills.languages.length > 0) {
    mappedSkills.push({ name: 'Languages', level: '', keywords: skills.languages });
  }
  if (skills.tools && skills.tools.length > 0) {
    mappedSkills.push({ name: 'Tools', level: '', keywords: skills.tools });
  }
  if (skills.certifications && skills.certifications.length > 0) {
    // Note: ParsedResume['certifications'] is an Array of Objects, not string[],
    // so this needs careful mapping or removal if not directly comparable.
    // For now, assuming skills.certifications stores names as strings.
    mappedSkills.push({ name: 'Certifications', level: '', keywords: skills.certifications });
  }
  return mappedSkills;
}

function mapLanguages(languages: ParsedResume['languages'] | undefined): Language[] {
  return languages?.map(lang => ({
    language: lang.language || '',
    fluency: lang.fluency,
  })) || [];
}

function mapVolunteer(volunteer: ParsedResume['volunteer'] | undefined): Volunteer[] {
  return volunteer?.map(vol => ({
    organization: vol.organization || '',
    position: vol.role || '',
    startDate: vol.startDate ? formatDate(vol.startDate) : undefined,
    endDate: vol.endDate && !vol.current ? formatDate(vol.endDate) : undefined,
    summary: vol.description,
    highlights: vol.description ? [vol.description] : [],
  })) || [];
}

function mapProjects(projects: ParsedResume['projects'] | undefined): Project[] {
  return projects?.map(proj => ({
    name: proj.name || '',
    description: proj.description,
    url: proj.link,
    keywords: proj.technologies,
  })) || [];
}

function mapAwards(awards: ParsedResume['awards'] | undefined): Award[] {
  return awards?.map(award => ({
    title: award.title || '',
    date: award.date ? formatDate(award.date) : undefined,
    awarder: award.issuer,
    summary: award.description,
  })) || [];
}

function mapPublications(publications: ParsedResume['publications'] | undefined): Publication[] {
  return publications?.map(pub => ({
    name: pub.title || '',
    publisher: pub.publisher,
    releaseDate: pub.date ? formatDate(pub.date) : undefined,
    url: pub.link,
    summary: pub.description,
  })) || [];
}

// Helper to format dates, assuming input can be loose (e.g., "Jan 2020")
// and output should ideally be YYYY-MM-DD or YYYY-MM
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If Date constructor fails, try a more robust parsing for common formats
      const parts = dateString.split(' ');
      if (parts.length === 2) { // e.g., "Jan 2020"
        const [monthStr, yearStr] = parts;
        const monthNum = new Date(Date.parse(monthStr + " 1, 2000")).getMonth() + 1; // Get month number
        return `${yearStr}-${String(monthNum).padStart(2, '0')}`;
      } else if (parts.length === 1 && !isNaN(parseInt(parts[0]))) { // e.g., "2020"
        return parts[0];
      }
      return dateString; // Fallback to original string if cannot parse
    }
    return date.toISOString().split('T')[0].substring(0, 7); // YYYY-MM
  } catch (e) {
    return dateString; // Return original if any error
  }
}
