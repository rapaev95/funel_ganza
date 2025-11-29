'use client'

import { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

// Sample данные для header
const sampleBalance = {
  amount: 125000
}

const sampleNotifications: Array<{
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}> = [
  {
    id: '1',
    title: 'Новый заказ',
    message: 'Получен новый заказ на сумму 5 000 ₽',
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Кампания запущена',
    message: 'Рекламная кампания "Летняя коллекция" успешно запущена',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Header balance={sampleBalance} notifications={sampleNotifications} />
      <Sidebar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  )
}

