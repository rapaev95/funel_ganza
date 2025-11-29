import { ReactNode, CSSProperties } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
  style?: CSSProperties
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style
}: BadgeProps) {
  return (
    <span 
      className={`badge badge-${variant} badge-${size} ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}

