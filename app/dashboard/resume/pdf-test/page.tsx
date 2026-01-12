'use client'

// app/dashboard/resume/pdf-test/page.tsx
// Test page for React-PDF rendering

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ParsedResume } from '@/lib/types/resume'
import { ResumeDesign, DEFAULT_DESIGN, TemplateId } from '@/lib/pdf/types'
import { PDFDesignPanel } from '@/components/resume/design/PDFDesignPanel'

// Dynamic import for PDFPreview to avoid SSR issues
const PDFPreview = dynamic(
  () => import('@/components/resume/studio/PDFPreview').then((mod) => mod.PDFPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-800">
        <div className="text-white">Loading PDF Preview...</div>
      </div>
    ),
  }
)

// Sample resume data for testing
const sampleResumeData: ParsedResume = {
  contact: {
    name: 'Sarah Johnson',
    nameEnabled: true,
    email: 'sarah.johnson@email.com',
    emailEnabled: true,
    phone: '(555) 123-4567',
    phoneEnabled: true,
    location: 'San Francisco, CA',
    locationEnabled: true,
    linkedin: 'sarahjohnson',
    linkedinEnabled: true,
    github: 'sarahj-dev',
    githubEnabled: true,
  },
  targetTitle: 'Senior Software Engineer',
  targetTitleEnabled: true,
  summary: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Results-driven software engineer with 8+ years of experience building scalable web applications. Expert in React, TypeScript, and Node.js with a proven track record of leading cross-functional teams and delivering high-impact products. Passionate about clean code, performance optimization, and mentoring junior developers.',
          },
        ],
      },
    ],
  },
  summaryEnabled: true,
  experience: [
    {
      id: 'exp-1',
      enabled: true,
      company: 'TechCorp Inc.',
      companyEnabled: true,
      position: 'Senior Software Engineer',
      positionEnabled: true,
      location: 'San Francisco, CA',
      locationEnabled: true,
      startDate: '2021-03',
      endDate: '',
      current: true,
      dateEnabled: true,
      bullets: [
        {
          id: 'b1',
          enabled: true,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Led development of a microservices architecture serving 2M+ daily active users, improving system reliability by 40%',
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'b2',
          enabled: true,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Mentored team of 5 junior developers, conducting code reviews and establishing best practices',
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'b3',
          enabled: true,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: 'exp-2',
      enabled: true,
      company: 'StartupXYZ',
      companyEnabled: true,
      position: 'Full Stack Developer',
      positionEnabled: true,
      location: 'Remote',
      locationEnabled: true,
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      dateEnabled: true,
      bullets: [
        {
          id: 'b4',
          enabled: true,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Built React-based dashboard used by 500+ enterprise clients, increasing user engagement by 60%',
                  },
                ],
              },
            ],
          },
        },
        {
          id: 'b5',
          enabled: true,
          content: {
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Designed and implemented RESTful APIs handling 10K+ requests per minute',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      enabled: true,
      institution: 'University of California, Berkeley',
      institutionEnabled: true,
      degree: 'Bachelor of Science',
      degreeEnabled: true,
      field: 'Computer Science',
      fieldEnabled: true,
      graduationDate: '2018-05',
      dateEnabled: true,
      gpa: '3.8',
      gpaEnabled: true,
    },
  ],
  skills: {
    technical: [
      { id: 's1', enabled: true, name: 'React' },
      { id: 's2', enabled: true, name: 'TypeScript' },
      { id: 's3', enabled: true, name: 'Node.js' },
      { id: 's4', enabled: true, name: 'Python' },
      { id: 's5', enabled: true, name: 'PostgreSQL' },
      { id: 's6', enabled: true, name: 'AWS' },
      { id: 's7', enabled: true, name: 'Docker' },
      { id: 's8', enabled: true, name: 'GraphQL' },
    ],
    soft: [
      { id: 'ss1', enabled: true, name: 'Team Leadership' },
      { id: 'ss2', enabled: true, name: 'Agile/Scrum' },
      { id: 'ss3', enabled: true, name: 'Technical Writing' },
    ],
  },
  certifications: [
    {
      id: 'cert-1',
      enabled: true,
      name: 'AWS Solutions Architect',
      nameEnabled: true,
      issuer: 'Amazon Web Services',
      issuerEnabled: true,
      date: '2023-01',
      dateEnabled: true,
    },
  ],
  languages: [
    { id: 'lang-1', enabled: true, language: 'English', fluency: 'Native', fluencyEnabled: true },
    { id: 'lang-2', enabled: true, language: 'Spanish', fluency: 'Professional', fluencyEnabled: true },
  ],
  projects: [],
  awards: [],
  volunteer: [],
  publications: [],
}

export default function PDFTestPage() {
  const [design, setDesign] = useState<ResumeDesign>(DEFAULT_DESIGN)

  const handleDesignChange = (updates: Partial<ResumeDesign>) => {
    setDesign((prev) => ({
      ...prev,
      ...updates,
      sectionSettings: {
        ...prev.sectionSettings,
        ...updates.sectionSettings,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#0f0f1a] to-[#1a0a1a]">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/resume"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">React-PDF Test Page</h1>
              <p className="text-sm text-white/50">
                Test the new PDF rendering system with sample data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">Template:</span>
            <select
              value={design.templateId}
              onChange={(e) => handleDesignChange({ templateId: e.target.value as TemplateId })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Design Panel */}
        <div className="w-80 border-r border-white/10 bg-black/20 overflow-hidden">
          <PDFDesignPanel design={design} onDesignChange={handleDesignChange} />
        </div>

        {/* PDF Preview */}
        <div className="flex-1 bg-gray-900">
          <PDFPreview
            data={sampleResumeData}
            design={design}
            showControls={true}
          />
        </div>
      </div>
    </div>
  )
}
