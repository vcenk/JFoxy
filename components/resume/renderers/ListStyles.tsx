// components/resume/renderers/ListStyles.tsx
// Helper for rendering lists with custom bullet styles

'use client'

import { ReactNode } from 'react'

interface CustomListProps {
  style: 'disc' | 'circle' | 'square' | 'none'
  children: ReactNode
  className?: string
}

export const CustomList: React.FC<CustomListProps> = ({ style, children, className = '' }) => {
  const getListStyle = (): React.CSSProperties => {
    switch (style) {
      case 'disc':
        return { listStyleType: 'disc' }
      case 'circle':
        return { listStyleType: 'circle' }
      case 'square':
        return { listStyleType: 'square' }
      case 'none':
        return { listStyleType: 'none' }
      default:
        return { listStyleType: 'disc' }
    }
  }

  const baseClasses = style === 'none' ? 'space-y-1 text-gray-700' : 'list-outside ml-5 space-y-1 text-gray-700'

  return (
    <ul
      style={getListStyle()}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </ul>
  )
}
