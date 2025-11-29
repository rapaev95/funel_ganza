'use client'

import { Look } from '@/types/look'
import { ToggleSwitch } from './ToggleSwitch'
import { LOOK_STYLE_LABELS } from '@/lib/look-dictionaries'

interface LookToggleCardProps {
  look: Look
  enabled: boolean
  geo: string[]
  bid: number
  onToggle: (lookId: string, enabled: boolean) => void
}

const GEO_SHORT_NAMES: Record<string, string> = {
  'Казахстан': 'КАЗ',
  'Беларусь': 'РБ',
  'Армения': 'ARM',
  'Узбекистан': 'УЗБ',
  'Киргизия': 'КГ',
  'Грузия': 'ГР',
  'Сербия': 'СРБ',
  'Россия': 'РФ'
}

export function LookToggleCard({ look, enabled, geo, bid, onToggle }: LookToggleCardProps) {
  const geoShort = geo.map(g => GEO_SHORT_NAMES[g] || g).join(' / ')

  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius)',
        alignItems: 'center'
      }}
    >
      {/* Мини-фото */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          background: 'var(--glass-bg)',
          flexShrink: 0
        }}
      >
        <img
          src={look.image}
          alt={look.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); color: var(--text-secondary); font-size: 10px; text-align: center; padding: 8px;">
                  Нет фото
                </div>
              `
            }
          }}
        />
      </div>

      {/* Информация о луке */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <h4
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0
          }}
        >
          {look.name}
        </h4>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            alignItems: 'center',
            fontSize: '12px'
          }}
        >
          <span
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            Стиль: {LOOK_STYLE_LABELS[look.style] || look.style}
          </span>
          <span
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            •
          </span>
          <span
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            Гео: {geoShort}
          </span>
          <span
            style={{
              color: 'var(--text-secondary)'
            }}
          >
            •
          </span>
          <span
            style={{
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          >
            Ставка: {bid.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      {/* Переключатель */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ToggleSwitch
          enabled={enabled}
          onChange={(newEnabled) => onToggle(look.id, newEnabled)}
        />
      </div>
    </div>
  )
}


