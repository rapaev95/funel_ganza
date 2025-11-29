'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LookToggleCard } from './LookToggleCard'
import { Look } from '@/types/look'
import { AdvertisingCampaign } from '@/types/traffic'

interface AdvertisingCardProps {
  campaigns: AdvertisingCampaign[]
  looks: Look[]
  onCreateCampaign?: () => void
  onToggleCampaign?: (lookId: string, enabled: boolean) => void
}

export function AdvertisingCard({
  campaigns,
  looks,
  onCreateCampaign,
  onToggleCampaign
}: AdvertisingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const activeCampaigns = campaigns.filter(c => c.enabled).length
  const averageCTR = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.metrics?.ctr || 0), 0) / campaigns.length
    : 0

  // Создаем карточки для всех луков, объединяя с данными кампаний
  const lookCampaigns = looks.map(look => {
    const campaign = campaigns.find(c => c.lookId === look.id)
    return {
      look,
      campaign: campaign || {
        id: '',
        lookId: look.id,
        lookName: look.name,
        lookImage: look.image,
        style: look.style,
        geo: ['Казахстан', 'Беларусь'],
        bid: 5000,
        enabled: false
      }
    }
  })

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--card-radius)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backdropFilter: 'blur(10px)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Заголовок карточки */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: isExpanded ? '20px' : '0'
        }}
      >
        <div
          style={{
            fontSize: '32px',
            lineHeight: 1
          }}
        >
          💸
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}
          >
            Рекламная кампания
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              lineHeight: 1.5
            }}
          >
            Запускаем рекламу из ваших луков. Оплата через баланс
          </p>
          {!isExpanded && (
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation()
                onCreateCampaign?.()
              }}
              style={{
                marginTop: '8px'
              }}
            >
              ▶ Создать кампанию
            </Button>
          )}
        </div>
      </div>

      {/* Развернутое содержимое */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '20px',
            marginTop: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              marginBottom: '20px'
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}
            >
              Управление рекламой по лукам:
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {lookCampaigns.length > 0 ? (
                lookCampaigns.map(({ look, campaign }) => (
                  <LookToggleCard
                    key={look.id}
                    look={look}
                    enabled={campaign.enabled}
                    geo={campaign.geo}
                    bid={campaign.bid}
                    onToggle={(lookId, enabled) => {
                      onToggleCampaign?.(lookId, enabled)
                    }}
                  />
                ))
              ) : (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '14px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius)',
                    border: '1px dashed var(--glass-border)'
                  }}
                >
                  Нет доступных луков для рекламы
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={(e) => {
              e.stopPropagation()
              onCreateCampaign?.()
            }}
            style={{
              width: '100%'
            }}
          >
            ▶ Создать кампанию
          </Button>
        </div>
      )}

      {/* Статус */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        Активные кампании: {activeCampaigns}, Средний CTR: {(averageCTR * 100).toFixed(1)}%
      </div>
    </div>
  )
}


