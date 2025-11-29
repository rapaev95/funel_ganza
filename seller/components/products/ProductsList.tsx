'use client'

import { useState } from 'react'
import { Product } from '@/lib/sample-products-data'
import { ProductCard } from './ProductCard'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'

interface ProductsListProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  onView?: (product: Product) => void
}

export function ProductsList({ products, isLoading, onEdit, onDelete, onView }: ProductsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>('all')

  if (isLoading) {
    return (
      <Card>
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Нет товаров"
          description="Добавьте товары для начала работы"
        />
      </Card>
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter
    const matchesMarketplace = marketplaceFilter === 'all' || 
                              (marketplaceFilter === 'both' && product.marketplace === 'Both') ||
                              (marketplaceFilter === 'wb' && product.marketplace === 'WB') ||
                              (marketplaceFilter === 'ozon' && product.marketplace === 'Ozon')
    
    return matchesSearch && matchesStatus && matchesMarketplace
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    syncing: products.filter(p => p.status === 'syncing').length,
    error: products.filter(p => p.status === 'error').length,
  }

  return (
    <div>
      {/* Статистика */}
      <div className="products-stats" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Всего</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.total}</div>
        </div>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Активные</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>{stats.active}</div>
        </div>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Неактивные</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-secondary)' }}>{stats.inactive}</div>
        </div>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Синхронизация</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>{stats.syncing}</div>
        </div>
        <div className="stat-card" style={{ 
          padding: '16px', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--card-radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Ошибки</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>{stats.error}</div>
        </div>
      </div>

      {/* Фильтры */}
      <Card>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          flexWrap: 'wrap', 
          marginBottom: '24px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Поиск по названию или артикулу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: '1',
              minWidth: '200px',
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--glass-border)'
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="inactive">Неактивные</option>
            <option value="syncing">Синхронизация</option>
            <option value="error">Ошибки</option>
          </select>
          <select
            value={marketplaceFilter}
            onChange={(e) => setMarketplaceFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Все маркетплейсы</option>
            <option value="wb">Wildberries</option>
            <option value="ozon">Ozon</option>
            <option value="both">Оба</option>
          </select>
        </div>

        {/* Список товаров */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="Товары не найдены"
            description="Попробуйте изменить параметры поиска"
          />
        ) : (
          <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

