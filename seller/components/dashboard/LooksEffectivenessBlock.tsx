'use client'

import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { LooksEffectivenessData } from '@/types/dashboard'

interface LooksEffectivenessBlockProps {
  data?: LooksEffectivenessData
  isLoading?: boolean
}

const metricIcons: Record<string, string> = {
  totalLooks: '👗',
  views: '👁️',
  clicks: '🖱️',
  transitionsToMP: '🛒',
  ctr: '📊',
  cpa: '💰',
}

const metricLabels: Record<string, string> = {
  totalLooks: 'Количество луков',
  views: 'Просмотры',
  clicks: 'Клики',
  transitionsToMP: 'Переходы на маркетплейсы',
  ctr: 'CTR (кликабельность)',
  cpa: 'Стоимость перехода',
}

const metricDescriptions: Record<string, string> = {
  totalLooks: 'Всего создано образов',
  views: 'Сколько раз просмотрели ваши образы',
  clicks: 'Сколько раз кликнули на образы',
  transitionsToMP: 'Переходы на Wildberries или Ozon',
  ctr: 'Процент кликов от просмотров',
  cpa: 'Средняя стоимость одного перехода на маркетплейс',
}

function formatMetricValue(key: string, value: number): string {
  switch (key) {
    case 'ctr':
      return `${value.toFixed(2)}%`
    case 'cpa':
      return `${value.toLocaleString('ru-RU')} ₽`
    default:
      return value.toLocaleString('ru-RU')
  }
}

function calculateChange(current: number, previous?: number): { value: number; type: 'increase' | 'decrease' | 'neutral' } | null {
  if (previous === undefined || previous === 0) return null
  
  const change = ((current - previous) / previous) * 100
  if (change > 0) return { value: change, type: 'increase' }
  if (change < 0) return { value: Math.abs(change), type: 'decrease' }
  return { value: 0, type: 'neutral' }
}

export function LooksEffectivenessBlock({ data, isLoading }: LooksEffectivenessBlockProps) {
  if (isLoading) {
    return (
      <Card title="Эффективность луков">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card title="Эффективность луков">
        <EmptyState
          title="Нет данных"
          description="Данные об эффективности луков пока не доступны"
        />
      </Card>
    )
  }

  const metrics = [
    { key: 'totalLooks', value: data.totalLooks },
    { key: 'views', value: data.views, previous: data.previousPeriod?.views },
    { key: 'clicks', value: data.clicks, previous: data.previousPeriod?.clicks },
    { key: 'transitionsToMP', value: data.transitionsToMP, previous: data.previousPeriod?.transitionsToMP },
    { key: 'ctr', value: data.ctr, previous: data.previousPeriod?.ctr },
    { key: 'cpa', value: data.cpa, previous: data.previousPeriod?.cpa },
  ]

  return (
    <Card title="Эффективность луков">
      <div className="looks-effectiveness-grid">
        {metrics.map((metric) => {
          const change = calculateChange(metric.value, metric.previous)
          return (
            <div key={metric.key} className="metric-card">
              <div className="metric-card-header">
                <span className="metric-icon">{metricIcons[metric.key]}</span>
                <div className="metric-card-label-wrapper">
                  <span className="metric-card-label">{metricLabels[metric.key]}</span>
                  <span className="metric-card-description" title={metricDescriptions[metric.key]}>
                    {metricDescriptions[metric.key]}
                  </span>
                </div>
              </div>
              <div className="metric-card-value">
                {formatMetricValue(metric.key, metric.value)}
              </div>
              {change && (
                <div className={`metric-change metric-change-${change.type}`}>
                  {change.type === 'increase' ? '↑' : '↓'} {change.value.toFixed(1)}%
                  <span className="metric-change-label">
                    {change.type === 'increase' ? 'рост' : 'снижение'} к прошлому периоду
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

