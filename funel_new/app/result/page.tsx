'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackFacebookEvent } from '@/lib/facebook'
import { generateEventId } from '@/lib/analytics'
import { SizeModal } from '@/components/SizeModal'
import {
  ResultParams,
  ColorTemperature,
  ColorSeason,
  ContrastLevel,
  FaceShape,
  BodySilhouette,
  HairColor,
  Archetype,
  Gender,
  Age,
} from '@/types/result'
import { ReportCard } from '@/components/report/ReportCard'
import { ColorSeasonBlock } from '@/components/report/ColorSeasonBlock'
import { TemperatureBlock } from '@/components/report/TemperatureBlock'
import { ContrastBlock } from '@/components/report/ContrastBlock'
import { FaceShapeBlock } from '@/components/report/FaceShapeBlock'
import { BodySilhouetteBlock } from '@/components/report/BodySilhouetteBlock'
import { ArchetypeBlock } from '@/components/report/ArchetypeBlock'
import { ColorRecommendationsBlock } from '@/components/report/ColorRecommendationsBlock'

// Валидация параметров
function validateParams(searchParams: URLSearchParams): {
  valid: boolean
  params: ResultParams
  missingParams: string[]
} {
  const validSeasons: ColorSeason[] = [
    'bright_winter', 'cool_winter', 'deep_winter',
    'cool_summer', 'light_summer', 'soft_summer',
    'warm_spring', 'light_spring', 'bright_spring',
    'warm_autumn', 'soft_autumn', 'deep_autumn',
  ]
  const validTemperatures: ColorTemperature[] = ['cool', 'warm', 'neutral']
  const validContrasts: ContrastLevel[] = ['high', 'medium', 'low']
  const validFaceShapes: FaceShape[] = [
    'oval', 'round', 'square', 'rectangle', 'triangle', 'inverted_triangle', 'diamond',
  ]
  const validSilhouettes: BodySilhouette[] = ['V', 'A', 'H', 'X', 'O', 'I']
  const validHairColors: HairColor[] = [
    'black', 'dark_brown', 'brown', 'light_brown', 'dark_blonde',
    'ash_blonde', 'cool_blonde', 'platinum_blonde', 'red', 'copper', 'grey',
  ]
  const validArchetypes: Archetype[] = [
    'rebel', 'lover', 'explorer', 'creator', 'ruler', 'sage',
  ]
  const validGenders: Gender[] = ['male', 'female']
  const validAges: Age[] = ['old', 'young']

  const params: ResultParams = {}
  const missingParams: string[] = []

  const color_temperature = searchParams.get('color_temperature') as ColorTemperature | null
  if (color_temperature && validTemperatures.includes(color_temperature)) {
    params.color_temperature = color_temperature
  } else {
    missingParams.push('color_temperature')
  }

  const color_season = searchParams.get('color_season') as ColorSeason | null
  if (color_season && validSeasons.includes(color_season)) {
    params.color_season = color_season
  } else {
    missingParams.push('color_season')
  }

  const contrast_level = searchParams.get('contrast_level') as ContrastLevel | null
  if (contrast_level && validContrasts.includes(contrast_level)) {
    params.contrast_level = contrast_level
  } else {
    missingParams.push('contrast_level')
  }

  const face_shape = searchParams.get('face_shape') as FaceShape | null
  if (face_shape && validFaceShapes.includes(face_shape)) {
    params.face_shape = face_shape
  } else {
    missingParams.push('face_shape')
  }

  const body_silhouette = searchParams.get('body_silhouette') as BodySilhouette | null
  if (body_silhouette && validSilhouettes.includes(body_silhouette)) {
    params.body_silhouette = body_silhouette
  } else {
    missingParams.push('body_silhouette')
  }

  const hair_color = searchParams.get('hair_color') as HairColor | null
  if (hair_color && validHairColors.includes(hair_color)) {
    params.hair_color = hair_color
  } else {
    missingParams.push('hair_color')
  }

  const archetype = searchParams.get('archetype') as Archetype | null
  if (archetype && validArchetypes.includes(archetype)) {
    params.archetype = archetype
  } else {
    missingParams.push('archetype')
  }

  // Используем getAll для обработки дублирующихся параметров
  const genderParams = searchParams.getAll('gender')
  const gender = (genderParams.length > 0 ? genderParams[0] : null) as Gender | null
  if (gender && validGenders.includes(gender)) {
    params.gender = gender
  }
  console.log('ResultPage - gender from URL:', searchParams.get('gender'))
  console.log('ResultPage - all gender params (getAll):', genderParams)
  console.log('ResultPage - gender final:', gender, 'valid:', gender && validGenders.includes(gender))

  // Используем getAll для обработки дублирующихся параметров
  const ageParams = searchParams.getAll('age')
  const age = (ageParams.length > 0 ? ageParams[0] : null) as Age | null
  console.log('ResultPage - age from URL (get):', searchParams.get('age'))
  console.log('ResultPage - all age params (getAll):', ageParams)
  console.log('ResultPage - age type:', typeof age, 'value:', age)
  if (age && validAges.includes(age)) {
    params.age = age
    console.log('ResultPage - age set to params:', params.age)
  } else {
    console.log('ResultPage - age NOT set. age:', age, 'valid:', age && validAges.includes(age))
  }
  console.log('ResultPage - final params:', params)

  return {
    valid: missingParams.length === 0,
    params,
    missingParams,
  }
}

