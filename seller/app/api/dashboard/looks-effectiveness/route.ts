import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { LooksEffectivenessData } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Получить seller_id из сессии/токена
    const sellerId = request.headers.get('x-seller-id') || '1'

    // Получаем текущий период (последние 30 дней)
    const currentPeriodStart = new Date()
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30)
    
    // Получаем предыдущий период (30-60 дней назад)
    const previousPeriodStart = new Date()
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 60)
    const previousPeriodEnd = new Date()
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 30)

    // Запросы к таблицам looks и look_analytics
    // TODO: Заменить на реальные запросы к Supabase после создания таблиц
    
    // Заглушка для разработки
    const response: LooksEffectivenessData = getMockLooksEffectivenessData()

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in looks-effectiveness API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getMockLooksEffectivenessData(): LooksEffectivenessData {
  return {
    totalLooks: 45,
    views: 12500,
    clicks: 890,
    transitionsToMP: 234,
    ctr: 7.12,
    cpa: 1250,
    previousPeriod: {
      views: 9800,
      clicks: 650,
      transitionsToMP: 180,
      ctr: 6.63,
      cpa: 1450
    }
  }
}

