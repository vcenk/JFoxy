// hooks/useAutoSave.ts
// Auto-save hook with debouncing

import { useEffect, useRef, useState, useCallback } from 'react'
import { resumeToPlainText } from '@/lib/utils/resumeToText'
import { ParsedResume } from '@/lib/types/resume'

interface UseAutoSaveProps {
  resumeId: string
  data: ParsedResume
  enabled?: boolean
  delay?: number
}

export function useAutoSave({ resumeId, data, enabled = true, delay = 1000 }: UseAutoSaveProps) {
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dataRef = useRef(data)

  // Update dataRef when data changes
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const saveData = useCallback(async (dataOverride?: ParsedResume) => {
    if (!enabled || !resumeId) return

    setSaving(true)

    const dataToSave = dataOverride || dataRef.current

    try {
      // Generate plain text version for AI analysis
      const rawText = resumeToPlainText(dataToSave)

      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: dataToSave,
          raw_text: rawText,
        }),
      })

      if (response.ok) {
        const now = new Date()
        const timeString = now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })
        setLastSaved(timeString)
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setSaving(false)
    }
  }, [resumeId, enabled])

  // Debounced save effect
  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveData()
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, enabled, delay, saveData])

  // Manual trigger function
  const triggerSave = useCallback((dataOverride?: ParsedResume) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    saveData(dataOverride)
  }, [saveData])

  return {
    saving,
    lastSaved,
    triggerSave,
  }
}
