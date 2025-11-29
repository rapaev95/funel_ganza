'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TelegramLogin } from '@/components/TelegramLogin'
import { DevLogin } from '@/components/DevLogin'
import { useAuth } from '@/lib/auth-context'

export default function AuthPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  // Определяем, находимся ли мы в режиме разработки
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  
  // Используем dev login только в development и на localhost
  const useDevLogin = isDevelopment && isLocalhost

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на dashboard
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  const handleAuthSuccess = () => {
    // После успешной авторизации перенаправляем на dashboard
    router.push('/dashboard')
  }

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-loading">
            <div className="spinner"></div>
            <span>Загрузка...</span>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Перенаправление происходит в useEffect
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Vibelook</h1>
          <p>Кабинет селлера</p>
        </div>

        <p className="auth-description">
          {useDevLogin 
            ? 'Войдите в систему для доступа к панели управления товарами и кампаниями.'
            : 'Войдите в свой аккаунт через Telegram для доступа к панели управления товарами и кампаниями.'
          }
        </p>

        {useDevLogin ? (
          <DevLogin
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        ) : (
          <TelegramLogin
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
        )}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="auth-footer">
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </div>
  )
}
