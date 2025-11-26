'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { InstagramMockup } from '@/components/InstagramMockup'
import { InteractiveGirl } from '@/components/InteractiveGirl'
import { ConsentModal } from '@/components/ConsentModal'
import { DownloadNotification } from '@/components/DownloadNotification'
import { extractUTMParams, saveUTMToStorage } from '@/lib/utm'
import { UTMData } from '@/types/utm'
import { sendAnalyticsEvent, generateEventId } from '@/lib/analytics'
import { trackFacebookEvent } from '@/lib/facebook'

export default function LandingPage() {
  const router = useRouter()
  const [utmData, setUtmData] = useState<UTMData>({})
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showDownloadNotification, setShowDownloadNotification] = useState(false)

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

  const handleCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Показываем модальное окно согласия
    setShowConsentModal(true)
  }

  const handleConsentAccept = () => {
    // Закрываем модальное окно
    setShowConsentModal(false)
    
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
    
    // Проверяем, есть ли Telegram WebApp
    const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp
    
    // UTM уже сохранены в localStorage, используем чистую ссылку без параметров
    const telegramLink = 'https://t.me/vibelook_bot/quiz'
    
    if (isTelegram) {
      // Если в Telegram Web App, используем Telegram API для открытия ссылки
      const webApp = window.Telegram?.WebApp as any
      if (webApp?.openLink) {
        webApp.openLink(telegramLink)
      } else {
        // Fallback: просто переходим на /app (UTM уже в localStorage)
        router.push('/app')
      }
    } else {
      // Если не в Telegram, открываем Telegram ссылку
      window.location.href = telegramLink
    }
  }

  const handleNoTelegram = () => {
    // Закрываем модальное окно согласия
    setShowConsentModal(false)
    // Показываем уведомление о скачивании Telegram
    setShowDownloadNotification(true)
  }

  return (
    <div className="container landing-page">
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>
      <div className="screen">
        <div className="brand-name">VIBELOOK</div>
        
        <div className="landing-hero">
          {/* 1. Заголовок */}
          <h1 className="landing-title">
            Твой AI-стилист подберёт лук под твой цветотип.
          </h1>
          
          {/* 2. Подзаголовок */}
          <p className="landing-subtitle">
            Загрузи 2-3 фото и получи персональную подбор за 30 секунд
          </p>

          {/* 3. Фото девушки с интерактивными аннотациями */}
          <InteractiveGirl />

          {/* 4. Преимущества */}
          <div className="landing-features">
            <div className="landing-feature-card">
              <div className="feature-icon-card">🎨</div>
              <div className="feature-content">
                <div className="feature-title">Цветотип</div>
                <div className="feature-desc">получи свою палитру</div>
              </div>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon-card">🧩</div>
              <div className="feature-content">
                <div className="feature-title">Архетип</div>
                <div className="feature-desc">узнай свой стиль-код</div>
              </div>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon-card">🧍‍♀️</div>
              <div className="feature-content">
                <div className="feature-title">Силуэт</div>
                <div className="feature-desc">что реально идёт твоему телу</div>
              </div>
            </div>
          </div>

          {/* 5. Кнопка */}
          <button
            onClick={handleCTAClick}
            className="btn-primary btn-landing"
          >
            Подобрать луки
          </button>
        </div>

        {/* Instagram Mockup Section */}
        <InstagramMockup />
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-company">
            <h3 className="landing-footer-title">GANZA COMERCIAL LTDA</h3>
            <p className="landing-footer-cnpj">
              <strong>CNPJ:</strong> 45.659.520/0001-49
            </p>
            <p className="landing-footer-address">
              <strong>Юридический адрес:</strong> Rua Cantor Waldemar Roberto, 425, Jardim Marcia, Campos do Jordão, Сан-Паулу, Бразилия
            </p>
          </div>
          <div className="landing-footer-links">
            <a href="/privacy-policy" className="landing-footer-link">
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </footer>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onNoTelegram={handleNoTelegram}
        onClose={() => setShowConsentModal(false)}
      />

      {/* Download Notification */}
      <DownloadNotification
        isOpen={showDownloadNotification}
        onClose={() => setShowDownloadNotification(false)}
      />
    </div>
  )
}
