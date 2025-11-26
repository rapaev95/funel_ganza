'use client'

import { ReportCard } from './ReportCard'
import { ContrastLevel } from '@/types/result'
import { getContrastContent, getContrastProgress } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface ContrastBlockProps {
  contrast_level: ContrastLevel
}

export function ContrastBlock({ contrast_level }: ContrastBlockProps) {
  const content = getContrastContent(contrast_level)
  const progress = getContrastProgress(contrast_level)

  return (
    <ReportCard className="contrast-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      <div className="progress-bar-container">
        <div className="contrast-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            readOnly
            className="contrast-slider"
            style={{
              background: `linear-gradient(to right, 
                #9CA3AF 0%, 
                #6B7280 25%, 
                #4B5563 50%, 
                #374151 75%, 
                #1F2937 100%)`
            }}
          />
        </div>
        <div className="progress-labels">
          <span className="label-left">Низкий</span>
          <span className="label-center">Средний</span>
          <span className="label-right">Высокий</span>
        </div>
      </div>

      <div className="report-description">
        {content.description.map((paragraph, index) => (
          <p key={index}>{parseBoldText(paragraph)}</p>
        ))}
      </div>
    </ReportCard>
  )
}

