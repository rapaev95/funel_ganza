'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ProgressCard } from '@/components/looks/ProgressCard'
import { ArchetypesChecklist } from '@/components/looks/ArchetypesChecklist'
import { UsageContextsChecklist } from '@/components/looks/UsageContextsChecklist'
import { ColorSeasonsChecklist } from '@/components/looks/ColorSeasonsChecklist'
import { LooksGrid } from '@/components/looks/LooksGrid'
import { GenerateLookButton } from '@/components/looks/GenerateLookButton'
import { GenerateLookModal } from '@/components/looks/GenerateLookModal'
import { sampleLooksData } from '@/lib/sample-looks-data'
import { Look, Archetype, UsageContext, ColorSeason } from '@/types/look'

export default function LooksPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [looks, setLooks] = useState<Look[]>(sampleLooksData)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [generatePreset, setGeneratePreset] = useState<{
    archetype?: Archetype
    context?: UsageContext
    colorSeason?: ColorSeason
  }>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  const handleGenerateLook = async (params: {
    style?: string
    archetype?: Archetype
    usageContexts: UsageContext[]
    colorSeason: ColorSeason
  }) => {
    // Имитация AI-генерации - создаем новый лук
    const newLook: Look = {
      id: Date.now().toString(),
      name: `Сгенерированный лук ${new Date().toLocaleDateString('ru-RU')}`,
      image: '/product/look/fa1993c397cea6055eb5c3e27b270ce1.jpg', // В реальности будет сгенерированное изображение
      style: (params.style as any) || 'casual',
      color_season: params.colorSeason,
      usage_contexts: params.usageContexts,
      archetype: params.archetype,
      description: 'AI-сгенерированный лук',
      metrics: {
        clicks: 0,
        ctr: 0,
        conversions: 0
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    setLooks(prev => [newLook, ...prev])
    setIsGenerateModalOpen(false)
    setGeneratePreset({})
  }

  const handleGenerateFromChecklist = (
    type: 'archetype' | 'context' | 'colorSeason',
    value: Archetype | UsageContext | ColorSeason
  ) => {
    if (type === 'archetype') {
      setGeneratePreset({ archetype: value as Archetype })
    } else if (type === 'context') {
      setGeneratePreset({ context: value as UsageContext })
    } else {
      setGeneratePreset({ colorSeason: value as ColorSeason })
    }
    setIsGenerateModalOpen(true)
  }

  const handleEditLook = (look: Look) => {
    // TODO: Реализовать редактирование
    console.log('Edit look:', look)
  }

  const handleDeleteLook = (lookId: string) => {
    setLooks(prev => prev.filter(l => l.id !== lookId))
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
        {/* Блок 1: Прогресс профиля */}
        <ProgressCard looks={looks} />

        {/* Блок 2: Архетипы */}
        <ArchetypesChecklist
          looks={looks}
          onGenerateLook={(archetype) => handleGenerateFromChecklist('archetype', archetype)}
        />

        {/* Блок 3: Контексты использования */}
        <UsageContextsChecklist
          looks={looks}
          onGenerateLook={(context) => handleGenerateFromChecklist('context', context)}
        />

        {/* Блок 4: Цветотипы */}
        <ColorSeasonsChecklist
          looks={looks}
          onGenerateLook={(season) => handleGenerateFromChecklist('colorSeason', season)}
        />

        {/* Блок 5: Сетка луков */}
        <div style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--card-radius)',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-md)',
          backdropFilter: 'blur(10px)'
        }}>
          <LooksGrid
            looks={looks}
            onEdit={handleEditLook}
            onDelete={handleDeleteLook}
          />
        </div>

        {/* Блок 6: Фиксированная CTA */}
        <GenerateLookButton
          onClick={() => {
            setGeneratePreset({})
            setIsGenerateModalOpen(true)
          }}
          fixed={true}
        />

        {/* Модальное окно генерации */}
        <GenerateLookModal
          isOpen={isGenerateModalOpen}
          onClose={() => {
            setIsGenerateModalOpen(false)
            setGeneratePreset({})
          }}
          onGenerate={handleGenerateLook}
          presetArchetype={generatePreset.archetype}
          presetContext={generatePreset.context}
          presetColorSeason={generatePreset.colorSeason}
        />
      </div>
    </DashboardLayout>
  )
}
