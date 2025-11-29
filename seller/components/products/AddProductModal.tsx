'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/sample-products-data'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (product: Omit<Product, 'id'>) => void
  editingProduct?: Product | null
  onUpdate?: (productId: string, product: Omit<Product, 'id'>) => void
}

export function AddProductModal({ isOpen, onClose, onAdd, editingProduct, onUpdate }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    oldPrice: '',
    image: '',
    marketplace: 'WB' as 'WB' | 'Ozon' | 'Both',
    status: 'active' as 'active' | 'inactive' | 'syncing' | 'error',
    category: 'Худи',
    brand: 'Vibelook',
    stock: '',
  })

  // Заполняем форму при редактировании
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        sku: editingProduct.sku,
        price: editingProduct.price.toString(),
        oldPrice: editingProduct.oldPrice?.toString() || '',
        image: editingProduct.image,
        marketplace: editingProduct.marketplace,
        status: editingProduct.status,
        category: editingProduct.category || 'Худи',
        brand: editingProduct.brand || 'Vibelook',
        stock: editingProduct.stock?.toString() || '',
      })
    } else {
      // Сброс формы при добавлении
      setFormData({
        name: '',
        sku: '',
        price: '',
        oldPrice: '',
        image: '',
        marketplace: 'WB',
        status: 'active',
        category: 'Худи',
        brand: 'Vibelook',
        stock: '',
      })
    }
  }, [editingProduct, isOpen])

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно'
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'Артикул обязателен'
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть больше 0'
    }
    if (formData.oldPrice && parseFloat(formData.oldPrice) <= parseFloat(formData.price)) {
      newErrors.oldPrice = 'Старая цена должна быть больше новой'
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Изображение обязательно'
    }
    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = 'Остаток не может быть отрицательным'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    const productData: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
      image: formData.image.trim(),
      marketplace: formData.marketplace,
      status: formData.status,
      category: formData.category,
      brand: formData.brand,
      stock: formData.stock ? parseInt(formData.stock) : undefined,
      views: editingProduct?.views || 0,
      clicks: editingProduct?.clicks || 0,
      lastSynced: new Date().toISOString(),
    }

    if (editingProduct && onUpdate) {
      onUpdate(editingProduct.id, productData)
    } else {
      onAdd(productData)
    }
    
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
          maxWidth: '600px',
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
            {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Название */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Название товара *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.name ? 'var(--error-color)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
                placeholder="Например: Худи оверсайз серое"
              />
              {errors.name && (
                <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Артикул и Цена */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Артикул *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.sku ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="WB-12345678"
                />
                {errors.sku && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.sku}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Цена, ₽ *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.price ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="2490"
                  min="0"
                  step="1"
                />
                {errors.price && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.price}
                  </div>
                )}
              </div>
            </div>

            {/* Старая цена и Остаток */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Старая цена, ₽
                </label>
                <input
                  type="number"
                  value={formData.oldPrice}
                  onChange={(e) => handleChange('oldPrice', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.oldPrice ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="3490"
                  min="0"
                  step="1"
                />
                {errors.oldPrice && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.oldPrice}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Остаток, шт
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.stock ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="15"
                  min="0"
                  step="1"
                />
                {errors.stock && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.stock}
                  </div>
                )}
              </div>
            </div>

            {/* Изображение */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Путь к изображению *
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: `1px solid ${errors.image ? 'var(--error-color)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
                placeholder="/product/hoodie/woman/image_2025-11-25_18-02-46.png"
              />
              {errors.image && (
                <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                  {errors.image}
                </div>
              )}
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginTop: '4px' 
              }}>
                Доступные изображения: /product/hoodie/woman/... или /product/hoodie/withoutpeople/...
              </div>
            </div>

            {/* Маркетплейс и Статус */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Маркетплейс
                </label>
                <select
                  value={formData.marketplace}
                  onChange={(e) => handleChange('marketplace', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="WB">Wildberries</option>
                  <option value="Ozon">Ozon</option>
                  <option value="Both">Оба</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Статус
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="active">Активен</option>
                  <option value="inactive">Неактивен</option>
                  <option value="syncing">Синхронизация</option>
                  <option value="error">Ошибка</option>
                </select>
              </div>
            </div>

            {/* Категория и Бренд */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Категория
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="Худи"
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Бренд
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                  placeholder="Vibelook"
                />
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '32px',
            justifyContent: 'flex-end'
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
            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '14px'
              }}
            >
              {editingProduct ? 'Сохранить изменения' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

