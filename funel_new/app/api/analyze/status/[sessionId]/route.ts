import { NextRequest } from 'next/server'
import { getAnalysisResult, createAnalysisSession } from '@/lib/analysis-storage'

/**
 * SSE endpoint для получения результатов анализа в реальном времени
 * Клиент подключается через EventSource и получает обновления
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = params.sessionId

  if (!sessionId) {
    return new Response('sessionId is required', { status: 400 })
  }

  // Создаем SSE stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      // Функция для отправки SSE события
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Отправляем начальное событие подключения
      sendEvent('connected', { session_id: sessionId })

      // Проверяем, есть ли уже результат
      let result = getAnalysisResult(sessionId)
      
      // Если сессии нет, создаем её
      if (!result) {
        createAnalysisSession(sessionId)
      }

      // Если результат уже есть, отправляем его сразу
      if (result && result.status !== 'processing') {
        sendEvent('result', {
          session_id: sessionId,
          status: result.status,
          result_url: result.result_url,
          error: result.error,
        })
        controller.close()
        return
      }

      // Polling: проверяем результат каждые 2 секунды
      const maxAttempts = 150 // 5 минут максимум (150 * 2 секунды)
      let attempts = 0

      const checkInterval = setInterval(() => {
        attempts++

        result = getAnalysisResult(sessionId)

        if (result && result.status !== 'processing') {
          // Результат готов
          sendEvent('result', {
            session_id: sessionId,
            status: result.status,
            result_url: result.result_url,
            error: result.error,
          })
          clearInterval(checkInterval)
          controller.close()
        } else if (attempts >= maxAttempts) {
          // Таймаут
          sendEvent('timeout', {
            session_id: sessionId,
            message: 'Analysis timeout',
          })
          clearInterval(checkInterval)
          controller.close()
        } else {
          // Все еще обрабатывается
          sendEvent('ping', {
            session_id: sessionId,
            status: 'processing',
            attempts,
          })
        }
      }, 2000) // Проверяем каждые 2 секунды

      // Обработка закрытия соединения
      request.signal.addEventListener('abort', () => {
        clearInterval(checkInterval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Отключаем буферизацию для nginx
    },
  })
}



