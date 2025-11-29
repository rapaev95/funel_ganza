'use client'

import { Look, UsageContext, ColorSeason, Archetype } from '@/types/look'
import { USAGE_CONTEXT_LABELS, USAGE_CONTEXT_ICONS, COLOR_SEASON_LABELS } from '@/lib/look-dictionaries'

interface ProgressCardProps {
  looks: Look[]
}

export function ProgressCard({ looks }: ProgressCardProps) {
  // Подсчет прогресса по архетипам
  const archetypes: Archetype[] = [
    'rebel', 'lover', 'explorer', 'creator', 'ruler', 'sage'
  ]
  const completedArchetypes = archetypes.filter(archetype => 
    looks.some(look => look.archetype === archetype)
  ).length

  // Подсчет прогресса по контекстам
  const usageContexts: UsageContext[] = ['work', 'home', 'sport', 'evening', 'casual', 'beach', 'street']
  const contextProgress = usageContexts.map(context => {
    const count = looks.filter(look => look.usage_contexts.includes(context)).length
    const minRequired = context === 'work' || context === 'casual' || context === 'street' ? 2 : 1
    return {
      context,
      count,
      minRequired,
      completed: count >= minRequired
    }
  })
  const completedContexts = contextProgress.filter(c => c.completed).length

  // Подсчет прогресса по цветотипам
  const colorSeasons: ColorSeason[] = [
    'bright_winter', 'cool_winter', 'deep_winter',
    'cool_summer', 'light_summer', 'soft_summer',
    'warm_spring', 'light_spring', 'bright_spring',
    'warm_autumn', 'soft_autumn', 'deep_autumn'
  ]
  const completedColorSeasons = colorSeasons.filter(season =>
    looks.some(look => look.color_season === season)
  ).length

  // Общий процент прогресса
  const totalItems = archetypes.length + usageContexts.length + colorSeasons.length
  const completedItems = completedArchetypes + completedContexts + completedColorSeasons
  const progressPercentage = Math.round((completedItems / totalItems) * 100)

  // Подсчет недостающих луков
  const missingArchetypes = archetypes.filter(archetype =>
    !looks.some(look => look.archetype === archetype)
  )
  const missingContexts = contextProgress.filter(c => !c.completed)
  const missingColorSeasons = colorSeasons.filter(season =>
    !looks.some(look => look.color_season === season)
  )
  const totalMissing = missingArchetypes.length + missingContexts.length + missingColorSeasons.length

  return (
    <div className="progress-card" style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--card-radius)',
      padding: '32px',
      marginBottom: '32px',
      boxShadow: 'var(--shadow-md)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Заголовок с процентом */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: '8px'
          }}>
            Прогресс вашего профиля
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0
          }}>
            {progressPercentage}% профиля закрыто
          </p>
        </div>
        <div style={{
          fontSize: '48px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1
        }}>
          {progressPercentage}%
        </div>
      </div>

      {/* Прогресс по контекстам */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '12px'
        }}>
          Луки по контекстам:
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {contextProgress.map(({ context, count, minRequired, completed }) => (
            <div
              key={context}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: completed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'}`,
                borderRadius: '20px',
                fontSize: '14px',
                color: completed ? '#10b981' : 'var(--text-secondary)'
              }}
            >
              <span>{USAGE_CONTEXT_ICONS[context]}</span>
              <span>{USAGE_CONTEXT_LABELS[context]}:</span>
              <span style={{ fontWeight: 600 }}>
                {completed ? '✓' : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Прогресс по цветотипам */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '12px'
        }}>
          Луки по цветотипам:
        </h3>
        <div style={{
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          {completedColorSeasons} из {colorSeasons.length} цветотипов покрыто
        </div>
      </div>

      {/* Подсказка */}
      {totalMissing > 0 && (
        <div style={{
          padding: '16px',
          background: 'rgba(245, 158, 11, 0.15)',
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#fbbf24',
            margin: 0,
            fontWeight: 600
          }}>
            Осталось {totalMissing} обязательных луков для идеального покрытия:
          </p>
          <ul style={{
            margin: '8px 0 0 0',
            paddingLeft: '20px',
            fontSize: '14px',
            color: '#fbbf24'
          }}>
            {missingArchetypes.length > 0 && (
              <li>Архетипы: {missingArchetypes.length}</li>
            )}
            {missingContexts.length > 0 && (
              <li>Контексты: {missingContexts.map(c => USAGE_CONTEXT_LABELS[c.context]).join(', ')}</li>
            )}
            {missingColorSeasons.length > 0 && (
              <li>Цветотипы: {missingColorSeasons.length}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

