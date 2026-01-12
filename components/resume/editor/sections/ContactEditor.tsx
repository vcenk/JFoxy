// components/resume/editor/sections/ContactEditor.tsx
// Contact information editor with field-level toggles

'use client'

import React from 'react'
import { User, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContactInfo } from '@/lib/types/resume'
import { FieldRow } from '../components'

interface ContactEditorProps {
  contact: ContactInfo
  onChange: (contact: ContactInfo) => void
}

export const ContactEditor: React.FC<ContactEditorProps> = ({
  contact,
  onChange,
}) => {
  const updateField = (field: keyof ContactInfo, value: any) => {
    onChange({ ...contact, [field]: value })
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <User className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
      </div>

      {/* Fields */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
        <FieldRow
          label="Full Name"
          value={contact.name || ''}
          enabled={contact.nameEnabled !== false}
          onValueChange={(v) => updateField('name', v)}
          onEnabledChange={(e) => updateField('nameEnabled', e)}
          placeholder="John Doe"
          required
        />
        <FieldRow
          label="Email"
          value={contact.email || ''}
          enabled={contact.emailEnabled !== false}
          onValueChange={(v) => updateField('email', v)}
          onEnabledChange={(e) => updateField('emailEnabled', e)}
          placeholder="john@example.com"
          type="email"
        />
        <FieldRow
          label="Phone"
          value={contact.phone || ''}
          enabled={contact.phoneEnabled !== false}
          onValueChange={(v) => updateField('phone', v)}
          onEnabledChange={(e) => updateField('phoneEnabled', e)}
          placeholder="+1 (555) 123-4567"
          type="tel"
        />
        <FieldRow
          label="Location"
          value={contact.location || ''}
          enabled={contact.locationEnabled !== false}
          onValueChange={(v) => updateField('location', v)}
          onEnabledChange={(e) => updateField('locationEnabled', e)}
          placeholder="City, State"
        />
        <FieldRow
          label="LinkedIn"
          value={contact.linkedin || ''}
          enabled={contact.linkedinEnabled !== false}
          onValueChange={(v) => updateField('linkedin', v)}
          onEnabledChange={(e) => updateField('linkedinEnabled', e)}
          placeholder="linkedin.com/in/username"
          type="url"
        />
        <FieldRow
          label="GitHub"
          value={contact.github || ''}
          enabled={contact.githubEnabled !== false}
          onValueChange={(v) => updateField('github', v)}
          onEnabledChange={(e) => updateField('githubEnabled', e)}
          placeholder="github.com/username"
          type="url"
        />
        <FieldRow
          label="Portfolio"
          value={contact.portfolio || ''}
          enabled={contact.portfolioEnabled !== false}
          onValueChange={(v) => updateField('portfolio', v)}
          onEnabledChange={(e) => updateField('portfolioEnabled', e)}
          placeholder="yourportfolio.com"
          type="url"
        />
      </div>
    </div>
  )
}
