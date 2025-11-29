'use client'

import { useState } from 'react'
import { Look, LookStyle, UsageContext, ColorSeason } from '@/types/look'
import { LookCard } from './LookCard'
import { LOOK_STYLE_LABELS, USAGE_CONTEXT_LABELS, COLOR_SEASON_LABELS } from '@/lib/look-dictionaries'

interface LooksGridProps {
  looks: Look[]
  onEdit?: (look: Look) => void
  onDelete?: (lookId: string) => void
}

export function LooksGrid({ looks, onEdit, onDelete }: LooksGridProps) {
  const [styleFilter, setStyleFilter] = useState<LookStyle | 'all'>('all')
  const [contextFilter, setContextFilter] = useState<UsageContext | 'all'>('all')
  const [colorSeasonFilter, setColorSeasonFilter] = useState<ColorSeason | 'all'>('all')

  const filteredLooks = looks.filter((look) => {
    const matchesStyle = styleFilter === 'all' || look.style === styleFilter
    const matchesContext = contextFilter === 'all' || look.usage_contexts.includes(contextFilter)
    const matchesColorSeason = colorSeasonFilter === 'all' || look.color_season === colorSeasonFilter
    
    return matchesStyle && matchesContext && matchesColorSeason
  })

  const resetFilters = () => {
    setStyleFilter('all')
    setContextFilter('all')
    setColorSeasonFilter('all')
  }

  const hasActiveFilters = styleFilter !== 'all' || contextFilter !== 'all' || colorSeasonFilter !== 'all'

  return (
    <div className="looks-grid-section">
      {/* Заголовок и фильтры */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Ваши луки
        </h2>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            style={{
              padding: '8px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--glass-bg)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--glass-border)'
      }}>
        {/* Фильтр по стилю */}
        <select
          value={styleFilter}
          onChange={(e) => setStyleFilter(e.target.value as LookStyle | 'all')}
          style={{
            padding: '8px 12px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Все стили</option>
          {(Object.keys(LOOK_STYLE_LABELS) as LookStyle[]).map((style) => (
            <option key={style} value={style}>
              {LOOK_STYLE_LABELS[style]}
            </option>
          ))}
        </select>

        {/* Фильтр по контексту */}
        <select
          value={contextFilter}
          onChange={(e) => setContextFilter(e.target.value as UsageContext | 'all')}
          style={{
            padding: '8px 12px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Все контексты</option>
          {(Object.keys(USAGE_CONTEXT_LABELS) as UsageContext[]).map((context) => (
            <option key={context} value={context}>
              {USAGE_CONTEXT_LABELS[context]}
            </option>
          ))}
        </select>

        {/* Фильтр по цветотипу */}
        <select
          value={colorSeasonFilter}
          onChange={(e) => setColorSeasonFilter(e.target.value as ColorSeason | 'all')}
          style={{
            padding: '8px 12px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="all">Все цветотипы</option>
          {(Object.keys(COLOR_SEASON_LABELS) as ColorSeason[]).map((season) => (
            <option key={season} value={season}>
              {COLOR_SEASON_LABELS[season]}
            </option>
          ))}
        </select>
      </div>

      {/* Сетка луков */}
      {filteredLooks.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {hasActiveFilters ? 'Луки не найдены по выбранным фильтрам' : 'Пока нет луков'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredLooks.map((look) => (
            <LookCard
              key={look.id}
              look={look}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

