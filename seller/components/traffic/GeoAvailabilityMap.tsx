'use client'

import { useState } from 'react'
import { GeoAvailability } from '@/types/traffic'

interface GeoAvailabilityMapProps {
  data: GeoAvailability[]
}

const CHANNEL_ICONS: Record<string, string> = {
  facebook: '📘',
  vk: '🔵',
  telegram: '✈️',
  yandex: '🔍'
}

// Координаты центров стран для маркеров (x, y в процентах)
const COUNTRY_COORDINATES: Record<string, { x: number; y: number; name: string }> = {
  'Россия': { x: 50, y: 35, name: 'Россия' },
  'Казахстан': { x: 55, y: 50, name: 'Казахстан' },
  'Беларусь': { x: 35, y: 30, name: 'Беларусь' },
  'Армения': { x: 48, y: 65, name: 'Армения' },
  'Узбекистан': { x: 58, y: 58, name: 'Узбекистан' },
  'Киргизия': { x: 62, y: 55, name: 'Киргизия' },
  'Грузия': { x: 46, y: 62, name: 'Грузия' },
  'Сербия': { x: 32, y: 42, name: 'Сербия' }
}

// Упрощенная политическая карта России и соседних стран
const WorldMapSVG = ({ availableCountries, selectedChannel }: { availableCountries: string[], selectedChannel: string | null }) => {
  return (
    <svg
      viewBox="0 0 1200 800"
      style={{
        width: '100%',
        height: 'auto',
        maxHeight: '600px',
        background: '#ffffff',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--glass-border)'
      }}
    >
      {/* Фон */}
      <rect width="1200" height="800" fill="#f8f9fa" rx="8" />
      
      {/* Россия - основная территория */}
      <g id="russia">
        {/* Западная часть России */}
        <path
          d="M 200 150 L 450 120 L 500 140 L 520 180 L 500 220 L 480 280 L 450 320 L 400 350 L 350 360 L 300 350 L 250 320 L 200 280 L 150 240 L 120 200 L 130 160 Z"
          fill="#e3f2fd"
          stroke="#1976d2"
          strokeWidth="2"
        />
        
        {/* Центральная часть России */}
        <path
          d="M 450 120 L 700 100 L 750 130 L 780 180 L 760 240 L 720 300 L 680 340 L 630 360 L 580 370 L 520 360 L 480 320 L 450 280 L 420 240 L 400 200 L 390 160 L 400 130 Z"
          fill="#e3f2fd"
          stroke="#1976d2"
          strokeWidth="2"
        />
        
        {/* Восточная часть России (Сибирь) */}
        <path
          d="M 700 100 L 950 80 L 1000 120 L 1020 180 L 1000 240 L 960 300 L 900 340 L 840 360 L 780 370 L 720 360 L 680 320 L 650 280 L 630 240 L 620 200 L 630 160 L 660 130 Z"
          fill="#e3f2fd"
          stroke="#1976d2"
          strokeWidth="2"
        />
        
        {/* Южная часть России (Кавказ) */}
        <path
          d="M 400 350 L 500 340 L 550 360 L 580 400 L 560 440 L 520 460 L 480 450 L 450 420 L 420 380 L 400 360 Z"
          fill="#e3f2fd"
          stroke="#1976d2"
          strokeWidth="2"
        />
      </g>

      {/* Беларусь */}
      <path
        d="M 200 150 L 280 140 L 320 160 L 340 200 L 320 240 L 280 260 L 240 250 L 200 220 L 180 180 Z"
        fill="#ce93d8"
        stroke="#7b1fa2"
        strokeWidth="1.5"
      />
      <text x="240" y="200" fontSize="14" fill="#4a148c" fontWeight="600" textAnchor="middle">БЕЛОРУССИЯ</text>

      {/* Казахстан */}
      <path
        d="M 500 280 L 700 260 L 750 300 L 780 360 L 760 420 L 720 460 L 650 480 L 580 470 L 520 440 L 480 400 L 460 360 L 450 320 L 460 300 Z"
        fill="#9c27b0"
        stroke="#4a148c"
        strokeWidth="1.5"
      />
      <text x="600" y="380" fontSize="16" fill="#ffffff" fontWeight="600" textAnchor="middle">КАЗАХСТАН</text>

      {/* Узбекистан */}
      <path
        d="M 650 480 L 720 470 L 760 500 L 780 540 L 760 580 L 720 600 L 680 590 L 650 560 L 630 520 L 620 500 Z"
        fill="#9e9e9e"
        stroke="#424242"
        strokeWidth="1.5"
      />
      <text x="680" y="540" fontSize="12" fill="#212121" fontWeight="600" textAnchor="middle">УЗБЕКИСТАН</text>

      {/* Киргизия */}
      <path
        d="M 720 360 L 780 350 L 820 380 L 840 420 L 820 460 L 780 480 L 740 470 L 710 440 L 700 400 L 710 370 Z"
        fill="#ba68c8"
        stroke="#6a1b9a"
        strokeWidth="1.5"
      />
      <text x="750" y="420" fontSize="11" fill="#4a148c" fontWeight="600" textAnchor="middle">КИРГИЗИЯ</text>

      {/* Грузия */}
      <path
        d="M 480 450 L 520 440 L 550 460 L 560 500 L 540 530 L 500 540 L 470 520 L 450 480 L 460 460 Z"
        fill="#7b1fa2"
        stroke="#4a148c"
        strokeWidth="1.5"
      />
      <text x="500" y="490" fontSize="11" fill="#ffffff" fontWeight="600" textAnchor="middle">ГРУЗИЯ</text>

      {/* Армения */}
      <path
        d="M 520 500 L 550 490 L 580 510 L 590 540 L 570 560 L 540 570 L 510 560 L 490 530 L 500 510 Z"
        fill="#7b1fa2"
        stroke="#4a148c"
        strokeWidth="1.5"
      />
      <text x="540" y="535" fontSize="10" fill="#ffffff" fontWeight="600" textAnchor="middle">АРМЕНИЯ</text>

      {/* Сербия */}
      <path
        d="M 280 260 L 320 250 L 350 270 L 360 300 L 340 330 L 300 340 L 270 320 L 250 290 L 260 270 Z"
        fill="#9c27b0"
        stroke="#4a148c"
        strokeWidth="1.5"
      />
      <text x="300" y="300" fontSize="11" fill="#ffffff" fontWeight="600" textAnchor="middle">СЕРБИЯ</text>

      {/* Надпись РОССИЯ */}
      <text
        x="600"
        y="250"
        fontSize="48"
        fill="#1976d2"
        fontWeight="700"
        textAnchor="middle"
        opacity="0.3"
        letterSpacing="4"
      >
        РОССИЯ
      </text>

      {/* Маркеры для доступных стран */}
      {availableCountries.map((country) => {
        const coords = COUNTRY_COORDINATES[country]
        if (!coords) return null

        const x = (coords.x / 100) * 1200
        const y = (coords.y / 100) * 800

        return (
          <g key={country}>
            {/* Пульсирующий круг для активных маркеров */}
            {selectedChannel && (
              <circle
                cx={x}
                cy={y}
                r="20"
                fill="none"
                stroke="#000000"
                strokeWidth="3"
                opacity="0.3"
                className="map-marker-pulse"
              />
            )}
            {/* Основной маркер */}
            <circle
              cx={x}
              cy={y}
              r="14"
              fill={selectedChannel ? '#000000' : '#3056ff'}
              stroke="#ffffff"
              strokeWidth="3"
              style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <title>{country}</title>
            </circle>
            {/* Внутренний круг */}
            <circle
              cx={x}
              cy={y}
              r="6"
              fill="#ffffff"
            />
            {/* Название страны под маркером */}
            <text
              x={x}
              y={y + 35}
              textAnchor="middle"
              fill="#000000"
              fontSize="12"
              fontWeight="700"
              style={{
                textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                pointerEvents: 'none'
              }}
            >
              {coords.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function GeoAvailabilityMap({ data }: GeoAvailabilityMapProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)

  // Собираем все доступные страны из всех каналов
  const allAvailableCountries = data
    .filter(ch => ch.available && ch.countries.length > 0)
    .flatMap(ch => ch.countries)
  const uniqueCountries = Array.from(new Set(allAvailableCountries))

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--card-radius)',
        padding: '24px',
        marginBottom: '32px',
        backdropFilter: 'blur(10px)'
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '20px'
        }}
      >
        Карта доступности трафика
      </h3>

      {/* Карта мира */}
      <div
        style={{
          marginBottom: '24px',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <WorldMapSVG
          availableCountries={uniqueCountries}
          selectedChannel={selectedChannel}
        />
      </div>

      {/* Легенда и каналы */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {data.map((channel) => {
          const isSelected = selectedChannel === channel.channel
          
          return (
            <div
              key={channel.channel}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '16px',
                background: isSelected ? 'rgba(48, 86, 255, 0.1)' : 'transparent',
                border: isSelected ? '1px solid rgba(48, 86, 255, 0.3)' : '1px solid transparent',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={() => setSelectedChannel(channel.channel)}
              onMouseLeave={() => setSelectedChannel(null)}
              onClick={() => setSelectedChannel(isSelected ? null : channel.channel)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}
              >
                <span>{CHANNEL_ICONS[channel.channel] || '📢'}</span>
                <span>{channel.channelName}:</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                {channel.countries.length > 0 ? (
                  channel.countries.map((country) => {
                    const coords = COUNTRY_COORDINATES[country]
                    return (
                      <span
                        key={country}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 500,
                          backgroundColor: channel.available ? '#000000' : '#e5e5e5',
                          color: channel.available ? '#ffffff' : '#666666',
                          border: channel.available ? 'none' : '1px solid var(--glass-border)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                          transform: isSelected && coords ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {country}
                        {channel.available && (
                          <span style={{ fontSize: '10px' }}>✓</span>
                        )}
                      </span>
                    )
                  })
                ) : channel.available ? (
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}
                  >
                    Доступно глобально
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}
                  >
                    Недоступно
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
