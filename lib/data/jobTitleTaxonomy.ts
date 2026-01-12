// lib/data/jobTitleTaxonomy.ts
// Job Title Taxonomy: 200 job titles across 10 industries for resume example generation

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive'
export type Industry =
  | 'technology'
  | 'finance'
  | 'marketing'
  | 'healthcare'
  | 'sales'
  | 'operations'
  | 'human_resources'
  | 'customer_service'
  | 'education'
  | 'engineering'

export interface JobTitleData {
  canonicalTitle: string
  aliases: string[]
  industry: Industry
  suitableLevels: ExperienceLevel[]
  typicalSkills: {
    technical: string[]
    soft: string[]
  }
  relatedTitles: string[]
  description: string
}

export const JOB_TITLE_TAXONOMY: Record<string, JobTitleData> = {
  // ==========================================
  // TECHNOLOGY (40 titles)
  // ==========================================

  'software-engineer': {
    canonicalTitle: 'Software Engineer',
    aliases: ['Software Developer', 'Programmer', 'Application Developer', 'Backend Developer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['JavaScript', 'Python', 'Java', 'Git', 'SQL', 'REST APIs', 'Cloud Computing', 'Docker'],
      soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Agile Methodologies']
    },
    relatedTitles: ['Frontend Developer', 'Full Stack Developer', 'DevOps Engineer'],
    description: 'Designs, develops, and maintains software applications and systems'
  },

  'frontend-developer': {
    canonicalTitle: 'Frontend Developer',
    aliases: ['Front End Engineer', 'UI Developer', 'Web Developer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['React', 'TypeScript', 'HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Webpack', 'Next.js'],
      soft: ['Attention to Detail', 'Creativity', 'User Empathy', 'Communication']
    },
    relatedTitles: ['Software Engineer', 'Full Stack Developer', 'UI/UX Engineer'],
    description: 'Creates user-facing features and interfaces for web applications'
  },

  'full-stack-developer': {
    canonicalTitle: 'Full Stack Developer',
    aliases: ['Full Stack Engineer', 'Full Stack Software Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express', 'REST APIs', 'GraphQL', 'AWS'],
      soft: ['Versatility', 'Problem Solving', 'Project Management', 'Communication']
    },
    relatedTitles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    description: 'Develops both client-side and server-side software components'
  },

  'devops-engineer': {
    canonicalTitle: 'DevOps Engineer',
    aliases: ['Site Reliability Engineer', 'Infrastructure Engineer', 'Platform Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python'],
      soft: ['Automation', 'Problem Solving', 'Collaboration', 'Process Improvement']
    },
    relatedTitles: ['Cloud Engineer', 'Infrastructure Engineer', 'Software Engineer'],
    description: 'Automates and optimizes deployment, monitoring, and infrastructure'
  },

  'data-scientist': {
    canonicalTitle: 'Data Scientist',
    aliases: ['Machine Learning Engineer', 'AI Engineer', 'Data Analyst'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Python', 'R', 'SQL', 'TensorFlow', 'Pandas', 'Scikit-learn', 'Statistics', 'Machine Learning'],
      soft: ['Analytical Thinking', 'Communication', 'Business Acumen', 'Curiosity']
    },
    relatedTitles: ['Data Analyst', 'ML Engineer', 'Business Intelligence Analyst'],
    description: 'Analyzes complex data to derive insights and build predictive models'
  },

  'product-manager': {
    canonicalTitle: 'Product Manager',
    aliases: ['Senior Product Manager', 'Technical Product Manager', 'Associate Product Manager'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior', 'executive'],
    typicalSkills: {
      technical: ['Product Strategy', 'Roadmapping', 'Analytics', 'Agile', 'User Research', 'A/B Testing'],
      soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Stakeholder Management']
    },
    relatedTitles: ['Product Owner', 'Program Manager', 'Director of Product'],
    description: 'Defines product vision, strategy, and roadmap based on user needs'
  },

  'ux-designer': {
    canonicalTitle: 'UX Designer',
    aliases: ['User Experience Designer', 'Product Designer', 'UI/UX Designer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Usability Testing'],
      soft: ['Empathy', 'Communication', 'Problem Solving', 'Collaboration']
    },
    relatedTitles: ['UI Designer', 'Product Designer', 'Interaction Designer'],
    description: 'Designs user interfaces and experiences for digital products'
  },

  'qa-engineer': {
    canonicalTitle: 'QA Engineer',
    aliases: ['Quality Assurance Engineer', 'Test Engineer', 'Software Tester', 'SDET'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Selenium', 'Test Automation', 'Cypress', 'Jest', 'API Testing', 'Performance Testing', 'Bug Tracking'],
      soft: ['Attention to Detail', 'Analytical Thinking', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Automation Engineer', 'QA Analyst', 'Test Lead'],
    description: 'Tests software quality and ensures products meet requirements'
  },

  'mobile-developer': {
    canonicalTitle: 'Mobile Developer',
    aliases: ['iOS Developer', 'Android Developer', 'Mobile Engineer', 'App Developer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS SDK', 'Android SDK', 'Mobile UI/UX'],
      soft: ['Adaptability', 'Problem Solving', 'User Focus', 'Communication']
    },
    relatedTitles: ['Frontend Developer', 'Software Engineer', 'Full Stack Developer'],
    description: 'Develops applications for mobile devices and platforms'
  },

  'cloud-engineer': {
    canonicalTitle: 'Cloud Engineer',
    aliases: ['Cloud Architect', 'Cloud Solutions Architect', 'AWS Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['AWS', 'Azure', 'GCP', 'Terraform', 'CloudFormation', 'Lambda', 'S3', 'EC2'],
      soft: ['Problem Solving', 'Cost Optimization', 'Security Mindset', 'Communication']
    },
    relatedTitles: ['DevOps Engineer', 'Infrastructure Engineer', 'Solutions Architect'],
    description: 'Designs and manages cloud infrastructure and services'
  },

  'security-engineer': {
    canonicalTitle: 'Security Engineer',
    aliases: ['Cybersecurity Engineer', 'Information Security Engineer', 'AppSec Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Penetration Testing', 'SIEM', 'Firewalls', 'Encryption', 'Vulnerability Assessment', 'Security Protocols'],
      soft: ['Analytical Thinking', 'Risk Management', 'Communication', 'Continuous Learning']
    },
    relatedTitles: ['Security Analyst', 'Network Security Engineer', 'Security Architect'],
    description: 'Protects systems and data from security threats and vulnerabilities'
  },

  'database-administrator': {
    canonicalTitle: 'Database Administrator',
    aliases: ['DBA', 'Database Engineer', 'SQL Administrator'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Database Design', 'Performance Tuning', 'Backup/Recovery'],
      soft: ['Attention to Detail', 'Problem Solving', 'Organization', 'Communication']
    },
    relatedTitles: ['Data Engineer', 'Backend Developer', 'DevOps Engineer'],
    description: 'Manages, maintains, and optimizes database systems'
  },

  'technical-writer': {
    canonicalTitle: 'Technical Writer',
    aliases: ['Documentation Specialist', 'Technical Content Writer', 'API Documentation Writer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Technical Writing', 'API Documentation', 'Markdown', 'Git', 'Content Management Systems'],
      soft: ['Communication', 'Clarity', 'Empathy', 'Collaboration']
    },
    relatedTitles: ['Content Writer', 'Developer Advocate', 'Documentation Manager'],
    description: 'Creates technical documentation and guides for software products'
  },

  'scrum-master': {
    canonicalTitle: 'Scrum Master',
    aliases: ['Agile Coach', 'Agile Project Manager', 'Scrum Facilitator'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Scrum', 'Agile Methodologies', 'Jira', 'Sprint Planning', 'Retrospectives', 'Kanban'],
      soft: ['Facilitation', 'Conflict Resolution', 'Servant Leadership', 'Communication']
    },
    relatedTitles: ['Product Owner', 'Project Manager', 'Agile Coach'],
    description: 'Facilitates Agile processes and removes blockers for development teams'
  },

  'it-support-specialist': {
    canonicalTitle: 'IT Support Specialist',
    aliases: ['Help Desk Technician', 'IT Support Engineer', 'Technical Support Specialist'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Windows', 'MacOS', 'Active Directory', 'Networking', 'Hardware Troubleshooting', 'Ticketing Systems'],
      soft: ['Customer Service', 'Patience', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Network Administrator', 'Systems Administrator', 'Desktop Support'],
    description: 'Provides technical support and troubleshooting for end users'
  },

  'network-engineer': {
    canonicalTitle: 'Network Engineer',
    aliases: ['Network Administrator', 'Network Architect', 'Infrastructure Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Cisco', 'TCP/IP', 'Routing', 'Switching', 'Firewalls', 'VPN', 'Network Security'],
      soft: ['Problem Solving', 'Attention to Detail', 'Communication', 'Planning']
    },
    relatedTitles: ['Systems Engineer', 'DevOps Engineer', 'Security Engineer'],
    description: 'Designs, implements, and maintains network infrastructure'
  },

  'data-engineer': {
    canonicalTitle: 'Data Engineer',
    aliases: ['Big Data Engineer', 'ETL Developer', 'Data Pipeline Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['SQL', 'Python', 'Spark', 'Airflow', 'Kafka', 'ETL', 'Data Warehousing', 'AWS'],
      soft: ['Problem Solving', 'Collaboration', 'Attention to Detail', 'Optimization']
    },
    relatedTitles: ['Data Scientist', 'Backend Developer', 'Analytics Engineer'],
    description: 'Builds and maintains data pipelines and infrastructure'
  },

  'systems-administrator': {
    canonicalTitle: 'Systems Administrator',
    aliases: ['Sysadmin', 'System Administrator', 'IT Administrator'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Linux', 'Windows Server', 'Active Directory', 'Scripting', 'Monitoring', 'Backup Solutions'],
      soft: ['Problem Solving', 'Organization', 'Reliability', 'Communication']
    },
    relatedTitles: ['DevOps Engineer', 'Network Administrator', 'Cloud Engineer'],
    description: 'Manages and maintains server and system infrastructure'
  },

  'business-analyst': {
    canonicalTitle: 'Business Analyst',
    aliases: ['IT Business Analyst', 'Requirements Analyst', 'Systems Analyst'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Requirements Gathering', 'SQL', 'Data Analysis', 'Process Modeling', 'Visio', 'Jira'],
      soft: ['Communication', 'Analytical Thinking', 'Stakeholder Management', 'Documentation']
    },
    relatedTitles: ['Product Manager', 'Data Analyst', 'Project Manager'],
    description: 'Analyzes business processes and translates needs into technical requirements'
  },

  'solution-architect': {
    canonicalTitle: 'Solutions Architect',
    aliases: ['Solution Architect', 'Enterprise Architect', 'Technical Architect'],
    industry: 'technology',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['System Design', 'Cloud Architecture', 'Microservices', 'API Design', 'AWS', 'Security'],
      soft: ['Strategic Thinking', 'Communication', 'Leadership', 'Problem Solving']
    },
    relatedTitles: ['Cloud Architect', 'Senior Engineer', 'CTO'],
    description: 'Designs comprehensive technical solutions for complex business problems'
  },

  'engineering-manager': {
    canonicalTitle: 'Engineering Manager',
    aliases: ['Software Engineering Manager', 'Development Manager', 'Tech Lead Manager'],
    industry: 'technology',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Software Development', 'Architecture', 'Code Review', 'Technical Strategy', 'CI/CD'],
      soft: ['Leadership', 'People Management', 'Mentoring', 'Strategic Planning', 'Communication']
    },
    relatedTitles: ['Director of Engineering', 'VP of Engineering', 'CTO'],
    description: 'Leads engineering teams and manages technical projects and people'
  },

  'cto': {
    canonicalTitle: 'Chief Technology Officer',
    aliases: ['CTO', 'VP of Engineering', 'Head of Technology'],
    industry: 'technology',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Technology Strategy', 'Architecture', 'Innovation', 'Product Development', 'Cloud Infrastructure'],
      soft: ['Executive Leadership', 'Vision Setting', 'Team Building', 'Business Strategy', 'Stakeholder Management']
    },
    relatedTitles: ['VP of Engineering', 'Director of Engineering', 'Chief Innovation Officer'],
    description: 'Sets technology vision and strategy for the entire organization'
  },

  'technical-recruiter': {
    canonicalTitle: 'Technical Recruiter',
    aliases: ['IT Recruiter', 'Tech Talent Acquisition Specialist', 'Engineering Recruiter'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['ATS Systems', 'LinkedIn Recruiting', 'Boolean Search', 'Technical Screening', 'Sourcing'],
      soft: ['Communication', 'Relationship Building', 'Negotiation', 'Persistence', 'Organization']
    },
    relatedTitles: ['Talent Acquisition Specialist', 'HR Recruiter', 'Sourcing Specialist'],
    description: 'Recruits technical talent for technology positions'
  },

  'game-developer': {
    canonicalTitle: 'Game Developer',
    aliases: ['Game Programmer', 'Unity Developer', 'Unreal Developer', 'Gameplay Engineer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Unity', 'Unreal Engine', 'C++', 'C#', '3D Math', 'Physics', 'Game Design Patterns'],
      soft: ['Creativity', 'Problem Solving', 'Collaboration', 'Attention to Detail']
    },
    relatedTitles: ['Software Engineer', 'Graphics Programmer', 'Game Designer'],
    description: 'Develops video games and interactive entertainment software'
  },

  'blockchain-developer': {
    canonicalTitle: 'Blockchain Developer',
    aliases: ['Smart Contract Developer', 'Crypto Developer', 'Web3 Developer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'Cryptography', 'DeFi'],
      soft: ['Innovation', 'Security Mindset', 'Problem Solving', 'Research Skills']
    },
    relatedTitles: ['Backend Developer', 'Security Engineer', 'Cryptocurrency Engineer'],
    description: 'Develops decentralized applications and blockchain solutions'
  },

  'ai-ml-engineer': {
    canonicalTitle: 'AI/ML Engineer',
    aliases: ['Machine Learning Engineer', 'AI Engineer', 'Deep Learning Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['TensorFlow', 'PyTorch', 'Python', 'Neural Networks', 'NLP', 'Computer Vision', 'MLOps'],
      soft: ['Analytical Thinking', 'Research', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Data Scientist', 'Research Scientist', 'ML Ops Engineer'],
    description: 'Builds and deploys machine learning models and AI systems'
  },

  'site-reliability-engineer': {
    canonicalTitle: 'Site Reliability Engineer',
    aliases: ['SRE', 'Production Engineer', 'Reliability Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Kubernetes', 'Docker', 'Monitoring', 'Incident Response', 'Automation', 'Linux', 'Python'],
      soft: ['Problem Solving', 'On-call Mindset', 'Collaboration', 'Process Improvement']
    },
    relatedTitles: ['DevOps Engineer', 'Platform Engineer', 'Infrastructure Engineer'],
    description: 'Ensures reliability, uptime, and performance of production systems'
  },

  'embedded-systems-engineer': {
    canonicalTitle: 'Embedded Systems Engineer',
    aliases: ['Embedded Software Engineer', 'Firmware Engineer', 'IoT Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['C', 'C++', 'RTOS', 'Microcontrollers', 'Hardware Integration', 'Debugging', 'Protocols'],
      soft: ['Problem Solving', 'Attention to Detail', 'Patience', 'Analytical Thinking']
    },
    relatedTitles: ['Hardware Engineer', 'Firmware Developer', 'IoT Developer'],
    description: 'Develops software for embedded systems and IoT devices'
  },

  'developer-advocate': {
    canonicalTitle: 'Developer Advocate',
    aliases: ['Developer Relations Engineer', 'DevRel', 'Technical Evangelist'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Software Development', 'APIs', 'SDKs', 'Technical Writing', 'Public Speaking'],
      soft: ['Communication', 'Community Building', 'Empathy', 'Presentation Skills']
    },
    relatedTitles: ['Technical Writer', 'Developer Relations Manager', 'Product Manager'],
    description: 'Advocates for developers and builds technical communities'
  },

  'release-manager': {
    canonicalTitle: 'Release Manager',
    aliases: ['Release Engineer', 'Deployment Manager', 'Build and Release Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['CI/CD', 'Jenkins', 'Git', 'Release Planning', 'Version Control', 'Automation'],
      soft: ['Organization', 'Communication', 'Risk Management', 'Planning']
    },
    relatedTitles: ['DevOps Engineer', 'Project Manager', 'Build Engineer'],
    description: 'Manages software release processes and deployment pipelines'
  },

  'performance-engineer': {
    canonicalTitle: 'Performance Engineer',
    aliases: ['Performance Analyst', 'Optimization Engineer', 'Load Testing Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Performance Testing', 'JMeter', 'Load Testing', 'Profiling', 'Optimization', 'Monitoring'],
      soft: ['Analytical Thinking', 'Problem Solving', 'Attention to Detail', 'Communication']
    },
    relatedTitles: ['QA Engineer', 'DevOps Engineer', 'Backend Developer'],
    description: 'Optimizes application performance and conducts load testing'
  },

  'integration-engineer': {
    canonicalTitle: 'Integration Engineer',
    aliases: ['Systems Integration Engineer', 'API Integration Engineer', 'Integration Specialist'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['APIs', 'REST', 'SOAP', 'Integration Platforms', 'Middleware', 'ETL', 'Data Mapping'],
      soft: ['Problem Solving', 'Communication', 'Systems Thinking', 'Documentation']
    },
    relatedTitles: ['Backend Developer', 'Solutions Architect', 'Data Engineer'],
    description: 'Integrates disparate systems and applications via APIs and middleware'
  },

  'ui-developer': {
    canonicalTitle: 'UI Developer',
    aliases: ['User Interface Developer', 'Front End UI Developer', 'Web UI Developer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Responsive Design', 'Accessibility'],
      soft: ['Creativity', 'Attention to Detail', 'Collaboration', 'User Focus']
    },
    relatedTitles: ['Frontend Developer', 'UX Designer', 'Web Developer'],
    description: 'Creates visually appealing and functional user interfaces'
  },

  'automation-engineer': {
    canonicalTitle: 'Automation Engineer',
    aliases: ['Test Automation Engineer', 'QA Automation Engineer', 'Automation Specialist'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Selenium', 'Cypress', 'Test Automation', 'Python', 'JavaScript', 'CI/CD', 'API Testing'],
      soft: ['Attention to Detail', 'Problem Solving', 'Efficiency Mindset', 'Communication']
    },
    relatedTitles: ['QA Engineer', 'SDET', 'DevOps Engineer'],
    description: 'Automates testing and quality assurance processes'
  },

  'platform-engineer': {
    canonicalTitle: 'Platform Engineer',
    aliases: ['Platform Developer', 'Infrastructure Platform Engineer', 'Internal Platform Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Kubernetes', 'Docker', 'Infrastructure as Code', 'CI/CD', 'Cloud Platforms', 'APIs'],
      soft: ['Systems Thinking', 'Developer Empathy', 'Collaboration', 'Problem Solving']
    },
    relatedTitles: ['DevOps Engineer', 'SRE', 'Cloud Engineer'],
    description: 'Builds internal platforms and developer tools for engineering teams'
  },

  'backend-developer': {
    canonicalTitle: 'Backend Developer',
    aliases: ['Backend Engineer', 'Server-Side Developer', 'API Developer'],
    industry: 'technology',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Node.js', 'Python', 'Java', 'SQL', 'REST APIs', 'Microservices', 'Database Design'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Collaboration', 'Optimization']
    },
    relatedTitles: ['Software Engineer', 'Full Stack Developer', 'API Engineer'],
    description: 'Develops server-side logic, databases, and APIs'
  },

  'tech-lead': {
    canonicalTitle: 'Tech Lead',
    aliases: ['Technical Lead', 'Lead Developer', 'Lead Software Engineer'],
    industry: 'technology',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Software Architecture', 'Code Review', 'System Design', 'Full Stack Development'],
      soft: ['Technical Leadership', 'Mentoring', 'Communication', 'Decision Making']
    },
    relatedTitles: ['Engineering Manager', 'Senior Engineer', 'Solutions Architect'],
    description: 'Leads technical direction and mentors engineering team'
  },

  'computer-vision-engineer': {
    canonicalTitle: 'Computer Vision Engineer',
    aliases: ['CV Engineer', 'Image Processing Engineer', 'Vision AI Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['OpenCV', 'TensorFlow', 'PyTorch', 'Image Processing', 'Deep Learning', 'Python', 'Neural Networks'],
      soft: ['Research', 'Problem Solving', 'Analytical Thinking', 'Innovation']
    },
    relatedTitles: ['ML Engineer', 'AI Engineer', 'Research Scientist'],
    description: 'Develops computer vision and image processing systems'
  },

  'nlp-engineer': {
    canonicalTitle: 'NLP Engineer',
    aliases: ['Natural Language Processing Engineer', 'Language AI Engineer', 'Conversational AI Engineer'],
    industry: 'technology',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Python', 'NLP', 'Transformers', 'BERT', 'SpaCy', 'Machine Learning', 'Deep Learning'],
      soft: ['Research', 'Problem Solving', 'Linguistics Knowledge', 'Communication']
    },
    relatedTitles: ['ML Engineer', 'AI Engineer', 'Data Scientist'],
    description: 'Develops natural language processing and understanding systems'
  },

  // ==========================================
  // FINANCE (20 titles)
  // ==========================================

  'financial-analyst': {
    canonicalTitle: 'Financial Analyst',
    aliases: ['Finance Analyst', 'Corporate Finance Analyst', 'FP&A Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Excel', 'Financial Modeling', 'Forecasting', 'Valuation', 'SQL', 'Power BI', 'Bloomberg'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Business Acumen']
    },
    relatedTitles: ['Business Analyst', 'Investment Analyst', 'Budget Analyst'],
    description: 'Analyzes financial data and creates forecasts and reports'
  },

  'accountant': {
    canonicalTitle: 'Accountant',
    aliases: ['Staff Accountant', 'Senior Accountant', 'Public Accountant', 'CPA'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['GAAP', 'QuickBooks', 'Excel', 'Journal Entries', 'Reconciliation', 'Financial Reporting'],
      soft: ['Attention to Detail', 'Organization', 'Integrity', 'Problem Solving']
    },
    relatedTitles: ['Controller', 'Tax Accountant', 'Auditor'],
    description: 'Manages financial records, prepares statements, and ensures compliance'
  },

  'investment-banker': {
    canonicalTitle: 'Investment Banker',
    aliases: ['Investment Banking Analyst', 'M&A Analyst', 'IBD Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Financial Modeling', 'Valuation', 'M&A', 'Excel', 'PowerPoint', 'Due Diligence', 'Capital Markets'],
      soft: ['Work Ethic', 'Attention to Detail', 'Communication', 'Pressure Management']
    },
    relatedTitles: ['Corporate Finance Analyst', 'Private Equity Associate', 'Portfolio Manager'],
    description: 'Facilitates corporate transactions, mergers, and capital raising'
  },

  'controller': {
    canonicalTitle: 'Controller',
    aliases: ['Financial Controller', 'Corporate Controller', 'Accounting Manager'],
    industry: 'finance',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Financial Reporting', 'GAAP', 'Budgeting', 'Internal Controls', 'ERP Systems', 'Audit Management'],
      soft: ['Leadership', 'Strategic Planning', 'Communication', 'Team Management']
    },
    relatedTitles: ['CFO', 'Director of Finance', 'VP of Finance'],
    description: 'Oversees accounting operations and financial reporting'
  },

  'cfo': {
    canonicalTitle: 'Chief Financial Officer',
    aliases: ['CFO', 'VP of Finance', 'Head of Finance'],
    industry: 'finance',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Financial Strategy', 'Corporate Finance', 'Financial Planning', 'Risk Management', 'Investor Relations'],
      soft: ['Executive Leadership', 'Strategic Thinking', 'Communication', 'Decision Making']
    },
    relatedTitles: ['Controller', 'Director of Finance', 'CEO'],
    description: 'Sets financial strategy and oversees all financial operations'
  },

  'auditor': {
    canonicalTitle: 'Auditor',
    aliases: ['Internal Auditor', 'External Auditor', 'Senior Auditor', 'IT Auditor'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Audit Procedures', 'GAAP', 'Risk Assessment', 'Internal Controls', 'Compliance', 'Data Analysis'],
      soft: ['Attention to Detail', 'Analytical Thinking', 'Independence', 'Communication']
    },
    relatedTitles: ['Accountant', 'Compliance Officer', 'Risk Analyst'],
    description: 'Examines financial records and ensures regulatory compliance'
  },

  'tax-specialist': {
    canonicalTitle: 'Tax Specialist',
    aliases: ['Tax Accountant', 'Tax Analyst', 'Tax Consultant', 'Tax Manager'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Tax Law', 'Tax Preparation', 'IRS Regulations', 'Tax Software', 'Research', 'Tax Planning'],
      soft: ['Attention to Detail', 'Analytical Thinking', 'Client Service', 'Communication']
    },
    relatedTitles: ['Accountant', 'Tax Attorney', 'CPA'],
    description: 'Prepares tax returns and provides tax planning advice'
  },

  'treasury-analyst': {
    canonicalTitle: 'Treasury Analyst',
    aliases: ['Cash Management Analyst', 'Treasury Associate', 'Corporate Treasury Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Cash Management', 'Liquidity Analysis', 'Excel', 'Forecasting', 'Banking Relationships', 'FX Hedging'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Risk Management', 'Communication']
    },
    relatedTitles: ['Financial Analyst', 'FP&A Analyst', 'Treasurer'],
    description: 'Manages company cash flow and liquidity'
  },

  'risk-analyst': {
    canonicalTitle: 'Risk Analyst',
    aliases: ['Credit Risk Analyst', 'Market Risk Analyst', 'Risk Management Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Risk Modeling', 'Statistics', 'Excel', 'VaR', 'Credit Analysis', 'Regulatory Compliance'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Financial Analyst', 'Compliance Officer', 'Quantitative Analyst'],
    description: 'Identifies and analyzes financial and operational risks'
  },

  'equity-research-analyst': {
    canonicalTitle: 'Equity Research Analyst',
    aliases: ['Research Analyst', 'Securities Analyst', 'Sell-Side Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Financial Modeling', 'Valuation', 'Industry Analysis', 'Bloomberg', 'Excel', 'Report Writing'],
      soft: ['Analytical Thinking', 'Communication', 'Research Skills', 'Independent Thinking']
    },
    relatedTitles: ['Investment Analyst', 'Portfolio Manager', 'Financial Analyst'],
    description: 'Researches and analyzes publicly traded companies and industries'
  },

  'portfolio-manager': {
    canonicalTitle: 'Portfolio Manager',
    aliases: ['Investment Manager', 'Fund Manager', 'Asset Manager'],
    industry: 'finance',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Portfolio Management', 'Asset Allocation', 'Risk Management', 'Performance Attribution', 'Bloomberg'],
      soft: ['Decision Making', 'Risk Assessment', 'Communication', 'Leadership']
    },
    relatedTitles: ['Investment Analyst', 'Wealth Manager', 'CIO'],
    description: 'Manages investment portfolios to meet client objectives'
  },

  'credit-analyst': {
    canonicalTitle: 'Credit Analyst',
    aliases: ['Commercial Credit Analyst', 'Corporate Credit Analyst', 'Lending Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Credit Analysis', 'Financial Statement Analysis', 'Risk Assessment', 'Loan Underwriting', 'Excel'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Decision Making', 'Communication']
    },
    relatedTitles: ['Risk Analyst', 'Financial Analyst', 'Underwriter'],
    description: 'Evaluates creditworthiness of individuals or companies'
  },

  'compliance-officer': {
    canonicalTitle: 'Compliance Officer',
    aliases: ['Compliance Analyst', 'Regulatory Compliance Specialist', 'AML Analyst'],
    industry: 'finance',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Regulatory Compliance', 'AML', 'KYC', 'Risk Assessment', 'Policy Development', 'Audit'],
      soft: ['Attention to Detail', 'Ethics', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Risk Analyst', 'Auditor', 'Legal Counsel'],
    description: 'Ensures organization complies with financial regulations'
  },

  'fp-and-a-manager': {
    canonicalTitle: 'FP&A Manager',
    aliases: ['Financial Planning and Analysis Manager', 'Finance Manager', 'Budget Manager'],
    industry: 'finance',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Budgeting', 'Forecasting', 'Financial Modeling', 'Variance Analysis', 'KPI Tracking', 'ERP Systems'],
      soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Business Partnership']
    },
    relatedTitles: ['Controller', 'Director of Finance', 'CFO'],
    description: 'Leads financial planning, budgeting, and analysis processes'
  },

  'quantitative-analyst': {
    canonicalTitle: 'Quantitative Analyst',
    aliases: ['Quant', 'Quantitative Researcher', 'Algo Trader'],
    industry: 'finance',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Python', 'R', 'Statistics', 'Financial Modeling', 'Machine Learning', 'Algorithmic Trading', 'C++'],
      soft: ['Mathematical Thinking', 'Problem Solving', 'Research', 'Analytical Thinking']
    },
    relatedTitles: ['Data Scientist', 'Risk Analyst', 'Trader'],
    description: 'Develops mathematical models for trading and risk management'
  },

  'wealth-manager': {
    canonicalTitle: 'Wealth Manager',
    aliases: ['Private Wealth Advisor', 'Investment Advisor', 'Financial Advisor'],
    industry: 'finance',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Financial Planning', 'Portfolio Management', 'Estate Planning', 'Tax Planning', 'Asset Allocation'],
      soft: ['Relationship Building', 'Communication', 'Trust Building', 'Sales']
    },
    relatedTitles: ['Financial Planner', 'Portfolio Manager', 'Private Banker'],
    description: 'Manages investments and financial planning for high-net-worth clients'
  },

  'investment-analyst': {
    canonicalTitle: 'Investment Analyst',
    aliases: ['Buy-Side Analyst', 'Private Equity Analyst', 'Venture Capital Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Financial Modeling', 'Valuation', 'Due Diligence', 'Excel', 'Industry Research', 'Investment Analysis'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Critical Thinking']
    },
    relatedTitles: ['Equity Research Analyst', 'Portfolio Manager', 'Investment Banker'],
    description: 'Analyzes investment opportunities and makes recommendations'
  },

  'trader': {
    canonicalTitle: 'Trader',
    aliases: ['Equity Trader', 'Fixed Income Trader', 'Derivatives Trader', 'Prop Trader'],
    industry: 'finance',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Trading Platforms', 'Market Analysis', 'Risk Management', 'Technical Analysis', 'Bloomberg'],
      soft: ['Decision Making', 'Pressure Management', 'Quick Thinking', 'Discipline']
    },
    relatedTitles: ['Portfolio Manager', 'Quantitative Analyst', 'Market Maker'],
    description: 'Buys and sells financial instruments for profit'
  },

  'financial-planner': {
    canonicalTitle: 'Financial Planner',
    aliases: ['Certified Financial Planner', 'CFP', 'Personal Financial Advisor'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Financial Planning', 'Retirement Planning', 'Tax Planning', 'Estate Planning', 'Insurance Analysis'],
      soft: ['Client Service', 'Communication', 'Empathy', 'Relationship Building']
    },
    relatedTitles: ['Wealth Manager', 'Investment Advisor', 'Insurance Agent'],
    description: 'Helps individuals plan their financial future and achieve goals'
  },

  'budget-analyst': {
    canonicalTitle: 'Budget Analyst',
    aliases: ['Budgeting Analyst', 'Cost Analyst', 'Financial Budget Analyst'],
    industry: 'finance',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Budgeting', 'Cost Analysis', 'Variance Analysis', 'Excel', 'Financial Reporting', 'Forecasting'],
      soft: ['Attention to Detail', 'Analytical Thinking', 'Organization', 'Communication']
    },
    relatedTitles: ['Financial Analyst', 'FP&A Analyst', 'Controller'],
    description: 'Prepares budget reports and monitors organizational spending'
  },

  // ==========================================
  // MARKETING (25 titles)
  // ==========================================

  'digital-marketing-manager': {
    canonicalTitle: 'Digital Marketing Manager',
    aliases: ['Online Marketing Manager', 'Digital Marketing Specialist', 'Performance Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Google Analytics', 'SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'Marketing Automation'],
      soft: ['Strategy', 'Creativity', 'Data-Driven', 'Communication']
    },
    relatedTitles: ['Marketing Manager', 'Growth Manager', 'Performance Marketing Manager'],
    description: 'Develops and executes digital marketing strategies across channels'
  },

  'content-marketing-manager': {
    canonicalTitle: 'Content Marketing Manager',
    aliases: ['Content Manager', 'Content Strategy Manager', 'Editorial Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Content Strategy', 'SEO', 'CMS', 'Analytics', 'Content Creation', 'Editorial Planning'],
      soft: ['Creativity', 'Writing', 'Leadership', 'Strategic Thinking']
    },
    relatedTitles: ['Content Strategist', 'Marketing Manager', 'Brand Manager'],
    description: 'Develops content strategy and manages content creation'
  },

  'seo-specialist': {
    canonicalTitle: 'SEO Specialist',
    aliases: ['SEO Manager', 'Search Engine Optimization Specialist', 'SEO Analyst'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['SEO', 'Google Analytics', 'Google Search Console', 'Keyword Research', 'Technical SEO', 'Link Building'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Adaptability', 'Communication']
    },
    relatedTitles: ['Digital Marketing Specialist', 'Content Marketer', 'SEM Specialist'],
    description: 'Optimizes websites for search engine rankings and organic traffic'
  },

  'social-media-manager': {
    canonicalTitle: 'Social Media Manager',
    aliases: ['Social Media Specialist', 'Community Manager', 'Social Media Strategist'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Social Media Platforms', 'Content Creation', 'Social Media Analytics', 'Scheduling Tools', 'Paid Social'],
      soft: ['Creativity', 'Communication', 'Brand Voice', 'Community Management']
    },
    relatedTitles: ['Digital Marketing Manager', 'Content Manager', 'Brand Manager'],
    description: 'Manages social media presence and engagement strategies'
  },

  'ppc-specialist': {
    canonicalTitle: 'PPC Specialist',
    aliases: ['Paid Search Specialist', 'SEM Specialist', 'Google Ads Specialist', 'Paid Media Specialist'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Google Ads', 'Facebook Ads', 'PPC Management', 'Conversion Optimization', 'Analytics', 'A/B Testing'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Budget Management', 'Optimization']
    },
    relatedTitles: ['Digital Marketing Specialist', 'Performance Marketer', 'Growth Marketer'],
    description: 'Manages paid advertising campaigns across search and social platforms'
  },

  'email-marketing-specialist': {
    canonicalTitle: 'Email Marketing Specialist',
    aliases: ['Email Marketing Manager', 'CRM Marketing Specialist', 'Lifecycle Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Email Marketing Platforms', 'Marketing Automation', 'Segmentation', 'A/B Testing', 'HTML/CSS', 'Analytics'],
      soft: ['Copywriting', 'Attention to Detail', 'Data-Driven', 'Creativity']
    },
    relatedTitles: ['CRM Manager', 'Marketing Automation Specialist', 'Digital Marketing Specialist'],
    description: 'Creates and manages email marketing campaigns and automation'
  },

  'brand-manager': {
    canonicalTitle: 'Brand Manager',
    aliases: ['Brand Marketing Manager', 'Product Marketing Manager', 'Brand Strategist'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Brand Strategy', 'Market Research', 'Campaign Management', 'Analytics', 'Budget Management'],
      soft: ['Strategic Thinking', 'Creativity', 'Leadership', 'Communication']
    },
    relatedTitles: ['Marketing Manager', 'Product Manager', 'CMO'],
    description: 'Develops and maintains brand identity and positioning'
  },

  'growth-marketer': {
    canonicalTitle: 'Growth Marketer',
    aliases: ['Growth Hacker', 'Growth Marketing Manager', 'Performance Marketer'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Growth Hacking', 'A/B Testing', 'Analytics', 'User Acquisition', 'Conversion Optimization', 'Product Marketing'],
      soft: ['Experimentation', 'Data-Driven', 'Creativity', 'Analytical Thinking']
    },
    relatedTitles: ['Digital Marketing Manager', 'Product Manager', 'Marketing Manager'],
    description: 'Drives rapid user and revenue growth through experimentation'
  },

  'marketing-analyst': {
    canonicalTitle: 'Marketing Analyst',
    aliases: ['Digital Marketing Analyst', 'Marketing Data Analyst', 'Marketing Intelligence Analyst'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Google Analytics', 'SQL', 'Excel', 'Data Visualization', 'A/B Testing', 'Attribution Modeling'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Data Analyst', 'Business Analyst', 'Digital Marketing Specialist'],
    description: 'Analyzes marketing data to measure performance and identify opportunities'
  },

  'copywriter': {
    canonicalTitle: 'Copywriter',
    aliases: ['Marketing Copywriter', 'Creative Copywriter', 'Content Writer', 'Ad Copywriter'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Copywriting', 'Content Writing', 'SEO Writing', 'Brand Voice', 'Advertising Copy'],
      soft: ['Creativity', 'Writing', 'Persuasion', 'Attention to Detail']
    },
    relatedTitles: ['Content Writer', 'Content Manager', 'Creative Director'],
    description: 'Writes compelling marketing copy for ads, websites, and campaigns'
  },

  'product-marketing-manager': {
    canonicalTitle: 'Product Marketing Manager',
    aliases: ['PMM', 'Product Marketer', 'Go-to-Market Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Product Positioning', 'Go-to-Market Strategy', 'Competitive Analysis', 'Messaging', 'Launch Planning'],
      soft: ['Strategic Thinking', 'Communication', 'Cross-Functional Collaboration', 'Storytelling']
    },
    relatedTitles: ['Product Manager', 'Brand Manager', 'Marketing Manager'],
    description: 'Positions products in market and drives go-to-market strategies'
  },

  'marketing-automation-specialist': {
    canonicalTitle: 'Marketing Automation Specialist',
    aliases: ['Marketing Ops Specialist', 'Marketo Specialist', 'HubSpot Specialist'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Marketing Automation', 'HubSpot', 'Marketo', 'Salesforce', 'Workflow Automation', 'Lead Scoring'],
      soft: ['Technical Aptitude', 'Problem Solving', 'Attention to Detail', 'Process Improvement']
    },
    relatedTitles: ['CRM Manager', 'Email Marketing Specialist', 'Marketing Operations Manager'],
    description: 'Implements and manages marketing automation platforms and workflows'
  },

  'demand-generation-manager': {
    canonicalTitle: 'Demand Generation Manager',
    aliases: ['Demand Gen Manager', 'Lead Generation Manager', 'Pipeline Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Lead Generation', 'Campaign Management', 'Marketing Automation', 'Analytics', 'ABM', 'Funnel Optimization'],
      soft: ['Strategic Thinking', 'Data-Driven', 'Cross-Functional Leadership', 'Results-Oriented']
    },
    relatedTitles: ['Marketing Manager', 'Growth Marketer', 'Performance Marketing Manager'],
    description: 'Drives demand and generates qualified leads for sales pipeline'
  },

  'cmo': {
    canonicalTitle: 'Chief Marketing Officer',
    aliases: ['CMO', 'VP of Marketing', 'Head of Marketing'],
    industry: 'marketing',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Marketing Strategy', 'Brand Development', 'Digital Marketing', 'Budget Management', 'Marketing Analytics'],
      soft: ['Executive Leadership', 'Strategic Vision', 'Team Building', 'Communication']
    },
    relatedTitles: ['VP of Marketing', 'Director of Marketing', 'CEO'],
    description: 'Sets marketing vision and strategy for the entire organization'
  },

  'affiliate-marketing-manager': {
    canonicalTitle: 'Affiliate Marketing Manager',
    aliases: ['Affiliate Manager', 'Partner Marketing Manager', 'Performance Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Affiliate Marketing', 'Partnership Management', 'Performance Tracking', 'Commission Management'],
      soft: ['Relationship Building', 'Negotiation', 'Analytical Thinking', 'Communication']
    },
    relatedTitles: ['Partnership Manager', 'Performance Marketer', 'Digital Marketing Manager'],
    description: 'Manages affiliate partnerships and performance marketing programs'
  },

  'public-relations-manager': {
    canonicalTitle: 'Public Relations Manager',
    aliases: ['PR Manager', 'Communications Manager', 'Media Relations Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Media Relations', 'Press Release Writing', 'Crisis Communication', 'Publicity', 'Event Planning'],
      soft: ['Communication', 'Relationship Building', 'Storytelling', 'Crisis Management']
    },
    relatedTitles: ['Communications Director', 'Brand Manager', 'Marketing Manager'],
    description: 'Manages public image and media relationships'
  },

  'influencer-marketing-manager': {
    canonicalTitle: 'Influencer Marketing Manager',
    aliases: ['Influencer Manager', 'Creator Partnerships Manager', 'Influencer Relations Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Influencer Marketing', 'Campaign Management', 'Analytics', 'Contract Negotiation', 'Social Media'],
      soft: ['Relationship Building', 'Creativity', 'Communication', 'Negotiation']
    },
    relatedTitles: ['Social Media Manager', 'Partnership Manager', 'Brand Manager'],
    description: 'Manages influencer partnerships and creator campaigns'
  },

  'conversion-rate-optimizer': {
    canonicalTitle: 'Conversion Rate Optimizer',
    aliases: ['CRO Specialist', 'Conversion Optimization Manager', 'Growth Optimizer'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['A/B Testing', 'Conversion Optimization', 'Analytics', 'User Testing', 'Heatmaps', 'Landing Page Optimization'],
      soft: ['Analytical Thinking', 'Experimentation', 'Data-Driven', 'Problem Solving']
    },
    relatedTitles: ['Growth Marketer', 'UX Designer', 'Digital Marketing Manager'],
    description: 'Optimizes websites and funnels to increase conversion rates'
  },

  'marketing-director': {
    canonicalTitle: 'Marketing Director',
    aliases: ['Director of Marketing', 'Senior Marketing Manager', 'Head of Marketing'],
    industry: 'marketing',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Marketing Strategy', 'Budget Management', 'Team Leadership', 'Campaign Planning', 'Analytics'],
      soft: ['Leadership', 'Strategic Thinking', 'Communication', 'Team Building']
    },
    relatedTitles: ['CMO', 'VP of Marketing', 'Brand Manager'],
    description: 'Leads marketing department and oversees all marketing initiatives'
  },

  'event-marketing-manager': {
    canonicalTitle: 'Event Marketing Manager',
    aliases: ['Events Manager', 'Field Marketing Manager', 'Experiential Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Event Planning', 'Budget Management', 'Vendor Management', 'Event Technology', 'Lead Capture'],
      soft: ['Organization', 'Communication', 'Project Management', 'Creativity']
    },
    relatedTitles: ['Marketing Manager', 'Field Marketing Manager', 'Brand Manager'],
    description: 'Plans and executes marketing events, conferences, and activations'
  },

  'marketing-coordinator': {
    canonicalTitle: 'Marketing Coordinator',
    aliases: ['Marketing Associate', 'Junior Marketing Specialist', 'Marketing Assistant'],
    industry: 'marketing',
    suitableLevels: ['entry'],
    typicalSkills: {
      technical: ['Social Media', 'Content Creation', 'Campaign Support', 'Analytics', 'Project Coordination'],
      soft: ['Organization', 'Communication', 'Adaptability', 'Team Player']
    },
    relatedTitles: ['Marketing Specialist', 'Marketing Manager', 'Digital Marketing Specialist'],
    description: 'Supports marketing team with campaign execution and coordination'
  },

  'video-marketing-specialist': {
    canonicalTitle: 'Video Marketing Specialist',
    aliases: ['Video Content Creator', 'Video Producer', 'YouTube Marketing Specialist'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Video Production', 'Video Editing', 'YouTube', 'Analytics', 'Storytelling', 'Adobe Premiere'],
      soft: ['Creativity', 'Visual Thinking', 'Communication', 'Adaptability']
    },
    relatedTitles: ['Content Creator', 'Social Media Manager', 'Creative Director'],
    description: 'Creates and manages video content for marketing campaigns'
  },

  'partnership-marketing-manager': {
    canonicalTitle: 'Partnership Marketing Manager',
    aliases: ['Partnerships Manager', 'Strategic Partnerships Manager', 'Channel Marketing Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Partnership Development', 'Co-Marketing', 'Channel Strategy', 'Contract Negotiation', 'ROI Analysis'],
      soft: ['Relationship Building', 'Negotiation', 'Strategic Thinking', 'Communication']
    },
    relatedTitles: ['Business Development Manager', 'Affiliate Manager', 'Marketing Manager'],
    description: 'Develops and manages strategic marketing partnerships'
  },

  'market-research-analyst': {
    canonicalTitle: 'Market Research Analyst',
    aliases: ['Marketing Research Analyst', 'Consumer Insights Analyst', 'Market Analyst'],
    industry: 'marketing',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Market Research', 'Survey Design', 'Data Analysis', 'SPSS', 'Focus Groups', 'Competitive Analysis'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Critical Thinking']
    },
    relatedTitles: ['Marketing Analyst', 'Business Analyst', 'Data Analyst'],
    description: 'Conducts research to understand markets, customers, and competitors'
  },

  'lifecycle-marketing-manager': {
    canonicalTitle: 'Lifecycle Marketing Manager',
    aliases: ['Customer Lifecycle Manager', 'Retention Marketing Manager', 'CRM Manager'],
    industry: 'marketing',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Marketing Automation', 'Customer Segmentation', 'Email Marketing', 'Retention Strategy', 'Analytics'],
      soft: ['Strategic Thinking', 'Customer Empathy', 'Data-Driven', 'Communication']
    },
    relatedTitles: ['CRM Manager', 'Email Marketing Manager', 'Growth Marketer'],
    description: 'Manages customer journey and drives retention through targeted campaigns'
  },

  // ==========================================
  // HEALTHCARE (20 titles)
  // ==========================================

  'registered-nurse': {
    canonicalTitle: 'Registered Nurse',
    aliases: ['RN', 'Staff Nurse', 'Clinical Nurse', 'Bedside Nurse'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Patient Care', 'Medical Terminology', 'EMR Systems', 'IV Therapy', 'Medication Administration', 'Vital Signs'],
      soft: ['Compassion', 'Communication', 'Attention to Detail', 'Stress Management']
    },
    relatedTitles: ['Nurse Practitioner', 'Clinical Nurse Specialist', 'Charge Nurse'],
    description: 'Provides patient care and coordinates treatment in healthcare settings'
  },

  'physician': {
    canonicalTitle: 'Physician',
    aliases: ['Medical Doctor', 'MD', 'Doctor', 'Attending Physician'],
    industry: 'healthcare',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Medical Diagnosis', 'Treatment Planning', 'Patient Assessment', 'Medical Procedures', 'EMR', 'Evidence-Based Medicine'],
      soft: ['Clinical Judgment', 'Communication', 'Empathy', 'Decision Making']
    },
    relatedTitles: ['Surgeon', 'Specialist', 'Chief Medical Officer'],
    description: 'Diagnoses and treats medical conditions and diseases'
  },

  'medical-assistant': {
    canonicalTitle: 'Medical Assistant',
    aliases: ['Clinical Medical Assistant', 'Certified Medical Assistant', 'MA'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Vital Signs', 'Patient Intake', 'Phlebotomy', 'EMR', 'Medical Terminology', 'Scheduling'],
      soft: ['Patient Care', 'Organization', 'Communication', 'Multitasking']
    },
    relatedTitles: ['Nurse', 'Medical Receptionist', 'Phlebotomist'],
    description: 'Assists physicians with patient care and clinical tasks'
  },

  'physical-therapist': {
    canonicalTitle: 'Physical Therapist',
    aliases: ['PT', 'Physiotherapist', 'Rehabilitation Therapist'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Rehabilitation', 'Exercise Prescription', 'Manual Therapy', 'Patient Assessment', 'Treatment Planning'],
      soft: ['Patient Motivation', 'Communication', 'Empathy', 'Problem Solving']
    },
    relatedTitles: ['Occupational Therapist', 'Athletic Trainer', 'Rehabilitation Specialist'],
    description: 'Helps patients recover mobility and manage pain through therapy'
  },

  'pharmacist': {
    canonicalTitle: 'Pharmacist',
    aliases: ['Clinical Pharmacist', 'Retail Pharmacist', 'Hospital Pharmacist'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Medication Dispensing', 'Drug Interactions', 'Patient Counseling', 'Pharmacy Systems', 'Clinical Knowledge'],
      soft: ['Attention to Detail', 'Communication', 'Patient Care', 'Problem Solving']
    },
    relatedTitles: ['Pharmacy Manager', 'Clinical Pharmacy Specialist', 'Pharmacy Director'],
    description: 'Dispenses medications and provides pharmaceutical care'
  },

  'healthcare-administrator': {
    canonicalTitle: 'Healthcare Administrator',
    aliases: ['Hospital Administrator', 'Healthcare Manager', 'Medical Office Manager'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior', 'executive'],
    typicalSkills: {
      technical: ['Healthcare Management', 'Budgeting', 'Regulatory Compliance', 'EMR Systems', 'Staff Management'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Strategic Planning']
    },
    relatedTitles: ['Practice Manager', 'Director of Operations', 'COO'],
    description: 'Manages healthcare facility operations and administration'
  },

  'medical-billing-specialist': {
    canonicalTitle: 'Medical Billing Specialist',
    aliases: ['Medical Biller', 'Billing Specialist', 'Medical Billing and Coding Specialist'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Medical Coding', 'ICD-10', 'CPT Codes', 'Insurance Claims', 'EMR', 'Revenue Cycle'],
      soft: ['Attention to Detail', 'Organization', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Medical Coder', 'Billing Manager', 'Revenue Cycle Analyst'],
    description: 'Processes medical claims and manages billing operations'
  },

  'radiology-technician': {
    canonicalTitle: 'Radiology Technician',
    aliases: ['Radiologic Technologist', 'X-Ray Technician', 'Imaging Technician'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['X-Ray Equipment', 'CT Scans', 'MRI', 'Patient Positioning', 'Radiation Safety', 'PACS'],
      soft: ['Attention to Detail', 'Patient Care', 'Communication', 'Technical Aptitude']
    },
    relatedTitles: ['MRI Technologist', 'CT Technologist', 'Radiologist'],
    description: 'Performs diagnostic imaging procedures like X-rays and MRIs'
  },

  'dental-hygienist': {
    canonicalTitle: 'Dental Hygienist',
    aliases: ['RDH', 'Hygienist', 'Registered Dental Hygienist'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Teeth Cleaning', 'Oral Examination', 'X-Rays', 'Patient Education', 'Periodontal Care'],
      soft: ['Patient Care', 'Communication', 'Attention to Detail', 'Manual Dexterity']
    },
    relatedTitles: ['Dentist', 'Dental Assistant', 'Periodontist'],
    description: 'Provides preventive dental care and patient education'
  },

  'clinical-research-coordinator': {
    canonicalTitle: 'Clinical Research Coordinator',
    aliases: ['CRC', 'Study Coordinator', 'Clinical Trials Coordinator'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Clinical Trials', 'GCP Compliance', 'Data Collection', 'IRB Submissions', 'Patient Recruitment'],
      soft: ['Organization', 'Attention to Detail', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Clinical Research Associate', 'Study Manager', 'Research Scientist'],
    description: 'Manages and coordinates clinical research studies'
  },

  'nurse-practitioner': {
    canonicalTitle: 'Nurse Practitioner',
    aliases: ['NP', 'APRN', 'Advanced Practice Nurse'],
    industry: 'healthcare',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Patient Diagnosis', 'Treatment Planning', 'Prescribing', 'Patient Care', 'EMR', 'Evidence-Based Practice'],
      soft: ['Clinical Judgment', 'Communication', 'Leadership', 'Patient Advocacy']
    },
    relatedTitles: ['Physician Assistant', 'Registered Nurse', 'Physician'],
    description: 'Provides advanced nursing care including diagnosis and treatment'
  },

  'occupational-therapist': {
    canonicalTitle: 'Occupational Therapist',
    aliases: ['OT', 'Certified Occupational Therapist'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Activity Analysis', 'Adaptive Equipment', 'Rehabilitation', 'Patient Assessment', 'Treatment Planning'],
      soft: ['Creativity', 'Patient Motivation', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Physical Therapist', 'Speech Therapist', 'Rehabilitation Specialist'],
    description: 'Helps patients develop or recover daily living skills'
  },

  'health-information-technician': {
    canonicalTitle: 'Health Information Technician',
    aliases: ['Medical Records Technician', 'HIT', 'Health Information Manager'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Medical Coding', 'EMR Systems', 'Data Management', 'HIPAA Compliance', 'Medical Terminology'],
      soft: ['Attention to Detail', 'Organization', 'Confidentiality', 'Technical Aptitude']
    },
    relatedTitles: ['Medical Coder', 'Medical Records Manager', 'Health Data Analyst'],
    description: 'Manages and maintains patient health information and records'
  },

  'respiratory-therapist': {
    canonicalTitle: 'Respiratory Therapist',
    aliases: ['RT', 'Pulmonary Therapist', 'Respiratory Care Practitioner'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Ventilator Management', 'Oxygen Therapy', 'Pulmonary Function Testing', 'Patient Assessment'],
      soft: ['Critical Thinking', 'Patient Care', 'Communication', 'Stress Management']
    },
    relatedTitles: ['ICU Nurse', 'Pulmonologist', 'Anesthesiologist'],
    description: 'Treats patients with breathing disorders and manages respiratory care'
  },

  'laboratory-technician': {
    canonicalTitle: 'Laboratory Technician',
    aliases: ['Medical Lab Technician', 'Clinical Lab Tech', 'MLT'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Lab Testing', 'Microscopy', 'Specimen Processing', 'Quality Control', 'Laboratory Equipment'],
      soft: ['Attention to Detail', 'Technical Aptitude', 'Organization', 'Problem Solving']
    },
    relatedTitles: ['Medical Technologist', 'Pathologist', 'Phlebotomist'],
    description: 'Performs laboratory tests and analyzes medical specimens'
  },

  'case-manager': {
    canonicalTitle: 'Case Manager',
    aliases: ['Care Coordinator', 'Care Manager', 'Patient Advocate'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Care Coordination', 'Patient Assessment', 'Resource Management', 'EMR', 'Insurance Knowledge'],
      soft: ['Communication', 'Empathy', 'Organization', 'Problem Solving']
    },
    relatedTitles: ['Social Worker', 'Nurse', 'Care Coordinator'],
    description: 'Coordinates patient care across healthcare services and providers'
  },

  'psychiatric-nurse': {
    canonicalTitle: 'Psychiatric Nurse',
    aliases: ['Mental Health Nurse', 'Psych Nurse', 'Behavioral Health Nurse'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Mental Health Assessment', 'Crisis Intervention', 'Medication Management', 'Therapeutic Communication'],
      soft: ['Empathy', 'Patience', 'Communication', 'De-escalation']
    },
    relatedTitles: ['Psychiatric NP', 'Social Worker', 'Psychiatrist'],
    description: 'Provides nursing care for patients with mental health conditions'
  },

  'phlebotomist': {
    canonicalTitle: 'Phlebotomist',
    aliases: ['Phlebotomy Technician', 'Blood Draw Technician'],
    industry: 'healthcare',
    suitableLevels: ['entry'],
    typicalSkills: {
      technical: ['Blood Collection', 'Venipuncture', 'Specimen Handling', 'Laboratory Procedures'],
      soft: ['Patient Care', 'Attention to Detail', 'Communication', 'Manual Dexterity']
    },
    relatedTitles: ['Medical Assistant', 'Laboratory Technician', 'Nurse'],
    description: 'Draws blood samples for medical testing and transfusions'
  },

  'dialysis-technician': {
    canonicalTitle: 'Dialysis Technician',
    aliases: ['Hemodialysis Technician', 'Renal Dialysis Technician', 'Patient Care Technician'],
    industry: 'healthcare',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Dialysis Equipment', 'Vascular Access', 'Patient Monitoring', 'Machine Maintenance'],
      soft: ['Patient Care', 'Attention to Detail', 'Communication', 'Compassion']
    },
    relatedTitles: ['Nurse', 'Medical Assistant', 'Nephrologist'],
    description: 'Operates dialysis equipment and monitors patients during treatment'
  },

  'medical-social-worker': {
    canonicalTitle: 'Medical Social Worker',
    aliases: ['Clinical Social Worker', 'Hospital Social Worker', 'Healthcare Social Worker'],
    industry: 'healthcare',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Patient Assessment', 'Discharge Planning', 'Resource Coordination', 'Counseling', 'Crisis Intervention'],
      soft: ['Empathy', 'Communication', 'Advocacy', 'Problem Solving']
    },
    relatedTitles: ['Case Manager', 'Therapist', 'Care Coordinator'],
    description: 'Provides social services and support to patients and families'
  },

  // ==========================================
  // SALES (20 titles)
  // ==========================================

  'sales-representative': {
    canonicalTitle: 'Sales Representative',
    aliases: ['Sales Rep', 'Sales Associate', 'Account Executive'],
    industry: 'sales',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['CRM', 'Sales Process', 'Product Knowledge', 'Pipeline Management', 'Salesforce'],
      soft: ['Communication', 'Persuasion', 'Resilience', 'Relationship Building']
    },
    relatedTitles: ['Account Manager', 'Business Development Representative', 'Sales Manager'],
    description: 'Sells products or services to customers and manages accounts'
  },

  'account-executive': {
    canonicalTitle: 'Account Executive',
    aliases: ['AE', 'Senior Sales Representative', 'Sales Executive'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Complex Sales', 'Contract Negotiation', 'CRM', 'Pipeline Management', 'Sales Presentations'],
      soft: ['Relationship Building', 'Communication', 'Negotiation', 'Strategic Thinking']
    },
    relatedTitles: ['Account Manager', 'Sales Representative', 'Regional Sales Manager'],
    description: 'Manages full sales cycle for key accounts and closes deals'
  },

  'business-development-representative': {
    canonicalTitle: 'Business Development Representative',
    aliases: ['BDR', 'Sales Development Representative', 'SDR', 'Lead Generation Specialist'],
    industry: 'sales',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Lead Generation', 'Cold Calling', 'Email Outreach', 'CRM', 'Qualification', 'Prospecting'],
      soft: ['Communication', 'Persistence', 'Resilience', 'Organization']
    },
    relatedTitles: ['Account Executive', 'Sales Representative', 'Inside Sales Rep'],
    description: 'Generates and qualifies leads for the sales team'
  },

  'sales-manager': {
    canonicalTitle: 'Sales Manager',
    aliases: ['Regional Sales Manager', 'District Sales Manager', 'Sales Team Lead'],
    industry: 'sales',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Sales Strategy', 'Team Management', 'Forecasting', 'CRM', 'Performance Metrics', 'Territory Planning'],
      soft: ['Leadership', 'Coaching', 'Communication', 'Motivation']
    },
    relatedTitles: ['VP of Sales', 'Director of Sales', 'Account Executive'],
    description: 'Leads and manages a team of sales representatives'
  },

  'inside-sales-representative': {
    canonicalTitle: 'Inside Sales Representative',
    aliases: ['Inside Sales Rep', 'Remote Sales Rep', 'Telesales Representative'],
    industry: 'sales',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Phone Sales', 'CRM', 'Product Demos', 'Lead Qualification', 'Email Outreach'],
      soft: ['Communication', 'Persuasion', 'Active Listening', 'Time Management']
    },
    relatedTitles: ['Account Executive', 'BDR', 'Sales Representative'],
    description: 'Sells products remotely via phone, email, and video calls'
  },

  'field-sales-representative': {
    canonicalTitle: 'Field Sales Representative',
    aliases: ['Outside Sales Rep', 'Territory Sales Rep', 'Field Sales Executive'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Territory Management', 'In-Person Selling', 'Relationship Building', 'CRM', 'Product Demos'],
      soft: ['Communication', 'Networking', 'Self-Motivation', 'Travel Flexibility']
    },
    relatedTitles: ['Account Manager', 'Regional Sales Manager', 'Sales Representative'],
    description: 'Sells products in person by traveling to meet clients'
  },

  'account-manager': {
    canonicalTitle: 'Account Manager',
    aliases: ['Client Success Manager', 'Relationship Manager', 'Key Account Manager'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Account Management', 'Upselling', 'CRM', 'Contract Renewals', 'Customer Success'],
      soft: ['Relationship Building', 'Communication', 'Problem Solving', 'Customer Focus']
    },
    relatedTitles: ['Account Executive', 'Customer Success Manager', 'Sales Manager'],
    description: 'Manages existing customer relationships and drives account growth'
  },

  'vp-of-sales': {
    canonicalTitle: 'VP of Sales',
    aliases: ['Vice President of Sales', 'Sales Director', 'Head of Sales'],
    industry: 'sales',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Sales Strategy', 'Revenue Forecasting', 'Team Leadership', 'Go-to-Market Strategy', 'CRM'],
      soft: ['Executive Leadership', 'Strategic Thinking', 'Communication', 'Team Building']
    },
    relatedTitles: ['Chief Revenue Officer', 'Director of Sales', 'Sales Manager'],
    description: 'Sets sales strategy and leads the entire sales organization'
  },

  'sales-engineer': {
    canonicalTitle: 'Sales Engineer',
    aliases: ['Solutions Engineer', 'Technical Sales Engineer', 'Presales Engineer'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Technical Presentations', 'Product Demos', 'Solution Design', 'Technical Documentation', 'CRM'],
      soft: ['Communication', 'Problem Solving', 'Collaboration', 'Customer Focus']
    },
    relatedTitles: ['Solutions Architect', 'Account Executive', 'Product Manager'],
    description: 'Provides technical expertise during the sales process'
  },

  'channel-sales-manager': {
    canonicalTitle: 'Channel Sales Manager',
    aliases: ['Partner Manager', 'Channel Manager', 'Indirect Sales Manager'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Partner Management', 'Channel Strategy', 'Partner Enablement', 'CRM', 'Co-Selling'],
      soft: ['Relationship Building', 'Communication', 'Negotiation', 'Strategic Thinking']
    },
    relatedTitles: ['Partnership Manager', 'Sales Manager', 'Business Development Manager'],
    description: 'Manages relationships with channel partners and resellers'
  },

  'enterprise-sales-executive': {
    canonicalTitle: 'Enterprise Sales Executive',
    aliases: ['Enterprise Account Executive', 'Strategic Account Executive', 'Large Account Executive'],
    industry: 'sales',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Enterprise Sales', 'Complex Deal Negotiation', 'Account Planning', 'Executive Relationships', 'CRM'],
      soft: ['Strategic Thinking', 'Relationship Building', 'Persistence', 'Executive Presence']
    },
    relatedTitles: ['Account Executive', 'VP of Sales', 'Strategic Account Manager'],
    description: 'Sells to large enterprise customers with complex sales cycles'
  },

  'retail-sales-associate': {
    canonicalTitle: 'Retail Sales Associate',
    aliases: ['Sales Associate', 'Store Associate', 'Retail Consultant'],
    industry: 'sales',
    suitableLevels: ['entry'],
    typicalSkills: {
      technical: ['POS Systems', 'Inventory Management', 'Product Knowledge', 'Cash Handling'],
      soft: ['Customer Service', 'Communication', 'Teamwork', 'Adaptability']
    },
    relatedTitles: ['Store Manager', 'Retail Manager', 'Customer Service Representative'],
    description: 'Assists customers and sells products in retail settings'
  },

  'sales-operations-analyst': {
    canonicalTitle: 'Sales Operations Analyst',
    aliases: ['Sales Ops Analyst', 'Revenue Operations Analyst', 'Sales Analytics Analyst'],
    industry: 'sales',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Sales Analytics', 'CRM', 'Salesforce Administration', 'Data Analysis', 'Forecasting', 'Excel'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Business Analyst', 'Data Analyst', 'Sales Operations Manager'],
    description: 'Analyzes sales data and optimizes sales processes'
  },

  'customer-success-manager': {
    canonicalTitle: 'Customer Success Manager',
    aliases: ['CSM', 'Client Success Manager', 'Customer Experience Manager'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Customer Success Platforms', 'Account Management', 'Product Knowledge', 'Data Analysis', 'CRM'],
      soft: ['Relationship Building', 'Problem Solving', 'Empathy', 'Communication']
    },
    relatedTitles: ['Account Manager', 'Customer Support Manager', 'Account Executive'],
    description: 'Ensures customers achieve their goals and renew subscriptions'
  },

  'business-development-manager': {
    canonicalTitle: 'Business Development Manager',
    aliases: ['BD Manager', 'Partnerships Manager', 'Growth Manager'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Partnership Development', 'Market Research', 'Deal Structuring', 'CRM', 'Strategic Planning'],
      soft: ['Strategic Thinking', 'Networking', 'Negotiation', 'Communication']
    },
    relatedTitles: ['Partnerships Manager', 'Sales Manager', 'VP of Business Development'],
    description: 'Identifies and develops new business opportunities and partnerships'
  },

  'regional-sales-director': {
    canonicalTitle: 'Regional Sales Director',
    aliases: ['Regional Director', 'Area Sales Director', 'Territory Director'],
    industry: 'sales',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Sales Strategy', 'Team Leadership', 'Territory Planning', 'Forecasting', 'P&L Management'],
      soft: ['Leadership', 'Strategic Planning', 'Communication', 'Decision Making']
    },
    relatedTitles: ['VP of Sales', 'Sales Manager', 'Director of Sales'],
    description: 'Oversees sales operations and teams across a geographic region'
  },

  'sales-trainer': {
    canonicalTitle: 'Sales Trainer',
    aliases: ['Sales Enablement Specialist', 'Sales Coach', 'Sales Training Manager'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Sales Training', 'Curriculum Development', 'LMS', 'Sales Methodologies', 'Coaching'],
      soft: ['Communication', 'Teaching', 'Motivation', 'Presentation Skills']
    },
    relatedTitles: ['Sales Enablement Manager', 'Sales Manager', 'Training Manager'],
    description: 'Trains and develops sales teams on selling skills and processes'
  },

  'pre-sales-consultant': {
    canonicalTitle: 'Presales Consultant',
    aliases: ['Presales Specialist', 'Solution Consultant', 'Technical Consultant'],
    industry: 'sales',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Solution Design', 'Product Demos', 'RFP Responses', 'Technical Presentations', 'POC Management'],
      soft: ['Communication', 'Problem Solving', 'Collaboration', 'Customer Focus']
    },
    relatedTitles: ['Sales Engineer', 'Solutions Architect', 'Account Executive'],
    description: 'Provides technical expertise and demonstrations during the sales cycle'
  },

  'sales-enablement-manager': {
    canonicalTitle: 'Sales Enablement Manager',
    aliases: ['Enablement Manager', 'Sales Productivity Manager', 'Revenue Enablement Manager'],
    industry: 'sales',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Sales Training', 'Content Creation', 'Sales Tools', 'CRM', 'Process Optimization', 'Metrics'],
      soft: ['Strategic Thinking', 'Communication', 'Project Management', 'Cross-Functional Leadership']
    },
    relatedTitles: ['Sales Operations Manager', 'Sales Trainer', 'Sales Director'],
    description: 'Equips sales teams with tools, training, and content to sell effectively'
  },

  'chief-revenue-officer': {
    canonicalTitle: 'Chief Revenue Officer',
    aliases: ['CRO', 'Chief Commercial Officer', 'Head of Revenue'],
    industry: 'sales',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Revenue Strategy', 'Go-to-Market', 'Sales & Marketing Alignment', 'Forecasting', 'P&L Management'],
      soft: ['Executive Leadership', 'Strategic Vision', 'Communication', 'Team Building']
    },
    relatedTitles: ['VP of Sales', 'CMO', 'CEO'],
    description: 'Oversees all revenue-generating functions including sales, marketing, and customer success'
  },

  // ==========================================
  // OPERATIONS (15 titles)
  // ==========================================

  'operations-manager': {
    canonicalTitle: 'Operations Manager',
    aliases: ['Operations Supervisor', 'Ops Manager', 'Plant Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Process Improvement', 'Project Management', 'Inventory Management', 'ERP Systems', 'Budgeting'],
      soft: ['Leadership', 'Problem Solving', 'Communication', 'Organization']
    },
    relatedTitles: ['Director of Operations', 'Production Manager', 'COO'],
    description: 'Oversees daily operations and optimizes business processes'
  },

  'supply-chain-manager': {
    canonicalTitle: 'Supply Chain Manager',
    aliases: ['Logistics Manager', 'Supply Chain Analyst', 'Procurement Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Supply Chain Management', 'Logistics', 'Inventory Optimization', 'ERP', 'Vendor Management'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Negotiation', 'Communication']
    },
    relatedTitles: ['Procurement Specialist', 'Logistics Coordinator', 'Operations Manager'],
    description: 'Manages supply chain operations and vendor relationships'
  },

  'project-manager': {
    canonicalTitle: 'Project Manager',
    aliases: ['PM', 'Program Manager', 'Project Lead', 'Scrum Master'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Project Management', 'Jira', 'Agile', 'Risk Management', 'Budgeting', 'Gantt Charts'],
      soft: ['Leadership', 'Communication', 'Organization', 'Problem Solving']
    },
    relatedTitles: ['Program Manager', 'Product Manager', 'Operations Manager'],
    description: 'Plans, executes, and delivers projects on time and within budget'
  },

  'warehouse-manager': {
    canonicalTitle: 'Warehouse Manager',
    aliases: ['Distribution Manager', 'Warehouse Supervisor', 'Inventory Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Warehouse Management', 'Inventory Control', 'WMS', 'Logistics', 'Safety Compliance'],
      soft: ['Leadership', 'Organization', 'Problem Solving', 'Team Management']
    },
    relatedTitles: ['Operations Manager', 'Supply Chain Manager', 'Logistics Manager'],
    description: 'Manages warehouse operations, inventory, and distribution'
  },

  'logistics-coordinator': {
    canonicalTitle: 'Logistics Coordinator',
    aliases: ['Logistics Specialist', 'Transportation Coordinator', 'Shipping Coordinator'],
    industry: 'operations',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Transportation Management', 'Shipping', 'Route Optimization', 'TMS', 'Documentation'],
      soft: ['Organization', 'Communication', 'Problem Solving', 'Attention to Detail']
    },
    relatedTitles: ['Supply Chain Analyst', 'Warehouse Coordinator', 'Logistics Manager'],
    description: 'Coordinates transportation and logistics operations'
  },

  'process-improvement-specialist': {
    canonicalTitle: 'Process Improvement Specialist',
    aliases: ['Continuous Improvement Specialist', 'Lean Six Sigma Specialist', 'Business Process Analyst'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Lean Six Sigma', 'Process Mapping', 'Data Analysis', 'Kaizen', 'Value Stream Mapping'],
      soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Change Management']
    },
    relatedTitles: ['Operations Manager', 'Business Analyst', 'Quality Manager'],
    description: 'Analyzes and improves operational processes and efficiency'
  },

  'production-manager': {
    canonicalTitle: 'Production Manager',
    aliases: ['Manufacturing Manager', 'Production Supervisor', 'Plant Supervisor'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Production Planning', 'Quality Control', 'Lean Manufacturing', 'ERP', 'Safety Management'],
      soft: ['Leadership', 'Problem Solving', 'Communication', 'Decision Making']
    },
    relatedTitles: ['Operations Manager', 'Plant Manager', 'Manufacturing Engineer'],
    description: 'Oversees manufacturing and production operations'
  },

  'quality-assurance-manager': {
    canonicalTitle: 'Quality Assurance Manager',
    aliases: ['QA Manager', 'Quality Manager', 'Quality Control Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Quality Management Systems', 'ISO Standards', 'Auditing', 'Statistical Analysis', 'Root Cause Analysis'],
      soft: ['Attention to Detail', 'Leadership', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Operations Manager', 'Production Manager', 'Compliance Manager'],
    description: 'Ensures product and process quality meets standards'
  },

  'facilities-manager': {
    canonicalTitle: 'Facilities Manager',
    aliases: ['Building Manager', 'Facility Operations Manager', 'Property Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Facility Management', 'Maintenance', 'Vendor Management', 'Budgeting', 'Safety Compliance'],
      soft: ['Organization', 'Problem Solving', 'Communication', 'Multitasking']
    },
    relatedTitles: ['Operations Manager', 'Property Manager', 'Maintenance Manager'],
    description: 'Manages building operations, maintenance, and safety'
  },

  'coo': {
    canonicalTitle: 'Chief Operating Officer',
    aliases: ['COO', 'VP of Operations', 'Head of Operations'],
    industry: 'operations',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Operations Strategy', 'Process Optimization', 'P&L Management', 'Strategic Planning', 'ERP'],
      soft: ['Executive Leadership', 'Strategic Thinking', 'Team Building', 'Decision Making']
    },
    relatedTitles: ['CEO', 'Director of Operations', 'Operations Manager'],
    description: 'Oversees all operational functions of the organization'
  },

  'procurement-specialist': {
    canonicalTitle: 'Procurement Specialist',
    aliases: ['Buyer', 'Purchasing Agent', 'Procurement Analyst'],
    industry: 'operations',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Procurement', 'Vendor Management', 'Contract Negotiation', 'ERP', 'Cost Analysis'],
      soft: ['Negotiation', 'Analytical Thinking', 'Communication', 'Attention to Detail']
    },
    relatedTitles: ['Supply Chain Manager', 'Purchasing Manager', 'Sourcing Manager'],
    description: 'Sources and purchases goods and services for the organization'
  },

  'inventory-analyst': {
    canonicalTitle: 'Inventory Analyst',
    aliases: ['Inventory Specialist', 'Stock Analyst', 'Inventory Planner'],
    industry: 'operations',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Inventory Management', 'Demand Forecasting', 'Excel', 'ERP', 'Data Analysis'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Supply Chain Analyst', 'Warehouse Manager', 'Operations Analyst'],
    description: 'Analyzes and optimizes inventory levels and stock management'
  },

  'operations-analyst': {
    canonicalTitle: 'Operations Analyst',
    aliases: ['Business Operations Analyst', 'Ops Analyst', 'Process Analyst'],
    industry: 'operations',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Data Analysis', 'Process Improvement', 'Excel', 'SQL', 'Reporting', 'Metrics'],
      soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Attention to Detail']
    },
    relatedTitles: ['Business Analyst', 'Operations Manager', 'Data Analyst'],
    description: 'Analyzes operational data and identifies improvement opportunities'
  },

  'program-manager': {
    canonicalTitle: 'Program Manager',
    aliases: ['Programme Manager', 'Senior Project Manager', 'Portfolio Manager'],
    industry: 'operations',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Program Management', 'Strategic Planning', 'Portfolio Management', 'Risk Management', 'Budgeting'],
      soft: ['Leadership', 'Strategic Thinking', 'Communication', 'Stakeholder Management']
    },
    relatedTitles: ['Director of PMO', 'Project Manager', 'Operations Director'],
    description: 'Manages multiple related projects and strategic initiatives'
  },

  'vendor-manager': {
    canonicalTitle: 'Vendor Manager',
    aliases: ['Supplier Manager', 'Third-Party Manager', 'Vendor Relations Manager'],
    industry: 'operations',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Vendor Management', 'Contract Negotiation', 'Performance Metrics', 'Risk Management', 'Procurement'],
      soft: ['Relationship Building', 'Negotiation', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Procurement Manager', 'Supply Chain Manager', 'Partnerships Manager'],
    description: 'Manages relationships and performance of external vendors'
  },

  // ==========================================
  // HUMAN RESOURCES (15 titles)
  // ==========================================

  'hr-manager': {
    canonicalTitle: 'HR Manager',
    aliases: ['Human Resources Manager', 'People Manager', 'HR Business Partner'],
    industry: 'human_resources',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['HRIS', 'Employee Relations', 'Talent Management', 'Performance Management', 'Labor Law'],
      soft: ['Leadership', 'Communication', 'Conflict Resolution', 'Empathy']
    },
    relatedTitles: ['Director of HR', 'HR Generalist', 'CHRO'],
    description: 'Manages HR functions including recruitment, employee relations, and compliance'
  },

  'recruiter': {
    canonicalTitle: 'Recruiter',
    aliases: ['Talent Acquisition Specialist', 'HR Recruiter', 'Corporate Recruiter'],
    industry: 'human_resources',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['ATS', 'LinkedIn Recruiting', 'Interviewing', 'Boolean Search', 'Sourcing', 'Candidate Screening'],
      soft: ['Communication', 'Relationship Building', 'Persuasion', 'Organization']
    },
    relatedTitles: ['Talent Acquisition Manager', 'Technical Recruiter', 'HR Generalist'],
    description: 'Finds, screens, and hires qualified candidates for open positions'
  },

  'hr-generalist': {
    canonicalTitle: 'HR Generalist',
    aliases: ['Human Resources Generalist', 'HR Specialist', 'HR Coordinator'],
    industry: 'human_resources',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['HRIS', 'Onboarding', 'Benefits Administration', 'Employee Relations', 'Compliance', 'Payroll'],
      soft: ['Communication', 'Organization', 'Discretion', 'Problem Solving']
    },
    relatedTitles: ['HR Manager', 'HR Business Partner', 'Recruiter'],
    description: 'Handles various HR functions across recruitment, benefits, and employee relations'
  },

  'compensation-and-benefits-manager': {
    canonicalTitle: 'Compensation and Benefits Manager',
    aliases: ['Total Rewards Manager', 'Compensation Manager', 'Benefits Manager'],
    industry: 'human_resources',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Compensation Analysis', 'Benefits Administration', 'HRIS', 'Market Research', 'Payroll', 'Equity Planning'],
      soft: ['Analytical Thinking', 'Attention to Detail', 'Communication', 'Negotiation']
    },
    relatedTitles: ['HR Manager', 'Total Rewards Director', 'CHRO'],
    description: 'Designs and manages employee compensation and benefits programs'
  },

  'hr-business-partner': {
    canonicalTitle: 'HR Business Partner',
    aliases: ['HRBP', 'Strategic HR Partner', 'People Partner'],
    industry: 'human_resources',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Strategic HR', 'Organizational Development', 'Change Management', 'Talent Management', 'HRIS'],
      soft: ['Strategic Thinking', 'Communication', 'Influence', 'Business Acumen']
    },
    relatedTitles: ['HR Manager', 'Director of HR', 'COO'],
    description: 'Partners with business leaders on HR strategy and people initiatives'
  },

  'talent-acquisition-manager': {
    canonicalTitle: 'Talent Acquisition Manager',
    aliases: ['Recruiting Manager', 'TA Manager', 'Head of Talent Acquisition'],
    industry: 'human_resources',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Recruiting Strategy', 'ATS', 'Employer Branding', 'Team Management', 'Sourcing', 'Metrics'],
      soft: ['Leadership', 'Strategic Thinking', 'Communication', 'Relationship Building']
    },
    relatedTitles: ['Director of Talent', 'Recruiter', 'HR Director'],
    description: 'Leads talent acquisition strategy and manages recruiting team'
  },

  'learning-and-development-manager': {
    canonicalTitle: 'Learning and Development Manager',
    aliases: ['L&D Manager', 'Training Manager', 'Employee Development Manager'],
    industry: 'human_resources',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Training Design', 'LMS', 'Curriculum Development', 'E-Learning', 'Training Delivery', 'Assessment'],
      soft: ['Communication', 'Creativity', 'Leadership', 'Presentation Skills']
    },
    relatedTitles: ['HR Manager', 'Organizational Development Manager', 'Training Specialist'],
    description: 'Develops and delivers employee training and development programs'
  },

  'employee-relations-specialist': {
    canonicalTitle: 'Employee Relations Specialist',
    aliases: ['ER Specialist', 'Employee Relations Manager', 'ER Generalist'],
    industry: 'human_resources',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Employee Relations', 'Conflict Resolution', 'Investigations', 'Labor Law', 'HRIS', 'Policy Development'],
      soft: ['Communication', 'Discretion', 'Mediation', 'Problem Solving']
    },
    relatedTitles: ['HR Generalist', 'HR Manager', 'Labor Relations Manager'],
    description: 'Manages employee relations issues and workplace conflicts'
  },

  'chro': {
    canonicalTitle: 'Chief Human Resources Officer',
    aliases: ['CHRO', 'VP of HR', 'Head of People', 'Chief People Officer'],
    industry: 'human_resources',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['HR Strategy', 'Organizational Development', 'Talent Management', 'Culture Building', 'Compliance'],
      soft: ['Executive Leadership', 'Strategic Vision', 'Communication', 'Change Management']
    },
    relatedTitles: ['VP of HR', 'Director of HR', 'CEO'],
    description: 'Sets HR vision and strategy for the entire organization'
  },

  'payroll-specialist': {
    canonicalTitle: 'Payroll Specialist',
    aliases: ['Payroll Administrator', 'Payroll Coordinator', 'Payroll Analyst'],
    industry: 'human_resources',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Payroll Processing', 'ADP', 'Tax Compliance', 'HRIS', 'Timekeeping', 'Benefits Deductions'],
      soft: ['Attention to Detail', 'Confidentiality', 'Organization', 'Problem Solving']
    },
    relatedTitles: ['HR Generalist', 'Payroll Manager', 'Accounting Specialist'],
    description: 'Processes employee payroll and ensures compliance'
  },

  'organizational-development-specialist': {
    canonicalTitle: 'Organizational Development Specialist',
    aliases: ['OD Specialist', 'OD Consultant', 'Organizational Effectiveness Specialist'],
    industry: 'human_resources',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Change Management', 'Organizational Design', 'Assessment Tools', 'Facilitation', 'Data Analysis'],
      soft: ['Strategic Thinking', 'Communication', 'Influence', 'Adaptability']
    },
    relatedTitles: ['HR Business Partner', 'L&D Manager', 'HR Consultant'],
    description: 'Improves organizational effectiveness through change initiatives'
  },

  'diversity-and-inclusion-manager': {
    canonicalTitle: 'Diversity and Inclusion Manager',
    aliases: ['D&I Manager', 'DEI Manager', 'Chief Diversity Officer'],
    industry: 'human_resources',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['DEI Strategy', 'Program Development', 'Metrics & Analytics', 'Training Design', 'ERG Management'],
      soft: ['Cultural Awareness', 'Communication', 'Change Management', 'Leadership']
    },
    relatedTitles: ['HR Director', 'CHRO', 'Organizational Development Manager'],
    description: 'Develops and implements diversity, equity, and inclusion initiatives'
  },

  'hr-coordinator': {
    canonicalTitle: 'HR Coordinator',
    aliases: ['HR Assistant', 'Human Resources Coordinator', 'HR Admin'],
    industry: 'human_resources',
    suitableLevels: ['entry'],
    typicalSkills: {
      technical: ['HRIS', 'Scheduling', 'Onboarding', 'File Management', 'Benefits Enrollment', 'Data Entry'],
      soft: ['Organization', 'Communication', 'Attention to Detail', 'Discretion']
    },
    relatedTitles: ['HR Generalist', 'Recruiter', 'HR Manager'],
    description: 'Provides administrative support for HR department'
  },

  'people-operations-manager': {
    canonicalTitle: 'People Operations Manager',
    aliases: ['People Ops Manager', 'Employee Experience Manager', 'HR Operations Manager'],
    industry: 'human_resources',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['HRIS', 'Process Improvement', 'Systems Implementation', 'Metrics', 'Compliance', 'Employee Lifecycle'],
      soft: ['Problem Solving', 'Strategic Thinking', 'Communication', 'Process Optimization']
    },
    relatedTitles: ['HR Manager', 'HRBP', 'Operations Manager'],
    description: 'Optimizes HR processes and systems to improve employee experience'
  },

  'onboarding-specialist': {
    canonicalTitle: 'Onboarding Specialist',
    aliases: ['New Hire Coordinator', 'Employee Onboarding Coordinator', 'Orientation Specialist'],
    industry: 'human_resources',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Onboarding Programs', 'HRIS', 'Training Coordination', 'Documentation', 'Compliance'],
      soft: ['Communication', 'Organization', 'Customer Service', 'Attention to Detail']
    },
    relatedTitles: ['HR Generalist', 'Recruiter', 'HR Coordinator'],
    description: 'Coordinates new employee onboarding and orientation programs'
  },

  // ==========================================
  // CUSTOMER SERVICE (15 titles)
  // ==========================================

  'customer-service-representative': {
    canonicalTitle: 'Customer Service Representative',
    aliases: ['CSR', 'Customer Support Representative', 'Customer Care Representative'],
    industry: 'customer_service',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['CRM', 'Ticketing Systems', 'Product Knowledge', 'Chat Support', 'Phone Support'],
      soft: ['Communication', 'Patience', 'Problem Solving', 'Empathy']
    },
    relatedTitles: ['Support Specialist', 'Account Manager', 'Customer Success Manager'],
    description: 'Assists customers with inquiries, issues, and product support'
  },

  'customer-support-manager': {
    canonicalTitle: 'Customer Support Manager',
    aliases: ['Customer Service Manager', 'Support Team Lead', 'CS Manager'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Support Metrics', 'CRM', 'Team Management', 'Process Improvement', 'Quality Assurance'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Coaching']
    },
    relatedTitles: ['Customer Experience Manager', 'Operations Manager', 'Director of Support'],
    description: 'Manages customer support team and ensures service quality'
  },

  'technical-support-specialist': {
    canonicalTitle: 'Technical Support Specialist',
    aliases: ['Tech Support', 'Technical Support Engineer', 'Help Desk Analyst'],
    industry: 'customer_service',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Technical Troubleshooting', 'Software Knowledge', 'Ticketing Systems', 'Remote Support', 'Networking'],
      soft: ['Problem Solving', 'Patience', 'Communication', 'Technical Aptitude']
    },
    relatedTitles: ['IT Support Specialist', 'Customer Support Rep', 'Systems Administrator'],
    description: 'Provides technical assistance and troubleshooting for products'
  },

  'customer-experience-manager': {
    canonicalTitle: 'Customer Experience Manager',
    aliases: ['CX Manager', 'Customer Journey Manager', 'Experience Manager'],
    industry: 'customer_service',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Customer Journey Mapping', 'CX Metrics', 'Survey Tools', 'Data Analysis', 'CRM'],
      soft: ['Strategic Thinking', 'Empathy', 'Communication', 'Innovation']
    },
    relatedTitles: ['Customer Success Manager', 'Product Manager', 'Director of CX'],
    description: 'Designs and optimizes the end-to-end customer experience'
  },

  'call-center-supervisor': {
    canonicalTitle: 'Call Center Supervisor',
    aliases: ['Contact Center Supervisor', 'Team Lead', 'Customer Service Supervisor'],
    industry: 'customer_service',
    suitableLevels: ['mid'],
    typicalSkills: {
      technical: ['Call Center Software', 'Metrics & KPIs', 'Quality Monitoring', 'Scheduling', 'CRM'],
      soft: ['Leadership', 'Coaching', 'Problem Solving', 'Communication']
    },
    relatedTitles: ['Call Center Manager', 'Customer Support Manager', 'Operations Manager'],
    description: 'Supervises call center agents and monitors performance'
  },

  'client-services-coordinator': {
    canonicalTitle: 'Client Services Coordinator',
    aliases: ['Client Coordinator', 'Customer Service Coordinator', 'Account Coordinator'],
    industry: 'customer_service',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['CRM', 'Scheduling', 'Client Communication', 'Order Processing', 'Documentation'],
      soft: ['Organization', 'Communication', 'Multitasking', 'Attention to Detail']
    },
    relatedTitles: ['Customer Service Rep', 'Account Manager', 'Client Success Coordinator'],
    description: 'Coordinates client services and manages customer relationships'
  },

  'customer-insights-analyst': {
    canonicalTitle: 'Customer Insights Analyst',
    aliases: ['Customer Analytics Analyst', 'CX Analyst', 'Voice of Customer Analyst'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Data Analysis', 'Survey Tools', 'SQL', 'Customer Feedback', 'Reporting', 'Visualization'],
      soft: ['Analytical Thinking', 'Communication', 'Problem Solving', 'Customer Empathy']
    },
    relatedTitles: ['Data Analyst', 'Customer Experience Manager', 'Business Analyst'],
    description: 'Analyzes customer data to derive insights and improve experience'
  },

  'escalation-specialist': {
    canonicalTitle: 'Escalation Specialist',
    aliases: ['Escalations Manager', 'Senior Support Specialist', 'Customer Advocate'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Advanced Troubleshooting', 'CRM', 'Conflict Resolution', 'Product Expertise', 'Root Cause Analysis'],
      soft: ['Problem Solving', 'Empathy', 'Communication', 'Patience']
    },
    relatedTitles: ['Customer Support Manager', 'Technical Support Specialist', 'Account Manager'],
    description: 'Handles complex customer issues and escalated complaints'
  },

  'quality-assurance-analyst-cs': {
    canonicalTitle: 'Quality Assurance Analyst',
    aliases: ['QA Analyst', 'Quality Analyst', 'Call Quality Specialist'],
    industry: 'customer_service',
    suitableLevels: ['mid'],
    typicalSkills: {
      technical: ['Quality Monitoring', 'Call Recording Review', 'Metrics', 'CRM', 'Reporting'],
      soft: ['Attention to Detail', 'Communication', 'Coaching', 'Analytical Thinking']
    },
    relatedTitles: ['Customer Support Manager', 'Training Specialist', 'Operations Analyst'],
    description: 'Monitors and evaluates customer service quality'
  },

  'customer-onboarding-specialist': {
    canonicalTitle: 'Customer Onboarding Specialist',
    aliases: ['Onboarding Coordinator', 'Implementation Specialist', 'Customer Success Onboarding'],
    industry: 'customer_service',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Product Training', 'CRM', 'Project Management', 'Documentation', 'Product Knowledge'],
      soft: ['Communication', 'Teaching', 'Organization', 'Patience']
    },
    relatedTitles: ['Customer Success Manager', 'Implementation Manager', 'Support Specialist'],
    description: 'Helps new customers get started and trained on products'
  },

  'vp-of-customer-success': {
    canonicalTitle: 'VP of Customer Success',
    aliases: ['Vice President of Customer Success', 'Head of Customer Success', 'Director of CS'],
    industry: 'customer_service',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Customer Success Strategy', 'Retention Metrics', 'Team Leadership', 'CRM', 'Data Analysis'],
      soft: ['Executive Leadership', 'Strategic Thinking', 'Communication', 'Customer Focus']
    },
    relatedTitles: ['Chief Customer Officer', 'VP of Support', 'CRO'],
    description: 'Leads customer success strategy and organization'
  },

  'chat-support-specialist': {
    canonicalTitle: 'Chat Support Specialist',
    aliases: ['Live Chat Agent', 'Online Chat Representative', 'Chat Support Agent'],
    industry: 'customer_service',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Live Chat Software', 'Typing Speed', 'CRM', 'Product Knowledge', 'Multi-Tasking'],
      soft: ['Written Communication', 'Patience', 'Problem Solving', 'Multitasking']
    },
    relatedTitles: ['Customer Service Rep', 'Technical Support Specialist', 'Email Support Specialist'],
    description: 'Provides customer support via live chat channels'
  },

  'customer-retention-specialist': {
    canonicalTitle: 'Customer Retention Specialist',
    aliases: ['Retention Specialist', 'Customer Loyalty Specialist', 'Churn Prevention Specialist'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Retention Analytics', 'CRM', 'Customer Engagement', 'Churn Analysis', 'Campaign Management'],
      soft: ['Persuasion', 'Empathy', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Customer Success Manager', 'Account Manager', 'Customer Experience Manager'],
    description: 'Works to retain at-risk customers and reduce churn'
  },

  'community-manager': {
    canonicalTitle: 'Community Manager',
    aliases: ['Online Community Manager', 'Community Engagement Manager', 'Brand Community Manager'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Community Platforms', 'Social Media', 'Content Moderation', 'Engagement Metrics', 'CRM'],
      soft: ['Communication', 'Empathy', 'Conflict Resolution', 'Creativity']
    },
    relatedTitles: ['Social Media Manager', 'Customer Support Manager', 'Brand Manager'],
    description: 'Manages online communities and fosters customer engagement'
  },

  'customer-service-trainer': {
    canonicalTitle: 'Customer Service Trainer',
    aliases: ['CS Trainer', 'Support Trainer', 'Customer Care Trainer'],
    industry: 'customer_service',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Training Development', 'LMS', 'Product Knowledge', 'Quality Standards', 'Presentation Tools'],
      soft: ['Communication', 'Teaching', 'Patience', 'Motivation']
    },
    relatedTitles: ['Training Manager', 'Customer Support Manager', 'L&D Specialist'],
    description: 'Trains customer service teams on products and best practices'
  },

  // ==========================================
  // EDUCATION (15 titles)
  // ==========================================

  'teacher': {
    canonicalTitle: 'Teacher',
    aliases: ['Classroom Teacher', 'Elementary Teacher', 'Secondary Teacher', 'Educator'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Lesson Planning', 'Curriculum Development', 'Classroom Management', 'Educational Technology', 'Assessment'],
      soft: ['Communication', 'Patience', 'Adaptability', 'Creativity']
    },
    relatedTitles: ['Principal', 'Instructional Coach', 'Special Education Teacher'],
    description: 'Educates students and manages classroom instruction'
  },

  'school-principal': {
    canonicalTitle: 'School Principal',
    aliases: ['Principal', 'Head of School', 'Headmaster', 'School Administrator'],
    industry: 'education',
    suitableLevels: ['executive'],
    typicalSkills: {
      technical: ['Educational Leadership', 'Budget Management', 'Staff Development', 'Curriculum Oversight', 'Compliance'],
      soft: ['Leadership', 'Decision Making', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Assistant Principal', 'Superintendent', 'Director of Education'],
    description: 'Leads school operations and academic programs'
  },

  'instructional-coach': {
    canonicalTitle: 'Instructional Coach',
    aliases: ['Teacher Coach', 'Curriculum Coach', 'Literacy Coach'],
    industry: 'education',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Instructional Strategies', 'Coaching', 'Curriculum Design', 'Data Analysis', 'Professional Development'],
      soft: ['Communication', 'Mentoring', 'Collaboration', 'Leadership']
    },
    relatedTitles: ['Teacher', 'Curriculum Specialist', 'Principal'],
    description: 'Coaches teachers to improve instructional practices'
  },

  'special-education-teacher': {
    canonicalTitle: 'Special Education Teacher',
    aliases: ['SPED Teacher', 'Special Needs Teacher', 'Resource Teacher'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['IEP Development', 'Differentiated Instruction', 'Behavior Management', 'Special Education Law', 'Adaptive Technology'],
      soft: ['Patience', 'Empathy', 'Advocacy', 'Communication']
    },
    relatedTitles: ['Teacher', 'School Psychologist', 'Behavior Specialist'],
    description: 'Teaches students with special needs and learning differences'
  },

  'curriculum-developer': {
    canonicalTitle: 'Curriculum Developer',
    aliases: ['Curriculum Designer', 'Instructional Designer', 'Curriculum Specialist'],
    industry: 'education',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Curriculum Design', 'Standards Alignment', 'Assessment Development', 'Educational Technology', 'Learning Theory'],
      soft: ['Creativity', 'Analytical Thinking', 'Collaboration', 'Communication']
    },
    relatedTitles: ['Instructional Coach', 'Director of Curriculum', 'Teacher'],
    description: 'Designs educational curricula and learning materials'
  },

  'school-counselor': {
    canonicalTitle: 'School Counselor',
    aliases: ['Guidance Counselor', 'Academic Counselor', 'Student Counselor'],
    industry: 'education',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Student Counseling', 'Career Guidance', 'Crisis Intervention', 'College Planning', 'Conflict Resolution'],
      soft: ['Empathy', 'Communication', 'Active Listening', 'Confidentiality']
    },
    relatedTitles: ['School Psychologist', 'Social Worker', 'Career Counselor'],
    description: 'Provides academic, career, and personal counseling to students'
  },

  'college-professor': {
    canonicalTitle: 'College Professor',
    aliases: ['Professor', 'Associate Professor', 'Assistant Professor', 'Faculty Member'],
    industry: 'education',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Teaching', 'Research', 'Academic Writing', 'Grant Writing', 'Curriculum Development', 'Subject Matter Expertise'],
      soft: ['Communication', 'Critical Thinking', 'Mentoring', 'Leadership']
    },
    relatedTitles: ['Adjunct Professor', 'Department Chair', 'Dean'],
    description: 'Teaches college courses, conducts research, and publishes scholarly work'
  },

  'academic-advisor': {
    canonicalTitle: 'Academic Advisor',
    aliases: ['Student Advisor', 'College Advisor', 'Educational Advisor'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Academic Planning', 'Degree Requirements', 'Student Information Systems', 'Career Counseling'],
      soft: ['Communication', 'Empathy', 'Problem Solving', 'Active Listening']
    },
    relatedTitles: ['School Counselor', 'Career Counselor', 'Student Services Coordinator'],
    description: 'Advises students on academic planning and course selection'
  },

  'online-instructor': {
    canonicalTitle: 'Online Instructor',
    aliases: ['E-Learning Instructor', 'Virtual Teacher', 'Distance Learning Teacher'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['LMS', 'Online Teaching Tools', 'Video Conferencing', 'Digital Content Creation', 'Assessment'],
      soft: ['Communication', 'Adaptability', 'Self-Motivation', 'Technology Proficiency']
    },
    relatedTitles: ['Teacher', 'Instructional Designer', 'Curriculum Developer'],
    description: 'Teaches courses online using digital platforms and tools'
  },

  'admissions-counselor': {
    canonicalTitle: 'Admissions Counselor',
    aliases: ['Admissions Officer', 'Enrollment Counselor', 'Admissions Advisor'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Admissions Process', 'Student Recruitment', 'Application Review', 'CRM', 'Data Analysis'],
      soft: ['Communication', 'Sales', 'Relationship Building', 'Organization']
    },
    relatedTitles: ['Director of Admissions', 'Enrollment Manager', 'Academic Advisor'],
    description: 'Recruits and evaluates prospective students for admission'
  },

  'education-administrator': {
    canonicalTitle: 'Education Administrator',
    aliases: ['School Administrator', 'Education Manager', 'Academic Administrator'],
    industry: 'education',
    suitableLevels: ['senior', 'executive'],
    typicalSkills: {
      technical: ['Educational Leadership', 'Budget Management', 'Policy Development', 'Compliance', 'Staff Management'],
      soft: ['Leadership', 'Strategic Planning', 'Communication', 'Problem Solving']
    },
    relatedTitles: ['Principal', 'Superintendent', 'Dean'],
    description: 'Manages educational programs and institutional operations'
  },

  'librarian': {
    canonicalTitle: 'Librarian',
    aliases: ['School Librarian', 'Academic Librarian', 'Media Specialist'],
    industry: 'education',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Library Management', 'Research Skills', 'Cataloging', 'Information Literacy', 'Digital Resources'],
      soft: ['Organization', 'Customer Service', 'Communication', 'Attention to Detail']
    },
    relatedTitles: ['Teacher', 'Information Specialist', 'Archivist'],
    description: 'Manages library resources and supports research and learning'
  },

  'corporate-trainer': {
    canonicalTitle: 'Corporate Trainer',
    aliases: ['Training Specialist', 'Learning Facilitator', 'Professional Development Trainer'],
    industry: 'education',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Training Development', 'LMS', 'Presentation Tools', 'Needs Assessment', 'E-Learning Development'],
      soft: ['Communication', 'Presentation Skills', 'Adaptability', 'Facilitation']
    },
    relatedTitles: ['L&D Manager', 'Instructional Designer', 'HR Manager'],
    description: 'Delivers training programs for corporate employees'
  },

  'education-consultant': {
    canonicalTitle: 'Education Consultant',
    aliases: ['Educational Consultant', 'Academic Consultant', 'School Improvement Consultant'],
    industry: 'education',
    suitableLevels: ['senior'],
    typicalSkills: {
      technical: ['Educational Strategy', 'Data Analysis', 'Program Evaluation', 'Curriculum Review', 'Professional Development'],
      soft: ['Communication', 'Problem Solving', 'Strategic Thinking', 'Collaboration']
    },
    relatedTitles: ['Instructional Coach', 'Principal', 'Curriculum Developer'],
    description: 'Advises educational institutions on improvement strategies'
  },

  'test-prep-tutor': {
    canonicalTitle: 'Test Prep Tutor',
    aliases: ['SAT Tutor', 'ACT Tutor', 'Exam Prep Instructor', 'Standardized Test Tutor'],
    industry: 'education',
    suitableLevels: ['entry', 'mid'],
    typicalSkills: {
      technical: ['Test Strategies', 'Subject Matter Expertise', 'Assessment', 'Curriculum Planning', 'Score Analysis'],
      soft: ['Communication', 'Patience', 'Motivation', 'Adaptability']
    },
    relatedTitles: ['Teacher', 'Academic Tutor', 'Education Consultant'],
    description: 'Prepares students for standardized tests and college admissions exams'
  },

  // ==========================================
  // ENGINEERING (15 titles)
  // ==========================================

  'mechanical-engineer': {
    canonicalTitle: 'Mechanical Engineer',
    aliases: ['ME', 'Design Engineer', 'Product Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['CAD', 'SolidWorks', 'FEA', 'Thermodynamics', 'Manufacturing Processes', 'Prototyping'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Collaboration']
    },
    relatedTitles: ['Design Engineer', 'Manufacturing Engineer', 'R&D Engineer'],
    description: 'Designs and develops mechanical systems and products'
  },

  'electrical-engineer': {
    canonicalTitle: 'Electrical Engineer',
    aliases: ['EE', 'Electronics Engineer', 'Power Systems Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Circuit Design', 'PCB Design', 'MATLAB', 'Power Systems', 'Signal Processing', 'Testing'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Communication']
    },
    relatedTitles: ['Electronics Engineer', 'Hardware Engineer', 'Power Engineer'],
    description: 'Designs electrical systems, circuits, and electronic equipment'
  },

  'civil-engineer': {
    canonicalTitle: 'Civil Engineer',
    aliases: ['Structural Engineer', 'Construction Engineer', 'Transportation Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['AutoCAD', 'Structural Analysis', 'Project Management', 'Surveying', 'Building Codes', 'Construction Management'],
      soft: ['Problem Solving', 'Communication', 'Project Management', 'Attention to Detail']
    },
    relatedTitles: ['Structural Engineer', 'Project Engineer', 'Construction Manager'],
    description: 'Designs infrastructure projects like roads, bridges, and buildings'
  },

  'chemical-engineer': {
    canonicalTitle: 'Chemical Engineer',
    aliases: ['Process Engineer', 'Production Engineer', 'Plant Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Process Design', 'Chemical Reactions', 'Process Simulation', 'Safety Protocols', 'Quality Control'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Communication']
    },
    relatedTitles: ['Process Engineer', 'Production Engineer', 'R&D Engineer'],
    description: 'Designs chemical manufacturing processes and equipment'
  },

  'aerospace-engineer': {
    canonicalTitle: 'Aerospace Engineer',
    aliases: ['Aeronautical Engineer', 'Flight Systems Engineer', 'Propulsion Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Aerodynamics', 'CAD', 'MATLAB', 'Flight Mechanics', 'Propulsion Systems', 'Testing'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Attention to Detail', 'Collaboration']
    },
    relatedTitles: ['Mechanical Engineer', 'Systems Engineer', 'Design Engineer'],
    description: 'Designs aircraft, spacecraft, and aerospace systems'
  },

  'industrial-engineer': {
    canonicalTitle: 'Industrial Engineer',
    aliases: ['Manufacturing Engineer', 'Process Improvement Engineer', 'Operations Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Lean Manufacturing', 'Six Sigma', 'Process Optimization', 'CAD', 'Data Analysis', 'Simulation'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Communication', 'Project Management']
    },
    relatedTitles: ['Manufacturing Engineer', 'Quality Engineer', 'Operations Manager'],
    description: 'Optimizes manufacturing processes and improves efficiency'
  },

  'biomedical-engineer': {
    canonicalTitle: 'Biomedical Engineer',
    aliases: ['Medical Device Engineer', 'Clinical Engineer', 'Biomechanical Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Medical Device Design', 'CAD', 'Regulatory Compliance', 'Testing', 'Biomechanics', 'FDA Regulations'],
      soft: ['Problem Solving', 'Attention to Detail', 'Communication', 'Collaboration']
    },
    relatedTitles: ['Mechanical Engineer', 'R&D Engineer', 'Medical Device Engineer'],
    description: 'Designs medical devices and healthcare equipment'
  },

  'environmental-engineer': {
    canonicalTitle: 'Environmental Engineer',
    aliases: ['Sustainability Engineer', 'Water Resources Engineer', 'Environmental Consultant'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Environmental Impact Assessment', 'Water Treatment', 'Waste Management', 'Regulatory Compliance', 'Modeling'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Communication', 'Sustainability Mindset']
    },
    relatedTitles: ['Civil Engineer', 'Sustainability Consultant', 'Environmental Scientist'],
    description: 'Develops solutions for environmental protection and sustainability'
  },

  'manufacturing-engineer': {
    canonicalTitle: 'Manufacturing Engineer',
    aliases: ['Production Engineer', 'Process Engineer', 'Industrial Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Manufacturing Processes', 'CAD', 'Lean Manufacturing', 'Automation', 'Quality Control', 'Tooling'],
      soft: ['Problem Solving', 'Communication', 'Collaboration', 'Continuous Improvement']
    },
    relatedTitles: ['Industrial Engineer', 'Process Engineer', 'Quality Engineer'],
    description: 'Develops and optimizes manufacturing processes and systems'
  },

  'quality-engineer': {
    canonicalTitle: 'Quality Engineer',
    aliases: ['QE', 'Quality Assurance Engineer', 'Quality Control Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Quality Management Systems', 'ISO Standards', 'Root Cause Analysis', 'Statistical Analysis', 'Auditing'],
      soft: ['Attention to Detail', 'Problem Solving', 'Communication', 'Analytical Thinking']
    },
    relatedTitles: ['Manufacturing Engineer', 'QA Manager', 'Process Engineer'],
    description: 'Ensures product quality and process compliance with standards'
  },

  'project-engineer': {
    canonicalTitle: 'Project Engineer',
    aliases: ['Engineering Project Manager', 'Technical Project Manager', 'Construction Project Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Project Management', 'Engineering Design', 'CAD', 'Budgeting', 'Scheduling', 'Technical Documentation'],
      soft: ['Leadership', 'Communication', 'Problem Solving', 'Organization']
    },
    relatedTitles: ['Civil Engineer', 'Mechanical Engineer', 'Project Manager'],
    description: 'Manages engineering projects from design through completion'
  },

  'reliability-engineer': {
    canonicalTitle: 'Reliability Engineer',
    aliases: ['Maintenance Engineer', 'Asset Reliability Engineer', 'Equipment Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Reliability Analysis', 'Predictive Maintenance', 'Root Cause Analysis', 'FMEA', 'Data Analysis'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Communication', 'Attention to Detail']
    },
    relatedTitles: ['Maintenance Manager', 'Quality Engineer', 'Process Engineer'],
    description: 'Improves equipment reliability and reduces downtime'
  },

  'test-engineer': {
    canonicalTitle: 'Test Engineer',
    aliases: ['Validation Engineer', 'Verification Engineer', 'Testing Engineer'],
    industry: 'engineering',
    suitableLevels: ['entry', 'mid', 'senior'],
    typicalSkills: {
      technical: ['Test Planning', 'Test Automation', 'Data Analysis', 'Test Equipment', 'Documentation', 'Troubleshooting'],
      soft: ['Attention to Detail', 'Problem Solving', 'Communication', 'Analytical Thinking']
    },
    relatedTitles: ['Quality Engineer', 'Validation Engineer', 'R&D Engineer'],
    description: 'Develops and executes tests to validate product performance'
  },

  'r-and-d-engineer': {
    canonicalTitle: 'R&D Engineer',
    aliases: ['Research and Development Engineer', 'Innovation Engineer', 'Development Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['Research', 'Prototyping', 'CAD', 'Testing', 'Innovation', 'Technical Documentation'],
      soft: ['Creativity', 'Problem Solving', 'Analytical Thinking', 'Collaboration']
    },
    relatedTitles: ['Design Engineer', 'Product Engineer', 'Mechanical Engineer'],
    description: 'Researches and develops new products and technologies'
  },

  'industrial-automation-engineer': {
    canonicalTitle: 'Industrial Automation Engineer',
    aliases: ['Controls Engineer', 'Robotics Engineer', 'Automation Specialist', 'Automation Engineer'],
    industry: 'engineering',
    suitableLevels: ['mid', 'senior'],
    typicalSkills: {
      technical: ['PLC Programming', 'SCADA', 'Robotics', 'Control Systems', 'HMI', 'Industrial Automation'],
      soft: ['Problem Solving', 'Analytical Thinking', 'Communication', 'Innovation']
    },
    relatedTitles: ['Controls Engineer', 'Manufacturing Engineer', 'Electrical Engineer'],
    description: 'Designs and implements automated systems and robotics'
  }
}

