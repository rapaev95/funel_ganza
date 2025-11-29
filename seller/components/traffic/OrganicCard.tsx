'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface OrganicCardProps {
  lastPostTime?: string
  onCreatePost?: () => void
}

export function OrganicCard({ lastPostTime, onCreatePost }: OrganicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatLastPostTime = (time?: string) => {
    if (!time) return 'Нет постов'
    
    const now = new Date()
    const postTime = new Date(time)
    const diffMs = now.getTime() - postTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} назад`
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins > 0 ? `${diffMins} минут назад` : 'Только что'
    }
  }

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--card-radius)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backdropFilter: 'blur(10px)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Заголовок карточки */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: isExpanded ? '20px' : '0'
        }}
      >
        <div
          style={{
            fontSize: '32px',
            lineHeight: 1
          }}
        >
          📢
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}
          >
            Автопостинг
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              lineHeight: 1.5
            }}
          >
            Публикуем ваши луки в наши соцсети
          </p>
          {!isExpanded && (
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation()
                onCreatePost?.()
              }}
              style={{
                marginTop: '8px'
              }}
            >
              ▶ Создать пост
            </Button>
          )}
        </div>
      </div>

      {/* Развернутое содержимое */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '20px',
            marginTop: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              marginBottom: '20px'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '12px'
              }}
            >
              Выберите лук для публикации:
            </p>
            {/* Здесь будет форма выбора лука - пока заглушка */}
            <div
              style={{
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius)',
                border: '1px dashed var(--glass-border)',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '14px'
              }}
            >
              Форма выбора лука будет здесь
            </div>
          </div>

          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation()
              onCreatePost?.()
            }}
            style={{
              width: '100%'
            }}
          >
            ▶ Создать пост
          </Button>
        </div>
      )}

      {/* Статус */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        Последний пост отправлен: {formatLastPostTime(lastPostTime)}
      </div>
    </div>
  )
}


