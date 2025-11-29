'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { LookGenerationResult, GeneratedLook } from '@/types/look-generation'
import { Look } from '@/types/look'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface GenerationResultsProps {
  jobId: string
  onSaveLook: (look: Omit<Look, 'id' | 'created_at' | 'updated_at'>) => void
  onRegenerate: () => void
}

export function GenerationResults({ jobId, onSaveLook, onRegenerate }: GenerationResultsProps) {
  const router = useRouter()
  const [result, setResult] = useState<LookGenerationResult | null>(null)
  const [selectedLook, setSelectedLook] = useState<GeneratedLook | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/looks/generate?jobId=${jobId}`)
        if (!response.ok) {
          throw new Error('Ошибка при проверке статуса')
        }

        const data: LookGenerationResult = await response.json()
        setResult(data)

        if (data.status === 'completed' || data.status === 'failed') {
          setIsPolling(false)
        }
      } catch (error) {
        console.error('Polling error:', error)
        setResult({
          jobId,
          status: 'failed',
          error: 'Ошибка при проверке статуса генерации',
        })
        setIsPolling(false)
      }
    }

    // Первая проверка сразу
    pollStatus()

    // Polling каждые 2 секунды, если статус pending или processing
    const interval = setInterval(() => {
      if (isPolling && (result?.status === 'pending' || result?.status === 'processing')) {
        pollStatus()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, isPolling, result?.status])

  const handleSaveLook = () => {
    if (!selectedLook) {
      alert('Выберите вариант лука для сохранения')
      return
    }

    const look: Omit<Look, 'id' | 'created_at' | 'updated_at'> = {
      name: `Сгенерированный лук ${new Date().toLocaleDateString('ru-RU')}`,
      image: selectedLook.imageUrl,
      style: selectedLook.style,
      color_season: selectedLook.colorSeason,
      usage_contexts: [],
      description: selectedLook.prompt,
    }

    onSaveLook(look)
  }

  if (!result) {
    return (
      <Card>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Проверка статуса генерации...
          </p>
        </div>
      </Card>
    )
  }

  if (result.status === 'pending' || result.status === 'processing') {
    return (
      <Card>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
            Генерация лука в процессе... Пожалуйста, подождите.
          </p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Job ID: {jobId}
          </p>
        </div>
      </Card>
    )
  }

  if (result.status === 'failed') {
    return (
      <Card>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Ошибка генерации
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {result.error || 'Произошла ошибка при генерации лука'}
          </p>
          <button
            onClick={onRegenerate}
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            Попробовать снова
          </button>
        </div>
      </Card>
    )
  }

  if (result.status === 'completed' && result.results) {
    return (
      <Card title="Результаты генерации">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Список сгенерированных луков */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {result.results.map((look) => (
              <div
                key={look.id}
                onClick={() => setSelectedLook(look)}
                style={{
                  padding: '16px',
                  background: selectedLook?.id === look.id 
                    ? 'rgba(121, 40, 202, 0.2)' 
                    : 'var(--glass-bg)',
                  border: `2px solid ${selectedLook?.id === look.id ? '#7928CA' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  marginBottom: '12px',
                  background: 'var(--glass-bg)'
                }}>
                  <img
                    src={look.imageUrl}
                    alt="Generated look"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                {selectedLook?.id === look.id && (
                  <div style={{
                    textAlign: 'center',
                    color: 'var(--primary-color)',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    ✓ Выбрано
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Действия */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            paddingTop: '24px',
            borderTop: '1px solid var(--glass-border)'
          }}>
            <button
              onClick={onRegenerate}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Регенерировать
            </button>
            <button
              onClick={handleSaveLook}
              disabled={!selectedLook}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                opacity: !selectedLook ? 0.5 : 1,
                cursor: !selectedLook ? 'not-allowed' : 'pointer'
              }}
            >
              Сохранить выбранный лук
            </button>
          </div>
        </div>
      </Card>
    )
  }

  return null
}

