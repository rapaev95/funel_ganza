'use client'

import { useState, useEffect } from 'react'
import { UnifiedQuiz } from '@/components/UnifiedQuiz'
import { Loader } from '@/components/Loader'
import { trackFacebookEvent } from '@/lib/facebook'
import { sendAnalyticsEvent, generateEventId } from '@/lib/analytics'
import { getUTMForApp, extractUTMParams, saveUTMToStorage } from '@/lib/utm'
import { UTMData } from '@/types/utm'
import { compressImages } from '@/lib/image-compression'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
          start_param?: string
        }
        startParam?: string
        expand: () => void
        ready: () => void
      }
    }
  }
}

type Screen = 'upload' | 'loader'

export default function AppPage() {
  const [screen, setScreen] = useState<Screen>('upload')
  const [utmData, setUtmData] = useState<UTMData>({})

  useEffect(() => {
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.ready()
    }

    // Сначала проверяем URL параметры (если пользователь открывает /app напрямую с UTM)
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const urlUtm = extractUTMParams(search)

    // Определяем utm переменную для использования в этом useEffect
    let utm: UTMData = {}
    
    if (Object.keys(urlUtm).length > 0) {
      // Если есть UTM в URL, сохраняем их и используем
      saveUTMToStorage(urlUtm)
      utm = urlUtm
      setUtmData(urlUtm)
      console.log('[UTM Debug] UTM from URL:', urlUtm)
    } else {
      // Если нет в URL, получаем из Telegram/localStorage
      utm = getUTMForApp()
      console.log('[UTM Debug] UTM data loaded:', utm)
      console.log('[UTM Debug] UTM keys:', Object.keys(utm))
      setUtmData(utm)
    }

    // Отправляем событие StartQuiz при начале квиза
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
    if (tgUser) {
      const eventId = generateEventId()
      
      // Отправляем в Facebook Pixel (клиент)
      trackFacebookEvent('StartQuiz', {
        user_id: tgUser.id.toString(),
        ...utm,
      }, eventId)
      
      // Отправляем в n8n webhook (сервер)
      sendAnalyticsEvent({
        event_name: 'StartQuiz',
        event_id: eventId,
        user_id: tgUser.id.toString(),
      }, utm)
    }
  }, [])


  const handleQuizComplete = async (data: {
    files: File[]
    age: string
    gender: string
    budgetPreference: number
  }) => {
    setScreen('loader')

    try {
      // Get Telegram user data if available
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

      // Генерируем event_id для дедупликации Pixel + CAPI
      const eventId = generateEventId()
      
      // Track Facebook event with UTM (клиент)
      trackFacebookEvent('InitiateCheckout', {
        content_name: 'Color Analysis Started',
        ...utmData,
      }, eventId)
      
      // Отправляем в n8n webhook (сервер)
      if (tgUser) {
        sendAnalyticsEvent({
          event_name: 'InitiateCheckout',
          event_id: eventId,
          user_id: tgUser.id.toString(),
          custom_data: {
            content_name: 'Color Analysis Started',
          },
        }, utmData)
      }

      // Проверяем размер файлов перед отправкой
      const maxFileSize = 10 * 1024 * 1024 // 10MB
      for (const file of data.files) {
        if (file.size > maxFileSize) {
          alert(`Файл слишком большой (${(file.size / 1024 / 1024).toFixed(2)}MB). Максимальный размер: 10MB`)
          setScreen('upload')
          return
        }
      }

      // СЖИМАЕМ ИЗОБРАЖЕНИЯ ПЕРЕД ОТПРАВКОЙ
      console.log('Compressing images before upload...')
      const originalSizes = data.files.map(f => f.size)
      // Уменьшаем до 1280px и качество 70% для меньшего размера файла (достаточно для анализа цветотипа)
      const compressedFiles = await compressImages(data.files, 1280, 0.7) // Максимум 1280px, качество 70%
      const compressedSizes = compressedFiles.map(f => f.size)
      
      console.log('Image compression results:', {
        original: originalSizes.map(s => `${(s / 1024 / 1024).toFixed(2)}MB`),
        compressed: compressedSizes.map(s => `${(s / 1024 / 1024).toFixed(2)}MB`),
        reduction: originalSizes.map((original, i) => 
          `${((1 - compressedSizes[i] / original) * 100).toFixed(1)}%`
        ),
      })

      // Проверяем размер после сжатия
      const maxCompressedSize = 3 * 1024 * 1024 // 3MB максимум после сжатия
      for (let i = 0; i < compressedFiles.length; i++) {
        if (compressedFiles[i].size > maxCompressedSize) {
          console.warn(`File ${i + 1} still too large after compression: ${(compressedFiles[i].size / 1024 / 1024).toFixed(2)}MB`)
        }
      }

      // Создаем FormData для отправки на API
      const formData = new FormData()
      
      // Добавляем СЖАТЫЕ фото (селфи + в полный рост)
      compressedFiles.forEach((file, index) => {
        formData.append(`image_${index + 1}`, file)
      })
      formData.append('image_count', '2')

      // Добавляем ответы на вопросы
      formData.append('age', data.age)
      formData.append('gender', data.gender)
      formData.append('budget_preference', data.budgetPreference.toString())

      // Добавляем UTM данные
      const utmDataString = JSON.stringify(utmData || {})
      formData.append('utm_data', utmDataString)
      console.log('[UTM Debug] Sending utm_data:', utmDataString)
      console.log('[UTM Debug] Parsed utm_data:', JSON.parse(utmDataString))

      if (tgUser) {
        formData.append('user_id', tgUser.id.toString())
        formData.append('first_name', tgUser.first_name || '')
      }

      // Отправляем на API
      console.log('Sending data to /api/analyze', {
        filesCount: compressedFiles.length,
        originalSizes: data.files.map(f => `${(f.size / 1024 / 1024).toFixed(2)}MB`),
        compressedSizes: compressedFiles.map(f => `${(f.size / 1024 / 1024).toFixed(2)}MB`),
        age: data.age,
        gender: data.gender,
        budgetPreference: data.budgetPreference,
        utmData,
      })

      // Создаем AbortController для таймаута
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 120 секунд таймаут

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal, // Добавляем signal для отмены
      })

      clearTimeout(timeoutId)

      console.log('API response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API error response:', errorData)
        throw new Error(errorData.message || errorData.error || 'Analysis failed')
      }

      const result = await response.json()
      console.log('API success response:', result)

      // Проверяем, что получили session_id
      if (!result.session_id) {
        throw new Error('Session ID not received from server')
      }

      const sessionId = result.session_id
      console.log('Starting SSE connection for session:', sessionId)

      // Track PhotoUploaded event with UTM (клиент)
      if (tgUser) {
        const photoEventId = generateEventId()
        
        trackFacebookEvent('PhotoUploaded', {
          user_id: tgUser.id.toString(),
          ...utmData,
        }, photoEventId)
        
        // Отправляем в n8n webhook (сервер)
        sendAnalyticsEvent({
          event_name: 'PhotoUploaded',
          event_id: photoEventId,
          user_id: tgUser.id.toString(),
        }, utmData)
      }

      // Показываем экран загрузки
      setScreen('loader')

      // Создаем SSE подключение для получения результата
      const eventSource = new EventSource(`/api/analyze/status/${sessionId}`)
      const maxWaitTime = 5 * 60 * 1000 // 5 минут максимум
      const startTime = Date.now()

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('SSE message received:', data)

          if (data.status === 'completed' && data.result_url) {
            // Результат готов, перенаправляем
            eventSource.close()
            console.log('Redirecting to result URL:', data.result_url)
            window.location.href = data.result_url
          } else if (data.status === 'error') {
            // Ошибка обработки
            eventSource.close()
            alert(`Ошибка при обработке: ${data.error || 'Неизвестная ошибка'}`)
            setScreen('upload')
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      }

      eventSource.addEventListener('result', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)
          console.log('SSE result event:', data)

          if (data.status === 'completed' && data.result_url) {
            eventSource.close()
            console.log('Redirecting to result URL:', data.result_url)
            window.location.href = data.result_url
          } else if (data.status === 'error') {
            eventSource.close()
            alert(`Ошибка при обработке: ${data.error || 'Неизвестная ошибка'}`)
            setScreen('upload')
          }
        } catch (error) {
          console.error('Error parsing SSE result event:', error)
        }
      })

      eventSource.addEventListener('timeout', (event: MessageEvent) => {
        eventSource.close()
        alert('Время ожидания истекло. Результат анализа придет в Telegram.')
        setScreen('upload')
      })

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        
        // Проверяем таймаут
        if (Date.now() - startTime > maxWaitTime) {
          eventSource.close()
          alert('Время ожидания истекло. Результат анализа придет в Telegram.')
          setScreen('upload')
        }
      }

      // Таймаут на случай, если SSE не сработает
      setTimeout(() => {
        if (eventSource.readyState !== EventSource.CLOSED) {
          eventSource.close()
          alert('Время ожидания истекло. Результат анализа придет в Telegram.')
          setScreen('upload')
        }
      }, maxWaitTime)
    } catch (error) {
      console.error('Error analyzing photo:', error)
      
      let errorMessage = 'Неизвестная ошибка'
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Запрос превысил время ожидания. Проверьте интернет-соединение и попробуйте еще раз.'
        } else {
          errorMessage = error.message
        }
      }
      
      alert(`Ошибка при анализе фото: ${errorMessage}`)
      setScreen('upload')
    }
  }


  if (screen === 'loader') {
    return <Loader />
  }

  return (
    <div className="container">
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>
      <div className="screen">
        <div className="brand-name">VIBELOOK</div>
        <h1>Определи свой цветотип</h1>
        <p className="subtitle">
          Загрузи фото и получи персональную подборку цветов
        </p>

        <div className="benefits">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-text">
              <strong>Быстро</strong>
              <span>Анализ за 30 секунд</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🎨</div>
            <div className="benefit-text">
              <strong>Точно</strong>
              <span>AI-анализ твоих фото</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">👗</div>
            <div className="benefit-text">
              <strong>Персонально</strong>
              <span>Подборка только для тебя</span>
            </div>
          </div>
        </div>

        <UnifiedQuiz onComplete={handleQuizComplete} />
      </div>
    </div>
  )
}
