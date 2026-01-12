// lib/data/companyIntroTemplates.ts
// Dynamic Company Introduction Templates for Mock Interviews

export interface CompanyIntroTemplate {
  opening: string
  company_description: string
  role_description: string
  interview_format: string
  transition: string
}

// ============================================================================
// COMPANY INTRO TEMPLATE BUILDER
// ============================================================================

/**
 * Generate company introduction dynamically based on job description
 */
export function generateCompanyIntro(params: {
  companyName?: string
  jobTitle?: string
  jobDescription?: string
  industry?: string
}): string {
  const {
    companyName = 'our company',
    jobTitle = 'this position',
    jobDescription,
    industry
  } = params

  // Opening
  const openings = [
    `So, let me tell you a bit about ${companyName} and the role we're hiring for.`,
    `Alright, [pause] I'd like to give you some context about ${companyName} and this opportunity.`,
    `Before we dive into questions, [pause] let me share what we're building at ${companyName}.`,
    `Let me set the stage by telling you about ${companyName} and what we're looking for.`
  ]

  const opening = openings[Math.floor(Math.random() * openings.length)]

  // Company description
  let companyDesc = ''
  if (jobDescription || industry) {
    companyDesc = generateCompanyDescription(companyName, industry, jobDescription)
  } else {
    companyDesc = `${companyName} is a growing company that's making waves in our industry. We're focused on innovation and building great products.`
  }

  // Role description
  const roleDesc = generateRoleDescription(jobTitle, jobDescription)

  // Interview format
  const formatDesc = generateInterviewFormat()

  // Transition
  const transitions = [
    'Sound good?',
    'Does that make sense?',
    'Any questions before we begin?',
    'Ready to jump in?',
    'Shall we get started?'
  ]

  const transition = transitions[Math.floor(Math.random() * transitions.length)]

  // Combine all parts
  return `${opening}\n\n${companyDesc}\n\n${roleDesc}\n\n${formatDesc}\n\n${transition}`
}

/**
 * Generate company description from job details
 */
function generateCompanyDescription(companyName: string, industry?: string, jobDescription?: string): string {
  // Try to extract company info from job description
  if (jobDescription) {
    const aboutMatch = jobDescription.match(/(?:about us|about|company|who we are)[:\n]+([\s\S]*?)(?:\n\n|requirements|responsibilities)/i)
    if (aboutMatch && aboutMatch[1]) {
      const about = aboutMatch[1].trim().substring(0, 300)
      return `${companyName} ${about.endsWith('.') ? about : about + '.'}`
    }
  }

  // Fallback: generate based on industry
  if (industry) {
    const industryDescriptions: Record<string, string> = {
      tech: `is a technology company building innovative solutions that make a real impact. We're focused on creating products that users love.`,
      finance: `is a financial services company committed to transparency and customer success. We're modernizing how people manage their money.`,
      healthcare: `is a healthcare company dedicated to improving patient outcomes. We're leveraging technology to make healthcare more accessible.`,
      education: `is an education company passionate about learning and growth. We're building tools that empower teachers and students.`,
      ecommerce: `is an e-commerce company that's redefining online shopping. We're obsessed with customer experience and fast delivery.`,
      saas: `is a SaaS company helping businesses work more efficiently. We're building software that teams actually want to use.`,
      consulting: `is a consulting firm that partners with clients to solve their toughest challenges. We pride ourselves on delivering measurable results.`,
      media: `is a media company creating content that informs and entertains. We're focused on quality journalism and storytelling.`,
      retail: `is a retail company bringing great products to customers. We're focused on value, quality, and exceptional service.`,
      nonprofit: `is a nonprofit organization making a difference in our community. We're driven by mission and powered by passionate people.`
    }

    const desc = industryDescriptions[industry.toLowerCase()] || industryDescriptions.tech
    return `${companyName} ${desc}`
  }

  // Generic fallback
  return `${companyName} is a growing company that's making an impact in our industry. We're focused on innovation, collaboration, and delivering value to our customers.`
}

/**
 * Generate role description from job title and description
 */
