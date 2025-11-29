import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { AudienceData, IdealProfile } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Получить seller_id из сессии/токена
    const sellerId = request.headers.get('x-seller-id') || '1'

    // Запросы к таблице user_analytics
    // TODO: Заменить на реальные запросы к Supabase после создания таблиц
    
    // Заглушка для разработки
    const response: AudienceData = getMockAudienceData()

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in audience API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getMockAudienceData(): AudienceData {
  return {
    heightDistribution: [
      { range: '150-160', count: 120 },
      { range: '160-170', count: 450 },
      { range: '170-180', count: 380 },
      { range: '180+', count: 50 }
    ],
    sizeDistribution: [
      { size: 'S', count: 250 },
      { size: 'M', count: 400 },
      { size: 'L', count: 300 },
      { size: 'XL', count: 50 }
    ],
    colorTypeDistribution: [
      { colorType: 'Весна', count: 200 },
      { colorType: 'Лето', count: 350 },
      { colorType: 'Осень', count: 300 },
      { colorType: 'Зима', count: 150 }
    ],
    archetypeDistribution: [
      { archetype: 'Романтик', count: 180 },
      { archetype: 'Классик', count: 320 },
      { archetype: 'Драма', count: 250 },
      { archetype: 'Натурал', count: 150 },
      { archetype: 'Гамин', count: 100 }
    ],
    topProfiles: [
      {
        id: '1',
        description: 'Женщина, 25-35 лет, рост 165-170 см',
        characteristics: {
          height: '165-170 см',
          size: 'M',
          colorType: 'Лето',
          archetype: 'Классик'
        },
        percentage: 28
      },
      {
        id: '2',
        description: 'Женщина, 20-30 лет, рост 160-165 см',
        characteristics: {
          height: '160-165 см',
          size: 'S',
          colorType: 'Весна',
          archetype: 'Романтик'
        },
        percentage: 22
      },
      {
        id: '3',
        description: 'Женщина, 30-40 лет, рост 170-175 см',
        characteristics: {
          height: '170-175 см',
          size: 'L',
          colorType: 'Осень',
          archetype: 'Драма'
        },
        percentage: 18
      }
    ]
  }
}

