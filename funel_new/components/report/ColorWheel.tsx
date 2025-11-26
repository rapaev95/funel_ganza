'use client'

import { useEffect, useState } from 'react'
import { COLOR_SEASON_LABELS } from '@/lib/dictionaries'
import { ColorSeason } from '@/types/result'

interface ColorWheelProps {
  selected: string // Русское название цветотипа, например "Яркая Зима"
}

interface SeasonGroup {
  name: string
  position: { x: number; y: number }
  subSeasons: {
    key: ColorSeason
    name: string
    color: string
    position: { x: number; y: number }
    temperature: string
  }[]
}

// Маппинг русских названий на ключи
const SEASON_NAME_TO_KEY: Record<string, ColorSeason> = {
  'Яркая Зима': 'bright_winter',
  'Холодная Зима': 'cool_winter',
  'Глубокая Зима': 'deep_winter',
  'Холодное Лето': 'cool_summer',
  'Светлое Лето': 'light_summer',
  'Мягкое Лето': 'soft_summer',
  'Теплая Весна': 'warm_spring',
  'Светлая Весна': 'light_spring',
  'Яркая Весна': 'bright_spring',
  'Теплая Осень': 'warm_autumn',
  'Мягкая Осень': 'soft_autumn',
  'Глубокая Осень': 'deep_autumn',
}

// Цвета для каждого подсезона
const SEGMENT_COLORS: Record<ColorSeason, string> = {
  // ЗИМА
  bright_winter: '#E91E63', // яркий розово-пурпурный
  cool_winter: '#2196F3', // чистый синий
  deep_winter: '#6A1B9A', // сливовый / тёмно-фиолетовый
  
  // ВЕСНА
  bright_spring: '#FF6B6B', // яркий коррал/розовато-красный
  warm_spring: '#4CAF50', // тёплый травянисто-зелёный
  light_spring: '#FFF9E6', // кремовый/бежевая пастель
  
  // ЛЕТО
  light_summer: '#B2DFDB', // мятно-зеленоватый пастельный
  cool_summer: '#03A9F4', // чистый голубой
  soft_summer: '#CE93D8', // пыльно-розовый / лиловый
  
  // ОСЕНЬ
  soft_autumn: '#D7A98C', // пыльно-розово-коричневый
  warm_autumn: '#FF9800', // жёлто-оранжевый
  deep_autumn: '#8D6E63', // кирпично-коричневый
}

// Температурные характеристики
const TEMPERATURE_LABELS: Record<ColorSeason, string> = {
  bright_winter: 'cool neutral',
  cool_winter: 'cool',
  deep_winter: 'cool neutral',
  bright_spring: 'warm neutral',
  warm_spring: 'warm',
  light_spring: 'warm neutral',
  light_summer: 'cool neutral',
  cool_summer: 'cool',
  soft_summer: 'cool neutral',
  soft_autumn: 'warm neutral',
  warm_autumn: 'warm',
  deep_autumn: 'warm neutral',
}

