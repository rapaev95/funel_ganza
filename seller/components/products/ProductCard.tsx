'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/sample-products-data'
import { Badge } from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  onView?: (product: Product) => void
}

const statusLabels: Record<Product['status'], string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  syncing: 'Синхронизация',
  error: 'Ошибка'
}

const statusColors: Record<Product['status'], 'success' | 'default' | 'warning' | 'error'> = {
  active: 'success',
  inactive: 'default',
  syncing: 'warning',
  error: 'error'
}

const marketplaceLabels: Record<Product['marketplace'], string> = {
  WB: 'Wildberries',
  Ozon: 'Ozon',
  Both: 'WB + Ozon'
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Никогда'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const handleCardClick = () => {
    // Перенаправляем на страницу генерации лука
    router.push(`/products/${product.id}/generate`)
  }

  return (
    <div 
      className="product-card-item" 
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--card-radius)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      {/* Изображение */}
      <div style={{ 
        width: '100%', 
        aspectRatio: '3/4', 
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        background: 'var(--glass-bg)',
        position: 'relative'
      }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            backgroundColor: 'var(--glass-bg)'
          }}
          loading="lazy"
          onError={(e) => {
            console.error('Failed to load image:', product.image, 'Full path:', window.location.origin + product.image)
            // Fallback если изображение не загрузилось
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-secondary); font-size: 12px; text-align: center; padding: 16px;">
                  Нет фото
                </div>
              `
            }
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', product.image)
          }}
        />
        {product.oldPrice && (
          <Badge variant="error" size="sm" style={{
            position: 'absolute',
            top: '8px',
            left: '8px'
          }}>
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </Badge>
        )}
        <Badge variant={statusColors[product.status]} size="sm" style={{
          position: 'absolute',
          top: '8px',
          right: '8px'
        }}>
          {statusLabels[product.status]}
        </Badge>
      </div>

      {/* Информация */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: '1.4',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </h3>

        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>Артикул: {product.sku}</div>
          {product.category && <div>Категория: {product.category}</div>}
        </div>

        {/* Цена */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          {product.oldPrice && (
            <span style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              textDecoration: 'line-through' 
            }}>
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Маркетплейс */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '6px 10px',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius)',
          fontSize: '12px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>📦</span>
          <span style={{ color: 'var(--text-primary)' }}>{marketplaceLabels[product.marketplace]}</span>
        </div>

        {/* Статистика */}
        {(product.views || product.clicks) && (
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            fontSize: '11px', 
            color: 'var(--text-secondary)',
            paddingTop: '8px',
            borderTop: '1px solid var(--glass-border)'
          }}>
            {product.views && (
              <div>👁️ {product.views.toLocaleString('ru-RU')}</div>
            )}
            {product.clicks && (
              <div>🖱️ {product.clicks.toLocaleString('ru-RU')}</div>
            )}
            {product.stock !== undefined && (
              <div>📦 {product.stock} шт.</div>
            )}
          </div>
        )}

        {/* Последняя синхронизация */}
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
          Обновлено: {formatDate(product.lastSynced)}
        </div>
      </div>

      {/* Действия */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginTop: '8px',
        paddingTop: '12px',
        borderTop: '1px solid var(--glass-border)',
        position: 'relative'
      }}>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(product)
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Редактировать
        </button>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            style={{
              padding: '8px 12px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ⋮
          </button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              bottom: '100%',
              marginBottom: '8px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 10,
              minWidth: '150px',
              overflow: 'hidden'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Вы уверены, что хотите удалить этот товар?')) {
                    onDelete?.(product.id)
                  }
                  setShowMenu(false)
                }}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--error-color)',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

