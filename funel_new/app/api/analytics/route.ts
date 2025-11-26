import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route для отправки аналитики в n8n webhook (Facebook Conversion API)
 * Принимает события от клиента и перенаправляет их в n8n для отправки в Facebook CAPI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Webhook URL для аналитики (CAPI events)
    const webhookUrl = process.env.N8N_ANALYTICS_WEBHOOK_URL || 
      'https://n8n-biqby-u59940.vm.elestio.app/webhook/capi-events'

    // Отправляем данные в n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n webhook error:', errorText)
      return NextResponse.json(
        { error: 'Failed to send analytics event', details: errorText },
        { status: response.status }
      )
    }

    const result = await response.json().catch(() => ({ success: true }))

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
