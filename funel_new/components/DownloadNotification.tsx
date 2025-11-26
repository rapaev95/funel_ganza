'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DownloadNotificationProps {
  isOpen: boolean
  onClose: () => void
}

export function DownloadNotification({ isOpen, onClose }: DownloadNotificationProps) {
  useEffect(() => {
    if (isOpen) {
      // Автоматически закрываем через 10 секунд
      const timer = setTimeout(() => {
        onClose()
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleAppStoreClick = () => {
    window.open('https://apps.apple.com/app/telegram/id686449807', '_blank')
  }

  const handleGooglePlayClick = () => {
    window.open('https://play.google.com/store/apps/details?id=org.telegram.messenger', '_blank')
  }

  const notificationContent = (
    <div className="download-notification-overlay" onClick={onClose}>
      <div className="download-notification" onClick={(e) => e.stopPropagation()}>
        <button className="download-notification-close" onClick={onClose}>
          ×
        </button>
        
        <div className="download-notification-content">
          <h3 className="download-notification-title">Скачайте Telegram</h3>
          <p className="download-notification-text">
            Для использования приложения необходимо установить Telegram
          </p>
          
          <div className="download-notification-buttons">
            <button
              onClick={handleAppStoreClick}
              className="download-btn download-btn-appstore"
            >
              <span className="download-btn-icon">📱</span>
              <span>App Store</span>
            </button>
            
            <button
              onClick={handleGooglePlayClick}
              className="download-btn download-btn-googleplay"
            >
              <span className="download-btn-icon">📱</span>
              <span>Google Play</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Используем Portal для рендеринга уведомления вне основного контейнера
  if (typeof window !== 'undefined') {
    return createPortal(notificationContent, document.body)
  }

  return null
}

