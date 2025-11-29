'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/lib/auth-context'
import { ThemeToggle } from '@/components/ThemeToggle'

interface Balance {
  amount: number
}

interface Notification {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

interface HeaderProps {
  balance?: Balance
  notifications?: Notification[]
}

export function Header({ balance, notifications = [] }: HeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length
    setUnreadCount(unread)
  }, [notifications])

  const handleLogout = async () => {
    await logout()
    router.push('/auth')
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Левая часть пустая или можно добавить навигацию */}
      </div>

      <div className="header-right">
        <div className="logo">
          <span className="logo-text">VIBELOOK</span>
          <span className="logo-subtitle">Seller</span>
        </div>
        
        {balance && (
          <div className="header-balance">
            <span className="balance-label">Баланс:</span>
            <span className="balance-amount">{balance.amount.toLocaleString('ru-RU')} ₽</span>
          </div>
        )}

        <ThemeToggle />

        <div className="header-notifications">
          <button
            className="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Уведомления"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <Badge variant="error" size="sm" className="notification-badge">
                {unreadCount}
              </Badge>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              {notifications.length === 0 ? (
                <div className="notification-empty">Нет уведомлений</div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  >
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="header-profile">
          <button 
            className="profile-button" 
            aria-label="Профиль"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            <div className="profile-avatar">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

