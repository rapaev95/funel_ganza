'use client'

import { useState } from 'react'
import { DeliveryInfo as DeliveryInfoType } from '@/lib/delivery'

interface DeliveryInfoProps {
  delivery: DeliveryInfoType
}

export function DeliveryInfo({ delivery }: DeliveryInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="delivery-info">
      <button 
        className="delivery-info-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="delivery-info-title">Условия покупки в {delivery.region}</h3>
        <span className={`delivery-info-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="delivery-info-items">
          <div className="delivery-info-item">
            <div className="delivery-info-icon">🚚</div>
            <div className="delivery-info-content">
              <div className="delivery-info-label">
                Доставка в {delivery.region} {delivery.deliveryDays}
              </div>
              <div className="delivery-info-value highlight">Бесплатно!</div>
            </div>
          </div>

          <div className="delivery-info-item">
            <div className="delivery-info-icon">↩️</div>
            <div className="delivery-info-content">
              <div className="delivery-info-label">Возврат товара</div>
              <div className="delivery-info-value">В течение 14 дней</div>
            </div>
          </div>

          <div className="delivery-info-item">
            <div className="delivery-info-icon">💰</div>
            <div className="delivery-info-content">
              <div className="delivery-info-label">Скидка при регистрации на ВБ</div>
              <div className="delivery-info-value highlight">До 30%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

