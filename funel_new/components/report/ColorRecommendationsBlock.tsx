'use client'

import { ReportCard } from './ReportCard'
import { HairColor, ColorSeason, ColorTemperature } from '@/types/result'
import { getColorRecommendationsContent, HAIR_COLOR_LABELS } from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface ColorRecommendationsBlockProps {
  hair_color: HairColor
  color_season: ColorSeason
  color_temperature: ColorTemperature
}

export function ColorRecommendationsBlock({
  hair_color,
  color_season,
  color_temperature,
}: ColorRecommendationsBlockProps) {
  const content = getColorRecommendationsContent(hair_color, color_season, color_temperature)

  // Генерируем 3 максимально разных оттенка для волос
  const getHairColorSwatches = (hairColor: HairColor): string[] => {
    const swatches: Record<HairColor, string[]> = {
      black: ['#000000', '#2F2F2F', '#555555'],
      dark_brown: ['#2D1B0E', '#4A2C1A', '#6B4423'],
      brown: ['#5C3A21', '#8B4513', '#A0522D'],
      light_brown: ['#8B6F47', '#B8957A', '#D2B48C'],
      dark_blonde: ['#B8860B', '#DAA520', '#F0E68C'],
      ash_blonde: ['#D3C5A5', '#E5DCC3', '#F5EBDC'],
      cool_blonde: ['#E0E6D3', '#F0F8FF', '#FFF8DC'],
      platinum_blonde: ['#E6E6D3', '#F5F5DC', '#FFFFFF'],
      red: ['#8B0000', '#DC143C', '#FF6347'],
      copper: ['#8B4513', '#CD853F', '#FF7F50'],
      grey: ['#505050', '#808080', '#B0B0B0'],
    }
    return swatches[hairColor] || ['#808080', '#A0A0A0', '#C0C0C0']
  }

  const hairSwatches = getHairColorSwatches(hair_color)

  return (
    <ReportCard className="color-recommendations-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      <div className="hair-color-section">
        <p className="hair-color-label">Цвет волос для покраски который вам пойдет</p>
        <div className="hair-color-swatches">
          {hairSwatches.map((color, index) => (
            <div
              key={index}
              className="hair-color-chip"
              style={{ backgroundColor: color }}
              title={HAIR_COLOR_LABELS[hair_color]}
            />
          ))}
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

