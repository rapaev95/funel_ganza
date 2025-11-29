'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { OtherSellerProduct } from '@/types/look-generation'

interface OtherSellersProductsProps {
  selectedProducts: OtherSellerProduct[]
  onAddProduct: (product: OtherSellerProduct) => void
  onRemoveProduct: (productId: string) => void
}

// Моковые данные товаров других селлеров
const mockOtherSellersProducts: OtherSellerProduct[] = [
  {
    id: 'other-1',
    name: 'Джинсы классические',
    image: '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
    price: 1990,
    category: 'Джинсы',
    sellerId: 'seller-2',
    sellerName: 'Fashion Store'
  },
  {
    id: 'other-2',
    name: 'Кроссовки белые',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-20.png',
    price: 3490,
    category: 'Обувь',
    sellerId: 'seller-3',
    sellerName: 'Shoe Shop'
  },
  {
    id: 'other-3',
    name: 'Куртка джинсовая',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-38.png',
    price: 4290,
    category: 'Верхняя одежда',
    sellerId: 'seller-4',
    sellerName: 'Outerwear Co'
  },
  {
    id: 'other-4',
    name: 'Сумка кожаная',
    image: '/product/hoodie/woman/image_2025-11-25_18-03-51.png',
    price: 2490,
    category: 'Аксессуары',
    sellerId: 'seller-5',
    sellerName: 'Accessories Plus'
  },
  {
    id: 'other-5',
    name: 'Ремень кожаный',
    image: '/product/hoodie/woman/image_2025-11-25_18-04-24.png',
    price: 890,
    category: 'Аксессуары',
    sellerId: 'seller-5',
    sellerName: 'Accessories Plus'
  },
]

export function OtherSellersProducts({ 
  selectedProducts, 
  onAddProduct, 
  onRemoveProduct 
}: OtherSellersProductsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showProducts, setShowProducts] = useState(false)

  const filteredProducts = mockOtherSellersProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const isNotSelected = !selectedProducts.find(p => p.id === product.id)
    return matchesSearch && isNotSelected
  })

  return (
    <Card title="Товары других селлеров (опционально)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Выбранные товары */}
        {selectedProducts.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: 'var(--text-primary)'
            }}>
              Выбранные товары ({selectedProducts.length}/5)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    padding: '12px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius)',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'var(--error-color)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                  <div style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    marginBottom: '8px',
                    background: 'var(--glass-bg)'
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                  {product.sellerName && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {product.sellerName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Поиск и добавление */}
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Поиск товаров других селлеров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowProducts(true)}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="btn-secondary"
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              {showProducts ? 'Скрыть' : 'Показать'} товары
            </button>
          </div>

          {showProducts && (
            <div>
              {filteredProducts.length === 0 ? (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  {searchQuery ? 'Товары не найдены' : 'Все товары уже добавлены'}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '8px'
                }}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (selectedProducts.length < 5) {
                          onAddProduct(product)
                          setSearchQuery('')
                        } else {
                          alert('Максимум 5 дополнительных товаров')
                        }
                      }}
                      style={{
                        padding: '12px',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary-color)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)'
                      }}
                    >
                      <div style={{
                        width: '100%',
                        aspectRatio: '3/4',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        marginBottom: '8px',
                        background: 'var(--glass-bg)'
                      }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>
                        {product.price.toLocaleString('ru-RU')} ₽
                      </div>
                      {product.sellerName && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {product.sellerName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ 
          fontSize: '12px', 
          color: 'var(--text-secondary)',
          padding: '12px',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius)'
        }}>
          💡 Добавьте товары других селлеров, чтобы создать полноценный образ. Максимум 5 товаров.
        </div>
      </div>
    </Card>
  )
}


