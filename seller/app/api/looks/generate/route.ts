import { NextRequest, NextResponse } from 'next/server'
import { LookGenerationRequest, LookGenerationResult, GeneratedLook } from '@/types/look-generation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body: LookGenerationRequest = await request.json()

    // Валидация
    if (!body.productId || !body.sdxlSettings || !body.userId) {
      return NextResponse.json(
        { error: 'Недостаточно данных для генерации' },
        { status: 400 }
      )
    }

    if (!body.sdxlSettings.prompt.trim()) {
      return NextResponse.json(
        { error: 'Промпт обязателен для генерации' },
        { status: 400 }
      )
    }

    // Генерируем jobId
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Получаем URL n8n webhook из переменных окружения
    const n8nWebhookUrl = process.env.N8N_LOOKS_GENERATION_WEBHOOK_URL

    if (n8nWebhookUrl) {
      // Реальная интеграция с n8n
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            productId: body.productId,
            product: body.product,
            sdxlSettings: body.sdxlSettings,
            additionalProducts: body.additionalProducts,
            userId: body.userId,
          }),
        })

        if (!n8nResponse.ok) {
          throw new Error('Ошибка при вызове n8n webhook')
        }

        const n8nResult = await n8nResponse.json()

        // Если n8n возвращает jobId для отслеживания
        return NextResponse.json({
          jobId: n8nResult.jobId || jobId,
          status: n8nResult.status || 'pending',
        } as LookGenerationResult)
      } catch (error) {
        console.error('n8n webhook error:', error)
        // Fallback на заглушку при ошибке n8n
      }
    }

    // Заглушка для демо (имитация отправки в n8n)
    // В реальности n8n будет обрабатывать генерацию асинхронно
    // Здесь возвращаем jobId для отслеживания статуса

    return NextResponse.json({
      jobId,
      status: 'pending',
      message: 'Генерация запущена. Используйте jobId для проверки статуса.',
    } as LookGenerationResult)
  } catch (error) {
    console.error('Generation API error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// Endpoint для проверки статуса генерации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId обязателен' },
        { status: 400 }
      )
    }

    // В реальности здесь будет запрос к n8n или базе данных для проверки статуса
    // Для демо возвращаем моковые результаты

    // Имитация завершенной генерации через 3 секунды после создания job
    const jobTimestamp = parseInt(jobId.split('_')[1])
    const elapsed = Date.now() - jobTimestamp

    if (elapsed < 3000) {
      return NextResponse.json({
        jobId,
        status: 'processing',
      } as LookGenerationResult)
    }

    // Генерируем моковые результаты
    const mockResults: GeneratedLook[] = [
      {
        id: `look_${Date.now()}_1`,
        imageUrl: '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
        prompt: 'Casual streetwear look with hoodie',
        style: 'casual',
        colorSeason: 'bright_winter',
      },
      {
        id: `look_${Date.now()}_2`,
        imageUrl: '/product/hoodie/woman/image_2025-11-25_18-03-20.png',
        prompt: 'Casual streetwear look with hoodie',
        style: 'casual',
        colorSeason: 'bright_winter',
      },
      {
        id: `look_${Date.now()}_3`,
        imageUrl: '/product/hoodie/woman/image_2025-11-25_18-03-38.png',
        prompt: 'Casual streetwear look with hoodie',
        style: 'casual',
        colorSeason: 'bright_winter',
      },
    ]

    return NextResponse.json({
      jobId,
      status: 'completed',
      results: mockResults,
    } as LookGenerationResult)
  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
