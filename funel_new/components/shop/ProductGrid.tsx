'use client'

import { Product, COLOR_NAMES } from '@/lib/products'
import { HoodieSize } from '@/lib/size-calculator'
import { Currency } from '@/lib/delivery'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  selectedSize: HoodieSize
  currency: Currency
  wbLink: string
  title?: string
  description?: string
}

export function ProductGrid({ 
  products, 
  selectedSize, 
  currency,
  wbLink,
  title,
  description 
}: ProductGridProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="product-grid-section">
      {title && <h3 className="product-grid-title">{title}</h3>}
      {description && <p className="product-grid-description">{description}</p>}
      
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selectedSize={selectedSize}
            currency={currency}
            wbLink={wbLink}
          />
        ))}
      </div>
    </div>
  )
}

