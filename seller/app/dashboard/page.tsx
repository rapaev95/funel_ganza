'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { BrandAwarenessBlock } from '@/components/dashboard/BrandAwarenessBlock'
import { LooksEffectivenessBlock } from '@/components/dashboard/LooksEffectivenessBlock'
import { AudienceBlock } from '@/components/dashboard/AudienceBlock'
import { 
  sampleBrandAwarenessData, 
  sampleLooksEffectivenessData, 
  sampleAudienceData 
} from '@/lib/sample-data'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

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
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Добро пожаловать, {user.first_name}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Обзор вашей статистики и аналитики
          </p>
        </div>

        <div className="dashboard-grid">
          <BrandAwarenessBlock data={sampleBrandAwarenessData} />
          <LooksEffectivenessBlock data={sampleLooksEffectivenessData} />
          <AudienceBlock data={sampleAudienceData} />
        </div>
      </div>
    </DashboardLayout>
  )
}
