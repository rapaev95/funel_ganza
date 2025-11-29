'use client'

import { useState } from 'react'
import { Product } from '@/lib/sample-products-data'

interface WBProduct {
  nmId: number
  name: string
  price: number
  oldPrice?: number
  image?: string
  category?: string
  stock?: number
  sku?: string
}

interface WBImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (products: Omit<Product, 'id'>[]) => void
}

export function WBImportModal({ isOpen, onClose, onImport }: WBImportModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wbProducts, setWbProducts] = useState<WBProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())

  if (!isOpen) return null

  const handleFetchProducts = async () => {
    if (!apiKey.trim()) {
      setError('Введите API ключ Wildberries')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Имитация запроса к WB API
      // В реальности здесь будет запрос к /api/wb/products
      const response = await fetch('/api/wb/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка при получении товаров')
      }

      const data = await response.json()
      setWbProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить товары')
      // Для демо используем моковые данные
      setTimeout(() => {
        setWbProducts([
          {
            nmId: 12345678,
            name: 'Худи оверсайз серое',
            price: 2490,
            oldPrice: 3490,
            image: '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
            category: 'Худи',
            stock: 15,
            sku: 'WB-12345678',
          },
          {
            nmId: 12345679,
            name: 'Худи с капюшоном черное',
            price: 1890,
            image: '/product/hoodie/woman/image_2025-11-25_18-03-20.png',
            category: 'Худи',
            stock: 8,
            sku: 'WB-12345679',
          },
          {
            nmId: 12345680,
            name: 'Худи с принтом розовое',
            price: 3490,
            image: '/product/hoodie/woman/image_2025-11-25_18-03-51.png',
            category: 'Худи',
            stock: 5,
            sku: 'WB-12345680',
          },
        ])
        setIsLoading(false)
      }, 1000)
      return
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProduct = (nmId: number) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nmId)) {
        newSet.delete(nmId)
      } else {
        newSet.add(nmId)
      }
      return newSet
    })
  }

  const handleImport = () => {
    const productsToImport = wbProducts
      .filter(p => selectedProducts.has(p.nmId))
      .map(p => ({
        name: p.name,
        sku: p.sku || `WB-${p.nmId}`,
        price: p.price,
        oldPrice: p.oldPrice,
        image: p.image || '/product/hoodie/woman/image_2025-11-25_18-02-46.png',
        marketplace: 'WB' as const,
        status: 'active' as const,
        category: p.category || 'Худи',
        brand: 'Vibelook',
        stock: p.stock,
        views: 0,
        clicks: 0,
        lastSynced: new Date().toISOString(),
      }))

    if (productsToImport.length === 0) {
      setError('Выберите хотя бы один товар для импорта')
      return
    }

    onImport(productsToImport)
    onClose()
    // Сброс состояния
    setApiKey('')
    setWbProducts([])
    setSelectedProducts(new Set())
    setError(null)
  }

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="modal-content"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--card-radius)',
          padding: '32px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Импорт товаров с Wildberries
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Ввод API ключа */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            API ключ Wildberries *
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Введите ваш API ключ WB"
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'var(--glass-bg)',
                border: `1px solid ${error ? 'var(--error-color)' : 'var(--glass-border)'}`,
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
            <button
              onClick={handleFetchProducts}
              disabled={isLoading || !apiKey.trim()}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                opacity: isLoading || !apiKey.trim() ? 0.5 : 1,
                cursor: isLoading || !apiKey.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Загрузка...' : 'Загрузить товары'}
            </button>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)', 
            marginTop: '8px' 
          }}>
            API ключ можно получить в личном кабинете продавца Wildberries
          </div>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error-color)',
            borderRadius: 'var(--radius)',
            color: 'var(--error-color)',
            fontSize: '14px',
            marginBottom: '24px'
          }}>
            {error}
          </div>
        )}

        {/* Список товаров */}
        {wbProducts.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Найдено товаров: {wbProducts.length}
              </h3>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Выбрано: {selectedProducts.size}
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '8px'
            }}>
              {wbProducts.map((product) => (
                <div
                  key={product.nmId}
                  onClick={() => toggleProduct(product.nmId)}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    background: selectedProducts.has(product.nmId) 
                      ? 'rgba(121, 40, 202, 0.2)' 
                      : 'var(--glass-bg)',
                    border: `2px solid ${selectedProducts.has(product.nmId) ? '#7928CA' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.nmId)}
                    onChange={() => toggleProduct(product.nmId)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      marginTop: '2px'
                    }}
                  />
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius)',
                        background: 'var(--glass-bg)'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {product.name}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      fontSize: '14px',
                      color: 'var(--text-secondary)'
                    }}>
                      <div>Артикул: {product.sku || `WB-${product.nmId}`}</div>
                      <div>Цена: {product.price.toLocaleString('ru-RU')} ₽</div>
                      {product.oldPrice && (
                        <div style={{ textDecoration: 'line-through' }}>
                          {product.oldPrice.toLocaleString('ru-RU')} ₽
                        </div>
                      )}
                      {product.stock !== undefined && (
                        <div>Остаток: {product.stock} шт.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--btn-radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
          {wbProducts.length > 0 && (
            <button
              onClick={handleImport}
              disabled={selectedProducts.size === 0}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                opacity: selectedProducts.size === 0 ? 0.5 : 1,
                cursor: selectedProducts.size === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Импортировать ({selectedProducts.size})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


