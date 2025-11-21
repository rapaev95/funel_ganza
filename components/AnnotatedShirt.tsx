'use client'

import { useTranslations } from 'next-intl'

export function AnnotatedShirt() {
  const t = useTranslations('landing.shirt')

  const annotations = [
    {
      id: 1,
      icon: '🎨',
      title: t('annotation1.title'),
      text: t('annotation1.text'),
      calloutPosition: { top: '5%', left: '-220px' },
      dotPosition: { top: '15%', left: '30%' },
      lineDirection: 'left',
    },
    {
      id: 2,
      icon: '⚡',
      title: t('annotation2.title'),
      text: t('annotation2.text'),
      calloutPosition: { top: '35%', left: '-220px' },
      dotPosition: { top: '40%', left: '25%' },
      lineDirection: 'left',
    },
    {
      id: 3,
      icon: '👤',
      title: t('annotation3.title'),
      text: t('annotation3.text'),
      calloutPosition: { bottom: '15%', left: '-220px' },
      dotPosition: { top: '70%', left: '30%' },
      lineDirection: 'left',
    },
    {
      id: 4,
      icon: '👔',
      title: t('annotation4.title'),
      text: t('annotation4.text'),
      calloutPosition: { top: '10%', right: '-220px' },
      dotPosition: { top: '25%', right: '25%' },
      lineDirection: 'right',
    },
    {
      id: 5,
      icon: '🔥',
      title: t('annotation5.title'),
      text: t('annotation5.text'),
      calloutPosition: { top: '50%', right: '-220px' },
      dotPosition: { top: '55%', right: '30%' },
      lineDirection: 'right',
    },
  ]

  return (
    <div className="annotated-girl-container">
      <div className="girl-image-wrapper">
        <img 
          src="/foto/landing-girl-mirror.jpg" 
          alt="Девушка с аннотациями стиля"
          className="girl-image"
          onError={(e) => {
            // Fallback если изображение не найдено
            e.currentTarget.style.display = 'none'
          }}
        />
        
        {/* Annotation dots and lines */}
        {annotations.map((annotation) => (
          <div key={annotation.id} className="annotation-wrapper">
            <div 
              className="annotation-dot"
              style={{
                top: annotation.dotPosition.top,
                left: annotation.dotPosition.left || 'auto',
                right: annotation.dotPosition.right || 'auto',
              }}
            />
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
                top: annotation.dotPosition.top,
                left: annotation.dotPosition.left || 'auto',
                right: annotation.dotPosition.right || 'auto',
              }}
            >
              <line
                x1={annotation.lineDirection === 'left' ? '0' : '100%'}
                y1="50%"
                x2={annotation.lineDirection === 'left' ? '100%' : '0'}
                y2="50%"
                stroke="rgba(217, 70, 239, 0.6)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}

