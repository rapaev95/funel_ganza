import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { BrandAwarenessData, ChartDataPoint } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Получить seller_id из сессии/токена
    // Пока используем заглушку
    const sellerId = request.headers.get('x-seller-id') || '1'

    // Получаем данные за последние 30 дней
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Запрос к таблице brand_awareness_metrics
    // TODO: Заменить на реальные запросы к Supabase после создания таблиц
    const { data: metrics, error } = await supabase
      .from('brand_awareness_metrics')
      .select('*')
      .eq('seller_id', sellerId)
      .gte('date', thirtyDaysAgo.toISOString())
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching brand awareness metrics:', error)
      // Возвращаем заглушку для разработки
      return NextResponse.json(getMockBrandAwarenessData())
    }

    if (!metrics || metrics.length === 0) {
      return NextResponse.json(getMockBrandAwarenessData())
    }

    // Формируем данные для графика
    const chartData: ChartDataPoint[] = metrics.map((metric: any) => ({
      date: metric.date,
      value: metric.search_volume || 0
    }))

    // Получаем последние метрики
    const latestMetric = metrics[metrics.length - 1]
    const wbSearchVolume = latestMetric?.wb_search_volume || 0
    const yandexWordstatVolume = latestMetric?.yandex_wordstat_volume || 0

    // Генерируем интерпретацию и рекомендации
    const interpretation = generateInterpretation(wbSearchVolume, yandexWordstatVolume)
    const recommendation = generateRecommendation(wbSearchVolume, yandexWordstatVolume)

    const response: BrandAwarenessData = {
      chartData,
      wbSearchVolume,
      yandexWordstatVolume,
      interpretation,
      recommendation
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in brand-awareness API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getMockBrandAwarenessData(): BrandAwarenessData {
  const chartData: ChartDataPoint[] = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    chartData.push({
      date: date.toISOString(),
      value: Math.floor(Math.random() * 1000) + 500
    })
  }

  return {
    chartData,
    wbSearchVolume: 1250,
    yandexWordstatVolume: 890,
    interpretation: 'Узнаваемость бренда находится на среднем уровне. За последний месяц наблюдается стабильный рост поисковых запросов.',
    recommendation: 'Рекомендуем запустить тестовую кампанию для увеличения узнаваемости бренда.'
  }
}

function generateInterpretation(wbVolume: number, yandexVolume: number): string {
  const total = wbVolume + yandexVolume
  if (total < 1000) {
    return 'Низкая узнаваемость бренда. Необходимо усилить маркетинговую активность.'
  } else if (total < 5000) {
    return 'Средняя узнаваемость бренда. Есть потенциал для роста.'
  } else {
    return 'Высокая узнаваемость бренда. Продолжайте поддерживать текущую активность.'
  }
}

function generateRecommendation(wbVolume: number, yandexVolume: number): string {
  const total = wbVolume + yandexVolume
  if (total < 1000) {
    return 'Запустите тестовую кампанию для увеличения узнаваемости.'
  } else if (total < 5000) {
    return 'Усильте постинг в социальных сетях и запустите рекламные кампании.'
  } else {
    return 'Поддерживайте текущую активность и оптимизируйте существующие кампании.'
  }
}

