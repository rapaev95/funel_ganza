'use client'

import { useState } from 'react'

export function PhotoInstructions() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="photo-instructions">
      <div 
        className="instructions-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>Как сделать хорошее фото</h3>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="instructions-content">
          <div className="instruction-item">
            <strong>Хорошее освещение</strong>
            <span>Снимай при естественном свете, лицом к окну</span>
          </div>
          <div className="instruction-item">
            <strong>Без фильтров</strong>
            <span>Используй оригинальное фото без обработки</span>
          </div>
          <div className="instruction-item">
            <strong>Четкое фото</strong>
            <span>Убедись, что фото не размытое</span>
          </div>
          <div className="instruction-item">
            <strong>Нейтральный фон</strong>
            <span>Лучше всего однотонный светлый фон</span>
          </div>
          <div className="instruction-item">
            <strong>Без макияжа</strong>
            <span>Для селфи лучше без макияжа или минимальный</span>
          </div>
          <div className="instruction-item">
            <strong>Прямой взгляд</strong>
            <span>Смотри прямо в камеру</span>
          </div>
          <div className="instruction-item">
            <strong>Селфи</strong>
            <span>Лицо крупным планом, хорошо видно черты</span>
          </div>
          <div className="instruction-item">
            <strong>В полный рост</strong>
            <span>Видно всю фигуру, в облегающей одежде</span>
          </div>
        </div>
      )}
    </div>
  )
}
