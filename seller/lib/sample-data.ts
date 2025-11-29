import { BrandAwarenessData, LooksEffectivenessData, AudienceData } from '@/types/dashboard'

// Генерируем данные за последние 12 месяцев
function generateLast12Months(): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = []
  const today = new Date()
  
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    
    // Генерируем реалистичные данные с небольшими колебаниями
    const baseValue = 12000
    const variation = Math.random() * 3000 - 1500
    const trend = (11 - i) * 800 // Восходящий тренд
    
    // Форматируем как "Янв 2024"
    const monthName = monthNames[date.getMonth()]
    const year = date.getFullYear()
    
    data.push({
      date: `${monthName} ${year}`,
      value: Math.round(baseValue + variation + trend)
    })
  }
  
  return data
}

export const sampleBrandAwarenessData: BrandAwarenessData = {
  chartData: generateLast12Months(),
  wbSearchVolume: 18450,
  yandexWordstatVolume: 12300,
  interpretation: 'Узнаваемость бренда показывает стабильный рост на протяжении последних 12 месяцев. Поисковый объем в Wildberries увеличился на 23%, что указывает на растущий интерес к вашим товарам.',
  recommendation: 'Рекомендуем усилить маркетинговую активность и запустить дополнительные рекламные кампании для поддержания положительной динамики.'
}

export const sampleLooksEffectivenessData: LooksEffectivenessData = {
  totalLooks: 47,
  views: 125430,
  clicks: 8940,
  transitionsToMP: 2340,
  ctr: 7.12,
  cpa: 75,
  previousPeriod: {
    views: 98000,
    clicks: 6500,
    transitionsToMP: 1800,
    ctr: 6.63,
    cpa: 85
  }
}

export const sampleAudienceData: AudienceData = {
  heightDistribution: [
    { range: '150-160 см', count: 1250 },
    { range: '161-165 см', count: 3420 },
    { range: '166-170 см', count: 4890 },
    { range: '171-175 см', count: 3120 },
    { range: '176-180 см', count: 890 },
    { range: '180+ см', count: 430 }
  ],
  sizeDistribution: [
    { size: 'S', count: 3420 },
    { size: 'M', count: 4890 },
    { size: 'L', count: 3120 },
    { size: 'XL', count: 890 }
  ],
  colorTypeDistribution: [
    { colorType: 'Весна', count: 2840 },
    { colorType: 'Лето', count: 3420 },
    { colorType: 'Осень', count: 3120 },
    { colorType: 'Зима', count: 3120 }
  ],
  archetypeDistribution: [
    { archetype: 'Классик', count: 3420 },
    { archetype: 'Романтик', count: 2840 },
    { archetype: 'Драма', count: 2340 },
    { archetype: 'Натурал', count: 1890 },
    { archetype: 'Гамин', count: 1560 },
    { archetype: 'Элегант', count: 1250 }
  ],
  topProfiles: [
    {
      id: '1',
      description: 'Женщина 25-35 лет, рост 166-170 см, размер M, цветотип Лето, архетип Классик',
      characteristics: {
        height: '166-170 см',
        size: 'M',
        colorType: 'Лето',
        archetype: 'Классик'
      },
      percentage: 18.5
    },
    {
      id: '2',
      description: 'Женщина 30-40 лет, рост 161-165 см, размер S, цветотип Весна, архетип Романтик',
      characteristics: {
        height: '161-165 см',
        size: 'S',
        colorType: 'Весна',
        archetype: 'Романтик'
      },
      percentage: 15.2
    },
    {
      id: '3',
      description: 'Женщина 28-38 лет, рост 171-175 см, размер L, цветотип Осень, архетип Драма',
      characteristics: {
        height: '171-175 см',
        size: 'L',
        colorType: 'Осень',
        archetype: 'Драма'
      },
      percentage: 12.8
    }
  ]
}

