'use client'

import { useState } from 'react'

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  disabled?: boolean
}

export function ToggleSwitch({ enabled, onChange, label, disabled = false }: ToggleSwitchProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleToggle = () => {
    if (!disabled) {
      onChange(!enabled)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px'
      }}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '48px',
          height: '28px',
          borderRadius: '14px',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: enabled ? '#000000' : '#e5e5e5',
          transition: 'background-color 0.2s ease',
          padding: '2px',
          outline: 'none'
        }}
        aria-label={enabled ? 'Выключить' : 'Включить'}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: enabled ? '22px' : '2px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transition: 'left 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </button>
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '8px',
            padding: '6px 10px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {enabled ? 'Реклама активна' : 'Отключена'}
        </div>
      )}
      {label && (
        <span
          style={{
            fontSize: '12px',
            color: enabled ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: enabled ? 600 : 400
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}


