import { ReactNode } from 'react'

export const metadata = {
  title: 'VIBELOOK AI Stylist',
  description: 'Персональный AI-стилист для подбора образов',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

