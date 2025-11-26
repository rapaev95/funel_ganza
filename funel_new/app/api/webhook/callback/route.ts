import { NextRequest, NextResponse } from 'next/server'
import { saveAnalysisResult } from '@/lib/analysis-storage'

/**
 * API Route для приема результатов анализа от n8n
 * n8n отправляет сюда результат после обработки изображений
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Валидация входящих данных
    const { session_id, status, result_url, error } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    if (!status || !['completed', 'error'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be "completed" or "error"' },
        { status: 400 }
      )
    }

    // Опциональная проверка секретного ключа
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const providedSecret = request.headers.get('X-Webhook-Secret')
      if (providedSecret !== webhookSecret) {
        console.warn('Invalid webhook secret provided')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Сохраняем результат
    saveAnalysisResult(session_id, status, result_url, error)

    console.log(`Callback received for session: ${session_id}, status: ${status}`)

    return NextResponse.json({
      success: true,
      message: 'Result saved',
      session_id,
    })
  } catch (error) {
    console.error('Webhook callback error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}



