// components/resume/LinkedInImportModal.tsx
'use client'

import { useState } from 'react'
import { X, Upload, Loader2, Info, ExternalLink } from 'lucide-react'

interface LinkedInImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (resumeId: string) => void
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [jsonData, setJsonData] = useState('')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setError(null)

    if (!jsonData.trim()) {
      setError('Please paste your LinkedIn data')
      return
    }

    try {
      setImporting(true)

      // Parse JSON
      const linkedinData = JSON.parse(jsonData)

      // Send to API
      const response = await fetch('/api/resume/linkedin-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinData,
          title: `LinkedIn Import ${new Date().toLocaleDateString()}`,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Import failed')
      }

      onImportSuccess(data.resume.id)
      onClose()
    } catch (err: any) {
      console.error('Import error:', err)
      setError(err.message || 'Failed to import LinkedIn data. Please check the format.')
    } finally {
      setImporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Import from LinkedIn</h3>
          <button
            onClick={onClose}
            className="glass-panel px-3 py-2 hover:bg-white/15 transition-all"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        {/* Instructions */}
        <div className="glass-panel p-4 mb-6 bg-blue-500/10 border-blue-500/30">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/80 space-y-2">
              <p className="font-semibold text-white">How to export your LinkedIn data:</p>
              <ol className="list-decimal ml-4 space-y-1">
                <li>Go to LinkedIn Settings & Privacy → Data privacy</li>
                <li>Click "Get a copy of your data"</li>
                <li>
                  Select "Download to JSON" format{' '}
                  <span className="text-xs text-white/60">(faster option)</span>
                </li>
                <li>Download and open the JSON file</li>
                <li>Copy the entire contents and paste below</li>
              </ol>
              <a
                href="https://www.linkedin.com/psettings/member-data"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs mt-2"
              >
                <span>Open LinkedIn Settings</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* JSON Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            LinkedIn JSON Data
          </label>
          <textarea
            value={jsonData}
            onChange={e => setJsonData(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
            placeholder='Paste your LinkedIn JSON data here...\n\nExample:\n{\n  "basics": {\n    "name": "John Doe",\n    "email": "john@example.com",\n    ...\n  },\n  "work": [...],\n  ...\n}'
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={importing}
            className="flex-1 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex-1 py-3 glow-button rounded-xl text-white font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {importing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Import Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <p className="text-xs text-white/60">
            <strong className="text-white/80">Note:</strong> Your LinkedIn data is processed
            locally and securely. We only extract your profile information to create a resume.
            The original data is never stored.
          </p>
        </div>
      </div>
    </div>
  )
}