function generateRoleDescription(jobTitle: string, jobDescription?: string): string {
  const title = jobTitle || 'this position'

  // Try to extract responsibilities from job description
  if (jobDescription) {
    const respMatch = jobDescription.match(/(?:responsibilities|what you'll do|you will)[:\n]+([\s\S]*?)(?:\n\n|requirements|qualifications)/i)
    if (respMatch && respMatch[1]) {
      const responsibilities = respMatch[1].trim().substring(0, 250)
      return `The role we're discussing today is ${title}. [pause] ${responsibilities}`
    }
  }

  // Fallback: generate based on job title
  const roleLower = title.toLowerCase()

  if (roleLower.includes('engineer') || roleLower.includes('developer')) {
    return `The role is ${title}. [pause] You'd be working on our core product, writing clean code, and collaborating with a talented engineering team to build features that users love.`
  }

  if (roleLower.includes('manager') || roleLower.includes('lead')) {
    return `This is a ${title} position. [pause] You'd be leading a team, driving strategy, and ensuring we're executing on our most important initiatives.`
  }

  if (roleLower.includes('designer')) {
    return `We're hiring a ${title}. [pause] You'd be crafting beautiful, intuitive experiences and working closely with product and engineering to bring ideas to life.`
  }

  if (roleLower.includes('product')) {
    return `The role is ${title}. [pause] You'd be defining product strategy, working with cross-functional teams, and ensuring we're building the right things for our users.`
  }

  if (roleLower.includes('marketing')) {
    return `We're looking for a ${title}. [pause] You'd be driving growth, creating compelling campaigns, and helping us reach more customers.`
  }

  if (roleLower.includes('sales')) {
    return `This is a ${title} position. [pause] You'd be building relationships with customers, closing deals, and helping us grow revenue.`
  }

  if (roleLower.includes('data') || roleLower.includes('analyst')) {
    return `The role is ${title}. [pause] You'd be analyzing data, generating insights, and helping the company make better decisions.`
  }

  // Generic fallback
  return `We're hiring for ${title}. [pause] This is a key role where you'd be making a real impact and working with a great team.`
}

/**
 * Generate interview format explanation
 */
function generateInterviewFormat(): string {
  const formats = [
    `For today's conversation, I'm going to ask you a few behavioral questions about your past experiences. [pause] The goal is to understand how you approach challenges and work with teams.`,

    `Today, I'll be asking you questions about your background and experiences. [pause] I want to learn about how you've handled situations in the past and what you'd bring to this role.`,

    `I've prepared several questions about your experience and how you work. [pause] Think of this as a conversation where I want to understand your skills and how you solve problems.`,

    `We'll go through a series of behavioral questions today. [pause] I'm looking to understand your experiences, your thinking process, and how you've grown in your career.`,

    `For this interview, I'll ask you about specific situations you've faced. [pause] The best answers typically follow the STAR method: Situation, Task, Action, and Result.`
  ]

  return formats[Math.floor(Math.random() * formats.length)]
}

// ============================================================================
// PRE-BUILT TEMPLATES (for common scenarios)
// ============================================================================

export const GENERIC_TECH_INTRO = `So, let me tell you a bit about us and the role.

We're a technology company building products that solve real problems for our users. [pause] We pride ourselves on engineering excellence and a strong culture of collaboration.

The role we're discussing is a software engineering position. [pause] You'd be working on our core platform, writing clean code, and collaborating with a talented team to ship features that customers love.

For today's conversation, I'm going to ask you several behavioral questions about your past experiences. [pause] I want to understand how you approach challenges, work with teams, and grow as an engineer.

Sound good?`

export const GENERIC_STARTUP_INTRO = `Alright, let me give you some context about what we're building.

We're a startup that's moving fast and iterating quickly. [pause] We're focused on solving a problem that really matters, and we're building a team of people who are excited to make an impact.

This role is critical for us right now. [pause] You'd be wearing multiple hats, taking ownership, and directly contributing to our growth.

Today, I'll ask you about your experiences and how you work. [pause] We value people who are scrappy, learn quickly, and thrive in ambiguity.

Ready to dive in?`

export const GENERIC_ENTERPRISE_INTRO = `Let me tell you about our organization and this opportunity.

We're an established company with a strong market presence. [pause] We're focused on delivering value to our customers while maintaining the highest standards of quality and professionalism.

The position we're hiring for plays an important role in our team. [pause] You'd be working with experienced professionals and contributing to projects that have real business impact.

For today's interview, I'll be asking you behavioral questions to understand your background and how you've handled various situations in your career.

Does that sound good?`

export const GENERIC_LEADERSHIP_INTRO = `So, let me set the stage for this conversation.

We're looking for a leader who can drive strategy and build high-performing teams. [pause] This role is critical to our success and requires someone with vision and strong execution skills.

You'd be responsible for leading a team, setting direction, and ensuring we're delivering on our most important initiatives. [pause] We need someone who can operate at both the strategic and tactical level.

Today, I want to understand your leadership philosophy, how you've built and managed teams, and how you approach complex challenges.

Ready to get started?`

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get appropriate pre-built template based on context
 */
export function getPreBuiltTemplate(context: {
  companyType?: 'startup' | 'enterprise' | 'tech' | 'generic'
  seniorityLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
}): string {
  const { companyType = 'generic', seniorityLevel = 'mid' } = context

  if (seniorityLevel === 'executive' || seniorityLevel === 'lead') {
    return GENERIC_LEADERSHIP_INTRO
  }

  switch (companyType) {
    case 'startup':
      return GENERIC_STARTUP_INTRO
    case 'enterprise':
      return GENERIC_ENTERPRISE_INTRO
    case 'tech':
      return GENERIC_TECH_INTRO
    default:
      return GENERIC_TECH_INTRO
  }
}

/**
 * Detect company type from job description
 */
export function detectCompanyType(jobDescription?: string, companyName?: string): 'startup' | 'enterprise' | 'tech' | 'generic' {
  if (!jobDescription && !companyName) {
    return 'generic'
  }

  const text = `${jobDescription || ''} ${companyName || ''}`.toLowerCase()

  if (text.match(/startup|early stage|seed|series a|fast-paced|fast moving|agile|scrappy/)) {
    return 'startup'
  }

  if (text.match(/enterprise|fortune 500|global|established|fortune 1000|multinational/)) {
    return 'enterprise'
  }

  if (text.match(/tech|technology|software|saas|platform|engineering|developer/)) {
    return 'tech'
  }

  return 'generic'
}

/**
 * Detect seniority level from job title
 */
export function detectSeniorityLevel(jobTitle?: string): 'entry' | 'mid' | 'senior' | 'lead' | 'executive' {
  if (!jobTitle) {
    return 'mid'
  }

  const titleLower = jobTitle.toLowerCase()

  if (titleLower.match(/ceo|cto|cfo|cpo|vp|vice president|chief|director|head of/)) {
    return 'executive'
  }

  if (titleLower.match(/lead|principal|staff|architect|manager/)) {
    return 'lead'
  }

  if (titleLower.match(/senior|sr\./)) {
    return 'senior'
  }

  if (titleLower.match(/junior|jr\.|entry|associate|intern/)) {
    return 'entry'
  }

  return 'mid'
}

/**
 * Format company intro with natural pauses and audio tags
 */
export function formatCompanyIntroForSpeech(intro: string): string {
  // Add pauses after sentences
  let formatted = intro.replace(/\.\s+([A-Z])/g, '. [pause] $1')

  // Add pauses after question marks
  formatted = formatted.replace(/\?\s+/g, '? [pause] ')

  // Add thoughtful tone to key phrases
  formatted = formatted.replace(/\[pause\] (We're|This|The|You'd|Today)/g, '[pause] [thoughtful] $1')

  return formatted
}

/**
 * Get company intro with all context
 */
export function getCompanyIntroduction(params: {
  companyName?: string
  jobTitle?: string
  jobDescription?: string
  usePreBuilt?: boolean
}): string {
  const { companyName, jobTitle, jobDescription, usePreBuilt = false } = params

  // Use pre-built template if requested or no job description provided
  if (usePreBuilt || !jobDescription) {
    const companyType = detectCompanyType(jobDescription, companyName)
    const seniorityLevel = detectSeniorityLevel(jobTitle)
    return getPreBuiltTemplate({ companyType, seniorityLevel })
  }

  // Generate dynamic intro
  const intro = generateCompanyIntro({
    companyName,
    jobTitle,
    jobDescription,
    industry: detectIndustry(jobDescription)
  })

  return formatCompanyIntroForSpeech(intro)
}

/**
 * Detect industry from job description
 */
function detectIndustry(jobDescription?: string): string | undefined {
  if (!jobDescription) {
    return undefined
  }

  const text = jobDescription.toLowerCase()

  if (text.match(/software|tech|engineering|developer|saas|platform/)) return 'tech'
  if (text.match(/finance|banking|fintech|investment|trading/)) return 'finance'
  if (text.match(/healthcare|medical|hospital|patient|clinical/)) return 'healthcare'
  if (text.match(/education|learning|teaching|student|school/)) return 'education'
  if (text.match(/ecommerce|e-commerce|retail|shopping|marketplace/)) return 'ecommerce'
  if (text.match(/consulting|advisory|strategy/)) return 'consulting'
  if (text.match(/media|journalism|content|publishing/)) return 'media'
  if (text.match(/nonprofit|ngo|charity|social impact/)) return 'nonprofit'

  return undefined
}

/**
 * Validate company intro length (should be 60-120 seconds when spoken)
 * Average speaking rate: 150 words/minute = 2.5 words/second
 */
export function validateIntroLength(intro: string): {
  valid: boolean
  estimatedSeconds: number
  wordCount: number
  recommendation?: string
} {
  const words = intro.split(/\s+/).length
  const estimatedSeconds = Math.ceil((words / 150) * 60)

  let valid = true
  let recommendation: string | undefined

  if (estimatedSeconds < 45) {
    valid = false
    recommendation = 'Introduction is too short. Add more context about the company or role.'
  } else if (estimatedSeconds > 150) {
    valid = false
    recommendation = 'Introduction is too long. Keep it concise (60-120 seconds).'
  }

  return {
    valid,
    estimatedSeconds,
    wordCount: words,
    recommendation
  }
}
