'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const t = useTranslations('budget')
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    setLocalValue(newValue)
    onChange(newValue)
  }

  // Определяем зону и данные
  const getZoneData = (val: number) => {
    if (val <= 33) {
      return {
        title: t('zone1.title'),
        quantity: t('zone1.quantity'),
        duration: t('zone1.duration'),
        description: t('zone1.description'),
        color: 'from-green-500 to-emerald-600',
      }
    } else if (val <= 66) {
      return {
        title: t('zone2.title'),
        quantity: t('zone2.quantity'),
        duration: t('zone2.duration'),
        description: t('zone2.description'),
        color: 'from-blue-500 to-cyan-600',
      }
    } else {
      return {
        title: t('zone3.title'),
        quantity: t('zone3.quantity'),
        duration: t('zone3.duration'),
        description: t('zone3.description'),
        color: 'from-purple-500 to-pink-600',
      }
    }
  }

  const zoneData = getZoneData(localValue)

  return (
    <div className="budget-slider budget-slider-compact">
      <div className="slider-header">
        <h3>{t('question')}</h3>
        <div className="slider-labels">
          <span className={localValue <= 33 ? 'active' : ''}>{t('zone1.short')}</span>
          <span className={localValue > 33 && localValue <= 66 ? 'active' : ''}>{t('zone2.short')}</span>
          <span className={localValue > 66 ? 'active' : ''}>{t('zone3.short')}</span>
        </div>
      </div>

      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={localValue}
          onChange={handleChange}
          className="slider-input"
          style={{
            background: `linear-gradient(to right, 
              ${localValue <= 33 ? '#10b981' : localValue <= 66 ? '#3b82f6' : '#a855f7'} 0%, 
              ${localValue <= 33 ? '#059669' : localValue <= 66 ? '#0284c7' : '#9333ea'} ${localValue}%, 
              rgba(255, 255, 255, 0.1) ${localValue}%, 
              rgba(255, 255, 255, 0.1) 100%)`
          }}
        />
      </div>

      <div className={`slider-info slider-info-compact ${zoneData.color}`}>
        <div className="info-header">
          <h4>{zoneData.title}</h4>
        </div>
        <div className="info-metrics">
          <div className="metric">
            <span className="metric-icon">📦</span>
            <span className="metric-label">{t('quantity')}</span>
            <span className="metric-value">{zoneData.quantity}</span>
          </div>
          <div className="metric">
            <span className="metric-icon">⏱️</span>
            <span className="metric-label">{t('duration')}</span>
            <span className="metric-value">{zoneData.duration}</span>
          </div>
        </div>
        <div className="info-description">
          <p>{zoneData.description}</p>
        </div>
      </div>
    </div>
  )
}

