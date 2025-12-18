'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (resumeId: string) => void
}

export function ResumeUploadModal({ isOpen, onClose, onUploadSuccess }: ResumeUploadModalProps) {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [statusMessageIndex, setStatusMessageIndex] = useState(0)
  const statusMessages = [
    "Uploading your resume...",
    "Parsing document structure...",
    "Extracting work experience...",
    "Analyzing skills and keywords...",
    "Finalizing import..."
  ]

  useEffect(() => {
    if (uploadState === 'uploading' || uploadState === 'processing') {
      const interval = setInterval(() => {
        setStatusMessageIndex(prev => (prev + 1) % statusMessages.length)
      }, 2000)
      return () => clearInterval(interval)
    }
    setStatusMessageIndex(0)
  }, [uploadState])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation
    const fileName = file.name.toLowerCase()
    const validExtensions = ['.pdf', '.docx', '.txt']
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
      setUploadState('error')
      setErrorMessage('Invalid file type. Please upload PDF, DOCX, or TXT.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadState('error')
      setErrorMessage('File size exceeds 10MB.')
      return
    }

    // Start Upload Process
    setUploadState('uploading')
    setProgress(0)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)
      setUploadState('processing')

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Upload failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log('Upload response:', data)

      if (data.success && data.data?.resume?.id) {
        setUploadState('success')
        setTimeout(() => {
          onUploadSuccess(data.data.resume.id)
        }, 1500) // Show success state for 1.5s
      } else {
        console.error('Invalid upload response:', data)
        throw new Error(data.error || 'Failed to parse resume - invalid response format')
      }
    } catch (error: any) {
      setUploadState('error')
      setErrorMessage(error.message || 'An unexpected error occurred.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-panel w-full max-w-md overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          disabled={uploadState === 'uploading' || uploadState === 'processing'}
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-2">Import Resume</h3>
          <p className="text-white/60 mb-8">Upload your existing resume to get started</p>

          <div className="relative min-h-[200px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <label className="block w-full p-8 border-2 border-dashed border-white/20 rounded-2xl hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer text-center group">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-white/50 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <p className="text-white font-medium mb-1">Click to upload or drag & drop</p>
                    <p className="text-white/40 text-sm">PDF, DOCX, or TXT (Max 10MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}

              {(uploadState === 'uploading' || uploadState === 'processing') && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-white/10"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-purple-500 origin-center -rotate-90"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{progress}%</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {uploadState === 'uploading' ? 'Uploading...' : 'Processing...'}
                  </h4>
                  <motion.p
                    key={statusMessageIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-white/50 text-sm h-5"
                  >
                    {statusMessages[statusMessageIndex]}
                  </motion.p>
                </motion.div>
              )}

              {uploadState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Upload Complete!</h4>
                  <p className="text-white/60">Redirecting to editor...</p>
                </motion.div>
              )}

              {uploadState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Upload Failed</h4>
                  <p className="text-red-300/80 mb-6">{errorMessage}</p>
                  <button
                    onClick={() => {
                        setUploadState('idle')
                        setErrorMessage('')
                    }}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
