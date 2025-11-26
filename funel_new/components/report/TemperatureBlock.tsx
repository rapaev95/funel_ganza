'use client'

import { ReportCard } from './ReportCard'
import { ColorTemperature } from '@/types/result'
import { getTemperatureContent, getTemperatureProgress } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface TemperatureBlockProps {
  color_temperature: ColorTemperature
}

export function TemperatureBlock({ color_temperature }: TemperatureBlockProps) {
  const content = getTemperatureContent(color_temperature)
  const progress = getTemperatureProgress(color_temperature)

  return (
    <ReportCard className="temperature-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      <div className="progress-bar-container">
        <div className="temperature-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            readOnly
            className="temperature-slider"
            style={{
              background: `linear-gradient(to right, 
                #EF4444 0%, 
                #F97316 12.5%, 
                #FBBF24 25%, 
                #EAB308 37.5%, 
                #A3A3A3 50%, 
                #94A3B8 62.5%, 
                #60A5FA 75%, 
                #3B82F6 87.5%, 
                #2563EB 100%)`
            }}
          />
        </div>
        <div className="progress-labels">
          <span className="label-left">Теплая</span>
          <span className="label-center">Нейтральная</span>
          <span className="label-right">Холодная</span>
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

