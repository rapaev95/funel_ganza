'use client'

import { useState } from 'react'
import { formatPrice, convertPrice, Currency } from '@/lib/delivery'

interface LookCardProps {
  image: string
  name: string
  price: number // цена в рублях
  currency: Currency
  items?: Array<{
    name: string
    price: number
  }>
  wbLink: string
}

export function LookCard({ image, name, price, currency, items, wbLink }: LookCardProps) {
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null)
  const convertedPrice = convertPrice(price, currency)
  const formattedPrice = formatPrice(convertedPrice, currency)

  const handleBuyClick = () => {
    window.open(wbLink, '_blank')
  }

  // Создаем аннотации для каждого элемента лука с точными позициями
  // Позиции настроены для изображения look/fa1993c397cea6055eb5c3e27b270ce1.jpg
  // Точки размещены точно над объектами на изображении
  const getAnnotationPosition = (itemName: string, index: number) => {
    const name = itemName.toLowerCase()
    // Точные позиции для каждого элемента лука
    if (name.includes('худи') || name.includes('hoodie')) {
      return { top: '28%', left: '48%' } // Худи - центр верхней части туловища
    } else if (name.includes('брюки') || name.includes('pants') || name.includes('trousers')) {
      return { top: '62%', left: '52%' } // Брюки - центр ног
    } else if (name.includes('кроссовки') || name.includes('sneakers') || name.includes('shoes')) {
      return { top: '88%', left: '52%' } // Кроссовки - внизу, над стопами
    } else if (name.includes('аксессуары') || name.includes('accessories') || name.includes('аксессуар')) {
      return { top: '38%', left: '72%' } // Аксессуары - справа (сумка/рюкзак)
    }
    // Дефолтная позиция на основе индекса
    const positions = [
      { top: '28%', left: '48%' },
      { top: '62%', left: '52%' },
      { top: '88%', left: '52%' },
      { top: '38%', left: '72%' },
    ]
    return positions[index] || { top: '50%', left: '50%' }
  }

  const annotations = items?.map((item, index) => ({
    id: index + 1,
    name: item.name,
    price: formatPrice(convertPrice(item.price, currency), currency),
    position: getAnnotationPosition(item.name, index)
  })) || []

  return (
    <div className="look-card">
      <div className="look-card-image-wrapper">
        <img
          src={image}
          alt={name}
          className="look-card-image"
        />
        
        {/* Интерактивные точки-аннотации */}
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`look-annotation-area ${activeAnnotation === annotation.id ? 'active' : ''}`}
            style={{
              top: annotation.position.top,
              left: annotation.position.left,
            }}
            onMouseEnter={() => setActiveAnnotation(annotation.id)}
            onMouseLeave={() => setActiveAnnotation(null)}
          >
            <div 
              className="look-annotation-dot"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            
            {activeAnnotation === annotation.id && (
              <div className="look-annotation-callout">
                <div className="look-annotation-content">
                  <div className="look-annotation-name">{annotation.name}</div>
                  <div className="look-annotation-price">{annotation.price}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="look-card-content">
        <h3 className="look-card-name">{name}</h3>
        
        {items && items.length > 0 && (
          <div className="look-card-items">
            {items.map((item, index) => (
              <div key={index} className="look-card-item">
                <span className="look-card-item-name">{item.name}</span>
                <span className="look-card-item-price">{formatPrice(convertPrice(item.price, currency), currency)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="look-card-total">
          <span className="look-card-total-label">Итого:</span>
          <span className="look-card-total-price">{formattedPrice}</span>
        </div>

        <button 
          className="look-card-buy-btn"
          onClick={handleBuyClick}
        >
          Заказать на WB
        </button>
      </div>
    </div>
  )
}

