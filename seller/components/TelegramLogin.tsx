'use client'

import { useState, useEffect, useRef } from 'react'
import { TelegramUser } from '@/app/layout'

interface TelegramLoginProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function TelegramLogin({ onSuccess, onError }: TelegramLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME || 'vibelook_bot'
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Определяем глобальную функцию ДО загрузки скрипта
    // Это важно - функция должна быть доступна когда скрипт виджета загрузится
    ;(window as any).onTelegramAuth = async (user: TelegramUser) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Ошибка авторизации')
        }

        onSuccess()
      } catch (error: any) {
        const errorMessage = error.message || 'Произошла ошибка при авторизации'
        setError(errorMessage)
        onError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    return () => {
      // Очищаем глобальную функцию при размонтировании
      delete (window as any).onTelegramAuth
    }
  }, [onSuccess, onError])

  useEffect(() => {
    // Загружаем скрипт только один раз
    if (scriptLoadedRef.current || typeof window === 'undefined') return

    // Проверяем, не загружен ли скрипт уже
    const existingScript = document.querySelector('script[src="https://telegram.org/js/telegram-widget.js?22"]')
    if (existingScript) {
      scriptLoadedRef.current = true
      setScriptLoaded(true)
      // Небольшая задержка для гарантии, что скрипт полностью загружен
      setTimeout(() => {
        initWidget()
      }, 100)
      return
    }

    // Загружаем скрипт
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.onload = () => {
      scriptLoadedRef.current = true
      setScriptLoaded(true)
      // Небольшая задержка для гарантии, что скрипт полностью загружен
      setTimeout(() => {
        initWidget()
      }, 100)
    }
    script.onerror = () => {
      setError('Не удалось загрузить скрипт Telegram Widget')
      console.error('Failed to load Telegram Widget script')
    }
    document.body.appendChild(script)

    return () => {
      // Не удаляем скрипт при размонтировании, так как он может использоваться другими компонентами
    }
  }, [])

  const initWidget = () => {
    if (!widgetRef.current || !scriptLoadedRef.current) {
      console.log('Widget init skipped:', { 
        hasRef: !!widgetRef.current, 
        scriptLoaded: scriptLoadedRef.current 
      })
      return
    }

    // Очищаем предыдущий виджет
    widgetRef.current.innerHTML = ''

    // Создаем скрипт для Telegram Widget согласно документации
    const widget = document.createElement('script')
    widget.async = true
    widget.src = 'https://telegram.org/js/telegram-widget.js?22'
    widget.setAttribute('data-telegram-login', botUsername)
    widget.setAttribute('data-size', 'large')
    widget.setAttribute('data-onauth', 'onTelegramAuth(user)')
    widget.setAttribute('data-request-access', 'write')

    // Обработка ошибок виджета
    widget.onerror = () => {
      console.error('Telegram Widget script error')
      setError('Ошибка загрузки виджета Telegram. Проверьте, что домен добавлен в BotFather.')
    }

    widgetRef.current.appendChild(widget)

    // Диагностика
    console.log('Telegram Widget script element created:', {
      botUsername,
      currentDomain: window.location.hostname,
      widgetElement: widget,
      container: widgetRef.current
    })

    // Проверяем через небольшую задержку, загрузился ли виджет
    setTimeout(() => {
      const widgetButton = widgetRef.current?.querySelector('iframe, a[href*="telegram.org"]')
      if (!widgetButton) {
        console.warn('Telegram Widget button not found after initialization')
        setError('Виджет не отображается. Убедитесь, что домен "localhost" добавлен в BotFather через команду /setdomain')
      } else {
        console.log('Telegram Widget button found:', widgetButton)
      }
    }, 1000)
  }

  // Инициализируем виджет когда скрипт загружен и botUsername доступен
  useEffect(() => {
    if (scriptLoaded && widgetRef.current) {
      initWidget()
    }
  }, [scriptLoaded, botUsername])

  return (
    <div>
      {/* Контейнер для виджета */}
      <div 
        ref={widgetRef}
        style={{ 
          minHeight: '40px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        {!scriptLoaded && !isLoading && (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Загрузка виджета Telegram...
          </div>
        )}
      </div>
      
      {/* Сообщение об ошибке */}
      {error && (
        <div className="auth-error" style={{ marginTop: '16px' }}>
          {error}
          {error.includes('domain') && (
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              Убедитесь, что домен <strong>{window.location.hostname}</strong> добавлен в BotFather через команду <code>/setdomain</code>
            </div>
          )}
        </div>
      )}
      
      {/* Индикатор загрузки при авторизации */}
      {isLoading && (
        <div className="auth-loading" style={{ marginTop: '16px' }}>
          <div className="spinner"></div>
          <span>Авторизация...</span>
        </div>
      )}

      {/* Диагностическая информация (только в development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f3f4f6', 
          borderRadius: '8px', 
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <strong>Диагностика:</strong>
          <br />
          Bot Username: {botUsername}
          <br />
          Current Domain: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}
          <br />
          Script Loaded: {scriptLoaded ? 'Да' : 'Нет'}
          <br />
          Widget Container: {widgetRef.current ? 'Есть' : 'Нет'}
          <br />
          {widgetRef.current && (
            <>
              Widget Content: {widgetRef.current.innerHTML ? 'Есть' : 'Пусто'}
              <br />
              Widget Children: {widgetRef.current.children.length}
            </>
          )}
          <br />
          <br />
          <strong>Инструкция:</strong>
          <br />
          1. Откройте @BotFather в Telegram
          <br />
          2. Отправьте команду <code>/setdomain</code>
          <br />
          3. Выберите бота <strong>{botUsername}</strong>
          <br />
          4. Введите домен: <strong>localhost</strong>
          <br />
          5. Перезагрузите страницу
        </div>
      )}
    </div>
  )
}

