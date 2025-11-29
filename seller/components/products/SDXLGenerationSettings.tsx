'use client'

import { Card } from '@/components/ui/Card'
import { SDXLGenerationSettings as SDXLSettings } from '@/types/look-generation'
import { LookStyle, ColorSeason } from '@/types/look'
import { LOOK_STYLE_LABELS, COLOR_SEASON_LABELS } from '@/lib/look-dictionaries'

interface SDXLGenerationSettingsProps {
  settings: SDXLSettings
  onChange: (settings: SDXLSettings) => void
}

export function SDXLGenerationSettings({ settings, onChange }: SDXLGenerationSettingsProps) {
  const updateSetting = <K extends keyof SDXLSettings>(key: K, value: SDXLSettings[K]) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <Card title="Настройки генерации SDXL">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Промпт */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            Промпт для генерации *
          </label>
          <textarea
            value={settings.prompt}
            onChange={(e) => updateSetting('prompt', e.target.value)}
            placeholder="Опишите желаемый образ, стиль, настроение, цвета, детали..."
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)', 
            marginTop: '4px' 
          }}>
            Чем подробнее описание, тем лучше результат
          </div>
        </div>

        {/* Стиль и цветотип */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              Стиль лука
            </label>
            <select
              value={settings.style}
              onChange={(e) => updateSetting('style', e.target.value as LookStyle)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {(Object.keys(LOOK_STYLE_LABELS) as LookStyle[]).map((style) => (
                <option key={style} value={style}>
                  {LOOK_STYLE_LABELS[style]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px', 
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              Цветотип
            </label>
            <select
              value={settings.colorSeason}
              onChange={(e) => updateSetting('colorSeason', e.target.value as ColorSeason)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {(Object.keys(COLOR_SEASON_LABELS) as ColorSeason[]).map((season) => (
                <option key={season} value={season}>
                  {COLOR_SEASON_LABELS[season]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Параметры генерации */}
        <div style={{ 
          padding: '20px',
          background: 'var(--glass-bg)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            Параметры генерации
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Количество вариантов */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Количество вариантов
                </label>
                <span style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)' 
                }}>
                  {settings.numVariants}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.numVariants}
                onChange={(e) => updateSetting('numVariants', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--glass-border)',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Размер изображения */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Размер изображения
              </label>
              <select
                value={settings.imageSize}
                onChange={(e) => updateSetting('imageSize', e.target.value as '512x512' | '768x768' | '1024x1024')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="512x512">512x512</option>
                <option value="768x768">768x768</option>
                <option value="1024x1024">1024x1024</option>
              </select>
            </div>

            {/* Guidance Scale */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Guidance Scale
                </label>
                <span style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)' 
                }}>
                  {settings.guidanceScale}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={settings.guidanceScale}
                onChange={(e) => updateSetting('guidanceScale', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--glass-border)',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginTop: '4px' 
              }}>
                Контроль соответствия промпту (выше = строже)
              </div>
            </div>

            {/* Steps */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  Steps
                </label>
                <span style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)' 
                }}>
                  {settings.steps}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={settings.steps}
                onChange={(e) => updateSetting('steps', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--glass-border)',
                  borderRadius: '3px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)', 
                marginTop: '4px' 
              }}>
                Количество шагов генерации (больше = качественнее, но дольше)
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