export function ColorWheel({ selected }: ColorWheelProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const size = 360 // Увеличенный размер для большего пространства
  const center = size / 2
  const mainRadius = size * 0.28 // Радиус для основных сезонов (больше расстояния)
  const subRadius = size * 0.45 // Радиус для подсезонов (больше расстояния)

  useEffect(() => {
    setIsLoaded(true)
    setIsMobile(window.innerWidth < 480)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Позиции основных сезонов (12, 3, 6, 9 часов)
  const mainSeasons: SeasonGroup[] = [
    {
      name: 'ЗИМА',
      position: { x: center, y: center - mainRadius },
      subSeasons: [
        {
          key: 'deep_winter',
          name: COLOR_SEASON_LABELS.deep_winter,
          color: SEGMENT_COLORS.deep_winter,
          position: { x: center - subRadius * 0.35, y: center - subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.deep_winter,
        },
        {
          key: 'cool_winter',
          name: COLOR_SEASON_LABELS.cool_winter,
          color: SEGMENT_COLORS.cool_winter,
          position: { x: center, y: center - subRadius * 0.25 },
          temperature: TEMPERATURE_LABELS.cool_winter,
        },
        {
          key: 'bright_winter',
          name: COLOR_SEASON_LABELS.bright_winter,
          color: SEGMENT_COLORS.bright_winter,
          position: { x: center + subRadius * 0.35, y: center - subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.bright_winter,
        },
      ],
    },
    {
      name: 'ВЕСНА',
      position: { x: center + mainRadius, y: center },
      subSeasons: [
        {
          key: 'bright_spring',
          name: COLOR_SEASON_LABELS.bright_spring,
          color: SEGMENT_COLORS.bright_spring,
          position: { x: center + subRadius * 0.35, y: center - subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.bright_spring,
        },
        {
          key: 'warm_spring',
          name: COLOR_SEASON_LABELS.warm_spring,
          color: SEGMENT_COLORS.warm_spring,
          position: { x: center + subRadius * 0.25, y: center },
          temperature: TEMPERATURE_LABELS.warm_spring,
        },
        {
          key: 'light_spring',
          name: COLOR_SEASON_LABELS.light_spring,
          color: SEGMENT_COLORS.light_spring,
          position: { x: center + subRadius * 0.35, y: center + subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.light_spring,
        },
      ],
    },
    {
      name: 'ЛЕТО',
      position: { x: center, y: center + mainRadius },
      subSeasons: [
        {
          key: 'light_summer',
          name: COLOR_SEASON_LABELS.light_summer,
          color: SEGMENT_COLORS.light_summer,
          position: { x: center + subRadius * 0.35, y: center + subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.light_summer,
        },
        {
          key: 'cool_summer',
          name: COLOR_SEASON_LABELS.cool_summer,
          color: SEGMENT_COLORS.cool_summer,
          position: { x: center, y: center + subRadius * 0.25 },
          temperature: TEMPERATURE_LABELS.cool_summer,
        },
        {
          key: 'soft_summer',
          name: COLOR_SEASON_LABELS.soft_summer,
          color: SEGMENT_COLORS.soft_summer,
          position: { x: center - subRadius * 0.35, y: center + subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.soft_summer,
        },
      ],
    },
    {
      name: 'ОСЕНЬ',
      position: { x: center - mainRadius, y: center },
      subSeasons: [
        {
          key: 'soft_autumn',
          name: COLOR_SEASON_LABELS.soft_autumn,
          color: SEGMENT_COLORS.soft_autumn,
          position: { x: center - subRadius * 0.35, y: center + subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.soft_autumn,
        },
        {
          key: 'warm_autumn',
          name: COLOR_SEASON_LABELS.warm_autumn,
          color: SEGMENT_COLORS.warm_autumn,
          position: { x: center - subRadius * 0.25, y: center },
          temperature: TEMPERATURE_LABELS.warm_autumn,
        },
        {
          key: 'deep_autumn',
          name: COLOR_SEASON_LABELS.deep_autumn,
          color: SEGMENT_COLORS.deep_autumn,
          position: { x: center - subRadius * 0.35, y: center - subRadius * 0.15 },
          temperature: TEMPERATURE_LABELS.deep_autumn,
        },
      ],
    },
  ]

  const selectedKey = SEASON_NAME_TO_KEY[selected] || null

  return (
    <div className="color-wheel-container w-full flex flex-col items-center py-4 md:py-6">
      <div className="relative w-full max-w-[360px] md:max-w-[400px] aspect-square">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          {/* Центральный элемент - минималистичный */}
          <circle
            cx={center}
            cy={center}
            r="4"
            fill="rgba(255, 255, 255, 0.3)"
            className="transition-opacity duration-300"
            style={{
              opacity: isLoaded ? 1 : 0,
            }}
          />

          {/* Основные сезоны и подсезоны */}
          {mainSeasons.map((season, seasonIndex) => {
            // Линия от центра к основному сезону
            const mainAngle = Math.atan2(
              season.position.y - center,
              season.position.x - center
            )
            const mainLineLength = mainRadius * 0.7

            return (
              <g key={season.name}>
                {/* Линия от центра к основному сезону - только если есть выбранный подсезон в этом сезоне */}
                {season.subSeasons.some(sub => sub.key === selectedKey) && (
                  <line
                    x1={center}
                    y1={center}
                    x2={center + mainLineLength * Math.cos(mainAngle)}
                    y2={center + mainLineLength * Math.sin(mainAngle)}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="0.5"
                    className="transition-opacity duration-300"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                    }}
                  />
                )}

                {/* Название основного сезона - только если есть выбранный подсезон в этом сезоне */}
                {season.subSeasons.some(sub => sub.key === selectedKey) && (
                  <text
                    x={season.position.x}
                    y={season.position.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255, 255, 255, 0.4)"
                    fontSize={isMobile ? 8 : 9}
                    fontWeight="500"
                    className="transition-opacity duration-300"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                    }}
                  >
                    {season.name}
                  </text>
                )}

                {/* Подсезоны */}
                {season.subSeasons.map((subSeason, subIndex) => {
                  const isSelected = subSeason.key === selectedKey
                  const subAngle = Math.atan2(
                    subSeason.position.y - season.position.y,
                    subSeason.position.x - season.position.x
                  )
                  const subLineLength = mainRadius * 0.5

                  return (
                    <g key={subSeason.key}>
                      {/* Линия от основного сезона к подсезону - очень тонкая и приглушенная, только для выбранного */}
                      {isSelected && (
                        <line
                          x1={season.position.x}
                          y1={season.position.y}
                          x2={subSeason.position.x}
                          y2={subSeason.position.y}
                          stroke="rgba(255, 255, 255, 0.2)"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="transition-opacity duration-300"
                          style={{
                            opacity: isLoaded ? 1 : 0,
                          }}
                        />
                      )}

                      {/* Кружок подсезона */}
                      <circle
                        cx={subSeason.position.x}
                        cy={subSeason.position.y}
                        r={isMobile ? 24 : 28}
                        fill={subSeason.color}
                        opacity={isSelected ? 1 : 0.15}
                        transform={isSelected ? `scale(1.25)` : 'scale(0.85)'}
                        transformOrigin={`${subSeason.position.x} ${subSeason.position.y}`}
                        className="transition-all duration-300 ease-out"
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 0 12px rgba(255,255,255,0.8))'
                            : 'none',
                          animation: isLoaded
                            ? 'fadeInSegment 0.5s ease-out forwards'
                            : 'none',
                          animationDelay: `${(seasonIndex * 3 + subIndex) * 0.03 + 0.2}s`,
                          opacity: isLoaded ? undefined : 0,
                        }}
                      />

                      {/* Название подсезона - только для выбранного, остальные скрыты */}
                      {isSelected && (
                        <text
                          x={subSeason.position.x}
                          y={subSeason.position.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#FFFFFF"
                          fontSize={isMobile ? 8 : 9}
                          fontWeight="600"
                          className="pointer-events-none select-none transition-all duration-300"
                          style={{
                            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                            animation: isLoaded
                              ? 'fadeInSegment 0.5s ease-out forwards'
                              : 'none',
                            animationDelay: `${(seasonIndex * 3 + subIndex) * 0.03 + 0.25}s`,
                            opacity: isLoaded ? undefined : 0,
                          }}
                        >
                          {subSeason.name.split(' ').map((word, i) => (
                            <tspan
                              key={i}
                              x={subSeason.position.x}
                              dy={i === 0 ? -5 : 10}
                              textAnchor="middle"
                            >
                              {word}
                            </tspan>
                          ))}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Текст под диаграммой */}
      <div className="mt-4 text-center px-4">
        <p className="text-xs md:text-sm text-gray-400 mb-1">Твой цветотип:</p>
        <p className="text-lg md:text-xl lg:text-2xl font-bold text-white">
          {selected}
        </p>
      </div>
    </div>
  )
}
