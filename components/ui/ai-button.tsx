// components/ui/ai-button.tsx
// AI Action Button with Sparkle Icon

import { Sparkles, Loader2 } from 'lucide-react'

interface AiButtonProps {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  children?: React.ReactNode
}

export const AiButton = ({
  onClick,
  loading = false,
  disabled = false,
  size = 'md',
  variant = 'primary',
  children = 'Generate',
}: AiButtonProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variantClasses = {
    primary: 'glow-button',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-xl font-semibold
        inline-flex items-center space-x-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      <span>{children}</span>
    </button>
  )
}
