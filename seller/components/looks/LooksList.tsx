'use client'

import { useState } from 'react'
import { Look, LookStyle, ColorSeason } from '@/types/look'
import { LookCard } from './LookCard'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LOOK_STYLE_LABELS, COLOR_SEASON_LABELS, LOOK_STYLE_ICONS } from '@/lib/look-dictionaries'

interface LooksListProps {
  looks: Look[]
  isLoading?: boolean
  onEdit?: (look: Look) => void
  onDelete?: (lookId: string) => void
}

export function LooksList({ looks, isLoading, onEdit, onDelete }: LooksListProps) {
  const [styleFilter, setStyleFilter] = useState<LookStyle | 'all'>('all')
  const [colorSeasonFilter, setColorSeasonFilter] = useState<ColorSeason | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  if (isLoading) {
    return (
      <Card>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }}></div>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Загрузка...</p>
        </div>
      </Card>
    )
  }

  if (!looks || looks.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Нет луков"
          description="Добавьте луки для начала работы"
        />
      </Card>
    )
  }

  const filteredLooks = looks.filter((look) => {
    const matchesSearch = look.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (look.description && look.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStyle = styleFilter === 'all' || look.style === styleFilter
    const matchesColorSeason = colorSeasonFilter === 'all' || look.color_season === colorSeasonFilter
    
    return matchesSearch && matchesStyle && matchesColorSeason
  })

  const stats = {
    total: looks.length,
    byStyle: Object.keys(LOOK_STYLE_LABELS).reduce((acc, style) => {
      acc[style as LookStyle] = looks.filter(l => l.style === style).length
      return acc
    }, {} as Record<LookStyle, number>),
  }

  const resetFilters = () => {
    setStyleFilter('all')
    setColorSeasonFilter('all')
    setSearchQuery('')
  }

  const hasActiveFilters = styleFilter !== 'all' || colorSeasonFilter !== 'all' || searchQuery !== ''

  return (
    <div>
      {/* Статистика */}
      <div className="looks-stats" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Всего</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.total}</div>
        </div>
        {Object.entries(stats.byStyle).map(([style, count]) => (
          count > 0 && (
            <div key={style} className="stat-card" style={{ 
              padding: '16px', 
              background: 'rgba(255, 255, 255, 0.08)', 
              borderRadius: 'var(--card-radius)',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {LOOK_STYLE_ICONS[style as LookStyle]} {LOOK_STYLE_LABELS[style as LookStyle]}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{count}</div>
            </div>
          )
        ))}
      </div>

      {/* Фильтры */}
      <Card>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '16px', 
          marginBottom: '24px'
        }}>
          {/* Поиск */}
          <input
            type="text"
            placeholder="Поиск по названию или описанию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}
          />

          {/* Фильтр по стилю */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              marginBottom: '8px',
              fontWeight: 600
            }}>
              Стиль:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px' 
            }}>
              <button
                onClick={() => setStyleFilter('all')}
                style={{
                  padding: '8px 16px',
                  background: styleFilter === 'all' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                  border: `1px solid ${styleFilter === 'all' ? 'transparent' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--btn-radius)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: styleFilter === 'all' ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                Все
              </button>
              {(Object.keys(LOOK_STYLE_LABELS) as LookStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setStyleFilter(style)}
                  style={{
                    padding: '8px 16px',
                    background: styleFilter === style ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                    border: `1px solid ${styleFilter === style ? 'transparent' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--btn-radius)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: styleFilter === style ? 600 : 400,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{LOOK_STYLE_ICONS[style]}</span>
                  <span>{LOOK_STYLE_LABELS[style]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Фильтр по цветотипу */}
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              marginBottom: '8px',
              fontWeight: 600
            }}>
              Цветотип:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              maxHeight: '120px',
              overflowY: 'auto',
              padding: '4px'
            }}>
              <button
                onClick={() => setColorSeasonFilter('all')}
                style={{
                  padding: '8px 16px',
                  background: colorSeasonFilter === 'all' ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                  border: `1px solid ${colorSeasonFilter === 'all' ? 'transparent' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--btn-radius)',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: colorSeasonFilter === 'all' ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                Все
              </button>
              {(Object.keys(COLOR_SEASON_LABELS) as ColorSeason[]).map((season) => (
                <button
                  key={season}
                  onClick={() => setColorSeasonFilter(season)}
                  style={{
                    padding: '8px 16px',
                    background: colorSeasonFilter === season ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                    border: `1px solid ${colorSeasonFilter === season ? 'transparent' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--btn-radius)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: colorSeasonFilter === season ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  {COLOR_SEASON_LABELS[season]}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка сброса фильтров */}
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
                alignSelf: 'flex-start',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
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

        {/* Список луков */}
        {filteredLooks.length === 0 ? (
          <EmptyState
            title="Луки не найдены"
            description="Попробуйте изменить параметры фильтрации"
          />
        ) : (
          <div className="looks-grid" style={{
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
      </Card>
    </div>
  )
}


