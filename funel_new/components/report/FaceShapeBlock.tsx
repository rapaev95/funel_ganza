'use client'

import { ReportCard } from './ReportCard'
import { FaceShape } from '@/types/result'
import { getFaceShapeContent, getFaceShapeSymbol } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface FaceShapeBlockProps {
  face_shape: FaceShape
}

export function FaceShapeBlock({ face_shape }: FaceShapeBlockProps) {
  const content = getFaceShapeContent(face_shape)
  const symbol = getFaceShapeSymbol(face_shape)

  return (
    <ReportCard className="face-shape-block">
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

