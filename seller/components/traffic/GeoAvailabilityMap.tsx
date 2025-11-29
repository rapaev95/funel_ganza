'use client'

import { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
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

// Координаты стран [longitude, latitude] для маркеров
const COUNTRY_COORDINATES: Record<string, { coords: [number, number], name: string }> = {
  'Россия': { coords: [100, 60], name: 'Россия' },
  'Казахстан': { coords: [66, 48], name: 'Казахстан' },
  'Беларусь': { coords: [28, 53], name: 'Беларусь' },
  'Армения': { coords: [44.5, 40.2], name: 'Армения' },
  'Узбекистан': { coords: [64, 41], name: 'Узбекистан' },
  'Киргизия': { coords: [74, 41.5], name: 'Киргизия' },
  'Грузия': { coords: [43.5, 42], name: 'Грузия' },
  'Сербия': { coords: [21, 44], name: 'Сербия' }
}

// Маппинг названий стран для поиска в топо-данных
const COUNTRY_NAME_MAP: Record<string, string[]> = {
  'Россия': ['Russia', 'Russian Federation'],
  'Казахстан': ['Kazakhstan'],
  'Беларусь': ['Belarus', 'Belorussia'],
  'Армения': ['Armenia'],
  'Узбекистан': ['Uzbekistan'],
  'Киргизия': ['Kyrgyzstan', 'Kyrgyz Republic'],
  'Грузия': ['Georgia'],
  'Сербия': ['Serbia']
}

// Топо-данные мира (включают все страны)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const WorldMapSVG = ({ availableCountries, selectedChannel }: { availableCountries: string[], selectedChannel: string | null }) => {
  // Определяем, какие страны нужно подсветить
  const getCountryFill = (countryName: string) => {
    for (const [ourName, geoNames] of Object.entries(COUNTRY_NAME_MAP)) {
      if (availableCountries.includes(ourName)) {
        const matches = geoNames.some(geoName => 
          countryName?.toLowerCase().includes(geoName.toLowerCase())
        )
        if (matches) {
          // Россия - светло-голубой
          if (ourName === 'Россия') return '#e3f2fd'
          // Другие страны - разные цвета
          if (ourName === 'Казахстан') return '#9c27b0'
          if (ourName === 'Беларусь') return '#ce93d8'
          if (ourName === 'Узбекистан') return '#9e9e9e'
          if (ourName === 'Киргизия') return '#ba68c8'
          if (ourName === 'Грузия') return '#7b1fa2'
          if (ourName === 'Армения') return '#7b1fa2'
          if (ourName === 'Сербия') return '#9c27b0'
          return '#e3f2fd'
        }
      }
    }
    return '#f5f5f5' // Недоступные страны - серый
  }

  const getCountryStroke = (countryName: string) => {
    for (const [ourName, geoNames] of Object.entries(COUNTRY_NAME_MAP)) {
      if (availableCountries.includes(ourName)) {
        const matches = geoNames.some(geoName => 
          countryName?.toLowerCase().includes(geoName.toLowerCase())
        )
        if (matches) {
          if (ourName === 'Россия') return '#1976d2'
          return '#4a148c'
        }
      }
    }
    return '#e0e0e0'
  }

  return (
    <div style={{ width: '100%', height: '600px', background: '#ffffff', borderRadius: 'var(--radius)' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [60, 55], // Центр на Россию
          scale: 600
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.NAME || geo.properties.NAME_LONG || ''
                const fill = getCountryFill(countryName)
                const stroke = getCountryStroke(countryName)
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={0.5}
                    style={{
                      default: { 
                        outline: 'none',
                        transition: 'all 0.2s'
                      },
                      hover: { 
                        outline: 'none', 
                        fill: fill === '#f5f5f5' ? '#e0e0e0' : fill,
                        stroke: stroke === '#e0e0e0' ? '#1976d2' : stroke,
                        strokeWidth: 1
                      },
                      pressed: { outline: 'none' }
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* Маркеры для доступных стран */}
          {availableCountries.map((country) => {
            const countryData = COUNTRY_COORDINATES[country]
            if (!countryData) return null

            return (
              <Marker key={country} coordinates={countryData.coords}>
                <g>
                  {/* Пульсирующий круг для активных маркеров */}
                  {selectedChannel && (
                    <circle
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
                    r={selectedChannel ? 10 : 8}
                    fill={selectedChannel ? '#000000' : '#3056ff'}
                    stroke="#ffffff"
                    strokeWidth="3"
                    style={{ 
                      cursor: 'pointer',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  />
                  {/* Внутренний круг */}
                  <circle r="4" fill="#ffffff" />
                  {/* Название страны */}
                  <text
                    textAnchor="middle"
                    y={-25}
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fill: '#000000',
                      fontSize: '12px',
                      fontWeight: '700',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                      pointerEvents: 'none'
                    }}
                  >
                    {countryData.name}
                  </text>
                </g>
              </Marker>
            )
          })}
      </ComposableMap>
    </div>
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
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--glass-border)'
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
                    const countryData = COUNTRY_COORDINATES[country]
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
                          transform: isSelected && countryData ? 'scale(1.05)' : 'scale(1)'
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
