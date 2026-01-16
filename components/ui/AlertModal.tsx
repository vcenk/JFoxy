// components/ui/AlertModal.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react'

type AlertVariant = 'error' | 'warning' | 'info' | 'success'

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  variant?: AlertVariant
  // Confirmation mode (two buttons)
  confirmText?: string
  onConfirm?: () => void | Promise<void>
  cancelText?: string
  isLoading?: boolean
  // Alert mode (single button)
  okText?: string
}

const variantConfig = {
  error: {
    icon: AlertCircle,
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    buttonBg: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    buttonBg: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: Info,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    buttonBg: 'bg-blue-500 hover:bg-blue-600',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    buttonBg: 'bg-green-500 hover:bg-green-600',
  },
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  confirmText,
  onConfirm,
  cancelText = 'Cancel',
  isLoading = false,
  okText = 'OK',
}: AlertModalProps) {
  const config = variantConfig[variant]
  const IconComponent = config.icon
  const isConfirmMode = !!onConfirm

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-[#1E1E2E] border ${config.borderColor} rounded-2xl p-6 max-w-md w-full`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message */}
            <p className="text-white/70 text-sm mb-6">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {isConfirmMode ? (
                <>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={`flex-1 py-3 ${config.buttonBg} text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      confirmText || 'Confirm'
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className={`w-full py-3 ${config.buttonBg} text-white rounded-xl font-semibold transition-colors`}
                >
                  {okText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
