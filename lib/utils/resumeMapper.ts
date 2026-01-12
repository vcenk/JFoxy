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

// Helper to extract bullet content (handles both old RichText and new BulletItem formats)
function getBulletText(bullet: any): string {
  if (bullet.enabled === false) return '';
  const content = bullet.content || bullet;
  return jsonToPlainText(content);
}

function mapExperience(experience: ParsedResume['experience']): Work[] {
  return experience.map(exp => {
    // Filter enabled bullets and extract text
    const bulletTexts = exp.bullets
      .filter((b: any) => b.enabled !== false)
      .map(getBulletText)
      .filter(Boolean);

    return {
      name: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate ? formatDate(exp.startDate) : undefined,
      endDate: exp.endDate && !exp.current ? formatDate(exp.endDate) : undefined,
      summary: bulletTexts.join('\n'),
      location: exp.location,
      url: undefined,
      highlights: bulletTexts,
    };
  });
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

// Helper to extract skill names (handles both old string[] and new SkillCategory[] formats)
function extractSkillNames(skills: any[] | undefined): string[] {
  if (!skills || !Array.isArray(skills)) return [];
  return skills
    .filter((s: any) => s.enabled !== false)
    .map((s: any) => typeof s === 'string' ? s : s.name)
    .filter(Boolean);
}

function mapSkills(skills: ParsedResume['skills']): Skill[] {
  const mappedSkills: Skill[] = [];
  const technicalSkills = extractSkillNames(skills.technical);
  const softSkills = extractSkillNames(skills.soft);
  const otherSkills = extractSkillNames(skills.other);

  if (technicalSkills.length > 0) {
    mappedSkills.push({ name: 'Technical Skills', level: '', keywords: technicalSkills });
  }
  if (softSkills.length > 0) {
    mappedSkills.push({ name: 'Soft Skills', level: '', keywords: softSkills });
  }
  if (otherSkills.length > 0) {
    mappedSkills.push({ name: 'Other Skills', level: '', keywords: otherSkills });
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
