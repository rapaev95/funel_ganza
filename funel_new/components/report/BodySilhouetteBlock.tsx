'use client'

import { ReportCard } from './ReportCard'
import { BodySilhouette } from '@/types/result'
import { getBodySilhouetteContent, getBodySilhouetteSymbol } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface BodySilhouetteBlockProps {
  body_silhouette: BodySilhouette
}

export function BodySilhouetteBlock({ body_silhouette }: BodySilhouetteBlockProps) {
  const content = getBodySilhouetteContent(body_silhouette)
  const symbol = getBodySilhouetteSymbol(body_silhouette)

  return (
    <ReportCard className="body-silhouette-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      <div className="shape-symbol-container">
        <div className="shape-symbol">{symbol}</div>
      </div>

      <div className="report-description">
        {content.description.map((paragraph, index) => (
          <p key={index}>{parseBoldText(paragraph)}</p>
        ))}
      </div>
    </ReportCard>
  )
}

