'use client'

import { Look, UsageContext } from '@/types/look'
import { USAGE_CONTEXT_LABELS, USAGE_CONTEXT_ICONS, USAGE_CONTEXT_MIN_REQUIREMENTS } from '@/lib/look-dictionaries'

interface UsageContextsChecklistProps {
  looks: Look[]
  onGenerateLook?: (context: UsageContext) => void
}

export function UsageContextsChecklist({ looks, onGenerateLook }: UsageContextsChecklistProps) {
  const usageContexts: UsageContext[] = ['work', 'home', 'sport', 'evening', 'casual', 'beach', 'street']

  const getContextStatus = (context: UsageContext) => {
    const count = looks.filter(look => look.usage_contexts.includes(context)).length
    const minRequired = USAGE_CONTEXT_MIN_REQUIREMENTS[context]
    
    if (count === 0) {
      return { status: 'missing', label: 'потеря аудитории', color: '#ef4444' }
    } else if (count < minRequired) {
      return { status: 'low', label: 'рекомендуется', color: '#f59e0b' }
    } else if (count === minRequired) {
      return { status: 'good', label: 'хорошо', color: '#10b981' }
    } else {
      return { status: 'excellent', label: 'отлично', color: '#10b981' }
    }
  }

  return (
    <div className="usage-contexts-checklist" style={{
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
        marginBottom: '16px'
      }}>
        Где носить?
      </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {usageContexts.map((context) => {
          const count = looks.filter(look => look.usage_contexts.includes(context)).length
          const minRequired = USAGE_CONTEXT_MIN_REQUIREMENTS[context]
          const { status, label, color } = getContextStatus(context)
          
          return (
            <div
              key={context}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: status === 'missing' ? 'rgba(239, 68, 68, 0.15)' : status === 'low' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${status === 'missing' ? 'rgba(239, 68, 68, 0.3)' : status === 'low' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: 1
              }}>
                <span style={{ fontSize: '20px' }}>
                  {USAGE_CONTEXT_ICONS[context]}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    {USAGE_CONTEXT_LABELS[context]} — {count}/{minRequired} луков
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: color,
                    fontWeight: 600
                  }}>
                    {label}
                  </div>
                </div>
              </div>
              
              {status !== 'excellent' && onGenerateLook && (
                <button
                  onClick={() => onGenerateLook(context)}
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
                  ➕ Создать
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

