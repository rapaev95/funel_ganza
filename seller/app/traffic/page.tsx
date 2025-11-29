'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { GeoAvailabilityMap } from '@/components/traffic/GeoAvailabilityMap'
import { OrganicCard } from '@/components/traffic/OrganicCard'
import { AdvertisingCard } from '@/components/traffic/AdvertisingCard'
import { TestCard } from '@/components/traffic/TestCard'
import { sampleGeoAvailability, sampleAdvertisingCampaigns, sampleCTRTest } from '@/lib/sample-traffic-data'
import { sampleLooksData } from '@/lib/sample-looks-data'
import { AdvertisingCampaign, CTRTest } from '@/types/traffic'
import { Look } from '@/types/look'

export default function TrafficPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [campaigns, setCampaigns] = useState<AdvertisingCampaign[]>(sampleAdvertisingCampaigns)
  const [activeTest, setActiveTest] = useState<CTRTest | undefined>(sampleCTRTest)
  const [lastPostTime, setLastPostTime] = useState<string | undefined>(
    new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 часа назад
  )

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  const handleToggleCampaign = (lookId: string, enabled: boolean) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.lookId === lookId
          ? { ...campaign, enabled }
          : campaign
      )
    )
  }

  const handleCreateCampaign = () => {
    // TODO: Реализовать создание кампании
    console.log('Create campaign')
  }

  const handleCreatePost = () => {
    // TODO: Реализовать создание поста
    setLastPostTime(new Date().toISOString())
    console.log('Create post')
  }

  const handleCreateTest = (lookIds: string[]) => {
    // TODO: Реализовать создание теста
    const newTest: CTRTest = {
      id: Date.now().toString(),
      lookIds,
      status: 'running',
      metrics: {
        impressions: 0,
        clicks: 0,
        ctr: 0
      },
      createdAt: new Date().toISOString()
    }
    setActiveTest(newTest)
    console.log('Create test:', lookIds)
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
      <div className="dashboard-content" style={{
        background: 'var(--bg-primary)',
        minHeight: '100vh',
        padding: '24px'
      }}>
        {/* Заголовок */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Внешний трафик
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
            Управляйте органикой, рекламой и тестами в один клик
          </p>
        </div>

        {/* Карта доступности гео */}
        <GeoAvailabilityMap data={sampleGeoAvailability} />

        {/* Три карточки */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}
        >
          <OrganicCard
            lastPostTime={lastPostTime}
            onCreatePost={handleCreatePost}
          />
          <AdvertisingCard
            campaigns={campaigns}
            looks={sampleLooksData}
            onCreateCampaign={handleCreateCampaign}
            onToggleCampaign={handleToggleCampaign}
          />
          <TestCard
            looks={sampleLooksData}
            activeTest={activeTest}
            onCreateTest={handleCreateTest}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}


