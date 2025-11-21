'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function InteractiveGirl() {
  const t = useTranslations('landing.shirt')
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null)

  const annotations = [
    {
      id: 1,
      icon: '🎨',
      title: t('annotation1.title'),
      text: t('annotation1.text'),
      area: { top: '5%', left: '35%', width: '18%', height: '12%' }, // Голова/лицо - Цветотип
      calloutPosition: { top: '3%', left: '-200px' },
      lineDirection: 'left',
    },
    {
      id: 2,
      icon: '⚡',
      title: t('annotation2.title'),
      text: t('annotation2.text'),
      area: { top: '20%', left: '30%', width: '22%', height: '18%' }, // Верхняя часть тела (куртка) - Контраст
      calloutPosition: { top: '20%', left: '-200px' },
      lineDirection: 'left',
    },
    {
      id: 3,
      icon: '👤',
      title: t('annotation3.title'),
      text: t('annotation3.text'),
      area: { top: '45%', left: '32%', width: '20%', height: '25%' }, // Талия и нижняя часть - Тип фигуры
      calloutPosition: { bottom: '15%', left: '-200px' },
      lineDirection: 'left',
    },
    {
      id: 4,
      icon: '👔',
      title: t('annotation4.title'),
      text: t('annotation4.text'),
      area: { top: '18%', right: '28%', width: '24%', height: '22%' }, // Куртка/рубашка на поясе - Стиль
      calloutPosition: { top: '12%', right: '-200px' },
      lineDirection: 'right',
    },
    {
      id: 5,
      icon: '🔥',
      title: t('annotation5.title'),
      text: t('annotation5.text'),
      area: { top: '38%', right: '25%', width: '28%', height: '18%' }, // Общий образ/сумка - Архетип
      calloutPosition: { top: '38%', right: '-200px' },
      lineDirection: 'right',
    },
  ]

  return (
    <div className="interactive-girl-container">
      <div className="girl-image-wrapper">
        <img 
          src="/foto/girl-style.png.png" 
          alt="Девушка с интерактивными аннотациями стиля"
          className="girl-image"
          onError={(e) => {
            console.error('Image not found:', e.currentTarget.src)
            // Fallback на другое изображение если основное не найдено
            if (!e.currentTarget.src.includes('landing-girl-mirror')) {
              e.currentTarget.src = '/foto/landing-girl-mirror.jpg'
            } else {
              e.currentTarget.style.display = 'none'
            }
          }}
        />
        
        {/* Interactive annotation areas */}
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`annotation-area ${activeAnnotation === annotation.id ? 'active' : ''}`}
            style={{
              top: annotation.area.top,
              left: annotation.area.left || 'auto',
              right: annotation.area.right || 'auto',
              width: annotation.area.width,
              height: annotation.area.height,
            }}
            onMouseEnter={() => setActiveAnnotation(annotation.id)}
            onMouseLeave={() => setActiveAnnotation(null)}
          >
            <div 
              className="annotation-dot"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            
            {activeAnnotation === annotation.id && (
              <>
                <div 
                  className={`annotation-callout annotation-${annotation.lineDirection}`}
                  style={{
                    top: annotation.calloutPosition.top || 'auto',
                    bottom: annotation.calloutPosition.bottom || 'auto',
                    left: annotation.calloutPosition.left || 'auto',
                    right: annotation.calloutPosition.right || 'auto',
                  }}
                >
                  <div className="annotation-icon">{annotation.icon}</div>
                  <div className="annotation-content">
                    <div className="annotation-title">{annotation.title}</div>
                    <div className="annotation-text">{annotation.text}</div>
                  </div>
                </div>
                <svg 
                  className={`annotation-line annotation-line-${annotation.lineDirection}`}
                  style={{
                    top: '50%',
                    left: annotation.lineDirection === 'left' ? '0' : 'auto',
                    right: annotation.lineDirection === 'right' ? '0' : 'auto',
                  }}
                >
                  <line
                    x1={annotation.lineDirection === 'left' ? '0' : '100%'}
                    y1="50%"
                    x2={annotation.lineDirection === 'left' ? '100%' : '0'}
                    y2="50%"
                    stroke="rgba(217, 70, 239, 0.8)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

