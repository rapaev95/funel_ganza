export type TrafficChannel = 'facebook' | 'vk' | 'telegram' | 'yandex'

export interface GeoAvailability {
  channel: TrafficChannel
  channelName: string
  countries: string[]
  available: boolean
}

export interface LookCampaign {
  lookId: string
  enabled: boolean
  geo: string[]
  bid: number // ставка в рублях
}

export interface AdvertisingCampaign {
  id: string
  lookId: string
  lookName: string
  lookImage: string
  style: string
  geo: string[]
  bid: number
  enabled: boolean
  metrics?: {
    impressions: number
    clicks: number
    ctr: number
  }
}

export interface OrganicPost {
  id: string
  lookId: string
  postedAt: string
  status: 'scheduled' | 'posted' | 'failed'
}

export interface CTRTest {
  id: string
  lookIds: string[]
  status: 'draft' | 'running' | 'completed'
  metrics?: {
    impressions: number
    clicks: number
    ctr: number
    leaderLookId?: string
  }
  createdAt: string
}

export interface TrafficStats {
  organic: {
    lastPostTime?: string
    totalPosts: number
  }
  advertising: {
    activeCampaigns: number
    averageCTR: number
  }
  test: {
    activeTest?: CTRTest
    totalTests: number
  }
}

