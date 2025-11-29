'use client'

import { Card } from '@/components/ui/Card'
import { BarChart } from '@/components/charts/BarChart'
import { PieChart } from '@/components/charts/PieChart'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { AudienceData } from '@/types/dashboard'

interface AudienceBlockProps {
  data?: AudienceData
  isLoading?: boolean
}

export function AudienceBlock({ data, isLoading }: AudienceBlockProps) {
  if (isLoading) {
    return (
      <Card title="Аудитория">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card title="Аудитория">
        <EmptyState
          title="Нет данных"
          description="Данные об аудитории пока не доступны"
        />
      </Card>
    )
  }

  const heightChartData = data.heightDistribution.map(item => ({
    name: item.range,
    value: item.count
  }))

  const sizeChartData = data.sizeDistribution.map(item => ({
    name: item.size,
    value: item.count
  }))

  const colorTypeChartData = data.colorTypeDistribution.map(item => ({
    name: item.colorType,
    value: item.count
  }))

  const archetypeChartData = data.archetypeDistribution.map(item => ({
    name: item.archetype,
    value: item.count
  }))

  return (
    <Card title="Аудитория">
      <div className="audience-content">
        <div className="audience-section">
          <h4 className="section-title">Распределение по росту</h4>
          <BarChart data={heightChartData} fillColor="#7928CA" height={200} />
        </div>

        <div className="audience-charts-grid">
          <div className="audience-chart-item">
            <h4 className="section-title">Размеры</h4>
            <PieChart data={sizeChartData} height={200} />
          </div>

          <div className="audience-chart-item">
            <h4 className="section-title">Цветотипы</h4>
            <PieChart data={colorTypeChartData} height={200} />
          </div>

          <div className="audience-chart-item">
            <h4 className="section-title">Архетипы</h4>
            <PieChart data={archetypeChartData} height={200} />
          </div>
        </div>

        {data.topProfiles.length > 0 && (
          <div className="audience-profiles">
            <h4 className="section-title">Топ-3 идеальных профиля</h4>
            <div className="profiles-grid">
              {data.topProfiles.map((profile, index) => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-rank">#{index + 1}</div>
                  <div className="profile-description">{profile.description}</div>
                  <div className="profile-characteristics">
                    {Object.entries(profile.characteristics).map(([key, value]) => (
                      <span key={key} className="profile-tag">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                  <div className="profile-percentage">{profile.percentage}% аудитории</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

