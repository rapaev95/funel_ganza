'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Look } from '@/types/look'
import { CTRTest } from '@/types/traffic'

interface TestCardProps {
  looks: Look[]
  activeTest?: CTRTest
  onCreateTest?: (lookIds: string[]) => void
}

export function TestCard({ looks, activeTest, onCreateTest }: TestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLooks, setSelectedLooks] = useState<string[]>([])

  const handleToggleLook = (lookId: string) => {
    setSelectedLooks(prev => {
      if (prev.includes(lookId)) {
        return prev.filter(id => id !== lookId)
      } else {
        if (prev.length >= 10) {
          return prev // Максимум 10 луков
        }
        return [...prev, lookId]
      }
    })
  }

  const handleStartTest = () => {
    if (selectedLooks.length >= 3 && selectedLooks.length <= 10) {
      onCreateTest?.(selectedLooks)
      setSelectedLooks([])
      setIsExpanded(false)
    }
  }

  const leaderLook = activeTest?.metrics?.leaderLookId
    ? looks.find(l => l.id === activeTest.metrics?.leaderLookId)
    : null

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--card-radius)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backdropFilter: 'blur(10px)'
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Заголовок карточки */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: isExpanded ? '20px' : '0'
        }}
      >
        <div
          style={{
            fontSize: '32px',
            lineHeight: 1
          }}
        >
          🔍
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}
          >
            Тест товаров
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              lineHeight: 1.5
            }}
          >
            Проверим, какие луки дают лучший CTR
          </p>
          {!isExpanded && (
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
              style={{
                marginTop: '8px'
              }}
            >
              ▶ Создать тест
            </Button>
          )}
        </div>
      </div>

      {/* Развернутое содержимое */}
      {isExpanded && (
        <div
          style={{
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '20px',
            marginTop: '20px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Активный тест - метрики */}
          {activeTest && activeTest.status === 'running' && activeTest.metrics && (
            <div
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}
              >
                Статус теста
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}
                  >
                    Показы
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {activeTest.metrics.impressions.toLocaleString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}
                  >
                    Клики
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {activeTest.metrics.clicks.toLocaleString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}
                  >
                    CTR
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {(activeTest.metrics.ctr * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              {leaderLook && (
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 0, 128, 0.1)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <strong>Лидер:</strong> {leaderLook.name}
                </div>
              )}
            </div>
          )}

          {/* Форма создания теста */}
          {(!activeTest || activeTest.status !== 'running') && (
            <div
              style={{
                marginBottom: '20px'
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px'
                }}
              >
                Выберите 3-10 луков для теста:
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {looks.length > 0 ? (
                  looks.map(look => {
                    const isSelected = selectedLooks.includes(look.id)
                    return (
                      <label
                        key={look.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px',
                          cursor: 'pointer',
                          borderRadius: 'var(--radius)',
                          background: isSelected ? 'rgba(255, 0, 128, 0.1)' : 'transparent',
                          border: isSelected ? '1px solid rgba(255, 0, 128, 0.3)' : '1px solid transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleLook(look.id)}
                          disabled={!isSelected && selectedLooks.length >= 10}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                            background: 'var(--glass-bg)',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={look.image}
                            alt={look.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            flex: 1
                          }}
                        >
                          {look.name}
                        </span>
                      </label>
                    )
                  })
                ) : (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      color: 'var(--text-secondary)',
                      fontSize: '14px'
                    }}
                  >
                    Нет доступных луков для теста
                  </div>
                )}
              </div>

              {selectedLooks.length > 0 && (
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Выбрано: {selectedLooks.length} {selectedLooks.length === 1 ? 'лук' : selectedLooks.length < 5 ? 'лука' : 'луков'}
                  {selectedLooks.length < 3 && ' (минимум 3)'}
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleStartTest}
                disabled={selectedLooks.length < 3 || selectedLooks.length > 10}
                style={{
                  width: '100%',
                  marginTop: '16px'
                }}
              >
                Запуск теста
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Статус */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--glass-border)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        {activeTest && activeTest.status === 'running' ? (
          <>
            Актуальный тест: {activeTest.lookIds.length} {activeTest.lookIds.length === 1 ? 'кандидат' : activeTest.lookIds.length < 5 ? 'кандидата' : 'кандидатов'}
            {leaderLook && `, лидер CTR — ${leaderLook.name}`}
          </>
        ) : (
          'Нет активных тестов'
        )}
      </div>
    </div>
  )
}


