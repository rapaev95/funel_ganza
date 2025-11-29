'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/sample-products-data'
import { Look } from '@/types/look'
import { SDXLGenerationSettings as SDXLSettingsType, OtherSellerProduct, LookGenerationRequest } from '@/types/look-generation'
import { SDXLGenerationSettings } from './SDXLGenerationSettings'
import { OtherSellersProducts } from './OtherSellersProducts'
import { GenerationResults } from './GenerationResults'
import { Card } from '@/components/ui/Card'

interface LookGenerationPageProps {
  product: Product
  userId: string
  onSaveLook: (look: Omit<Look, 'id' | 'created_at' | 'updated_at'>) => void
}

export function LookGenerationPage({ product, userId, onSaveLook }: LookGenerationPageProps) {
  const router = useRouter()
  const [sdxlSettings, setSdxlSettings] = useState<SDXLSettingsType>({
    prompt: '',
    style: 'casual',
    colorSeason: 'bright_winter',
    numVariants: 3,
    imageSize: '1024x1024',
    guidanceScale: 7.5,
    steps: 30,
  })
  const [additionalProducts, setAdditionalProducts] = useState<OtherSellerProduct[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<{ jobId: string; status: string } | null>(null)

  const handleGenerate = async () => {
    if (!sdxlSettings.prompt.trim()) {
      alert('Пожалуйста, заполните промпт для генерации')
      return
    }

    setIsGenerating(true)
    setGenerationResult(null)

    try {
      const request: LookGenerationRequest = {
        productId: product.id,
        product,
        sdxlSettings,
        additionalProducts,
        userId,
      }

      const response = await fetch('/api/looks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('Ошибка при генерации лука')
      }

      const result = await response.json()
      setGenerationResult(result)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Произошла ошибка при генерации лука')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="dashboard-content">
      {/* Заголовок */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Назад к товарам
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Генерация лука для товара
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Настройте параметры генерации образа с использованием SDXL
        </p>
      </div>

      {/* Информация о товаре */}
      <Card>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '200px 1fr', 
          gap: '24px',
          padding: '24px'
        }}>
          <div style={{
            width: '200px',
            aspectRatio: '3/4',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
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
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Артикул: {product.sku}
            </p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
            {product.category && (
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Категория: {product.category}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Настройки SDXL */}
      <div style={{ marginTop: '32px' }}>
        <SDXLGenerationSettings
          settings={sdxlSettings}
          onChange={setSdxlSettings}
        />
      </div>

      {/* Товары других селлеров */}
      <div style={{ marginTop: '32px' }}>
        <OtherSellersProducts
          selectedProducts={additionalProducts}
          onAddProduct={(product) => {
            if (additionalProducts.length < 5) {
              setAdditionalProducts([...additionalProducts, product])
            } else {
              alert('Максимум 5 дополнительных товаров')
            }
          }}
          onRemoveProduct={(productId) => {
            setAdditionalProducts(additionalProducts.filter(p => p.id !== productId))
          }}
        />
      </div>

      {/* Кнопка генерации */}
      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !sdxlSettings.prompt.trim()}
          className="btn-primary"
          style={{
            padding: '16px 48px',
            fontSize: '16px',
            fontWeight: 600,
            opacity: isGenerating || !sdxlSettings.prompt.trim() ? 0.5 : 1,
            cursor: isGenerating || !sdxlSettings.prompt.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? 'Генерация...' : 'Сгенерировать лук'}
        </button>
      </div>

      {/* Результаты генерации */}
      {generationResult && (
        <div style={{ marginTop: '32px' }}>
          <GenerationResults
            jobId={generationResult.jobId}
            onSaveLook={onSaveLook}
            onRegenerate={handleGenerate}
          />
        </div>
      )}
    </div>
  )
}

