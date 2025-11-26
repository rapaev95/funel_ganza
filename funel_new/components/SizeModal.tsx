'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

interface SizeModalProps {
  isOpen: boolean
  onClose: () => void
  currentParams: URLSearchParams
}

export function SizeModal({ isOpen, onClose, currentParams }: SizeModalProps) {
  const router = useRouter()
  const [height, setHeight] = useState(165)
  const [weight, setWeight] = useState(55)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleContinue = () => {
    // Создаем новые параметры URL с добавлением роста и веса
    const newParams = new URLSearchParams(currentParams)
    newParams.set('height', height.toString())
    newParams.set('weight', weight.toString())

    // Переходим на страницу магазина
    router.push(`/shop?${newParams.toString()}`)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(parseInt(e.target.value))
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(parseInt(e.target.value))
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div className="size-modal-overlay" onClick={handleOverlayClick}>
      <div className="size-modal" onClick={(e) => e.stopPropagation()}>
        <div className="size-modal-content">
          <h2 className="size-modal-title">Подбор размера</h2>
          
          <div className="size-modal-text">
            <p>
              Укажите ваш рост и вес, чтобы мы могли подобрать идеальный размер худи для вас.
            </p>
          </div>

          <div className="size-modal-fields">
            <div className="size-field">
              <div className="size-slider-header">
                <label htmlFor="height" className="size-label">
                  Рост (см)
                </label>
                <span className="size-value">{height}</span>
              </div>
              <div className="size-slider-container">
                <input
                  id="height"
                  type="range"
                  min="100"
                  max="250"
                  value={height}
                  onChange={handleHeightChange}
                  className="size-slider"
                  style={{
                    background: `linear-gradient(to right, 
                      #FF0080 0%, 
                      #7928CA ${((height - 100) / (250 - 100)) * 100}%, 
                      rgba(255, 255, 255, 0.1) ${((height - 100) / (250 - 100)) * 100}%, 
                      rgba(255, 255, 255, 0.1) 100%)`
                  }}
                />
                <div className="size-slider-labels">
                  <span>100</span>
                  <span>250</span>
                </div>
              </div>
            </div>

            <div className="size-field">
              <div className="size-slider-header">
                <label htmlFor="weight" className="size-label">
                  Вес (кг)
                </label>
                <span className="size-value">{weight}</span>
              </div>
              <div className="size-slider-container">
                <input
                  id="weight"
                  type="range"
                  min="30"
                  max="200"
                  value={weight}
                  onChange={handleWeightChange}
                  className="size-slider"
                  style={{
                    background: `linear-gradient(to right, 
                      #FF0080 0%, 
                      #7928CA ${((weight - 30) / (200 - 30)) * 100}%, 
                      rgba(255, 255, 255, 0.1) ${((weight - 30) / (200 - 30)) * 100}%, 
                      rgba(255, 255, 255, 0.1) 100%)`
                  }}
                />
                <div className="size-slider-labels">
                  <span>30</span>
                  <span>200</span>
                </div>
              </div>
            </div>
          </div>

          <div className="size-modal-buttons">
            <button
              onClick={handleContinue}
              className="btn-primary size-btn-continue"
            >
              Получить подборки луков
            </button>
            
            <button
              onClick={onClose}
              className="size-btn-cancel"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

