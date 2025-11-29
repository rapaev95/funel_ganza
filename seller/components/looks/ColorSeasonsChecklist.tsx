'use client'

import { Look, ColorSeason } from '@/types/look'
import { COLOR_SEASON_LABELS } from '@/lib/look-dictionaries'

interface ColorSeasonsChecklistProps {
  looks: Look[]
  onGenerateLook?: (colorSeason: ColorSeason) => void
}

export function ColorSeasonsChecklist({ looks, onGenerateLook }: ColorSeasonsChecklistProps) {
  const colorSeasons: ColorSeason[] = [
    'bright_winter', 'cool_winter', 'deep_winter',
    'cool_summer', 'light_summer', 'soft_summer',
    'warm_spring', 'light_spring', 'bright_spring',
    'warm_autumn', 'soft_autumn', 'deep_autumn'
  ]

  // Подсчет покрытия по сезонам
  const winterSeasons = ['bright_winter', 'cool_winter', 'deep_winter']
  const winterCount = colorSeasons.filter(season => 
    winterSeasons.includes(season) && looks.some(look => look.color_season === season)
  ).length
  const winterCoverage = Math.round((winterCount / winterSeasons.length) * 100)

  const hasSeason = (season: ColorSeason) => 
    looks.some(look => look.color_season === season)

  const missingSeasons = colorSeasons.filter(season => !hasSeason(season))

  return (
    <div className="color-seasons-checklist" style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--card-radius)',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-md)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '16px'
      }}>
        Цветотипы:
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {colorSeasons.map((season) => {
          const completed = hasSeason(season)
          return (
            <div
              key={season}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'}`
              }}
            >
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {COLOR_SEASON_LABELS[season]}
              </span>
              <span style={{
                fontSize: '16px',
                color: completed ? '#10b981' : 'var(--text-tertiary)'
              }}>
                {completed ? '✓' : '—'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Аналитика и подсказка */}
      <div style={{
        padding: '16px',
        background: 'rgba(59, 130, 246, 0.15)',
        borderRadius: 'var(--radius)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <p style={{
          fontSize: '14px',
          color: '#60a5fa',
          margin: 0,
          lineHeight: '1.6'
        }}>
          <strong>61% аудитории VibeLook</strong> — зимние цветотипы.
          <br />
          Ваш каталог покрывает только <strong>{winterCoverage}%</strong>.
          {missingSeasons.length > 0 && (
            <>
              <br />
              Сгенерируйте {missingSeasons.length} лук(ов) для недостающих цветотипов.
            </>
          )}
        </p>
      </div>
    </div>
  )
}

