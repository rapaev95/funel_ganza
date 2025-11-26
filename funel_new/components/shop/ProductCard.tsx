'use client'

import { Product } from '@/lib/products'
import { formatPrice, convertPrice, Currency } from '@/lib/delivery'
import { HoodieSize } from '@/lib/size-calculator'

interface ProductCardProps {
  product: Product
  selectedSize: HoodieSize
  currency: Currency
  wbLink: string
  onBuyClick?: (product: Product) => void
}

export function ProductCard({ product, selectedSize, currency, wbLink, onBuyClick }: ProductCardProps) {
  // Конвертируем цены из рублей в нужную валюту
  const oldPriceConverted = convertPrice(product.price.old, currency)
  const newPriceConverted = convertPrice(product.price.new, currency)
  
  // Форматируем цены
  const oldPrice = formatPrice(oldPriceConverted, currency)
  const newPrice = formatPrice(newPriceConverted, currency)
  
  const discount = Math.round((1 - product.price.new / product.price.old) * 100)

  const handleBuyClick = () => {
    if (onBuyClick) {
      onBuyClick(product)
    } else {
      window.open(wbLink, '_blank')
    }
  }

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
        />
        {discount > 0 && (
          <div className="product-card-discount">-{discount}%</div>
        )}
      </div>

      <div className="product-card-content">
        <h4 className="product-card-name">{product.name}</h4>
        
        <div className="product-card-size">
          <span className="product-card-size-label">Тебе подойдет</span>
          <span className="product-card-size-value">{selectedSize}</span>
        </div>

        <div className="product-card-prices">
          <span className="product-card-price-old">{oldPrice}</span>
          <span className="product-card-price-new">{newPrice}</span>
        </div>

        <button 
          className="product-card-buy-btn"
          onClick={handleBuyClick}
        >
          Заказать на WB
        </button>
      </div>
    </div>
  )
}

