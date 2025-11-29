import { Look } from '@/types/look'

export const sampleLooksData: Look[] = [
  {
    id: '1',
    name: 'Casual Streetwear Look',
    image: '/product/look/fa1993c397cea6055eb5c3e27b270ce1.jpg',
    style: 'streetwear',
    color_season: 'bright_winter',
    usage_contexts: ['street', 'casual'],
    archetype: 'rebel',
    description: 'Современный уличный образ в ярких зимних тонах',
    metrics: {
      clicks: 1250,
      ctr: 0.045,
      conversions: 23
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

