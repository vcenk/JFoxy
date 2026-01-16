// lib/constants/starGuidance.ts
// Category-specific STAR method guidance for practice session tips

export interface StarGuidanceContent {
  title: string
  description: string
  situation: string
  task: string
  action: string
  result: string
  exampleAnswer: string
}

export const STAR_GUIDANCE: Record<string, StarGuidanceContent> = {
  behavioral: {
    title: "STAR Method for Behavioral Questions",
    description: "Behavioral questions assess how you've handled real situations in the past. Interviewers believe past behavior predicts future performance.",
    situation: "Set the scene clearly. Where were you working? What was the context? What challenge or opportunity arose?",
    task: "Define YOUR specific responsibility. What were you accountable for? What was the goal you needed to achieve?",
    action: "Detail the specific steps YOU took. Use 'I' not 'we'. Explain your reasoning and decision-making process.",
    result: "Share the outcome with metrics. What improved? By how much? What did you learn? How did it impact the team/company?",
    exampleAnswer: `"In my previous role as a Product Manager at TechCorp, our flagship feature had a 40% drop in user engagement after a major update.

As the PM responsible for this feature, I needed to identify the root cause and restore engagement within our quarterly goals.

I organized user interviews with 15 power users, analyzed session recordings, and discovered the new UI buried a critical workflow. I then led a rapid iteration sprint, collaborated with design to simplify the flow, and A/B tested three variations.

Within 6 weeks, we not only recovered the lost engagement but increased it by 15% above the original baseline. This approach became our standard process for major UI changes."`
  },

  leadership: {
    title: "STAR Method for Leadership Questions",
    description: "Leadership questions evaluate your ability to guide teams, make decisions, and develop others. Focus on how you influenced outcomes through people.",
    situation: "Describe the team context. How many people? What was the challenge? What was at stake for the organization?",
    task: "Explain your leadership mandate. What were you responsible for achieving? What authority did you have?",
    action: "Focus on HOW you led. How did you motivate the team? What decisions did you make? How did you handle resistance or conflict?",
    result: "Include both business outcomes AND team development. Did anyone get promoted? Did team morale improve? What lasting impact did you create?",
    exampleAnswer: `"When I joined as Engineering Manager, I inherited a team of 8 engineers with low morale and a 6-month backlog of technical debt that was causing weekly production incidents.

My mandate was to stabilize the system while maintaining feature velocity and rebuilding team confidence.

I started with 1-on-1s to understand individual concerns, then created a 'Tech Debt Friday' initiative where 20% of sprint capacity went to stability. I paired senior engineers with juniors on critical fixes, celebrated small wins publicly, and protected the team from scope creep by negotiating with stakeholders.

Over 6 months, production incidents dropped 80%, team satisfaction scores rose from 3.2 to 4.5/5, and two engineers were promoted. The team became known as one of the most reliable in the company."`
  },

  technical: {
    title: "STAR Method for Technical Questions",
    description: "Even technical questions benefit from structured storytelling. Show your problem-solving process, not just the solution.",
    situation: "Describe the technical challenge and its business impact. What system was affected? What were the symptoms?",
    task: "What was the technical goal or constraint? What made this problem difficult? What were the requirements?",
    action: "Walk through your approach step-by-step. What did you investigate first? What tools did you use? What trade-offs did you consider?",
    result: "Quantify the technical improvement. Performance gains? Cost savings? Scalability achieved? Also mention what you learned.",
    exampleAnswer: `"Our e-commerce platform's checkout API was experiencing 800ms average response times during peak hours, causing a 12% cart abandonment increase.

I was tasked with reducing latency to under 200ms without a full rewrite, as we had a major sale event in 3 weeks.

I started by profiling the API with distributed tracing, which revealed N+1 database queries and synchronous calls to a slow third-party service. I implemented query batching, added Redis caching for frequently accessed data, and converted the third-party calls to async with a fallback. I also added circuit breakers to prevent cascade failures.

Response times dropped to 95ms at p95, cart abandonment decreased by 8%, and the system handled 3x normal traffic during the sale without issues. We documented the patterns and applied them to other critical paths."`
  },

  conflict: {
    title: "STAR Method for Conflict Questions",
    description: "Conflict questions assess your interpersonal skills and emotional intelligence. Show that you can disagree professionally and find solutions.",
    situation: "Describe the conflict objectively. Who was involved? What was the disagreement about? Avoid villainizing anyone.",
    task: "What was at stake? What needed to be resolved? What was your role in finding a solution?",
    action: "Focus on listening, empathy, and finding common ground. How did you understand the other perspective? What compromises did you propose?",
    result: "Highlight both the resolution AND the relationship outcome. Did you maintain or improve the working relationship? What did you learn?",
    exampleAnswer: `"During a critical product launch, a senior architect and I had fundamentally different views on the system design. He wanted a monolithic approach for faster initial delivery, while I advocated for microservices for long-term scalability.

We needed to reach consensus quickly as the disagreement was blocking the team and affecting morale.

I requested a private meeting where I first asked him to fully explain his concerns—I learned he'd seen microservices fail at a previous company due to operational complexity. I acknowledged the valid risks, then proposed a hybrid approach: start with a modular monolith with clear service boundaries, making future extraction easier. I also suggested we document decision criteria for when to split services.

He agreed to the approach, we delivered on time, and our working relationship actually improved. Six months later, he championed the first service extraction using our documented criteria. We still collaborate closely today."`
  }
}

// Default fallback tips when AI-generated tips are not available
export const DEFAULT_TIPS = [
  "Use the STAR method: Situation, Task, Action, Result",
  "Be specific with examples and include metrics when possible",
  "Keep your answer focused and aim for 1.5-2 minutes",
  "Use 'I' instead of 'we' to highlight your personal contributions"
]

// Get guidance for a category, with fallback to behavioral
export function getStarGuidance(category: string): StarGuidanceContent {
  const normalizedCategory = category?.toLowerCase() || 'behavioral'
  return STAR_GUIDANCE[normalizedCategory] || STAR_GUIDANCE.behavioral
}
