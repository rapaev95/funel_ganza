'use client'

import { Look, Archetype } from '@/types/look'
import { ARCHETYPE_LABELS, ARCHETYPE_ICONS } from '@/lib/look-dictionaries'

interface ArchetypesChecklistProps {
  looks: Look[]
  onGenerateLook?: (archetype: Archetype) => void
}

export function ArchetypesChecklist({ looks, onGenerateLook }: ArchetypesChecklistProps) {
  const archetypes: Archetype[] = [
    'rebel',
    'lover',
    'explorer',
    'creator',
    'ruler',
    'sage'
  ]

  const getStatus = (archetype: Archetype) => {
    const hasLook = looks.some(look => look.archetype === archetype)
    return hasLook ? 'completed' : 'missing'
  }

  return (
    <div className="archetypes-checklist" style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--card-radius)',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: 'var(--shadow-md)',
      backdropFilter: 'blur(10px)'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🎯 Архетипы:
      </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {archetypes.map((archetype) => {
          const status = getStatus(archetype)
          return (
            <div
              key={archetype}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '20px' }}>
                  {ARCHETYPE_ICONS[archetype]}
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {ARCHETYPE_LABELS[archetype]} — {status === 'completed' ? '✓' : '—'}
                </span>
              </div>
              
              {status === 'missing' && onGenerateLook && (
                <button
                  onClick={() => onGenerateLook(archetype)}
                  style={{
                    padding: '6px 16px',
                    background: 'var(--accent-gradient)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--btn-radius)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  ➕ Создать лук
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


