// lib/pdf/utils/dateFormatter.ts
// Date formatting utilities for PDF rendering

type DateFormat = 'MM/YYYY' | 'Month Year' | 'Mon YYYY' | 'YYYY'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_ABBREV = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * Parse date string into components
 * Handles various formats: YYYY-MM, YYYY-MM-DD, MM/YYYY, Month YYYY, etc.
 */
function parseDate(dateStr: string): { year: number; month: number } | null {
  if (!dateStr) return null

  const trimmed = dateStr.trim()

  // ISO format: YYYY-MM or YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})/)
  if (isoMatch) {
    return { year: parseInt(isoMatch[1]), month: parseInt(isoMatch[2]) }
  }

  // MM/YYYY format
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    return { year: parseInt(slashMatch[2]), month: parseInt(slashMatch[1]) }
  }

  // Month Year format (January 2024)
  const monthYearMatch = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (monthYearMatch) {
    const monthName = monthYearMatch[1].toLowerCase()
    const monthIndex = MONTH_NAMES.findIndex(m => m.toLowerCase().startsWith(monthName))
    if (monthIndex !== -1) {
      return { year: parseInt(monthYearMatch[2]), month: monthIndex + 1 }
    }
  }

  // Year only
  const yearMatch = trimmed.match(/^(\d{4})$/)
  if (yearMatch) {
    return { year: parseInt(yearMatch[1]), month: 1 }
  }

  return null
}

/**
 * Format a date string according to the specified format
 */
export function formatDate(dateStr: string | undefined, format: DateFormat): string {
  if (!dateStr) return ''

  // Handle "Present" or "Current"
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'current') {
    return 'Present'
  }

  const parsed = parseDate(dateStr)
  if (!parsed) {
    // Return original if parsing fails
    return dateStr
  }

  const { year, month } = parsed

  switch (format) {
    case 'MM/YYYY':
      return `${month.toString().padStart(2, '0')}/${year}`

    case 'Month Year':
      return `${MONTH_NAMES[month - 1]} ${year}`

    case 'Mon YYYY':
      return `${MONTH_ABBREV[month - 1]} ${year}`

    case 'YYYY':
      return `${year}`

    default:
      return dateStr
  }
}

/**
 * Format a date range (startDate - endDate or startDate - Present)
 */
export function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  current: boolean | undefined,
  format: DateFormat
): string {
  const start = formatDate(startDate, format)
  const end = current ? 'Present' : formatDate(endDate, format)

  if (!start && !end) return ''
  if (!start) return end
  if (!end) return start

  return `${start} - ${end}`
}

/**
 * Calculate duration in years and months between two dates
 */
export function calculateDuration(
  startDate: string | undefined,
  endDate: string | undefined,
  current: boolean | undefined
): string {
  if (!startDate) return ''

  const start = parseDate(startDate)
  if (!start) return ''

  let end: { year: number; month: number }
  if (current) {
    const now = new Date()
    end = { year: now.getFullYear(), month: now.getMonth() + 1 }
  } else if (endDate) {
    const parsed = parseDate(endDate)
    if (!parsed) return ''
    end = parsed
  } else {
    return ''
  }

  const totalMonths = (end.year - start.year) * 12 + (end.month - start.month)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) {
    return months === 1 ? '1 mo' : `${months} mos`
  }
  if (months === 0) {
    return years === 1 ? '1 yr' : `${years} yrs`
  }
  const yearStr = years === 1 ? '1 yr' : `${years} yrs`
  const monthStr = months === 1 ? '1 mo' : `${months} mos`
  return `${yearStr} ${monthStr}`
}
