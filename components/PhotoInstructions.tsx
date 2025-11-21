'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function PhotoInstructions() {
  const t = useTranslations()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="photo-instructions">
      <div 
        className="instructions-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{t('instructions.title')}</h3>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="instructions-content">
          <div className="instruction-item">
            <strong>{t('instructions.goodLighting')}</strong>
            <span>{t('instructions.goodLightingDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.noFilters')}</strong>
            <span>{t('instructions.noFiltersDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.clearPhoto')}</strong>
            <span>{t('instructions.clearPhotoDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.neutralBackground')}</strong>
            <span>{t('instructions.neutralBackgroundDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.noMakeup')}</strong>
            <span>{t('instructions.noMakeupDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.directLook')}</strong>
            <span>{t('instructions.directLookDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.selfie')}</strong>
            <span>{t('instructions.selfieDesc')}</span>
          </div>
          <div className="instruction-item">
            <strong>{t('instructions.fullBody')}</strong>
            <span>{t('instructions.fullBodyDesc')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

