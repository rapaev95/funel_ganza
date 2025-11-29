'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProductsList } from '@/components/products/ProductsList'
import { AddProductModal } from '@/components/products/AddProductModal'
import { WBImportModal } from '@/components/products/WBImportModal'
import { ProductDetailModal } from '@/components/products/ProductDetailModal'
import { sampleProductsData, Product } from '@/lib/sample-products-data'

export default function ProductsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>(sampleProductsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWBImportOpen, setIsWBImportOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(), // Простой способ генерации ID
    }
    setProducts(prev => [newProduct, ...prev])
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleUpdateProduct = (productId: string, productData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...productData, id: productId }
        : p
    ))
    setEditingProduct(null)
  }

  const handleWBImport = (importedProducts: Omit<Product, 'id'>[]) => {
    const newProducts = importedProducts.map(p => ({
      ...p,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }))
    setProducts(prev => [...newProducts, ...prev])
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
  }

  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }}></div>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Загрузка...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
              Мои товары
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
              Управление товарами и их синхронизация с маркетплейсами
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '12px 24px', fontSize: '14px' }}
              onClick={() => setIsWBImportOpen(true)}
            >
              📦 Импорт с WB
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '12px 24px', fontSize: '14px' }}
              onClick={() => {
                setEditingProduct(null)
                setIsModalOpen(true)
              }}
            >
              + Добавить товар
            </button>
          </div>
        </div>

        <ProductsList 
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onView={setViewingProduct}
        />

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProduct(null)
          }}
          onAdd={handleAddProduct}
          editingProduct={editingProduct}
          onUpdate={handleUpdateProduct}
        />

        <WBImportModal
          isOpen={isWBImportOpen}
          onClose={() => setIsWBImportOpen(false)}
          onImport={handleWBImport}
        />

        <ProductDetailModal
          product={viewingProduct}
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </DashboardLayout>
  )
}

