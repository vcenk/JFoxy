// components/resume/renderers/DateFormatter.tsx
// Utility component for formatting dates

'use client'

import { useResume } from '@/contexts/ResumeContext'

interface DateFormatterProps {
  dateStr: string | undefined
  current?: boolean
}

export const DateFormatter: React.FC<DateFormatterProps> = ({ dateStr, current }) => {
  const { designerSettings } = useResume()

  if (current) return <>Present</>
  if (!dateStr) return null

  const date = new Date(dateStr)
  if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
    return <>{dateStr}</>
  }

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()

  if (designerSettings.dateFormat === 'Month Year') {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
    return <>{`${monthName} ${year}`}</>
  }

  const monthPadded = String(month + 1).padStart(2, '0')
  return <>{`${monthPadded}/${year}`}</>
}

export const formatDate = (dateStr: string | undefined, dateFormat: 'MM/YYYY' | 'Month Year'): string => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
    return dateStr
  }

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()

  if (dateFormat === 'Month Year') {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)
    return `${monthName} ${year}`
  }

  const monthPadded = String(month + 1).padStart(2, '0')
  return `${monthPadded}/${year}`
}
