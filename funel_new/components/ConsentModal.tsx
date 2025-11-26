'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConsentModalProps {
  isOpen: boolean
  onAccept: () => void
  onNoTelegram: () => void
  onClose?: () => void
}

export function ConsentModal({ isOpen, onAccept, onNoTelegram, onClose }: ConsentModalProps) {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)
  const [consentChecked, setConsentChecked] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Блокируем скролл body когда модальное окно открыто
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  if (!isOpen) return null

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  const handleDetailsPopupClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowDetailsPopup(false)
    }
  }

  const modalContent = (
    <>
      <div className="consent-modal-overlay" onClick={handleOverlayClick}>
        <div className="consent-modal" onClick={(e) => e.stopPropagation()}>
          <div className="consent-modal-content">
            <h2 className="consent-modal-title">Согласие на обработку данных</h2>
            
            <div className="consent-modal-text">
              <p className="consent-main-text">
                Необходимо ваше <strong>согласие</strong> на обработку персональных данных.
              </p>
              
              <div className="consent-operator-compact">
                <span className="consent-operator-label">ОПЕРАТОР:</span>{' '}
                <span className="consent-operator-name">GANZA COMERCIAL LTDA</span>
              </div>

              <label className="consent-agreement-checkbox">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="consent-checkbox-input"
                />
                <span className="consent-agreement-text">
                  Я согласен на обработку персональных данных и{' '}
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="consent-agreement-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <strong>принимаю условия Политики конфиденциальности</strong>
                  </a>
                </span>
              </label>

              <button
                type="button"
                onClick={() => setShowDetailsPopup(true)}
                className="consent-details-button"
              >
                Подробнее
              </button>
            </div>

            <div className="consent-modal-buttons">
              <button
                onClick={onAccept}
                className="btn-primary consent-btn-accept"
                disabled={!consentChecked}
              >
                Принять и продолжить
              </button>
              
              <button
                onClick={onNoTelegram}
                className="consent-btn-no-telegram"
              >
                У меня нет Telegram
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="consent-btn-decline"
                >
                  Отклонить
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up с детальной информацией */}
      {showDetailsPopup && (
        <div className="consent-details-popup-overlay" onClick={handleDetailsPopupClose}>
          <div className="consent-details-popup" onClick={(e) => e.stopPropagation()}>
            <div className="consent-details-popup-header">
              <h3 className="consent-details-popup-title">Детальная информация</h3>
              <button
                type="button"
                onClick={() => setShowDetailsPopup(false)}
                className="consent-details-popup-close"
              >
                ×
              </button>
            </div>
            
            <div className="consent-details-popup-content">
              <div className="consent-details-section">
                <strong>Обрабатываемые данные:</strong>
                <ul className="consent-list-compact">
                  <li>Изображения (фото для анализа)</li>
                  <li>Личная информация (возраст, пол, предпочтения)</li>
                  <li>Данные Telegram (ID, имя, username)</li>
                  <li>Технические данные (IP, устройство, браузер)</li>
                </ul>
              </div>
              
              <div className="consent-details-section">
                <strong>Цели:</strong> анализ цветотипа, персональные рекомендации, улучшение сервиса.
              </div>
              
              <div className="consent-details-section">
                <strong>Ваши права:</strong> отозвать согласие, получить информацию, исправлять или удалять данные. 
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="consent-link-inline">
                  Подробнее в Политике конфиденциальности
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  // Используем Portal для рендеринга модального окна вне основного контейнера
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

