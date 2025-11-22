'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/translations'
import { InstagramMockup } from '@/components/InstagramMockup'
import { InteractiveGirl } from '@/components/InteractiveGirl'
import { extractUTMParams, saveUTMToStorage, buildTelegramAppLink } from '@/lib/utm'
import { UTMData } from '@/types/utm'
import { sendAnalyticsEvent, generateEventId } from '@/lib/analytics'
import { trackFacebookEvent } from '@/lib/facebook'

export default function LandingPage() {
  const t = useTranslations()
  const [utmData, setUtmData] = useState<UTMData>({})

  // Собираем UTM из URL при монтировании
  useEffect(() => {
    if (typeof window === 'undefined') return

    const search = window.location.search
    const utm = extractUTMParams(search)
    
    // Сохраняем в localStorage
    if (Object.keys(utm).length > 0) {
      saveUTMToStorage(utm)
    }
    
    setUtmData(utm)
  }, [])

  const handleCTAClick = () => {
    // Генерируем event_id для дедупликации Pixel + CAPI
    const eventId = generateEventId()
    
    // Отправляем событие ClickCTA в Facebook Pixel (клиент)
    trackFacebookEvent('ClickCTA', {
      ...utmData,
    }, eventId)
    
    // Отправляем событие ClickCTA в n8n webhook (сервер)
    sendAnalyticsEvent({
      event_name: 'ClickCTA',
      event_id: eventId,
      user_id: null, // На лендинге user_id еще нет
    }, utmData)
    
    // Формируем ссылку на Telegram mini app с UTM
    const telegramLink = buildTelegramAppLink(utmData)
    window.location.href = telegramLink
  }

  return (
    <div className="container landing-page">
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>
      
      <div className="brand-name">{t('common.brand')}</div>
      
      <div className="landing-hero">
        {/* 1. Заголовок */}
        <h1 className="landing-title">
          {t('landing.title')}
        </h1>
        
        {/* 2. Подзаголовок */}
        <p className="landing-subtitle">
          {t('landing.subtitle')}
        </p>

        {/* 3. Фото девушки с интерактивными аннотациями */}
        <InteractiveGirl />

        {/* 4. Преимущества */}
        <div className="landing-features">
          <div className="landing-feature-card">
            <div className="feature-icon-card">{t('landing.feature1.icon')}</div>
            <div className="feature-content">
              <div className="feature-title">{t('landing.feature1.title')}</div>
              <div className="feature-desc">{t('landing.feature1.desc')}</div>
            </div>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon-card">{t('landing.feature2.icon')}</div>
            <div className="feature-content">
              <div className="feature-title">{t('landing.feature2.title')}</div>
              <div className="feature-desc">{t('landing.feature2.desc')}</div>
            </div>
          </div>
          <div className="landing-feature-card">
            <div className="feature-icon-card">{t('landing.feature3.icon')}</div>
            <div className="feature-content">
              <div className="feature-title">{t('landing.feature3.title')}</div>
              <div className="feature-desc">{t('landing.feature3.desc')}</div>
            </div>
          </div>
        </div>

        {/* 5. Кнопка */}
        <button
          onClick={handleCTAClick}
          className="btn-primary btn-landing"
        >
          {t('landing.ctaButton')}
        </button>
      </div>

      {/* Instagram Mockup Section */}
      <InstagramMockup />
    </div>
  )
}
