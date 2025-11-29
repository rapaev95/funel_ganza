'use client'

import { useState } from 'react'
import { LookStyle, UsageContext, ColorSeason, Archetype } from '@/types/look'
import { LOOK_STYLE_LABELS, USAGE_CONTEXT_LABELS, COLOR_SEASON_LABELS, ARCHETYPE_LABELS } from '@/lib/look-dictionaries'

interface GenerateLookModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (params: {
    style?: LookStyle
    archetype?: Archetype
    usageContexts: UsageContext[]
    colorSeason: ColorSeason
  }) => void
  presetStyle?: LookStyle
  presetArchetype?: Archetype
  presetContext?: UsageContext
  presetColorSeason?: ColorSeason
}

export function GenerateLookModal({
  isOpen,
  onClose,
  onGenerate,
  presetStyle,
  presetArchetype,
  presetContext,
  presetColorSeason
}: GenerateLookModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<LookStyle | undefined>(presetStyle)
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | undefined>(presetArchetype)
  const [selectedContexts, setSelectedContexts] = useState<UsageContext[]>(presetContext ? [presetContext] : [])
  const [selectedColorSeason, setSelectedColorSeason] = useState<ColorSeason>(presetColorSeason || 'bright_winter')
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleContextToggle = (context: UsageContext) => {
    setSelectedContexts(prev =>
      prev.includes(context)
        ? prev.filter(c => c !== context)
        : [...prev, context]
    )
  }

  const handleGenerate = async () => {
    if (selectedContexts.length === 0) {
      alert('Выберите хотя бы один контекст использования')
      return
    }

    setIsGenerating(true)
    
    // Имитация AI-генерации
    setTimeout(() => {
      onGenerate({
        style: selectedStyle,
        archetype: selectedArchetype,
        usageContexts: selectedContexts,
        colorSeason: selectedColorSeason
      })
      setIsGenerating(false)
      onClose()
    }, 2000)
  }

  const usageContexts: UsageContext[] = ['work', 'home', 'sport', 'evening', 'casual', 'beach', 'street']

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--card-radius)',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Сгенерировать новый лук
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {isGenerating ? (
          <div style={{
            padding: '40px',
            textAlign: 'center'
          }}>
            <div className="spinner" style={{
              margin: '0 auto',
              width: '32px',
              height: '32px',
              border: '3px solid var(--glass-border)',
              borderTopColor: 'var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }}></div>
            <p style={{
              marginTop: '16px',
              color: 'var(--text-secondary)',
              fontSize: '14px'
            }}>
              AI генерирует лук...
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Архетип (опционально) */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Архетип (опционально)
              </label>
              <select
                value={selectedArchetype || ''}
                onChange={(e) => setSelectedArchetype(e.target.value as Archetype || undefined)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Не выбран</option>
                {(Object.keys(ARCHETYPE_LABELS) as Archetype[]).map((archetype) => (
                  <option key={archetype} value={archetype}>
                    {ARCHETYPE_LABELS[archetype]}
                  </option>
                ))}
              </select>
            </div>

            {/* Контексты использования */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Контексты использования *
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {usageContexts.map((context) => (
                  <button
                    key={context}
                    type="button"
                    onClick={() => handleContextToggle(context)}
                    style={{
                      padding: '8px 16px',
                      background: selectedContexts.includes(context) ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                      color: selectedContexts.includes(context) ? 'white' : 'var(--text-primary)',
                      border: `1px solid ${selectedContexts.includes(context) ? 'transparent' : 'var(--glass-border)'}`,
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {USAGE_CONTEXT_LABELS[context]}
                  </button>
                ))}
              </div>
            </div>

            {/* Цветотип */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Цветотип *
              </label>
              <select
                value={selectedColorSeason}
                onChange={(e) => setSelectedColorSeason(e.target.value as ColorSeason)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {(Object.keys(COLOR_SEASON_LABELS) as ColorSeason[]).map((season) => (
                  <option key={season} value={season}>
                    {COLOR_SEASON_LABELS[season]}
                  </option>
                ))}
              </select>
            </div>

            {/* Кнопки */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '8px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--btn-radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                style={{
                  padding: '12px 24px',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--btn-radius)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Сгенерировать
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

