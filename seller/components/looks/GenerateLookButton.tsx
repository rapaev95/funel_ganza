'use client'

interface GenerateLookButtonProps {
  onClick: () => void
  fixed?: boolean
}

export function GenerateLookButton({ onClick, fixed = false }: GenerateLookButtonProps) {
  const buttonStyle: React.CSSProperties = {
    padding: '16px 32px',
    background: 'var(--accent-gradient)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--btn-radius)',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 12px rgba(255, 0, 128, 0.3)',
    ...(fixed && {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 100
    })
  }

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
    >
      Сгенерировать новый лук
    </button>
  )
}

