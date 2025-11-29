'use client'

import { Product } from '@/lib/sample-products-data'
import { Badge } from '@/components/ui/Badge'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
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

export function ProductDetailModal({ product, isOpen, onClose, onEdit, onDelete }: ProductDetailModalProps) {
  if (!isOpen || !product) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Никогда'
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEdit = () => {
    onEdit?.(product)
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      onDelete?.(product.id)
      onClose()
    }
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
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '24px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {product.name}
              </h2>
              <Badge variant={statusColors[product.status]} size="sm">
                {statusLabels[product.status]}
              </Badge>
            </div>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Артикул: {product.sku}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
              marginLeft: '16px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '400px 1fr', 
          gap: '32px',
          marginBottom: '32px'
        }}>
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
                display: 'block'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-secondary); font-size: 14px; text-align: center; padding: 16px;">
                      Нет фото
                    </div>
                  `
                }
              }}
            />
            {product.oldPrice && (
              <Badge variant="error" size="sm" style={{
                position: 'absolute',
                top: '12px',
                left: '12px'
              }}>
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Информация */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Цены */}
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginBottom: '8px' 
              }}>
                Цена
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)' 
                }}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                {product.oldPrice && (
                  <span style={{ 
                    fontSize: '20px', 
                    color: 'var(--text-secondary)', 
                    textDecoration: 'line-through' 
                  }}>
                    {product.oldPrice.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>
            </div>

            {/* Основная информация */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '4px' 
                }}>
                  Маркетплейс
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}>
                  📦 {marketplaceLabels[product.marketplace]}
                </div>
              </div>

              {product.category && (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '4px' 
                  }}>
                    Категория
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}>
                    {product.category}
                  </div>
                </div>
              )}

              {product.brand && (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '4px' 
                  }}>
                    Бренд
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}>
                    {product.brand}
                  </div>
                </div>
              )}

              {product.stock !== undefined && (
                <div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '4px' 
                  }}>
                    Остаток
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    color: product.stock > 0 ? 'var(--success-color)' : 'var(--error-color)',
                    fontWeight: 600
                  }}>
                    {product.stock} шт.
                  </div>
                </div>
              )}
            </div>

            {/* Статистика */}
            {(product.views || product.clicks) && (
              <div style={{
                padding: '16px',
                background: 'var(--glass-bg)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Статистика
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  {product.views !== undefined && (
                    <div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)' 
                      }}>
                        Просмотры
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)' 
                      }}>
                        👁️ {product.views.toLocaleString('ru-RU')}
                      </div>
                    </div>
                  )}
                  {product.clicks !== undefined && (
                    <div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-secondary)' 
                      }}>
                        Клики
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)' 
                      }}>
                        🖱️ {product.clicks.toLocaleString('ru-RU')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Последняя синхронизация */}
            {product.lastSynced && (
              <div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-secondary)', 
                  marginBottom: '4px' 
                }}>
                  Последнее обновление
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-primary)' 
                }}>
                  {formatDate(product.lastSynced)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          paddingTop: '24px',
          borderTop: '1px solid var(--glass-border)',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleDelete}
            style={{
              padding: '12px 24px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--error-color)',
              borderRadius: 'var(--btn-radius)',
              color: 'var(--error-color)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Удалить
          </button>
          <button
            onClick={handleEdit}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px'
            }}
          >
            Редактировать
          </button>
        </div>
      </div>
    </div>
  )
}


