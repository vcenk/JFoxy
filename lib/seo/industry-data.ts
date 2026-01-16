export interface IndustryData {
  slug: string
  title: string
  description: string
  metaDescription: string
  icon: string
  color: string
  stats: Array<{ value: string; label: string }>
  keySkills: Array<{ category: string; skills: string[] }>
  topJobTitles: string[]
  resumeTips: Array<{ title: string; description: string }>
  atsKeywords: string[]
  commonMistakes: string[]
  salaryRange: { entry: string; mid: string; senior: string }
  faqs: Array<{ question: string; answer: string }>
}

export const industryData: Record<string, IndustryData> = {
  tech: {
    slug: 'tech',
    title: 'Tech & Software Resume Guide 2025',
    description: 'Create a standout resume for software engineering, development, and IT roles.',
    metaDescription: 'Create a winning tech resume with our comprehensive guide. Learn what FAANG recruiters look for, essential keywords, and ATS optimization for software engineers.',
    icon: 'Code',
    color: 'blue',
    stats: [
      { value: '4.2M', label: 'Tech Jobs in US' },
      { value: '$120K', label: 'Median Salary' },
      { value: '25%', label: 'Growth Rate' },
    ],
    keySkills: [
      {
        category: 'Programming Languages',
        skills: ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++'],
      },
      {
        category: 'Frameworks & Libraries',
        skills: ['React', 'Node.js', 'Next.js', 'Django', 'Spring Boot', 'Vue.js'],
      },
      {
        category: 'Cloud & DevOps',
        skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      },
      {
        category: 'Databases',
        skills: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'],
      },
    ],
    topJobTitles: [
      'Software Engineer',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'DevOps Engineer',
      'Data Engineer',
      'Machine Learning Engineer',
      'Site Reliability Engineer',
    ],
    resumeTips: [
      {
        title: 'Lead with Technical Skills',
        description: 'Put your tech stack front and center. Use a dedicated skills section near the top.',
      },
      {
        title: 'Quantify Your Impact',
        description: 'Use metrics: improved performance by X%, reduced load time by Yms, scaled to Z users.',
      },
      {
        title: 'Include GitHub/Portfolio Links',
        description: 'Link to your GitHub profile, portfolio, or notable open source contributions.',
      },
      {
        title: 'Highlight System Design',
        description: 'For senior roles, emphasize architecture decisions and system design experience.',
      },
      {
        title: 'Show Collaboration',
        description: 'Tech isn\'t just coding. Highlight cross-team collaboration and mentorship.',
      },
    ],
    atsKeywords: [
      'Agile', 'Scrum', 'REST API', 'Microservices', 'CI/CD', 'Unit Testing',
      'Code Review', 'Git', 'System Design', 'Performance Optimization',
      'Full Stack', 'Cloud Architecture', 'Data Structures', 'Algorithms',
    ],
    commonMistakes: [
      'Listing every technology without proficiency levels',
      'No quantifiable achievements, just job duties',
      'Missing GitHub or portfolio links',
      'Overly long resume (2+ pages for mid-level)',
      'Not tailoring to the specific tech stack in the job description',
    ],
    salaryRange: {
      entry: '$70K - $100K',
      mid: '$100K - $150K',
      senior: '$150K - $250K+',
    },
    faqs: [
      {
        question: 'Should I list every programming language I know?',
        answer: 'No. Focus on languages relevant to the job and indicate proficiency level. List your strongest languages first and group by proficiency (expert, proficient, familiar).',
      },
      {
        question: 'How important is a GitHub profile for tech resumes?',
        answer: 'Very important, especially for junior roles. Active GitHub profiles with quality projects can compensate for limited professional experience. Include the link prominently.',
      },
      {
        question: 'Should I include my education if I\'m self-taught?',
        answer: 'Include any formal education, but also highlight bootcamps, certifications, and notable online courses. Your project portfolio matters more than degrees in most tech roles.',
      },
    ],
  },
  finance: {
    slug: 'finance',
    title: 'Finance & Banking Resume Guide 2025',
    description: 'Build a compelling resume for finance, banking, and investment roles.',
    metaDescription: 'Create a standout finance resume with our expert guide. Learn what top banks and firms look for, essential certifications, and how to highlight deal experience.',
    icon: 'DollarSign',
    color: 'green',
    stats: [
      { value: '6.5M', label: 'Finance Jobs in US' },
      { value: '$95K', label: 'Median Salary' },
      { value: '8%', label: 'Growth Rate' },
    ],
    keySkills: [
      {
        category: 'Financial Analysis',
        skills: ['Financial Modeling', 'Valuation', 'DCF Analysis', 'LBO Modeling', 'M&A Analysis'],
      },
      {
        category: 'Technical Tools',
        skills: ['Excel (Advanced)', 'Bloomberg Terminal', 'Capital IQ', 'FactSet', 'Python', 'SQL'],
      },
      {
        category: 'Certifications',
        skills: ['CFA', 'CPA', 'FRM', 'Series 7', 'Series 63', 'CAIA'],
      },
      {
        category: 'Soft Skills',
        skills: ['Client Relations', 'Presentation Skills', 'Attention to Detail', 'Time Management'],
      },
    ],
    topJobTitles: [
      'Financial Analyst',
      'Investment Banking Analyst',
      'Portfolio Manager',
      'Risk Analyst',
      'Private Equity Associate',
      'Hedge Fund Analyst',
      'Corporate Finance Manager',
      'Wealth Manager',
    ],
    resumeTips: [
      {
        title: 'Highlight Deal Experience',
        description: 'List specific transactions with deal sizes: "Advised on $500M M&A transaction."',
      },
      {
        title: 'Emphasize Certifications',
        description: 'CFA, CPA, and Series licenses should be prominently displayed near your name.',
      },
      {
        title: 'Quantify Financial Impact',
        description: 'Show ROI, cost savings, revenue impact. Numbers speak loudly in finance.',
      },
      {
        title: 'Show Technical Proficiency',
        description: 'Advanced Excel, financial modeling, and data analysis tools are expected.',
      },
      {
        title: 'Include Relevant Coursework',
        description: 'For entry-level, list relevant finance courses and case competitions.',
      },
    ],
    atsKeywords: [
      'Financial Modeling', 'Valuation', 'Due Diligence', 'M&A', 'LBO',
      'Bloomberg', 'Excel VBA', 'Risk Assessment', 'Portfolio Management',
      'Compliance', 'GAAP', 'SEC Reporting', 'Forecasting', 'Budgeting',
    ],
    commonMistakes: [
      'Not including deal sizes and transaction values',
      'Missing CFA progress (Level I Candidate, etc.)',
      'Failing to quantify financial impact',
      'Using vague terms instead of specific financial metrics',
      'Not highlighting relevant certifications prominently',
    ],
    salaryRange: {
      entry: '$65K - $95K',
      mid: '$95K - $175K',
      senior: '$175K - $400K+',
    },
    faqs: [
      {
        question: 'How do I present my CFA progress?',
        answer: 'List as "CFA Level II Candidate" or "CFA Charterholder" right after your name or in the education section. Even Level I candidacy shows commitment to the field.',
      },
      {
        question: 'Should I include my GPA?',
        answer: 'For entry-level finance roles, include GPA if it\'s 3.5+ (3.7+ for investment banking). After 2-3 years of experience, remove it unless exceptional.',
      },
      {
        question: 'How detailed should deal experience be?',
        answer: 'Include deal type, your role, deal size, and outcome. Example: "Executed $200M leveraged buyout including financial due diligence and management presentations."',
      },
    ],
  },
  healthcare: {
    slug: 'healthcare',
    title: 'Healthcare Resume Guide 2025',
    description: 'Create a professional resume for nursing, medical, and healthcare roles.',
    metaDescription: 'Build a winning healthcare resume with our comprehensive guide. Learn how to highlight licenses, certifications, patient care metrics, and clinical experience.',
    icon: 'Heart',
    color: 'red',
    stats: [
      { value: '16M', label: 'Healthcare Jobs in US' },
      { value: '$85K', label: 'Median Salary' },
      { value: '13%', label: 'Growth Rate' },
    ],
    keySkills: [
      {
        category: 'Clinical Skills',
        skills: ['Patient Assessment', 'Medication Administration', 'Wound Care', 'IV Therapy', 'Vital Signs'],
      },
      {
        category: 'Technology',
        skills: ['Epic', 'Cerner', 'MEDITECH', 'Electronic Health Records', 'Medical Devices'],
      },
      {
        category: 'Certifications',
        skills: ['BLS', 'ACLS', 'PALS', 'NRP', 'NIHSS', 'Specialty Certifications'],
      },
      {
        category: 'Compliance',
        skills: ['HIPAA', 'Joint Commission Standards', 'Infection Control', 'Safety Protocols'],
      },
    ],
    topJobTitles: [
      'Registered Nurse (RN)',
      'Nurse Practitioner',
      'Medical Assistant',
      'Physical Therapist',
      'Healthcare Administrator',
      'Clinical Research Coordinator',
      'Pharmacist',
      'Physician Assistant',
    ],
    resumeTips: [
      {
        title: 'Lead with Licenses & Certifications',
        description: 'Put RN, NP, PA-C, or other licenses right after your name. Add state and license numbers.',
      },
      {
        title: 'Include Patient Care Metrics',
        description: 'Quantify: patient loads, satisfaction scores, outcomes improvement percentages.',
      },
      {
        title: 'Highlight EMR Experience',
        description: 'List specific EMR systems (Epic, Cerner) you\'re proficient in.',
      },
      {
        title: 'Show Specialization',
        description: 'Highlight your specialty area: ICU, pediatrics, oncology, emergency medicine.',
      },
      {
        title: 'Emphasize Compliance Knowledge',
        description: 'HIPAA, Joint Commission, and safety protocol knowledge is essential.',
      },
    ],
    atsKeywords: [
      'Patient Care', 'Electronic Health Records', 'HIPAA Compliance', 'Clinical Assessment',
      'Care Coordination', 'Quality Improvement', 'Patient Safety', 'Interdisciplinary Team',
      'Evidence-Based Practice', 'Patient Education', 'Case Management', 'Discharge Planning',
    ],
    commonMistakes: [
      'Not listing license numbers and states',
      'Failing to include current certifications (BLS, ACLS)',
      'No patient care metrics or outcomes',
      'Missing EMR system experience',
      'Not highlighting specialty or unit experience',
    ],
    salaryRange: {
      entry: '$50K - $75K',
      mid: '$75K - $110K',
      senior: '$110K - $175K+',
    },
    faqs: [
      {
        question: 'Should I include my nursing license number?',
        answer: 'Yes, include your license type, state, and optionally the number. Example: "RN, California License #123456" or you can note "License number available upon request."',
      },
      {
        question: 'How do I show patient care quality?',
        answer: 'Include metrics like patient satisfaction scores, readmission rates, or specific outcomes: "Maintained 95% patient satisfaction rating" or "Reduced fall rates by 30%."',
      },
      {
        question: 'Should I list every unit I\'ve worked in?',
        answer: 'Focus on units relevant to the job you\'re applying for. If applying for ICU, emphasize ICU experience over routine med-surg rotations.',
      },
    ],
  },
  marketing: {
    slug: 'marketing',
    title: 'Marketing Resume Guide 2025',
    description: 'Build an impactful resume for marketing, advertising, and communications roles.',
    metaDescription: 'Create a standout marketing resume with our expert guide. Learn how to showcase campaign results, digital marketing skills, and creative achievements.',
    icon: 'Megaphone',
    color: 'orange',
    stats: [
      { value: '800K', label: 'Marketing Jobs in US' },
      { value: '$75K', label: 'Median Salary' },
      { value: '10%', label: 'Growth Rate' },
    ],
    keySkills: [
      {
        category: 'Digital Marketing',
        skills: ['SEO/SEM', 'Google Ads', 'Meta Ads', 'Content Marketing', 'Email Marketing'],
      },
      {
        category: 'Analytics Tools',
        skills: ['Google Analytics', 'HubSpot', 'Marketo', 'Salesforce', 'Tableau', 'Mixpanel'],
      },
      {
        category: 'Creative Skills',
        skills: ['Copywriting', 'Brand Strategy', 'Campaign Planning', 'A/B Testing', 'UX Writing'],
      },
      {
        category: 'Social Media',
        skills: ['Social Media Strategy', 'Community Management', 'Influencer Marketing', 'Paid Social'],
      },
    ],
    topJobTitles: [
      'Marketing Manager',
      'Digital Marketing Specialist',
      'Content Marketing Manager',
      'Brand Manager',
      'SEO Specialist',
      'Social Media Manager',
      'Product Marketing Manager',
      'Growth Marketing Manager',
    ],
    resumeTips: [
      {
        title: 'Quantify Campaign Results',
        description: 'Show ROI, conversions, engagement rates. "Increased lead gen by 150% with $50K budget."',
      },
      {
        title: 'Include Portfolio Link',
        description: 'Link to campaigns, content samples, or a marketing portfolio website.',
      },
      {
        title: 'Show Tool Proficiency',
        description: 'List specific marketing tools: HubSpot, Google Analytics, Hootsuite, etc.',
      },
      {
        title: 'Balance Creative & Analytical',
        description: 'Modern marketing requires both. Show data skills alongside creative work.',
      },
      {
        title: 'Highlight Channel Expertise',
        description: 'Specify channels: paid search, organic social, email, content marketing.',
      },
    ],
    atsKeywords: [
      'Digital Marketing', 'Campaign Management', 'Lead Generation', 'Conversion Rate',
      'Content Strategy', 'SEO/SEM', 'Marketing Automation', 'Brand Awareness',
      'Customer Acquisition', 'ROI', 'A/B Testing', 'Marketing Analytics', 'Funnel Optimization',
    ],
    commonMistakes: [
      'No metrics or ROI on campaign results',
      'Missing portfolio or work samples link',
      'Vague descriptions without specific channels or tools',
      'Not showing progression in marketing scope/budget',
      'Ignoring the analytical side of marketing',
    ],
    salaryRange: {
      entry: '$45K - $65K',
      mid: '$65K - $95K',
      senior: '$95K - $160K+',
    },
    faqs: [
      {
        question: 'How do I show marketing ROI on my resume?',
        answer: 'Use specific metrics: "Generated $2M pipeline with $100K ad spend (20x ROI)" or "Increased organic traffic 300%, driving 50K monthly leads." Always tie activity to business outcomes.',
      },
      {
        question: 'Should I include a portfolio link?',
        answer: 'Absolutely. Include a link to your best campaigns, content pieces, or a personal marketing site. Marketing is about demonstrating results, and a portfolio shows your work.',
      },
      {
        question: 'How do I present agency experience vs. in-house?',
        answer: 'Both are valuable. For agency experience, highlight the variety of clients and industries. For in-house, emphasize deep brand knowledge and long-term campaign evolution.',
      },
    ],
  },
}

export function getIndustryData(slug: string): IndustryData | undefined {
  return industryData[slug]
}

export function getAllIndustrySlugs(): string[] {
  return Object.keys(industryData)
}
