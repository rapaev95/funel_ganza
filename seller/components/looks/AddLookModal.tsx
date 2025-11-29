'use client'

import { useState, useEffect } from 'react'
import { Look, LookStyle, ColorSeason, UsageContext, Archetype } from '@/types/look'
import { LOOK_STYLE_LABELS, COLOR_SEASON_LABELS, LOOK_STYLE_ICONS, USAGE_CONTEXT_LABELS, ARCHETYPE_LABELS } from '@/lib/look-dictionaries'

interface AddLookModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (look: Omit<Look, 'id' | 'created_at' | 'updated_at'>) => void
  onUpdate?: (look: Look) => void
  editingLook?: Look | null
}

export function AddLookModal({ 
  isOpen, 
  onClose, 
  onAdd, 
  onUpdate,
  editingLook 
}: AddLookModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    style: 'casual' as LookStyle,
    color_season: 'bright_winter' as ColorSeason,
    usage_contexts: [] as UsageContext[],
    archetype: undefined as Archetype | undefined,
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Заполняем форму при редактировании
  useEffect(() => {
    if (editingLook) {
      setFormData({
        name: editingLook.name,
        image: editingLook.image,
        style: editingLook.style,
        color_season: editingLook.color_season,
        usage_contexts: editingLook.usage_contexts || [],
        archetype: editingLook.archetype,
        description: editingLook.description || '',
      })
      setImagePreview(editingLook.image)
    } else {
      // Сброс формы при открытии для нового лука
      setFormData({
        name: '',
        image: '',
        style: 'casual',
        color_season: 'bright_winter',
        usage_contexts: [],
        archetype: undefined,
        description: '',
      })
      setImagePreview(null)
      setErrors({})
    }
  }, [editingLook, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно'
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Изображение обязательно'
    }
    if (!formData.style) {
      newErrors.style = 'Стиль обязателен'
    }
    if (!formData.color_season) {
      newErrors.color_season = 'Цветотип обязателен'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    if (editingLook && onUpdate) {
      // Обновление существующего лука
      const updatedLook: Look = {
        ...editingLook,
        ...formData,
        updated_at: new Date().toISOString(),
      }
      onUpdate(updatedLook)
    } else {
      // Создание нового лука
      const newLook: Omit<Look, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.name,
        image: formData.image,
        style: formData.style,
        color_season: formData.color_season,
        usage_contexts: formData.usage_contexts,
        archetype: formData.archetype,
        description: formData.description,
      }
      onAdd(newLook)
    }
    
    // Сброс формы
    setFormData({
      name: '',
      image: '',
      style: 'casual',
      color_season: 'bright_winter',
      usage_contexts: [],
      archetype: undefined,
      description: '',
    })
    setImagePreview(null)
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Обновляем превью при изменении URL изображения
    if (field === 'image') {
      setImagePreview(value || null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Для демо просто используем имя файла как путь
      // В реальном приложении здесь будет загрузка на сервер
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        // Используем временный путь или data URL
        handleChange('image', result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        handleChange('image', result)
      }
      reader.readAsDataURL(file)
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
          maxWidth: '700px',
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
            {editingLook ? 'Редактировать лук' : 'Добавить лук'}
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
                Название лука *
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
                placeholder="Например: Casual Streetwear Look"
              />
              {errors.name && (
                <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Загрузка изображения */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Изображение *
              </label>
              
              {/* Превью изображения */}
              {imagePreview && (
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  background: 'var(--glass-bg)',
                  position: 'relative'
                }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}

              {/* Зона загрузки */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '24px',
                  textAlign: 'center',
                  background: isDragging ? 'rgba(255, 0, 128, 0.05)' : 'var(--glass-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {isDragging ? 'Отпустите для загрузки' : 'Перетащите изображение сюда или нажмите для выбора'}
                </div>
              </div>

              {/* Или URL */}
              <div style={{ marginTop: '12px' }}>
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
                  placeholder="/product/look/image.jpg или URL"
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
                  Укажите путь к изображению или URL
                </div>
              </div>
            </div>

            {/* Стиль и Цветотип */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Стиль *
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => handleChange('style', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.style ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {(Object.keys(LOOK_STYLE_LABELS) as LookStyle[]).map((style) => (
                    <option key={style} value={style}>
                      {LOOK_STYLE_ICONS[style]} {LOOK_STYLE_LABELS[style]}
                    </option>
                  ))}
                </select>
                {errors.style && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.style}
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
                  Цветотип *
                </label>
                <select
                  value={formData.color_season}
                  onChange={(e) => handleChange('color_season', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--glass-bg)',
                    border: `1px solid ${errors.color_season ? 'var(--error-color)' : 'var(--glass-border)'}`,
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {(Object.keys(COLOR_SEASON_LABELS) as ColorSeason[]).map((season) => (
                    <option key={season} value={season}>
                      {COLOR_SEASON_LABELS[season]}
                    </option>
                  ))}
                </select>
                {errors.color_season && (
                  <div style={{ color: 'var(--error-color)', fontSize: '12px', marginTop: '4px' }}>
                    {errors.color_season}
                  </div>
                )}
              </div>
            </div>

            {/* Контексты использования */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Контексты использования
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {(['work', 'home', 'sport', 'evening', 'casual', 'beach', 'street'] as UsageContext[]).map((context) => (
                  <button
                    key={context}
                    type="button"
                    onClick={() => {
                      const newContexts = formData.usage_contexts.includes(context)
                        ? formData.usage_contexts.filter(c => c !== context)
                        : [...formData.usage_contexts, context]
                      setFormData(prev => ({ ...prev, usage_contexts: newContexts }))
                    }}
                    style={{
                      padding: '8px 16px',
                      background: formData.usage_contexts.includes(context) ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                      color: formData.usage_contexts.includes(context) ? 'white' : 'var(--text-primary)',
                      border: `1px solid ${formData.usage_contexts.includes(context) ? 'transparent' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {USAGE_CONTEXT_LABELS[context]}
                  </button>
                ))}
              </div>
            </div>

            {/* Архетип */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Архетип (опционально)
              </label>
              <select
                value={formData.archetype || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, archetype: e.target.value as Archetype || undefined }))}
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
                <option value="">Не выбран</option>
                {(Object.keys(ARCHETYPE_LABELS) as Archetype[]).map((archetype) => (
                  <option key={archetype} value={archetype}>
                    {ARCHETYPE_LABELS[archetype]}
                  </option>
                ))}
              </select>
            </div>

            {/* Описание */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Описание лука (необязательно)"
              />
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
              {editingLook ? 'Сохранить изменения' : 'Добавить лук'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

