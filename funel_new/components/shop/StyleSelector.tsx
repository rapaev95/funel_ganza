'use client'

interface StyleSelectorProps {
  currentStyle?: 'streetwear'
  onStyleSelect?: (style: string) => void
}

type StyleType = 'streetwear' | 'casual' | 'classic' | 'sport' | 'elegant'

interface StyleCard {
  id: StyleType
  name: string
  icon: string
  available: boolean
}

const STYLES: StyleCard[] = [
  {
    id: 'streetwear',
    name: 'Streetwear',
    icon: '👕',
    available: true,
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: '👔',
    available: false,
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: '🎩',
    available: false,
  },
  {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    available: false,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    icon: '💎',
    available: false,
  },
]

export function StyleSelector({ currentStyle = 'streetwear', onStyleSelect }: StyleSelectorProps) {
  const handleCardClick = (style: StyleCard) => {
    if (style.available && onStyleSelect) {
      onStyleSelect(style.id)
    }
  }

  return (
    <div className="style-selector">
      <div className="style-cards-grid">
        {STYLES.map((style) => {
          const isActive = style.id === currentStyle && style.available
          const isLocked = !style.available

          return (
            <div className="style-card-wrapper">
              <div className="style-card-name">{style.name}</div>
              <div
                className={`style-card ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                onClick={() => handleCardClick(style)}
              >
                <div className="style-card-status-badge">
                  {style.available ? (
                    <span className="status-available">Доступно</span>
                  ) : (
                    <span className="status-coming">Скоро</span>
                  )}
                </div>
                <div className="style-card-icon-wrapper">
                  <div className="style-card-icon">{style.icon}</div>
                  {isLocked && <div className="style-card-lock-overlay">🔒</div>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

