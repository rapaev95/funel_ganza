'use client'

import { useState, useRef, useEffect } from 'react'
import { Look } from '@/types/look'
import { Badge } from '@/components/ui/Badge'
import { LOOK_STYLE_LABELS, COLOR_SEASON_LABELS, LOOK_STYLE_ICONS, USAGE_CONTEXT_LABELS, USAGE_CONTEXT_ICONS } from '@/lib/look-dictionaries'

interface LookCardProps {
  look: Look
  onEdit?: (look: Look) => void
  onDelete?: (lookId: string) => void
}

export function LookCard({ look, onEdit, onDelete }: LookCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    })
  }

  return (
    <div className="look-card-item" style={{
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--card-radius)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 0, 128, 0.2)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'none'
    }}
    >
      {/* Изображение */}
      <div style={{ 
        width: '100%', 
        aspectRatio: '3/4', 
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        position: 'relative'
      }}>
        <img 
          src={look.image} 
          alt={look.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            backgroundColor: 'var(--glass-bg)'
          }}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-secondary); font-size: 12px; text-align: center; padding: 16px;">
                  Нет фото
                </div>
              `
            }
          }}
        />
        {/* Бейдж стиля */}
        <Badge variant="info" size="sm" style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>{LOOK_STYLE_ICONS[look.style]}</span>
          <span>{LOOK_STYLE_LABELS[look.style]}</span>
        </Badge>
      </div>

      {/* Информация */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: '1.4',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {look.name}
        </h3>

        {look.description && (
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {look.description}
          </p>
        )}

        {/* Контексты использования */}
        {look.usage_contexts && look.usage_contexts.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            fontSize: '11px'
          }}>
            {look.usage_contexts.map((context) => (
              <span
                key={context}
                style={{
                  padding: '4px 8px',
                  background: 'var(--glass-bg)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{USAGE_CONTEXT_ICONS[context]}</span>
                <span>{USAGE_CONTEXT_LABELS[context]}</span>
              </span>
            ))}
          </div>
        )}

        {/* Цветотип */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '6px 10px',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius)',
          fontSize: '12px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>🎨</span>
          <span style={{ color: 'var(--text-primary)' }}>{COLOR_SEASON_LABELS[look.color_season]}</span>
        </div>

        {/* Метрики */}
        {look.metrics && (
          <div style={{
            display: 'flex',
            gap: '12px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            paddingTop: '8px',
            borderTop: '1px solid var(--glass-border)'
          }}>
            {look.metrics.clicks !== undefined && (
              <div>👁️ {look.metrics.clicks.toLocaleString('ru-RU')}</div>
            )}
            {look.metrics.ctr !== undefined && (
              <div>📊 CTR: {(look.metrics.ctr * 100).toFixed(1)}%</div>
            )}
            {look.metrics.conversions !== undefined && (
              <div>💰 {look.metrics.conversions}</div>
            )}
          </div>
        )}

        {/* Дата создания */}
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Создан: {formatDate(look.created_at)}
        </div>
      </div>

      {/* Действия */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginTop: '8px',
        paddingTop: '12px',
        borderTop: '1px solid var(--glass-border)',
        position: 'relative'
      }}>
        <button 
          onClick={() => onEdit?.(look)}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass-bg)'
          }}
        >
          Редактировать
        </button>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{
              padding: '8px 12px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--glass-bg)'
            }}
          >
            ⋮
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              bottom: '100%',
              marginBottom: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 10,
              minWidth: '150px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => {
                  if (confirm('Вы уверены, что хотите удалить этот лук?')) {
                    onDelete?.(look.id)
                  }
                  setShowMenu(false)
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--error-color)',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

