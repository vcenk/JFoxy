// contexts/ToastContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void
    success: (message: string, duration?: number) => void
    error: (message: string, duration?: number) => void
    info: (message: string, duration?: number) => void
    warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const toastConfig = {
    success: {
        icon: Check,
        bg: 'bg-green-500/20',
        border: 'border-green-500/30',
        text: 'text-green-300',
        iconBg: 'bg-green-500/30',
    },
    error: {
        icon: X,
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        text: 'text-red-300',
        iconBg: 'bg-red-500/30',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        text: 'text-blue-300',
        iconBg: 'bg-blue-500/30',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        text: 'text-amber-300',
        iconBg: 'bg-amber-500/30',
    },
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newToast: Toast = { id, message, type, duration }

        setToasts(prev => [...prev, newToast])

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }
    }, [removeToast])

    const success = useCallback((message: string, duration?: number) => {
        showToast(message, 'success', duration)
    }, [showToast])

    const error = useCallback((message: string, duration?: number) => {
        showToast(message, 'error', duration)
    }, [showToast])

    const info = useCallback((message: string, duration?: number) => {
        showToast(message, 'info', duration)
    }, [showToast])

    const warning = useCallback((message: string, duration?: number) => {
        showToast(message, 'warning', duration)
    }, [showToast])

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Container - Fixed at bottom right */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => {
                        const config = toastConfig[toast.type]
                        const IconComponent = config.icon

                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className={`
                  pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
                  backdrop-blur-xl shadow-2xl border min-w-[280px] max-w-[400px]
                  ${config.bg} ${config.border}
                `}
                            >
                                <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
                                    <IconComponent className={`w-4 h-4 ${config.text}`} />
                                </div>
                                <p className={`text-sm font-medium flex-1 ${config.text}`}>
                                    {toast.message}
                                </p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white/50 hover:text-white/80" />
                                </button>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}
