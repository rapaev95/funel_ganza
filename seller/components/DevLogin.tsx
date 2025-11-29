'use client'

import { useState } from 'react'

interface DevLoginProps {
  onSuccess: (userData: { id: number; first_name: string; username?: string }) => void
  onError: (error: string) => void
}

export function DevLogin({ onSuccess, onError }: DevLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')

  const handleLogin = async () => {
    if (!name.trim()) {
      onError('Введите имя')
      return
    }

    setIsLoading(true)
    try {
      // Создаем тестового пользователя для локальной разработки
      const devUser = {
        id: 999999999, // Тестовый ID
        first_name: name.trim(),
        last_name: '',
        username: `dev_${name.toLowerCase().replace(/\s+/g, '_')}`,
        photo_url: '',
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'dev_hash_' + Date.now(), // Тестовая подпись
      }

      const response = await fetch('/api/auth/dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(devUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Ошибка авторизации')
      }

      onSuccess(devUser)
    } catch (error: any) {
      onError(error.message || 'Произошла ошибка при авторизации')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div style={{ 
        padding: '16px', 
        background: '#fef3c7', 
        border: '1px solid #fbbf24', 
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <strong style={{ color: '#92400e' }}>⚠️ Режим разработки</strong>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#78350f' }}>
          Для локальной разработки используется упрощенный вход без Telegram
        </p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: 500,
          color: 'var(--text-primary)'
        }}>
          Введите ваше имя:
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Например: Иван"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoading || !name.trim()}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: isLoading || !name.trim() ? '#9ca3af' : 'var(--primary-color)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: isLoading || !name.trim() ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </div>
  )
}


