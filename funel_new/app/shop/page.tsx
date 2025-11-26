'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResultParams } from '@/types/result'
import { calculateSize } from '@/lib/size-calculator'
import { getDeliveryInfo, DeliveryInfo as DeliveryInfoType } from '@/lib/delivery'
import { getStreetwearProducts } from '@/lib/product-mapping'
import { BrandSearchAnimation } from '@/components/shop/BrandSearchAnimation'
import { CompatibilityMeter } from '@/components/shop/CompatibilityMeter'
import { DeliveryInfo } from '@/components/shop/DeliveryInfo'
import { ArchetypeExplanation } from '@/components/shop/ArchetypeExplanation'
import { StyleSelector } from '@/components/shop/StyleSelector'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { LookCard } from '@/components/shop/LookCard'
import { ARCHETYPE_LABELS } from '@/lib/dictionaries'
import { Product, getAllProducts } from '@/lib/products'

function ShopPageContent() {
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = useState(true)
  const [delivery, setDelivery] = useState<DeliveryInfoType | null>(null)
  const [params, setParams] = useState<ResultParams & { height?: string; weight?: string; name?: string } | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Загрузка параметров и данных
  useEffect(() => {
    // Парсим параметры из URL
    const parsedParams: ResultParams & { height?: string; weight?: string; name?: string } = {}
    
    const colorSeason = searchParams.get('color_season')
    const colorTemperature = searchParams.get('color_temperature')
    const contrastLevel = searchParams.get('contrast_level')
    const faceShape = searchParams.get('face_shape')
    const bodySilhouette = searchParams.get('body_silhouette')
    const hairColor = searchParams.get('hair_color')
    const archetype = searchParams.get('archetype')
    const gender = searchParams.get('gender')
    const age = searchParams.get('age')
    const height = searchParams.get('height')
    const weight = searchParams.get('weight')
    const name = searchParams.get('name')

    if (colorSeason) parsedParams.color_season = colorSeason as any
    if (colorTemperature) parsedParams.color_temperature = colorTemperature as any
    if (contrastLevel) parsedParams.contrast_level = contrastLevel as any
    if (faceShape) parsedParams.face_shape = faceShape as any
    if (bodySilhouette) parsedParams.body_silhouette = bodySilhouette as any
    if (hairColor) parsedParams.hair_color = hairColor as any
    if (archetype) parsedParams.archetype = archetype as any
    if (gender) parsedParams.gender = gender as any
    if (age) parsedParams.age = age as any
    if (height) parsedParams.height = height
    if (weight) parsedParams.weight = weight
    if (name) parsedParams.name = name

    setParams(parsedParams)

    // Рассчитываем размер
    if (height && weight) {
      const size = calculateSize(
        parseInt(height),
        parseInt(weight),
        undefined,
        gender as 'male' | 'female' | undefined
      )
      setSelectedSize(size)
    }

    // Загружаем информацию о доставке
    getDeliveryInfo().then(setDelivery)
  }, [searchParams])

  // Получаем товары
  // По умолчанию показываем все товары
  // Если есть все необходимые параметры, используем их для фильтрации
  const hasAllParams = params && 
    params.color_season && 
    params.color_temperature && 
    params.contrast_level && 
    params.hair_color

  const streetwearProducts: Product[] = hasAllParams && params
    ? getStreetwearProducts(
        params.color_season!,
        params.color_temperature!,
        params.contrast_level!,
        params.hair_color!
      )
    : getAllProducts() // По умолчанию показываем все товары


  // Инициализируем params как пустой объект, если его нет
  // Это позволяет показывать товары по умолчанию
  const displayParams = params || {}

  // Если нет delivery или selectedSize, используем значения по умолчанию
  const defaultDelivery: DeliveryInfoType = delivery || {
    region: 'Москва',
    country: 'Россия',
    deliveryDays: '5-8 дней',
    currency: 'RUB',
    isFree: true,
    wbLink: 'https://www.wildberries.ru/seller/86144#',
  }
  
  const defaultSize = selectedSize || 'M'

  return (
    <div className="container">
      <div className="shop-page">
        {isSearching ? (
          <BrandSearchAnimation 
            onComplete={() => {
              setIsSearching(false)
            }}
            duration={3000}
            archetype={displayParams.archetype ? ARCHETYPE_LABELS[displayParams.archetype] : undefined}
          />
        ) : (
          <>
            {/* Hero-секция */}
            <div className="shop-hero">
              <h1 className="shop-hero-title">
                {displayParams.name 
                  ? `${displayParams.name}, твоя персональная подборка готова`
                  : 'Твоя персональная подборка готова'
                }
              </h1>
            </div>

            {/* Селектор стилей */}
            <div className="shop-style-selector-section">
              <StyleSelector currentStyle="streetwear" />
            </div>

            {/* Пояснение по архетипу */}
            {displayParams.archetype && (
              <ArchetypeExplanation archetype={displayParams.archetype} />
            )}

            {/* Блок с луком в стиле журнала */}
            <div className="look-section">
              <h2 className="look-section-title">Готовый образ</h2>
              <LookCard
                image="/product/look/fa1993c397cea6055eb5c3e27b270ce1.jpg"
                name="Streetwear Look"
                price={32428}
                currency={defaultDelivery.currency}
                items={[
                  { name: 'Худи Streetwear', price: 5354 },
                  { name: 'Брюки', price: 8500 },
                  { name: 'Кроссовки', price: 12000 },
                  { name: 'Аксессуары', price: 6574 },
                ]}
                wbLink={defaultDelivery.wbLink}
              />
            </div>

            {/* Информация о доставке */}
            {defaultDelivery && (
              <div className="shop-delivery-section">
                <DeliveryInfo delivery={defaultDelivery} />
              </div>
            )}

            {/* Первая подборка - Streetwear худи */}
            {streetwearProducts.length > 0 && (
              <ProductGrid
                products={streetwearProducts}
                selectedSize={defaultSize as any}
                currency={defaultDelivery.currency}
                wbLink={defaultDelivery.wbLink}
                title="Худи в стиле Streetwear"
                description={hasAllParams && displayParams.archetype
                  ? "Подобрано специально для вашего архетипа"
                  : "Популярные товары"}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="shop-page">
          <div className="shop-loading">
            <div className="shop-loading-spinner"></div>
          </div>
        </div>
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  )
}

