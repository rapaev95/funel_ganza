// Типы для данных дашборда

export interface ChartDataPoint {
  date: string
  value: number
}

export interface BrandAwarenessData {
  chartData: ChartDataPoint[]
  wbSearchVolume: number
  yandexWordstatVolume: number
  interpretation: string
  recommendation: string
}

export interface MetricCard {
  label: string
  value: number | string
  icon: string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  format?: 'number' | 'currency' | 'percentage'
}

export interface LooksEffectivenessData {
  totalLooks: number
  views: number
  clicks: number
  transitionsToMP: number
  ctr: number
  cpa: number
  previousPeriod?: {
    views: number
    clicks: number
    transitionsToMP: number
    ctr: number
    cpa: number
  }
}

export interface AudienceDistribution {
  height: {
    range: string
    count: number
  }[]
  sizes: {
    size: string
    count: number
  }[]
  colorTypes: {
    colorType: string
    count: number
  }[]
  archetypes: {
    archetype: string
    count: number
  }[]
}

export interface IdealProfile {
  id: string
  description: string
  characteristics: {
    height?: string
    size?: string
    colorType?: string
    archetype?: string
  }
  percentage: number
}

export interface AudienceData {
  heightDistribution: AudienceDistribution['height']
  sizeDistribution: AudienceDistribution['sizes']
  colorTypeDistribution: AudienceDistribution['colorTypes']
  archetypeDistribution: AudienceDistribution['archetypes']
  topProfiles: IdealProfile[]
}