// Helper functions
export function getJobTitle(slug: string): JobTitleData | undefined {
  return JOB_TITLE_TAXONOMY[slug]
}

export function getJobTitlesByIndustry(industry: Industry): JobTitleData[] {
  return Object.values(JOB_TITLE_TAXONOMY).filter(job => job.industry === industry)
}

export function getJobTitlesByLevel(level: ExperienceLevel): JobTitleData[] {
  return Object.values(JOB_TITLE_TAXONOMY).filter(job =>
    job.suitableLevels.includes(level)
  )
}

export function searchJobTitles(query: string): JobTitleData[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(JOB_TITLE_TAXONOMY).filter(job =>
    job.canonicalTitle.toLowerCase().includes(lowerQuery) ||
    job.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
    job.description.toLowerCase().includes(lowerQuery)
  )
}

export function getAllIndustries(): Industry[] {
  return [
    'technology',
    'finance',
    'marketing',
    'healthcare',
    'sales',
    'operations',
    'human_resources',
    'customer_service',
    'education',
    'engineering'
  ]
}

export function getIndustryStats() {
  const stats: Record<Industry, number> = {
    technology: 0,
    finance: 0,
    marketing: 0,
    healthcare: 0,
    sales: 0,
    operations: 0,
    human_resources: 0,
    customer_service: 0,
    education: 0,
    engineering: 0
  }

  Object.values(JOB_TITLE_TAXONOMY).forEach(job => {
    stats[job.industry]++
  })

  return stats
}

export function getAllJobTitleSlugs(): string[] {
  return Object.keys(JOB_TITLE_TAXONOMY)
}

export function getTotalJobTitles(): number {
  return Object.keys(JOB_TITLE_TAXONOMY).length
}
