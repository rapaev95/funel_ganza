'use client'

import { ReactNode } from 'react'

interface ReportCardProps {
  children: ReactNode
  className?: string
}

export function ReportCard({ children, className = '' }: ReportCardProps) {
  return (
    <div className={`report-card ${className}`}>
      {children}
    </div>
  )
}

