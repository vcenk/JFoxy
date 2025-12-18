// lib/utils/jsonResumeSchema.ts
// Generated from https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json

export interface Resume {
  $schema?: string;
  basics?: Basics;
  work?: Work[];
  volunteer?: Volunteer[];
  education?: Education[];
  awards?: Award[];
  certificates?: Certificate[];
  publications?: Publication[];
  skills?: Skill[];
  languages?: Language[];
  interests?: Interest[];
  references?: Reference[];
  projects?: Project[];
  meta?: Meta;
  [k: string]: unknown;
}

export interface Basics {
  name?: string;
  label?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: Location;
  profiles?: Profile[];
  [k: string]: unknown;
}

export interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  region?: string;
  [k: string]: unknown;
}

export interface Profile {
  network?: string;
  username?: string;
  url?: string;
  [k: string]: unknown;
}

export interface Work {
  name?: string;
  location?: string;
  description?: string;
  position?: string;
  url?: string;
  startDate?: string; // iso8601
  endDate?: string; // iso8601
  summary?: string;
  highlights?: string[];
  [k: string]: unknown;
}

export interface Volunteer {
  organization?: string;
  position?: string;
  url?: string;
  startDate?: string; // iso8601
  endDate?: string; // iso8601
  summary?: string;
  highlights?: string[];
  [k: string]: unknown;
}

export interface Education {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string; // iso8601
  endDate?: string; // iso8601
  score?: string;
  courses?: string[];
  [k: string]: unknown;
}

export interface Award {
  title?: string;
  date?: string; // iso8601
  awarder?: string;
  summary?: string;
  [k: string]: unknown;
}

export interface Certificate {
  name?: string;
  date?: string; // iso8601
  url?: string;
  issuer?: string;
  [k: string]: unknown;
}

export interface Publication {
  name?: string;
  publisher?: string;
  releaseDate?: string; // iso8601
  url?: string;
  summary?: string;
  [k: string]: unknown;
}

export interface Skill {
  name?: string;
  level?: string;
  keywords?: string[];
  [k: string]: unknown;
}

export interface Language {
  language?: string;
  fluency?: string;
  [k: string]: unknown;
}

export interface Interest {
  name?: string;
  keywords?: string[];
  [k: string]: unknown;
}

export interface Reference {
  name?: string;
  reference?: string;
  [k: string]: unknown;
}

export interface Project {
  name?: string;
  description?: string;
  highlights?: string[];
  keywords?: string[];
  startDate?: string; // iso8601
  endDate?: string; // iso8601
  url?: string;
  roles?: string[];
  entity?: string;
  type?: string;
  [k: string]: unknown;
}

export interface Meta {
  canonical?: string;
  version?: string;
  lastModified?: string;
  [k: string]: unknown;
}
