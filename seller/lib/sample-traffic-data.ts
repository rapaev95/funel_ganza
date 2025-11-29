import { GeoAvailability, AdvertisingCampaign, CTRTest } from '@/types/traffic'

export const sampleGeoAvailability: GeoAvailability[] = [
  {
    channel: 'facebook',
    channelName: 'Facebook / Instagram Ads',
    countries: ['Казахстан', 'Беларусь', 'Армения', 'Узбекистан', 'Киргизия', 'Грузия', 'Сербия'],
    available: true
  },
  {
    channel: 'vk',
    channelName: 'ВК реклама',
    countries: ['Россия'],
    available: true
  },
  {
    channel: 'telegram',
    channelName: 'Telegram Ads',
    countries: [],
    available: true // Глобально доступно
  },
  {
    channel: 'yandex',
    channelName: 'Яндекс.Дзен',
    countries: ['Россия'],
    available: true
  }
]

export const sampleAdvertisingCampaigns: AdvertisingCampaign[] = [
  {
    id: '1',
    lookId: '1',
    lookName: 'Casual Streetwear Look',
    lookImage: '/product/look/fa1993c397cea6055eb5c3e27b270ce1.jpg',
    style: 'streetwear',
    geo: ['Казахстан', 'Беларусь'],
    bid: 5000,
    enabled: true,
    metrics: {
      impressions: 12000,
      clicks: 420,
      ctr: 0.035
    }
  }
]

export const sampleCTRTest: CTRTest = {
  id: '1',
  lookIds: ['1'],
  status: 'running',
  metrics: {
    impressions: 1200,
    clicks: 74,
    ctr: 0.061,
    leaderLookId: '1'
  },
  createdAt: new Date().toISOString()
}


