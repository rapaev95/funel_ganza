'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { UnifiedQuiz } from '@/components/UnifiedQuiz'
import { Loader } from '@/components/Loader'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { trackFacebookEvent } from '@/lib/facebook'
import { sendAnalyticsEvent, generateEventId } from '@/lib/analytics'
import { getUTMForApp } from '@/lib/utm'
import { UTMData } from '@/types/utm'

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

type Screen = 'upload' | 'loader' | 'result'

export default function AppPage() {
  const t = useTranslations()
  const locale = useLocale()
  const [screen, setScreen] = useState<Screen>('upload')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [utmData, setUtmData] = useState<UTMData>({})
  const router = useRouter()

  useEffect(() => {
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand()
      window.Telegram.WebApp.ready()
    }

    // Получаем UTM из Telegram startapp или localStorage
    const utm = getUTMForApp()
    setUtmData(utm)

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

  // Отправляем событие ResultView при отображении результата
  useEffect(() => {
    if (screen === 'result' && analysisResult) {
      const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
      if (tgUser) {
        const season = analysisResult.season || 'Зима'
        const eventId = generateEventId()
        
        // Отправляем в Facebook Pixel (клиент)
        trackFacebookEvent('ResultView', {
          user_id: tgUser.id.toString(),
          color_type: season,
          ...utmData,
        }, eventId)
        
        // Отправляем в n8n webhook (сервер)
        sendAnalyticsEvent({
          event_name: 'ResultView',
          event_id: eventId,
          user_id: tgUser.id.toString(),
          custom_data: {
            color_type: season,
          },
        }, utmData)
      }
    }
  }, [screen, analysisResult, utmData])

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

      const formData = new FormData()
      
      // Добавляем оба фото (селфи + в полный рост)
      data.files.forEach((file, index) => {
        formData.append(`image_${index + 1}`, file)
      })
      formData.append('image_count', '2')

      // Добавляем ответы на вопросы
      formData.append('age', data.age)
      formData.append('gender', data.gender)
      formData.append('budget_preference', data.budgetPreference.toString())

      // Добавляем UTM данные
      formData.append('utm_data', JSON.stringify(utmData || {}))

      if (tgUser) {
        formData.append('user_id', tgUser.id.toString())
        formData.append('first_name', tgUser.first_name || '')
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()

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

      setAnalysisResult(result.data)
      setScreen('result')
    } catch (error) {
      console.error('Error analyzing photo:', error)
      alert(t('errors.analysisFailed'))
      setScreen('upload')
    }
  }

  const handleRetry = () => {
    setAnalysisResult(null)
    setScreen('upload')
  }

  const handleViewSeason = (season: string) => {
    router.push(`/season/${season.toLowerCase()}`)
  }

  if (screen === 'loader') {
    return <Loader />
  }

  if (screen === 'result' && analysisResult) {
    const season = analysisResult.season || 'Зима'
    const colors = analysisResult.colors || ['#2C3E50', '#E74C3C', '#8E44AD', '#27AE60']
    const description = analysisResult.description || 'Тебе идеально подойдут глубокие, насыщенные тона.'
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user

    return (
      <div className="container">
        <div className="glow-effect glow-top"></div>
        <div className="glow-effect glow-bottom"></div>
        <div className="screen">
          <LanguageSwitcher />
          <div className="brand-name">{t('common.brand')}</div>
          <h2>
            {t('result.yourColorType')} <span className="highlight">{season}</span>
          </h2>
          <p>{description}</p>

          <div className="color-palette">
            <div className="palette-title">{t('result.yourPalette')}</div>
            <div className="palette-colors">
              {colors.map((color: string, index: number) => (
                <div
                  key={index}
                  className="color-swatch"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <div className="outfit-preview">
            <div className="outfit-title">{t('result.yourIdealLook')}</div>
            <div className="outfit-card">
              <div className="outfit-silhouette">
                <div className="silhouette-head"></div>
                <div className="silhouette-body">
                  <div className="hoodie-overlay"></div>
                </div>
              </div>
              <div className="outfit-details">
                <div className="style-tag">{t('result.personalRecommendation')}</div>
              </div>
            </div>
          </div>

          {analysisResult.product_image && (
            <div className="product-card">
              <img
                src={analysisResult.product_image}
                alt="Recommended Hoodie"
              />
              <div className="product-info">
                <h3>{analysisResult.product_name || 'Ideal Hoodie'}</h3>
                <p>{analysisResult.price || '2 990 ₽'}</p>
              </div>
            </div>
          )}

          <a
            href={analysisResult.product_link || '#'}
            className="btn-primary"
            onClick={() => {
              // Генерируем event_id для дедупликации Pixel + CAPI
              const clickEventId = generateEventId()
              const purchaseEventId = generateEventId()
              
              // Отправляем событие ClickBuyHoodie с UTM (клиент)
              if (tgUser) {
                trackFacebookEvent('ClickBuyHoodie', {
                  user_id: tgUser.id.toString(),
                  product_name: analysisResult.product_name || 'Ideal Hoodie',
                  price: analysisResult.price || '2 990 ₽',
                  ...utmData,
                }, clickEventId)
                
                // Отправляем в n8n webhook (сервер)
                sendAnalyticsEvent({
                  event_name: 'ClickBuyHoodie',
                  event_id: clickEventId,
                  user_id: tgUser.id.toString(),
                  custom_data: {
                    product_name: analysisResult.product_name || 'Ideal Hoodie',
                    price: analysisResult.price || '2 990 ₽',
                  },
                }, utmData)
              }
              
              // Существующее событие Purchase (клиент)
              trackFacebookEvent('Purchase', {
                value: 2990,
                currency: 'RUB',
                ...utmData,
              }, purchaseEventId)
              
              // Отправляем в n8n webhook (сервер)
              if (tgUser) {
                sendAnalyticsEvent({
                  event_name: 'Purchase',
                  event_id: purchaseEventId,
                  user_id: tgUser.id.toString(),
                  custom_data: {
                    value: 2990,
                    currency: 'RUB',
                  },
                }, utmData)
              }
            }}
          >
            {t('result.buyNow')}
          </a>

          <button
            onClick={() => handleViewSeason(season)}
            className="btn-primary"
            style={{ marginTop: '12px' }}
          >
            {t('result.viewAllColors', { season })}
          </button>

          <button onClick={handleRetry} className="btn-secondary">
            {t('home.retryButton')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>
      <div className="screen">
        <LanguageSwitcher />
        <div className="brand-name">{t('common.brand')}</div>
        <h1>{t('home.title')}</h1>
        <p className="subtitle">
          {t('home.subtitle')}
        </p>

        <div className="benefits">
          <div className="benefit-item">
            <div className="benefit-icon">⚡</div>
            <div className="benefit-text">
              <strong>{t('home.benefit1Title')}</strong>
              <span>{t('home.benefit1Desc')}</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">🎨</div>
            <div className="benefit-text">
              <strong>{t('home.benefit2Title')}</strong>
              <span>{t('home.benefit2Desc')}</span>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">👗</div>
            <div className="benefit-text">
              <strong>{t('home.benefit3Title')}</strong>
              <span>{t('home.benefit3Desc')}</span>
            </div>
          </div>
        </div>

        <UnifiedQuiz onComplete={handleQuizComplete} />
      </div>
    </div>
  )
}


