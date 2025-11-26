'use client'

import { useState } from 'react'
import { ReportCard } from './ReportCard'
import { Archetype } from '@/types/result'
import { getArchetypeContent, getArchetypeImage, ARCHETYPE_LABELS } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface ArchetypeBlockProps {
  archetype: Archetype
}

export function ArchetypeBlock({ archetype }: ArchetypeBlockProps) {
  const content = getArchetypeContent(archetype)
  const imagePath = getArchetypeImage(archetype)
  const [imageError, setImageError] = useState(false)

  return (
    <ReportCard className="archetype-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      <div className="archetype-image-container">
        {!imageError ? (
          <img
            src={imagePath}
            alt={ARCHETYPE_LABELS[archetype]}
            className="archetype-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="archetype-placeholder">
            {ARCHETYPE_LABELS[archetype].charAt(0)}
          </div>
        )}
      </div>

      <div className="report-description">
        {content.description.map((paragraph, index) => (
          <p key={index}>{parseBoldText(paragraph)}</p>
        ))}
      </div>
    </ReportCard>
  )
}

