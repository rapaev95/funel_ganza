'use client'

import { useEffect, useState } from 'react'
import { CompatibilityMeter } from './CompatibilityMeter'

interface BrandSearchAnimationProps {
  onComplete: () => void
  duration?: number // в миллисекундах
  archetype?: string
}

interface SearchFactor {
  id: string
  label: string
  completed: boolean
}

export function BrandSearchAnimation({ onComplete, duration = 3500, archetype }: BrandSearchAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [compatibilityPercentage, setCompatibilityPercentage] = useState(96)

  const factors: SearchFactor[] = [
    { id: 'budget', label: 'Ценовой бюджет', completed: false },
    { id: 'sizes', label: 'Доступность размеров', completed: false },
    { id: 'color', label: 'Соответствие цветотипу', completed: false },
    { id: 'archetype', label: 'Соответствие архетипу', completed: false },
    { id: 'delivery', label: 'Доставка в регион', completed: false },
  ]

  useEffect(() => {
    // Генерируем случайный процент от 91 до 98
    const randomPercentage = Math.floor(Math.random() * (98 - 91 + 1)) + 91
    setCompatibilityPercentage(randomPercentage)

    const steps = factors.length
    const stepDuration = duration / steps
    const progressStep = 100 / steps

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps) {
          setProgress((prev + 1) * progressStep)
          return prev + 1
        }
        return prev
      })
    }, stepDuration)

    // Показываем блок совместимости за 0.5 секунды до завершения
    const compatibilityTimeout = setTimeout(() => {
      setShowCompatibility(true)
    }, duration - 500)

    let modalCloseTimeout: NodeJS.Timeout | null = null

    // После завершения анимации показываем финальное окно
    const animationCompleteTimeout = setTimeout(() => {
      clearInterval(interval)
      setShowResultModal(true)
      
      // Через 2 секунды закрываем окно и вызываем onComplete
      modalCloseTimeout = setTimeout(() => {
        setShowResultModal(false)
        onComplete()
      }, 2000)
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(animationCompleteTimeout)
      clearTimeout(compatibilityTimeout)
      if (modalCloseTimeout) {
        clearTimeout(modalCloseTimeout)
      }
    }
  }, [duration, onComplete])

  return (
    <div className="brand-search-animation">
      <div className="brand-search-content">
        <h2 className="brand-search-title">Подбираем лучшие бренды для вас...</h2>
        
        <div className="brand-search-progress">
          <div className="brand-search-progress-bar">
            <div 
              className="brand-search-progress-fill"
              style={{ width: `${progress}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </div>
          <span className="brand-search-progress-text">{Math.round(progress)}%</span>
        </div>

        <div className="brand-search-factors">
          {factors.map((factor, index) => {
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            const isVisible = index <= currentStep

            return (
              <div
                key={factor.id}
                className={`brand-search-factor ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isVisible ? 'visible' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="brand-search-factor-icon">
                  {isCompleted ? '✓' : isActive ? '●' : '○'}
                </div>
                <span className="brand-search-factor-label">{factor.label}</span>
              </div>
            )
          })}
        </div>

        {showCompatibility && archetype && (
          <div className="brand-search-compatibility">
            <CompatibilityMeter 
              percentage={compatibilityPercentage}
              archetype={archetype}
            />
          </div>
        )}

        {showResultModal && (
          <div className="brand-search-result-modal">
            <div className="brand-search-result-content">
              <div className="brand-search-result-icon">✨</div>
              <h3 className="brand-search-result-title">
                Найдены бренды которые на {compatibilityPercentage}% подходят вашему типу
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

