'use client'

export function HomePageStructuredData() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Job Foxy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Job Foxy is an AI-powered interview coaching and resume analysis platform. It helps job seekers prepare for interviews with mock interview practice, resume gap analysis, and personalized feedback to improve their chances of landing their dream job.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does AI mock interview practice work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our AI interviewer simulates real interview scenarios by asking relevant behavioral and technical questions based on your target role. You can practice answering questions using the STAR method, receive instant feedback on your responses, and track your improvement over time.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the STAR method for interviews?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The STAR method is a structured approach to answering behavioral interview questions. STAR stands for Situation (context), Task (your responsibility), Action (what you did), and Result (the outcome). Job Foxy helps you structure your answers using this proven framework.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Job Foxy free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Job Foxy offers a free tier that includes basic features like resume analysis and limited mock interviews. Premium plans are available for unlimited practice sessions, advanced analytics, and personalized coaching recommendations.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does resume analysis work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upload your resume and Job Foxy AI analyzes it for ATS compatibility, keyword optimization, and identifies gaps between your experience and your target job description. You receive actionable recommendations to improve your resume and increase your chances of getting interviews.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can Job Foxy help with salary negotiation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Job Foxy provides resources and practice scenarios for salary negotiation. Our blog includes comprehensive guides on negotiation tactics, and our AI coach can help you practice negotiation conversations to build confidence.',
        },
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Job Foxy Interview Coaching',
    description: 'AI-powered interview preparation including mock interviews, resume analysis, and personalized coaching.',
    provider: {
      '@type': 'Organization',
      name: 'Job Foxy',
      url: 'https://jobfoxy.com',
    },
    serviceType: 'Interview Coaching',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interview Preparation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Mock Interviews',
            description: 'Practice interviews with AI-powered feedback',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Resume Analysis',
            description: 'ATS optimization and gap analysis',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Career Coaching',
            description: 'Personalized interview preparation guidance',
          },
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}
