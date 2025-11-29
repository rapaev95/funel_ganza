'use client'

import { Card } from '@/components/ui/Card'
import { LineChart } from '@/components/charts/LineChart'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { BrandAwarenessData } from '@/types/dashboard'

interface BrandAwarenessBlockProps {
  data?: BrandAwarenessData
  isLoading?: boolean
}

export function BrandAwarenessBlock({ data, isLoading }: BrandAwarenessBlockProps) {
  if (isLoading) {
    return (
      <Card title="Индекс узнаваемости бренда">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card title="Индекс узнаваемости бренда">
        <EmptyState
          title="Нет данных"
          description="Данные об узнаваемости бренда пока не доступны"
        />
      </Card>
    )
  }

  return (
    <Card title="Индекс узнаваемости бренда">
      <div className="brand-awareness-content">
        <div className="brand-awareness-chart">
          <LineChart data={data.chartData} strokeColor="#FF0080" height={250} />
        </div>

        <div className="brand-awareness-metrics">
          <div className="metric-item">
            <div className="metric-label">WB Search Volume</div>
            <div className="metric-value">{data.wbSearchVolume.toLocaleString('ru-RU')}</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Yandex Wordstat Volume</div>
            <div className="metric-value">{data.yandexWordstatVolume.toLocaleString('ru-RU')}</div>
          </div>
        </div>

        <div className="brand-awareness-interpretation">
          <div className="interpretation-text">
            <p>{data.interpretation}</p>
          </div>
          <div className="recommendation-text">
            <strong>Рекомендация:</strong> {data.recommendation}
          </div>
        </div>
      </div>
    </Card>
  )
}

