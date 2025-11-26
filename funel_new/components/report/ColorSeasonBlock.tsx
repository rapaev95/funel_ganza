'use client'

import { useState, useEffect } from 'react'
import { ReportCard } from './ReportCard'
import {
  ColorSeason,
  ColorTemperature,
  ContrastLevel,
  HairColor,
  Gender,
  Age,
} from '@/types/result'
import {
  getColorSeasonContent,
  getColorPalette,
  COLOR_SEASON_LABELS,
  getColorSeasonImagePaths,
} from '@/lib/dictionaries'
import { parseBoldText } from '@/lib/text-parser'

interface ColorSeasonBlockProps {
  color_season: ColorSeason
  color_temperature: ColorTemperature
  contrast_level: ContrastLevel
  hair_color: HairColor
  gender?: Gender
  age?: Age
}

export function ColorSeasonBlock({
  color_season,
  color_temperature,
  contrast_level,
  hair_color,
  gender,
  age,
}: ColorSeasonBlockProps) {
  const content = getColorSeasonContent(color_season, color_temperature, contrast_level)
  const palette = getColorPalette(color_season, color_temperature, contrast_level, hair_color)
  const imagePaths = getColorSeasonImagePaths(color_season, gender, age)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  
  const currentImagePath = imagePaths.length > 0 ? imagePaths[currentImageIndex] : null

  // Сброс состояния при изменении параметров
  useEffect(() => {
    setCurrentImageIndex(0)
    setImageError(false)
  }, [gender, age, color_season])

  // Логирование для отладки
  useEffect(() => {
    console.log('=== ColorSeasonBlock Debug ===')
    console.log('Props received:', {
      color_season,
      gender,
      age,
      imagePathsCount: imagePaths.length,
    })
    
    if (imagePaths.length > 0) {
      console.log('All image paths:', imagePaths)
      console.log('Current image path:', currentImagePath)
      console.log('Current index:', currentImageIndex)
      console.log('Image error:', imageError)
      console.log('Will render image:', currentImagePath && !imageError)
    } else {
      console.warn('⚠️ No image paths found!', {
        gender,
        age,
        color_season,
        hasGender: !!gender,
        hasAge: !!age,
      })
    }
    console.log('=== End Debug ===')
  }, [imagePaths, currentImagePath, currentImageIndex, imageError, gender, age, color_season])

  return (
    <ReportCard className="color-season-block">
      <h2 className="report-title">{content.title}</h2>
      {content.subtitle && <p className="report-subtitle">{content.subtitle}</p>}

      {/* Фото цветотипа */}
      {currentImagePath && !imageError ? (
        <div className="color-season-image-wrapper">
          <img
            key={`${currentImagePath}-${currentImageIndex}`}
            src={currentImagePath}
            alt={`${COLOR_SEASON_LABELS[color_season]} - пример`}
            className="color-season-image"
            onError={(e) => {
              console.error('❌ Image load error for:', currentImagePath)
              console.error('Error details:', e)
              // Пробуем следующий путь, если текущий не загрузился
              if (currentImageIndex < imagePaths.length - 1) {
                const nextIndex = currentImageIndex + 1
                console.log(`🔄 Trying next image path (${nextIndex}/${imagePaths.length - 1}):`, imagePaths[nextIndex])
                setCurrentImageIndex(nextIndex)
              } else {
                console.log('❌ All image paths failed, hiding image')
                setImageError(true)
              }
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', currentImagePath)
            }}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      ) : imagePaths.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
          <p>Изображение недоступно (gender: {gender || 'не указан'}, age: {age || 'не указан'})</p>
        </div>
      ) : null}

      <div className="report-description">
        {content.description.map((paragraph, index) => (
          <p key={index}>{parseBoldText(paragraph)}</p>
        ))}
      </div>

      <div className="color-palette-section">
        <div className="palette-group">
          <h3 className="palette-title">Твои цвета</h3>
          <div className="color-palette">
            {palette.recommended.map((color, index) => (
              <div
                key={index}
                className="color-chip recommended"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="palette-group">
          <h3 className="palette-title">Избегать</h3>
          <div className="color-palette">
            {palette.avoid.map((color, index) => (
              <div
                key={index}
                className="color-chip avoid"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </ReportCard>
  )
}

