'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LookGenerationPage } from '@/components/products/LookGenerationPage'
import { sampleProductsData, Product } from '@/lib/sample-products-data'
import { Look } from '@/types/look'

export default function GenerateLookPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (isLoading || hasRedirected) {
      return
    }

    if (!user) {
      setHasRedirected(true)
      router.push('/auth')
      return
    }

    const productId = params?.id
    if (!productId || typeof productId !== 'string') {
      setHasRedirected(true)
      router.push('/products')
      return
    }

    // Загружаем товар по ID
    const foundProduct = sampleProductsData.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setLoading(false)
    } else {
      // Товар не найден, редирект на страницу товаров
      setHasRedirected(true)
      router.push('/products')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, user?.id, isLoading, hasRedirected])

  const handleSaveLook = async (look: Omit<Look, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // TODO: Сохранить лук через API
      // Пока просто редиректим на страницу луков
      router.push('/looks')
    } catch (error) {
      console.error('Error saving look:', error)
    }
  }

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }}></div>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Загрузка...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!user || !product) {
    return null
  }

  return (
    <DashboardLayout>
      <LookGenerationPage 
        product={product}
        userId={String(user.id)}
        onSaveLook={handleSaveLook}
      />
    </DashboardLayout>
  )
}

