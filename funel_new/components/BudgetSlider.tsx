'use client'

import { useState } from 'react'

interface BudgetSliderProps {
  value: number
  onChange: (value: number) => void
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
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
        title: 'Эконом',
        quantity: '5-7 вещей',
        duration: '1 сезон',
        description: 'Базовый гардероб с основными вещами',
        color: 'from-green-500 to-emerald-600',
      }
    } else if (val <= 66) {
      return {
        title: 'Стандарт',
        quantity: '10-12 вещей',
        duration: '2-4 сезона',
        description: 'Сбалансированный гардероб с акцентами',
        color: 'from-blue-500 to-cyan-600',
      }
    } else {
      return {
        title: 'Премиум',
        quantity: '15+ вещей',
        duration: '5-7 сезонов',
        description: 'Полный гардероб с премиум вещами',
        color: 'from-purple-500 to-pink-600',
      }
    }
  }

  const zoneData = getZoneData(localValue)

  return (
    <div className="budget-slider budget-slider-compact">
      <div className="slider-header">
        <h3>Какой у тебя бюджет на гардероб?</h3>
        <div className="slider-labels">
          <span className={localValue <= 33 ? 'active' : ''}>Эконом</span>
          <span className={localValue > 33 && localValue <= 66 ? 'active' : ''}>Стандарт</span>
          <span className={localValue > 66 ? 'active' : ''}>Премиум</span>
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
            <span className="metric-label">Количество</span>
            <span className="metric-value">{zoneData.quantity}</span>
          </div>
          <div className="metric">
            <span className="metric-icon">⏱️</span>
            <span className="metric-label">Срок службы</span>
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

