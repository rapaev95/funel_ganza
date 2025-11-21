import { NextRequest, NextResponse } from 'next/server'
import { UTMData } from '@/types/utm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Получаем webhook URL из переменных окружения
    const n8nWebhookUrl = process.env.N8N_CAPI_WEBHOOK_URL || 'https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events'

    // Валидация данных
    if (!body.event_name) {
      return NextResponse.json(
        { error: 'event_name is required' },
        { status: 400 }
      )
    }
    
    if (!body.event_id) {
      return NextResponse.json(
        { error: 'event_id is required' },
        { status: 400 }
      )
    }

    // Формируем данные для отправки в n8n
    const eventData = {
      event_name: body.event_name,
      event_id: body.event_id, // Обязательное поле для дедупликации Pixel + CAPI
      event_time: body.event_time || new Date().toISOString(),
      user_id: body.user_id || null,
      // UTM данные
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_content: body.utm_content || null,
      utm_term: body.utm_term || null,
      fbclid: body.fbclid || null,
      // Дополнительные данные события (раскладываются в корень)
      ...body.custom_data,
      // Метаданные (сервер может нормализовать или использовать как есть)
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('user-agent') || null,
      ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || null,
    }

    // Отправляем в n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('Error sending to n8n:', errorText)
      // Не возвращаем ошибку клиенту, чтобы не ломать основной flow
      return NextResponse.json({
        success: false,
        message: 'Failed to send event to analytics',
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Event sent successfully',
    })
  } catch (error) {
    console.error('Error in analytics route:', error)
    
    const isDev = process.env.NODE_ENV === 'development'
    
    // Не возвращаем ошибку клиенту, чтобы не ломать основной flow
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      // Детали ошибки только в development
      ...(isDev && {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        details: error instanceof Error ? error.toString() : String(error),
      })
    }, { status: 500 })
  }
}

