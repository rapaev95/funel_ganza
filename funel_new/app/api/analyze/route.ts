import { NextRequest, NextResponse } from 'next/server'
import { createAnalysisSession } from '@/lib/analysis-storage'
import { randomUUID } from 'crypto'

/**
 * API Route для отправки изображений и данных квиза в n8n webhook
 * Принимает FormData с изображениями и метаданными, перенаправляет в n8n для AI анализа
 * Возвращает session_id сразу, не дожидаясь результата обработки
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем FormData из запроса
    const formData = await request.formData()

    // Генерируем уникальный session_id
    const sessionId = randomUUID()
    console.log(`Created session_id: ${sessionId}`)

    // Создаем сессию в storage
    createAnalysisSession(sessionId)

    // Webhook URL для загрузки изображений
    const webhookUrl = process.env.N8N_UPLOAD_WEBHOOK_URL || 
      'https://n8n-biqby-u59940.vm.elestio.app/webhook-test/upload-image'

    // Создаем новый FormData для отправки в n8n
    const n8nFormData = new FormData()

    // Добавляем session_id в данные для n8n
    n8nFormData.append('session_id', sessionId)

    // Логируем utm_data перед отправкой
    const utmDataValue = formData.get('utm_data')
    console.log('[API Debug] utm_data value:', utmDataValue)
    console.log('[API Debug] utm_data type:', typeof utmDataValue)

    // Копируем все поля из исходного FormData
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      if (value instanceof File) {
        n8nFormData.append(key, value, value.name)
      } else {
        n8nFormData.append(key, value.toString())
      }
    }

    // Логируем информацию перед отправкой
    console.log(`[n8n Webhook] Preparing to send data for session ${sessionId}`)
    console.log(`[n8n Webhook] URL: ${webhookUrl}`)
    console.log(`[n8n Webhook] FormData keys:`, Array.from(n8nFormData.keys()))

    // Отправляем данные в n8n webhook асинхронно (не ждем результат)
    // Используем более короткий таймаут, так как мы не ждем обработки
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error(`[n8n Webhook] Timeout for session ${sessionId} after 30 seconds`)
      controller.abort()
    }, 30000) // 30 секунд для загрузки

    // Отправляем в фоне, не блокируя ответ
    console.log(`[n8n Webhook] Sending request to n8n for session ${sessionId}`)
    fetch(webhookUrl, {
      method: 'POST',
      body: n8nFormData,
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(timeoutId)
        const responseText = await response.text().catch(() => 'Unable to read response')
        console.log(`[n8n Webhook] Response status for session ${sessionId}:`, response.status, response.statusText)
        console.log(`[n8n Webhook] Response body:`, responseText.substring(0, 200))
        
        if (!response.ok) {
          console.error(`[n8n Webhook] Error for session ${sessionId}:`, response.status, response.statusText, responseText)
        } else {
          console.log(`[n8n Webhook] Successfully sent data to n8n for session ${sessionId}`)
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        if (error.name !== 'AbortError') {
          console.error(`[n8n Webhook] Fetch error for session ${sessionId}:`, error.message, error.stack)
        } else {
          console.error(`[n8n Webhook] Request aborted (timeout) for session ${sessionId}`)
        }
      })

    // Возвращаем session_id сразу, не дожидаясь результата
    return NextResponse.json({
      success: true,
      session_id: sessionId,
      message: 'Data uploaded, processing started',
    })
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