function ResultPageContent() {
  const searchParams = useSearchParams()
  const [validation, setValidation] = useState<{
    valid: boolean
    params: ResultParams
    missingParams: string[]
  } | null>(null)
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false)

  // Валидация параметров при монтировании
  useEffect(() => {
    const result = validateParams(searchParams)
    setValidation(result)
  }, [searchParams])

  // Интеграция Facebook Pixel
  useEffect(() => {
    if (validation?.valid) {
      const eventId = generateEventId()
      trackFacebookEvent('PageView', {
        content_name: 'Result Page',
        page_path: '/result',
      }, eventId)
    }
  }, [validation])

  // Если параметры невалидны, показываем fallback
  if (!validation) {
    return (
      <div className="container">
        <div className="screen">
          <div className="report-card">
            <h1>Загрузка...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!validation.valid) {
    return (
      <div className="container">
        <div className="screen">
          <div className="report-card">
            <h1>Ошибка</h1>
            <p>Параметр не определён. Пройди анализ заново.</p>
            <p className="text-secondary">
              Отсутствующие параметры: {validation.missingParams.join(', ')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { params } = validation

  return (
    <div className="container">
      <div className="report-page">
        {/* Hero-блок */}
        <div className="report-hero">
          <h1 className="report-hero-title">Твой стиль-портрет готов</h1>
          <p className="report-hero-subtitle">
            Этот отчёт создан автоматически на основе анализа твоего фото. Ниже — профессиональные рекомендации стилиста.
          </p>
        </div>

        {/* Блоки отчета */}
        {params.color_season &&
          params.color_temperature &&
          params.contrast_level &&
          params.hair_color && (
            <ColorSeasonBlock
              color_season={params.color_season}
              color_temperature={params.color_temperature}
              contrast_level={params.contrast_level}
              hair_color={params.hair_color}
              gender={params.gender}
              age={params.age}
            />
          )}

        {params.color_temperature && (
          <TemperatureBlock color_temperature={params.color_temperature} />
        )}

        {params.contrast_level && (
          <ContrastBlock contrast_level={params.contrast_level} />
        )}

        {params.face_shape && (
          <FaceShapeBlock face_shape={params.face_shape} />
        )}

        {params.body_silhouette && (
          <BodySilhouetteBlock body_silhouette={params.body_silhouette} />
        )}

        {params.archetype && (
          <ArchetypeBlock archetype={params.archetype} />
        )}

        {params.hair_color &&
          params.color_season &&
          params.color_temperature && (
            <ColorRecommendationsBlock
              hair_color={params.hair_color}
              color_season={params.color_season}
              color_temperature={params.color_temperature}
            />
          )}

        {/* CTA */}
        <div className="report-cta">
          <button 
            className="btn-primary"
            onClick={() => setIsSizeModalOpen(true)}
          >
            Получить подбор образов
          </button>
        </div>
      </div>

      <SizeModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        currentParams={searchParams}
      />
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="screen">
          <div className="report-card">
            <h1>Загрузка...</h1>
          </div>
        </div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  )
}

